const express = require('express');
const router = express.Router();

// Import controllers
const { signup, sendOTP, verifyOTP, resetPassword, loginUser } = require('../controllers/otpController');

// Define Routes - Temporarily simplified for testing
router.post('/signup', signup);
router.post('/send', sendOTP);
router.post('/verify', verifyOTP);
router.post('/reset-password', resetPassword);
router.post('/login', loginUser);

module.exports = router;