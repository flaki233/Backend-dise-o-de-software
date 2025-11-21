import { Module } from '@nestjs/common';
import { SuggestionsController } from './suggestions.controller';
import { SuggestionsService } from './suggestions.service';
import { RobleService } from '../roble/roble.service';

@Module({
  controllers: [SuggestionsController],
  providers: [SuggestionsService, RobleService],
})
export class SuggestionsModule {}
