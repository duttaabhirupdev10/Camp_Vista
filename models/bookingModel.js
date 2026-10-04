const prisma = require('../utils/prisma');

const bookingModel = {
    async create(booking) {
        try {
            // Prisma expects Dates for check_in and check_out if they are DateTime
            // But if they are string in schema? In schema.prisma we didn't see check_in/check_out!
            // Wait, let's check schema.prisma
            const data = await prisma.bookings.create({ data: booking });
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    async findByUserId(userId) {
        try {
            const data = await prisma.bookings.findMany({
                where: { user_id: userId },
                include: {
                    campgrounds: {
                        select: { title: true, image: true, location: true, price: true }
                    }
                },
                orderBy: { created_at: 'desc' }
            });
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    async findByCampgroundId(campgroundId) {
        try {
            const data = await prisma.bookings.findMany({
                where: { campground_id: campgroundId }
            });
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    async findById(id) {
        try {
            const data = await prisma.bookings.findUnique({
                where: { id },
                include: {
                    campgrounds: {
                        select: { title: true, owner: true }
                    }
                }
            });
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    async findBookingsByOwnerId(ownerId) {
        try {
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
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    async updateStatus(id, status) {
        try {
            const data = await prisma.bookings.update({
                where: { id },
                data: { status }
            });
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }
};

module.exports = bookingModel;
