import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CategoriaOfertaCreateDto {
  @ApiProperty({
    description: 'Nombre de la categoría de oferta',
    example: 'Electrónicos',
  })
  @IsString()
  categoria_oferta_nombre: string;

  @ApiProperty({
    description: 'Usuario que crea la categoría',
    example: 'admin',
    required: false,
  })
  @IsString()
  @IsOptional()
  usuario_creacion?: string;
}