import { IsNotEmpty, IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OfertaUpdateDto {

  @ApiProperty({
    description: 'ID de la categoría de la oferta',
    example: 1,
    type: Number,
    required: false
  })
  @IsOptional()
  @IsNumber()
  categoria_oferta_id?: number;

  @ApiProperty({
    description: 'ID del estado de la oferta',
    example: 1,
    type: Number,
    required: false
  })
  @IsOptional()
  @IsNumber()
  estado_oferta_id?: number;

  @ApiProperty({
    description: 'Título de la oferta',
    example: 'Intercambio de libros de programación actualizado',
    maxLength: 255,
    required: false
  })
  @IsOptional()
  @IsString()
  oferta_titulo?: string;

  @ApiProperty({
    description: 'Condiciones del trueque',
    example: 'Libros en excelente estado, sin páginas rotas',
    maxLength: 255,
    required: false
  })
  @IsOptional()
  @IsString()
  oferta_condicion_trueque?: string;

  @ApiProperty({
    description: 'Comentario obligatorio para la oferta',
    example: 'Disponible para intercambio toda la semana',
    maxLength: 255,
    required: false
  })
  @IsOptional()
  @IsString()
  oferta_comentario_obligatorio?: string;

  @ApiProperty({
    description: 'Latitud de la ubicación',
    example: -12.046373,
    type: Number,
    required: false,
    minimum: -90,
    maximum: 90
  })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  oferta_latitud?: number;

  @ApiProperty({
    description: 'Longitud de la ubicación',
    example: -77.042754,
    type: Number,
    required: false,
    minimum: -180,
    maximum: 180
  })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  oferta_longitud?: number;

  @ApiProperty({
    description: 'Usuario que modifica la oferta',
    example: 'admin',
    required: false
  })
  @IsOptional()
  @IsString()
  usuario_modificacion?: string;
}