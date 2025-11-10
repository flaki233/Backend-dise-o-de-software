import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagenOfertaController } from './imagen-oferta.controller';
import { ImagenOfertaService } from './imagen-oferta.service';
import { ImagenOferta } from 'src/models/ImagenOferta.entity';
import { Oferta } from 'src/models/Oferta.entity';
import { OfertaModule } from '../oferta/oferta.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImagenOferta, Oferta]),
    forwardRef(() => OfertaModule)
  ],
  controllers: [ImagenOfertaController],
  providers: [ImagenOfertaService],
  exports: [ImagenOfertaService],
})
export class ImagenOfertaModule {}