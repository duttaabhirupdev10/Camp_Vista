const bookingModel = require('../models/bookingModel');
const campgroundModel = require('../models/campgroundModel');

const bookingController = {
    async showPaymentPage(req, res) {
        try {
            const campgroundId = req.params.id;
            const { check_in, check_out } = req.body;
            const members = Math.max(1, parseInt(req.body.members || req.body.guests || 1, 10));

            const { data: campground, error: campError } = await campgroundModel.findById(campgroundId);
            if (campError || !campground) return res.status(404).send('Campground not found');

            let nights = 1;
            if (check_in && check_out) {
                const parts1 = check_in.split('-').map(Number);
                const parts2 = check_out.split('-').map(Number);
                if (parts1.length === 3 && parts2.length === 3) {
                    const utc1 = Date.UTC(parts1[0], parts1[1] - 1, parts1[2]);
                    const utc2 = Date.UTC(parts2[0], parts2[1] - 1, parts2[2]);
                    const diffDays = Math.round((utc2 - utc1) / (1000 * 60 * 60 * 24));
                    if (diffDays > 0) nights = diffDays;
                }
            }

            const subtotal = campground.price * nights * members;
            const service_fee = Math.round(subtotal * 0.05);
            const total_price = subtotal + service_fee;

            res.render('bookings/payment', { 
                campground, 
                check_in, 
                check_out, 
                members, 
                nights, 
                subtotal, 
                service_fee, 
                total_price 
            });
        } catch (error) {
            console.error(error);
            res.send(error.message);
        }
    },

    async confirmPayment(req, res) {
        try {
            const campgroundId = req.params.id;
            const userId = res.locals.currentUser.id;
            const { check_in, check_out, total_price } = req.body;

            const booking = {
                campground_id: campgroundId,
                user_id: userId,
                check_in: new Date(check_in),
                check_out: new Date(check_out),
                total_price: parseFloat(total_price),
                status: 'pending'
            };

            const { error: bookingError } = await bookingModel.create(booking);
            if (bookingError) throw bookingError;

            // In-app notification handles owner awareness now
            res.redirect('/my-bookings');
        } catch (error) {
            console.error(error);
            res.send(error.message);
        }
    },

    async myBookings(req, res) {
        try {
            if (!res.locals.currentUser) {
                return res.redirect('/login');
            }

            const { data: bookings, error } = await bookingModel.findByUserId(res.locals.currentUser.id);
            if (error) throw error;

            res.render('bookings/index', { bookings });
        } catch (error) {
            console.error(error);
            res.send(error.message);
        }
    }
};

module.exports = bookingController;
