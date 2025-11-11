import { ApiProperty } from '@nestjs/swagger';
import { OfertaDto } from './Oferta.dto';

export class OfertaPaginateDto {
  @ApiProperty({
    description: 'Lista de ofertas',
    type: [OfertaDto]
  })
  data: OfertaDto[];

  @ApiProperty({
    description: 'Total de registros',
    example: 150
  })
  total: number;

  @ApiProperty({
    description: 'Página actual',
    example: 1
  })
  page: number;

  @ApiProperty({
    description: 'Elementos por página',
    example: 10
  })
  limit: number;
}