const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const createFirstAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        // Check if admin already exists
        const adminCount = await User.countDocuments({ userType: 'admin' });
        
        if (adminCount > 0) {
            console.log('ℹ️ Admin already exists');
            process.exit(0);
        }

        const adminData = {
            name: 'Super Admin',
            email: 'admin@construction.com',
            phone: '9999999999',
            password: 'Admin@123',
            address: 'Construction Shop Office',
            userType: 'admin'
        };

        const admin = new User(adminData);
        await admin.save();

        console.log('========================================');
        console.log('✅ First admin created successfully!');
        console.log('📧 Email:', adminData.email);
        console.log('📱 Phone:', adminData.phone);
        console.log('🔑 Password:', 'Admin@123');
        console.log('========================================');
        console.log('\n⚠️  IMPORTANT: Please change this password after first login.');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
};

createFirstAdmin();