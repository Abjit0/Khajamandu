const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// User Schema (simplified)
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String,
  profile: Object,
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function approveRestaurant() {
  try {
    console.log('🔍 Finding restaurant account...');
    
    const restaurant = await User.findOne({ 
      email: 'restaurant@khajamandu.com',
      role: 'restaurant'
    });

    if (!restaurant) {
      console.log('❌ Restaurant account not found');
      console.log('   Make sure you created the account first');
      process.exit(1);
    }

    console.log('📋 Restaurant found:', restaurant.email);
    console.log('   Current approval status:', restaurant.isApproved);

    if (restaurant.isApproved) {
      console.log('✅ Restaurant is already approved!');
    } else {
      // Approve the restaurant
      restaurant.isApproved = true;
      await restaurant.save();
      console.log('✅ Restaurant account approved successfully!');
    }

    console.log('\n🎉 You can now:');
    console.log('   1. Login with: restaurant@khajamandu.com');
    console.log('   2. Add menu items');
    console.log('   3. Manage orders');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

approveRestaurant();
