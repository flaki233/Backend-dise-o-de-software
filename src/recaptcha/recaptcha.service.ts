import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RecaptchaService {
  async validateToken(token: string) {
    const isTest = process.env.RECAPTCHA_TEST;
    const nodeEnv = process.env.NODE_ENV;
    
    console.log('🔍 Validando reCAPTCHA token:', token?.substring(0, 50) + '...');
    console.log('📝 Longitud del token:', token?.length);
    console.log('🌍 NODE_ENV:', nodeEnv);
    console.log('🧪 RECAPTCHA_TEST:', isTest);
    console.log('🧪 RECAPTCHA_TEST === "true":', isTest === 'true');
    console.log('🧪 process.env completo RECAPTCHA_TEST:', JSON.stringify(process.env.RECAPTCHA_TEST));
    
    if (isTest === 'true' || nodeEnv === 'development') {
      console.log('✅ Modo desarrollo/test: validación reCAPTCHA SALTADA');
      return true;
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY || '6Lf7ZRQsAAAAAG-miMeFy8aKDz_20Y9GO30915Gq';
    const siteKey = '6Lf7ZRQsAAAAAHUI3Jd8esdqfFBmiCxExeXWb7_z';
    
    console.log('🔑 Secret Key:', secretKey.substring(0, 20) + '...');
    console.log('🔑 Site Key esperada:', siteKey);
    
    if (!process.env.RECAPTCHA_SECRET_KEY) {
      console.log('⚠️  Usando RECAPTCHA_SECRET_KEY de prueba de Google');
    }

    const url = `https://www.google.com/recaptcha/api/siteverify`;

    try {
      console.log('🌐 Enviando petición a Google reCAPTCHA...');
      const response = await axios.post(url, null, {
        params: {
          secret: secretKey,
          response: token,
        },
      });

      console.log('📊 Respuesta completa de Google reCAPTCHA:', JSON.stringify(response.data, null, 2));

      if (!response.data.success) {
        console.log('❌ reCAPTCHA validación fallida. Error codes:', response.data['error-codes']);
        console.log('💡 Posibles causas:');
        console.log('   - invalid-input-secret: La secret key no coincide con la site key');
        console.log('   - invalid-input-response: El token es inválido o expiró');
        console.log('   - timeout-or-duplicate: El token ya fue usado');
        throw new UnauthorizedException('Error de verificación CAPTCHA');
      }

      console.log('✅ reCAPTCHA validado correctamente. Score:', response.data.score);
      return true;
    } catch (error: any) {
      console.error('❌ Error validando CAPTCHA:', error.message);
      if (error.response) {
        console.error('📤 Respuesta de error completa:', error.response.data);
      }
      throw new UnauthorizedException('Error de verificación CAPTCHA');
    }
  }
}
