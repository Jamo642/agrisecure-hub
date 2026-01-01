const mongoose = require('mongoose');

const imageScanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  scanType: {
    type: String,
    enum: ['crop', 'livestock', 'unknown'],
    required: true
  },
  detectedCategory: {
    type: String,
    enum: ['crop', 'animal', 'other', 'invalid']
  },
  diagnosis: {
    disease: String,
    confidence: Number,
    severity: String,
    affectedArea: String
  },
  recommendations: [{
    type: String,
    product: String,
    dosage: String,
    timing: String
  }],
  aiModel: {
    type: String,
    default: 'tensorflow-lite'
  },
  processingTime: Number,
  metadata: {
    cropType: String,
    animalType: String,
    symptoms: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

imageScanSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('ImageScan', imageScanSchema);
