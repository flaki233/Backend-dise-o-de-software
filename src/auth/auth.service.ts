import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { RobleService } from '../roble/roble.service';
import { RobleRepository } from '../roble/roble.repository';
import { RegisterDto } from './dtos/register.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private roble: RobleService,
    private robleRepo: RobleRepository,
    private jwtService: JwtService,
  ) {}

  // --- REGISTRO ---
  async register(dto: RegisterDto) {
    const { email, password, name } = dto;

    if (!email || !password) {
      throw new BadRequestException('El email y la contraseña son obligatorios.');
    }

    try {
      const result = await this.roble.signup(
        email,
        password,
        name || email.split('@')[0]
      );

      return {
        message: 'Usuario registrado. Se ha enviado un código de verificación a tu correo electrónico.',
        email,
        info: 'Por favor verifica tu email y usa el código recibido en /auth/verify-email'
      };
    } catch (error: any) {
      if (error.message.includes('contraseña')) {
        throw new BadRequestException(
          'La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un símbolo (!,@,#,$,_,-)'
        );
      }
      
      throw new BadRequestException('El correo ya está registrado o hubo un error en el registro');
    }
  }

  // --- REGISTRO DIRECTO (sin verificación de email) ---
  async registerDirect(dto: RegisterDto) {
    const { email, password, name } = dto;

    if (!email || !password) {
      throw new BadRequestException('El email y la contraseña son obligatorios.');
    }

    try {
      const result = await this.roble.signupDirect(
        email,
        password,
        name || email.split('@')[0]
      );

      const loginResponse = await this.roble.login(email, password);
      if (loginResponse.user && loginResponse.accessToken) {
        try {
          console.log('[Auth] Sincronizando usuario a tabla Usuarios_Aplicacion:', loginResponse.user.id);
          this.roble.setAccessToken(loginResponse.accessToken);
          await this.roble.insertRecord('Usuarios_Aplicacion', {
            userId: loginResponse.user.id,
            email: loginResponse.user.email,
            name: loginResponse.user.name || name || email.split('@')[0],
            reputationScore: 0,
            tradesClosed: 0,
            active: true,
            role: 'OFERENTE',
          });
          console.log('[Auth] Usuario sincronizado exitosamente');
        } catch (syncError: any) {
          console.error('[Auth] Error sincronizando usuario:', syncError.message);
        }
      }

      return {
        message: 'Usuario creado correctamente (sin verificación de email).',
        email,
        note: 'Este endpoint es para desarrollo/pruebas. En producción usa /auth/register'
      };
    } catch (error: any) {
      if (error.message.includes('contraseña')) {
        throw new BadRequestException(
          'La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un símbolo (!,@,#,$,_,-)'
        );
      }
      
      throw new BadRequestException('El correo ya está registrado o hubo un error en el registro');
    }
  }


  // --- INICIO DE SESIÓN ---
  async login(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestException('El email y la contraseña son obligatorios.');
    }

    try {
      console.log('[Auth] Intentando login con ROBLE:', email);
      const robleResponse = await this.roble.login(email, password);
      console.log('[Auth] Login ROBLE exitoso');
      
      if (!robleResponse.accessToken) {
        throw new UnauthorizedException('Error de autenticación con ROBLE');
      }

      const robleUser = robleResponse.user;

      this.roble.setAccessToken(robleResponse.accessToken);
      
      const existingUser = await this.robleRepo.findUserById(robleUser.id);
      if (!existingUser) {
        console.log('[Auth] Usuario no existe en Usuarios_Aplicacion, sincronizando...');
        try {
          await this.roble.insertRecord('Usuarios_Aplicacion', {
            userId: robleUser.id,
            email: robleUser.email,
            name: robleUser.name || email.split('@')[0],
            reputationScore: 0,
            tradesClosed: 0,
            active: true,
            role: 'OFERENTE',
          });
          console.log('[Auth] Usuario sincronizado durante login');
        } catch (syncError: any) {
          console.error('[Auth] Error sincronizando usuario durante login:', syncError.message);
        }
      }

      const payload = {
        sub: robleUser.id,
        email: robleUser.email,
        robleToken: robleResponse.accessToken,
      };
      
      const localToken = await this.jwtService.signAsync(payload);

      return {
        message: 'Inicio de sesión exitoso',
        token: localToken,
        user: {
          id: robleUser.id,
          email: robleUser.email,
          name: robleUser.name,
        },
      };
    } catch (error: any) {
      console.error('[Auth] Error en login:', error.message || error);
      throw new UnauthorizedException('Credenciales inválidas o cuenta no verificada.');
    }
  }

  // --- VERIFICAR EMAIL ---
  async verifyEmail(email: string, code: string) {
    try {
      const result = await this.roble.verifyEmail(email, code);
      
      console.log('[Auth] Email verificado correctamente en ROBLE');
      console.log('[Auth] Usuario debe hacer login para sincronizar en base de datos');
      
      return { 
        message: 'Email verificado correctamente. Ya puedes iniciar sesión con tu email y contraseña.',
        email,
        nextStep: 'Usa POST /auth/login con tu email y contraseña para continuar'
      };
    } catch (error: any) {
      console.error('[Auth] Error verificando email:', error.message);
      throw new BadRequestException('Código de verificación inválido o expirado');
    }
  }

  // --- REFRESH TOKEN ---
  async refreshAccessToken(refreshToken: string) {
    try {
      return await this.roble.refreshToken(refreshToken);
    } catch (error: any) {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }

  // --- SOLICITAR RESETEO DE CONTRASEÑA ---
  async forgotPassword(email: string) {
    try {
      const result = await this.roble.forgotPassword(email);
      return { 
        message: 'Se envió un correo con instrucciones para restablecer tu contraseña.',
        result 
      };
    } catch (error: any) {
      throw new BadRequestException('Error al solicitar reseteo de contraseña');
    }
  }

  // --- RESETEAR CONTRASEÑA ---
  async resetPassword(token: string, newPassword: string) {
    try {
      const result = await this.roble.resetPassword(token, newPassword);
      return { message: 'Contraseña restablecida correctamente', result };
    } catch (error: any) {
      throw new BadRequestException('Token inválido o expirado');
    }
  }

  // --- LOGOUT ---
  async logout(accessToken: string) {
    try {
      return await this.roble.logout(accessToken);
    } catch (error: any) {
      throw new BadRequestException('Error al cerrar sesión');
    }
  }
}
