const Notification = require('../models/notificationModel');

// 1. Create a new notification
exports.createNotification = async (userId, userEmail, title, message, type = 'order_update', orderId = '') => {
  try {
    const notification = new Notification({
      userId,
      userEmail,
      title,
      message,
      type,
      orderId
    });
    
    await notification.save();
    console.log(`✅ Notification created for user ${userId}: ${title}`);
    return notification;
  } catch (error) {
    console.error('❌ Error creating notification:', error);
    return null;
  }
};

// 2. Get user notifications
exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user is requesting their own notifications or is admin
    if (req.user && (req.user.id === userId || req.user.role === 'admin')) {
      const notifications = await Notification.find({
        $or: [
          { userId: userId },
          { userEmail: req.user.email }
        ]
      })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to last 50 notifications

      const unreadCount = await Notification.countDocuments({
        $or: [
          { userId: userId },
          { userEmail: req.user.email }
        ],
        read: false
      });

      res.status(200).json({
        status: 'SUCCESS',
        results: notifications.length,
        unreadCount,
        data: notifications
      });
    } else {
      res.status(403).json({
        status: 'FAILED',
        message: 'You can only view your own notifications'
      });
    }
  } catch (error) {
    console.error('❌ Get Notifications Error:', error);
    res.status(500).json({
      status: 'FAILED',
      message: 'Failed to fetch notifications'
    });
  }
};

// 3. Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({
        status: 'FAILED',
        message: 'Notification not found'
      });
    }

    // Check if user owns this notification
    if (req.user && (notification.userId === req.user.id || notification.userEmail === req.user.email)) {
      notification.read = true;
      await notification.save();

      res.status(200).json({
        status: 'SUCCESS',
        message: 'Notification marked as read'
      });
    } else {
      res.status(403).json({
        status: 'FAILED',
        message: 'You can only update your own notifications'
      });
    }
  } catch (error) {
    console.error('❌ Mark Read Error:', error);
    res.status(500).json({
      status: 'FAILED',
      message: 'Failed to mark notification as read'
    });
  }
};

// 4. Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (req.user && (req.user.id === userId || req.user.role === 'admin')) {
      await Notification.updateMany(
        {
          $or: [
            { userId: userId },
            { userEmail: req.user.email }
          ],
          read: false
        },
        { read: true }
      );

      res.status(200).json({
        status: 'SUCCESS',
        message: 'All notifications marked as read'
      });
    } else {
      res.status(403).json({
        status: 'FAILED',
        message: 'You can only update your own notifications'
      });
    }
  } catch (error) {
    console.error('❌ Mark All Read Error:', error);
    res.status(500).json({
      status: 'FAILED',
      message: 'Failed to mark all notifications as read'
    });
  }
};

module.exports = {
  createNotification: exports.createNotification,
  getUserNotifications: exports.getUserNotifications,
  markAsRead: exports.markAsRead,
  markAllAsRead: exports.markAllAsRead
};