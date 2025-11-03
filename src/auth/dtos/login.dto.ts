import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'El email no es válido.' })
  @IsNotEmpty({ message: 'El email es obligatorio.' })
  email!: string; // ✅ con "!" para evitar TS2564

  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  password!: string; // ✅ igual acá
}
