import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class OfertaFiltersDto {
  @ApiProperty({
    description: 'Filtrar por título de la oferta',
    example: 'Intercambio de libros',
    required: false
  })
  @IsOptional()
  @IsString()
  titulo?: string;

  @ApiProperty({
    description: 'Filtrar por ID de categoría',
    example: 1,
    required: false
  })
  @IsOptional()
  @IsNumber()
  categoria_oferta_id?: number;

  @ApiProperty({
    description: 'Filtrar por ID de estado de oferta',
    example: 1,
    required: false
  })
  @IsOptional()
  @IsNumber()
  estado_oferta_id?: number;

  @ApiProperty({
    description: 'Filtrar por estado del registro (1: activo, 0: inactivo)',
    example: 1,
    required: false
  })
  @IsOptional()
  @IsNumber()
  estado?: number;
}