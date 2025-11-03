import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RecaptchaService {
  private readonly secretKey = process.env.RECAPTCHA_SECRET_KEY;

  async validateToken(token: string) {
    const url = `https://www.google.com/recaptcha/api/siteverify`;
    const response = await axios.post(
      url,
      null,
      {
        params: {
          secret: this.secretKey,
          response: token,
        },
      },
    );

    const data = response.data;

    if (!data.success || data.score < 0.5) {
      throw new UnauthorizedException('Error de verificación CAPTCHA');
    }

    return true;
  }
}
