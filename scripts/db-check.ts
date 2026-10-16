import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    const tables = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name` as { table_name: string }[];
    console.log('TABLE_COUNT=' + tables.length);
    console.log('TABLES=' + tables.map((t) => t.table_name).join(','));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error('DB_CHECK_ERROR_CODE=' + (e.code ?? 'UNKNOWN'));
  console.error('DB_CHECK_ERROR=' + String(e.message).split('\n').slice(0, 3).join(' | '));
  process.exit(1);
});
