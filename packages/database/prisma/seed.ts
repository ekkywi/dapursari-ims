import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@dapursari.local';
  const passwordHash = await bcrypt.hash('Admin123!', 10);

  await prisma.user.upsert({
    where: { email },
    update: {
      name: 'Super Admin',
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    },
    create: {
      email,
      name: 'Super Admin',
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    },
  });

  console.log('Seeder Super Admin:', email, '(password: Admin123!)');

  // Modul 2 — master data gudang
  const categories = [
    'Sayuran',
    'Buah',
    'Daging & Unggas',
    'Seafood',
    'Bumbu & Rempah',
    'Bahan Kering',
    'Minuman',
  ];
  const units = ['kg', 'gram', 'liter', 'ml', 'pcs', 'pack', 'ikat', 'karton'];

  for (const name of categories) {
    await prisma.category.upsert({ where: { name }, update: {}, create: { name } });
  }
  for (const name of units) {
    await prisma.unit.upsert({ where: { name }, update: {}, create: { name } });
  }

  console.log(`Seeder kategori (${categories.length}) & satuan (${units.length})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
