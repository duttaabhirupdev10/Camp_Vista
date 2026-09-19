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

module.exports = router;