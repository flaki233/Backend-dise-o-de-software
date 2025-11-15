import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MatchAuditService } from './match-audit.service';
import { CreateMatchAuditDto } from './dtos/create-match-audit.dto';
import { ListMatchAuditQueryDto } from './dtos/list-match-audit.query.dto';

@ApiTags('Auditoría de matches')
@Controller('auditoria/matches')
export class MatchAuditController {
  constructor(private service: MatchAuditService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar evento de auditoría' })
  create(@Body() dto: CreateMatchAuditDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar eventos con filtros y paginación' })
  list(@Query() q: ListMatchAuditQueryDto) {
    return this.service.list(q);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalle por _id' })
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Get('stats/overview')
  @ApiOperation({ summary: 'KPIs de auditoría' })
  stats(@Query() q: { from?: string; to?: string; correlationId?: string }) {
    return this.service.stats(q);
  }
}
