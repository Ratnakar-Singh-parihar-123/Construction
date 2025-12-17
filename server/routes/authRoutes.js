const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Public routes
router.post('/register/customer', authController.registerCustomer);
router.post('/register/service-provider', authController.registerServiceProvider);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.get('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerification);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protected routes
router.get('/me', auth, authController.getCurrentUser);
router.post('/logout', auth, authController.logout);

module.exports = router;