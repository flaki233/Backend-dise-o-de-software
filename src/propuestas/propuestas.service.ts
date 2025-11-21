import { Injectable, BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import { RobleService } from '../roble/roble.service';
import { CreatePropuestaDto } from './dtos/create-propuesta.dto';
import { PropuestaDecisionDto } from './dtos/decision.dto';

type Estado = 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA' | 'CANCELADA';

type Propuesta = {
  _id: string;
  proposerId: string;
  responderId: string;
  ofertaAId: string;
  ofertaBId: string;
  estado: Estado;
  mensaje?: string;
  createdAt: string;
  updatedAt: string;
};

type Evento = {
  _id: string;
  propuestaId: string;
  actorId: string;
  tipo: 'CREADA' | 'DECISION' | 'CANCELADA';
  payload?: any;
  createdAt: string;
};

// ===== MOCK EN MEMORIA PARA DEV =====
const MEM_PROPS: Propuesta[] = [];
const MEM_EVENTS: Evento[] = [];

function nowISO() {
  return new Date().toISOString();
}

@Injectable()
export class PropuestasService {
  constructor(private readonly roble: RobleService) {}

  // Crea tabla en ROBLE si aún no existe (opcional para 1a vez)
  private async ensureTables() {
    if (process.env.MOCK_ROBLE === 'true') return;

    try {
      const tablas = await this.roble.listTables();
      const names = (tablas.tables ?? tablas).map(
        (t: any) => t.tableName ?? t.name,
      );

      if (!names.includes('PropuestaTrueque')) {
        await this.roble.createTable({
          tableName: 'PropuestaTrueque',
          description: 'Propuestas de trueque (orquestación)',
          columns: [
            { name: 'proposerId', type: 'varchar' },
            { name: 'responderId', type: 'varchar' },
            { name: 'ofertaAId', type: 'varchar' },
            { name: 'ofertaBId', type: 'varchar' },
            { name: 'estado', type: 'varchar' },
            { name: 'mensaje', type: 'text', isNullable: true },
            { name: 'createdAt', type: 'timestamptz' },
            { name: 'updatedAt', type: 'timestamptz' },
          ],
        });
      }

      if (!names.includes('PropuestaEvento')) {
        await this.roble.createTable({
          tableName: 'PropuestaEvento',
          description: 'Auditoría de propuestas',
          columns: [
            { name: 'propuestaId', type: 'varchar' },
            { name: 'actorId', type: 'varchar' },
            { name: 'tipo', type: 'varchar' },
            { name: 'payload', type: 'json', isNullable: true },
            { name: 'createdAt', type: 'timestamptz' },
          ],
        });
      }
    } catch (e: any) {
      // seguimos sin bloquear; el insert fallará con 503 si no hay permisos
      console.warn('ensureTables warning:', e?.message ?? e);
    }
  }

  private genId(prefix: string) {
    return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
  }

  private async audit(
    propuestaId: string,
    actorId: string,
    tipo: Evento['tipo'],
    payload?: any,
  ) {
    const base = {
      propuestaId,
      actorId,
      tipo,
      payload, // JSON directo
      createdAt: nowISO(),
    };

    if (process.env.MOCK_ROBLE === 'true') {
      const evento: Evento = { _id: this.genId('evt'), ...base };
      MEM_EVENTS.push(evento);
      return evento;
    }

    try {
      // ROBLE genera _id automáticamente
      const inserted = await this.roble.insertRecord('PropuestaEvento', base);
      return inserted as Evento;
    } catch (e: any) {
      throw new ServiceUnavailableException(
        `No se pudo registrar auditoría en ROBLE: ${e?.message ?? e}`,
      );
    }
  }

  // ---------- API pública ----------

  async create(dto: CreatePropuestaDto) {
    await this.ensureTables();
    const now = nowISO();

    const base = {
      proposerId: dto.proposerId,
      responderId: dto.responderId,
      ofertaAId: dto.ofertaAId,
      ofertaBId: dto.ofertaBId,
      estado: 'PENDIENTE' as Estado,
      mensaje: dto.mensaje,
      createdAt: now,
      updatedAt: now,
    };

    let propuesta: Propuesta;

    if (process.env.MOCK_ROBLE === 'true') {
      // En mock generamos _id manualmente y guardamos en memoria
      propuesta = { _id: this.genId('prop'), ...base };
      MEM_PROPS.push(propuesta);
    } else {
      try {
        // En ROBLE real NO mandamos _id, lo genera la BD
        const inserted = await this.roble.insertRecord(
          'PropuestaTrueque',
          base,
        );
        propuesta = inserted as Propuesta;
      } catch (e: any) {
        throw new ServiceUnavailableException(
          `No se pudo crear la propuesta en ROBLE: ${e?.message ?? e}`,
        );
      }
    }

    await this.audit(propuesta._id, dto.proposerId, 'CREADA', { dto });
    return propuesta;
  }

  async getOne(id: string) {
    if (process.env.MOCK_ROBLE === 'true') {
      const p = MEM_PROPS.find((x) => x._id === id);
      if (!p) throw new BadRequestException('Propuesta no encontrada');
      return p;
    }
    try {
      const r = await this.roble.getRecords('PropuestaTrueque', { _id: id });
      const p = r.records?.[0] ?? r[0];
      if (!p) throw new BadRequestException('Propuesta no encontrada');
      return p;
    } catch (e: any) {
      throw new ServiceUnavailableException(
        `No se pudo consultar ROBLE: ${e?.message ?? e}`,
      );
    }
  }

  async decide(id: string, dto: PropuestaDecisionDto) {
    const current = await this.getOne(id);
    if (current.estado !== 'PENDIENTE') {
      throw new BadRequestException(
        `La propuesta ya está en estado ${current.estado}`,
      );
    }

    // solo el responder puede aceptar/rechazar; si quieres permitir cualquiera, quita esta restricción
    if (dto.actorId !== current.responderId) {
      throw new BadRequestException(
        'Solo el receptor puede tomar la decisión',
      );
    }

    const nuevoEstado: Estado =
      dto.decision === 'aceptar' ? 'ACEPTADA' : 'RECHAZADA';
    const updates = { estado: nuevoEstado, updatedAt: nowISO() };

    if (process.env.MOCK_ROBLE === 'true') {
      const idx = MEM_PROPS.findIndex((x) => x._id === id);
      MEM_PROPS[idx] = { ...MEM_PROPS[idx], ...updates };
    } else {
      try {
        await this.roble.updateRecord('PropuestaTrueque', id, updates);
      } catch (e: any) {
        throw new ServiceUnavailableException(
          `No se pudo actualizar en ROBLE: ${e?.message ?? e}`,
        );
      }
    }

    await this.audit(id, dto.actorId, 'DECISION', { decision: dto.decision });
    return { propuestaId: id, estado: nuevoEstado };
  }

  async cancel(id: string, actorId: string) {
    const current = await this.getOne(id);
    if (current.estado !== 'PENDIENTE') {
      throw new BadRequestException(
        `No se puede cancelar: estado ${current.estado}`,
      );
    }
    const updates = { estado: 'CANCELADA' as Estado, updatedAt: nowISO() };

    if (process.env.MOCK_ROBLE === 'true') {
      const idx = MEM_PROPS.findIndex((x) => x._id === id);
      MEM_PROPS[idx] = { ...MEM_PROPS[idx], ...updates };
    } else {
      try {
        await this.roble.updateRecord('PropuestaTrueque', id, updates);
      } catch (e: any) {
        throw new ServiceUnavailableException(
          `No se pudo cancelar en ROBLE: ${e?.message ?? e}`,
        );
      }
    }

    await this.audit(id, actorId, 'CANCELADA');
    return { propuestaId: id, estado: 'CANCELADA' };
  }

  async auditTrail(id: string) {
    if (process.env.MOCK_ROBLE === 'true') {
      return MEM_EVENTS.filter((e) => e.propuestaId === id).sort((a, b) =>
        a.createdAt.localeCompare(b.createdAt),
      );
    }
    try {
      const r = await this.roble.getRecords('PropuestaEvento', {
        propuestaId: id,
      });
      const events = r.records ?? r ?? [];
      return events.sort((a: any, b: any) =>
        a.createdAt.localeCompare(b.createdAt),
      );
    } catch (e: any) {
      throw new ServiceUnavailableException(
        `No se pudo obtener auditoría: ${e?.message ?? e}`,
      );
    }
  }
}
