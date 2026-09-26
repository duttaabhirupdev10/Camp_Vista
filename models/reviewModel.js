const supabase = require('../utils/supabase');

const reviewModel = {
    create(review) {
        return supabase.from('reviews').insert(review).select().single();
    },

    deleteById(id) {
        return supabase.from('reviews').delete().eq('id', id);
    },

    findByCampgroundId(campgroundId) {
        // We fetch the reviews and also the user's email to display as the author
        return supabase
            .from('reviews')
            .select(`
                *,
                users (
                    email
                )
            `)
            .eq('campground_id', campgroundId)
            .order('created_at', { ascending: false });
    },

    findById(id) {
        return supabase.from('reviews').select('*').eq('id', id).single();
    }
};

module.exports = reviewModel;
