const supabase = require('../utils/supabase');

const bookingModel = {
    create(booking) {
        return supabase.from('bookings').insert(booking).select().single();
    },

    findByUserId(userId) {
        return supabase
            .from('bookings')
            .select(`
                *,
                campgrounds (
                    title,
                    image,
                    location,
                    price
                )
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
    },

    findByCampgroundId(campgroundId) {
        return supabase.from('bookings').select('*').eq('campground_id', campgroundId);
    }
};

module.exports = bookingModel;
