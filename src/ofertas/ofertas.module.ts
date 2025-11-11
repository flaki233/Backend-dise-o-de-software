import { Module } from '@nestjs/common';
import { OfertasService } from './ofertas.service';
import { OfertasController } from './ofertas.controller';
import { RobleModule } from '../roble/roble.module';

@Module({
  imports: [RobleModule],
  controllers: [OfertasController],
  providers: [OfertasService],
  exports: [OfertasService],
})
export class OfertasModule {}

