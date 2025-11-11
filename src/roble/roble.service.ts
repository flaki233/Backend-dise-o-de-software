import { Injectable } from '@nestjs/common';
import axios from 'axios';

interface RobleColumn {
  name: string;
  type: string;
  isPrimary?: boolean;
  isNullable?: boolean;
  defaultValue?: any;
}

interface CreateTableDto {
  tableName: string;
  description?: string;
  columns: RobleColumn[];
}

@Injectable()
export class RobleService {
  private readonly apiUrl: string;
  private readonly projectToken: string;
  private accessToken: string;

  constructor() {
    this.apiUrl = process.env.ROBLE_API_URL || 'https://roble-api.openlab.uninorte.edu.co';
    this.projectToken = process.env.ROBLE_PROJECT_TOKEN || 'trueque_29b341a61b';
    this.accessToken = process.env.ROBLE_ACCESS_TOKEN || '';
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.accessToken}`,
    };
  }

  async createTable(data: CreateTableDto) {
    const url = `${this.apiUrl}/database/${this.projectToken}/create-table`;
    
    try {
      const response = await axios.post(url, data, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error creando tabla en ROBLE: ${error.response?.data?.message || error.message}`);
    }
  }

  async insertRecord(tableName: string, data: Record<string, any>) {
    const url = `${this.apiUrl}/database/${this.projectToken}/insert`;
    
    try {
      const response = await axios.post(url, {
        tableName,
        records: [data]
      }, {
        headers: this.getHeaders(),
      });
      return response.data.inserted?.[0] || response.data;
    } catch (error: any) {
      throw new Error(`Error insertando registro: ${error.response?.data?.message || error.message}`);
    }
  }

  async getRecords(tableName: string, filters?: Record<string, any>) {
    const url = `${this.apiUrl}/database/${this.projectToken}/read`;
    
    try {
      const response = await axios.get(url, {
        headers: this.getHeaders(),
        params: {
          tableName,
          ...filters,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error obteniendo registros: ${error.response?.data?.message || error.message}`);
    }
  }

  async updateRecord(tableName: string, recordId: string, updates: Record<string, any>) {
    const url = `${this.apiUrl}/database/${this.projectToken}/update`;
    
    try {
      const response = await axios.put(url, {
        tableName,
        idColumn: '_id',
        idValue: recordId,
        updates,
      }, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error actualizando registro: ${error.response?.data?.message || error.message}`);
    }
  }

  async deleteRecord(tableName: string, recordId: string) {
    const url = `${this.apiUrl}/database/${this.projectToken}/delete`;
    
    try {
      const response = await axios.delete(url, {
        headers: this.getHeaders(),
        data: {
          tableName,
          idColumn: '_id',
          idValue: recordId,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error eliminando registro: ${error.response?.data?.message || error.message}`);
    }
  }

  async listTables() {
    const url = `${this.apiUrl}/database/${this.projectToken}/tables`;
    
    try {
      const response = await axios.get(url, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error listando tablas: ${error.response?.data?.message || error.message}`);
    }
  }

  async signup(email: string, password: string, name: string) {
    const url = `${this.apiUrl}/auth/${this.projectToken}/signup`;
    
    try {
      const response = await axios.post(url, {
        email,
        password,
        name,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error en signup: ${error.response?.data?.message || error.message}`);
    }
  }

  async signupDirect(email: string, password: string, name: string) {
    const url = `${this.apiUrl}/auth/${this.projectToken}/signup-direct`;
    
    try {
      const response = await axios.post(url, {
        email,
        password,
        name,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error en signup directo: ${error.response?.data?.message || error.message}`);
    }
  }

  async verifyEmail(email: string, code: string) {
    const url = `${this.apiUrl}/auth/${this.projectToken}/verify-email`;
    
    try {
      const response = await axios.post(url, {
        email,
        code,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error verificando email: ${error.response?.data?.message || error.message}`);
    }
  }

  async login(email: string, password: string) {
    const url = `${this.apiUrl}/auth/${this.projectToken}/login`;
    
    try {
      const response = await axios.post(url, {
        email,
        password,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error en login: ${error.response?.data?.message || error.message}`);
    }
  }

  async refreshToken(refreshToken: string) {
    const url = `${this.apiUrl}/auth/${this.projectToken}/refresh-token`;
    
    try {
      const response = await axios.post(url, {
        refreshToken,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error refrescando token: ${error.response?.data?.message || error.message}`);
    }
  }

  async forgotPassword(email: string) {
    const url = `${this.apiUrl}/auth/${this.projectToken}/forgot-password`;
    
    try {
      const response = await axios.post(url, {
        email,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error en forgot password: ${error.response?.data?.message || error.message}`);
    }
  }

  async resetPassword(token: string, newPassword: string) {
    const url = `${this.apiUrl}/auth/${this.projectToken}/reset-password`;
    
    try {
      const response = await axios.post(url, {
        token,
        newPassword,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error reseteando password: ${error.response?.data?.message || error.message}`);
    }
  }

  async logout(accessToken?: string) {
    const url = `${this.apiUrl}/auth/${this.projectToken}/logout`;
    
    try {
      const headers = accessToken 
        ? { 'Authorization': `Bearer ${accessToken}` }
        : this.getHeaders();
        
      const response = await axios.post(url, null, { headers });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error en logout: ${error.response?.data?.message || error.message}`);
    }
  }

  async verifyToken(token: string) {
    const url = `${this.apiUrl}/auth/${this.projectToken}/verify-token`;
    
    try {
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error verificando token: ${error.response?.data?.message || error.message}`);
    }
  }
}
