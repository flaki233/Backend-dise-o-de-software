"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecaptchaService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
let RecaptchaService = class RecaptchaService {
    async validateToken(token) {
        if (process.env.NODE_ENV === 'development' || process.env.RECAPTCHA_TEST === 'true') {
            console.log('🧪 Modo desarrollo: validación reCAPTCHA saltada');
            return true;
        }
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
        const response = await axios_1.default.post(url);
        if (!response.data.success) {
            throw new common_1.UnauthorizedException('Error de verificación CAPTCHA');
        }
        return true;
    }
};
exports.RecaptchaService = RecaptchaService;
exports.RecaptchaService = RecaptchaService = __decorate([
    (0, common_1.Injectable)()
], RecaptchaService);
//# sourceMappingURL=recaptcha.service.js.map