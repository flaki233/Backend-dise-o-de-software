import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

type JwtPayload = { sub: string; email: string; robleToken?: string };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET! || 'dev-secret',
    });
    console.log('[Auth] JwtStrategy registrada');
  }

  async validate(payload: JwtPayload) {
    return { 
      userId: payload.sub, 
      email: payload.email,
      robleToken: payload.robleToken 
    };
  }
}
