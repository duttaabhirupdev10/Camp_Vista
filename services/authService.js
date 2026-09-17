const supabase = require('../utils/supabase');
const userModel = require('../models/userModel');

const authService = {
    async register(email, password, role) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        const userRole = role && ['customer', 'owner'].includes(role) ? role : 'customer';
        const { error: dbError } = await userModel.create({
            id: data.user.id,
            email: data.user.email,
            role: userRole
        });

        if (dbError) console.error('Error saving user to Supabase DB:', dbError);
        return data;
    },

    async login(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        const { data: dbUser } = await userModel.findRoleById(data.user.id);
        return { ...data.user, role: dbUser ? dbUser.role : 'customer' };
    },

    async logout() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }
};

module.exports = authService;