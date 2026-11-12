const bookingModel = require('../models/bookingModel');
const campgroundService = require('../services/campgroundService');
const mailer = require('../utils/mailer');

const ownerController = {
    async manageBookings(req, res) {
        try {
            if (!res.locals.currentUser || (res.locals.currentUser.role !== 'owner' && res.locals.currentUser.role !== 'admin')) {
                return res.redirect('/campgrounds');
            }

            const isAdmin = res.locals.currentUser.role === 'admin';
            const [{ data: bookings, error }, campgrounds] = await Promise.all([
                isAdmin
                    ? bookingModel.findAllBookings()
                    : bookingModel.findBookingsByOwnerId(res.locals.currentUser.id),
                campgroundService.listCampgrounds(isAdmin ? {} : { ownerId: res.locals.currentUser.id })
            ]);

            if (error) throw error;

            res.render('owner/manage-bookings', { bookings, campgrounds, isAdmin });
        } catch (error) {
            console.error(error);
            res.send('Error fetching bookings');
        }
    },

    async updateBookingStatus(req, res) {
        try {
            const { bookingId } = req.params;
            const { status } = req.body;

            const { data: booking, error: updateError } = await bookingModel.updateStatus(bookingId, status);
            if (updateError) throw updateError;

            res.redirect('/manage-bookings');
        } catch (error) {
            console.error(error);
            res.send('Error updating booking status');
        }
    }
};

module.exports = ownerController;
