const Order = require('../models/orderModel');
const { createNotification } = require('./notificationController');

// 1. Create a New Order (For Checkout)
exports.createOrder = async (req, res) => {
  try {
    console.log("📥 Order received - Full request body:", JSON.stringify(req.body, null, 2));
    console.log("📥 Order received - Items:", req.body.items?.length, "Total:", req.body.totalAmount);

    // Validate and fix items structure
    if (req.body.items && Array.isArray(req.body.items)) {
      req.body.items = req.body.items.map((item, index) => ({
        ...item,
        id: item.id || `item-${index}` // Add id if missing
      }));
    }

    // Calculate estimated delivery time (30-45 minutes from now)
    const estimatedTime = new Date();
    estimatedTime.setMinutes(estimatedTime.getMinutes() + 35);

    // Add enhanced order data
    const orderData = {
      ...req.body,
      userEmail: req.body.userEmail || req.user?.email || 'guest@khajamandu.com',
      userId: req.body.userId || req.user?.id || 'guest-user',
      customerName: req.body.customerName || req.user?.profile?.name || 'Guest',
      customerPhone: req.body.customerPhone || req.user?.profile?.phone || '',
      estimatedDeliveryTime: estimatedTime,
      orderStatus: 'PLACED',
      paymentStatus: req.body.paymentMethod === 'COD' ? 'PENDING' : 'PENDING'
    };

    console.log("📦 Creating order with data:", JSON.stringify(orderData, null, 2));

    const newOrder = new Order(orderData);
    await newOrder.save();

    console.log("✅ Order saved successfully! ID:", newOrder._id);

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Order placed successfully',
      data: {
        orderId: newOrder._id,
        orderStatus: newOrder.orderStatus,
        estimatedDeliveryTime: newOrder.estimatedDeliveryTime,
        totalAmount: newOrder.totalAmount
      }
    });

  } catch (error) {
    console.error("❌ Order Error:", error.message);
    console.error("❌ Full Error:", error);
    
    // Send more specific error message
    if (error.name === 'ValidationError') {
      console.error("❌ Validation Errors:", Object.values(error.errors).map(err => err.message));
      return res.status(400).json({
        status: 'FAILED',
        message: 'Order validation failed',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({
      status: 'FAILED',
      message: 'Failed to create order. Please try again.'
    });
  }
};

// 2. Get All Orders (For Restaurant Dashboard)
exports.getAllOrders = async (req, res) => {
  try {
    const { status, restaurant } = req.query;
    let filter = {};

    if (status) filter.orderStatus = status;
    if (restaurant) filter.restaurantId = restaurant;

    // Show all orders to restaurants (not filtered by specific restaurant ID)
    // This is because orders are created with restaurant names, not user IDs
    // In the future, implement proper restaurant selection during checkout

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'SUCCESS',
      results: orders.length,
      data: orders
    });

  } catch (error) {
    console.error("❌ Get Orders Error:", error);
    res.status(500).json({ 
      status: 'FAILED', 
      message: 'Failed to fetch orders. Please try again.' 
    });
  }
};

// 3. Update Order Status (For Restaurant/Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    
    console.log('📝 Update order status request:', { orderId, status });
    
    // Validate status
    const validStatuses = ['PLACED', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        status: 'FAILED', 
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    // Validate orderId
    if (!orderId || !orderId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        status: 'FAILED', 
        message: 'Invalid order ID format' 
      });
    }
    
    // Find order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ 
        status: 'FAILED', 
        message: 'Order not found' 
      });
    }

    // Check permissions only if user is authenticated
    // For testing, allow updates without authentication
    if (req.user && req.user.role === 'restaurant' && order.restaurantId !== req.user.id) {
      // Allow for now since we're using restaurant names instead of IDs
      console.log('⚠️ Restaurant ID mismatch, but allowing update for testing');
    }

    // Update order status using the model method
    await order.updateStatus(status);

    // Create notification for customer based on status
    let notificationTitle = '';
    let notificationMessage = '';
    
    switch (status) {
      case 'CONFIRMED':
        notificationTitle = 'Order Confirmed!';
        notificationMessage = `Your order from ${order.restaurantName || order.restaurantId} has been confirmed and is being prepared.`;
        break;
      case 'PREPARING':
        notificationTitle = 'Food is Preparing!';
        notificationMessage = `Your delicious food is being prepared with care. Estimated time: 20-30 minutes.`;
        break;
      case 'READY':
        notificationTitle = 'Order Ready for Pickup!';
        notificationMessage = `Your order is ready! Please come to ${order.restaurantName || order.restaurantId} to collect your delicious food.`;
        break;
      case 'OUT_FOR_DELIVERY':
        notificationTitle = 'Out for Delivery!';
        notificationMessage = `Your order is on the way! Expected delivery in 10-15 minutes.`;
        break;
      case 'DELIVERED':
        notificationTitle = 'Order Delivered!';
        notificationMessage = `Your order has been delivered successfully. Enjoy your meal!`;
        break;
      case 'CANCELLED':
        notificationTitle = 'Order Cancelled';
        notificationMessage = `Your order has been cancelled. If you have any questions, please contact support.`;
        break;
    }

    // Create notification if we have a message
    if (notificationTitle && notificationMessage) {
      try {
        await createNotification(
          order.userId,
          order.userEmail,
          notificationTitle,
          notificationMessage,
          'order_update',
          order._id.toString()
        );
      } catch (notifError) {
        console.log('⚠️ Failed to create notification:', notifError.message);
        // Don't fail the order update if notification fails
      }
    }

    console.log(`✅ Order ${orderId} status updated to ${status}`);

    res.status(200).json({
      status: 'SUCCESS',
      message: `Order marked as ${status}`,
      data: order
    });

  } catch (error) {
    console.error("❌ Update Order Status Error:", error);
    res.status(500).json({ 
      status: 'FAILED', 
      message: 'Failed to update order status. Please try again.' 
    });
  }
};

// 4. Get User's Orders (For Profile Page)
exports.getUserOrders = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        status: 'FAILED',
        message: 'Authentication required'
      });
    }

    // Get orders for the authenticated user
    const orders = await Order.find({ 
      $or: [
        { userEmail: req.user.email },
        { userId: req.user.id }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'SUCCESS',
      results: orders.length,
      data: orders
    });

  } catch (error) {
    console.error("❌ Get User Orders Error:", error);
    res.status(500).json({ 
      status: 'FAILED', 
      message: 'Failed to fetch your orders. Please try again.' 
    });
  }
};

// 5. Get Order by ID (For tracking)
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        status: 'FAILED',
        message: 'Order not found'
      });
    }

    // Check if user can access this order
    if (req.user) {
      const canAccess = 
        order.userId === req.user.id || 
        order.userEmail === req.user.email ||
        (req.user.role === 'restaurant' && order.restaurantId === req.user.id) ||
        req.user.role === 'admin';
      
      if (!canAccess) {
        return res.status(403).json({
          status: 'FAILED',
          message: 'You do not have permission to view this order'
        });
      }
    }

    res.status(200).json({
      status: 'SUCCESS',
      data: order
    });

  } catch (error) {
    console.error("❌ Get Order Error:", error);
    res.status(500).json({
      status: 'FAILED',
      message: 'Failed to fetch order details'
    });
  }
};

// 6. Update Payment Status (For payment gateway callbacks)
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { orderId, paymentStatus, transactionId, paymentDetails } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        status: 'FAILED',
        message: 'Order not found'
      });
    }

    order.paymentStatus = paymentStatus;
    if (transactionId) order.transactionId = transactionId;
    if (paymentDetails) {
      order.paymentDetails = {
        ...order.paymentDetails,
        ...paymentDetails,
        paidAt: paymentStatus === 'PAID' ? new Date() : order.paymentDetails.paidAt
      };
    }

    await order.save();

    console.log(`✅ Payment status updated for order ${orderId}: ${paymentStatus}`);

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Payment status updated successfully',
      data: order
    });

  } catch (error) {
    console.error("❌ Update Payment Status Error:", error);
    res.status(500).json({
      status: 'FAILED',
      message: 'Failed to update payment status'
    });
  }
};

// 7. Get Transaction History (For user profile)
exports.getTransactionHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // If user is requesting their own transactions or is admin
    if (req.user && (req.user.id === userId || req.user.role === 'admin')) {
      const orders = await Order.find({ 
        $or: [
          { userId: userId },
          { userEmail: req.user.email }
        ],
        paymentStatus: { $in: ['PAID', 'PENDING', 'FAILED'] }
      })
      .select('_id totalAmount paymentMethod paymentStatus transactionId paymentDetails createdAt restaurantId restaurantName')
      .sort({ createdAt: -1 });

      const transactions = orders.map(order => ({
        id: order._id,
        orderId: order._id,
        amount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        status: order.paymentStatus,
        transactionId: order.transactionId,
        date: order.createdAt,
        restaurant: order.restaurantName || order.restaurantId,
        type: 'ORDER_PAYMENT'
      }));

      res.status(200).json({
        status: 'SUCCESS',
        results: transactions.length,
        data: transactions
      });
    } else {
      res.status(403).json({
        status: 'FAILED',
        message: 'You can only view your own transaction history'
      });
    }

  } catch (error) {
    console.error("❌ Get Transaction History Error:", error);
    res.status(500).json({
      status: 'FAILED',
      message: 'Failed to fetch transaction history'
    });
  }
};

// 8. Create Test Order (For testing notifications with logged-in user)
exports.createTestOrder = async (req, res) => {
  try {
    // If user is a restaurant, create order for their restaurant
    // If user is a customer, create order for a generic restaurant
    const isRestaurant = req.user.role === 'restaurant';
    
    const testOrderData = {
      items: [
        {
          name: "Test Burger",
          price: 250,
          qty: 1,
          id: "test-item-1"
        }
      ],
      totalAmount: 300,
      deliveryAddress: "Test Address, Kathmandu",
      restaurantId: isRestaurant ? req.user.id : "Test Restaurant",
      restaurantName: isRestaurant ? (req.user.profile?.name || 'Test Restaurant') : "Test Restaurant",
      paymentMethod: "COD",
      specialInstructions: "Test order for notifications",
      userEmail: isRestaurant ? 'testcustomer@khajamandu.com' : req.user.email,
      userId: isRestaurant ? 'test-customer-id' : req.user.id,
      customerName: isRestaurant ? 'Test Customer' : (req.user.profile?.name || 'Test Customer'),
      customerPhone: req.user.profile?.phone || '',
      orderStatus: 'PLACED',
      paymentStatus: 'PENDING'
    };

    const newOrder = new Order(testOrderData);
    await newOrder.save();

    console.log("✅ Test order created successfully! ID:", newOrder._id);

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Test order created successfully',
      data: {
        orderId: newOrder._id,
        orderStatus: newOrder.orderStatus,
        totalAmount: newOrder.totalAmount
      }
    });

  } catch (error) {
    console.error("❌ Test Order Error:", error);
    res.status(500).json({
      status: 'FAILED',
      message: 'Failed to create test order'
    });
  }
};

// 9. Get Pre-Orders (For restaurant - upcoming scheduled orders)
exports.getPreOrders = async (req, res) => {
  try {
    const { restaurantId } = req.query;
    const now = new Date();

    let filter = { isPreOrder: true, scheduledTime: { $gte: now } };
    if (restaurantId) filter.restaurantId = restaurantId;

    const preOrders = await Order.find(filter).sort({ scheduledTime: 1 });

    res.status(200).json({
      status: 'SUCCESS',
      results: preOrders.length,
      data: preOrders
    });
  } catch (error) {
    console.error('❌ Get Pre-Orders Error:', error);
    res.status(500).json({ status: 'FAILED', message: 'Failed to fetch pre-orders' });
  }
};

// 10. Auto-notify restaurant for upcoming pre-orders (called by a scheduler or cron)
exports.checkUpcomingPreOrders = async (req, res) => {
  try {
    const now = new Date();
    const in30Min = new Date(now.getTime() + 30 * 60 * 1000);

    // Find pre-orders scheduled within the next 30 minutes that haven't been reminded
    const upcoming = await Order.find({
      isPreOrder: true,
      scheduledTime: { $gte: now, $lte: in30Min },
      preOrderReminderSent: false,
      orderStatus: { $nin: ['CANCELLED', 'DELIVERED'] }
    });

    for (const order of upcoming) {
      try {
        await createNotification(
          order.userId,
          order.userEmail,
          '⏰ Pre-Order Reminder',
          `Your pre-order from ${order.restaurantName} is scheduled in 30 minutes. Food is being prepared!`,
          'pre_order_reminder',
          order._id.toString()
        );
        order.preOrderReminderSent = true;
        order.preOrderStatus = 'PREPARING_SOON';
        await order.save();
      } catch (e) {
        console.log('Notification error:', e.message);
      }
    }

    res.status(200).json({
      status: 'SUCCESS',
      message: `Processed ${upcoming.length} upcoming pre-orders`
    });
  } catch (error) {
    console.error('❌ Check Pre-Orders Error:', error);
    res.status(500).json({ status: 'FAILED', message: 'Failed to check pre-orders' });
  }
};
