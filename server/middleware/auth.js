const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const token = authHeader.replace('Bearer ', '');
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user
        const user = await User.findOne({ 
            _id: decoded.userId,
            isActive: true 
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found or account inactive'
            });
        }

        // Attach user data to request
        req.token = token;
        req.user = user;
        req.userId = user._id;
        req.userType = user.userType;
        
        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Please log in again.'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired. Please log in again.'
            });
        }
        
        res.status(401).json({
            success: false,
            message: 'Authentication failed'
        });
    }
};

// Admin only middleware
const adminAuth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if user is admin
        const user = await User.findOne({ 
            _id: decoded.userId,
            userType: 'admin',
            isActive: true 
        });

        if (!user) {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }

        req.token = token;
        req.user = user;
        req.userId = user._id;
        req.userType = 'admin';
        
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Admin authentication failed'
        });
    }
};

// Customer only middleware
const customerAuth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if user is customer
        const user = await User.findOne({ 
            _id: decoded.userId,
            userType: 'customer',
            isActive: true 
        });

        if (!user) {
            return res.status(403).json({
                success: false,
                message: 'Customer access required'
            });
        }

        req.token = token;
        req.user = user;
        req.userId = user._id;
        req.userType = 'customer';
        
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Customer authentication failed'
        });
    }
};

module.exports = { auth, adminAuth, customerAuth };