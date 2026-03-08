const Rider = require('../models/riderModel');
const Order = require('../models/orderModel');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

// 1. Initialize Rider Profile (called after user signup)
exports.initializeRiderProfile = async (req, res) => {
    try {
        const { userId, vehicleType, licenseNumber } = req.body;

        // Check if rider profile already exists
        let rider = await Rider.findOne({ userId });
        
        if (rider) {
            return res.status(400).json({
                status: 'FAILED',
                message: 'Rider profile already exists'
            });
        }

        // Create new rider profile
        rider = new Rider({
            userId: userId,
            vehicle: {
                type: vehicleType
            },
            documents: {
                licenseNumber: licenseNumber
            }
        });

        await rider.save();

        res.status(200).json({
            status: 'SUCCESS',
            message: 'Rider profile created successfully',
            data: rider
        });
    } catch (error) {
        console.error('Initialize Rider Error:', error);
        res.status(500).json({
            status: 'FAILED',
            message: 'Failed to initialize rider profile'
        });
    }
};

// 2. Toggle Online/Offline Status
exports.toggleOnlineStatus = async (req, res) => {
    try {
        const { riderId, isOnline } = req.body;

        const rider = await Rider.findOne({ userId: riderId });
        
        if (!rider) {
            return res.status(404).json({
                status: 'FAILED',
                message: 'Rider profile not found'
            });
        }

        await rider.toggleOnlineStatus(isOnline);

        console.log(`✅ Rider ${riderId} is now ${isOnline ? 'ONLINE' : 'OFFLINE'}`);

        res.status(200).json({
            status: 'SUCCESS',
            message: `Status updated to ${isOnline ? 'online' : 'offline'}`,
            data: {
                isOnline: rider.isOnline
            }
        });
    } catch (error) {
        console.error('Toggle Online Status Error:', error);
        res.status(500).json({
            status: 'FAILED',
            message: 'Failed to update status'
        });
    }
};

// 3. Update Rider Location (GPS tracking)
exports.updateLocation = async (req, res) => {
    try {
        const { riderId, longitude, latitude, address } = req.body;

        const rider = await Rider.findOne({ userId: riderId });
        
        if (!rider) {
            return res.status(404).json({
                status: 'FAILED',
                message: 'Rider profile not found'
            });
        }

        await rider.updateLocation(longitude, latitude, address);

        res.status(200).json({
            status: 'SUCCESS',
            message: 'Location updated successfully',
            data: {
                location: rider.currentLocation
            }
        });
    } catch (error) {
        console.error('Update Location Error:', error);
        res.status(500).json({
            status: 'FAILED',
            message: 'Failed to update location'
        });
    }
};

// 4. Get Available Deliveries (orders ready for pickup)
exports.getAvailableDeliveries = async (req, res) => {
    try {
        const { riderId } = req.params;

        // Get rider's location
        const rider = await Rider.findOne({ userId: riderId });
        
        if (!rider) {
            return res.status(404).json({
                status: 'FAILED',
                message: 'Rider profile not found'
            });
        }

        // Find orders that are READY for delivery and not assigned to any rider
        const availableOrders = await Order.find({
            orderStatus: 'READY',
            riderId: { $exists: false }
        }).sort({ createdAt: 1 }).limit(10);

        res.status(200).json({
            status: 'SUCCESS',
            results: availableOrders.length,
            data: availableOrders
        });
    } catch (error) {
        console.error('Get Available Deliveries Error:', error);
        res.status(500).json({
            status: 'FAILED',
            message: 'Failed to fetch available deliveries'
        });
    }
};

// 5. Accept Delivery Request
exports.acceptDelivery = async (req, res) => {
    try {
        const { riderId, orderId } = req.body;

        // Find rider
        const rider = await Rider.findOne({ userId: riderId });
        
        if (!rider) {
            return res.status(404).json({
                status: 'FAILED',
                message: 'Rider profile not found'
            });
        }

        // Check if rider is online and available
        if (!rider.isOnline) {
            return res.status(400).json({
                status: 'FAILED',
                message: 'You must be online to accept deliveries'
            });
        }

        if (rider.activeDelivery.status !== 'idle') {
            return res.status(400).json({
                status: 'FAILED',
                message: 'You already have an active delivery'
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

        if (order.orderStatus !== 'READY') {
            return res.status(400).json({
                status: 'FAILED',
                message: 'Order is not ready for pickup'
            });
        }

        // Assign delivery to rider
        await rider.assignDelivery(orderId);
        
        // Update order with rider info
        order.riderId = riderId;
        order.orderStatus = 'OUT_FOR_DELIVERY';
        await order.save();

        // Calculate delivery fee (you can customize this logic)
        const deliveryFee = 50; // Base fee
        await rider.addPayout(deliveryFee, orderId);

        // Notify customer
        await createNotification(
            order.userId,
            order.userEmail,
            'Rider Assigned!',
            `Your order is now being delivered. Track your delivery in real-time.`,
            'delivery_update',
            orderId
        );

        console.log(`✅ Delivery ${orderId} assigned to rider ${riderId}`);

        res.status(200).json({
            status: 'SUCCESS',
            message: 'Delivery accepted successfully',
            data: {
                order: order,
                deliveryFee: deliveryFee
            }
        });
    } catch (error) {
        console.error('Accept Delivery Error:', error);
        res.status(500).json({
            status: 'FAILED',
            message: 'Failed to accept delivery'
        });
    }
};

// 6. Update Delivery Status (Picked Up, On the Way, Delivered)
exports.updateDeliveryStatus = async (req, res) => {
    try {
        const { riderId, orderId, status } = req.body;

        const validStatuses = ['picked_up', 'on_the_way', 'delivered'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                status: 'FAILED',
                message: 'Invalid delivery status'
            });
        }

        // Find rider
        const rider = await Rider.findOne({ userId: riderId });
        
        if (!rider) {
            return res.status(404).json({
                status: 'FAILED',
                message: 'Rider profile not found'
            });
        }

        // Update rider's delivery status
        await rider.updateDeliveryStatus(status);

        // Update order status
        const order = await Order.findById(orderId);
        if (order) {
            if (status === 'delivered') {
                order.orderStatus = 'DELIVERED';
            } else {
                order.orderStatus = 'OUT_FOR_DELIVERY';
            }
            await order.save();

            // Notify customer
            let notificationTitle = '';
            let notificationMessage = '';
            
            if (status === 'picked_up') {
                notificationTitle = 'Order Picked Up!';
                notificationMessage = 'Your order has been picked up and is on the way.';
            } else if (status === 'on_the_way') {
                notificationTitle = 'On the Way!';
                notificationMessage = 'Your order is on the way to your location.';
            } else if (status === 'delivered') {
                notificationTitle = 'Order Delivered!';
                notificationMessage = 'Your order has been delivered. Enjoy your meal!';
            }

            await createNotification(
                order.userId,
                order.userEmail,
                notificationTitle,
                notificationMessage,
                'delivery_update',
                orderId
            );
        }

        console.log(`✅ Delivery ${orderId} status updated to ${status}`);

        res.status(200).json({
            status: 'SUCCESS',
            message: `Delivery status updated to ${status}`,
            data: {
                deliveryStatus: status
            }
        });
    } catch (error) {
        console.error('Update Delivery Status Error:', error);
        res.status(500).json({
            status: 'FAILED',
            message: 'Failed to update delivery status'
        });
    }
};

// 7. Get Rider's Active Delivery
exports.getActiveDelivery = async (req, res) => {
    try {
        const { riderId } = req.params;

        const rider = await Rider.findOne({ userId: riderId }).populate('activeDelivery.orderId');
        
        if (!rider) {
            return res.status(404).json({
                status: 'FAILED',
                message: 'Rider profile not found'
            });
        }

        res.status(200).json({
            status: 'SUCCESS',
            data: rider.activeDelivery
        });
    } catch (error) {
        console.error('Get Active Delivery Error:', error);
        res.status(500).json({
            status: 'FAILED',
            message: 'Failed to fetch active delivery'
        });
    }
};

// 8. Get Rider Statistics & Earnings
exports.getRiderStats = async (req, res) => {
    try {
        const { riderId } = req.params;

        const rider = await Rider.findOne({ userId: riderId });
        
        if (!rider) {
            return res.status(404).json({
                status: 'FAILED',
                message: 'Rider profile not found'
            });
        }

        // Calculate today's earnings
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayPayouts = rider.payouts.filter(payout => 
            payout.date >= today
        );
        
        const todayEarnings = todayPayouts.reduce((sum, payout) => sum + payout.amount, 0);

        // Calculate pending payouts
        const pendingPayouts = rider.payouts.filter(payout => payout.status === 'pending');
        const pendingAmount = pendingPayouts.reduce((sum, payout) => sum + payout.amount, 0);

        res.status(200).json({
            status: 'SUCCESS',
            data: {
                stats: rider.stats,
                performance: rider.performance,
                earnings: {
                    total: rider.stats.totalEarnings,
                    today: todayEarnings,
                    pending: pendingAmount
                },
                payouts: rider.payouts.slice(-10).reverse() // Last 10 payouts
            }
        });
    } catch (error) {
        console.error('Get Rider Stats Error:', error);
        res.status(500).json({
            status: 'FAILED',
            message: 'Failed to fetch rider statistics'
        });
    }
};

// 9. Get Rider Profile
exports.getRiderProfile = async (req, res) => {
    try {
        const { riderId } = req.params;

        const rider = await Rider.findOne({ userId: riderId }).populate('userId', 'email profile');
        
        if (!rider) {
            return res.status(404).json({
                status: 'FAILED',
                message: 'Rider profile not found'
            });
        }

        res.status(200).json({
            status: 'SUCCESS',
            data: rider
        });
    } catch (error) {
        console.error('Get Rider Profile Error:', error);
        res.status(500).json({
            status: 'FAILED',
            message: 'Failed to fetch rider profile'
        });
    }
};

// 10. Auto-assign nearest rider to an order (called when order is READY)
exports.autoAssignNearestRider = async (orderId, restaurantLocation) => {
    try {
        console.log(`🔍 Finding nearest rider for order ${orderId}`);
        
        // Find nearest available rider within 5km
        const nearestRider = await Rider.findNearestAvailableRider(
            restaurantLocation.longitude,
            restaurantLocation.latitude,
            5000 // 5km radius
        );

        if (!nearestRider) {
            console.log('⚠️ No available riders found nearby');
            return null;
        }

        // Assign delivery
        await nearestRider.assignDelivery(orderId);
        
        // Update order
        const order = await Order.findById(orderId);
        if (order) {
            order.riderId = nearestRider.userId;
            order.orderStatus = 'OUT_FOR_DELIVERY';
            await order.save();
        }

        // Calculate delivery fee
        const deliveryFee = 50;
        await nearestRider.addPayout(deliveryFee, orderId);

        console.log(`✅ Order ${orderId} auto-assigned to rider ${nearestRider.userId}`);

        return nearestRider;
    } catch (error) {
        console.error('Auto-assign Rider Error:', error);
        return null;
    }
};

module.exports = exports;


// 11. Update Rider Profile
exports.updateRiderProfile = async (req, res) => {
    try {
        const { riderId, vehicle, documents } = req.body;

        const rider = await Rider.findOne({ userId: riderId });
        
        if (!rider) {
            return res.status(404).json({
                status: 'FAILED',
                message: 'Rider profile not found'
            });
        }

        // Update vehicle information
        if (vehicle) {
            rider.vehicle = {
                ...rider.vehicle,
                ...vehicle
            };
        }

        // Update documents
        if (documents) {
            rider.documents = {
                ...rider.documents,
                ...documents
            };
        }

        await rider.save();

        console.log(`✅ Rider profile updated for ${riderId}`);

        res.status(200).json({
            status: 'SUCCESS',
            message: 'Rider profile updated successfully',
            data: rider
        });
    } catch (error) {
        console.error('Update Rider Profile Error:', error);
        res.status(500).json({
            status: 'FAILED',
            message: 'Failed to update rider profile'
        });
    }
};
