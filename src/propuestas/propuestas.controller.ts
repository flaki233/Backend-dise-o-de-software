import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PropuestasService } from './propuestas.service';
import { CreatePropuestaDto } from './dtos/create-propuesta.dto';
import { PropuestaDecisionDto } from './dtos/decision.dto';

@ApiTags('Propuestas')
@Controller('propuestas')
export class PropuestasController {
  constructor(private readonly svc: PropuestasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear propuesta de trueque (estado inicial: PENDIENTE)' })
  create(@Body() dto: CreatePropuestaDto) {
    return this.svc.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de una propuesta' })
  getOne(@Param('id') id: string) {
    return this.svc.getOne(id);
  }

  @Post(':id/decision')
  @ApiOperation({ summary: 'Aceptar o rechazar la propuesta (actor: responder)' })
  decide(@Param('id') id: string, @Body() dto: PropuestaDecisionDto) {
    return this.svc.decide(id, dto);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancelar propuesta (mientras esté PENDIENTE)' })
  cancel(@Param('id') id: string, @Query('actorId') actorId: string) {
    return this.svc.cancel(id, actorId);
  }

  @Get(':id/auditoria')
  @ApiOperation({ summary: 'Historial de eventos/auditoría de la propuesta' })
  audit(@Param('id') id: string) {
    return this.svc.auditTrail(id);
  }
}
