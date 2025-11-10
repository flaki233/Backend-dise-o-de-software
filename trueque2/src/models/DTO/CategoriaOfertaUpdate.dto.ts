import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt } from 'class-validator';

export class CategoriaOfertaUpdateDto {

    @ApiProperty({
        description: 'ID de la categoría de oferta',
        example: 1,
    })
    @IsInt()
    categoria_oferta_id: number;

  @ApiProperty({
    description: 'Nombre de la categoría de oferta',
    example: 'Electrónicos',
  })
  @IsString()
  categoria_oferta_nombre: string;

  @ApiProperty({
    description: 'Usuario que modifica la categoría',
    example: 'admin',
    required: true,
  })
  @IsString()
  usuario_modificacion: string;
}