const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth, adminAuth, customerAuth } = require('../middleware/auth');

// Customer Registration
router.post('/register/customer', authController.registerCustomer);

// Customer Login
router.post('/login/customer', authController.loginCustomer);

// Admin Login
router.post('/login/admin', authController.loginAdmin);

// Refresh Token
router.post('/refresh-token', authController.refreshToken);

// Get Current User Profile (Protected)
router.get('/profile', auth, authController.getProfile);

// Update Profile (Protected)
router.put('/profile', auth, authController.updateProfile);

// Change Password (Protected)
router.post('/change-password', auth, authController.changePassword);

// Get Dashboard Stats (Protected)
router.get('/dashboard/stats', auth, authController.getDashboardStats);

// Logout (Protected)
router.post('/logout', auth, authController.logout);

module.exports = router;