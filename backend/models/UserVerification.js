const mongoose = require('mongoose');

const UserVerificationSchema = new mongoose.Schema({
    userId: String, // The ID of the user trying to log in/register
    email: String,  // The email the OTP was sent to
    otp: String,    // The actual OTP code
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // This document will automatically delete after 300 seconds (5 minutes)
    }
});

module.exports = mongoose.model("UserVerification", UserVerificationSchema);