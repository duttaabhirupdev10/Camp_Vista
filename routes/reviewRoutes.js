const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewController = require('../controllers/reviewController');
const isLoggedIn = require('../middleware/auth');

router.post('/', isLoggedIn, reviewController.createReview);
router.delete('/:reviewId', isLoggedIn, reviewController.deleteReview);

module.exports = router;
