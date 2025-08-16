#!/bin/bash

# Production deployment script for Quiz Sell Genius

echo "🚀 Starting production deployment..."

# Set environment variable
export NODE_ENV=production

# Build the application
echo "📦 Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Start the production server
echo "🌐 Starting production server..."
npm run start