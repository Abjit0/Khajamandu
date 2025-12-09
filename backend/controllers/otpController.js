require('dotenv').config();
const nodemailer = require("nodemailer");
const bcrypt = require('bcryptjs');
const UserVerification = require("../models/UserVerification");
const User = require("../models/User"); 
const { generateToken } = require('../middleware/auth');

// Configure Nodemailer
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    },
});

// --- FUNCTION 1: USER SIGNUP ---
const signup = async (req, res) => {
    try {
        const { email, password, role = 'customer', profile = {} } = req.body;
        
        console.log("📥 Signup request received:", { email, role });

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: "FAILED",
                message: "User already exists with this email"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Set approval status based on role
        const isApproved = role === 'customer'; // Auto-approve customers only

        // Create new user with role and profile
        const newUser = new User({
            email,
            password: hashedPassword,
            role,
            profile,
            isApproved
        });

        const savedUser = await newUser.save();

        // Generate OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        
        // Save OTP verification record
        const otpVerification = new UserVerification({
            userId: savedUser._id,
            email: savedUser.email,
            otp: otp,
        });

        await otpVerification.save();

        // Send OTP email
        console.log('📧 Attempting to send OTP email to:', email);
        try {
            await transporter.sendMail({
                from: process.env.AUTH_EMAIL,
                to: email,
                subject: "Khajamandu - Verify Your Account",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #E6753A;">Welcome to Khajamandu!</h2>
                        <p>Thank you for joining as a <strong>${role}</strong>.</p>
                        <p>Your verification code is:</p>
                        <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; color: #E6753A;">
                            ${otp}
                        </div>
                        <p>This code will expire in 5 minutes.</p>
                        ${role !== 'customer' ? '<p><strong>Note:</strong> Your account will be reviewed and approved by our admin team.</p>' : ''}
                        <p>Best regards,<br>Khajamandu Team</p>
                    </div>
                `
            });
            console.log('✅ OTP email sent successfully to:', email);
        } catch (emailError) {
            console.error('❌ Email sending failed:', emailError.message);
            // Don't fail the signup, just log the error
            // User can request resend later
        }

        console.log(`✅ User created successfully: ${email} (${role})`);
        console.log(`🔑 OTP for ${email}: ${otp}`); // Temporary for testing
        res.status(200).json({
            status: "SUCCESS",
            message: "Verification OTP sent to your email",
            data: {
                userId: savedUser._id,
                email: savedUser.email,
                role: savedUser.role
            }
        });

    } catch (error) {
        console.error("❌ Signup Error:", error);
        res.status(500).json({
            status: "FAILED",
            message: "Account creation failed. Please try again."
        });
    }
};

// --- FUNCTION 2: SEND OTP ---
const sendOTP = async (req, res) => {
    try {
        let { email } = req.body;
        
        console.log('📧 Send OTP request for:', email);
        
        // Input already sanitized by validation middleware
        const userId = email; 
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

        // Delete any existing OTP for this user
        await UserVerification.deleteMany({ userId });

        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Your Khajamandu Verification Code",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #E6753A;">Khajamandu Verification</h2>
                    <p>Your verification code is:</p>
                    <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; color: #2D2D2D;">
                        ${otp}
                    </div>
                    <p>This code will expire in 5 minutes.</p>
                    <p>If you didn't request this code, please ignore this email.</p>
                </div>
            `,
        };

        const newVerification = new UserVerification({
            userId: userId,
            email: email,
            otp: otp,
        });
        await newVerification.save();

        console.log('📧 Attempting to send OTP email...');
        try {
            await transporter.sendMail(mailOptions);
            console.log('✅ OTP email sent successfully to:', email);
            console.log(`🔑 OTP for ${email}: ${otp}`); // Temporary for testing
        } catch (emailError) {
            console.error('❌ Email sending failed:', emailError.message);
            // Still save OTP so user can use it if they check backend logs
        }
        
        res.status(200).json({ 
            status: "SUCCESS", 
            message: "Verification code sent to your email" 
        });
    } catch (error) {
        console.error('Send OTP Error:', error);
        res.status(500).json({ 
            status: "FAILED", 
            message: "Failed to send verification code. Please try again." 
        });
    }
};

// --- FUNCTION 2: VERIFY OTP ---
const verifyOTP = async (req, res) => {
    try {
        console.log('📥 Verify OTP request received:', req.body);
        
        let { email, otp } = req.body;
        
        // Input already sanitized by validation middleware
        const userVerification = await UserVerification.findOne({ 
            userId: email, 
            otp: otp 
        });

        console.log('🔍 Looking for verification:', { userId: email, otp });
        console.log('🔍 Found verification:', userVerification);

        if (!userVerification) {
            console.log('❌ No verification record found');
            return res.status(400).json({
                status: "FAILED",
                message: "Invalid or expired verification code"
            });
        }

        // Clean up verification record
        await UserVerification.deleteOne({ _id: userVerification._id });
        console.log('✅ OTP verified successfully');

        res.status(200).json({
            status: "SUCCESS",
            message: "Email verified successfully"
        });
    } catch (error) {
        console.error('Verify OTP Error:', error);
        res.status(500).json({
            status: "FAILED",
            message: "Verification failed. Please try again."
        });
    }
};

// --- FUNCTION 3: LOGIN ---
const loginUser = async (req, res) => {
    try {
        console.log('📥 Login request received:', req.body);
        
        let { email, password } = req.body;
        
        // Clean and normalize email
        email = email.trim().toLowerCase();
        
        console.log('🔍 Looking for user with email:', email);
        
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log('❌ User not found in database for email:', email);
            
            // Let's also check what users exist in the database
            const allUsers = await User.find({}, 'email');
            console.log('📋 All users in database:', allUsers.map(u => u.email));
            
            return res.status(401).json({
                status: "FAILED",
                message: "Invalid email or password"
            });
        }

        console.log('👤 User found:', user.email);
        console.log('🔐 Stored password hash:', user.password.substring(0, 20) + '...');
        console.log('🔐 Comparing with input password:', password);

        // Compare password using bcrypt directly
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        console.log('🔐 Password comparison result:', isPasswordValid);
        
        if (!isPasswordValid) {
            console.log('❌ Invalid password for user:', email);
            return res.status(401).json({
                status: "FAILED",
                message: "Invalid email or password"
            });
        }

        console.log('✅ Login successful for:', email);

        // Generate JWT token
        const token = generateToken(user._id);

        res.status(200).json({
            status: "SUCCESS",
            message: "Login successful",
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role || 'customer',
                    profile: user.profile || {},
                    isApproved: user.isApproved !== false,
                    createdAt: user.createdAt
                },
                token
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({
            status: "FAILED",
            message: "Login failed. Please try again."
        });
    }
};

// --- FUNCTION 4: RESET PASSWORD ---
const resetPassword = async (req, res) => {
    try {
        console.log('📥 Reset password request received:', req.body);
        
        let { email, newPassword } = req.body;
        
        // Clean and normalize email
        email = email.trim().toLowerCase();
        
        if (!email || !newPassword) {
            return res.status(400).json({
                status: "FAILED",
                message: "Email and new password are required"
            });
        }

        // Hash the password manually
        console.log('🔐 Hashing password for:', email);
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        console.log('✅ Password hashed successfully');

        // Check if user exists, create if not
        let user = await User.findOne({ email });
        if (!user) {
            console.log('👤 Creating new user:', email);
            user = new User({ 
                email, 
                password: hashedPassword // Use pre-hashed password
            });
        } else {
            console.log('👤 Updating existing user:', email);
            user.password = hashedPassword; // Use pre-hashed password
        }

        // Save without triggering the pre-save middleware
        await user.save({ validateBeforeSave: true });
        console.log('✅ User saved successfully with email:', user.email);

        // Generate JWT token
        const token = generateToken(user._id);

        res.status(200).json({
            status: "SUCCESS",
            message: "Password updated successfully",
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    createdAt: user.createdAt
                },
                token
            }
        });
    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({
            status: "FAILED",
            message: "Password reset failed. Please try again."
        });
    }
};

module.exports = { signup, sendOTP, verifyOTP, resetPassword, loginUser };