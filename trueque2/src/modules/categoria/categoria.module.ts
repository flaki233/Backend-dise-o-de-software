import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaService } from './categoria.service';
import { CategoriaController } from './categoria.controller';
import { CategoriaOferta } from 'src/models/CategoriaOferta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoriaOferta]),
  ],
  providers: [CategoriaService],
  controllers: [CategoriaController],
  exports: [CategoriaService],
})
export class CategoriaModule {}