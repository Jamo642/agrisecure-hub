# AgriNova - Quick Start Guide 🚀

## 5-Minute Setup

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in another terminal)
cd ..
npm install
```

### 2. Setup MongoDB

```bash
# Start MongoDB (if installed locally)
mongod

# OR use MongoDB Atlas (cloud)
# Get connection string from https://cloud.mongodb.com
```

### 3. Configure Backend

```bash
cd backend
cp .env.example .env
```

**Minimum required in `.env`:**
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/agrinova
JWT_SECRET=my-super-secret-key-change-in-production
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
```

**To get Gmail App Password:**
1. Go to Google Account Settings
2. Security → 2-Step Verification → App Passwords
3. Generate password for "Mail"
4. Copy to `EMAIL_PASSWORD`

### 4. Start Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
MongoDB connected
Blockchain service running in simulation mode
AgriNova Server running on http://localhost:3000
```

### 5. Start Frontend

```bash
# In project root
npm run dev
```

Visit: `http://localhost:5173`

### 6. Test the Application

1. **Register a new account:**
   - Go to `/auth/new`
   - Select "Farmer"
   - Enter details
   - Choose OTP method (Email recommended for testing)
   - Check your email for 6-digit code
   - Enter OTP to verify

2. **Explore Dashboard:**
   - View your personalized dashboard
   - Try the AI Disease Scanner (upload any image)
   - Record a transaction in Finance tab
   - Ask the AI chatbot a question
   - Browse the marketplace

## Testing Without Email/SMS

If you don't have email/SMS configured:

1. Check backend console for OTP codes:
```bash
# The OTP will be logged in the terminal
# Look for: "Generated OTP: 123456"
```

2. Or modify OTP service to always return success:
```javascript
// backend/services/otpService.js
async sendOTP(user, preferredMethod = 'email') {
  const otp = this.generateOTP();
  console.log(`OTP for ${user.email}: ${otp}`); // Check console
  // ... rest of code
}
```

## Common Issues

### MongoDB Connection Failed
```bash
# Install MongoDB Community Edition
# Ubuntu/Debian:
sudo apt-get install mongodb

# macOS:
brew install mongodb-community

# OR use MongoDB Atlas (free cloud database)
```

### Port Already in Use
```bash
# Backend
PORT=3001 npm run dev

# Frontend - edit vite.config.ts
server: { port: 5174 }
```

### OTP Not Received
1. Check spam folder
2. Verify EMAIL_USER and EMAIL_PASSWORD
3. Check backend console for OTP code
4. Try SMS method (requires Twilio setup)

## Production Deployment

### Backend (Heroku)
```bash
cd backend
heroku create agrinova-api
heroku addons:create mongolab
git push heroku main
```

### Frontend (Vercel)
```bash
npm run build
vercel deploy
```

## Next Steps

- [ ] Configure Twilio for SMS OTP
- [ ] Setup M-Pesa for payments
- [ ] Train TensorFlow models for disease detection
- [ ] Add more product categories
- [ ] Implement USSD gateway
- [ ] Deploy to production

## Support

Need help? Check:
- `AGRINOVA_DOCUMENTATION.md` for detailed docs
- GitHub Issues
- Email: support@agrinova.ke

Happy farming! 🌾
