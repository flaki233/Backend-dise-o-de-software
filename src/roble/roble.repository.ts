import { Injectable, NotFoundException } from '@nestjs/common';
import { RobleService } from './roble.service';

interface User {
  id: string;
  email: string;
  name?: string;
  location?: string;
  bio?: string;
  reputationScore: number;
  tradesClosed: number;
  active: boolean;
  role: string;
  verified: boolean;
}

interface Trade {
  id: string;
  proposerId: string;
  responderId: string;
  proposerOfferJson: any;
  responderOfferJson: any;
  proposerConfirmed: boolean;
  responderConfirmed: boolean;
  status: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface Oferta {
  id: string;
  titulo: string;
  condicionTrueque: string;
  comentarioObligatorio: string;
  latitud: number;
  longitud: number;
  userId: string;
  categoriaId: string;
  status: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CategoriaOferta {
  id: string;
  nombre: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class RobleRepository {
  constructor(private roble: RobleService) {}

  async findUserByEmail(email: string): Promise<User | null> {
    try {
      const records = await this.roble.getRecords('Usuarios_Aplicacion', { email });
      if (!records || records.length === 0) return null;
      return records[0];
    } catch (error) {
      return null;
    }
  }

  async findUserById(id: string): Promise<User | null> {
    try {
      const records = await this.roble.getRecords('Usuarios_Aplicacion', { userId: id });
      if (!records || records.length === 0) return null;
      return records[0];
    } catch (error) {
      return null;
    }
  }

  async createUser(data: Partial<User>): Promise<User> {
    const userData = {
      ...data,
      reputationScore: data.reputationScore ?? 0,
      tradesClosed: data.tradesClosed ?? 0,
      active: data.active ?? true,
      role: data.role ?? 'OFERENTE',
      verified: data.verified ?? false,
      createdAt: new Date().toISOString(),
    };
    
    return await this.roble.insertRecord('Usuarios_Aplicacion', userData);
  }

  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new NotFoundException(`Usuario con userId ${userId} no encontrado`);
    }
    return await this.roble.updateRecord('Usuarios_Aplicacion', (user as any)._id, data);
  }

  async findTradeById(id: string): Promise<Trade | null> {
    try {
      const records = await this.roble.getRecords('Trade', { _id: id });
      if (!records || records.length === 0) return null;
      return records[0];
    } catch (error) {
      return null;
    }
  }

  async findTradesByProposer(proposerId: string): Promise<Trade[]> {
    try {
      return await this.roble.getRecords('Trade', { proposerId });
    } catch (error) {
      return [];
    }
  }

  async findTradesByResponder(responderId: string): Promise<Trade[]> {
    try {
      return await this.roble.getRecords('Trade', { responderId });
    } catch (error) {
      return [];
    }
  }

  async createTrade(data: Partial<Trade>): Promise<Trade> {
    const tradeData = {
      ...data,
      proposerConfirmed: data.proposerConfirmed ?? false,
      responderConfirmed: data.responderConfirmed ?? false,
      status: data.status ?? 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return await this.roble.insertRecord('Trade', tradeData);
  }

  async updateTrade(id: string, data: Partial<Trade>): Promise<Trade> {
    return await this.roble.updateRecord('Trade', id, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  }

  async createTradeClosure(data: any) {
    const closureData = {
      ...data,
      createdAt: new Date().toISOString(),
    };
    
    return await this.roble.insertRecord('TradeClosure', closureData);
  }

  async findTradeClosureByTradeId(tradeId: string) {
    try {
      const records = await this.roble.getRecords('TradeClosure', { tradeId });
      if (!records || records.length === 0) return null;
      return records[0];
    } catch (error) {
      return null;
    }
  }

  async findOfertaById(id: string): Promise<Oferta | null> {
    try {
      const records = await this.roble.getRecords('Oferta', { _id: id, activo: true });
      if (!records || records.length === 0) return null;
      return records[0];
    } catch (error) {
      return null;
    }
  }

  async findOfertasByUser(userId: string, filters: any = {}): Promise<Oferta[]> {
    try {
      return await this.roble.getRecords('Oferta', {
        userId,
        activo: true,
        ...filters,
      });
    } catch (error) {
      return [];
    }
  }

  async findPublicOfertas(filters: any = {}): Promise<Oferta[]> {
    try {
      return await this.roble.getRecords('Oferta', {
        activo: true,
        status: 'PUBLICADA',
        ...filters,
      });
    } catch (error) {
      return [];
    }
  }

  async createOferta(data: Partial<Oferta>): Promise<Oferta> {
    const ofertaData = {
      ...data,
      status: data.status ?? 'BORRADOR',
      activo: data.activo ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return await this.roble.insertRecord('Oferta', ofertaData);
  }

  async updateOferta(id: string, data: Partial<Oferta>): Promise<Oferta> {
    return await this.roble.updateRecord('Oferta', id, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  }

  async createImagenOferta(data: any) {
    const imagenData = {
      ...data,
      createdAt: new Date().toISOString(),
    };
    
    return await this.roble.insertRecord('ImagenOferta', imagenData);
  }

  async findImagenesByOferta(ofertaId: string) {
    try {
      return await this.roble.getRecords('ImagenOferta', { ofertaId });
    } catch (error) {
      return [];
    }
  }

  async findCategoriaById(id: string): Promise<CategoriaOferta | null> {
    try {
      const records = await this.roble.getRecords('CategoriaOferta', { _id: id, activo: true });
      if (!records || records.length === 0) return null;
      return records[0];
    } catch (error) {
      return null;
    }
  }

  async findAllCategorias(): Promise<CategoriaOferta[]> {
    try {
      return await this.roble.getRecords('CategoriaOferta', { activo: true });
    } catch (error) {
      return [];
    }
  }

  async createCategoria(data: Partial<CategoriaOferta>): Promise<CategoriaOferta> {
    const categoriaData = {
      nombre: data.nombre,
      activo: data.activo ?? true,
    };
    
    return await this.roble.insertRecord('CategoriaOferta', categoriaData);
  }

  async updateCategoria(id: string, data: Partial<CategoriaOferta>): Promise<CategoriaOferta> {
    const updates: any = {};
    if (data.nombre !== undefined) updates.nombre = data.nombre;
    if (data.activo !== undefined) updates.activo = data.activo;
    
    return await this.roble.updateRecord('CategoriaOferta', id, updates);
  }
}

