import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryBuilder, Repository } from 'typeorm';
import { EstadoOferta } from 'src/models/EstadoOferta.entity';
import { EstadoOfertaDto } from 'src/models/DTO/EstadoOferta.dto';
import { EstadoOfertaCreateDto } from 'src/models/DTO/EstadoOfertaCreate.dto';
import { EstadoOfertaUpdateDto } from 'src/models/DTO/EstadoOfertaUpdate.dto';
import { EstadoOfertaPaginateDto } from 'src/models/DTO/EstadoOfertaPaginate.dto';
//import { UpdatePaisEstadoDto } from 'src/models/DTO/UpdatePaisEstado.dto';
 
@Injectable()
export class EstadoService {
  constructor(
    @InjectRepository(EstadoOferta)
    private estadoRepository: Repository<EstadoOferta>,
  ) {}

  // Método para listar categorías con paginación y filtros
  
  async getEstados(page: number = 1, limit: number = 10, filters: any = {}): Promise<EstadoOfertaPaginateDto> {


    const queryBuilder = this.estadoRepository.createQueryBuilder('estado');
  
    // Aplicar filtro de búsqueda (search) en nombre o código
    if (filters.nombre) {
      queryBuilder.andWhere(
        '(estado.estado_oferta_nombre LIKE :search)',
        { search: `%${filters.nombre}%` }
      );
    }

    if (filters.estado) {
      queryBuilder.andWhere(
        '(estado.estado_registro = :status)',
        { status: `${filters.estado}` }
      );
    }

    // Ordenar por estado.estado_oferta_id de forma descendente
    queryBuilder.orderBy('estado.estado_oferta_id', 'DESC');
  
    // Paginación
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);
  
    // Ejecutar consulta
    const [estadoOferta, total] = await queryBuilder.getManyAndCount();
  
    // Mapear a DTO
    const estadoDtos: EstadoOfertaDto[] = estadoOferta.map((estado) => ({
      estado_oferta_id: estado.estado_oferta_id,
      estado_oferta_nombre: estado.estado_oferta_nombre,
      estado_registro: estado.estado_registro,
      usuario_creacion: estado.usuario_creacion,
      fecha_creacion: estado.fecha_creacion?.toISOString(),
      usuario_modificacion: estado.usuario_modificacion,
      fecha_modificacion: estado.fecha_modificacion?.toISOString(),
    }));
  
    return {
      data: estadoDtos,
      total,
      page,
      limit,
    };
  }

  // Método para obtener los detalles de una categoría específica
  async getEstadoById(id: number): Promise<EstadoOfertaDto> {
    const estado = await this.estadoRepository.findOne({
      where: { estado_oferta_id: id, estado_registro: 1 },
    });

    if (!estado) {
      throw new NotFoundException('Estado no encontrado o ha sido eliminado');
    }

    return {
      estado_oferta_id: estado.estado_oferta_id,
      estado_oferta_nombre: estado.estado_oferta_nombre,
      estado_registro: estado.estado_registro,
      usuario_creacion: estado.usuario_creacion,
      fecha_creacion: estado.fecha_creacion?.toISOString(),
      usuario_modificacion: estado.usuario_modificacion,
      fecha_modificacion: estado.fecha_modificacion?.toISOString(),
    };
  }

  // Método para crear una nueva categoria
  async createEstado(createEstadoDto: EstadoOfertaCreateDto): Promise<EstadoOfertaDto> {
    const estado = this.estadoRepository.create({
      estado_oferta_nombre: createEstadoDto.estado_oferta_nombre.toUpperCase(),
      estado_registro: 1,
      usuario_creacion: createEstadoDto.usuario_creacion || 'system',
      fecha_creacion: new Date(),
    });

    const savedEstado = await this.estadoRepository.save(estado);

    return {
      estado_oferta_id: savedEstado.estado_oferta_id,
      estado_oferta_nombre: savedEstado.estado_oferta_nombre,
      estado_registro: savedEstado.estado_registro,
      usuario_creacion: savedEstado.usuario_creacion,
      fecha_creacion: savedEstado.fecha_creacion?.toISOString(),
      usuario_modificacion: savedEstado.usuario_modificacion,
      fecha_modificacion: savedEstado.fecha_modificacion?.toISOString(),
    };
  }

  // Método para actualizar un país existente
  
  async updateEstado(updateEstadoDto: EstadoOfertaUpdateDto): Promise<EstadoOfertaDto> {
    const estado = await this.estadoRepository.findOne({
      where: { estado_oferta_id: updateEstadoDto.estado_oferta_id, estado_registro: 1 },
    });

    if (!estado) {
      throw new NotFoundException('Categoría no encontrada o ha sido eliminada');
    }

    estado.estado_oferta_nombre = updateEstadoDto.estado_oferta_nombre.toUpperCase();
    estado.usuario_modificacion = updateEstadoDto.usuario_modificacion || 'system';
    estado.fecha_modificacion = new Date();

    const updatedEstado = await this.estadoRepository.save(estado);

    return {
      estado_oferta_id: updatedEstado.estado_oferta_id,
      estado_oferta_nombre: updatedEstado.estado_oferta_nombre,
      estado_registro: updatedEstado.estado_registro,
      usuario_creacion: updatedEstado.usuario_creacion,
      fecha_creacion: updatedEstado.fecha_creacion?.toISOString(),
      usuario_modificacion: updatedEstado.usuario_modificacion,
      fecha_modificacion: updatedEstado.fecha_modificacion?.toISOString(),
    };
  }

  // Método para "eliminar" un país (soft delete)
  async deleteEstado(id: number, usuario_modificacion: string): Promise<EstadoOfertaDto> {
    // Buscar la categoría

    const estado = await this.estadoRepository.findOne({
      where: { estado_oferta_id: id, estado_registro: 1 },
    });

    // Validar existencia
    if (!estado) {
      throw new NotFoundException('Estado no encontrado o ya ha sido eliminado');
    }
    
    // Actualizar isDelete a 1
    estado.estado_registro = 0;
    estado.usuario_modificacion = usuario_modificacion || 'system';
    estado.fecha_modificacion = new Date();

    // Guardar cambios
    const updatedEstado = await this.estadoRepository.save(estado);

    // Mapear a DTO
    return {
      estado_oferta_id: updatedEstado.estado_oferta_id,
      estado_oferta_nombre: updatedEstado.estado_oferta_nombre,
      estado_registro: updatedEstado.estado_registro,
      usuario_creacion: updatedEstado.usuario_creacion,
      fecha_creacion: updatedEstado.fecha_creacion?.toISOString(),
      usuario_modificacion: updatedEstado.usuario_modificacion,
      fecha_modificacion: updatedEstado.fecha_modificacion?.toISOString(),
    };
  }
}