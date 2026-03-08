const axios = require('axios');

const BASE_URL = 'http://192.168.101.5:5000/api';

async function createRiderAccount() {
  console.log('🚴 Creating Rider Account\n');

  try {
    // Create rider account
    console.log('1️⃣ Creating rider account...');
    const signupData = {
      email: 'rider@khajamandu.com',
      password: 'rider123',
      role: 'rider',
      profile: {
        name: 'Delivery Rider',
        phone: '9876543211',
        address: 'Kathmandu, Nepal',
        vehicleType: 'Motorcycle',
        licenseNumber: 'BA-12-PA-1234'
      }
    };

    try {
      const signupResponse = await axios.post(`${BASE_URL}/otp/signup`, signupData);
      console.log('✅ Rider account created!');
      console.log('📧 Check your email for OTP verification code');
    } catch (error) {
      if (error.response?.data?.message?.includes('already exists')) {
        console.log('ℹ️ Rider account already exists');
      } else {
        throw error;
      }
    }

    console.log('\n📋 Rider Login Credentials:');
    console.log('   Email: rider@khajamandu.com');
    console.log('   Password: rider123');
    console.log('\n🔐 Steps to access Rider Dashboard:');
    console.log('   1. Logout from your current account');
    console.log('   2. Login with the credentials above');
    console.log('   3. Go to Rider Dashboard');
    console.log('   4. You can now see and accept delivery orders!');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

createRiderAccount();
