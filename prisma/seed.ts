import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const categorias = [
    'Libros',
    'Electrónica',
    'Ropa',
    'Deportes',
    'Hogar',
    'Juguetes',
    'Otros',
  ];

  for (const nombre of categorias) {
    await prisma.categoriaOferta.upsert({
      where: { id: categorias.indexOf(nombre) + 1 },
      update: {},
      create: { nombre },
    });
  }

  console.log('✅ Categorías creadas');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

