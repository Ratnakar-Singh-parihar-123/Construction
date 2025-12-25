const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('📡 Connected to MongoDB');
        
        // Check if admin already exists
        const adminCount = await User.countDocuments({ userType: 'admin' });
        
        if (adminCount > 0) {
            console.log('ℹ️ Admin already exists in database');
            process.exit(0);
        }

        // Create admin account
        const adminData = {
            name: 'Shop Owner',
            email: 'admin@construction.com',
            password: 'Admin@123',
            userType: 'admin',
            adminRole: 'owner',
            permissions: ['all'],
            shopName: 'Construction Material Shop',
            shopAddress: '123 Main Street, City',
            shopPhone: '+91 9876543210',
            profileImage: '',
            isActive: true,
            isVerified: true
        };

        const admin = new User(adminData);
        await admin.save();

        console.log('========================================');
        console.log('✅ Admin account created successfully!');
        console.log('========================================');
        console.log('👤 Name:', adminData.name);
        console.log('📧 Email:', adminData.email);
        console.log('🔑 Password:', 'Admin@123');
        console.log('🏪 Shop:', adminData.shopName);
        console.log('📍 Address:', adminData.shopAddress);
        console.log('📞 Phone:', adminData.shopPhone);
        console.log('========================================');
        console.log('\n⚠️ IMPORTANT: Change this password after first login!');
        console.log('========================================');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
};

seedAdmin();