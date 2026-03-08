const validator = require('validator');

// Email validation
const validateEmail = (email) => {
    if (!email) return 'Email is required';
    if (!validator.isEmail(email)) return 'Please provide a valid email';
    return null;
};

// Password validation
const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return null;
};

// OTP validation
const validateOTP = (otp) => {
    if (!otp) return 'OTP is required';
    if (!/^\d{4}$/.test(otp)) return 'OTP must be a 4-digit number';
    return null;
};

// Order validation
const validateOrder = (orderData) => {
    const errors = [];
    
    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
        errors.push('Order must contain at least one item');
    } else {
        // Validate each item
        orderData.items.forEach((item, index) => {
            if (!item.name || typeof item.name !== 'string') {
                errors.push(`Item ${index + 1}: Name is required`);
            }
            if (!item.price || typeof item.price !== 'number' || item.price <= 0) {
                errors.push(`Item ${index + 1}: Valid price is required`);
            }
            if (!item.qty || typeof item.qty !== 'number' || item.qty <= 0) {
                errors.push(`Item ${index + 1}: Valid quantity is required`);
            }
            // ID is not strictly required - we can generate it
        });
    }
    
    if (!orderData.totalAmount || typeof orderData.totalAmount !== 'number' || orderData.totalAmount <= 0) {
        errors.push('Total amount must be greater than 0');
    }
    
    if (!orderData.deliveryAddress || typeof orderData.deliveryAddress !== 'string' || orderData.deliveryAddress.trim().length < 5) {
        errors.push('Please provide a valid delivery address (minimum 5 characters)');
    }
    
    if (!orderData.restaurantId || typeof orderData.restaurantId !== 'string') {
        errors.push('Restaurant ID is required');
    }
    
    if (!orderData.paymentMethod || !['COD', 'Khalti', 'eSewa'].includes(orderData.paymentMethod)) {
        errors.push('Please select a valid payment method (COD, Khalti, or eSewa)');
    }
    
    if (errors.length > 0) {
        console.log("🔍 Order validation failed:", errors);
    }
    
    return errors;
};

// Middleware functions
const validateLoginInput = (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];
    
    const emailError = validateEmail(email);
    if (emailError) errors.push(emailError);
    
    const passwordError = validatePassword(password);
    if (passwordError) errors.push(passwordError);
    
    if (errors.length > 0) {
        return res.status(400).json({
            status: 'FAILED',
            message: 'Validation failed',
            errors
        });
    }
    
    // Sanitize input
    req.body.email = email.trim().toLowerCase();
    next();
};

const validateOTPInput = (req, res, next) => {
    const { email, otp } = req.body;
    const errors = [];
    
    const emailError = validateEmail(email);
    if (emailError) errors.push(emailError);
    
    const otpError = validateOTP(otp);
    if (otpError) errors.push(otpError);
    
    if (errors.length > 0) {
        return res.status(400).json({
            status: 'FAILED',
            message: 'Validation failed',
            errors
        });
    }
    
    // Sanitize input
    req.body.email = email.trim().toLowerCase();
    next();
};

const validateOrderInput = (req, res, next) => {
    const errors = validateOrder(req.body);
    
    if (errors.length > 0) {
        return res.status(400).json({
            status: 'FAILED',
            message: 'Order validation failed',
            errors
        });
    }
    
    next();
};

module.exports = {
    validateLoginInput,
    validateOTPInput,
    validateOrderInput,
    validateEmail,
    validatePassword,
    validateOTP
};