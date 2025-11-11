// register.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'nuevo@correo.com', description: 'Correo electrónico para registro' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'contraseña123', description: 'Contraseña del nuevo usuario (mínimo 6 caracteres)' })
  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del usuario', required: false })
  @IsOptional()
  name?: string;
}
