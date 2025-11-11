import { IsOptional, IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FilterOfertaDto {
  @ApiProperty({ description: 'ID de la categoría', example: 'abc123', required: false })
  @IsString()
  @IsOptional()
  categoriaId?: string;

  @ApiProperty({ 
    description: 'Estado de la oferta', 
    enum: ['BORRADOR', 'PUBLICADA', 'PAUSADA'],
    example: 'PUBLICADA',
    required: false 
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ description: 'Búsqueda por título', example: 'libro', required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ description: 'Número de página', example: 1, required: false, default: 1 })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiProperty({ description: 'Cantidad de items por página', example: 10, required: false, default: 10 })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  limit?: number;
}

