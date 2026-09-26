const supabase = require('../utils/supabase');
const reviewModel = require('../models/reviewModel');

const reviewController = {
    async createReview(req, res) {
        try {
            const campgroundId = req.params.id;
            const { rating, body } = req.body.review;
            const authorId = req.session.user.id;

            const review = {
                rating: parseInt(rating, 10),
                body,
                campground_id: campgroundId,
                author_id: authorId
            };

            // Check if this user has already reviewed this campground
            const { data: existingReviews, error: findError } = await supabase
                .from('reviews')
                .select('id')
                .eq('campground_id', campgroundId)
                .eq('author_id', authorId);

            if (existingReviews && existingReviews.length > 0) {
                return res.status(400).send('You have already reviewed this campground.');
            }

            const { error } = await reviewModel.create(review);
            if (error) throw error;

            res.redirect(`/campgrounds/${campgroundId}`);
        } catch (error) {
            console.error('Error creating review:', error);
            res.send('Error creating review');
        }
    },

    async deleteReview(req, res) {
        try {
            const { id, reviewId } = req.params;
            const { data: review, error: findError } = await reviewModel.findById(reviewId);
            
            if (findError || !review) {
                return res.status(404).send('Review not found');
            }

            // Check if user owns the review or is an admin
            if (review.author_id !== req.session.user.id && req.session.user.role !== 'admin') {
                return res.status(403).send('Unauthorized: You can only delete your own reviews.');
            }

            const { error } = await reviewModel.deleteById(reviewId);
            if (error) throw error;

            res.redirect(`/campgrounds/${id}`);
        } catch (error) {
            console.error('Error deleting review:', error);
            res.send('Error deleting review');
        }
    }
};

module.exports = reviewController;
