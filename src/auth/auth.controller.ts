import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { RecaptchaService } from '../recaptcha/recaptcha.service';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly recaptchaService: RecaptchaService,
  ) {}

  // --- REGISTRO ---
  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
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
  @ApiResponse({ status: 201, description: 'Usuario registrado correctamente' })
  async register(@Body() dto: RegisterDto & { recaptchaToken: string }) {
    await this.recaptchaService.validateToken(dto.recaptchaToken);
    return this.authService.register(dto);
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

  // --- VERIFICAR CORREO ---
  @Get('verify')
  @ApiOperation({ summary: 'Verificar el correo electrónico del usuario' })
  @ApiQuery({ name: 'token', type: String, description: 'Token de verificación enviado al correo' })
  @ApiResponse({ status: 200, description: 'Correo verificado correctamente' })
  async verify(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
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
}
