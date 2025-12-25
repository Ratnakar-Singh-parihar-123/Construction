// routes/admin/serviceProviders.js
const express = require('express');
const router = express.Router();
const serviceProviderController = require('../../controllers/adminServiceProviderController');
const { adminAuth } = require('../../middleware/auth');

// Create Service Provider
router.post('/', adminAuth, serviceProviderController.createServiceProvider);

// Get All Service Providers
router.get('/', adminAuth, serviceProviderController.getAllServiceProviders);

// Update Service Provider
router.put('/:id', adminAuth, serviceProviderController.updateServiceProvider);

// Delete Service Provider
router.delete('/:id', adminAuth, serviceProviderController.deleteServiceProvider);

// Resend Verification Email
router.post('/:id/resend-verification', adminAuth, serviceProviderController.resendVerificationEmail);

module.exports = router;