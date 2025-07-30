#!/bin/bash
# Production Deployment Script for Graveyard Jokes
# Run this on your AWS EC2 instance

set -e

# Configuration
SSR_PORT=13714
PROJECT_NAME="graveyardjokes"
DEPLOY_PATH="/var/www/graveyardjokes"
PHP_VERSION="8.3"

echo "🚀 Starting production deployment for $PROJECT_NAME"
echo "===================================================="

# Navigate to project directory
cd "$DEPLOY_PATH"

# Pull latest code from Git
echo "📦 Pulling latest code from Git..."
git pull origin main

# Install/Update PHP dependencies (production mode)
echo "🐘 Installing PHP dependencies..."
composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# Install/Update Node dependencies
echo "📦 Installing Node dependencies..."
npm ci --production=false

# Build frontend assets with SSR
echo "🎨 Building frontend assets and SSR bundle..."
npm run build:ssr

# Run database migrations
echo "🗄️ Running database migrations..."
php artisan migrate --force

# Clear and cache config
echo "⚡ Optimizing Laravel..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Set permissions
echo "🔒 Setting permissions..."
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Restart PHP-FPM
echo "🔄 Restarting PHP-FPM..."
sudo systemctl reload php${PHP_VERSION}-fpm

# Manage SSR process with PM2
echo "🌟 Managing SSR server with PM2..."
if pm2 list | grep -q "$PROJECT_NAME-ssr"; then
    pm2 restart $PROJECT_NAME-ssr
else
    pm2 start bootstrap/ssr/ssr.js --name "$PROJECT_NAME-ssr" -- --port=$SSR_PORT
    pm2 save
fi

# Restart queue workers if configured
if grep -q "QUEUE_CONNECTION=redis\|***REMOVED***" .env; then
    echo "🔄 Restarting queue workers..."
    php artisan queue:restart
fi

echo ""
echo "✅ Production deployment completed successfully!"
echo "🌐 Site: https://graveyardjokes.com"
echo "🔧 SSR running on port: $SSR_PORT"
