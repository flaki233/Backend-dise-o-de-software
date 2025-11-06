import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RecaptchaService {
  async validateToken(token: string) {
    // ⚙️ Modo desarrollo: saltar validación real
    if (process.env.NODE_ENV === 'development' || process.env.RECAPTCHA_TEST === 'true') {
      console.log('🧪 Modo desarrollo: validación reCAPTCHA saltada');
      return true;
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    const response = await axios.post(url);

    if (!response.data.success) {
      throw new UnauthorizedException('Error de verificación CAPTCHA');
    }

    return true;
  }
}
