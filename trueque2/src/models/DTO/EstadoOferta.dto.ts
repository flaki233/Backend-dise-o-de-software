import { ApiProperty } from '@nestjs/swagger';

export class EstadoOfertaDto {
    @ApiProperty({
        description: 'ID único del estado de oferta',
        example: 1,
    })
    estado_oferta_id: number;

    @ApiProperty({
        description: 'Nombre de la categoría de oferta',
        example: 'Borrador',
    })
    estado_oferta_nombre: string;

    @ApiProperty({
        description: 'Estado del registro (1: activo, 0: inactivo)',
        example: 1,
    })
    estado_registro: number;

    @ApiProperty({
        description: 'Usuario que creó el registro',
        example: 'admin',
    })
    usuario_creacion: string;

    @ApiProperty({
        description: 'Fecha de creación del registro',
        example: '2024-01-01T10:00:00Z',
    })
    fecha_creacion: string;

    @ApiProperty({
        description: 'Usuario que modificó el registro por última vez',
        example: 'admin',
    })
    usuario_modificacion: string;

    @ApiProperty({
        description: 'Fecha de última modificación del registro',
        example: '2024-01-01T10:00:00Z',
    })
    fecha_modificacion: string;
}