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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const recaptcha_service_1 = require("../recaptcha/recaptcha.service");
let AuthController = class AuthController {
    constructor(authService, recaptchaService) {
        this.authService = authService;
        this.recaptchaService = recaptchaService;
    }
    async register(dto) {
        await this.recaptchaService.validateToken(dto.recaptchaToken);
        return this.authService.register(dto);
    }
    async login(dto) {
        await this.recaptchaService.validateToken(dto.recaptchaToken);
        return this.authService.login(dto.email, dto.password);
    }
    async verify(token) {
        return this.authService.verifyEmail(token);
    }
    async forgotPassword(email) {
        return this.authService.forgotPassword(email);
    }
    async resetPassword(token, newPassword) {
        return this.authService.resetPassword(token, newPassword);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar un nuevo usuario' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'usuario@correo.com' },
                password: { type: 'string', example: '123456' },
                recaptchaToken: { type: 'string', example: 'token_recaptcha_v3' },
            },
            required: ['email', 'password', 'recaptchaToken'],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Usuario registrado correctamente' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Iniciar sesión con correo y contraseña' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'usuario@correo.com' },
                password: { type: 'string', example: '123456' },
                recaptchaToken: { type: 'string', example: 'token_recaptcha_v3' },
            },
            required: ['email', 'password', 'recaptchaToken'],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Inicio de sesión exitoso' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verificar el correo electrónico del usuario' }),
    (0, swagger_1.ApiQuery)({ name: 'token', type: String, description: 'Token de verificación enviado al correo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Correo verificado correctamente' }),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verify", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Solicitar un correo de recuperación de contraseña' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'usuario@correo.com' },
            },
            required: ['email'],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Correo de recuperación enviado' }),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Restablecer la contraseña mediante token' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                token: { type: 'string', example: 'token_de_reseteo' },
                newPassword: { type: 'string', example: 'nuevaContraseña123' },
            },
            required: ['token', 'newPassword'],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Contraseña actualizada correctamente' }),
    __param(0, (0, common_1.Body)('token')),
    __param(1, (0, common_1.Body)('newPassword')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Autenticación'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        recaptcha_service_1.RecaptchaService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map