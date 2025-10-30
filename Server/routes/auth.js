const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendLoginOtp } = require('../services/emailService');

// Store OTPs temporarily (in production, use Redis or similar)
const otpStore = new Map();

// Request OTP for login
router.post('/request-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.json({ success: false, message: 'Email is required' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with email (with 10-minute expiry)
    otpStore.set(email, {
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
    });

    // Send OTP via email
    await sendLoginOtp(email, otp);

    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('OTP Request error:', error);
    res.json({ success: false, message: 'Failed to send OTP' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.json({ success: false, message: 'Email and OTP are required' });
    }

    const storedData = otpStore.get(email);
    if (!storedData) {
      return res.json({ success: false, message: 'OTP expired or not requested' });
    }

    if (storedData.expiresAt < new Date()) {
      otpStore.delete(email);
      return res.json({ success: false, message: 'OTP has expired' });
    }

    if (storedData.otp !== otp) {
      return res.json({ success: false, message: 'Invalid OTP' });
    }

    // OTP is valid - get user data
    const user = await User.findOne({ email });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    // Clear used OTP
    otpStore.delete(email);

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.fullName,
        token
      }
    });
  } catch (error) {
    console.error('OTP Verification error:', error);
    res.json({ success: false, message: 'Failed to verify OTP' });
  }
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    console.log('Register request body:', req.body);
    const { email, password, name } = req.body;

    // Basic validation
    if (!email || !password || !name) {
      console.error('Registration validation failed: missing fields', { email, password: !!password, name });
      return res.json({ success: false, message: 'Missing required fields: name, email, password' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user (store fullName to match schema)
    user = new User({
      email,
      password: hashedPassword,
      fullName: name
    });

    await user.save();

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.fullName,
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    console.error(error.stack);
    // Return actual error message for debugging (remove in production)
    res.json({ success: false, message: error.message || 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.fullName,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.json({ success: false, message: 'Server error' });
  }
});

// Find user by email
router.post('/find-user', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.fullName
      }
    });
  } catch (error) {
    console.error('Find user error:', error);
    res.json({ success: false, message: 'Server error' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.json({ success: false, message: 'Server error' });
  }
});

// Request OTP endpoint
router.post('/request-otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    // Generate OTP (6 digits)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with email (expires in 5 minutes)
    otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000
    });

    // In production, send OTP via email
    console.log(`OTP for ${email}: ${otp}`); // For testing only

    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Request OTP error:', error);
    res.json({ success: false, message: 'Failed to send OTP' });
  }
});

// Verify OTP endpoint
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const storedOTP = otpStore.get(email);
    if (!storedOTP) {
      return res.json({ success: false, message: 'OTP expired or not found' });
    }

    if (Date.now() > storedOTP.expiresAt) {
      otpStore.delete(email);
      return res.json({ success: false, message: 'OTP expired' });
    }

    if (storedOTP.otp !== otp) {
      return res.json({ success: false, message: 'Invalid OTP' });
    }

    // OTP is valid, get user data
    const user = await User.findOne({ email });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    // Clear used OTP
    otpStore.delete(email);

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.fullName,
        token
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.json({ success: false, message: 'Failed to verify OTP' });
  }
});

module.exports = router;