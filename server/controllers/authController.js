const User = require('../models/User');
const Customer = require('../models/Customer');
const ServiceProvider = require('../models/ServiceProvider');
const { generateAccessToken, generateRefreshToken, generateVerificationToken, generateResetToken } = require('../utils/generateTokens');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/sendEmail');
const validator = require('validator');

// Register Customer
const registerCustomer = async (req, res) => {
  try {
    const { name, phone, address, password } = req.body;

    // Validation
    if (!name || !phone || !address || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if phone already exists
    const existingCustomer = await Customer.findOne({ phone });
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: 'Phone number already registered'
      });
    }

    // Create new customer
    const customer = new Customer({
      userType: 'customer',
      name,
      phone,
      address,
      password
    });

    await customer.save();

    // Generate tokens
    const accessToken = generateAccessToken(customer);
    const refreshToken = generateRefreshToken(customer);

    // Save refresh token
    customer.refreshToken = refreshToken;
    await customer.save();

    // Update last login
    await customer.updateLastLogin();

    // Remove sensitive data
    const userResponse = customer.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    res.status(201).json({
      success: true,
      message: 'Customer registration successful',
      data: {
        token: accessToken,
        refreshToken,
        user: userResponse
      }
    });

  } catch (error) {
    console.error('Customer registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

// Register Service Provider
// const validator = require('validator');
// const ServiceProvider = require('../models/ServiceProvider'); // apka model
// const { generateVerificationToken, generateAccessToken } = require('../utils/jwt');
// const { sendVerificationEmail } = require('../utils/emailService');

const registerServiceProvider = async (req, res) => {
  try {
    const { name, email, address, password, companyName, serviceType } = req.body;

    // 1️⃣ Required fields validation
    if (!name || !email || !address || !password || !companyName) {
      return res.status(400).json({
        success: false,
        message: 'All required fields are mandatory: name, email, address, password, companyName',
      });
    }

    // 2️⃣ Email format validation
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    // 3️⃣ Check if email already exists
    const existingProvider = await ServiceProvider.findOne({ email });
    if (existingProvider) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // 4️⃣ Generate verification token
    const verificationToken = generateVerificationToken();

    // 5️⃣ Create new service provider
    const serviceProvider = new ServiceProvider({
      userType: 'service_provider',
      name: name.trim(),
      email: email.toLowerCase().trim(),
      address: address.trim(),
      password, // assume pre-save hook hashes password
      companyName: companyName.trim(),
      serviceType: serviceType || 'other',
      verificationToken,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    await serviceProvider.save();

    // 6️⃣ Generate access token
    const accessToken = generateAccessToken(serviceProvider);

    // 7️⃣ Send verification email safely
    try {
      await sendVerificationEmail(email, verificationToken, name);
    } catch (emailError) {
      console.warn('Failed to send verification email:', emailError.message);
      // Don't fail registration due to email
    }

    // 8️⃣ Remove sensitive data before sending response
    const userResponse = serviceProvider.toObject();
    delete userResponse.password;
    delete userResponse.verificationToken;
    delete userResponse.verificationTokenExpires;

    res.status(201).json({
      success: true,
      message: 'Service provider registered successfully. Please check your email for verification.',
      data: {
        token: accessToken,
        user: userResponse,
      },
    });

  } catch (error) {
    console.error('Service provider registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { identifier, password, userType } = req.body;

    if (!identifier || !password || !userType) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    let user;

    // Find user based on type and identifier
    if (userType === 'customer') {
      // Customer login with phone
      user = await Customer.findOne({ phone: identifier }).select('+password');
    } else if (userType === 'service_provider') {
      // Service provider login with email
      user = await ServiceProvider.findOne({ email: identifier }).select('+password');
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid user type'
      });
    }

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // For service providers, check verification
    if (user.userType === 'service_provider' && !user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Account not verified. Please verify your email first.'
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // Update last login
    await user.updateLastLogin();

    // Remove sensitive data
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;
    delete userResponse.verificationToken;
    delete userResponse.verificationTokenExpires;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token: accessToken,
        refreshToken,
        user: userResponse
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// Refresh Token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user with refresh token
    const user = await User.findOne({
      _id: decoded.id,
      refreshToken: refreshToken
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newAccessToken
      }
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
        message: 'Refresh token expired'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to refresh token'
    });
  }
};

// Verify Email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }

    // Find service provider with token
    const serviceProvider = await ServiceProvider.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!serviceProvider) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    // Mark as verified
    serviceProvider.isVerified = true;
    serviceProvider.verificationToken = undefined;
    serviceProvider.verificationTokenExpires = undefined;
    await serviceProvider.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Email verification failed'
    });
  }
};

// Resend Verification Email
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find service provider
    const serviceProvider = await ServiceProvider.findOne({ email });

    if (!serviceProvider) {
      return res.status(404).json({
        success: false,
        message: 'Service provider not found'
      });
    }

    if (serviceProvider.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken();
    serviceProvider.verificationToken = verificationToken;
    serviceProvider.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
    await serviceProvider.save();

    // Send verification email
    await sendVerificationEmail(email, verificationToken, serviceProvider.name);

    res.status(200).json({
      success: true,
      message: 'Verification email sent successfully'
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend verification email'
    });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal that user doesn't exist
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link'
      });
    }

    // Generate reset token
    const resetToken = generateResetToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset email
    await sendPasswordResetEmail(email, resetToken, user.name);

    res.status(200).json({
      success: true,
      message: 'Password reset instructions sent to your email'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request'
    });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    });
  }
};

// Get Current User
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -refreshToken -verificationToken -resetPasswordToken');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user data'
    });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user) {
      user.refreshToken = undefined;
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
};

module.exports = {
  registerCustomer,
  registerServiceProvider,
  login,
  refreshToken,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  logout
};