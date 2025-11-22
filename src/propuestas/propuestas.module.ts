import { Module } from '@nestjs/common';
import { PropuestasController } from './propuestas.controller';
import { PropuestasService } from './propuestas.service';
import { RobleModule } from '../roble/roble.module';

@Module({
  imports: [RobleModule],
  controllers: [PropuestasController],
  providers: [PropuestasService],
})
export class PropuestasModule {}
