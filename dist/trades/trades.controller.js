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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const trades_service_1 = require("./trades.service");
const passport_1 = require("@nestjs/passport");
const dtos_1 = require("./dtos");
let TradesController = class TradesController {
    constructor(trades) {
        this.trades = trades;
    }
    create(dto) {
        return this.trades.create(dto);
    }
    findOne(id) {
        return this.trades.findOne(id);
    }
    getClosure(id) {
        return this.trades.getClosure(id);
    }
    confirm(id, dto) {
        return this.trades.confirm(id, dto);
    }
    decide(id, dto) {
        if (dto.decision === 'accept')
            return this.trades.confirm(id, { userId: dto.userId, accept: true });
        if (dto.decision === 'reject')
            return this.trades.confirm(id, { userId: dto.userId, accept: false });
        throw new common_1.ForbiddenException('Decision inválida');
    }
};
exports.TradesController = TradesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.CreateTradeDto]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/closure'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "getClosure", null);
__decorate([
    (0, common_1.Post)(':id/confirm'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dtos_1.ConfirmTradeDto]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "confirm", null);
__decorate([
    (0, common_1.Post)(':id/decision'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dtos_1.DecisionDto]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "decide", null);
exports.TradesController = TradesController = __decorate([
    (0, swagger_1.ApiTags)('Trueques'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('trades'),
    __metadata("design:paramtypes", [trades_service_1.TradesService])
], TradesController);
//# sourceMappingURL=trades.controller.js.map