require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI;

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String,
  profile: Object,
  isApproved: Boolean,
  verified: Boolean,
  createdAt: { type: Date, default: Date.now }
}, { collection: 'users' });

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const adminEmail = 'admin@khajamandu.com';
    const adminPassword = 'admin123';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('⚠️  Admin account already exists!');
      console.log('   Email:', existingAdmin.email);
      console.log('   Role:', existingAdmin.role);
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Create admin user
    const admin = new User({
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      profile: {
        name: 'Admin',
        phone: '9800000000'
      },
      isApproved: true,
      verified: true
    });

    await admin.save();

    console.log('\n✅ Admin account created successfully!');
    console.log('\n📋 Admin Credentials:');
    console.log('   Email:', adminEmail);
    console.log('   Password:', adminPassword);
    console.log('\n🌐 Login at: http://localhost:5173/admin');
    console.log('   (Make sure the web app is running with: npm run dev)');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

createAdmin();
