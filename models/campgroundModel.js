const prisma = require('../utils/prisma');

const campgroundModel = {
    async findAll(filters = {}) {
        let where = {};
        if (filters.search) {
            where.OR = [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { location: { contains: filters.search, mode: 'insensitive' } }
            ];
        }
        if (filters.maxPrice) {
            where.price = { lte: parseFloat(filters.maxPrice) };
        }
        try {
            const data = await prisma.campgrounds.findMany({ where });
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    async findById(id) {
        try {
            const data = await prisma.campgrounds.findUnique({ where: { id } });
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    async findOwnerById(id) {
        try {
            const data = await prisma.campgrounds.findUnique({
                where: { id },
                select: { owner: true }
            });
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    async create(attributes) {
        try {
            const data = await prisma.campgrounds.create({ data: attributes });
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    async updateById(id, attributes) {
        try {
            const data = await prisma.campgrounds.update({
                where: { id },
                data: attributes
            });
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    async deleteById(id) {
        try {
            const data = await prisma.campgrounds.delete({ where: { id } });
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }
};

module.exports = campgroundModel;