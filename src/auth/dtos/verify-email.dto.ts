import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({ description: 'Email del usuario', example: 'usuario@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ description: 'Código de verificación', example: '123456' })
  @IsString()
  @IsNotEmpty()
  code!: string;
}

