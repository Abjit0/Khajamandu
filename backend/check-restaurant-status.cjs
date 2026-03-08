const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String,
  profile: Object,
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function checkStatus() {
  try {
    const restaurant = await User.findOne({ 
      email: 'restaurant@khajamandu.com',
      role: 'restaurant'
    });

    if (!restaurant) {
      console.log('❌ Restaurant account not found');
      process.exit(1);
    }

    console.log('📋 Restaurant Account Status:');
    console.log('   Email:', restaurant.email);
    console.log('   Role:', restaurant.role);
    console.log('   Approved:', restaurant.isApproved);
    console.log('   Profile:', restaurant.profile);
    console.log('   Created:', restaurant.createdAt);

    if (!restaurant.isApproved) {
      console.log('\n⚠️ Account is NOT approved!');
      console.log('   Run: node approve-restaurant.cjs');
    } else {
      console.log('\n✅ Account IS approved!');
      console.log('   Make sure to logout and login again in the app');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkStatus();
