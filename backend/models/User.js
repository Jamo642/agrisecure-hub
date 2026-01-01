const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ['farmer', 'buyer', 'seller'],
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    code: String,
    expiresAt: Date,
    type: String
  },
  blockchainAddress: {
    type: String,
    unique: true,
    sparse: true
  },
  farmDetails: {
    farmSize: Number,
    location: String,
    crops: [String],
    livestock: [String]
  },
  buyerDetails: {
    businessName: String,
    businessType: String,
    preferredProducts: [String]
  },
  sellerDetails: {
    businessName: String,
    productsOffered: [String],
    serviceType: {
      type: String,
      enum: ['fertilizers', 'seeds', 'pesticides', 'equipment', 'tractor-hire', 'other']
    }
  },
  bankDetails: {
    accountNumber: String,
    bankName: String,
    accountName: String
  },
  walletBalance: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
