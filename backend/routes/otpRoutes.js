const express = require('express');
const router = express.Router();

// Import controllers
const { signup, sendOTP, verifyOTP, resetPassword, loginUser } = require('../controllers/otpController');
const { 
  createOrder, getAllOrders, updateOrderStatus, getUserOrders, 
  getOrderById, updatePaymentStatus, getTransactionHistory, 
  createTestOrder, getPreOrders, checkUpcomingPreOrders 
} = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/auth');

// Auth Routes
router.post('/signup', signup);
router.post('/send', sendOTP);
router.post('/verify', verifyOTP);
router.post('/reset-password', resetPassword);
router.post('/login', loginUser);

// Order Routes
router.post('/orders/create', createOrder);
router.get('/orders/all', getAllOrders);
router.post('/orders/update-status', updateOrderStatus);
router.get('/orders/user', authenticateToken, getUserOrders);
router.get('/orders/:orderId', getOrderById);
router.post('/orders/payment-status', updatePaymentStatus);
router.get('/transactions/:userId', authenticateToken, getTransactionHistory);
router.post('/orders/test', authenticateToken, createTestOrder);

// Pre-order Routes
router.get('/orders/preorders/list', getPreOrders);
router.get('/orders/preorders/check-upcoming', checkUpcomingPreOrders);

module.exports = router;