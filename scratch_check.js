const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const result = await prisma.$queryRawUnsafe("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'bookings'");
  console.log(result);
}
main().catch(console.error).finally(() => prisma.$disconnect());
