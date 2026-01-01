const nodemailer = require('nodemailer');
const twilio = require('twilio');

class OTPService {
  constructor() {
    // Only initialize if credentials are provided
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      this.emailTransporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });
    }

    // Only initialize Twilio if credentials provided
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
    }
  }

  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendEmailOTP(email, otp, userName) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'AgriNova - Verify Your Account',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome to AgriNova!</h2>
          <p>Hi ${userName},</p>
          <p>Your verification code is:</p>
          <h1 style="color: #10b981; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <br>
          <p>Best regards,<br>AgriNova Team</p>
        </div>
      `
    };

    try {
      await this.emailTransporter.sendMail(mailOptions);
      return { success: true, message: 'OTP sent to email' };
    } catch (error) {
      console.error('Email OTP Error:', error);
      return { success: false, message: 'Failed to send email OTP' };
    }
  }

  async sendSMSOTP(phoneNumber, otp, userName) {
    try {
      const formattedPhone = phoneNumber.startsWith('+') 
        ? phoneNumber 
        : `+254${phoneNumber.replace(/^0/, '')}`;

      await this.twilioClient.messages.create({
        body: `Hi ${userName}, your AgriNova verification code is: ${otp}. Valid for 10 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: formattedPhone
      });

      return { success: true, message: 'OTP sent to phone' };
    } catch (error) {
      console.error('SMS OTP Error:', error);
      return { success: false, message: 'Failed to send SMS OTP' };
    }
  }

  async sendOTP(user, preferredMethod = 'email') {
    const otp = this.generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = {
      code: otp,
      expiresAt: expiresAt,
      type: preferredMethod
    };
    await user.save();

    console.log(`\n🔐 OTP Generated for ${user.email}:`);
    console.log(`   Code: ${otp}`);
    console.log(`   Method: ${preferredMethod}`);
    console.log(`   Expires: ${expiresAt.toLocaleTimeString()}\n`);

    if (preferredMethod === 'sms') {
      return await this.sendSMSOTP(user.phoneNumber, otp, user.fullName);
    } else {
      return await this.sendEmailOTP(user.email, otp, user.fullName);
    }
  }

  verifyOTP(user, otpCode) {
    if (!user.otp || !user.otp.code) {
      return { valid: false, message: 'No OTP found' };
    }

    if (new Date() > user.otp.expiresAt) {
      return { valid: false, message: 'OTP has expired' };
    }

    if (user.otp.code !== otpCode) {
      return { valid: false, message: 'Invalid OTP' };
    }

    return { valid: true, message: 'OTP verified successfully' };
  }
}

module.exports = new OTPService();
