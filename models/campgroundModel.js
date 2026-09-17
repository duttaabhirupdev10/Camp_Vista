const supabase = require('../utils/supabase');

const campgroundModel = {
    findAll() {
        return supabase.from('campgrounds').select('*');
    },

    findById(id) {
        return supabase.from('campgrounds').select('*').eq('id', id).single();
    },

    findOwnerById(id) {
        return supabase.from('campgrounds').select('owner').eq('id', id).single();
    },

    create(attributes) {
        return supabase.from('campgrounds').insert(attributes).select().single();
    },

    updateById(id, attributes) {
        return supabase.from('campgrounds').update(attributes).eq('id', id).select().single();
    },

    deleteById(id) {
        return supabase.from('campgrounds').delete().eq('id', id);
    }
};

module.exports = campgroundModel;