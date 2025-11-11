import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOfertaDto {
  @ApiProperty({ description: 'Título de la oferta', example: 'Libro de JavaScript Moderno', required: false })
  @IsString()
  @IsOptional()
  titulo?: string;

  @ApiProperty({ description: 'ID de la categoría', example: 'abc123', required: false })
  @IsString()
  @IsOptional()
  categoriaId?: string;

  @ApiProperty({ 
    description: 'Condiciones del trueque', 
    example: 'Libro en excelente estado, sin rayaduras',
    required: false 
  })
  @IsString()
  @IsOptional()
  condicionTrueque?: string;

  @ApiProperty({ 
    description: 'Comentario obligatorio', 
    example: 'Busco intercambiar por otro libro',
    required: false 
  })
  @IsString()
  @IsOptional()
  comentarioObligatorio?: string;

  @ApiProperty({ description: 'Latitud de la ubicación', example: 11.0041072, required: false })
  @IsNumber()
  @IsOptional()
  @Min(-90)
  @Max(90)
  latitud?: number;

  @ApiProperty({ description: 'Longitud de la ubicación', example: -74.8069813, required: false })
  @IsNumber()
  @IsOptional()
  @Min(-180)
  @Max(180)
  longitud?: number;

  @ApiProperty({ 
    description: 'Estado de la oferta', 
    enum: ['BORRADOR', 'PUBLICADA', 'PAUSADA'],
    example: 'PUBLICADA',
    required: false 
  })
  @IsString()
  @IsOptional()
  status?: string;
}

