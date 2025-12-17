const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found.'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated.'
      });
    }

    // Check if service provider is verified
    if (user.userType === 'service_provider' && !user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Account not verified. Please verify your email first.'
      });
    }

    // Attach user to request
    req.user = user;
    req.userType = user.userType;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    }
    
    res.status(401).json({
      success: false,
      message: 'Authentication failed.'
    });
  }
};

// Role-based middleware
const requireCustomer = (req, res, next) => {
  if (req.userType !== 'customer') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Customer only.'
    });
  }
  next();
};

const requireServiceProvider = (req, res, next) => {
  if (req.userType !== 'service_provider') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Service provider only.'
    });
  }
  next();
};

module.exports = {
  auth,
  requireCustomer,
  requireServiceProvider
};