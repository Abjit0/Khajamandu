const rateLimit = require('express-rate-limit');

// General API rate limiter
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Increased for demo - 500 requests per 15 minutes
    message: {
        status: 'FAILED',
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict limiter for OTP endpoints
const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Increased for demo - 20 OTP requests per 15 minutes
    message: {
        status: 'FAILED',
        message: 'Too many OTP requests. Please wait 15 minutes before trying again.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Login rate limiter
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Increased for demo - 50 login attempts per 15 minutes
    message: {
        status: 'FAILED',
        message: 'Too many login attempts. Please wait 15 minutes before trying again.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    generalLimiter,
    otpLimiter,
    loginLimiter
};