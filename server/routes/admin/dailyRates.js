// routes/admin/dailyRates.js
const express = require('express');
const router = express.Router();
const DailyRate = require('../../models/DailyRate');
const { auth, adminAuth } = require('../../middleware/auth'); // Use existing middleware

// Get all daily rates (admin)
router.get('/', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.userType !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }

        const rates = await DailyRate.find().sort({ category: 1, materialName: 1 });
        res.json({ success: true, data: rates });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Add new daily rate
router.post('/', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.userType !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }

        const { materialName, category, unit, currentPrice, previousPrice, qualityGrade, source } = req.body;
        
        // Calculate change percent
        const changePercent = previousPrice ? 
            ((currentPrice - previousPrice) / previousPrice * 100).toFixed(2) : 0;

        const newRate = new DailyRate({
            materialName,
            category,
            unit,
            currentPrice,
            previousPrice: previousPrice || currentPrice,
            changePercent,
            qualityGrade,
            source,
            updatedBy: req.userId,
            lastUpdated: new Date()
        });

        await newRate.save();
        res.json({ success: true, data: newRate });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Update daily rate
router.put('/:id', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.userType !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }

        const { currentPrice, previousPrice, ...otherFields } = req.body;
        
        // Get old price to calculate change
        const oldRate = await DailyRate.findById(req.params.id);
        
        if (!oldRate) {
            return res.status(404).json({
                success: false,
                message: 'Rate not found'
            });
        }

        // Calculate change percent based on previous price or old current price
        const newPreviousPrice = previousPrice || oldRate.currentPrice;
        const changePercent = ((currentPrice - newPreviousPrice) / newPreviousPrice * 100).toFixed(2);

        const updatedRate = await DailyRate.findByIdAndUpdate(
            req.params.id,
            {
                ...otherFields,
                currentPrice,
                previousPrice: newPreviousPrice,
                changePercent,
                lastUpdated: new Date(),
                updatedBy: req.userId
            },
            { new: true }
        );

        res.json({ success: true, data: updatedRate });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Bulk update prices
router.post('/bulk-update', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.userType !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }

        const { percentage, operation } = req.body;
        
        if (!percentage || !operation) {
            return res.status(400).json({
                success: false,
                message: 'Percentage and operation are required'
            });
        }
        
        const rates = await DailyRate.find();
        const updatedRates = [];

        for (const rate of rates) {
            const oldPrice = rate.currentPrice;
            let newPrice;
            
            if (operation === 'increase') {
                newPrice = oldPrice * (1 + percentage / 100);
            } else if (operation === 'decrease') {
                newPrice = oldPrice * (1 - percentage / 100);
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Operation must be "increase" or "decrease"'
                });
            }

            const changePercent = ((newPrice - oldPrice) / oldPrice * 100).toFixed(2);

            const updatedRate = await DailyRate.findByIdAndUpdate(
                rate._id,
                {
                    currentPrice: Math.round(newPrice),
                    previousPrice: oldPrice,
                    changePercent,
                    lastUpdated: new Date(),
                    updatedBy: req.userId
                },
                { new: true }
            );

            updatedRates.push(updatedRate);
        }

        res.json({ success: true, data: updatedRates });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete rate
router.delete('/:id', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.userType !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }

        const rate = await DailyRate.findByIdAndDelete(req.params.id);
        
        if (!rate) {
            return res.status(404).json({
                success: false,
                message: 'Rate not found'
            });
        }

        res.json({ 
            success: true, 
            message: 'Rate deleted successfully' 
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;