require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;

// User Schema (simplified)
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String,
  profile: Object,
  isApproved: Boolean,
  verified: Boolean
}, { collection: 'users' });

const User = mongoose.model('User', userSchema);

// UserVerification Schema
const userVerificationSchema = new mongoose.Schema({
  userId: String,
  email: String,
  otp: String,
  createdAt: { type: Date, default: Date.now }
}, { collection: 'userverifications' });

const UserVerification = mongoose.model('UserVerification', userVerificationSchema);

async function deleteUser(email) {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    console.log(`\n🔍 Searching for user: ${email}`);
    
    // Find the user
    const user = await User.findOne({ email: email });
    
    if (!user) {
      console.log('❌ User not found with email:', email);
      process.exit(0);
    }

    console.log('✅ User found:');
    console.log('   - Email:', user.email);
    console.log('   - Role:', user.role);
    console.log('   - Verified:', user.verified);
    console.log('   - Approved:', user.isApproved);

    // Delete user verification records
    const verificationResult = await UserVerification.deleteMany({ 
      $or: [
        { email: email },
        { userId: user._id.toString() }
      ]
    });
    console.log(`\n🗑️  Deleted ${verificationResult.deletedCount} verification record(s)`);

    // Delete the user
    await User.deleteOne({ email: email });
    console.log('🗑️  User account deleted successfully!');

    console.log('\n✅ Done! You can now signup again with this email.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('❌ Please provide an email address');
  console.log('Usage: node delete-user.cjs <email>');
  console.log('Example: node delete-user.cjs test@example.com');
  process.exit(1);
}

deleteUser(email);
