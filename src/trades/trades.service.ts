import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfirmTradeDto, CreateTradeDto } from './dtos';
import { TradeStatus} from '@prisma/client';

@Injectable()
export class TradesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTradeDto) {
    if (dto.proposerId === dto.responderId) {
      throw new BadRequestException('No puedes proponer un trueque contigo mismo');
    }
    return this.prisma.trade.create({
      data: {
        proposerId: dto.proposerId,
        responderId: dto.responderId,
        proposerOfferJson: JSON.parse(dto.proposerOfferJson),
        responderOfferJson: JSON.parse(dto.responderOfferJson),
      },
    });
  }

  async findOne(id: number) {
    const trade = await this.prisma.trade.findUnique({ where: { id } });
    if (!trade) throw new NotFoundException('Trueque no encontrado');
    return trade;
  }

  async getClosure(tradeId: number) {
    const closure = await this.prisma.tradeClosure.findUnique({ where: { tradeId } });
    if (!closure) throw new NotFoundException('Este trueque aún no tiene registro de cierre.');
    return closure;
  }

  /**
   * Confirmación bilateral:
   * - Solo pueden confirmar/cancelar proposer o responder
   * - Si accept=false -> CANCELLED
   * - Si accept=true -> marca confirmed del actor
   * - Si ambos confirmed -> status=CONFIRMED, closedAt=now y se actualiza reputación/estadística
   */
  async confirm(id: number, { userId, accept }: ConfirmTradeDto) {
    const trade = await this.prisma.trade.findUnique({ where: { id } });
    if (!trade) throw new NotFoundException('Trueque no encontrado');

    const isProposer = trade.proposerId === userId;
    const isResponder = trade.responderId === userId;
    if (!isProposer && !isResponder) {
      throw new ForbiddenException('No eres parte de este trueque');
    }

    if (trade.status !== 'PENDING') {
      throw new BadRequestException(`El trueque ya está ${trade.status.toLowerCase()}`);
    }

    // rechazo/cancelación inmediata
    if (!accept) {
      const cancelled = await this.prisma.trade.update({
       where: { id },
       data: {
       status: TradeStatus.CANCELLED,
       proposerConfirmed: false,
       responderConfirmed: false,
       closedAt: new Date(),
      },
    });

    // 👉 guarda registro de cierre (inmutable)
    await this.recordClosure(this.prisma, cancelled, TradeStatus.CANCELLED);
    return cancelled;
    }

    // aceptación: marcamos confirmación del actor
    const data: any = {};
    if (isProposer) data.proposerConfirmed = true;
    if (isResponder) data.responderConfirmed = true;

    // usamos transacción para leer-actualizar-generar efectos
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.trade.update({ where: { id }, data });

      const both = updated.proposerConfirmed && updated.responderConfirmed;
      if (!both) return updated;

      // ambas confirmaciones → cerramos y actualizamos métricas de usuarios
      const closed = await tx.trade.update({
        where: { id },
        data: { status: TradeStatus.CONFIRMED, closedAt: new Date() },
      });

      // Opcional: reputación/contador de trueques cerrados
      await tx.user.update({
        where: { id: closed.proposerId },
        data: { tradesClosed: { increment: 1 }, reputationScore: { increment: 1 } },
      });
      await tx.user.update({
        where: { id: closed.responderId },
        data: { tradesClosed: { increment: 1 }, reputationScore: { increment: 1 } },
      });

      // 👉 guarda registro de cierre (inmutable)
      await this.recordClosure(tx, closed, TradeStatus.CONFIRMED);

      return closed;
    });
  }
    // === REGISTRO INMUTABLE DE CIERRE ===
  private async recordClosure(
    tx: any,
    trade: any,
    final: TradeStatus,
  ) {
    return tx.tradeClosure.upsert({
      where: { tradeId: trade.id },
      update: {},
      create: {
        tradeId: trade.id,
        proposerId: trade.proposerId,
        responderId: trade.responderId,
        offerA: trade.proposerOfferJson,
        offerB: trade.responderOfferJson,
        closedAt: new Date(),
        finalStatus: final,
      },
    });
  }

}
