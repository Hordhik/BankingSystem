const nodemailer = require('nodemailer');
require('dotenv').config(); // Makes sure .env variables are loaded

// This 'transporter' is the object that can send mail
// It's configured to use Gmail with your .env credentials
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false // Accept self-signed certificates
    }
});

// Verify the transporter configuration
transporter.verify(function(error, success) {
    if (error) {
        console.error('Email configuration error:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

/**
 * Sends the 6-digit OTP to the user's email
 * @param {string} toEmail - The user's email address
 * @param {string} otp - The 6-digit code
 */
async function sendLoginOtp(toEmail, otp) {
const mailOptions = {
    from: `"Your Bank App" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Your Bank Login OTP',
    // This is the HTML body of the email
    html: `
    <div style="font-family: sans-serif; text-align: center; padding: 20px;">
        <h2>Your Login Code</h2>
        <p>Use this code to log in to your account. This code will expire in 10 minutes.</p>
        <h1 style="font-size: 48px; letter-spacing: 10px; margin: 30px 0; padding: 15px; background: #f4f4f4; border-radius: 8px;">
        ${otp}
        </h1>
    </div>
    `,
};

try {
    // Try to send the email
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${toEmail}`);
} catch (error) {
    console.error(`Error sending email: ${error.message}`);
    // If it fails, throw an error so the server can catch it
    throw new Error('Could not send OTP email.');
}
}

// Make the function available to other files
module.exports = { sendLoginOtp };