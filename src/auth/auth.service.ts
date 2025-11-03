import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dtos/register.dto';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  // --- REGISTRO ---
  async register(dto: RegisterDto) {
    const { email, password } = dto;

    if (!email || !password) {
      throw new BadRequestException('El email y la contraseña son obligatorios.');
    }

    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('El correo ya está registrado');
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
    } catch (err: any) {
      console.error('❌ Error enviando correo:', err.message);
    }

    return {
      message:
        'Usuario creado correctamente. Verifica tu correo electrónico para activar la cuenta.',
      email: user.email,
    };
  }

  // --- ENVÍO DE CORREO DE VERIFICACIÓN ---
  private async sendVerificationEmail(email: string, token: string) {
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

  // --- VERIFICAR CORREO ---
  async verifyEmail(token: string) {
    if (!token) {
      throw new BadRequestException('Token no proporcionado.');
    }

    const user = await this.prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      throw new BadRequestException('Token inválido o expirado');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { verified: true, verificationToken: null },
    });

    return { message: 'Correo verificado correctamente. Ya puedes iniciar sesión.' };
  }

  // --- INICIO DE SESIÓN ---
  async login(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestException('El email y la contraseña son obligatorios.');
    }

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    if (!user.verified) {
      throw new UnauthorizedException('Cuenta no verificada. Verifica tu correo.');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Credenciales inválidas.');
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
    } catch (err: any) {
      console.error('❌ Error generando token:', err.message);
      throw new InternalServerErrorException('No se pudo generar el token.');
    }
  }

  // --- SOLICITAR RESETEO DE CONTRASEÑA ---
  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException('No existe una cuenta con ese correo.');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExp = new Date(Date.now() + 1000 * 60 * 15); // 15 min

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

  // --- RESETEAR CONTRASEÑA ---
  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: { resetToken: token },
    });

    if (!user || !user.resetTokenExp || user.resetTokenExp < new Date()) {
      throw new BadRequestException('Token inválido o expirado.');
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
}
