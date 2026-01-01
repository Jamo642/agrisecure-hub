const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productType: {
    type: String,
    enum: ['crop', 'livestock', 'fertilizer', 'seed', 'pesticide', 'equipment', 'service'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  category: String,
  price: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    enum: ['kg', 'liter', 'bag', 'piece', 'hour', 'day'],
    default: 'kg'
  },
  quantity: {
    type: Number,
    required: true
  },
  images: [String],
  location: {
    county: String,
    subCounty: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  quality: {
    type: String,
    enum: ['premium', 'grade-a', 'grade-b', 'standard']
  },
  availability: {
    type: String,
    enum: ['available', 'out-of-stock', 'pre-order'],
    default: 'available'
  },
  forUserType: {
    type: [String],
    enum: ['farmer', 'buyer'],
    default: ['farmer', 'buyer']
  },
  serviceDetails: {
    tractorType: String,
    duration: String,
    coverage: String
  },
  ratings: [{
    userId: mongoose.Schema.Types.ObjectId,
    rating: Number,
    review: String,
    date: Date
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

productSchema.index({ sellerId: 1, productType: 1 });
productSchema.index({ productType: 1, availability: 1 });

module.exports = mongoose.model('Product', productSchema);
