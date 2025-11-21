import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePropuestaDto {
  @ApiProperty({ example: 'userA-123' })
  @IsString() @IsNotEmpty()
  proposerId!: string;

  @ApiProperty({ example: 'userB-456' })
  @IsString() @IsNotEmpty()
  responderId!: string;

  @ApiProperty({ example: 'oferta-AAA' })
  @IsString() @IsNotEmpty()
  ofertaAId!: string; // oferta del proponente

  @ApiProperty({ example: 'oferta-BBB' })
  @IsString() @IsNotEmpty()
  ofertaBId!: string; // oferta del receptor

  @ApiProperty({ example: '¿Te interesa? puedo entregar hoy', required: false })
  @IsOptional() @IsString()
  mensaje?: string;
}
