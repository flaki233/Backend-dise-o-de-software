import { Injectable } from '@nestjs/common';
import { RobleService } from '../roble/roble.service';
import { ListQueryDto } from './dtos/list.query.dto';

type MockOferta = {
  _id: string;
  titulo: string;
  comentarioObligatorio: string;
  categoriaId: string;
  precio?: number;
  userId: string;
  status: 'BORRADOR' | 'PUBLICADA' | 'PAUSADA';
  activo: boolean;
  createdAt: string;
  updatedAt: string;
};

const MOCK_OFERTAS: MockOferta[] = [
  {
    _id: 'of-1',
    titulo: 'Bicicleta MTB rin 29',
    comentarioObligatorio: 'Buen estado, la cambio por patineta o celular.',
    categoriaId: 'deportes',
    precio: 900000,
    userId: 'user-10',
    status: 'PUBLICADA',
    activo: true,
    createdAt: '2025-11-09T20:11:00.000Z',
    updatedAt: '2025-11-09T20:11:00.000Z',
  },
  {
    _id: 'of-2',
    titulo: 'Silla gamer ergonómica roja',
    comentarioObligatorio: 'Busco trueque por monitor 24 pulgadas.',
    categoriaId: 'hogar',
    precio: 250000,
    userId: 'user-11',
    status: 'PUBLICADA',
    activo: true,
    createdAt: '2025-11-08T15:40:00.000Z',
    updatedAt: '2025-11-08T15:40:00.000Z',
  },
  {
    _id: 'of-3',
    titulo: 'Nintendo Switch Lite',
    comentarioObligatorio: 'Cambio por bicicleta o portátil gama baja.',
    categoriaId: 'electronica',
    precio: 700000,
    userId: 'user-12',
    status: 'PAUSADA',
    activo: true,
    createdAt: '2025-11-05T10:00:00.000Z',
    updatedAt: '2025-11-09T19:00:00.000Z',
  },
];

const MOCK_IMAGENES: Record<string, { url: string; orden: number }[]> = {
  'of-1': [
    { url: 'https://picsum.photos/seed/bici1/800/600', orden: 0 },
    { url: 'https://picsum.photos/seed/bici2/800/600', orden: 1 },
  ],
  'of-2': [
    { url: 'https://picsum.photos/seed/silla1/800/600', orden: 0 },
    { url: 'https://picsum.photos/seed/silla2/800/600', orden: 1 },
  ],
  'of-3': [
    { url: 'https://picsum.photos/seed/switch1/800/600', orden: 0 },
  ],
};

@Injectable()
export class ExplorarService {
  constructor(private readonly roble: RobleService) {}

  // Listado con paginación, búsqueda y orden
  async list(query: ListQueryDto) {
    let data: MockOferta[] = [];

    try {
      // 🔁 Intentar traer desde ROBLE
      const all = await this.roble.getRecords('Oferta');
      // asume que ROBLE devuelve { records: [...] }
      data = (all as any).records || all || [];
    } catch (err: any) {
      console.warn('[ExplorarService.list] ROBLE no respondió o sin token, usando MOCK.');
      data = MOCK_OFERTAS;
    }

    // 1. filtro de texto libre q (titulo / comentarioObligatorio)
    if (query.q) {
      const term = query.q.toLowerCase();
      data = data.filter(
        (o) =>
          o.titulo.toLowerCase().includes(term) ||
          o.comentarioObligatorio.toLowerCase().includes(term),
      );
    }

    // 2. filtro por categoría
    if (query.categoria) {
      data = data.filter((o) => o.categoriaId === query.categoria);
    }

    // 3. ordenamiento
    if (query.sort === 'price_asc') {
      data = [...data].sort(
        (a, b) => (a.precio ?? 0) - (b.precio ?? 0),
      );
    } else if (query.sort === 'price_desc') {
      data = [...data].sort(
        (a, b) => (b.precio ?? 0) - (a.precio ?? 0),
      );
    } else {
      // 'recent' => más nuevo primero por createdAt
      data = [...data].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime(),
      );
    }

    // 4. paginación
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginated = data.slice(start, end);

    // 5. devolver respuesta con meta
    return {
      data: paginated.map((o) => ({
        ...o,
        thumbnail: (MOCK_IMAGENES[o._id]?.[0]?.url) ?? null,
      })),
      meta: {
        total: data.length,
        page,
        pageSize,
        pageCount: Math.ceil(data.length / pageSize),
      },
    };
  }

  // Detalle de una oferta + galería completa
  async findOne(id: string) {
    let oferta: any = null;

    try {
      const result = await this.roble.getRecords('Oferta', { _id: id });
      const list = (result as any).records || result || [];
      oferta = list[0];
    } catch (err: any) {
      console.warn('[ExplorarService.findOne] ROBLE no respondió o sin token, usando MOCK.');
      oferta = MOCK_OFERTAS.find((o) => o._id === id);
    }

    if (!oferta) {
      return {
        message: 'Oferta no encontrada',
        id,
      };
    }

    // imágenes
    let imagenes: any[] = [];
    try {
      const imgs = await this.roble.getRecords('ImagenOferta', { ofertaId: id });
      imagenes = (imgs as any).records || imgs || [];
    } catch (err: any) {
      imagenes = MOCK_IMAGENES[id] || [];
    }

    // ordenar galería por 'orden'
    imagenes.sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));

    return {
      ...oferta,
      imagenes,
    };
  }
}
