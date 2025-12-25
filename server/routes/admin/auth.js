const express = require('express');
const router = express.Router();
const adminAuthController = require('../../controllers/adminAuthController');
const { auth } = require('../../middleware/auth');

// Create First Admin (Initial Setup)
router.post('/setup', adminAuthController.createFirstAdmin);

// Admin Login
router.post('/login', adminAuthController.loginAdmin);

// Create Service Provider (by Admin)
router.post('/create-service-provider', auth, adminAuthController.createServiceProvider);

// Get All Service Providers
router.get('/service-providers', auth, adminAuthController.getAllServiceProviders);

// Update Service Provider
router.put('/service-providers/:id', auth, adminAuthController.updateServiceProvider);

// Delete Service Provider
router.delete('/service-providers/:id', auth, adminAuthController.deleteServiceProvider);

module.exports = router;