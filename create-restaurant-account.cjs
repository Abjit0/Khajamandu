const axios = require('axios');

const BASE_URL = 'http://192.168.101.10:5000/api';

async function createRestaurantAccount() {
  console.log('🍽️ Creating Restaurant Account\n');

  try {
    // Create restaurant account
    console.log('1️⃣ Creating restaurant account...');
    const signupData = {
      email: 'restaurant@khajamandu.com',
      password: 'restaurant123',
      role: 'restaurant',
      profile: {
        name: 'My Restaurant',
        phone: '9876543210',
        address: 'Kathmandu, Nepal',
        restaurantName: 'My Restaurant',
        cuisine: 'Nepali, Indian',
        restaurantAddress: 'Thamel, Kathmandu',
        restaurantPhone: '9876543210'
      }
    };

    try {
      const signupResponse = await axios.post(`${BASE_URL}/otp/signup`, signupData);
      console.log('✅ Restaurant account created!');
      console.log('📧 Check your email for OTP verification code');
    } catch (error) {
      if (error.response?.data?.message?.includes('already exists')) {
        console.log('ℹ️ Restaurant account already exists');
      } else {
        throw error;
      }
    }

    console.log('\n📋 Restaurant Login Credentials:');
    console.log('   Email: restaurant@khajamandu.com');
    console.log('   Password: restaurant123');
    console.log('\n🔐 Steps to access Restaurant Dashboard:');
    console.log('   1. Logout from your current account');
    console.log('   2. Login with the credentials above');
    console.log('   3. Go to Restaurant Dashboard');
    console.log('   4. You can now manage menu items and orders!');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

createRestaurantAccount();
