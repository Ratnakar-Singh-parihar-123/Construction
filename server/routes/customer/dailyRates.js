// routes/customer/dailyRates.js
const express = require('express');
const router = express.Router();
const DailyRate = require('../../models/DailyRate');

// Get all daily rates (public - no auth required)
router.get('/', async (req, res) => {
    try {
        const rates = await DailyRate.find({ isActive: true })
            .select('materialName category unit currentPrice previousPrice changePercent qualityGrade source lastUpdated')
            .sort({ category: 1, materialName: 1 });
        
        res.json({ 
            success: true, 
            data: rates,
            count: rates.length,
            lastUpdated: rates.length > 0 ? rates[0].lastUpdated : null
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// Get rates by category
router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const rates = await DailyRate.find({ 
            category: { $regex: new RegExp(category, 'i') },
            isActive: true 
        }).sort({ materialName: 1 });

        res.json({ 
            success: true, 
            data: rates 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// Search materials
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const rates = await DailyRate.find({
            $text: { $search: q },
            isActive: true
        }).limit(20);

        res.json({ 
            success: true, 
            data: rates 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

module.exports = router;