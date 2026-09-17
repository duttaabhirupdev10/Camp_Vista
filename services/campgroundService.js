const campgroundModel = require('../models/campgroundModel');

const campgroundService = {
    async listCampgrounds() {
        const { data, error } = await campgroundModel.findAll();
        if (error) throw error;

        return data
            .filter(campground => campground.title && campground.title.trim() !== '')
            .map(campground => ({ ...campground, _id: campground.id }));
    },

    async getCampground(id) {
        return campgroundModel.findById(id);
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