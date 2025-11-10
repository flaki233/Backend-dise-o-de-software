import { IsNotEmpty, IsString, IsOptional, IsNumber, MaxLength } from 'class-validator';

export class ImagenOfertaCreateDto {
  @IsNotEmpty({ message: 'La oferta es requerida' })
  @IsNumber({}, { message: 'El ID de la oferta debe ser un número' })
  oferta_id: number;

  @IsNotEmpty({ message: 'El nombre de la imagen es requerido' })
  @IsString({ message: 'El nombre de la imagen debe ser un texto' })
  @MaxLength(55, { message: 'El nombre de la imagen no debe exceder 55 caracteres' })
  imagen_oferta_nombre: string;

  @IsNotEmpty({ message: 'La imagen en base64 es requerida' })
  @IsString({ message: 'La imagen base64 debe ser un texto' })
  imagen_base64: string;

  @IsOptional()
  @IsString({ message: 'La ruta de la imagen debe ser un texto' })
  @MaxLength(255, { message: 'La ruta de la imagen no debe exceder 255 caracteres' })
  imagen_oferta_ruta?: string;

  @IsOptional()
  @IsString({ message: 'El usuario de creación debe ser un texto' })
  @MaxLength(45, { message: 'El usuario de creación no debe exceder 45 caracteres' })
  usuario_creacion?: string;
}