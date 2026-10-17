#!/bin/bash
# QUICK START SCRIPT - ApexServices

echo "=================================================="
echo "ApexServices - On-Demand Service Booking System"
echo "=================================================="
echo ""

# Check Node.js
echo "✓ Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "✗ Node.js is not installed!"
    echo "  Download from: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version)
echo "  Found: $NODE_VERSION"
echo ""

# Check npm
echo "✓ Checking npm installation..."
if ! command -v npm &> /dev/null; then
    echo "✗ npm is not installed!"
    exit 1
fi

NPM_VERSION=$(npm --version)
echo "  Found: $NPM_VERSION"
echo ""

# Install dependencies
echo "✓ Installing dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo "  Dependencies installed successfully!"
else
    echo "✗ Failed to install dependencies"
    exit 1
fi
echo ""

# Seed database
echo "✓ Initializing database with seed data..."
npm run seed
if [ $? -eq 0 ]; then
    echo "  Database initialized successfully!"
else
    echo "✗ Failed to initialize database"
    exit 1
fi
echo ""

# Start server
echo "✓ Starting server..."
echo ""
echo "=================================================="
echo "🚀 Server is running!"
echo "📍 Open your browser: http://localhost:3000"
echo ""
echo "Test Accounts:"
echo "  Admin: admin@services.com / admin123"
echo "  Customer: alice@example.com / alice123"
echo "  Provider: john@plumbing.com / john123"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=================================================="
echo ""

npm start
