import { Injectable } from '@nestjs/common';
import { RobleService } from '../roble/roble.service';
import { CreateMatchAuditDto } from './dtos/create-match-audit.dto';
import { ListMatchAuditQueryDto } from './dtos/list-match-audit.query.dto';

// Nombre de tabla en ROBLE
const TABLE = 'matchaudit';

function nowISO() {
  return new Date().toISOString();
}
function genId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

@Injectable()
export class MatchAuditService {
  constructor(private roble: RobleService) {}

  async create(dto: CreateMatchAuditDto) {
    const base = {
      createdAt: nowISO(),
      ...dto, // action, statusAfter, actorUserId, actorIp, proposerOfferId, responderOfferId, score, correlationId, payload, externalRef
    };

    // 🔁 En MOCK no usamos ROBLE, devolvemos un registro con _id en memoria
    if (process.env.MOCK_ROBLE === 'true') {
      return { _id: genId('match'), ...base };
    }

    // 🔁 En ROBLE real NO mandamos _id, lo genera la BD
    const inserted = await this.roble.insertRecord(TABLE, base);
    return inserted;
  }

  // Listado con filtros y paginación (filtra en memoria)
  async list(q: ListMatchAuditQueryDto) {
    const page = q.page ?? 1;
    const pageSize = Math.min(q.pageSize ?? 20, 100);

    const res = await this.roble.getRecords(TABLE);
    const records = ((res as any).records ?? res ?? []) as any[];

    const filtered = records
      .filter((r) => {
        if (q.actorUserId && r.actorUserId !== q.actorUserId) return false;
        if (q.proposerOfferId && r.proposerOfferId !== q.proposerOfferId) return false;
        if (q.responderOfferId && r.responderOfferId !== q.responderOfferId) return false;
        if (q.action && r.action !== q.action) return false;
        if (q.statusAfter && r.statusAfter !== q.statusAfter) return false;
        if (q.correlationId && r.correlationId !== q.correlationId) return false;
        if (q.from && new Date(r.createdAt) < new Date(q.from)) return false;
        if (q.to && new Date(r.createdAt) > new Date(q.to)) return false;
        return true;
      })
      .sort(
        (a, b) =>
          +new Date(b.createdAt as string) - +new Date(a.createdAt as string),
      );

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return {
      data: items,
      meta: { total, page, pageSize, pageCount: Math.ceil(total / pageSize) },
    };
  }

  async get(id: string) {
    const res = await this.roble.getRecords(TABLE, { _id: id });
    const records = ((res as any).records ?? res ?? []) as any[];
    return records[0] ?? null;
  }

  // KPIs rápidos
  async stats(q: { from?: string; to?: string; correlationId?: string }) {
    const res = await this.roble.getRecords(TABLE);
    const records = ((res as any).records ?? res ?? []) as any[];

    const filtered = records.filter((r) => {
      if (q.correlationId && r.correlationId !== q.correlationId) return false;
      if (q.from && new Date(r.createdAt) < new Date(q.from)) return false;
      if (q.to && new Date(r.createdAt) > new Date(q.to)) return false;
      return true;
    });

    const total = filtered.length;
    const proposed = filtered.filter((r) => r.action === 'PROPOSE').length;
    const accepted = filtered.filter((r) => r.statusAfter === 'ACCEPTED').length;
    const rejected = filtered.filter((r) => r.statusAfter === 'REJECTED').length;
    const cancelled = filtered.filter((r) => r.statusAfter === 'CANCELLED').length;

    const scores = filtered
      .map((r) => r.score)
      .filter((s: any) => typeof s === 'number');
    const avgScore = scores.length
      ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length
      : null;

    return {
      totalEvents: total,
      proposed,
      accepted,
      rejected,
      cancelled,
      avgScore,
      conversionRate: proposed ? accepted / proposed : 0,
      rejectionRate: proposed ? rejected / proposed : 0,
    };
  }
}
