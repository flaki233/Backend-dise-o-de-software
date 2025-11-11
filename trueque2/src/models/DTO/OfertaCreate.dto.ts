import { IsNotEmpty, IsString, IsNumber, IsOptional, Min, Max, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ImagenOfertaInputDto } from './ImagenOfertaInput.dto';

export class OfertaCreateDto {
  @ApiProperty({
    description: 'ID de la categoría de la oferta',
    example: 1,
    type: Number
  })
  @IsNumber()
  categoria_oferta_id?: number;

  @ApiProperty({
    description: 'ID del estado de la oferta',
    example: 1,
    type: Number
  })
  @IsNotEmpty()
  @IsNumber()
  estado_oferta_id: number;

  @ApiProperty({
    description: 'Título de la oferta',
    example: 'Intercambio de libros de programación',
    maxLength: 255
  })
  @IsNotEmpty()
  @IsString()
  oferta_titulo: string;

  @ApiProperty({
    description: 'Condiciones del trueque',
    example: 'Libros en buen estado, sin páginas rotas',
    maxLength: 255
  })
  @IsNotEmpty()
  @IsString()
  oferta_condicion_trueque: string;

  @ApiProperty({
    description: 'Comentario obligatorio para la oferta',
    example: 'Disponible para intercambio los fines de semana',
    maxLength: 255
  })
  @IsNotEmpty()
  @IsString()
  oferta_comentario_obligatorio: string;

  @ApiProperty({
    description: 'Latitud de la ubicación',
    example: -12.046373,
    type: Number,
    minimum: -90,
    maximum: 90
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(-90)
  @Max(90)
  oferta_latitud: number;

  @ApiProperty({
    description: 'Longitud de la ubicación',
    example: -77.042754,
    type: Number,
    minimum: -180,
    maximum: 180
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(-180)
  @Max(180)
  oferta_longitud: number;

  @ApiProperty({
    description: 'Usuario que crea la oferta',
    example: 'admin',
    required: false
  })
  @IsOptional()
  @IsString()
  usuario_creacion?: string;

  @ApiProperty({
    description: 'Imágenes de la oferta (de 1 a muchas)',
    type: [ImagenOfertaInputDto],
    required: false,
    example: [
      {
        imagen_oferta_nombre: 'imagen_principal',
        imagen_base64: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...'
      },
      {
        imagen_oferta_nombre: 'imagen_secundaria',
        imagen_base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQ...'
      }
    ]
  })
  @IsOptional()
  @IsArray({ message: 'Las imágenes deben ser un array' })
  @ValidateNested({ each: true })
  @Type(() => ImagenOfertaInputDto)
  imagenes?: ImagenOfertaInputDto[];
}