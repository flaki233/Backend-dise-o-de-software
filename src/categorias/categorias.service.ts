import { Injectable, NotFoundException } from '@nestjs/common';
import { RobleRepository } from '../roble/roble.repository';
import { RobleService } from '../roble/roble.service';
import { CreateCategoriaDto } from './dtos/create-categoria.dto';
import { UpdateCategoriaDto } from './dtos/update-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(
    private robleRepo: RobleRepository,
    private robleService: RobleService,
  ) {}

  async create(dto: CreateCategoriaDto, robleToken?: string) {
    if (robleToken) this.robleService.setAccessToken(robleToken);
    return this.robleRepo.createCategoria({
      nombre: dto.nombre,
    });
  }

  async findAll() {
    return this.robleRepo.findAllCategorias();
  }

  async findOne(id: string) {
    const categoria = await this.robleRepo.findCategoriaById(id);
    if (!categoria) {
      throw new NotFoundException('Categoría no encontrada');
    }
    return categoria;
  }

  async update(id: string, dto: UpdateCategoriaDto, robleToken?: string) {
    if (robleToken) this.robleService.setAccessToken(robleToken);
    const categoria = await this.robleRepo.findCategoriaById(id);
    if (!categoria) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return this.robleRepo.updateCategoria(id, dto);
  }

  async remove(id: string, robleToken?: string) {
    if (robleToken) this.robleService.setAccessToken(robleToken);
    const categoria = await this.robleRepo.findCategoriaById(id);
    if (!categoria) {
      throw new NotFoundException('Categoría no encontrada');
    }

    await this.robleRepo.updateCategoria(id, { activo: false });
    return { message: 'Categoría eliminada correctamente' };
  }
}
