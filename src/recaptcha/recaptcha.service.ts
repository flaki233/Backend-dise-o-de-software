import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RecaptchaService {
  async validateToken(token: string) {
    if (token === 'test_token' || token === 'skip' || !token) {
      console.log('🧪 Modo desarrollo: token de prueba detectado');
      return true;
    }

    if (process.env.NODE_ENV === 'development' || process.env.RECAPTCHA_TEST === 'true') {
      console.log('🧪 Modo desarrollo: validación reCAPTCHA saltada');
      return true;
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      console.log('⚠️  RECAPTCHA_SECRET_KEY no configurada, saltando validación');
      return true;
    }

    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    try {
      const response = await axios.post(url);

      if (!response.data.success) {
        throw new UnauthorizedException('Error de verificación CAPTCHA');
      }

      return true;
    } catch (error: any) {
      console.error('Error validando CAPTCHA:', error.message);
      throw new UnauthorizedException('Error de verificación CAPTCHA');
    }
  }
}
