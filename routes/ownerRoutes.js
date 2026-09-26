const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');
const isLoggedIn = require('../middleware/auth');
const { isRole } = require('../middleware/role');

// Only allow owners and admins
router.get('/manage-bookings', isLoggedIn, isRole('owner', 'admin'), ownerController.manageBookings);
router.post('/manage-bookings/:bookingId/status', isLoggedIn, isRole('owner', 'admin'), ownerController.updateBookingStatus);

module.exports = router;
