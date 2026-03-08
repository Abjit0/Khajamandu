const mongoose = require('mongoose');

const RiderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    // Availability Status
    isOnline: {
        type: Boolean,
        default: false
    },
    // Current Location (for GPS tracking)
    currentLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0]
        },
        address: {
            type: String,
            default: ''
        }
    },
    // Current Active Delivery
    activeDelivery: {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            default: null
        },
        status: {
            type: String,
            enum: ['idle', 'assigned', 'picked_up', 'on_the_way', 'delivered'],
            default: 'idle'
        },
        assignedAt: Date,
        pickedUpAt: Date,
        deliveredAt: Date
    },
    // Statistics
    stats: {
        totalDeliveries: {
            type: Number,
            default: 0
        },
        completedDeliveries: {
            type: Number,
            default: 0
        },
        cancelledDeliveries: {
            type: Number,
            default: 0
        },
        totalEarnings: {
            type: Number,
            default: 0
        },
        averageRating: {
            type: Number,
            default: 0
        },
        totalRatings: {
            type: Number,
            default: 0
        }
    },
    // Payout Information
    payouts: [{
        amount: Number,
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        },
        date: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['pending', 'paid'],
            default: 'pending'
        }
    }],
    // Vehicle Information
    vehicle: {
        type: {
            type: String,
            enum: ['bike', 'scooter', 'car'],
            required: true
        },
        licensePlate: String,
        model: String,
        color: String
    },
    // Verification Documents
    documents: {
        licenseNumber: {
            type: String,
            required: true
        },
        licenseVerified: {
            type: Boolean,
            default: false
        },
        backgroundCheckStatus: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        }
    },
    // Performance Metrics
    performance: {
        onTimeDeliveryRate: {
            type: Number,
            default: 100
        },
        acceptanceRate: {
            type: Number,
            default: 100
        },
        lastActiveAt: Date
    }
}, {
    timestamps: true
});

// Create geospatial index for location-based queries
RiderSchema.index({ 'currentLocation': '2dsphere' });

// Method to update location
RiderSchema.methods.updateLocation = function(longitude, latitude, address = '') {
    this.currentLocation = {
        type: 'Point',
        coordinates: [longitude, latitude],
        address: address
    };
    this.performance.lastActiveAt = new Date();
    return this.save();
};

// Method to toggle online status
RiderSchema.methods.toggleOnlineStatus = function(status) {
    this.isOnline = status;
    if (status) {
        this.performance.lastActiveAt = new Date();
    }
    return this.save();
};

// Method to assign delivery
RiderSchema.methods.assignDelivery = function(orderId) {
    this.activeDelivery = {
        orderId: orderId,
        status: 'assigned',
        assignedAt: new Date()
    };
    this.stats.totalDeliveries += 1;
    return this.save();
};

// Method to update delivery status
RiderSchema.methods.updateDeliveryStatus = function(status) {
    this.activeDelivery.status = status;
    
    if (status === 'picked_up') {
        this.activeDelivery.pickedUpAt = new Date();
    } else if (status === 'delivered') {
        this.activeDelivery.deliveredAt = new Date();
        this.stats.completedDeliveries += 1;
        
        // Reset active delivery
        this.activeDelivery = {
            orderId: null,
            status: 'idle'
        };
    }
    
    return this.save();
};

// Method to add payout
RiderSchema.methods.addPayout = function(amount, orderId) {
    this.payouts.push({
        amount: amount,
        orderId: orderId,
        date: new Date(),
        status: 'pending'
    });
    this.stats.totalEarnings += amount;
    return this.save();
};

// Static method to find nearest available rider
RiderSchema.statics.findNearestAvailableRider = async function(longitude, latitude, maxDistance = 5000) {
    return this.findOne({
        isOnline: true,
        'activeDelivery.status': 'idle',
        currentLocation: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                },
                $maxDistance: maxDistance // in meters
            }
        }
    });
};

module.exports = mongoose.model('Rider', RiderSchema);
