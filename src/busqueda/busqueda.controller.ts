// src/busqueda/busqueda.controller.ts
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BusquedaService } from './busqueda.service';
import { ListBusquedaDto } from './dtos/list-busqueda.dto';

@ApiTags('Busqueda')
@Controller('busqueda')
export class BusquedaController {
  constructor(private readonly svc: BusquedaService) {}

  // PUNTO 2 – búsqueda híbrida
  @Get('ofertas')
  @ApiOperation({
    summary: 'Búsqueda híbrida de ofertas (texto + semántica)',
  })
  async list(@Query() query: ListBusquedaDto) {
    return this.svc.list(query);
  }

  // PUNTO 3 – sugerencias personalizadas
  @Get('suggestions/:userId')
  @ApiOperation({
    summary:
      'Sugerencias personalizadas basadas en historial e IA (Punto 3)',
  })
  async suggestions(
    @Param('userId') userId: string,
    @Query('categoria') categoria?: string,
  ) {
    return this.svc.getSuggestions(userId, categoria);
  }
}
