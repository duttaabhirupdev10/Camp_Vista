const prisma = require('./utils/prisma');

async function test() {
    try {
        const ownerId = 'test-id';
        const data = await prisma.bookings.findMany({
            where: {
                campgrounds: { owner: ownerId }
            },
            include: {
                campgrounds: { select: { title: true, owner: true } },
                users: { select: { email: true } }
            },
            orderBy: { created_at: 'desc' }
        });
        console.log("Success:", data);
    } catch (e) {
        console.error("Error:", e.message);
    } finally {
        prisma.$disconnect();
    }
}
test();
