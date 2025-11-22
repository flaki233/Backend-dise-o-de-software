import { Module } from '@nestjs/common';
import { ExplorarController } from './explorar.controller';
import { ExplorarService } from './explorar.service';
import { RobleModule } from '../roble/roble.module';

@Module({
  imports: [RobleModule],          // 👈 importar el módulo de Roble
  controllers: [ExplorarController],
  providers: [ExplorarService],    // 👈 SOLO tu servicio, sin RobleService
})
export class ExplorarModule {}
