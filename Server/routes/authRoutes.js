const express = require('express');
const User = require('../models/User'); // Import your User model
const jwt = require('jsonwebtoken');
const { sendLoginOtp } = require('../services/emailService'); // Import your email service

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET; // Get secret key from .env

// --- Endpoint 1: Register a new user ---
router.post('/register', async (req, res) => {
try {
    const { email, password, fullName } = req.body;

    // Check if user already exists
const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
        return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // Create new user (password will be hashed by the 'pre.save' hook)
    const newUser = new User({ email, password, fullName });
    await newUser.save();

    // Send back the new user (but not the password)
res.status(201).json({
    _id: newUser._id,
    email: newUser.email,
    fullName: newUser.fullName,
});
} catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
}
});

// --- Endpoint 2: Request a login OTP ---
router.post('/login-request', async (req, res) => {
try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Security: Don't reveal if the user exists.
    return res.status(200).json({ message: 'If an account exists, an OTP has been sent.' });
    }

    // Generate a 6-digit random code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Set expiration time (10 minutes from now)
    const otpExpires = Date.now() + 10 * 60 * 1000;

    // Save the OTP and its expiration to the user in the database
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send the email
    await sendLoginOtp(user.email, otp);

    res.status(200).json({ message: 'If an account exists, an OTP has been sent.' });

} catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error sending OTP' });
}
});

// --- Endpoint 3: Verify the OTP and log in ---
router.post('/login-verify', async (req, res) => {
try {
    const { email, otp } = req.body;

    // Find the user with *both* the matching email and OTP
    const user = await User.findOne({
    email: email.toLowerCase(),
    otp: otp
    });

    // Check 1: Is there a user with this email AND this OTP?
    if (!user) {
    return res.status(401).json({ message: 'Invalid OTP or email' });
    }

    // Check 2: Has the OTP expired?
    if (user.otpExpires < Date.now()) {
    return res.status(401).json({ message: 'OTP has expired' });
    }

    // --- Success! ---
    // Clear the OTP from the database so it can't be reused
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Create a JWT Token (the login token)
    const token = jwt.sign(
      { id: user._id, email: user.email }, // Payload
      JWT_SECRET,                          // Your secret key
      { expiresIn: '1d' }                  // Token lasts for 1 day
    );

    // Send the token back to the frontend
    res.status(200).json({ token });

} catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
}
});

// Make all these routes available to server.js
module.exports = router;