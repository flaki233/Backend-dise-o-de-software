// src/suggestions/suggestions.controller.ts
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SuggestionsService } from './suggestions.service';
import { SuggestionQueryDto } from './dtos/suggestion-query.dto';

@ApiTags('Sugerencias')
@Controller('suggestions')
export class SuggestionsController {
  constructor(private readonly svc: SuggestionsService) {}

  @Get(':userId')
  @ApiOperation({
    summary: 'Sugerencias personalizadas para un usuario',
    description:
      'Basadas en historial de ofertas del usuario y afinidad por categorías. ' +
      'No incluye ofertas propias.',
  })
  async getSuggestions(
    @Param('userId') userId: string,
    @Query() query: SuggestionQueryDto,
  ) {
    return this.svc.getSuggestionsForUser(userId, query);
  }
}
