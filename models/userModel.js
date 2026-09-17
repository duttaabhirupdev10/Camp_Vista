const supabase = require('../utils/supabase');

const userModel = {
    findRoleById(id) {
        return supabase.from('users').select('role').eq('id', id).single();
    },

    create(user) {
        return supabase.from('users').insert(user);
    }
};

module.exports = userModel;