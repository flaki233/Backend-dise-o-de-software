import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ListBusquedaDto } from './dtos/list-busqueda.dto';
import { RobleService } from '../roble/roble.service';

type MockOferta = {
  _id: string; // en real: _id de ROBLE
  titulo: string;
  comentarioObligatorio: string;
  categoriaId: string;
  precio?: number;
  userId: string;
  status: 'BORRADOR' | 'PUBLICADA' | 'PAUSADA';
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  // 👇 ID que ve la IA (columna idAI en ROBLE)
  idAI?: string;
};

type ScoredOferta = MockOferta & {
  textScore?: number;
  semanticScore?: number;
  hybridScore?: number;
};

// Mock local para modo demo
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
    idAI: 'of-1',
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
    idAI: 'of-2',
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
    idAI: 'of-3',
  },
];

@Injectable()
export class BusquedaService {
  // URL del módulo de IA (FastAPI)
  private readonly NLP_URL = process.env.NLP_URL || 'http://localhost:8000';

  private get isMock() {
    return process.env.MOCK_ROBLE === 'true';
  }

  constructor(
    private readonly http: HttpService,
    private readonly roble: RobleService,
  ) {}

  /**
   * PUNTO 2: Búsqueda híbrida
   * GET /busqueda/ofertas
   */
  async list(query: ListBusquedaDto) {
    let data: ScoredOferta[] = [];

    // 0. Origen de datos: MOCK vs ROBLE
    if (this.isMock) {
      data = [...MOCK_OFERTAS];
    } else {
      const res = await this.roble.getRecords('Oferta');
      const raw = ((res as any).records ?? res ?? []) as any[];

      data = raw.map(
        (o: any): ScoredOferta => ({
          _id: o._id, // id real de ROBLE
          titulo: o.titulo,
          comentarioObligatorio: o.comentarioObligatorio,
          categoriaId: o.categoriaId,
          precio: o.precio,
          userId: o.userId,
          status: o.status,
          activo: o.activo,
          createdAt: o.createdAt,
          updatedAt: o.updatedAt,
          idAI: o.idAI, // columna en ROBLE (of-00, of-01, ...)
        }),
      );
    }

    // 1. Filtro por categoría (si viene)
    if (query.categoria) {
      data = data.filter((o) => o.categoriaId === query.categoria);
    }

    // 2. Cálculo de scores híbridos (texto + semántico via IA)
    if (query.q) {
      const term = query.q.toLowerCase();

      const semanticScoresMap = await this.fetchSemanticScores(query);

      data = data
        .map((o) => {
          const textScore = this.computeTextScore(o, term); // 0,1,2

          // IA devuelve scores por idAI (of-00, of-01, ...)
          const key = o.idAI ?? o._id;
          const semanticScore = semanticScoresMap.get(key) ?? 0;

          const hybridScore = 0.6 * textScore + 0.4 * semanticScore;

          return { ...o, textScore, semanticScore, hybridScore };
        })
        // descartamos ofertas sin relevancia (todo 0)
        .filter((o) => (o.hybridScore ?? 0) > 0);
    }

    // 3. Ordenamiento
    if (query.sort === 'relevance' && query.q) {
      data = [...data].sort(
        (a, b) => (b.hybridScore ?? 0) - (a.hybridScore ?? 0),
      );
    } else if (query.sort === 'price_asc') {
      data = [...data].sort((a, b) => (a.precio ?? 0) - (b.precio ?? 0));
    } else if (query.sort === 'price_desc') {
      data = [...data].sort((a, b) => (b.precio ?? 0) - (a.precio ?? 0));
    } else {
      // 'recent' (por defecto) => más nuevo primero por createdAt
      data = [...data].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }

    // 4. Paginación
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginated = data.slice(start, end);

    return {
      data: paginated,
      meta: {
        total: data.length,
        page,
        pageSize,
        pageCount: Math.ceil(data.length / pageSize),
      },
    };
  }

  async getSuggestions(userId: string, categoria?: string) {
    try {
      const url = `${this.NLP_URL}/recommendations/${userId}`;

      const response$ = this.http.get(url, {
        params: categoria ? { category: categoria } : undefined,
      });
      const { data } = await firstValueFrom(response$);

      const ids: string[] = data.items_recomendados || [];

      let ofertas: MockOferta[] = [];

      if (this.isMock) {
        const mapMock = new Map(MOCK_OFERTAS.map((o) => [o._id, o]));
        ofertas = ids
          .map((id) => mapMock.get(id))
          .filter((o): o is MockOferta => !!o);
      } else {
        const res = await this.roble.getRecords('Oferta');
        const raw = ((res as any).records ?? res ?? []) as any[];

        const todas: MockOferta[] = raw.map((o: any) => ({
          _id: o._id,
          titulo: o.titulo,
          comentarioObligatorio: o.comentarioObligatorio,
          categoriaId: o.categoriaId,
          precio: o.precio,
          userId: o.userId,
          status: o.status,
          activo: o.activo,
          createdAt: o.createdAt,
          updatedAt: o.updatedAt,
          idAI: o.idAI,
        }));

        // IA devuelve ids de idAI
        const porIdAI = new Map(
          todas.map((o) => [o.idAI ?? o._id, o] as [string, MockOferta]),
        );

        ofertas = ids
          .map((id) => porIdAI.get(id))
          .filter((o): o is MockOferta => !!o);
      }

      return {
        userId,
        origen: 'IA (módulo NLP /recommendations)',
        categoriaFiltrada: categoria ?? null,
        idsRecibidos: ids,
        ofertasRecomendadas: ofertas,
      };
    } catch (err) {
      console.warn(
        '[BusquedaService] Error llamando a NLP /recommendations:',
        err,
      );

      return {
        userId,
        origen: 'fallback',
        categoriaFiltrada: categoria ?? null,
        idsRecibidos: [],
        ofertasRecomendadas: [],
      };
    }
  }

  // ==== Helpers de búsqueda híbrida ==========================

  // Score textual simple (0,1,2)
  private computeTextScore(oferta: MockOferta, query: string): number {
    const text = `${oferta.titulo} ${oferta.comentarioObligatorio}`.toLowerCase();

    if (!text.includes(query)) return 0;
    if (text.startsWith(query)) return 2; // match fuerte al inicio
    return 1; // match normal
  }

  /**
   * Llamada al módulo de IA para obtener scores semánticos
   * Usa el endpoint POST /search/ del FastAPI
   */
  private async fetchSemanticScores(
    query: ListBusquedaDto,
  ): Promise<Map<string, number>> {
    const scores = new Map<string, number>();

    if (!query.q) return scores;

    try {
      const body: any = {
        text: query.q,
      };

      if (query.categoria) {
        body.category = query.categoria;
      }

      if (query.sentiment) {
        body.sentiment_filter = query.sentiment;
      }

      const response$ = this.http.post(`${this.NLP_URL}/search/`, body);
      const { data } = await firstValueFrom(response$);

      const raw = data.resultados_busqueda || {};
      const ids: string[] = raw.ids?.[0] || [];
      const distances: number[] = raw.distances?.[0] || [];

      ids.forEach((id, idx) => {
        const d = distances[idx] ?? 1;
        // distancia menor → más similar → similitud 0–1
        const similarity = 1 / (1 + d);
        scores.set(id, similarity);
      });
    } catch (err) {
      console.warn('[BusquedaService] Error llamando a NLP /search:', err);
    }

    return scores;
  }
}
