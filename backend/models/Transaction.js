const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transactionType: {
    type: String,
    enum: ['income', 'expense', 'bank_transfer', 'mpesa', 'wallet'],
    required: true
  },
  category: {
    type: String,
    enum: ['seeds', 'fertilizers', 'pesticides', 'labor', 'equipment', 'sale', 'service', 'other']
  },
  amount: {
    type: Number,
    required: true
  },
  description: String,
  paymentMethod: {
    type: String,
    enum: ['cash', 'mpesa', 'bank', 'wallet']
  },
  mpesaTransactionId: String,
  bankTransactionId: String,
  blockchainHash: String,
  blockchainVerified: {
    type: Boolean,
    default: false
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'reversed'],
    default: 'pending'
  },
  metadata: {
    productId: String,
    orderId: String,
    notes: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ blockchainHash: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
