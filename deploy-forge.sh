#!/bin/bash
# Laravel Forge Deployment Script for graveyardjokes.com
# Copy this content to your Forge site deployment script

set -e

SSR_PORT=13714
PROJECT_NAME="graveyardjokes"

echo "🚀 Starting deployment for $PROJECT_NAME with SSR on port $SSR_PORT"

cd /home/forge/graveyardjokes.com

# Stop existing SSR process
echo "🛑 Stopping existing SSR process..."
lsof -ti:$SSR_PORT | xargs kill -TERM 2>/dev/null || true
sleep 2
lsof -ti:$SSR_PORT | xargs kill -9 2>/dev/null || true

# Update Git repository
echo "📦 Pulling latest code..."
git pull origin $FORGE_SITE_BRANCH

# Update PHP dependencies
echo "🐘 Installing PHP dependencies..."
$FORGE_COMPOSER install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# Update Node dependencies and build
echo "📦 Installing Node dependencies..."
npm ci

# Build frontend assets with SSR
echo "🎨 Building frontend assets and SSR bundle..."
npm run build:ssr

# Update environment configuration
if ! grep -q "INERTIA_SSR_PORT=$SSR_PORT" .env; then
    echo "⚙️ Adding SSR port to .env..."
    echo "INERTIA_SSR_PORT=$SSR_PORT" >> .env
fi

if ! grep -q "INERTIA_SSR_ENABLED=true" .env; then
    echo "⚙️ Enabling SSR in .env..."
    echo "INERTIA_SSR_ENABLED=true" >> .env
fi

# Laravel optimizations
echo "🔧 Optimizing Laravel..."
if [ -f artisan ]; then
    php artisan migrate --force
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
fi

# Create SSR log directory
mkdir -p storage/logs

# Start SSR process
echo "🚀 Starting SSR process on port $SSR_PORT..."
nohup node bootstrap/ssr/ssr.js > storage/logs/ssr.log 2>&1 &
SSR_PID=$!

# Wait and verify SSR is running
sleep 3
if kill -0 $SSR_PID 2>/dev/null; then
    echo "✅ SSR started successfully (PID: $SSR_PID)"
    if curl -s "http://127.0.0.1:$SSR_PORT" > /dev/null; then
        echo "✅ SSR endpoint responding"
    else
        echo "⚠️ SSR endpoint not responding, check logs"
    fi
else
    echo "❌ Failed to start SSR process"
    exit 1
fi

# Reload PHP-FPM
if [[ -f /home/forge/.forge/forge-php-version ]]; then
    PHP_VERSION=$(cat /home/forge/.forge/forge-php-version)
    sudo -S service php${PHP_VERSION}-fpm reload
fi

echo "🎉 Deployment completed successfully!"