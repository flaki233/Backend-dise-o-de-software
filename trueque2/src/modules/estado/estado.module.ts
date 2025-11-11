import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadoService } from './estado.service';
import { EstadoController } from './estado.controller';
import { EstadoOferta } from 'src/models/EstadoOferta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EstadoOferta]),
  ],
  providers: [EstadoService],
  controllers: [EstadoController],
  exports: [EstadoService],
})
export class EstadoModule {}