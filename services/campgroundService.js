const campgroundModel = require('../models/campgroundModel');

const campgroundService = {
    async listCampgrounds(filters = {}) {
        const { data, error } = await campgroundModel.findAll(filters);
        if (error) throw error;

        return data
            .filter(campground => campground.title && campground.title.trim() !== '')
            .map(campground => ({ ...campground, _id: campground.id }));
    },

    async getCampground(id) {
        const reviewModel = require('../models/reviewModel');
        const { data: campground, error: campError } = await campgroundModel.findById(id);
        if (campError || !campground) return { error: campError };

        const { data: reviews, error: revError } = await reviewModel.findByCampgroundId(id);
        if (!revError && reviews) {
            campground.reviews = reviews;
        } else {
            campground.reviews = [];
        }

        return { data: campground };
    },

    async createCampground(attributes, owner) {
        const { data, error } = await campgroundModel.create({ ...attributes, owner });
        if (error) throw error;
        return data;
    },

    async updateCampground(id, attributes) {
        const { data, error } = await campgroundModel.updateById(id, attributes);
        if (error) throw error;
        return data;
    },

    async deleteCampground(id) {
        const { error } = await campgroundModel.deleteById(id);
        if (error) throw error;
    }
};

module.exports = campgroundService;