const express = require('express');
const router = express.Router();
const User = require('../models/User');

const { signup, sendOTP, verifyOTP, resetPassword, loginUser } = require('../controllers/otpController');

// --- AUTH ROUTES ---
router.post('/signup', signup);           // Create a new account
router.post('/send', sendOTP);            // Send OTP to email
router.post('/verify', verifyOTP);        // Verify the OTP
router.post('/reset-password', resetPassword); // Reset password using OTP
router.post('/login', loginUser);         // Login and get a token

// --- PUBLIC: Get all approved restaurants ---
// Used by the customer home screen to show the restaurant list
router.get('/restaurants', async (req, res) => {
    try {
        // Find all users who are restaurants, approved, and verified
        // We exclude the password field for security
        const restaurants = await User.find(
            { role: 'restaurant', isApproved: true, isVerified: true },
            { password: 0 }
        );

        res.json({ status: 'SUCCESS', data: restaurants });

    } catch (error) {
        console.log('Error fetching restaurants:', error.message);
        res.status(500).json({ status: 'FAILED', message: 'Could not fetch restaurants' });
    }
});

module.exports = router;
