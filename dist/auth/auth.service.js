"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcryptjs"));
const crypto = __importStar(require("crypto"));
const nodemailer = __importStar(require("nodemailer"));
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const { email, password } = dto;
        if (!email || !password) {
            throw new common_1.BadRequestException('El email y la contraseña son obligatorios.');
        }
        const existingUser = await this.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new common_1.BadRequestException('El correo ya está registrado');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                verificationToken,
            },
        });
        try {
            await this.sendVerificationEmail(user.email, verificationToken);
            console.log(`📧 Correo de verificación enviado a ${user.email}`);
        }
        catch (err) {
            console.error('❌ Error enviando correo:', err.message);
        }
        return {
            message: 'Usuario creado correctamente. Verifica tu correo electrónico para activar la cuenta.',
            email: user.email,
        };
    }
    async sendVerificationEmail(email, token) {
        const transporter = nodemailer.createTransport({
            host: 'localhost',
            port: 1025,
            secure: false,
        });
        const verifyUrl = `http://localhost:3000/auth/verify?token=${token}`;
        await transporter.sendMail({
            from: '"Trueque App" <no-reply@trueque.com>',
            to: email,
            subject: 'Verifica tu cuenta de Trueque',
            html: `
        <h2>¡Bienvenido a Trueque!</h2>
        <p>Por favor, haz clic en el siguiente enlace para verificar tu cuenta:</p>
        <a href="${verifyUrl}">${verifyUrl}</a>
        <br/><br/>
        <p>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
      `,
        });
    }
    async verifyEmail(token) {
        if (!token) {
            throw new common_1.BadRequestException('Token no proporcionado.');
        }
        const user = await this.prisma.user.findFirst({
            where: { verificationToken: token },
        });
        if (!user) {
            throw new common_1.BadRequestException('Token inválido o expirado');
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: { verified: true, verificationToken: null },
        });
        return { message: 'Correo verificado correctamente. Ya puedes iniciar sesión.' };
    }
    async login(email, password) {
        if (!email || !password) {
            throw new common_1.BadRequestException('El email y la contraseña son obligatorios.');
        }
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciales inválidas.');
        }
        if (!user.verified) {
            throw new common_1.UnauthorizedException('Cuenta no verificada. Verifica tu correo.');
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Credenciales inválidas.');
        }
        try {
            const payload = { sub: user.id, email: user.email };
            const token = await this.jwtService.signAsync(payload);
            return {
                message: 'Inicio de sesión exitoso',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                },
            };
        }
        catch (err) {
            console.error('❌ Error generando token:', err.message);
            throw new common_1.InternalServerErrorException('No se pudo generar el token.');
        }
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new common_1.BadRequestException('No existe una cuenta con ese correo.');
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExp = new Date(Date.now() + 1000 * 60 * 15);
        await this.prisma.user.update({
            where: { email },
            data: { resetToken, resetTokenExp },
        });
        const transporter = nodemailer.createTransport({
            host: 'localhost',
            port: 1025,
            secure: false,
        });
        const resetUrl = `http://localhost:3000/auth/reset-password?token=${resetToken}`;
        await transporter.sendMail({
            from: '"Trueque App" <no-reply@trueque.com>',
            to: email,
            subject: 'Restablecer contraseña - Trueque',
            html: `
        <h2>Restablecer contraseña</h2>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña (válido por 15 minutos):</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `,
        });
        console.log(`📧 Correo de restablecimiento enviado a ${email}`);
        return { message: 'Se envió un correo para restablecer la contraseña.' };
    }
    async resetPassword(token, newPassword) {
        const user = await this.prisma.user.findFirst({
            where: { resetToken: token },
        });
        if (!user || !user.resetTokenExp || user.resetTokenExp < new Date()) {
            throw new common_1.BadRequestException('Token inválido o expirado.');
        }
        const hashed = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashed,
                resetToken: null,
                resetTokenExp: null,
            },
        });
        return { message: 'Contraseña restablecida correctamente. Ya puedes iniciar sesión.' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map