const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['customer', 'restaurant', 'rider', 'admin'],
        default: 'customer'
    },
    profile: {
        name: { type: String, default: '' },
        phone: { type: String, default: '' },
        address: { type: String, default: '' },
        // Restaurant-specific fields
        restaurantName: { type: String, default: '' },
        restaurantAddress: { type: String, default: '' },
        restaurantPhone: { type: String, default: '' },
        cuisine: { type: String, default: '' },
        // Rider-specific fields
        vehicleType: { type: String, enum: ['bike', 'scooter', 'car', ''], default: '' },
        licenseNumber: { type: String, default: '' },
        isOnline: { type: Boolean, default: false }
    },
    isVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: true }, // Auto-approve customers
    createdAt: { type: Date, default: Date.now }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);