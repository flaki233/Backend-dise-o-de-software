import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExplorarService } from './explorar.service';
import { ListQueryDto } from './dtos/list.query.dto';

@ApiTags('Explorar')
@Controller('explorar')
export class ExplorarController {
  constructor(private readonly svc: ExplorarService) {}

  @Get('ofertas')
  @ApiOperation({ summary: 'Listado general de ofertas con paginación' })
  async list(@Query() query: ListQueryDto) {
    return this.svc.list(query);
  }

  @Get('ofertas/:id')
  @ApiOperation({ summary: 'Detalle de una oferta con galería de imágenes' })
  async findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }
}
