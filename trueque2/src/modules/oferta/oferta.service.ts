import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryBuilder, Repository } from 'typeorm';
import { Oferta } from 'src/models/Oferta.entity';
import { CategoriaOferta } from 'src/models/CategoriaOferta.entity';
import { EstadoOferta } from 'src/models/EstadoOferta.entity';
import { OfertaDto } from 'src/models/DTO/Oferta.dto';
import { OfertaCreateDto } from 'src/models/DTO/OfertaCreate.dto';
import { OfertaUpdateDto } from 'src/models/DTO/OfertaUpdate.dto';
import { OfertaPaginateDto } from 'src/models/DTO/OfertaPaginate.dto';
import { OfertaFiltersDto } from 'src/models/DTO/OfertaFilters.dto';
import { ImagenOfertaService } from '../imagen-oferta/imagen-oferta.service';
 
@Injectable()
export class OfertaService {
  constructor(
    @InjectRepository(Oferta)
    private ofertaRepository: Repository<Oferta>,
    @InjectRepository(CategoriaOferta)
    private categoriaRepository: Repository<CategoriaOferta>,
    @InjectRepository(EstadoOferta)
    private estadoRepository: Repository<EstadoOferta>,
    @Inject(forwardRef(() => ImagenOfertaService))
    private imagenOfertaService: ImagenOfertaService,
  ) {}

  // Método para listar ofertas con paginación y filtros
  async getOfertas(page: number = 1, limit: number = 10, filters: OfertaFiltersDto = {}): Promise<OfertaPaginateDto> {
    const queryBuilder = this.ofertaRepository.createQueryBuilder('oferta')
      .leftJoinAndSelect('oferta.categoriaOferta', 'categoria')
      .leftJoinAndSelect('oferta.estadoOferta', 'estado');
  
    // Aplicar filtro de búsqueda en título
    if (filters.titulo) {
      queryBuilder.andWhere(
        '(oferta.oferta_titulo LIKE :search)',
        { search: `%${filters.titulo}%` }
      );
    }

    // Filtro por categoría
    if (filters.categoria_oferta_id) {
      queryBuilder.andWhere(
        '(categoria.categoria_oferta_id = :categoriaId)',
        { categoriaId: filters.categoria_oferta_id }
      );
    }

    // Filtro por estado de oferta
    if (filters.estado_oferta_id) {
      queryBuilder.andWhere(
        '(estado.estado_oferta_id = :estadoId)',
        { estadoId: filters.estado_oferta_id }
      );
    }

    // Filtro por estado de registro
    if (filters.estado !== undefined) {
      queryBuilder.andWhere(
        '(oferta.estado_registro = :status)',
        { status: filters.estado }
      );
    }

    // Ordenar por oferta_id de forma descendente
    queryBuilder.orderBy('oferta.oferta_id', 'DESC');
  
    // Paginación
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);
  
    // Ejecutar consulta
    const [ofertas, total] = await queryBuilder.getManyAndCount();
  
    // Mapear a DTO
    const ofertaDtos: OfertaDto[] = ofertas.map((oferta) => ({
      oferta_id: oferta.oferta_id,
      categoriaOferta: {
        categoria_oferta_id: oferta.categoriaOferta.categoria_oferta_id,
        categoria_oferta_nombre: oferta.categoriaOferta.categoria_oferta_nombre,
      },
      estadoOferta: {
        estado_oferta_id: oferta.estadoOferta.estado_oferta_id,
        estado_oferta_nombre: oferta.estadoOferta.estado_oferta_nombre,
      },
      oferta_titulo: oferta.oferta_titulo,
      oferta_condicion_trueque: oferta.oferta_condicion_trueque,
      oferta_comentario_obligatorio: oferta.oferta_comentario_obligatorio,
      oferta_latitud: oferta.oferta_latitud,
      oferta_longitud: oferta.oferta_longitud,
      usuario_creacion: oferta.usuario_creacion,
      fecha_creacion: oferta.fecha_creacion?.toISOString(),
      usuario_modificacion: oferta.usuario_modificacion,
      fecha_modificacion: oferta.fecha_modificacion?.toISOString(),
      estado_registro: oferta.estado_registro,
    }));
  
    return {
      data: ofertaDtos,
      total,
      page,
      limit,
    };
  }

  // Método para obtener los detalles de una oferta específica
  async getOfertaById(id: number): Promise<OfertaDto> {
    const oferta = await this.ofertaRepository.findOne({
      where: { oferta_id: id, estado_registro: 1 },
      relations: ['categoriaOferta', 'estadoOferta'],
    });

    if (!oferta) {
      throw new NotFoundException('Oferta no encontrada o ha sido eliminada');
    }

    return {
      oferta_id: oferta.oferta_id,
      categoriaOferta: {
        categoria_oferta_id: oferta.categoriaOferta.categoria_oferta_id,
        categoria_oferta_nombre: oferta.categoriaOferta.categoria_oferta_nombre,
      },
      estadoOferta: {
        estado_oferta_id: oferta.estadoOferta.estado_oferta_id,
        estado_oferta_nombre: oferta.estadoOferta.estado_oferta_nombre,
      },
      oferta_titulo: oferta.oferta_titulo,
      oferta_condicion_trueque: oferta.oferta_condicion_trueque,
      oferta_comentario_obligatorio: oferta.oferta_comentario_obligatorio,
      oferta_latitud: oferta.oferta_latitud,
      oferta_longitud: oferta.oferta_longitud,
      usuario_creacion: oferta.usuario_creacion,
      fecha_creacion: oferta.fecha_creacion?.toISOString(),
      usuario_modificacion: oferta.usuario_modificacion,
      fecha_modificacion: oferta.fecha_modificacion?.toISOString(),
      estado_registro: oferta.estado_registro,
    };
  }

  // Método para crear una nueva oferta
  async createOferta(createOfertaDto: OfertaCreateDto): Promise<OfertaDto> {
    // Verificar que la categoría existe
    const categoria = await this.categoriaRepository.findOne({
      where: { categoria_oferta_id: createOfertaDto.categoria_oferta_id, estado_registro: 1 },
    });

    if (!categoria) {
      throw new NotFoundException('Categoría no encontrada o ha sido eliminada');
    }

    // Verificar que el estado existe
    const estado = await this.estadoRepository.findOne({
      where: { estado_oferta_id: createOfertaDto.estado_oferta_id, estado_registro: 1 },
    });

    if (!estado) {
      throw new NotFoundException('Estado no encontrado o ha sido eliminado');
    }

    const oferta = this.ofertaRepository.create({
      categoriaOferta: categoria,
      estadoOferta: estado,
      oferta_titulo: createOfertaDto.oferta_titulo,
      oferta_condicion_trueque: createOfertaDto.oferta_condicion_trueque,
      oferta_comentario_obligatorio: createOfertaDto.oferta_comentario_obligatorio,
      oferta_latitud: createOfertaDto.oferta_latitud,
      oferta_longitud: createOfertaDto.oferta_longitud,
      estado_registro: 1,
      usuario_creacion: createOfertaDto.usuario_creacion || 'system',
      fecha_creacion: new Date(),
    });

    const savedOferta = await this.ofertaRepository.save(oferta);

    // Procesar imágenes si se proporcionaron
    if (createOfertaDto.imagenes && createOfertaDto.imagenes.length > 0) {
      for (const imagenInput of createOfertaDto.imagenes) {
        try {
          await this.imagenOfertaService.createImagenOfertaFromBase64(
            savedOferta.oferta_id,
            imagenInput.imagen_base64,
            imagenInput.imagen_oferta_nombre,
            createOfertaDto.usuario_creacion || 'system'
          );
        } catch (error) {
          // Si hay error guardando una imagen, continúa con las demás
          console.error(`Error al guardar imagen ${imagenInput.imagen_oferta_nombre}:`, error.message);
        }
      }
    }

    return {
      oferta_id: savedOferta.oferta_id,
      categoriaOferta: {
        categoria_oferta_id: categoria.categoria_oferta_id,
        categoria_oferta_nombre: categoria.categoria_oferta_nombre,
      },
      estadoOferta: {
        estado_oferta_id: estado.estado_oferta_id,
        estado_oferta_nombre: estado.estado_oferta_nombre,
      },
      oferta_titulo: savedOferta.oferta_titulo,
      oferta_condicion_trueque: savedOferta.oferta_condicion_trueque,
      oferta_comentario_obligatorio: savedOferta.oferta_comentario_obligatorio,
      oferta_latitud: savedOferta.oferta_latitud,
      oferta_longitud: savedOferta.oferta_longitud,
      usuario_creacion: savedOferta.usuario_creacion,
      fecha_creacion: savedOferta.fecha_creacion?.toISOString(),
      usuario_modificacion: savedOferta.usuario_modificacion,
      fecha_modificacion: savedOferta.fecha_modificacion?.toISOString(),
      estado_registro: savedOferta.estado_registro,
    };
  }

  // Método para crear una oferta con imágenes y retornar todo junto
  async createOfertaConImagenes(createOfertaDto: OfertaCreateDto): Promise<any> {
    // Crear la oferta primero
    const ofertaCreada = await this.createOferta(createOfertaDto);
    
    // Obtener las imágenes asociadas si se crearon
    let imagenes: any[] = [];
    if (createOfertaDto.imagenes && createOfertaDto.imagenes.length > 0) {
      try {
        imagenes = await this.imagenOfertaService.getImagenesByOfertaId(ofertaCreada.oferta_id);
      } catch (error) {
        console.error('Error al obtener imágenes de la oferta:', error.message);
      }
    }
    
    return {
      ...ofertaCreada,
      imagenes: imagenes
    };
  }

  // Método para obtener oferta con sus imágenes
  async getOfertaConImagenes(id: number): Promise<any> {
    const oferta = await this.getOfertaById(id);
    const imagenes = await this.imagenOfertaService.getImagenesByOfertaId(id);
    
    return {
      ...oferta,
      imagenes: imagenes
    };
  }

  // Método para actualizar una oferta existente
  async updateOferta(id: number, updateOfertaDto: OfertaUpdateDto): Promise<OfertaDto> {
    const oferta = await this.ofertaRepository.findOne({
      where: { oferta_id: id, estado_registro: 1 },
      relations: ['categoriaOferta', 'estadoOferta'],
    });

    if (!oferta) {
      throw new NotFoundException('Oferta no encontrada o ha sido eliminada');
    }

    // Verificar y actualizar categoría si se proporciona
    if (updateOfertaDto.categoria_oferta_id) {
      const categoria = await this.categoriaRepository.findOne({
        where: { categoria_oferta_id: updateOfertaDto.categoria_oferta_id, estado_registro: 1 },
      });

      if (!categoria) {
        throw new NotFoundException('Categoría no encontrada o ha sido eliminada');
      }
      oferta.categoriaOferta = categoria;
    }

    // Verificar y actualizar estado si se proporciona
    if (updateOfertaDto.estado_oferta_id) {
      const estado = await this.estadoRepository.findOne({
        where: { estado_oferta_id: updateOfertaDto.estado_oferta_id, estado_registro: 1 },
      });

      if (!estado) {
        throw new NotFoundException('Estado no encontrado o ha sido eliminado');
      }
      oferta.estadoOferta = estado;
    }

    // Actualizar campos si se proporcionan
    if (updateOfertaDto.oferta_titulo) {
      oferta.oferta_titulo = updateOfertaDto.oferta_titulo;
    }
    if (updateOfertaDto.oferta_condicion_trueque) {
      oferta.oferta_condicion_trueque = updateOfertaDto.oferta_condicion_trueque;
    }
    if (updateOfertaDto.oferta_comentario_obligatorio) {
      oferta.oferta_comentario_obligatorio = updateOfertaDto.oferta_comentario_obligatorio;
    }
    if (updateOfertaDto.oferta_latitud) {
      oferta.oferta_latitud = updateOfertaDto.oferta_latitud;
    }
    if (updateOfertaDto.oferta_longitud) {
      oferta.oferta_longitud = updateOfertaDto.oferta_longitud;
    }

    oferta.usuario_modificacion = updateOfertaDto.usuario_modificacion || 'system';
    oferta.fecha_modificacion = new Date();

    const updatedOferta = await this.ofertaRepository.save(oferta);

    return {
      oferta_id: updatedOferta.oferta_id,
      categoriaOferta: {
        categoria_oferta_id: updatedOferta.categoriaOferta.categoria_oferta_id,
        categoria_oferta_nombre: updatedOferta.categoriaOferta.categoria_oferta_nombre,
      },
      estadoOferta: {
        estado_oferta_id: updatedOferta.estadoOferta.estado_oferta_id,
        estado_oferta_nombre: updatedOferta.estadoOferta.estado_oferta_nombre,
      },
      oferta_titulo: updatedOferta.oferta_titulo,
      oferta_condicion_trueque: updatedOferta.oferta_condicion_trueque,
      oferta_comentario_obligatorio: updatedOferta.oferta_comentario_obligatorio,
      oferta_latitud: updatedOferta.oferta_latitud,
      oferta_longitud: updatedOferta.oferta_longitud,
      usuario_creacion: updatedOferta.usuario_creacion,
      fecha_creacion: updatedOferta.fecha_creacion?.toISOString(),
      usuario_modificacion: updatedOferta.usuario_modificacion,
      fecha_modificacion: updatedOferta.fecha_modificacion?.toISOString(),
      estado_registro: updatedOferta.estado_registro,
    };
  }

  // Método para "eliminar" una oferta (soft delete)
  async deleteOferta(id: number, usuario_modificacion: string): Promise<OfertaDto> {
    // Buscar la oferta
    const oferta = await this.ofertaRepository.findOne({
      where: { oferta_id: id, estado_registro: 1 },
      relations: ['categoriaOferta', 'estadoOferta'],
    });

    // Validar existencia
    if (!oferta) {
      throw new NotFoundException('Oferta no encontrada o ya ha sido eliminada');
    }
    
    // Actualizar estado_registro a 0
    oferta.estado_registro = 0;
    oferta.usuario_modificacion = usuario_modificacion || 'system';
    oferta.fecha_modificacion = new Date();

    // Guardar cambios
    const updatedOferta = await this.ofertaRepository.save(oferta);

    // Mapear a DTO
    return {
      oferta_id: updatedOferta.oferta_id,
      categoriaOferta: {
        categoria_oferta_id: updatedOferta.categoriaOferta.categoria_oferta_id,
        categoria_oferta_nombre: updatedOferta.categoriaOferta.categoria_oferta_nombre,
      },
      estadoOferta: {
        estado_oferta_id: updatedOferta.estadoOferta.estado_oferta_id,
        estado_oferta_nombre: updatedOferta.estadoOferta.estado_oferta_nombre,
      },
      oferta_titulo: updatedOferta.oferta_titulo,
      oferta_condicion_trueque: updatedOferta.oferta_condicion_trueque,
      oferta_comentario_obligatorio: updatedOferta.oferta_comentario_obligatorio,
      oferta_latitud: updatedOferta.oferta_latitud,
      oferta_longitud: updatedOferta.oferta_longitud,
      usuario_creacion: updatedOferta.usuario_creacion,
      fecha_creacion: updatedOferta.fecha_creacion?.toISOString(),
      usuario_modificacion: updatedOferta.usuario_modificacion,
      fecha_modificacion: updatedOferta.fecha_modificacion?.toISOString(),
      estado_registro: updatedOferta.estado_registro,
    };
  }
}