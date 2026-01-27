#!/bin/bash
# Test Server Deployment Script for Graveyard Jokes
# This script deploys to your Ubuntu test VM

set -e

# Configuration
SSR_PORT=13714
PROJECT_NAME="graveyardjokes"
DEPLOY_PATH="/var/www/graveyardjokes"
PHP_VERSION="8.3"

echo "🚀 Starting deployment for $PROJECT_NAME"
echo "=================================="

# Navigate to project directory
cd "$DEPLOY_PATH"

# Pull latest code from Git
echo "📦 Pulling latest code from Git..."
git pull origin testing

# Install/Update PHP dependencies
echo "🐘 Installing PHP dependencies..."
composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# Install/Update Node dependencies
echo "📦 Installing Node dependencies..."
npm ci

# Build frontend assets with SSR
echo "🎨 Building frontend assets and SSR bundle..."
npm run build:ssr

# Stop existing SSR process
echo "🛑 Stopping existing SSR process..."
lsof -ti:$SSR_PORT | xargs kill -TERM 2>/dev/null || true
sleep 2
lsof -ti:$SSR_PORT | xargs kill -9 2>/dev/null || true

# Update environment configuration
if ! grep -q "INERTIA_SSR_PORT=$SSR_PORT" .env; then
    echo "⚙️ Adding SSR port to .env..."
    echo "INERTIA_SSR_PORT=$SSR_PORT" >> .env
fi

if ! grep -q "INERTIA_SSR_ENABLED=true" .env; then
    echo "⚙️ Enabling SSR in .env..."
    echo "INERTIA_SSR_ENABLED=true" >> .env
fi

# Run database migrations
echo "🗄️ Running database migrations..."
php artisan migrate --force

# Clear and rebuild caches
echo "🧹 Clearing and rebuilding caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

echo "⚡ Optimizing application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Generate sitemap
echo "🗺️ Generating sitemap..."
php artisan app:generate-sitemap --url=https://graveyardjokes.com || true

# Fix permissions
echo "🔐 Setting permissions..."
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

# Restart queue workers if supervisor is configured
if command -v supervisorctl &> /dev/null; then
    echo "🔄 Restarting queue workers..."
    sudo supervisorctl restart graveyardjokes-worker:* 2>/dev/null || echo "No queue workers configured yet"
fi

# Start SSR server in background
echo "🌟 Starting SSR server on port $SSR_PORT..."
nohup node bootstrap/ssr/ssr.mjs > storage/logs/ssr.log 2>&1 &
SSR_PID=$!
echo "SSR server started with PID: $SSR_PID"

# Restart PHP-FPM
echo "🔄 Restarting PHP-FPM..."
sudo systemctl restart php$PHP_VERSION-fpm

echo ""
echo "✅ Deployment completed successfully!"
echo "=================================="
echo "🌐 Your site should now be live"
echo "📊 Check SSR logs: tail -f $DEPLOY_PATH/storage/logs/ssr.log"
echo ""
