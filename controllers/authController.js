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
    },

    showForgotPassword(req, res) {
        res.render('users/forgotPassword');
    },

    async processForgotPassword(req, res) {
        try {
            await authService.resetPasswordForEmail(req.body.email);
            res.send('If an account with that email exists, we have sent a password reset link.');
        } catch (error) {
            console.error(error);
            res.send(error.message);
        }
    },

    showResetPassword(req, res) {
        res.render('users/resetPassword');
    },

    async processResetPassword(req, res) {
        try {
            const { token, refreshToken, password } = req.body;
            if (!token) {
                return res.send('No token provided. Make sure you use the link sent to your email.');
            }
            await authService.updateUserPassword(token, refreshToken, password);
            res.send('Password updated successfully! <a href="/login">Click here to login</a>');
        } catch (error) {
            console.error(error);
            res.send(error.message);
        }
    }
};

module.exports = authController;