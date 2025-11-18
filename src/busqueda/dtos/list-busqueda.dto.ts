import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class ListBusquedaDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Número de página (empezando en 1)',
    type: Number,
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: 'Cantidad de resultados por página',
    type: Number,
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  @IsInt()
  @IsPositive()
  pageSize: number = 10;

  @ApiPropertyOptional({
    enum: ['recent', 'price_asc', 'price_desc', 'relevance'],
    example: 'recent',
    description: 'Orden de resultados',
  })
  @IsOptional()
  @IsIn(['recent', 'price_asc', 'price_desc', 'relevance'])
  sort: 'recent' | 'relevance' | 'price_asc' | 'price_desc' = 'recent';

  @ApiPropertyOptional({
    example: 'bicicleta',
    description: 'Búsqueda por palabra clave (texto libre)',
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({
    example: 'deportes',
    description: 'Filtrar por categoría',
  })
  @IsOptional()
  @IsString()
  categoria?: string;

  @ApiPropertyOptional({
    example: 'POS',
    description: 'Filtro opcional por sentimiento (POS, NEG, NEU)',
  })
  @IsOptional()
  @IsString()
  sentiment?: string;
}
