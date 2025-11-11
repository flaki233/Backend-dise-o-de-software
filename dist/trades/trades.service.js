"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let TradesService = class TradesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        if (dto.proposerId === dto.responderId) {
            throw new common_1.BadRequestException('No puedes proponer un trueque contigo mismo');
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
    async findOne(id) {
        const trade = await this.prisma.trade.findUnique({ where: { id } });
        if (!trade)
            throw new common_1.NotFoundException('Trueque no encontrado');
        return trade;
    }
    async getClosure(tradeId) {
        const closure = await this.prisma.tradeClosure.findUnique({ where: { tradeId } });
        if (!closure)
            throw new common_1.NotFoundException('Este trueque aún no tiene registro de cierre.');
        return closure;
    }
    async confirm(id, { userId, accept }) {
        const trade = await this.prisma.trade.findUnique({ where: { id } });
        if (!trade)
            throw new common_1.NotFoundException('Trueque no encontrado');
        const isProposer = trade.proposerId === userId;
        const isResponder = trade.responderId === userId;
        if (!isProposer && !isResponder) {
            throw new common_1.ForbiddenException('No eres parte de este trueque');
        }
        if (trade.status !== 'PENDING') {
            throw new common_1.BadRequestException(`El trueque ya está ${trade.status.toLowerCase()}`);
        }
        if (!accept) {
            const cancelled = await this.prisma.trade.update({
                where: { id },
                data: {
                    status: client_1.TradeStatus.CANCELLED,
                    proposerConfirmed: false,
                    responderConfirmed: false,
                    closedAt: new Date(),
                },
            });
            await this.recordClosure(this.prisma, cancelled, client_1.TradeStatus.CANCELLED);
            return cancelled;
        }
        const data = {};
        if (isProposer)
            data.proposerConfirmed = true;
        if (isResponder)
            data.responderConfirmed = true;
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.trade.update({ where: { id }, data });
            const both = updated.proposerConfirmed && updated.responderConfirmed;
            if (!both)
                return updated;
            const closed = await tx.trade.update({
                where: { id },
                data: { status: client_1.TradeStatus.CONFIRMED, closedAt: new Date() },
            });
            await tx.user.update({
                where: { id: closed.proposerId },
                data: { tradesClosed: { increment: 1 }, reputationScore: { increment: 1 } },
            });
            await tx.user.update({
                where: { id: closed.responderId },
                data: { tradesClosed: { increment: 1 }, reputationScore: { increment: 1 } },
            });
            await this.recordClosure(tx, closed, client_1.TradeStatus.CONFIRMED);
            return closed;
        });
    }
    async recordClosure(tx, trade, final) {
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
};
exports.TradesService = TradesService;
exports.TradesService = TradesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TradesService);
//# sourceMappingURL=trades.service.js.map