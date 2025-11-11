import { 
  Injectable, 
  NotFoundException, 
  BadRequestException, 
  ForbiddenException,
  ConflictException 
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOfertaDto, UpdateOfertaDto, FilterOfertaDto } from './dtos';
import { OfferStatus } from '@prisma/client';

@Injectable()
export class OfertasService {
  private readonly MAX_IMAGE_SIZE = 2 * 1024 * 1024;
  private readonly MAX_IMAGES = 3;

  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateOfertaDto) {
    const categoria = await this.prisma.categoriaOferta.findFirst({
      where: { id: dto.categoriaId, activo: true },
    });

    if (!categoria) {
      throw new NotFoundException('La categoría no existe o no está activa');
    }

    const existente = await this.prisma.oferta.findFirst({
      where: {
        titulo: dto.titulo,
        userId,
        activo: true,
      },
    });

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

    return this.prisma.$transaction(async (tx) => {
      const oferta = await tx.oferta.create({
        data: {
          titulo: dto.titulo,
          condicionTrueque: dto.condicionTrueque,
          comentarioObligatorio: dto.comentarioObligatorio,
          latitud: dto.latitud,
          longitud: dto.longitud,
          userId,
          categoriaId: dto.categoriaId,
          status: OfferStatus.BORRADOR,
        },
        include: {
          categoria: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      });

      const imagenesCreadas = await Promise.all(
        dto.imagenes.map((img, index) =>
          tx.imagenOferta.create({
            data: {
              ofertaId: oferta.id,
              url: img.base64,
              nombre: img.nombre || `imagen-${index + 1}`,
              tamanioBytes: this.getBase64Size(img.base64),
              orden: index,
            },
          })
        )
      );

      return {
        ...oferta,
        imagenes: imagenesCreadas,
      };
    });
  }

  async findMyOffers(userId: number, filters: FilterOfertaDto) {
    const { categoriaId, status, search, page = 1, limit = 10 } = filters;

    const where: any = {
      userId,
      activo: true,
    };

    if (categoriaId) where.categoriaId = categoriaId;
    if (status) where.status = status;
    if (search) {
      where.titulo = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const [ofertas, total] = await Promise.all([
      this.prisma.oferta.findMany({
        where,
        include: {
          categoria: true,
          imagenes: {
            orderBy: { orden: 'asc' },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.oferta.count({ where }),
    ]);

    return {
      data: ofertas,
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

    const where: any = {
      activo: true,
      status: OfferStatus.PUBLICADA,
    };

    if (categoriaId) where.categoriaId = categoriaId;
    if (search) {
      where.titulo = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const [ofertas, total] = await Promise.all([
      this.prisma.oferta.findMany({
        where,
        include: {
          categoria: true,
          user: {
            select: {
              id: true,
              name: true,
              location: true,
              reputationScore: true,
              tradesClosed: true,
            },
          },
          imagenes: {
            orderBy: { orden: 'asc' },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.oferta.count({ where }),
    ]);

    return {
      data: ofertas,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number, userId?: number) {
    const oferta = await this.prisma.oferta.findFirst({
      where: { id, activo: true },
      include: {
        categoria: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            location: true,
            reputationScore: true,
            tradesClosed: true,
          },
        },
        imagenes: {
          orderBy: { orden: 'asc' },
        },
      },
    });

    if (!oferta) {
      throw new NotFoundException('Oferta no encontrada');
    }

    if (oferta.status !== OfferStatus.PUBLICADA && oferta.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para ver esta oferta');
    }

    return oferta;
  }

  async update(id: number, userId: number, dto: UpdateOfertaDto) {
    const oferta = await this.prisma.oferta.findFirst({
      where: { id, activo: true },
    });

    if (!oferta) {
      throw new NotFoundException('Oferta no encontrada');
    }

    if (oferta.userId !== userId) {
      throw new ForbiddenException('Solo el propietario puede editar esta oferta');
    }

    if (dto.titulo && dto.titulo !== oferta.titulo) {
      const existente = await this.prisma.oferta.findFirst({
        where: {
          titulo: dto.titulo,
          userId,
          activo: true,
          id: { not: id },
        },
      });

      if (existente) {
        throw new ConflictException(
          'Ya tienes otra oferta activa con ese título'
        );
      }
    }

    if (dto.categoriaId) {
      const categoria = await this.prisma.categoriaOferta.findFirst({
        where: { id: dto.categoriaId, activo: true },
      });

      if (!categoria) {
        throw new NotFoundException('La categoría no existe');
      }
    }

    return this.prisma.oferta.update({
      where: { id },
      data: dto,
      include: {
        categoria: true,
        imagenes: {
          orderBy: { orden: 'asc' },
        },
      },
    });
  }

  async updateStatus(id: number, userId: number, status: OfferStatus) {
    const oferta = await this.prisma.oferta.findFirst({
      where: { id, activo: true },
    });

    if (!oferta) {
      throw new NotFoundException('Oferta no encontrada');
    }

    if (oferta.userId !== userId) {
      throw new ForbiddenException('Solo el propietario puede cambiar el estado');
    }

    return this.prisma.oferta.update({
      where: { id },
      data: { status },
      include: {
        categoria: true,
        imagenes: true,
      },
    });
  }

  async remove(id: number, userId: number) {
    const oferta = await this.prisma.oferta.findFirst({
      where: { id, activo: true },
    });

    if (!oferta) {
      throw new NotFoundException('Oferta no encontrada');
    }

    if (oferta.userId !== userId) {
      throw new ForbiddenException('Solo el propietario puede eliminar esta oferta');
    }

    await this.prisma.oferta.update({
      where: { id },
      data: { activo: false },
    });

    return { message: 'Oferta eliminada correctamente' };
  }

  private getBase64Size(base64String: string): number {
    const base64Data = base64String.split(',')[1] || base64String;
    const padding = (base64Data.match(/=/g) || []).length;
    return (base64Data.length * 3) / 4 - padding;
  }
}

