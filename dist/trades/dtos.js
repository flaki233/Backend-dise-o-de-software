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
exports.DecisionDto = exports.ConfirmTradeDto = exports.CreateTradeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateTradeDto {
}
exports.CreateTradeDto = CreateTradeDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateTradeDto.prototype, "proposerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateTradeDto.prototype, "responderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Oferta del proponente (estructura libre)' }),
    (0, class_validator_1.IsJSON)(),
    __metadata("design:type", String)
], CreateTradeDto.prototype, "proposerOfferJson", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Oferta del respondedor (estructura libre)' }),
    (0, class_validator_1.IsJSON)(),
    __metadata("design:type", String)
], CreateTradeDto.prototype, "responderOfferJson", void 0);
class ConfirmTradeDto {
}
exports.ConfirmTradeDto = ConfirmTradeDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], ConfirmTradeDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ConfirmTradeDto.prototype, "accept", void 0);
class DecisionDto {
}
exports.DecisionDto = DecisionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['accept', 'reject'] }),
    (0, class_validator_1.IsIn)(['accept', 'reject']),
    __metadata("design:type", String)
], DecisionDto.prototype, "decision", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], DecisionDto.prototype, "userId", void 0);
//# sourceMappingURL=dtos.js.map