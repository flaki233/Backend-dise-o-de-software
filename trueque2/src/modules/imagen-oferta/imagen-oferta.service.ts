import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImagenOferta } from 'src/models/ImagenOferta.entity';
import { Oferta } from 'src/models/Oferta.entity';
import { ImagenOfertaDto } from 'src/models/DTO/ImagenOferta.dto';
import { ImagenOfertaCreateDto } from 'src/models/DTO/ImagenOfertaCreate.dto';
import { ImagenOfertaUpdateDto } from 'src/models/DTO/ImagenOfertaUpdate.dto';
import { ImagenOfertaPaginateDto } from 'src/models/DTO/ImagenOfertaPaginate.dto';
import { ImagenOfertaFiltersDto } from 'src/models/DTO/ImagenOfertaFilters.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImagenOfertaService {
  constructor(
    @InjectRepository(ImagenOferta)
    private imagenOfertaRepository: Repository<ImagenOferta>,
    @InjectRepository(Oferta)
    private ofertaRepository: Repository<Oferta>,
  ) {}

  // Método privado para procesar imagen base64 y guardarla localmente
  private async processBase64Image(base64String: string, fileName: string): Promise<string> {
    try {
      // Verificar que el base64 tiene el formato correcto
      const base64Data = base64String.includes(',') 
        ? base64String.split(',')[1] 
        : base64String;

      // Extraer el tipo de imagen del header base64
      const mimeMatch = base64String.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      
      // Obtener la extensión del archivo
      const extension = mimeType.split('/')[1] || 'jpg';
      
      // Generar nombre único para evitar conflictos
      const timestamp = Date.now();
      const uniqueFileName = `${fileName.replace(/\.[^/.]+$/, "")}_${timestamp}.${extension}`;
      
      // Crear directorio si no existe
      const uploadDir = path.join(process.cwd(), 'uploads', 'images');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      // Ruta completa del archivo
      const filePath = path.join(uploadDir, uniqueFileName);
      const relativePath = path.join('uploads', 'images', uniqueFileName);
      
      // Convertir base64 a buffer y guardar archivo
      const buffer = Buffer.from(base64Data, 'base64');
      fs.writeFileSync(filePath, buffer);
      
      // Retornar la ruta relativa para guardar en la base de datos
      return relativePath;
      
    } catch (error) {
      throw new BadRequestException('Error al procesar la imagen base64: ' + error.message);
    }
  }

  // Método privado para extraer el nombre del archivo desde base64 o usar el proporcionado
  private extractFileName(base64String: string, providedName: string): string {
    // Si se proporciona un nombre, usarlo
    if (providedName && providedName.trim()) {
      return providedName.trim();
    }
    
    // Si no, generar un nombre basado en timestamp
    return `imagen_${Date.now()}`;
  }

  // Método para listar imágenes de ofertas con paginación y filtros
  async getImagenesOferta(page: number = 1, limit: number = 10, filters: ImagenOfertaFiltersDto = {}): Promise<ImagenOfertaPaginateDto> {
    const queryBuilder = this.imagenOfertaRepository.createQueryBuilder('imagenOferta')
      .leftJoinAndSelect('imagenOferta.oferta', 'oferta')
      .leftJoinAndSelect('oferta.categoriaOferta', 'categoria')
      .leftJoinAndSelect('oferta.estadoOferta', 'estado');

    // Aplicar filtro por oferta ID
    if (filters.oferta_id) {
      queryBuilder.andWhere(
        '(oferta.oferta_id = :ofertaId)',
        { ofertaId: filters.oferta_id }
      );
    }

    // Aplicar filtro de búsqueda en nombre de imagen
    if (filters.imagen_oferta_nombre) {
      queryBuilder.andWhere(
        '(imagenOferta.imagen_oferta_nombre LIKE :search)',
        { search: `%${filters.imagen_oferta_nombre}%` }
      );
    }

    // Filtro por estado de registro
    if (filters.estado !== undefined) {
      queryBuilder.andWhere(
        '(imagenOferta.estado_registro = :status)',
        { status: filters.estado }
      );
    }

    // Ordenar por imagen_oferta_id de forma descendente
    queryBuilder.orderBy('imagenOferta.imagen_oferta_id', 'DESC');

    // Paginación
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Ejecutar consulta
    const [imagenesOferta, total] = await queryBuilder.getManyAndCount();

    // Mapear a DTO
    const imagenOfertaDtos: ImagenOfertaDto[] = imagenesOferta.map((imagenOferta) => ({
      imagen_oferta_id: imagenOferta.imagen_oferta_id,
      oferta: {
        oferta_id: imagenOferta.oferta.oferta_id,
        categoriaOferta: {
          categoria_oferta_id: imagenOferta.oferta.categoriaOferta.categoria_oferta_id,
          categoria_oferta_nombre: imagenOferta.oferta.categoriaOferta.categoria_oferta_nombre,
        },
        estadoOferta: {
          estado_oferta_id: imagenOferta.oferta.estadoOferta.estado_oferta_id,
          estado_oferta_nombre: imagenOferta.oferta.estadoOferta.estado_oferta_nombre,
        },
        oferta_titulo: imagenOferta.oferta.oferta_titulo,
        oferta_condicion_trueque: imagenOferta.oferta.oferta_condicion_trueque,
        oferta_comentario_obligatorio: imagenOferta.oferta.oferta_comentario_obligatorio,
        oferta_latitud: imagenOferta.oferta.oferta_latitud,
        oferta_longitud: imagenOferta.oferta.oferta_longitud,
        usuario_creacion: imagenOferta.oferta.usuario_creacion,
        fecha_creacion: imagenOferta.oferta.fecha_creacion?.toISOString(),
        usuario_modificacion: imagenOferta.oferta.usuario_modificacion,
        fecha_modificacion: imagenOferta.oferta.fecha_modificacion?.toISOString(),
        estado_registro: imagenOferta.oferta.estado_registro,
      },
      imagen_oferta_nombre: imagenOferta.imagen_oferta_nombre,
      imagen_oferta_ruta: imagenOferta.imagen_oferta_ruta,
      usuario_creacion: imagenOferta.usuario_creacion,
      fecha_creacion: imagenOferta.fecha_creacion?.toISOString(),
      usuario_modificacion: imagenOferta.usuario_modificacion,
      fecha_modificacion: imagenOferta.fecha_modificacion?.toISOString(),
      estado_registro: imagenOferta.estado_registro,
    }));

    return {
      data: imagenOfertaDtos,
      total,
      page,
      limit,
    };
  }

  // Método para obtener los detalles de una imagen de oferta específica
  async getImagenOfertaById(id: number): Promise<ImagenOfertaDto> {
    const imagenOferta = await this.imagenOfertaRepository.findOne({
      where: { imagen_oferta_id: id, estado_registro: 1 },
      relations: ['oferta', 'oferta.categoriaOferta', 'oferta.estadoOferta'],
    });

    if (!imagenOferta) {
      throw new NotFoundException('Imagen de oferta no encontrada o ha sido eliminada');
    }

    return {
      imagen_oferta_id: imagenOferta.imagen_oferta_id,
      oferta: {
        oferta_id: imagenOferta.oferta.oferta_id,
        categoriaOferta: {
          categoria_oferta_id: imagenOferta.oferta.categoriaOferta.categoria_oferta_id,
          categoria_oferta_nombre: imagenOferta.oferta.categoriaOferta.categoria_oferta_nombre,
        },
        estadoOferta: {
          estado_oferta_id: imagenOferta.oferta.estadoOferta.estado_oferta_id,
          estado_oferta_nombre: imagenOferta.oferta.estadoOferta.estado_oferta_nombre,
        },
        oferta_titulo: imagenOferta.oferta.oferta_titulo,
        oferta_condicion_trueque: imagenOferta.oferta.oferta_condicion_trueque,
        oferta_comentario_obligatorio: imagenOferta.oferta.oferta_comentario_obligatorio,
        oferta_latitud: imagenOferta.oferta.oferta_latitud,
        oferta_longitud: imagenOferta.oferta.oferta_longitud,
        usuario_creacion: imagenOferta.oferta.usuario_creacion,
        fecha_creacion: imagenOferta.oferta.fecha_creacion?.toISOString(),
        usuario_modificacion: imagenOferta.oferta.usuario_modificacion,
        fecha_modificacion: imagenOferta.oferta.fecha_modificacion?.toISOString(),
        estado_registro: imagenOferta.oferta.estado_registro,
      },
      imagen_oferta_nombre: imagenOferta.imagen_oferta_nombre,
      imagen_oferta_ruta: imagenOferta.imagen_oferta_ruta,
      usuario_creacion: imagenOferta.usuario_creacion,
      fecha_creacion: imagenOferta.fecha_creacion?.toISOString(),
      usuario_modificacion: imagenOferta.usuario_modificacion,
      fecha_modificacion: imagenOferta.fecha_modificacion?.toISOString(),
      estado_registro: imagenOferta.estado_registro,
    };
  }

  // Método para obtener todas las imágenes de una oferta específica (solo datos de imagen-oferta)
  async getImagenesByOfertaId(ofertaId: number): Promise<any[]> {
    const imagenesOferta = await this.imagenOfertaRepository.find({
      where: { oferta: { oferta_id: ofertaId }, estado_registro: 1 },
      order: { imagen_oferta_id: 'DESC' },
    });

    return imagenesOferta.map((imagenOferta) => ({
      imagen_oferta_id: imagenOferta.imagen_oferta_id,
      oferta_id: ofertaId,
      imagen_oferta_nombre: imagenOferta.imagen_oferta_nombre,
      imagen_oferta_ruta: imagenOferta.imagen_oferta_ruta,
      usuario_creacion: imagenOferta.usuario_creacion,
      fecha_creacion: imagenOferta.fecha_creacion?.toISOString(),
      usuario_modificacion: imagenOferta.usuario_modificacion,
      fecha_modificacion: imagenOferta.fecha_modificacion?.toISOString(),
      estado_registro: imagenOferta.estado_registro,
    }));
  }

  // Método para crear una nueva imagen de oferta
  async createImagenOferta(createImagenOfertaDto: ImagenOfertaCreateDto): Promise<ImagenOfertaDto> {
    // Verificar que la oferta existe
    const oferta = await this.ofertaRepository.findOne({
      where: { oferta_id: createImagenOfertaDto.oferta_id, estado_registro: 1 },
      relations: ['categoriaOferta', 'estadoOferta'],
    });

    if (!oferta) {
      throw new NotFoundException('Oferta no encontrada o ha sido eliminada');
    }

    // Extraer el nombre del archivo
    const fileName = this.extractFileName(
      createImagenOfertaDto.imagen_base64, 
      createImagenOfertaDto.imagen_oferta_nombre
    );

    // Procesar y guardar la imagen base64
    const imagePath = await this.processBase64Image(
      createImagenOfertaDto.imagen_base64, 
      fileName
    );

    // Usar la ruta proporcionada o la generada automáticamente
    const finalImagePath = createImagenOfertaDto.imagen_oferta_ruta || imagePath;

    const imagenOferta = this.imagenOfertaRepository.create({
      oferta: oferta,
      imagen_oferta_nombre: fileName,
      imagen_oferta_ruta: finalImagePath,
      estado_registro: 1,
      usuario_creacion: createImagenOfertaDto.usuario_creacion || 'system',
      fecha_creacion: new Date(),
    });

    const savedImagenOferta = await this.imagenOfertaRepository.save(imagenOferta);

    return {
      imagen_oferta_id: savedImagenOferta.imagen_oferta_id,
      oferta: {
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
      },
      imagen_oferta_nombre: savedImagenOferta.imagen_oferta_nombre,
      imagen_oferta_ruta: savedImagenOferta.imagen_oferta_ruta,
      usuario_creacion: savedImagenOferta.usuario_creacion,
      fecha_creacion: savedImagenOferta.fecha_creacion?.toISOString(),
      usuario_modificacion: savedImagenOferta.usuario_modificacion,
      fecha_modificacion: savedImagenOferta.fecha_modificacion?.toISOString(),
      estado_registro: savedImagenOferta.estado_registro,
    };
  }

  // Método para crear imagen con base64 (método alternativo más específico)
  async createImagenOfertaFromBase64(
    ofertaId: number, 
    base64Image: string, 
    imageName: string, 
    usuarioCreacion?: string
  ): Promise<ImagenOfertaDto> {
    const createDto: ImagenOfertaCreateDto = {
      oferta_id: ofertaId,
      imagen_oferta_nombre: imageName,
      imagen_base64: base64Image,
      usuario_creacion: usuarioCreacion,
    };
    
    return await this.createImagenOferta(createDto);
  }

  // Método para actualizar una imagen de oferta existente
  async updateImagenOferta(id: number, updateImagenOfertaDto: ImagenOfertaUpdateDto): Promise<ImagenOfertaDto> {
    const imagenOferta = await this.imagenOfertaRepository.findOne({
      where: { imagen_oferta_id: id, estado_registro: 1 },
      relations: ['oferta', 'oferta.categoriaOferta', 'oferta.estadoOferta'],
    });

    if (!imagenOferta) {
      throw new NotFoundException('Imagen de oferta no encontrada o ha sido eliminada');
    }

    // Verificar y actualizar oferta si se proporciona
    if (updateImagenOfertaDto.oferta_id) {
      const oferta = await this.ofertaRepository.findOne({
        where: { oferta_id: updateImagenOfertaDto.oferta_id, estado_registro: 1 },
        relations: ['categoriaOferta', 'estadoOferta'],
      });

      if (!oferta) {
        throw new NotFoundException('Oferta no encontrada o ha sido eliminada');
      }
      imagenOferta.oferta = oferta;
    }

    // Actualizar campos si se proporcionan
    if (updateImagenOfertaDto.imagen_oferta_nombre) {
      imagenOferta.imagen_oferta_nombre = updateImagenOfertaDto.imagen_oferta_nombre;
    }
    if (updateImagenOfertaDto.imagen_oferta_ruta) {
      imagenOferta.imagen_oferta_ruta = updateImagenOfertaDto.imagen_oferta_ruta;
    }

    // Si se proporciona una nueva imagen base64, procesarla
    if (updateImagenOfertaDto.imagen_base64) {
      const fileName = updateImagenOfertaDto.imagen_oferta_nombre || imagenOferta.imagen_oferta_nombre;
      const newImagePath = await this.processBase64Image(
        updateImagenOfertaDto.imagen_base64, 
        fileName
      );
      imagenOferta.imagen_oferta_ruta = newImagePath;
      
      // Actualizar nombre si se cambió
      if (updateImagenOfertaDto.imagen_oferta_nombre) {
        imagenOferta.imagen_oferta_nombre = fileName;
      }
    }

    imagenOferta.usuario_modificacion = updateImagenOfertaDto.usuario_modificacion || 'system';
    imagenOferta.fecha_modificacion = new Date();

    const updatedImagenOferta = await this.imagenOfertaRepository.save(imagenOferta);

    return {
      imagen_oferta_id: updatedImagenOferta.imagen_oferta_id,
      oferta: {
        oferta_id: updatedImagenOferta.oferta.oferta_id,
        categoriaOferta: {
          categoria_oferta_id: updatedImagenOferta.oferta.categoriaOferta.categoria_oferta_id,
          categoria_oferta_nombre: updatedImagenOferta.oferta.categoriaOferta.categoria_oferta_nombre,
        },
        estadoOferta: {
          estado_oferta_id: updatedImagenOferta.oferta.estadoOferta.estado_oferta_id,
          estado_oferta_nombre: updatedImagenOferta.oferta.estadoOferta.estado_oferta_nombre,
        },
        oferta_titulo: updatedImagenOferta.oferta.oferta_titulo,
        oferta_condicion_trueque: updatedImagenOferta.oferta.oferta_condicion_trueque,
        oferta_comentario_obligatorio: updatedImagenOferta.oferta.oferta_comentario_obligatorio,
        oferta_latitud: updatedImagenOferta.oferta.oferta_latitud,
        oferta_longitud: updatedImagenOferta.oferta.oferta_longitud,
        usuario_creacion: updatedImagenOferta.oferta.usuario_creacion,
        fecha_creacion: updatedImagenOferta.oferta.fecha_creacion?.toISOString(),
        usuario_modificacion: updatedImagenOferta.oferta.usuario_modificacion,
        fecha_modificacion: updatedImagenOferta.oferta.fecha_modificacion?.toISOString(),
        estado_registro: updatedImagenOferta.oferta.estado_registro,
      },
      imagen_oferta_nombre: updatedImagenOferta.imagen_oferta_nombre,
      imagen_oferta_ruta: updatedImagenOferta.imagen_oferta_ruta,
      usuario_creacion: updatedImagenOferta.usuario_creacion,
      fecha_creacion: updatedImagenOferta.fecha_creacion?.toISOString(),
      usuario_modificacion: updatedImagenOferta.usuario_modificacion,
      fecha_modificacion: updatedImagenOferta.fecha_modificacion?.toISOString(),
      estado_registro: updatedImagenOferta.estado_registro,
    };
  }

  // Método para "eliminar" una imagen de oferta (soft delete)
  async deleteImagenOferta(id: number, usuario_modificacion: string): Promise<ImagenOfertaDto> {
    // Buscar la imagen de oferta
    const imagenOferta = await this.imagenOfertaRepository.findOne({
      where: { imagen_oferta_id: id, estado_registro: 1 },
      relations: ['oferta', 'oferta.categoriaOferta', 'oferta.estadoOferta'],
    });

    // Validar existencia
    if (!imagenOferta) {
      throw new NotFoundException('Imagen de oferta no encontrada o ya ha sido eliminada');
    }

    // Actualizar estado_registro a 0
    imagenOferta.estado_registro = 0;
    imagenOferta.usuario_modificacion = usuario_modificacion || 'system';
    imagenOferta.fecha_modificacion = new Date();

    // Guardar cambios
    const updatedImagenOferta = await this.imagenOfertaRepository.save(imagenOferta);

    // Mapear a DTO
    return {
      imagen_oferta_id: updatedImagenOferta.imagen_oferta_id,
      oferta: {
        oferta_id: updatedImagenOferta.oferta.oferta_id,
        categoriaOferta: {
          categoria_oferta_id: updatedImagenOferta.oferta.categoriaOferta.categoria_oferta_id,
          categoria_oferta_nombre: updatedImagenOferta.oferta.categoriaOferta.categoria_oferta_nombre,
        },
        estadoOferta: {
          estado_oferta_id: updatedImagenOferta.oferta.estadoOferta.estado_oferta_id,
          estado_oferta_nombre: updatedImagenOferta.oferta.estadoOferta.estado_oferta_nombre,
        },
        oferta_titulo: updatedImagenOferta.oferta.oferta_titulo,
        oferta_condicion_trueque: updatedImagenOferta.oferta.oferta_condicion_trueque,
        oferta_comentario_obligatorio: updatedImagenOferta.oferta.oferta_comentario_obligatorio,
        oferta_latitud: updatedImagenOferta.oferta.oferta_latitud,
        oferta_longitud: updatedImagenOferta.oferta.oferta_longitud,
        usuario_creacion: updatedImagenOferta.oferta.usuario_creacion,
        fecha_creacion: updatedImagenOferta.oferta.fecha_creacion?.toISOString(),
        usuario_modificacion: updatedImagenOferta.oferta.usuario_modificacion,
        fecha_modificacion: updatedImagenOferta.oferta.fecha_modificacion?.toISOString(),
        estado_registro: updatedImagenOferta.oferta.estado_registro,
      },
      imagen_oferta_nombre: updatedImagenOferta.imagen_oferta_nombre,
      imagen_oferta_ruta: updatedImagenOferta.imagen_oferta_ruta,
      usuario_creacion: updatedImagenOferta.usuario_creacion,
      fecha_creacion: updatedImagenOferta.fecha_creacion?.toISOString(),
      usuario_modificacion: updatedImagenOferta.usuario_modificacion,
      fecha_modificacion: updatedImagenOferta.fecha_modificacion?.toISOString(),
      estado_registro: updatedImagenOferta.estado_registro,
    };
  }
}
