import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, ForbiddenException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TradesService } from './trades.service';
import { AuthGuard } from '@nestjs/passport';
import { ConfirmTradeDto, CreateTradeDto, DecisionDto } from './dtos';

@ApiTags('Trueques')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('trades')
export class TradesController {
  constructor(private readonly trades: TradesService) {}

  @Post()
  create(@Body() dto: CreateTradeDto) {
    return this.trades.create(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.trades.findOne(id);
  }

  @Get(':id/closure')
  getClosure(@Param('id', ParseIntPipe) id: number) {
    return this.trades.getClosure(id);
  }

  // confirmación bilateral: aceptar/rechazar
  @Post(':id/confirm')
  confirm(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ConfirmTradeDto,
  ) {
    return this.trades.confirm(id, dto);
  }

  // atajo: solo decisión (accept / reject) deduciendo el usuario desde el token dentro del DTO
  @Post(':id/decision')
  decide(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: DecisionDto,
  ) {
    if (dto.decision === 'accept') return this.trades.confirm(id, { userId: dto.userId, accept: true });
    if (dto.decision === 'reject') return this.trades.confirm(id, { userId: dto.userId, accept: false });
    throw new ForbiddenException('Decision inválida');
  }
}
