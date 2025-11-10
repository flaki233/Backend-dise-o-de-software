import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt } from 'class-validator';

export class EstadoOfertaUpdateDto {

    @ApiProperty({
        description: 'ID del estado de oferta',
        example: 1,
    })
    @IsInt()
    estado_oferta_id: number;

  @ApiProperty({
    description: 'Nombre de la categoría de oferta',
    example: 'Borrador',
  })
  @IsString()
  estado_oferta_nombre: string;

  @ApiProperty({
    description: 'Usuario que modifica la categoría',
    example: 'admin',
    required: true,
  })
  @IsString()
  usuario_modificacion: string;
}