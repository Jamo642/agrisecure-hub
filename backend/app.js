require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Services
const blockchainService = require('./services/blockchainService');
const aiService = require('./services/aiService');
const otpService = require('./services/otpService');

// Models
const User = require('./models/User');
const Transaction = require('./models/Transaction');
const Product = require('./models/Product');
const ImageScan = require('./models/ImageScan');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Auth middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    req.userType = decoded.userType;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Initialize blockchain service
blockchainService.initialize();

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agrinova', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Auth Routes
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

// Profile Routes
app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password -otp');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
});

app.put('/api/profile', authMiddleware, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true }).select('-password -otp');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

// Image Scan Routes
app.post('/api/scan-image', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    const { scanType } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`;
    
    const analysis = await aiService.analyzeImage(req.file.buffer, scanType);
    
    if (!analysis.success) {
      return res.json(analysis);
    }

    const imageScan = new ImageScan({
      userId: req.userId,
      imageUrl: imageUrl,
      scanType: scanType,
      detectedCategory: analysis.detectedCategory,
      diagnosis: analysis.diagnosis,
      recommendations: analysis.recommendations,
      processingTime: analysis.processingTime
    });

    await imageScan.save();

    res.json({
      success: true,
      scan: imageScan,
      analysis: analysis
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Image scan failed', error: error.message });
  }
});

app.get('/api/scan-history', authMiddleware, async (req, res) => {
  try {
    const scans = await ImageScan.find({ userId: req.userId }).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, scans });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch scan history' });
  }
});

// Transaction Routes
app.post('/api/transactions', authMiddleware, async (req, res) => {
  try {
    const { transactionType, category, amount, description, paymentMethod } = req.body;
    
    const blockchainData = await blockchainService.recordTransaction({
      userId: req.userId,
      amount: amount,
      transactionType: transactionType
    });

    const transaction = new Transaction({
      userId: req.userId,
      transactionType,
      category,
      amount,
      description,
      paymentMethod,
      blockchainHash: blockchainData.blockchainHash,
      blockchainVerified: blockchainData.verified,
      status: 'completed'
    });

    await transaction.save();

    if (transactionType === 'income') {
      await User.findByIdAndUpdate(req.userId, { $inc: { walletBalance: amount } });
    } else if (transactionType === 'expense') {
      await User.findByIdAndUpdate(req.userId, { $inc: { walletBalance: -amount } });
    }

    res.json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Transaction failed', error: error.message });
  }
});

app.get('/api/transactions', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;
    const query = { userId: req.userId };
    
    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (type) {
      query.transactionType = type;
    }

    const transactions = await Transaction.find(query).sort({ createdAt: -1 });
    res.json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch transactions' });
  }
});

app.get('/api/financial-report', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { userId: req.userId };
    
    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const transactions = await Transaction.find(query);
    
    const income = transactions
      .filter(t => t.transactionType === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.transactionType === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const profit = income - expenses;

    const expensesByCategory = transactions
      .filter(t => t.transactionType === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    res.json({
      success: true,
      report: {
        totalIncome: income,
        totalExpenses: expenses,
        profit: profit,
        expensesByCategory: expensesByCategory,
        transactionCount: transactions.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate report' });
  }
});

// Product/Marketplace Routes
app.post('/api/products', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    const productData = req.body;
    productData.sellerId = req.userId;
    
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    const product = new Product(productData);
    await product.save();

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create product', error: error.message });
  }
});

app.get('/api/products', authMiddleware, async (req, res) => {
  try {
    const { productType, forUserType, search } = req.query;
    const query = { availability: 'available' };
    
    if (productType) {
      query.productType = productType;
    }
    if (forUserType) {
      query.forUserType = forUserType;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query).populate('sellerId', 'fullName phoneNumber').sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
});

app.get('/api/my-products', authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch your products' });
  }
});

// AI Chatbot Route
app.post('/api/chatbot', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    const user = await User.findById(req.userId);
    
    const response = await aiService.chatbot(message, user.userType);
    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Chatbot error', error: error.message });
  }
});

// USSD and M-Pesa routes
const ussdRouter = require('./ussd');
app.use('/', ussdRouter);

const mpesaRouter = require('./mpesa');
app.use('/', mpesaRouter);

app.post('/mpesa/callback', async (req, res) => {
  console.log('M-Pesa Callback:', req.body);
  res.status(200).send('Callback received');
});

app.listen(port, () => {
  console.log(`AgriNova Server running on http://localhost:${port}`);
});

module.exports = app;

