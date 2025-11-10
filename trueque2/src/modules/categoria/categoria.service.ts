import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryBuilder, Repository } from 'typeorm';
import { CategoriaOferta } from 'src/models/CategoriaOferta.entity';
import { CategoriaOfertaDto } from 'src/models/DTO/CategoriaOferta.dto';
import { CategoriaOfertaCreateDto } from 'src/models/DTO/CategoriaOfertaCreate.dto';
import { CategoriaOfertaUpdateDto } from 'src/models/DTO/CategoriaOfertaUpdate.dto';
import { CategoriaOfertaPaginateDto } from 'src/models/DTO/CategoriaOfertaPaginate.dto';
//import { UpdatePaisEstadoDto } from 'src/models/DTO/UpdatePaisEstado.dto';
 
@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(CategoriaOferta)
    private categoriaRepository: Repository<CategoriaOferta>,
  ) {}

  // Método para listar categorías con paginación y filtros
  
  async getCategorias(page: number = 1, limit: number = 10, filters: any = {}): Promise<CategoriaOfertaPaginateDto> {


    const queryBuilder = this.categoriaRepository.createQueryBuilder('categoria');
  
    // Aplicar filtro de búsqueda (search) en nombre o código
    if (filters.nombre) {
      queryBuilder.andWhere(
        '(categoria.categoria_oferta_nombre LIKE :search)',
        { search: `%${filters.nombre}%` }
      );
    }

    if (filters.estado) {
      queryBuilder.andWhere(
        '(categoria.estado_registro = :status)',
        { status: `${filters.estado}` }
      );
    }

    // Ordenar por categoria.categoria_oferta_id de forma descendente
    queryBuilder.orderBy('categoria.categoria_oferta_id', 'DESC');
  
    // Paginación
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);
  
    // Ejecutar consulta
    const [categoriasOfertas, total] = await queryBuilder.getManyAndCount();
  
    // Mapear a DTO
    const categoriaDtos: CategoriaOfertaDto[] = categoriasOfertas.map((categoria) => ({
      categoria_oferta_id: categoria.categoria_oferta_id,
      categoria_oferta_nombre: categoria.categoria_oferta_nombre,
      estado_registro: categoria.estado_registro,
      usuario_creacion: categoria.usuario_creacion,
      fecha_creacion: categoria.fecha_creacion?.toISOString(),
      usuario_modificacion: categoria.usuario_modificacion,
      fecha_modificacion: categoria.fecha_modificacion?.toISOString(),
    }));
  
    return {
      data: categoriaDtos,
      total,
      page,
      limit,
    };
  }

  // Método para obtener los detalles de una categoría específica
  async getCategoriaById(id: number): Promise<CategoriaOfertaDto> {
    const categoria = await this.categoriaRepository.findOne({
      where: { categoria_oferta_id: id, estado_registro: 1 },
    });

    if (!categoria) {
      throw new NotFoundException('Categoria no encontrado o ha sido eliminado');
    }

    return {
      categoria_oferta_id: categoria.categoria_oferta_id,
      categoria_oferta_nombre: categoria.categoria_oferta_nombre,
      estado_registro: categoria.estado_registro,
      usuario_creacion: categoria.usuario_creacion,
      fecha_creacion: categoria.fecha_creacion?.toISOString(),
      usuario_modificacion: categoria.usuario_modificacion,
      fecha_modificacion: categoria.fecha_modificacion?.toISOString(),
    };
  }

  // Método para crear una nueva categoria
  async createCategoria(createCategoriaDto: CategoriaOfertaCreateDto): Promise<CategoriaOfertaDto> {
    const categoria = this.categoriaRepository.create({
      categoria_oferta_nombre: createCategoriaDto.categoria_oferta_nombre.toUpperCase(),
      estado_registro: 1,
      usuario_creacion: createCategoriaDto.usuario_creacion || 'system',
      fecha_creacion: new Date(),
    });

    const savedCategoria = await this.categoriaRepository.save(categoria);

    return {
      categoria_oferta_id: savedCategoria.categoria_oferta_id,
      categoria_oferta_nombre: savedCategoria.categoria_oferta_nombre,
      estado_registro: savedCategoria.estado_registro,
      usuario_creacion: savedCategoria.usuario_creacion,
      fecha_creacion: savedCategoria.fecha_creacion?.toISOString(),
      usuario_modificacion: savedCategoria.usuario_modificacion,
      fecha_modificacion: savedCategoria.fecha_modificacion?.toISOString(),
    };
  }

  // Método para actualizar un país existente
  
  async updateCategoria(updateCategoriaDto: CategoriaOfertaUpdateDto): Promise<CategoriaOfertaDto> {
    const categoria = await this.categoriaRepository.findOne({
      where: { categoria_oferta_id: updateCategoriaDto.categoria_oferta_id, estado_registro: 1 },
    });

    if (!categoria) {
      throw new NotFoundException('Categoría no encontrada o ha sido eliminada');
    }

    categoria.categoria_oferta_nombre = updateCategoriaDto.categoria_oferta_nombre.toUpperCase();
    categoria.usuario_modificacion = updateCategoriaDto.usuario_modificacion || 'system';
    categoria.fecha_modificacion = new Date();

    const updatedCategoria = await this.categoriaRepository.save(categoria);

    return {
      categoria_oferta_id: updatedCategoria.categoria_oferta_id,
      categoria_oferta_nombre: updatedCategoria.categoria_oferta_nombre,
      estado_registro: updatedCategoria.estado_registro,
      usuario_creacion: updatedCategoria.usuario_creacion,
      fecha_creacion: updatedCategoria.fecha_creacion?.toISOString(),
      usuario_modificacion: updatedCategoria.usuario_modificacion,
      fecha_modificacion: updatedCategoria.fecha_modificacion?.toISOString(),
    };
  }

  // Método para "eliminar" un país (soft delete)
  async deleteCategoria(id: number, usuario_modificacion: string): Promise<CategoriaOfertaDto> {
    // Buscar la categoría
    const categoria = await this.categoriaRepository.findOne({
      where: { categoria_oferta_id: id, estado_registro: 1 },
    });

    // Validar existencia
    if (!categoria) {
      throw new NotFoundException('Categoría no encontrada o ya ha sido eliminada');
    }
    
    // Actualizar isDelete a 1
    categoria.estado_registro = 0;
    categoria.usuario_modificacion = usuario_modificacion || 'system';
    categoria.fecha_modificacion = new Date();

    // Guardar cambios
    const updatedCategoria = await this.categoriaRepository.save(categoria);

    // Mapear a DTO
    return {
      categoria_oferta_id: updatedCategoria.categoria_oferta_id,
      categoria_oferta_nombre: updatedCategoria.categoria_oferta_nombre,
      estado_registro: updatedCategoria.estado_registro,
      usuario_creacion: updatedCategoria.usuario_creacion,
      fecha_creacion: updatedCategoria.fecha_creacion?.toISOString(),
      usuario_modificacion: updatedCategoria.usuario_modificacion,
      fecha_modificacion: updatedCategoria.fecha_modificacion?.toISOString(),
    };
  }
}