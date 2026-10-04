const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/register', authController.showRegister);
router.post('/register', authController.register);
router.get('/login', authController.showLogin);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.get('/forgot-password', authController.showForgotPassword);
router.post('/forgot-password', authController.processForgotPassword);

router.get('/reset-password', authController.showResetPassword);
router.post('/reset-password', authController.processResetPassword);

// Allow users to upgrade their account to an owner
router.post('/upgrade-role', async (req, res) => {
    if (!req.auth || !req.auth.userId) return res.redirect('/login');
    const userModel = require('../models/userModel');
    const result = await userModel.updateRole(req.auth.userId, 'owner');
    if (result.error) {
        console.error("Failed to upgrade role:", result.error);
    } else {
        console.log("Successfully upgraded role for:", req.auth.userId);
    }
    res.redirect('/');
});

module.exports = router;