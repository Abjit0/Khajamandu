const express = require('express');
const router = express.Router();

const { signup, sendOTP, verifyOTP, resetPassword, loginUser } = require('../controllers/otpController');

// Auth Routes only - all other routes are registered directly in index.js
router.post('/signup', signup);
router.post('/send', sendOTP);
router.post('/verify', verifyOTP);
router.post('/reset-password', resetPassword);
router.post('/login', loginUser);

module.exports = router;
