const express = require('express');
const bookingController = require('../controllers/bookingController');
const isLoggedIn = require('../middleware/auth');

const router = express.Router();

router.get('/my-bookings', isLoggedIn, bookingController.myBookings);
router.post('/campgrounds/:id/book', isLoggedIn, bookingController.createBooking);

module.exports = router;
