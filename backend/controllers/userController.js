const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, vehicleType, licenseNumber } = req.body;

        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                status: 'FAILED',
                message: 'User not found'
            });
        }

        // Update profile fields
        user.profile.name = name || user.profile.name;
        user.profile.phone = phone || user.profile.phone;
        
        // Update rider-specific fields if applicable
        if (user.role === 'rider') {
            user.profile.vehicleType = vehicleType || user.profile.vehicleType;
            user.profile.licenseNumber = licenseNumber || user.profile.licenseNumber;
        }

        await user.save();

        console.log(`✅ Profile updated for user ${userId}`);

        res.status(200).json({
            status: 'SUCCESS',
            message: 'Profile updated successfully',
            data: {
                id: user._id,
                email: user.email,
                role: user.role,
                profile: user.profile,
                isVerified: user.isVerified,
                isApproved: user.isApproved
            }
        });
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({
            status: 'FAILED',
            message: 'Failed to update profile'
        });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                status: 'FAILED',
                message: 'Current password and new password are required'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                status: 'FAILED',
                message: 'New password must be at least 6 characters'
            });
        }

        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                status: 'FAILED',
                message: 'User not found'
            });
        }

        // Verify current password
        const isPasswordValid = await user.comparePassword(currentPassword);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                status: 'FAILED',
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        await user.save();

        console.log(`✅ Password changed for user ${userId}`);

        res.status(200).json({
            status: 'SUCCESS',
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change Password Error:', error);
        res.status(500).json({
            status: 'FAILED',
            message: 'Failed to change password'
        });
    }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({
                status: 'FAILED',
                message: 'User not found'
            });
        }

        res.status(200).json({
            status: 'SUCCESS',
            data: {
                id: user._id,
                email: user.email,
                role: user.role,
                profile: user.profile,
                isVerified: user.isVerified,
                isApproved: user.isApproved,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Get User Profile Error:', error);
        res.status(500).json({
            status: 'FAILED',
            message: 'Failed to fetch user profile'
        });
    }
};

module.exports = exports;
