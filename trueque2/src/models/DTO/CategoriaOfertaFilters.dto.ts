import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CategoriaOfertaFiltersDto {
  @ApiPropertyOptional({
    description: 'Filtrar por nombre de categoría',
    example: 'Electrónicos',
    type: String
  })
  @IsOptional()
  @IsString()
  categoria_oferta_nombre?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por estado del registro (1 = activo, 0 = inactivo)',
    example: 1,
    type: Number
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  estado_registro?: number;

  @ApiPropertyOptional({
    description: 'Filtrar por usuario que creó la categoría',
    example: 'admin',
    type: String
  })
  @IsOptional()
  @IsString()
  usuario_creacion?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por fecha de creación (formato: YYYY-MM-DD)',
    example: '2024-01-01',
    type: String
  })
  @IsOptional()
  @IsString()
  fecha_creacion?: string;
}