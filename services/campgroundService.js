const campgroundModel = require('../models/campgroundModel');
const { computeAvailability } = require('../utils/availability');

function withAvailability(campground, checkIn = null, checkOut = null) {
    const { bookings = [], ...rest } = campground;
    const availability = computeAvailability(rest, bookings, checkIn, checkOut);
    return {
        ...rest,
        _id: rest.id,
        total_rooms: availability.total_rooms,
        booked_rooms: availability.booked_rooms,
        available_rooms: availability.available_rooms
    };
}

const campgroundService = {
    async listCampgrounds(filters = {}) {
        const { data, error } = await campgroundModel.findAll(filters);
        if (error) throw error;

        return data
            .filter(campground => campground.title && campground.title.trim() !== '')
            .map(campground => withAvailability(campground, filters.check_in, filters.check_out));
    },

    async getCampground(id, filters = {}) {
        const reviewModel = require('../models/reviewModel');
        const { data: campground, error: campError } = await campgroundModel.findByIdWithBookings(id);
        if (campError || !campground) return { error: campError };

        const enriched = withAvailability(campground, filters.check_in, filters.check_out);

        const { data: reviews, error: revError } = await reviewModel.findByCampgroundId(id);
        if (!revError && reviews) {
            enriched.reviews = reviews;
        } else {
            enriched.reviews = [];
        }

        return { data: enriched };
    },

    async getAvailability(id, checkIn = null, checkOut = null) {
        const { data: campground, error } = await campgroundModel.findByIdWithBookings(id);
        if (error || !campground) return { data: null, error };

        const availability = computeAvailability(campground, campground.bookings || [], checkIn, checkOut);
        return { data: availability, error: null };
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
