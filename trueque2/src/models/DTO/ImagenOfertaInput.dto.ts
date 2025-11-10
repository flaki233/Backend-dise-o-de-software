import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ImagenOfertaInputDto {
  @ApiProperty({
    description: 'Nombre de la imagen',
    example: 'imagen_principal',
    maxLength: 55
  })
  @IsNotEmpty({ message: 'El nombre de la imagen es requerido' })
  @IsString({ message: 'El nombre de la imagen debe ser un texto' })
  @MaxLength(55, { message: 'El nombre de la imagen no debe exceder 55 caracteres' })
  imagen_oferta_nombre: string;

  @ApiProperty({
    description: 'Imagen en formato base64',
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...'
  })
  @IsNotEmpty({ message: 'La imagen en base64 es requerida' })
  @IsString({ message: 'La imagen base64 debe ser un texto' })
  imagen_base64: string;
}