const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const otpService = require('../services/otpService');
const blockchainService = require('../services/blockchainService');

router.post('/register', async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, userType, otpMethod } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email or phone number already exists' 
      });
    }

    const blockchainWallet = blockchainService.generateAddress();

    const user = new User({
      fullName,
      email,
      phoneNumber,
      password,
      userType,
      blockchainAddress: blockchainWallet.address
    });

    await user.save();
    const otpResult = await otpService.sendOTP(user, otpMethod || 'email');

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please verify OTP.',
      otpSent: otpResult.success,
      userId: user._id,
      otpMethod: otpMethod || 'email'
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed', 
      error: error.message 
    });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const verification = otpService.verifyOTP(user, otp);
    
    if (!verification.valid) {
      return res.status(400).json({ success: false, message: verification.message });
    }

    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Account verified successfully',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        userType: user.userType,
        blockchainAddress: user.blockchainAddress
      }
    });
  } catch (error) {
    console.error('OTP Verification Error:', error);
    res.status(500).json({ success: false, message: 'Verification failed' });
  }
});

router.post('/resend-otp', async (req, res) => {
  try {
    const { userId, method } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const otpResult = await otpService.sendOTP(user, method || 'email');

    res.json({
      success: otpResult.success,
      message: otpResult.message
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to resend OTP' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { emailOrPhone, password, otpMethod } = req.body;

    const user = await User.findOne({
      $or: [
        { email: emailOrPhone },
        { phoneNumber: emailOrPhone }
      ]
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const otpResult = await otpService.sendOTP(user, otpMethod || 'email');

    res.json({
      success: true,
      message: 'Please verify OTP to complete login',
      userId: user._id,
      otpSent: otpResult.success,
      requiresVerification: true
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

router.post('/verify-login-otp', async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const verification = otpService.verifyOTP(user, otp);
    
    if (!verification.valid) {
      return res.status(400).json({ success: false, message: verification.message });
    }

    user.lastLogin = new Date();
    user.otp = undefined;
    await user.save();

    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        userType: user.userType,
        blockchainAddress: user.blockchainAddress,
        walletBalance: user.walletBalance
      }
    });
  } catch (error) {
    console.error('Login OTP Verification Error:', error);
    res.status(500).json({ success: false, message: 'Verification failed' });
  }
});

module.exports = router;
