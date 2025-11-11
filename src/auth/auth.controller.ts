import { Body, Controller, Post, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiQuery, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { RecaptchaService } from '../recaptcha/recaptcha.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly recaptchaService: RecaptchaService,
  ) {}

  // --- REGISTRO ---
  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario (envía código de verificación por email)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'usuario@correo.com' },
        password: { type: 'string', example: '123456' },
        name: { type: 'string', example: 'Usuario Nombre' },
        recaptchaToken: { type: 'string', example: 'token_recaptcha_v3' },
      },
      required: ['email', 'password', 'recaptchaToken'],
    },
  })
  @ApiResponse({ status: 201, description: 'Usuario registrado, código enviado por email' })
  async register(@Body() dto: RegisterDto & { recaptchaToken: string }) {
    await this.recaptchaService.validateToken(dto.recaptchaToken);
    return this.authService.register(dto);
  }

  // --- REGISTRO DIRECTO (sin verificación) ---
  @Post('register-direct')
  @ApiOperation({ summary: 'Registrar usuario directo sin verificación (para desarrollo/pruebas)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'test@example.com' },
        password: { type: 'string', example: 'Test@12345' },
        name: { type: 'string', example: 'Usuario Test' },
        recaptchaToken: { type: 'string', example: 'test_token' },
      },
      required: ['email', 'password', 'recaptchaToken'],
    },
  })
  @ApiResponse({ status: 201, description: 'Usuario registrado sin verificación de email' })
  async registerDirect(@Body() dto: RegisterDto & { recaptchaToken: string }) {
    await this.recaptchaService.validateToken(dto.recaptchaToken);
    return this.authService.registerDirect(dto);
  }

  // --- LOGIN ---
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión con correo y contraseña' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'usuario@correo.com' },
        password: { type: 'string', example: '123456' },
        recaptchaToken: { type: 'string', example: 'token_recaptcha_v3' },
      },
      required: ['email', 'password', 'recaptchaToken'],
    },
  })
  @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso' })
  async login(@Body() dto: LoginDto & { recaptchaToken: string }) {
    await this.recaptchaService.validateToken(dto.recaptchaToken);
    return this.authService.login(dto.email, dto.password);
  }

  // --- OLVIDÉ MI CONTRASEÑA ---
  @Post('forgot-password')
  @ApiOperation({ summary: 'Solicitar un correo de recuperación de contraseña' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'usuario@correo.com' },
      },
      required: ['email'],
    },
  })
  @ApiResponse({ status: 200, description: 'Correo de recuperación enviado' })
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  // --- RESETEAR CONTRASEÑA ---
  @Post('reset-password')
  @ApiOperation({ summary: 'Restablecer la contraseña mediante token' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string', example: 'token_de_reseteo' },
        newPassword: { type: 'string', example: 'nuevaContraseña123' },
      },
      required: ['token', 'newPassword'],
    },
  })
  @ApiResponse({ status: 200, description: 'Contraseña actualizada correctamente' })
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(token, newPassword);
  }

  // --- VERIFICAR EMAIL ---
  @Post('verify-email')
  @ApiOperation({ summary: 'Verificar email con código de verificación' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'usuario@correo.com' },
        code: { type: 'string', example: '123456' },
      },
      required: ['email', 'code'],
    },
  })
  @ApiResponse({ status: 200, description: 'Email verificado correctamente' })
  async verifyEmail(
    @Body('email') email: string,
    @Body('code') code: string,
  ) {
    return this.authService.verifyEmail(email, code);
  }

  // --- REFRESH TOKEN ---
  @Post('refresh-token')
  @ApiOperation({ summary: 'Refrescar access token con refresh token' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5...' },
      },
      required: ['refreshToken'],
    },
  })
  @ApiResponse({ status: 200, description: 'Nuevo access token generado' })
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshAccessToken(refreshToken);
  }

  // --- LOGOUT ---
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cerrar sesión del usuario' })
  @ApiResponse({ status: 200, description: 'Sesión cerrada correctamente' })
  async logout(@Request() req: any) {
    const token = req.user.robleToken;
    return this.authService.logout(token);
  }
}
