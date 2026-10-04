const bookingModel = require('../models/bookingModel');
const mailer = require('../utils/mailer');

const ownerController = {
    async manageBookings(req, res) {
        try {
            if (!res.locals.currentUser || (res.locals.currentUser.role !== 'owner' && res.locals.currentUser.role !== 'admin')) {
                return res.redirect('/campgrounds');
            }

            const { data: bookings, error } = await bookingModel.findBookingsByOwnerId(res.locals.currentUser.id);
            if (error) throw error;

            res.render('owner/manage-bookings', { bookings });
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
