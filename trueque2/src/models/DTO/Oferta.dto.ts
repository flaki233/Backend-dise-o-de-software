import { ApiProperty } from '@nestjs/swagger';

export class OfertaDto {
  @ApiProperty({
    description: 'ID único de la oferta',
    example: 1
  })
  oferta_id: number;

  @ApiProperty({
    description: 'Información de la categoría',
    type: 'object',
    properties: {
      categoria_oferta_id: { type: 'number', example: 1 },
      categoria_oferta_nombre: { type: 'string', example: 'Libros' }
    }
  })
  categoriaOferta: {
    categoria_oferta_id: number;
    categoria_oferta_nombre: string;
  };

  @ApiProperty({
    description: 'Información del estado',
    type: 'object',
    properties: {
      estado_oferta_id: { type: 'number', example: 1 },
      estado_oferta_nombre: { type: 'string', example: 'Activo' }
    }
  })
  estadoOferta: {
    estado_oferta_id: number;
    estado_oferta_nombre: string;
  };

  @ApiProperty({
    description: 'Título de la oferta',
    example: 'Intercambio de libros de programación'
  })
  oferta_titulo: string;

  @ApiProperty({
    description: 'Condiciones del trueque',
    example: 'Libros en buen estado, sin páginas rotas'
  })
  oferta_condicion_trueque: string;

  @ApiProperty({
    description: 'Comentario obligatorio',
    example: 'Disponible para intercambio los fines de semana'
  })
  oferta_comentario_obligatorio: string;

  @ApiProperty({
    description: 'Latitud de la ubicación',
    example: -12.046373
  })
  oferta_latitud: number;

  @ApiProperty({
    description: 'Longitud de la ubicación',
    example: -77.042754
  })
  oferta_longitud: number;

  @ApiProperty({
    description: 'Usuario que creó la oferta',
    example: 'admin',
    required: false
  })
  usuario_creacion?: string;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2023-11-03T10:30:00.000Z',
    required: false
  })
  fecha_creacion?: string;

  @ApiProperty({
    description: 'Usuario que modificó la oferta',
    example: 'admin',
    required: false
  })
  usuario_modificacion?: string;

  @ApiProperty({
    description: 'Fecha de modificación',
    example: '2023-11-03T11:45:00.000Z',
    required: false
  })
  fecha_modificacion?: string;

  @ApiProperty({
    description: 'Estado del registro (1: activo, 0: inactivo)',
    example: 1,
    required: false
  })
  estado_registro?: number;
}