const bookingModel = require('../models/bookingModel');
const campgroundModel = require('../models/campgroundModel');

const bookingController = {
    async createBooking(req, res) {
        try {
            if (!req.session.user) {
                return res.redirect('/login');
            }

            const campgroundId = req.params.id;
            const userId = req.session.user.id;
            const { check_in, check_out } = req.body;

            // Fetch campground to calculate price
            const { data: campground, error: campError } = await campgroundModel.findById(campgroundId);
            if (campError || !campground) {
                return res.status(404).send('Campground not found');
            }

            // Calculate total price
            const checkInDate = new Date(check_in);
            const checkOutDate = new Date(check_out);
            const diffTime = Math.abs(checkOutDate - checkInDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            const total_price = (diffDays > 0 ? diffDays : 1) * campground.price;

            // Create booking
            const booking = {
                campground_id: campgroundId,
                user_id: userId,
                check_in,
                check_out,
                total_price
            };

            const { error: bookingError } = await bookingModel.create(booking);
            if (bookingError) throw bookingError;

            res.redirect('/my-bookings');
        } catch (error) {
            console.error(error);
            res.send(error.message);
        }
    },

    async myBookings(req, res) {
        try {
            if (!req.session.user) {
                return res.redirect('/login');
            }

            const { data: bookings, error } = await bookingModel.findByUserId(req.session.user.id);
            if (error) throw error;

            res.render('bookings/index', { bookings });
        } catch (error) {
            console.error(error);
            res.send(error.message);
        }
    }
};

module.exports = bookingController;
