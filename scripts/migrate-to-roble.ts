import axios from 'axios';

const ROBLE_PROJECT_TOKEN = process.env.ROBLE_PROJECT_TOKEN || 'trueque_29b341a61b';
const ROBLE_ACCESS_TOKEN = process.env.ROBLE_ACCESS_TOKEN || '';
const ROBLE_API_URL = process.env.ROBLE_API_URL || 'https://roble-api.openlab.uninorte.edu.co';

interface RobleColumn {
  name: string;
  type: string;
  isPrimary: boolean;
  isNullable?: boolean;
  defaultValue?: any;
}

interface CreateTableDto {
  tableName: string;
  description?: string;
  columns: RobleColumn[];
}

async function createTable(data: CreateTableDto) {
  const url = `${ROBLE_API_URL}/database/${ROBLE_PROJECT_TOKEN}/create-table`;
  
  try {
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ROBLE_ACCESS_TOKEN}`,
      },
    });
    console.log(`✅ Tabla ${data.tableName} creada:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Error creando ${data.tableName}:`, error.response?.data || error.message);
    throw error;
  }
}

async function migrateTables() {
  console.log('🚀 Iniciando migración a ROBLE...\n');

  if (!ROBLE_ACCESS_TOKEN) {
    console.error('❌ ERROR: ROBLE_ACCESS_TOKEN no está configurado en .env');
    console.log('\nPor favor obtén tu ACCESS_TOKEN de:');
    console.log('https://roble.openlab.uninorte.edu.co/docs/autenticacion');
    process.exit(1);
  }

  const tables: CreateTableDto[] = [
    {
      tableName: 'Oferta',
      description: 'Ofertas de trueque',
      columns: [
        { name: 'titulo', type: 'varchar(255)', isPrimary: false, isNullable: false },
        { name: 'condicionTrueque', type: 'varchar(255)', isPrimary: false, isNullable: false },
        { name: 'comentarioObligatorio', type: 'varchar(255)', isPrimary: false, isNullable: false },
        { name: 'latitud', type: 'double precision', isPrimary: false, isNullable: false },
        { name: 'longitud', type: 'double precision', isPrimary: false, isNullable: false },
        { name: 'userId', type: 'varchar(255)', isPrimary: false, isNullable: false },
        { name: 'categoriaId', type: 'varchar(12)', isPrimary: false, isNullable: false },
        { name: 'status', type: 'varchar(50)', isPrimary: false, isNullable: false },
        { name: 'activo', type: 'boolean', isPrimary: false, isNullable: false },
        { name: 'createdAt', type: 'timestamp', isPrimary: false, isNullable: true },
        { name: 'updatedAt', type: 'timestamp', isPrimary: false, isNullable: true },
      ],
    },
    {
      tableName: 'ImagenOferta',
      description: 'Imágenes de ofertas',
      columns: [
        { name: 'ofertaId', type: 'varchar(12)', isPrimary: false, isNullable: false },
        { name: 'url', type: 'text', isPrimary: false, isNullable: false },
        { name: 'nombre', type: 'varchar(255)', isPrimary: false, isNullable: true },
        { name: 'tamanioBytes', type: 'integer', isPrimary: false, isNullable: false },
        { name: 'orden', type: 'integer', isPrimary: false, isNullable: false },
        { name: 'createdAt', type: 'timestamp', isPrimary: false, isNullable: true },
      ],
    },
    {
      tableName: 'Trade',
      description: 'Trueques entre usuarios',
      columns: [
        { name: 'proposerId', type: 'varchar(255)', isPrimary: false, isNullable: false },
        { name: 'responderId', type: 'varchar(255)', isPrimary: false, isNullable: false },
        { name: 'proposerOfferJson', type: 'jsonb', isPrimary: false, isNullable: false },
        { name: 'responderOfferJson', type: 'jsonb', isPrimary: false, isNullable: false },
        { name: 'proposerConfirmed', type: 'boolean', isPrimary: false, isNullable: false },
        { name: 'responderConfirmed', type: 'boolean', isPrimary: false, isNullable: false },
        { name: 'status', type: 'varchar(50)', isPrimary: false, isNullable: false },
        { name: 'closedAt', type: 'timestamp', isPrimary: false, isNullable: true },
        { name: 'createdAt', type: 'timestamp', isPrimary: false, isNullable: true },
        { name: 'updatedAt', type: 'timestamp', isPrimary: false, isNullable: true },
      ],
    },
    {
      tableName: 'TradeClosure',
      description: 'Registro de cierres de trueques',
      columns: [
        { name: 'tradeId', type: 'varchar(12)', isPrimary: false, isNullable: false },
        { name: 'proposerId', type: 'varchar(255)', isPrimary: false, isNullable: false },
        { name: 'responderId', type: 'varchar(255)', isPrimary: false, isNullable: false },
        { name: 'offerA', type: 'jsonb', isPrimary: false, isNullable: false },
        { name: 'offerB', type: 'jsonb', isPrimary: false, isNullable: false },
        { name: 'closedAt', type: 'timestamp', isPrimary: false, isNullable: false },
        { name: 'finalStatus', type: 'varchar(50)', isPrimary: false, isNullable: false },
        { name: 'createdAt', type: 'timestamp', isPrimary: false, isNullable: true },
      ],
    },
  ];

  for (const table of tables) {
    try {
      await createTable(table);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error procesando tabla ${table.tableName}`);
    }
  }

  console.log('\n✅ Migración completada');
}

migrateTables().catch(console.error);
