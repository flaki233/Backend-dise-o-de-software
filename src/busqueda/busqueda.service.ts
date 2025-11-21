import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ListBusquedaDto } from './dtos/list-busqueda.dto';

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

type ScoredOferta = MockOferta & {
  textScore?: number;
  semanticScore?: number;
  hybridScore?: number;
};

// ⚠️ IMPORTANTE: estos IDs deben coincidir con los IDs que tienes en ChromaDB
// (of-1, of-2, of-3, ...).
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
  {
    _id: 'of-4',
    titulo: 'Celular Samsung Galaxy A12',
    comentarioObligatorio: 'Buen estado, busco trueque por tablet o bicicleta.',
    categoriaId: 'electronica',
    precio: 500000,
    userId: 'user-13',
    status: 'PUBLICADA',
    activo: true,
    createdAt: '2025-11-07T12:30:00.000Z',
    updatedAt: '2025-11-07T12:30:00.000Z',
  },
  {
    _id: 'item-001',
    "titulo": "Celular de alta gama casi nuevo",
    "comentarioObligatorio": "Vendo celular de alta gama, casi nuevo, con todos sus accesorios.",
    "categoriaId": "electronica",
    "precio": 1500000,
    "userId": "user-abc",
    "status": "PUBLICADA",
    "activo": true,
    "createdAt": "2025-11-10T09:00:00.000Z",
    "updatedAt": "2025-11-10T09:00:00.000Z",

},
];

@Injectable()
export class BusquedaService {
  // URL del módulo de IA (FastAPI)
  private readonly NLP_URL = process.env.NLP_URL || 'http://localhost:8000';

  constructor(private readonly http: HttpService) {}

  /**
   * PUNTO 2: Búsqueda híbrida
   * GET /busqueda/ofertas
   */
  async list(query: ListBusquedaDto) {
    // 0. Base: siempre trabajamos sobre MOC (tu amigo luego puede cambiar esto por ROBLE)
    let data: ScoredOferta[] = [...MOCK_OFERTAS];

    // 1. Filtro por categoría (si viene)
    if (query.categoria) {
      data = data.filter((o) => o.categoriaId === query.categoria);
    }

    // 2. Cálculo de scores híbridos (texto + semántico via IA)
    if (query.q) {
      const term = query.q.toLowerCase();

      // Scores semánticos desde el módulo de IA
      const semanticScoresMap = await this.fetchSemanticScores(query);
      //console.log('[BusquedaService] Semantic scores map:', semanticScoresMap);
      data = data
        .map((o) => {
          const textScore = this.computeTextScore(o, term); // 0,1,2
          const semanticScore = semanticScoresMap.get(o._id) ?? 0; // [0,1]
          const hybridScore = 0.6 * textScore + 0.4 * semanticScore;
       /*   console.log(`[BusquedaService] Oferta ${o._id} scores:`, {
            textScore,
            semanticScore,
            hybridScore,
          });

          */

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

      // Mapear IDs devueltos por la IA → ofertas mock (o ROBLE si luego lo cambian)
      const ofertasPorId = new Map(MOCK_OFERTAS.map((o) => [o._id, o]));
      const recomendadas: MockOferta[] = ids
        .map((id) => ofertasPorId.get(id))
        .filter((o): o is MockOferta => !!o);

      return {
        userId,
        origen: 'IA (módulo NLP /recommendations)',
        categoriaFiltrada: categoria ?? null,
        idsRecibidos: ids,
        ofertasRecomendadas: recomendadas,
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
      console.log('[BusquedaService] NLP /search result ids:', ids);

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
