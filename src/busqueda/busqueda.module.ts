import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BusquedaController } from './busqueda.controller';
import { BusquedaService } from './busqueda.service';

@Module({
  imports: [HttpModule],
  controllers: [BusquedaController],
  providers: [BusquedaService],
  exports: [BusquedaService],
})
export class BusquedaModule {}
