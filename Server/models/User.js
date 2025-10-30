const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
        fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures no two users can have the same email
        lowercase: true,
    },
    password: {
    type: String,
        required: true,
    },
  // --- New fields for OTP ---
    otp: {
        type: String,
    },
    otpExpires: {
        type: Date,
    },
});

// This function runs *before* a user is saved to the database
// It automatically hashes the password
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }

  // Generate a 'salt' and hash the password
const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password, salt);
next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;