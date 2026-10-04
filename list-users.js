const prisma = require('./utils/prisma');
async function main() {
    const users = await prisma.users.findMany();
    console.log(users);
}
main().finally(() => prisma.$disconnect());
