import { 
  Injectable, 
  NotFoundException, 
  BadRequestException, 
  ForbiddenException,
  ConflictException 
} from '@nestjs/common';
import { RobleRepository } from '../roble/roble.repository';
import { CreateOfertaDto, UpdateOfertaDto, FilterOfertaDto } from './dtos';

@Injectable()
export class OfertasService {
  private readonly MAX_IMAGE_SIZE = 2 * 1024 * 1024;
  private readonly MAX_IMAGES = 3;

  constructor(
    private robleRepo: RobleRepository
  ) {}

  async create(userId: any, dto: CreateOfertaDto) {
    const userIdStr = String(userId);
    
    const categoria = await this.robleRepo.findCategoriaById(dto.categoriaId);
    if (!categoria) {
      throw new NotFoundException('La categoría no existe o no está activa');
    }

    const ofertas = await this.robleRepo.findOfertasByUser(userIdStr);
    const existente = ofertas.find((o: any) => o.titulo === dto.titulo);
    
    if (existente) {
      throw new ConflictException(
        'Ya tienes una oferta activa con ese título. Por favor usa un título diferente.'
      );
    }

    if (dto.imagenes.length > this.MAX_IMAGES) {
      throw new BadRequestException(`No puedes subir más de ${this.MAX_IMAGES} imágenes`);
    }

    if (dto.imagenes.length === 0) {
      throw new BadRequestException('Debes subir al menos una imagen');
    }

    for (const imagen of dto.imagenes) {
      const sizeInBytes = this.getBase64Size(imagen.base64);
      if (sizeInBytes > this.MAX_IMAGE_SIZE) {
        throw new BadRequestException(
          `La imagen "${imagen.nombre || 'sin nombre'}" excede el tamaño máximo de 2 MB`
        );
      }
    }

    const oferta = await this.robleRepo.createOferta({
      titulo: dto.titulo,
      condicionTrueque: dto.condicionTrueque,
      comentarioObligatorio: dto.comentarioObligatorio,
      latitud: dto.latitud,
      longitud: dto.longitud,
      userId: userIdStr,
      categoriaId: dto.categoriaId,
      status: 'BORRADOR',
    });

    const imagenesCreadas = await Promise.all(
      dto.imagenes.map((img, index) =>
        this.robleRepo.createImagenOferta({
          ofertaId: (oferta as any)._id,
          url: img.base64,
          nombre: img.nombre || `imagen-${index + 1}`,
          tamanioBytes: this.getBase64Size(img.base64),
          orden: index,
        })
      )
    );

    return {
      ...oferta,
      imagenes: imagenesCreadas,
    };
  }

  async findMyOffers(userId: any, filters: FilterOfertaDto) {
    const { categoriaId, status, search, page = 1, limit = 10 } = filters;
    const userIdStr = String(userId);

    let ofertas = await this.robleRepo.findOfertasByUser(userIdStr);

    if (categoriaId) {
      ofertas = ofertas.filter((o: any) => o.categoriaId === categoriaId);
    }
    if (status) {
      ofertas = ofertas.filter((o: any) => o.status === status);
    }
    if (search) {
      ofertas = ofertas.filter((o: any) => 
        o.titulo.toLowerCase().includes(search.toLowerCase())
      );
    }

    ofertas.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const total = ofertas.length;
    const skip = (page - 1) * limit;
    const paginatedOfertas = ofertas.slice(skip, skip + limit);

    const ofertasConImagenes = await Promise.all(
      paginatedOfertas.map(async (oferta: any) => {
        const imagenes = await this.robleRepo.findImagenesByOferta(oferta._id);
        return { ...oferta, imagenes };
      })
    );

    return {
      data: ofertasConImagenes,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAllPublic(filters: FilterOfertaDto) {
    const { categoriaId, search, page = 1, limit = 10 } = filters;

    let ofertas = await this.robleRepo.findPublicOfertas();

    if (categoriaId) {
      ofertas = ofertas.filter((o: any) => o.categoriaId === categoriaId);
    }
    if (search) {
      ofertas = ofertas.filter((o: any) => 
        o.titulo.toLowerCase().includes(search.toLowerCase())
      );
    }

    ofertas.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const total = ofertas.length;
    const skip = (page - 1) * limit;
    const paginatedOfertas = ofertas.slice(skip, skip + limit);

    const ofertasConImagenes = await Promise.all(
      paginatedOfertas.map(async (oferta: any) => {
        const imagenes = await this.robleRepo.findImagenesByOferta(oferta._id);
        return { ...oferta, imagenes };
      })
    );

    return {
      data: ofertasConImagenes,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId?: string) {
    const oferta = await this.robleRepo.findOfertaById(id);

    if (!oferta) {
      throw new NotFoundException('Oferta no encontrada');
    }

    const userIdStr = userId ? String(userId) : undefined;
    if (oferta.status !== 'PUBLICADA' && oferta.userId !== userIdStr) {
      throw new ForbiddenException('No tienes permiso para ver esta oferta');
    }

    const imagenes = await this.robleRepo.findImagenesByOferta((oferta as any)._id);
    return { ...oferta, imagenes };
  }

  async update(id: string, userId: any, dto: UpdateOfertaDto) {
    const userIdStr = String(userId);
    const oferta = await this.robleRepo.findOfertaById(id);

    if (!oferta) {
      throw new NotFoundException('Oferta no encontrada');
    }

    if (oferta.userId !== userIdStr) {
      throw new ForbiddenException('Solo el propietario puede editar esta oferta');
    }

    if (dto.titulo && dto.titulo !== oferta.titulo) {
      const ofertas = await this.robleRepo.findOfertasByUser(userIdStr);
      const existente = ofertas.find((o: any) => 
        o.titulo === dto.titulo && o._id !== id
      );

      if (existente) {
        throw new ConflictException(
          'Ya tienes otra oferta activa con ese título'
        );
      }
    }

    if (dto.categoriaId) {
      const categoria = await this.robleRepo.findCategoriaById(dto.categoriaId);
      if (!categoria) {
        throw new NotFoundException('La categoría no existe');
      }
    }

    const updated = await this.robleRepo.updateOferta(id, dto);
    const imagenes = await this.robleRepo.findImagenesByOferta((updated as any)._id);
    return { ...updated, imagenes };
  }

  async updateStatus(id: string, userId: any, status: string) {
    const userIdStr = String(userId);
    const oferta = await this.robleRepo.findOfertaById(id);

    if (!oferta) {
      throw new NotFoundException('Oferta no encontrada');
    }

    if (oferta.userId !== userIdStr) {
      throw new ForbiddenException('Solo el propietario puede cambiar el estado');
    }

    const updated = await this.robleRepo.updateOferta(id, { status });
    const imagenes = await this.robleRepo.findImagenesByOferta((updated as any)._id);
    return { ...updated, imagenes };
  }

  async remove(id: string, userId: any) {
    const userIdStr = String(userId);
    const oferta = await this.robleRepo.findOfertaById(id);

    if (!oferta) {
      throw new NotFoundException('Oferta no encontrada');
    }

    if (oferta.userId !== userIdStr) {
      throw new ForbiddenException('Solo el propietario puede eliminar esta oferta');
    }

    await this.robleRepo.updateOferta(id, { activo: false });

    return { message: 'Oferta eliminada correctamente' };
  }

  private getBase64Size(base64String: string): number {
    const base64Data = base64String.split(',')[1] || base64String;
    const padding = (base64Data.match(/=/g) || []).length;
    return (base64Data.length * 3) / 4 - padding;
  }
}

