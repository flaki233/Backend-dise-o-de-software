import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { RobleRepository } from '../roble/roble.repository';
import { ConfirmTradeDto, CreateTradeDto } from './dtos';

@Injectable()
export class TradesService {
  constructor(
    private readonly robleRepo: RobleRepository,
  ) {}

  async findAllForUser(userId: string) {
    const userIdStr = String(userId);
    const [asProposer, asResponder] = await Promise.all([
      this.robleRepo.findTradesByProposer(userIdStr),
      this.robleRepo.findTradesByResponder(userIdStr),
    ]);

    const tradesMap = new Map<string, any>();
    [...(asProposer || []), ...(asResponder || [])].forEach((trade: any) => {
      const id = String((trade as any)._id || trade.id);
      tradesMap.set(id, trade);
    });

    return Array.from(tradesMap.values());
  }

  async create(dto: CreateTradeDto) {
    if (dto.proposerId === dto.responderId) {
      throw new BadRequestException('No puedes proponer un trueque contigo mismo');
    }
    
    return this.robleRepo.createTrade({
      proposerId: dto.proposerId,
      responderId: dto.responderId,
      proposerOfferJson: JSON.parse(dto.proposerOfferJson),
      responderOfferJson: JSON.parse(dto.responderOfferJson),
    });
  }

  async findOne(id: string) {
    const trade = await this.robleRepo.findTradeById(id);
    if (!trade) throw new NotFoundException('Trueque no encontrado');
    return trade;
  }

  async getClosure(tradeId: string) {
    const closure = await this.robleRepo.findTradeClosureByTradeId(tradeId);
    if (!closure) throw new NotFoundException('Este trueque aún no tiene registro de cierre.');
    return closure;
  }

  async confirm(id: string, { userId, accept }: ConfirmTradeDto) {
    const trade = await this.robleRepo.findTradeById(id);
    if (!trade) throw new NotFoundException('Trueque no encontrado');

    const isProposer = trade.proposerId === userId;
    const isResponder = trade.responderId === userId;
    if (!isProposer && !isResponder) {
      throw new ForbiddenException('No eres parte de este trueque');
    }

    if (trade.status !== 'PENDING') {
      throw new BadRequestException(`El trueque ya está ${trade.status.toLowerCase()}`);
    }

    if (!accept) {
      const cancelled = await this.robleRepo.updateTrade(id, {
        status: 'CANCELLED',
        proposerConfirmed: false,
        responderConfirmed: false,
        closedAt: new Date().toISOString(),
      });

      await this.robleRepo.createTradeClosure({
        tradeId: (cancelled as any)._id,
        proposerId: cancelled.proposerId,
        responderId: cancelled.responderId,
        offerA: cancelled.proposerOfferJson,
        offerB: cancelled.responderOfferJson,
        closedAt: new Date().toISOString(),
        finalStatus: 'CANCELLED',
      });
      
      return cancelled;
    }

    const data: any = {};
    if (isProposer) data.proposerConfirmed = true;
    if (isResponder) data.responderConfirmed = true;

    const updated = await this.robleRepo.updateTrade(id, data);

    const both = updated.proposerConfirmed && updated.responderConfirmed;
    if (!both) return updated;

    const closed = await this.robleRepo.updateTrade(id, {
      status: 'CONFIRMED',
      closedAt: new Date().toISOString(),
    });

    const proposer = await this.robleRepo.findUserById(closed.proposerId);
    const responder = await this.robleRepo.findUserById(closed.responderId);

    if (proposer) {
      await this.robleRepo.updateUser(closed.proposerId, {
        tradesClosed: (proposer.tradesClosed || 0) + 1,
        reputationScore: (proposer.reputationScore || 0) + 1,
      });
    }

    if (responder) {
      await this.robleRepo.updateUser(closed.responderId, {
        tradesClosed: (responder.tradesClosed || 0) + 1,
        reputationScore: (responder.reputationScore || 0) + 1,
      });
    }

    await this.robleRepo.createTradeClosure({
      tradeId: (closed as any)._id,
      proposerId: closed.proposerId,
      responderId: closed.responderId,
      offerA: closed.proposerOfferJson,
      offerB: closed.responderOfferJson,
      closedAt: new Date().toISOString(),
      finalStatus: 'CONFIRMED',
    });

    return closed;
  }
}
