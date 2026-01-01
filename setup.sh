#!/bin/bash

echo "🌾 AgriNova Setup Script 🌾"
echo "=============================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js found:${NC} $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm found:${NC} $(npm --version)"

# Check if MongoDB is running
if command -v mongod &> /dev/null; then
    echo -e "${GREEN}✅ MongoDB installed${NC}"
else
    echo -e "${YELLOW}⚠️  MongoDB not found locally${NC}"
    echo "   You can use MongoDB Atlas (cloud): https://cloud.mongodb.com"
fi

echo ""
echo "📦 Installing Backend Dependencies..."
cd backend
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${RED}❌ Backend installation failed${NC}"
    exit 1
fi

echo ""
echo "�� Installing Frontend Dependencies..."
cd ..
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${RED}❌ Frontend installation failed${NC}"
    exit 1
fi

echo ""
echo "⚙️  Setting up environment..."
cd backend

if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ Created backend/.env file${NC}"
    echo -e "${YELLOW}⚠️  Please edit backend/.env with your credentials${NC}"
else
    echo -e "${YELLOW}⚠️  backend/.env already exists${NC}"
fi

cd ..

if [ ! -f .env ]; then
    echo "VITE_API_URL=http://localhost:3000/api" > .env
    echo -e "${GREEN}✅ Created frontend .env file${NC}"
else
    echo -e "${YELLOW}⚠️  frontend .env already exists${NC}"
fi

echo ""
echo "=============================="
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo "=============================="
echo ""
echo "Next Steps:"
echo ""
echo "1. Configure backend/.env with your credentials:"
echo "   - MongoDB URI"
echo "   - JWT Secret"
echo "   - Email settings (for OTP)"
echo "   - SMS settings (optional)"
echo ""
echo "2. Start MongoDB:"
echo "   mongod"
echo ""
echo "3. Start Backend (in backend directory):"
echo "   cd backend && npm run dev"
echo ""
echo "4. Start Frontend (in new terminal):"
echo "   npm run dev"
echo ""
echo "5. Visit: http://localhost:5173"
echo ""
echo "📚 Read QUICK_START.md for detailed instructions"
echo "📖 Check AGRINOVA_DOCUMENTATION.md for full guide"
echo ""
echo "Happy farming! 🌾"
