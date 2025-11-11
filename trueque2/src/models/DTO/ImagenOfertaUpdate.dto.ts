import { IsOptional, IsString, IsNumber, MaxLength } from 'class-validator';

export class ImagenOfertaUpdateDto {
  @IsOptional()
  @IsNumber({}, { message: 'El ID de la oferta debe ser un número' })
  oferta_id?: number;

  @IsOptional()
  @IsString({ message: 'El nombre de la imagen debe ser un texto' })
  @MaxLength(55, { message: 'El nombre de la imagen no debe exceder 55 caracteres' })
  imagen_oferta_nombre?: string;

  @IsOptional()
  @IsString({ message: 'La nueva imagen en base64' })
  imagen_base64?: string;

  @IsOptional()
  @IsString({ message: 'La ruta de la imagen debe ser un texto' })
  @MaxLength(255, { message: 'La ruta de la imagen no debe exceder 255 caracteres' })
  imagen_oferta_ruta?: string;

  @IsOptional()
  @IsString({ message: 'El usuario de modificación debe ser un texto' })
  @MaxLength(45, { message: 'El usuario de modificación no debe exceder 45 caracteres' })
  usuario_modificacion?: string;
}