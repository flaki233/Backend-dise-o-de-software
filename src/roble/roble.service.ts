import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestHeaders } from 'axios';

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

function envBool(name: string, def = false): boolean {
  const v = (process.env[name] ?? '').trim().toLowerCase();
  if (v === 'true') return true;
  if (v === 'false') return false;
  return def;
}
function mask(t?: string) {
  if (!t) return '(empty)';
  return t.length <= 8 ? '********' : t.slice(0, 4) + '...' + t.slice(-4);
}

@Injectable()
export class RobleService {
  private readonly apiUrl: string;
  private readonly projectToken: string;
  private accessToken: string;
  private readonly isMock: boolean;

  constructor() {
    this.apiUrl = process.env.ROBLE_API_URL || 'https://roble-api.openlab.uninorte.edu.co';
    // Acepta ambos nombres por compatibilidad
    this.projectToken =
      process.env.ROBLE_PROJECT_TOKEN ||
      process.env.ROBLE_TOKEN || // tu env antiguo
      'trueque_29b341a61b';

    this.accessToken = process.env.ROBLE_ACCESS_TOKEN || '';

    //  CAMBIO CLAVE:
    // - Si MOCK_ROBLE = true  → MOCK
    // - Si NO hay ROBLE_ACCESS_TOKEN → MOCK
    // - Solo será REAL si MOCK_ROBLE = false y SÍ hay token
    this.isMock = envBool('MOCK_ROBLE', true) || !this.accessToken;

    // Log de diagnóstico al arranque (no imprime el token completo)
    // eslint-disable-next-line no-console
    console.log(
      `[ROBLE] mode=${this.isMock ? 'MOCK' : 'REAL'} | project=${this.projectToken} | token=${mask(
        this.accessToken,
      )}`,
    );
  }


  setAccessToken(token: string) {
    this.accessToken = token ?? '';
  }

  private requireAuth() {
    if (this.isMock) return; // en mock no exigimos token
    if (!this.accessToken) {
      throw new Error('ROBLE_ACCESS_TOKEN ausente. Configure el JWT en el .env');
    }
  }

  private getHeaders() {
    this.requireAuth();
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    };
  }

  // ---------- Database ----------

  async createTable(data: CreateTableDto) {
    if (this.isMock) {
      // En mock: simulamos éxito
      return { ok: true, mock: true, tableName: data.tableName };
    }
    const url = `${this.apiUrl}/database/${this.projectToken}/create-table`;
    try {
      const { data: res } = await axios.post(url, data, { headers: this.getHeaders() });
      return res;
    } catch (error: any) {
      throw new Error(`Error creando tabla en ROBLE: ${error.response?.data?.message || error.message}`);
    }
  }

  async insertRecord(tableName: string, data: Record<string, any>) {
    if (this.isMock) {
      // Simulamos respuesta del insert
      return { inserted: [data], mock: true };
    }
    const url = `${this.apiUrl}/database/${this.projectToken}/insert`;
    try {
      const { data: res } = await axios.post(
        url,
        { tableName, records: [data] },
        { headers: this.getHeaders() },
      );
      return res.inserted?.[0] || res;
    } catch (error: any) {
      throw new Error(`Error insertando registro: ${error.response?.data?.message || error.message}`);
    }
  }

  async getRecords(tableName: string, filters?: Record<string, any>) {
    if (this.isMock) {
      // Devuelve vacío en mock (los servicios de dominio suelen manejar su propio mock)
      return { records: [], mock: true };
    }
    const url = `${this.apiUrl}/database/${this.projectToken}/read`;
    try {
      const { data } = await axios.get(url, {
        headers: this.getHeaders(),
        params: { tableName, ...filters },
      });
      return data;
    } catch (error: any) {
      throw new Error(`Error obteniendo registros: ${error.response?.data?.message || error.message}`);
    }
  }

  async updateRecord(tableName: string, recordId: string, updates: Record<string, any>) {
    if (this.isMock) {
      return { updated: 1, id: recordId, mock: true, updates };
    }
    const url = `${this.apiUrl}/database/${this.projectToken}/update`;
    try {
      const { data } = await axios.put(
        url,
        { tableName, idColumn: '_id', idValue: recordId, updates },
        { headers: this.getHeaders() },
      );
      return data;
    } catch (error: any) {
      throw new Error(`Error actualizando registro: ${error.response?.data?.message || error.message}`);
    }
  }

  async deleteRecord(tableName: string, recordId: string) {
    if (this.isMock) {
      return { deleted: 1, id: recordId, mock: true };
    }
    const url = `${this.apiUrl}/database/${this.projectToken}/delete`;
    try {
      const { data } = await axios.delete(url, {
        headers: this.getHeaders(),
        data: { tableName, idColumn: '_id', idValue: recordId },
      });
      return data;
    } catch (error: any) {
      throw new Error(`Error eliminando registro: ${error.response?.data?.message || error.message}`);
    }
  }

  async listTables() {
    if (this.isMock) {
      return { tables: [], mock: true };
    }
    const url = `${this.apiUrl}/database/${this.projectToken}/tables`;
    try {
      const { data } = await axios.get(url, { headers: this.getHeaders() });
      return data;
    } catch (error: any) {
      throw new Error(`Error listando tablas: ${error.response?.data?.message || error.message}`);
    }
  }

  // ---------- Auth ----------

  async signup(email: string, password: string, name: string) {
    const url = `${this.apiUrl}/auth/${this.projectToken}/signup`;
    try {
      const { data } = await axios.post(url, { email, password, name });
      return data;
    } catch (error: any) {
      throw new Error(`Error en signup: ${error.response?.data?.message || error.message}`);
    }
  }

  async signupDirect(email: string, password: string, name: string) {
    const url = `${this.apiUrl}/auth/${this.projectToken}/signup-direct`;
    try {
      const { data } = await axios.post(url, { email, password, name });
      return data;
    } catch (error: any) {
      throw new Error(`Error en signup directo: ${error.response?.data?.message || error.message}`);
    }
  }

  async verifyEmail(email: string, code: string) {
    const url = `${this.apiUrl}/auth/${this.projectToken}/verify-email`;
    try {
      const { data } = await axios.post(url, { email, code });
      return data;
    } catch (error: any) {
      throw new Error(`Error verificando email: ${error.response?.data?.message || error.message}`);
    }
  }

  async login(email: string, password: string) {
    const url = `${this.apiUrl}/auth/${this.projectToken}/login`;
    try {
      const { data } = await axios.post(url, { email, password });
      return data;
    } catch (error: any) {
      throw new Error(`Error en login: ${error.response?.data?.message || error.message}`);
    }
  }

  async refreshToken(refreshToken: string) {
    const url = `${this.apiUrl}/auth/${this.projectToken}/refresh-token`;
    try {
      const { data } = await axios.post(url, { refreshToken });
      return data;
    } catch (error: any) {
      throw new Error(`Error refrescando token: ${error.response?.data?.message || error.message}`);
    }
  }

  async forgotPassword(email: string) {
    const url = `${this.apiUrl}/auth/${this.projectToken}/forgot-password`;
    try {
      const { data } = await axios.post(url, { email });
      return data;
    } catch (error: any) {
      throw new Error(`Error en forgot password: ${error.response?.data?.message || error.message}`);
    }
  }

  async resetPassword(token: string, newPassword: string) {
    const url = `${this.apiUrl}/auth/${this.projectToken}/reset-password`;
    try {
      const { data } = await axios.post(url, { token, newPassword });
      return data;
    } catch (error: any) {
      throw new Error(`Error reseteando password: ${error.response?.data?.message || error.message}`);
    }
  }

  async logout(accessToken?: string) {
    const url = `${this.apiUrl}/auth/${this.projectToken}/logout`;
    try {
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : this.getHeaders();
      const { data } = await axios.post(url, null, { headers });
      return data;
    } catch (error: any) {
      throw new Error(`Error en logout: ${error.response?.data?.message || error.message}`);
    }
  }

  async verifyToken(token: string) {
    const url = `${this.apiUrl}/auth/${this.projectToken}/verify-token`;
    try {
      const { data } = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      return data;
    } catch (error: any) {
      throw new Error(`Error verificando token: ${error.response?.data?.message || error.message}`);
    }
  }
}
