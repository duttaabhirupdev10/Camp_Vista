const prisma = require('./utils/prisma');

async function makeAdmin() {
    try {
        // Get all users
        const users = await prisma.users.findMany();
        
        if (users.length === 0) {
            console.log("No users found in the database. Please sign up in the app first!");
            return;
        }

        // Sort by newest first (assuming the last one in the array is the newest, or we can just pick the last one)
        const latestUser = users[users.length - 1];

        // Update the role to admin
        await prisma.users.update({
            where: { id: latestUser.id },
            data: { role: 'admin' }
        });

        console.log(`✅ Successfully promoted user ${latestUser.id} to ADMIN!`);
        console.log("You can now log in with that account to access admin features.");
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await prisma.$disconnect();
    }
}

makeAdmin();
