import { Module } from '@nestjs/common';
import { PropuestasController } from './propuestas.controller';
import { PropuestasService } from './propuestas.service';
import { RobleService } from '../roble/roble.service';

@Module({
  controllers: [PropuestasController],
  providers: [PropuestasService, RobleService],
})
export class PropuestasModule {}
