import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { RecaptchaService } from '../recaptcha/recaptcha.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly recaptchaService: RecaptchaService,
  ) {}

  // --- REGISTRO ---
  @Post('register')
  async register(@Body() dto: RegisterDto & { recaptchaToken: string }) {
    await this.recaptchaService.validateToken(dto.recaptchaToken);
    return this.authService.register(dto);
  }

  // --- LOGIN ---
  @Post('login')
  async login(@Body() dto: LoginDto & { recaptchaToken: string }) {
    await this.recaptchaService.validateToken(dto.recaptchaToken);
    return this.authService.login(dto.email, dto.password);
  }

  // --- VERIFICACIÓN DE CORREO ---
  @Get('verify')
  async verify(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  // --- SOLICITAR RESETEO DE CONTRASEÑA ---
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  // --- RESETEAR CONTRASEÑA ---
  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(token, newPassword);
  }
}
