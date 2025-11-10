import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfertaController } from './oferta.controller';
import { OfertaService } from './oferta.service';
import { Oferta } from 'src/models/Oferta.entity';
import { CategoriaOferta } from 'src/models/CategoriaOferta.entity';
import { EstadoOferta } from 'src/models/EstadoOferta.entity';
import { ImagenOfertaModule } from '../imagen-oferta/imagen-oferta.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Oferta, CategoriaOferta, EstadoOferta]),
    forwardRef(() => ImagenOfertaModule)
  ],
  controllers: [OfertaController],
  providers: [OfertaService],
  exports: [OfertaService],
})
export class OfertaModule {}