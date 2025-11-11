import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { RobleService } from '../roble/roble.service';
import { RegisterDto } from './dtos/register.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthServiceRoble {
  constructor(
    private robleService: RobleService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const { email, password, name } = dto;

    if (!email || !password) {
      throw new BadRequestException('El email y la contraseña son obligatorios.');
    }

    try {
      const result = await this.robleService.signupDirect(email, password, name || email);
      
      return {
        message: 'Usuario creado correctamente en ROBLE.',
        email,
      };
    } catch (error: any) {
      if (error.message.includes('409') || error.message.includes('ya existe')) {
        throw new BadRequestException('El correo ya está registrado');
      }
      
      if (error.message.includes('contraseña')) {
        throw new BadRequestException(
          'La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un símbolo (!,@,#,$,_,-)'
        );
      }
      
      throw new BadRequestException(error.message);
    }
  }

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestException('El email y la contraseña son obligatorios.');
    }

    try {
      const robleResponse = await this.robleService.login(email, password);
      
      if (!robleResponse.accessToken) {
        throw new UnauthorizedException('Error de autenticación con ROBLE');
      }

      const robleToken = robleResponse.accessToken;
      const robleUser = robleResponse.user;

      const payload = {
        sub: robleUser.id,
        email: robleUser.email,
        robleToken,
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
      if (error.message.includes('401') || error.message.includes('no verificado')) {
        throw new UnauthorizedException('Credenciales inválidas o cuenta no verificada.');
      }
      
      throw new UnauthorizedException('Error en el inicio de sesión');
    }
  }

  async verifyEmail(token: string) {
    try {
      const result = await this.robleService.verifyToken(token);
      return { message: 'Token verificado correctamente', result };
    } catch (error) {
      throw new BadRequestException('Token inválido o expirado');
    }
  }

  async forgotPassword(email: string) {
    throw new BadRequestException(
      'La función de reseteo de contraseña está gestionada por ROBLE. Contacta al administrador.'
    );
  }

  async resetPassword(token: string, newPassword: string) {
    throw new BadRequestException(
      'La función de reseteo de contraseña está gestionada por ROBLE. Contacta al administrador.'
    );
  }
}

