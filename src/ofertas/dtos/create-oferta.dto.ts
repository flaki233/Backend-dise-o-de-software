import { IsString, IsNotEmpty, IsNumber, IsInt, IsArray, ValidateNested, ArrayMaxSize, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateImagenDto {
  @ApiProperty({ description: 'Base64 string de la imagen', example: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...' })
  @IsString()
  @IsNotEmpty()
  base64!: string;

  @ApiProperty({ description: 'Nombre de la imagen', example: 'producto-frente.jpg', required: false })
  @IsString()
  @IsOptional()
  nombre?: string;
}

export class CreateOfertaDto {
  @ApiProperty({ description: 'Título de la oferta', example: 'Libro de JavaScript Moderno' })
  @IsString()
  @IsNotEmpty()
  titulo!: string;

  @ApiProperty({ description: 'ID de la categoría', example: 'NyyClPAJJAAl' })
  @IsString()
  @IsNotEmpty()
  categoriaId!: string;

  @ApiProperty({ 
    description: 'Condiciones del trueque', 
    example: 'Libro en excelente estado, sin rayaduras' 
  })
  @IsString()
  @IsNotEmpty()
  condicionTrueque!: string;

  @ApiProperty({ 
    description: 'Comentario obligatorio (para análisis NLP)', 
    example: 'Busco intercambiar por otro libro de programación o novela de ficción' 
  })
  @IsString()
  @IsNotEmpty()
  comentarioObligatorio!: string;

  @ApiProperty({ description: 'Latitud de la ubicación', example: 11.0041072, minimum: -90, maximum: 90 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitud!: number;

  @ApiProperty({ description: 'Longitud de la ubicación', example: -74.8069813, minimum: -180, maximum: 180 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitud!: number;

  @ApiProperty({ 
    description: 'Imágenes de la oferta (máximo 3)', 
    type: [CreateImagenDto],
    required: true,
    maxItems: 3
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateImagenDto)
  @ArrayMaxSize(3, { message: 'No puedes subir más de 3 imágenes' })
  @IsNotEmpty({ message: 'Debes subir al menos una imagen' })
  imagenes!: CreateImagenDto[];
}

