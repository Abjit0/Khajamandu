const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Import Routes & Controllers
const otpRoutes = require('./routes/otpRoutes');
const orderController = require('./controllers/orderController');
const menuController = require('./controllers/menuController');
const notificationController = require('./controllers/notificationController');
const adminController = require('./controllers/adminController');
const riderController = require('./controllers/riderController');
const userController = require('./controllers/userController');

// Import Middleware
const { authenticateToken, requireAdmin, requireRestaurant, requireRider, requireCustomer } = require('./middleware/auth');
const { validateOrderInput } = require('./middleware/validation');
const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware - Relaxed for development
// app.use(helmet()); // Temporarily disabled
// app.use(generalLimiter); // Temporarily disabled
app.use(cors({
    origin: true, // Allow all origins for development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// --- ROUTES ---

// 1. OTP Routes (http://IP:5000/api/otp/...)
app.use('/api/otp', otpRoutes);

// 2. Order Routes - Enhanced with status management
app.post('/api/orders/create', validateOrderInput, orderController.createOrder);
app.get('/api/orders/all', orderController.getAllOrders); // Removed auth for testing
app.post('/api/orders/update-status', orderController.updateOrderStatus); // Removed auth for testing
app.get('/api/orders/user/:userId', authenticateToken, orderController.getUserOrders);
app.get('/api/orders/:orderId', orderController.getOrderById);
app.post('/api/orders/payment-status', orderController.updatePaymentStatus);
app.get('/api/transactions/:userId', authenticateToken, orderController.getTransactionHistory);

// Test route for creating orders with logged-in user
app.post('/api/orders/create-test', authenticateToken, orderController.createTestOrder);

// Pre-order routes
app.get('/api/orders/preorders/list', orderController.getPreOrders);

// 4. Notification Routes
app.get('/api/notifications/:userId', authenticateToken, notificationController.getUserNotifications);
app.patch('/api/notifications/:notificationId/read', authenticateToken, notificationController.markAsRead);
app.patch('/api/notifications/:userId/read-all', authenticateToken, notificationController.markAllAsRead);

// 3. Menu Routes - Role-based access
app.get('/api/menu/restaurant/:restaurantId', menuController.getRestaurantMenu);
app.get('/api/menu/all', menuController.getAllMenuItems);
app.post('/api/menu/add', authenticateToken, requireRestaurant, menuController.addMenuItem);
app.put('/api/menu/update/:itemId', authenticateToken, requireRestaurant, menuController.updateMenuItem);
app.delete('/api/menu/delete/:itemId', authenticateToken, requireRestaurant, menuController.deleteMenuItem);
app.patch('/api/menu/toggle/:itemId', authenticateToken, requireRestaurant, menuController.toggleAvailability);
app.get('/api/menu/my-items', authenticateToken, requireRestaurant, menuController.getMyMenuItems);

// 5. Admin Routes - Admin only
app.get('/api/admin/stats', authenticateToken, requireAdmin, adminController.getDashboardStats);
app.get('/api/admin/users', authenticateToken, requireAdmin, adminController.getAllUsers);
app.get('/api/admin/pending', authenticateToken, requireAdmin, adminController.getPendingUsers);
app.post('/api/admin/approve/:userId', authenticateToken, requireAdmin, adminController.approveUser);
app.delete('/api/admin/reject/:userId', authenticateToken, requireAdmin, adminController.rejectUser);
app.get('/api/admin/orders', authenticateToken, requireAdmin, adminController.getRecentOrders);

// 6. Rider Routes - Rider functionality
app.post('/api/rider/initialize', riderController.initializeRiderProfile);
app.post('/api/rider/toggle-status', riderController.toggleOnlineStatus);
app.post('/api/rider/update-location', riderController.updateLocation);
app.get('/api/rider/available-deliveries/:riderId', riderController.getAvailableDeliveries);
app.post('/api/rider/accept-delivery', riderController.acceptDelivery);
app.post('/api/rider/update-delivery-status', riderController.updateDeliveryStatus);
app.get('/api/rider/active-delivery/:riderId', riderController.getActiveDelivery);
app.get('/api/rider/stats/:riderId', riderController.getRiderStats);
app.get('/api/rider/profile/:riderId', riderController.getRiderProfile);
app.post('/api/rider/update-profile', riderController.updateRiderProfile);

// 7. User Profile Routes - Profile management
app.get('/api/user/profile/:userId', authenticateToken, userController.getUserProfile);
app.post('/api/user/update-profile', authenticateToken, userController.updateProfile);
app.post('/api/user/change-password', authenticateToken, userController.changePassword);

// 3. Test Route (To check if server is alive)
app.get('/', (req, res) => {
    res.json({
        message: "Khajamandu Server is Running...",
        version: "2.0.0",
        timestamp: new Date().toISOString()
    });
});

// Simple test endpoint for mobile debugging
app.get('/api/test', (req, res) => {
    console.log('📱 Mobile test endpoint hit from IP:', req.ip);
    res.json({
        status: 'SUCCESS',
        message: 'Mobile connection test successful!',
        timestamp: new Date().toISOString(),
        ip: req.ip,
        headers: req.headers
    });
});

// Also keep the original test endpoint for direct access
app.get('/test', (req, res) => {
    console.log('📱 Direct test endpoint hit from IP:', req.ip);
    res.json({
        status: 'SUCCESS',
        message: 'Direct connection test successful!',
        timestamp: new Date().toISOString(),
        ip: req.ip,
        headers: req.headers
    });
});

// Simple test endpoint for order debugging
app.post('/api/test-order', (req, res) => {
    console.log('🧪 Test order endpoint hit');
    console.log('📦 Test order data:', JSON.stringify(req.body, null, 2));
    res.json({
        status: 'SUCCESS',
        message: 'Test order endpoint working!',
        receivedData: req.body
    });
});

// Simple login test endpoint
app.post('/api/test-login', (req, res) => {
    console.log('📥 Test login request received:', req.body);
    res.json({
        status: 'SUCCESS',
        message: 'Test login endpoint working!',
        data: { test: true }
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Global Error:', err);
    res.status(500).json({
        status: 'FAILED',
        message: 'Internal server error'
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        status: 'FAILED',
        message: 'Route not found'
    });
});

// --- START SERVER ---
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    console.log(`🌐 Also accessible at http://192.168.101.5:${PORT}`);
    console.log(`🔒 Security middleware enabled`);
    console.log(`📊 Rate limiting active`);
});