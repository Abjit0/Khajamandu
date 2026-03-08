const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                status: 'FAILED',
                message: 'Access token required'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({
                status: 'FAILED',
                message: 'Invalid token - user not found'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                status: 'FAILED',
                message: 'Invalid token'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: 'FAILED',
                message: 'Token expired'
            });
        }
        
        res.status(500).json({
            status: 'FAILED',
            message: 'Authentication error'
        });
    }
};

// Middleware for role-based access control
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                status: 'FAILED',
                message: 'Authentication required'
            });
        }

        const userRole = req.user.role || 'customer';
        const allowedRoles = Array.isArray(roles) ? roles : [roles];

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                status: 'FAILED',
                message: `Access denied. Required role: ${allowedRoles.join(' or ')}`
            });
        }

        // Check if user is approved (for restaurants and riders)
        if (!req.user.isApproved && userRole !== 'customer') {
            return res.status(403).json({
                status: 'FAILED',
                message: 'Account pending approval. Please contact admin.'
            });
        }

        next();
    };
};

// Specific role middlewares
const requireAdmin = requireRole('admin');
const requireRestaurant = requireRole(['admin', 'restaurant']);
const requireRider = requireRole(['admin', 'rider']);
const requireCustomer = requireRole(['admin', 'customer']);

module.exports = {
    generateToken,
    authenticateToken,
    requireRole,
    requireAdmin,
    requireRestaurant,
    requireRider,
    requireCustomer
};