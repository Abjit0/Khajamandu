const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true, min: 0 },
      qty: { type: Number, required: true, min: 1 },
      id: { type: String, required: false },
      specialInstructions: { type: String, default: '' }
    }
  ],
  totalAmount: { type: Number, required: true, min: 0 },
  deliveryAddress: { type: String, required: true, minlength: 5 },
  restaurantId: { type: String, required: true },
  restaurantName: { type: String, default: '' },
  paymentMethod: { 
    type: String, 
    required: true,
    enum: ['COD', 'Khalti', 'eSewa']
  },
  orderStatus: { 
    type: String, 
    default: 'PLACED',
    enum: ['PLACED', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']
  },
  paymentStatus: { 
    type: String, 
    default: 'PENDING',
    enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED']
  },
  orderType: {
    type: String,
    enum: ['delivery', 'takeaway', 'dine-in'],
    default: 'delivery'
  },
  specialInstructions: { type: String, default: '' },
  estimatedDeliveryTime: { type: Date },
  userEmail: { type: String, default: 'guest@khajamandu.com' },
  userId: { type: String, default: 'guest-user' },
  customerPhone: { type: String, default: '' },
  customerName: { type: String, default: '' },
  // Payment details
  transactionId: { type: String, default: '' },
  paymentDetails: {
    provider: { type: String, default: '' },
    transactionRef: { type: String, default: '' },
    paidAmount: { type: Number, default: 0 },
    paidAt: { type: Date }
  },
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  confirmedAt: { type: Date },
  preparedAt: { type: Date },
  deliveredAt: { type: Date }
});

// Index for better query performance
orderSchema.index({ userEmail: 1, createdAt: -1 });
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ restaurantId: 1, orderStatus: 1 });

// Method to update order status with timestamp
orderSchema.methods.updateStatus = function(newStatus) {
  this.orderStatus = newStatus;
  
  switch(newStatus) {
    case 'CONFIRMED':
      this.confirmedAt = new Date();
      break;
    case 'PREPARING':
      this.preparedAt = new Date();
      break;
    case 'DELIVERED':
      this.deliveredAt = new Date();
      break;
  }
  
  return this.save();
};

module.exports = mongoose.model('Order', orderSchema);