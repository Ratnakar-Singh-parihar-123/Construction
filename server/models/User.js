const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: {
        type: String,
        required: function () { return this.userType === 'customer'; },
        trim: true
    },
    password: { type: String, required: true, minlength: 6 },
    userType: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer',
        required: true
    },
    address: {
        type: String,
        required: function () { return this.userType === 'customer'; },
        trim: true
    },
    profileImage: { type: String, default: '' },
    adminRole: {
        type: String,
        enum: ['owner', 'manager', 'staff'],
        default: 'owner'
    },
    permissions: [String],
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: true },
    lastLogin: Date,
    refreshToken: String,
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    shopName: { type: String, default: 'Construction Material Shop' },
    shopAddress: { type: String, default: '' },
    shopPhone: { type: String, default: '' }
}, { timestamps: true });

// Indexes
userSchema.index({ phone: 1, userType: 1 }, { unique: true, sparse: true });
userSchema.index({ email: 1, userType: 1 }, { unique: true, sparse: true });

// ✅ FIXED pre-save hook
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
