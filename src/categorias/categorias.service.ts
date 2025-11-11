import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoriaDto } from './dtos/create-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoriaDto) {
    return this.prisma.categoriaOferta.create({
      data: {
        nombre: dto.nombre,
      },
    });
  }

  async findAll() {
    return this.prisma.categoriaOferta.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: number) {
    const categoria = await this.prisma.categoriaOferta.findFirst({
      where: { id, activo: true },
    });

    if (!categoria) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return categoria;
  }

  async update(id: number, dto: CreateCategoriaDto) {
    const categoria = await this.findOne(id);

    return this.prisma.categoriaOferta.update({
      where: { id: categoria.id },
      data: { nombre: dto.nombre },
    });
  }

  async remove(id: number) {
    const categoria = await this.findOne(id);

    await this.prisma.categoriaOferta.update({
      where: { id: categoria.id },
      data: { activo: false },
    });

    return { message: 'Categoría eliminada correctamente' };
  }
}

