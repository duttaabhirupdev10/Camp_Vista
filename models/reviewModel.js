const prisma = require('../utils/prisma');

const reviewModel = {
    async create(review) {
        try {
            const data = await prisma.reviews.create({ data: review });
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    async deleteById(id) {
        try {
            const data = await prisma.reviews.delete({ where: { id } });
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    async findByCampgroundId(campgroundId) {
        try {
            const data = await prisma.reviews.findMany({
                where: { campground_id: campgroundId },
                include: {
                    users: { select: { email: true } }
                },
                orderBy: { created_at: 'desc' }
            });
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    async findById(id) {
        try {
            const data = await prisma.reviews.findUnique({
                where: { id }
            });
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }
};

module.exports = reviewModel;
