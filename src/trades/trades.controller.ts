import { Body, Controller, Get, Param, Post, UseGuards, ForbiddenException, Req } from '@nestjs/common';
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

  @Get('me')
  findMine(@Req() req: any) {
    return this.trades.findAllForUser(req.user.userId);
  }

  @Post()
  create(@Body() dto: CreateTradeDto) {
    return this.trades.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trades.findOne(id);
  }

  @Get(':id/closure')
  getClosure(@Param('id') id: string) {
    return this.trades.getClosure(id);
  }

  @Post(':id/confirm')
  confirm(
    @Param('id') id: string,
    @Body() dto: ConfirmTradeDto,
  ) {
    return this.trades.confirm(id, dto);
  }

  @Post(':id/decision')
  decide(
    @Param('id') id: string,
    @Body() dto: DecisionDto,
  ) {
    if (dto.decision === 'accept') return this.trades.confirm(id, { userId: dto.userId, accept: true });
    if (dto.decision === 'reject') return this.trades.confirm(id, { userId: dto.userId, accept: false });
    throw new ForbiddenException('Decision inválida');
  }
}
