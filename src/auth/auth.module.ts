import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { RobleModule } from '../roble/roble.module';
import { RecaptchaService } from '../recaptcha/recaptcha.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    RobleModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    AuthService,
    RecaptchaService,
  ],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}

