# AgriNova - AI-Powered Agricultural Platform 🌾

## Overview

AgriNova is a comprehensive, AI-powered agricultural platform designed specifically for Kenya's farmers, buyers, and agricultural input sellers. It bridges the digital divide by providing offline AI capabilities, OTP-secured authentication, blockchain-verified transactions, and role-based features tailored to each user type.

## 🚀 Key Features

### 🔐 Enhanced Security
- **Two-Factor Authentication (2FA)** via OTP sent to Email or SMS
- **Blockchain Security** for all financial transactions
- **JWT Token Authentication** with secure session management
- **Password Hashing** with bcrypt
- **Unique Blockchain Addresses** for each user

### 👥 Role-Based Access Control

#### 👨‍🌾 For Farmers
- **AI Disease Detection**: Scan crops and livestock for diseases using offline TensorFlow Lite models
- **Image Classification**: Automatically differentiates between crops, animals, and invalid images
- **Treatment Recommendations**: Get instant remedies, dosages, and timing
- **Financial Management**: Track farm income, expenses, and generate reports
- **Marketplace Access**: Sell produce and buy inputs
- **AI Chatbot**: Ask farming questions and get expert advice

#### 🛒 For Buyers
- **Product Marketplace**: Browse and purchase agricultural products
- **Direct Contact**: Connect with farmers without middlemen
- **Financial Tracking**: Monitor purchases and expenses
- **AI Assistant**: Get advice on product quality, prices, and sourcing

#### 🏪 For Sellers (Input Suppliers)
- **Product Management**: List fertilizers, seeds, pesticides, equipment
- **Service Offerings**: Advertise tractor hire and agricultural services
- **Inventory Tracking**: Monitor stock and sales
- **Customer Management**: Build relationships with buyers
- **Financial Dashboard**: Track sales and revenue

### 💰 Financial Management
- **Bank Transaction Integration**: Record all financial activities
- **M-Pesa Integration**: Track mobile money payments
- **Blockchain Verification**: All transactions recorded on blockchain
- **Automated Reports**: Generate financial statements for bank loans
- **Multi-Category Tracking**: Seeds, fertilizers, labor, equipment, sales
- **Profit/Loss Analysis**: Real-time financial insights

### 🤖 AI-Powered Features
- **Offline Disease Detection**: Works without internet using TensorFlow Lite
- **Image Validation**: Only scans valid crop/animal images
- **Smart Recommendations**: Context-aware treatment suggestions
- **Intelligent Chatbot**: Answers any question (not limited to farming)
- **Financial Insights**: AI-powered expense optimization

### 📱 Accessibility
- **Web Application**: Full-featured responsive web app
- **USSD Support**: Feature phone access via *123# shortcodes
- **SMS Notifications**: Critical updates via text message
- **Offline Capabilities**: Core features work without internet
- **Multi-Language Support**: (Coming soon)

## 🏗️ Technology Stack

### Backend
- **Node.js + Express**: RESTful API server
- **MongoDB + Mongoose**: Database with flexible schemas
- **JWT**: Secure authentication tokens
- **Bcrypt**: Password hashing
- **Ethers.js**: Blockchain integration
- **Nodemailer**: Email OTP delivery
- **Twilio**: SMS OTP delivery
- **Multer**: File upload handling
- **Axios**: HTTP client

### Frontend
- **React 18**: Modern UI framework
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool
- **TailwindCSS**: Utility-first styling
- **Shadcn/ui**: Beautiful component library
- **React Query**: Data fetching and caching
- **React Router**: Client-side routing
- **Axios**: API communication

### Security & Blockchain
- **Blockchain**: Ethereum-compatible transaction verification
- **Crypto**: SHA-256 hashing for transaction records
- **OTP**: Time-based one-time passwords (10-minute expiry)
- **CORS**: Cross-origin security
- **Environment Variables**: Secure configuration

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
# Server
PORT=3000
MONGODB_URI=mongodb://localhost:27017/agrinova
JWT_SECRET=your-super-secret-key

# Email OTP (Gmail example)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# SMS OTP (Twilio)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890

# M-Pesa
MPESA_CONSUMER_KEY=your-mpesa-key
MPESA_CONSUMER_SECRET=your-mpesa-secret

# Blockchain (Optional)
BLOCKCHAIN_PROVIDER_URL=your-blockchain-rpc-url
BLOCKCHAIN_PRIVATE_KEY=your-private-key

# AI (Optional - for advanced chatbot)
AI_API_KEY=your-openai-api-key
```

4. **Start MongoDB**
```bash
mongod
```

5. **Run the server**
```bash
npm run dev  # Development
npm start    # Production
```

### Frontend Setup

1. **Navigate to project root**
```bash
cd ..
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
Create `.env` file:
```env
VITE_API_URL=http://localhost:3000/api
```

4. **Run the application**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
```

## 🎯 Usage Guide

### User Registration

1. **Visit** `/auth/new`
2. **Select User Type**: Farmer, Buyer, or Seller
3. **Fill in Details**: Name, email, phone, password
4. **Choose OTP Method**: Email or SMS
5. **Verify OTP**: Enter 6-digit code
6. **Access Dashboard**: Start using features

### For Farmers

#### Disease Detection
1. Navigate to **Disease Scanner** tab
2. Select scan type (Crop or Livestock)
3. Upload clear image
4. Wait for AI analysis
5. View diagnosis, confidence, severity
6. Follow treatment recommendations

#### Financial Tracking
1. Go to **Finance** tab
2. Click **Add Transaction**
3. Select type (Income/Expense)
4. Enter amount and details
5. Transaction recorded with blockchain hash
6. View reports and analytics

### For Buyers

#### Shopping
1. Open **Marketplace** tab
2. Search for products
3. Filter by category
4. View seller details
5. Contact seller directly
6. Track purchases in Finance

### For Sellers

#### List Products
1. Go to **My Products**
2. Click **Add Product**
3. Upload images
4. Set price and quantity
5. Add description
6. Publish to marketplace

### AI Assistant

1. Click **AI Assistant** tab
2. Type any question
3. Get instant responses
4. Ask about:
   - Farming techniques
   - Disease treatment
   - Market prices
   - Financial advice
   - Weather patterns
   - And much more!

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/register          - Register new user
POST /api/auth/verify-otp        - Verify OTP code
POST /api/auth/resend-otp        - Resend OTP
POST /api/auth/login             - Login user
POST /api/auth/verify-login-otp  - Verify login OTP
```

### Profile
```
GET  /api/profile               - Get user profile
PUT  /api/profile               - Update profile
```

### Image Scanning
```
POST /api/scan-image            - Scan image for diseases
GET  /api/scan-history          - Get scan history
```

### Transactions
```
POST /api/transactions          - Record transaction
GET  /api/transactions          - Get all transactions
GET  /api/financial-report      - Generate financial report
```

### Marketplace
```
POST /api/products              - Create product listing
GET  /api/products              - Get all products
GET  /api/my-products           - Get seller's products
```

### AI Chatbot
```
POST /api/chatbot               - Chat with AI assistant
```

## 🔒 Security Features

### OTP Authentication
- 6-digit codes
- 10-minute expiration
- Email and SMS delivery
- Rate limiting (coming soon)

### Blockchain Verification
- SHA-256 transaction hashing
- Ethereum signature verification
- Immutable transaction records
- Fraud prevention

### Data Protection
- Password hashing with bcrypt
- JWT token expiration
- Secure HTTP headers
- Input validation and sanitization

## 📱 Mobile & USSD

### Feature Phone Access (USSD)
Dial `*123#` to:
- Report symptoms
- Check market prices
- Record expenses
- Get recommendations
- Receive SMS results

### SMS Notifications
- Disease detection results
- Payment confirmations
- Low stock alerts
- Market price updates

## 🌍 Deployment

### Backend (Node.js)
- **Heroku**: `git push heroku main`
- **DigitalOcean**: Use App Platform or Droplets
- **AWS**: Elastic Beanstalk or EC2
- **Railway**: Connect GitHub repo

### Frontend (React)
- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy`
- **GitHub Pages**: `npm run build` + push to gh-pages

### Database
- **MongoDB Atlas**: Free cloud hosting
- **mLab**: Managed MongoDB
- **Self-hosted**: VPS with MongoDB

## 🤝 Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📄 License

MIT License - See LICENSE file for details

## 👨‍💻 Authors

Built with ❤️ for Kenyan farmers

## 🆘 Support

For issues and questions:
- Email: support@agrinova.ke
- WhatsApp: +254 XXX XXX XXX
- GitHub Issues: [Create Issue](https://github.com/yourusername/agrinova/issues)

## 🎉 Acknowledgments

- TensorFlow team for offline AI models
- Kenyan Ministry of Agriculture
- Africa's Talking for USSD infrastructure
- Safaricom M-Pesa API
- Open source community

---

**AgriNova** - Transforming Kenyan Agriculture Through Technology 🌾
