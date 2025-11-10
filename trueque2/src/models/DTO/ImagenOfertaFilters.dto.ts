import { IsOptional, IsString, IsNumber } from 'class-validator';

export class ImagenOfertaFiltersDto {
  @IsOptional()
  @IsNumber({}, { message: 'El ID de la oferta debe ser un número' })
  oferta_id?: number;

  @IsOptional()
  @IsString({ message: 'El nombre de la imagen debe ser un texto' })
  imagen_oferta_nombre?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El estado debe ser un número' })
  estado?: number;
}