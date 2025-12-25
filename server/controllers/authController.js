const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId, userType) => {
    return jwt.sign(
        { 
            userId, 
            userType 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '1d' }
    );
};

// Generate Refresh Token
const generateRefreshToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '7d' }
    );
};

// Customer Registration
exports.registerCustomer = async (req, res) => {
    try {
        const { name, phone, address, password } = req.body;

        // Check if customer already exists with this phone
        const existingCustomer = await User.findOne({ 
            phone,
            userType: 'customer' 
        });
        
        if (existingCustomer) {
            return res.status(400).json({
                success: false,
                message: 'Customer already exists with this phone number'
            });
        }

        // Create new customer
        const customer = new User({
            name,
            phone,
            address,
            password,
            userType: 'customer'
        });

        await customer.save();

        // Generate tokens
        const token = generateToken(customer._id, 'customer');
        const refreshToken = generateRefreshToken(customer._id);

        // Save refresh token
        customer.refreshToken = refreshToken;
        customer.lastLogin = new Date();
        await customer.save();

        // Prepare response data
        const customerData = {
            id: customer._id,
            name: customer.name,
            phone: customer.phone,
            address: customer.address,
            userType: customer.userType,
            profileImage: customer.profileImage,
            totalOrders: customer.totalOrders,
            totalSpent: customer.totalSpent,
            createdAt: customer.createdAt
        };

        res.status(201).json({
            success: true,
            message: 'Customer registered successfully',
            data: {
                token,
                refreshToken,
                user: customerData
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Phone number already registered'
            });
        }
        
        res.status(400).json({
            success: false,
            message: error.message || 'Registration failed'
        });
    }
};

// Customer Login
exports.loginCustomer = async (req, res) => {
    try {
        const { phone, password } = req.body;

        // Find customer by phone
        const customer = await User.findOne({ 
            phone,
            userType: 'customer',
            isActive: true 
        });

        if (!customer) {
            return res.status(401).json({
                success: false,
                message: 'Invalid phone number or password'
            });
        }

        // Check password
        const isMatch = await customer.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid phone number or password'
            });
        }

        // Generate tokens
        const token = generateToken(customer._id, 'customer');
        const refreshToken = generateRefreshToken(customer._id);

        // Update last login and save refresh token
        customer.lastLogin = new Date();
        customer.refreshToken = refreshToken;
        await customer.save();

        // Prepare response data
        const customerData = {
            id: customer._id,
            name: customer.name,
            phone: customer.phone,
            address: customer.address,
            userType: customer.userType,
            profileImage: customer.profileImage,
            totalOrders: customer.totalOrders,
            totalSpent: customer.totalSpent,
            createdAt: customer.createdAt
        };

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                refreshToken,
                user: customerData
            }
        });
    } catch (error) {
        console.error('Customer login error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Login failed'
        });
    }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find admin by email
        const admin = await User.findOne({ 
            email,
            userType: 'admin',
            isActive: true 
        });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate tokens
        const token = generateToken(admin._id, 'admin');
        const refreshToken = generateRefreshToken(admin._id);

        // Update last login and save refresh token
        admin.lastLogin = new Date();
        admin.refreshToken = refreshToken;
        await admin.save();

        // Prepare response data
        const adminData = {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            userType: admin.userType,
            adminRole: admin.adminRole,
            permissions: admin.permissions,
            shopName: admin.shopName,
            shopAddress: admin.shopAddress,
            shopPhone: admin.shopPhone,
            profileImage: admin.profileImage,
            createdAt: admin.createdAt
        };

        res.json({
            success: true,
            message: 'Admin login successful',
            data: {
                token,
                refreshToken,
                user: adminData
            }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Login failed'
        });
    }
};

// Refresh Token
exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token required'
            });
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        
        // Find user with refresh token
        const user = await User.findOne({ 
            _id: decoded.userId, 
            refreshToken,
            isActive: true 
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }

        // Generate new access token
        const token = generateToken(user._id, user.userType);

        res.json({
            success: true,
            message: 'Token refreshed',
            data: { token }
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Refresh token expired. Please login again.'
            });
        }
        
        res.status(401).json({
            success: false,
            message: 'Token refresh failed'
        });
    }
};

// Get Current User Profile
exports.getProfile = async (req, res) => {
    try {
        const user = req.user;
        
        let userData;
        
        if (user.userType === 'admin') {
            userData = {
                id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType,
                adminRole: user.adminRole,
                permissions: user.permissions,
                shopName: user.shopName,
                shopAddress: user.shopAddress,
                shopPhone: user.shopPhone,
                profileImage: user.profileImage,
                isActive: user.isActive,
                lastLogin: user.lastLogin,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };
        } else {
            userData = {
                id: user._id,
                name: user.name,
                phone: user.phone,
                address: user.address,
                userType: user.userType,
                profileImage: user.profileImage,
                totalOrders: user.totalOrders,
                totalSpent: user.totalSpent,
                isActive: user.isActive,
                lastLogin: user.lastLogin,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };
        }

        res.json({
            success: true,
            data: userData
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get profile'
        });
    }
};

// Update Profile
exports.updateProfile = async (req, res) => {
    try {
        const user = req.user;
        const updateData = req.body;
        
        // Remove fields that shouldn't be updated
        delete updateData.password;
        delete updateData.userType;
        delete updateData.isActive;
        delete updateData.refreshToken;
        
        // Update user
        Object.assign(user, updateData);
        await user.save();
        
        // Prepare response data
        let userData;
        
        if (user.userType === 'admin') {
            userData = {
                id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType,
                adminRole: user.adminRole,
                shopName: user.shopName,
                shopAddress: user.shopAddress,
                shopPhone: user.shopPhone,
                profileImage: user.profileImage
            };
        } else {
            userData = {
                id: user._id,
                name: user.name,
                phone: user.phone,
                address: user.address,
                userType: user.userType,
                profileImage: user.profileImage
            };
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: userData
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to update profile'
        });
    }
};

// Change Password
exports.changePassword = async (req, res) => {
    try {
        const user = req.user;
        const { currentPassword, newPassword } = req.body;
        
        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }
        
        // Update password
        user.password = newPassword;
        await user.save();
        
        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to change password'
        });
    }
};

// Logout
exports.logout = async (req, res) => {
    try {
        const user = req.user;
        
        // Clear refresh token
        user.refreshToken = null;
        await user.save();
        
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Logout failed'
        });
    }
};

// Get Dashboard Stats
exports.getDashboardStats = async (req, res) => {
    try {
        const user = req.user;
        
        let stats;
        
        if (user.userType === 'admin') {
            // Admin dashboard stats
            const totalCustomers = await User.countDocuments({ userType: 'customer', isActive: true });
            const todayCustomers = await User.countDocuments({ 
                userType: 'customer', 
                isActive: true,
                createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
            });
            
            stats = {
                totalCustomers,
                todayCustomers,
                shopName: user.shopName,
                adminRole: user.adminRole
            };
        } else {
            // Customer dashboard stats
            stats = {
                totalOrders: user.totalOrders || 0,
                totalSpent: user.totalSpent || 0,
                memberSince: user.createdAt,
                lastLogin: user.lastLogin
            };
        }
        
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get dashboard stats'
        });
    }
};