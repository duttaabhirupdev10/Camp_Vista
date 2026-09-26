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
    },

    findById(id) {
        return supabase.from('bookings').select('*, campgrounds(title, owner)').eq('id', id).single();
    },

    async findBookingsByOwnerId(ownerId) {
        const { data: bookings, error } = await supabase
            .from('bookings')
            .select(`
                *,
                campgrounds!inner(title, owner)
            `)
            .eq('campgrounds.owner', ownerId)
            .order('created_at', { ascending: false });

        if (error || !bookings) return { data: bookings, error };

        // Fetch emails for all users who made these bookings
        const userIds = [...new Set(bookings.map(b => b.user_id))];
        if (userIds.length > 0) {
            const { data: usersData } = await supabase
                .from('users')
                .select('id, email')
                .in('id', userIds);
            
            if (usersData) {
                // Map emails to bookings
                bookings.forEach(booking => {
                    const user = usersData.find(u => u.id === booking.user_id);
                    if (user) booking.users = { email: user.email };
                });
            }
        }
        
        return { data: bookings, error: null };
    },

    updateStatus(id, status) {
        return supabase.from('bookings').update({ status }).eq('id', id).select().single();
    }
};

module.exports = bookingModel;
