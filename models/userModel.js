const prisma = require('../utils/prisma');

const userModel = {
    async findRoleById(id) {
        try {
            const user = await prisma.users.findUnique({
                where: { id: id },
                select: { role: true }
            });
            return { data: user, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    async create(user) {
        try {
            const newUser = await prisma.users.create({
                data: user
            });
            return { data: newUser, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    async updateRole(id, role) {
        try {
            const updatedUser = await prisma.users.update({
                where: { id: id },
                data: { role: role }
            });
            return { data: updatedUser, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }
};

module.exports = userModel;