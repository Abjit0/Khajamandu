const User = require('../models/User');
const Order = require('../models/orderModel');
const MenuItem = require('../models/menuModel');

// Get all pending users (restaurants and riders)
exports.getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.find({ 
      isApproved: false,
      role: { $in: ['restaurant', 'rider'] }
    }).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'SUCCESS',
      results: pendingUsers.length,
      data: pendingUsers
    });
  } catch (error) {
    console.error('Get pending users error:', error);
    res.status(500).json({
      status: 'FAILED',
      message: 'Failed to fetch pending users'
    });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const { role, isApproved } = req.query;
    let filter = {};
    
    if (role) filter.role = role;
    if (isApproved !== undefined) filter.isApproved = isApproved === 'true';

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'SUCCESS',
      results: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      status: 'FAILED',
      message: 'Failed to fetch users'
    });
  }
};

// Approve user
exports.approveUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isApproved: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'FAILED',
        message: 'User not found'
      });
    }

    console.log(`✅ User approved: ${user.email} (${user.role})`);

    res.status(200).json({
      status: 'SUCCESS',
      message: `${user.role} approved successfully`,
      data: user
    });
  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({
      status: 'FAILED',
      message: 'Failed to approve user'
    });
  }
};

// Reject user
exports.rejectUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        status: 'FAILED',
        message: 'User not found'
      });
    }

    console.log(`❌ User rejected and deleted: ${user.email} (${user.role})`);

    res.status(200).json({
      status: 'SUCCESS',
      message: `${user.role} rejected and removed`
    });
  } catch (error) {
    console.error('Reject user error:', error);
    res.status(500).json({
      status: 'FAILED',
      message: 'Failed to reject user'
    });
  }
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalRestaurants,
      totalRiders,
      totalCustomers,
      pendingApprovals,
      totalOrders,
      totalRevenue,
      todayOrders
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'restaurant', isApproved: true }),
      User.countDocuments({ role: 'rider', isApproved: true }),
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ isApproved: false, role: { $in: ['restaurant', 'rider'] } }),
      Order.countDocuments(),
      Order.aggregate([
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Order.countDocuments({
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      })
    ]);

    res.status(200).json({
      status: 'SUCCESS',
      data: {
        totalUsers,
        totalRestaurants,
        totalRiders,
        totalCustomers,
        pendingApprovals,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        todayOrders
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      status: 'FAILED',
      message: 'Failed to fetch dashboard statistics'
    });
  }
};

// Get recent orders
exports.getRecentOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      status: 'SUCCESS',
      results: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get recent orders error:', error);
    res.status(500).json({
      status: 'FAILED',
      message: 'Failed to fetch recent orders'
    });
  }
};
