import { IsOptional, IsEnum, IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { OfferStatus } from '@prisma/client';

export class FilterOfertaDto {
  @ApiProperty({ description: 'ID de la categoría', example: 1, required: false })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  categoriaId?: number;

  @ApiProperty({ 
    description: 'Estado de la oferta', 
    enum: OfferStatus,
    example: 'PUBLICADA',
    required: false 
  })
  @IsEnum(OfferStatus)
  @IsOptional()
  status?: OfferStatus;

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

