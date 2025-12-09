const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { 
    type: String, 
    required: true,
    enum: ['appetizer', 'main', 'dessert', 'beverage', 'snack']
  },
  image: { type: String, default: '' },
  isAvailable: { type: Boolean, default: true },
  restaurantId: { type: String, required: true },
  restaurantName: { type: String, required: true },
  preparationTime: { type: Number, default: 15 }, // minutes
  ingredients: [{ type: String }],
  allergens: [{ type: String }],
  isVegetarian: { type: Boolean, default: false },
  isVegan: { type: Boolean, default: false },
  spiceLevel: { 
    type: String, 
    enum: ['mild', 'medium', 'hot', 'extra-hot', 'none'],
    default: 'none'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
menuItemSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

// Index for better query performance
menuItemSchema.index({ restaurantId: 1, isAvailable: 1 });
menuItemSchema.index({ category: 1, isAvailable: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);