const authService = require('../services/authService');

const authController = {
    showRegister(req, res) {
        res.render('users/register');
    },

    async register(req, res) {
        try {
            await authService.register(req.body.email, req.body.password, req.body.role);
            res.send('Registration successful! Check your email.');
        } catch (error) {
            console.error(error);
            res.send(error.message);
        }
    },

    showLogin(req, res) {
        res.render('users/login');
    },

    async login(req, res) {
        try {
            req.session.user = await authService.login(req.body.email, req.body.password);
            res.redirect('/campgrounds');
        } catch (error) {
            console.error(error);
            res.send(error.message);
        }
    },

    async logout(req, res) {
        try {
            await authService.logout();
            req.session.destroy(() => res.redirect('/'));
        } catch (error) {
            console.error(error);
            res.send(error.message);
        }
    }
};

module.exports = authController;