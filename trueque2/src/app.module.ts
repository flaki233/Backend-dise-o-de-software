import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriaModule } from './modules/categoria/categoria.module';
import { EstadoModule } from './modules/estado/estado.module';
import { OfertaModule } from './modules/oferta/oferta.module';
import { CategoriaOferta } from './models/CategoriaOferta.entity';
import { Oferta } from './models/Oferta.entity';
import { EstadoOferta } from './models/EstadoOferta.entity';
import { ImagenOferta } from './models/ImagenOferta.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '12345',
      database: process.env.DB_NAME || 'trueque',
      entities: [CategoriaOferta, Oferta, EstadoOferta, ImagenOferta],
      synchronize: false, // Changed to false to prevent automatic schema changes
      logging: true,
    }),
    CategoriaModule,
    EstadoModule,
    OfertaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
