import { Injectable } from '@nestjs/common';
import { RobleService } from '../roble/roble.service';
import { SuggestionQueryDto } from './dtos/suggestion-query.dto';

// Estructura mínima de una oferta para sugerencias
type Oferta = {
  _id: string;
  titulo: string;
  comentarioObligatorio?: string;
  categoriaId?: string;
  precio?: number;
  userId: string;
  status?: string;
  activo?: boolean;
  createdAt?: string;
};

// MOCK de ejemplo (por si estás en modo MOCK_ROBLE)
const MOCK_OFERTAS: Oferta[] = [
  {
    _id: 'of-1',
    titulo: 'Bicicleta MTB rin 29',
    comentarioObligatorio: 'Buen estado, cambio por patineta o celular.',
    categoriaId: 'deportes',
    precio: 900000,
    userId: 'user-10',
    status: 'PUBLICADA',
    activo: true,
    createdAt: '2025-11-09T20:11:00.000Z',
  },
  {
    _id: 'of-2',
    titulo: 'Silla gamer ergonómica roja',
    comentarioObligatorio: 'Busco trueque por monitor 24".',
    categoriaId: 'hogar',
    precio: 250000,
    userId: 'user-11',
    status: 'PUBLICADA',
    activo: true,
    createdAt: '2025-11-08T15:40:00.000Z',
  },
  {
    _id: 'of-3',
    titulo: 'Nintendo Switch Lite',
    comentarioObligatorio: 'Cambio por bici o portátil gama baja.',
    categoriaId: 'electronica',
    precio: 700000,
    userId: 'user-12',
    status: 'PUBLICADA',
    activo: true,
    createdAt: '2025-11-05T10:00:00.000Z',
  },
];

function nowISO() {
  return new Date().toISOString();
}

@Injectable()
export class SuggestionsService {
  constructor(private readonly roble: RobleService) {}

  private isMock() {
    // Nos guiamos por la variable de entorno, igual que en otros servicios
    return process.env.MOCK_ROBLE === 'true';
  }

  /**
   * Obtiene las ofertas creadas por el usuario (su "perfil").
   */
  private async getUserOffers(userId: string): Promise<Oferta[]> {
    if (this.isMock()) {
      return MOCK_OFERTAS.filter((o) => o.userId === userId);
    }

    const res = await this.roble.getRecords('oferta', { userId });
    const records = ((res as any).records ?? res ?? []) as Oferta[];
    return records;
  }

  /**
   * Ofertas públicas de otros usuarios (candidatas a sugerencia).
   */
  private async getCandidateOffers(
    excludeUserId: string,
  ): Promise<Oferta[]> {
    if (this.isMock()) {
      return MOCK_OFERTAS.filter((o) => o.userId !== excludeUserId);
    }

    // Pedimos todas y filtramos en memoria (puedes refinar con filtros cuando ROBLE lo soporte)
    const res = await this.roble.getRecords('oferta');
    const records = ((res as any).records ?? res ?? []) as Oferta[];

    return records.filter(
      (o) =>
        o.userId !== excludeUserId &&
        o.activo !== false &&
        (o.status ?? 'PUBLICADA') === 'PUBLICADA',
    );
  }

  /**
   * Dado el historial de ofertas del usuario, saca las categorías favoritas.
   */
  private computeTopCategories(userOffers: Oferta[]): string[] {
    const counts: Record<string, number> = {};
    for (const o of userOffers) {
      if (!o.categoriaId) continue;
      counts[o.categoriaId] = (counts[o.categoriaId] ?? 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([cat]) => cat);
  }

  /**
   * Score simple: más puntos si coincide categoría favorita
   * y si es más reciente.
   */
  private scoreOffer(
    oferta: Oferta,
    topCategories: string[],
  ): number {
    let score = 0;

    const catIndex = oferta.categoriaId
      ? topCategories.indexOf(oferta.categoriaId)
      : -1;

    if (catIndex >= 0) {
      // Cuanto más arriba en la lista de favoritas, más puntos
      score += 50 - catIndex * 10;
    }

    // Bonus por recencia (máx 50 puntos)
    if (oferta.createdAt) {
      const ageMs = (Date.now() - new Date(oferta.createdAt).getTime());
      const ageDays = ageMs / (1000 * 60 * 60 * 24);
      const recencyBonus = Math.max(0, 50 - ageDays); // se va apagando con el tiempo
      score += recencyBonus;
    }

    return score;
  }

  /**
   * Endpoint principal: sugerencias personalizadas.
   */
  async getSuggestionsForUser(
    userId: string,
    query: SuggestionQueryDto,
  ) {
    const limit = Math.min(query.limit ?? 10, 50);

    // 1. Historial del usuario (ofertas propias)
    const userOffers = await this.getUserOffers(userId);

    // 2. Categorías "favoritas"
    const topCategories = this.computeTopCategories(userOffers);

    // 3. Ofertas candidatas (otros usuarios)
    let candidates = await this.getCandidateOffers(userId);

    // Si filtra por categoría explícita
    if (query.categoriaId) {
      candidates = candidates.filter(
        (c) => c.categoriaId === query.categoriaId,
      );
    }

    // 4. Ordenar por score
    const scored = candidates
      .map((o) => ({
        ...o,
        score: this.scoreOffer(o, topCategories),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return {
      userId,
      meta: {
        limit,
        basedOnCategories: topCategories,
        totalCandidates: candidates.length,
        totalReturned: scored.length,
      },
      data: scored,
    };
  }
}

