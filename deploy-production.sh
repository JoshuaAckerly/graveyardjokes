#!/bin/bash
# Production Deployment Script for Graveyard Jokes
# Run this on your AWS EC2 instance

set -e
export PATH="$HOME/.npm-global/bin:$PATH"

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
git fetch origin main
git reset --hard origin/main

# Install/Update PHP dependencies (production mode)
echo "🐘 Installing PHP dependencies..."
composer install --no-interaction --prefer-dist --no-progress --optimize-autoloader --classmap-authoritative --no-dev

# Install/Update Node dependencies
echo "📦 Installing Node dependencies..."
npm ci --production=false

# Build frontend assets with SSR
echo "🎨 Building frontend assets and SSR bundle..."
npm run build:ssr

# Run database migrations
echo "🗄️ Running database migrations..."
php artisan migrate --force

# Refresh SEO metadata (schema, OG tags) via seeder
echo "🔍 Refreshing page SEO data..."
php artisan db:seed --class=PageSeoSeeder --force

# Ensure writable directories and permissions
echo "🔒 Setting permissions..."
sudo mkdir -p storage/framework/{cache,sessions,views} bootstrap/cache
sudo chown -R www-data:www-data storage bootstrap/cache
sudo find storage bootstrap/cache -type d -exec chmod 775 {} \;
sudo find storage bootstrap/cache -type f -exec chmod 664 {} \;

# Ensure public storage symlink exists
echo "🔗 Ensuring storage symlink..."
sudo -u www-data php artisan storage:link --force 2>/dev/null || true

# Cache Laravel artifacts as the web server user
echo "⚡ Optimizing Laravel..."
sudo -u www-data php artisan config:cache
sudo -u www-data php artisan route:cache
sudo -u www-data php artisan view:cache
sudo -u www-data php artisan event:cache

# Restart PHP-FPM
echo "🔄 Restarting PHP-FPM..."
sudo systemctl reload php${PHP_VERSION}-fpm

# Manage SSR process with PM2
echo "🌟 Managing SSR server with PM2..."
if pm2 list | grep -q "$PROJECT_NAME-ssr"; then
    pm2 restart "$PROJECT_NAME-ssr" --update-env || {
        pm2 delete "$PROJECT_NAME-ssr" >/dev/null 2>&1 || true
        pm2 start bootstrap/ssr/ssr.js --name "$PROJECT_NAME-ssr" -- --port=$SSR_PORT
    }
else
    pm2 start bootstrap/ssr/ssr.js --name "$PROJECT_NAME-ssr" -- --port=$SSR_PORT
fi
pm2 save

# Restart queue workers if configured
if grep -q "QUEUE_CONNECTION=redis\|QUEUE_CONNECTION=database" .env; then
    echo "🔄 Restarting queue workers..."
    php artisan queue:restart
    pm2 restart "$PROJECT_NAME-queue" --update-env 2>/dev/null || true
fi

echo ""
echo "✅ Production deployment completed successfully!"
echo "🌐 Site: https://graveyardjokes.com"
echo "🔧 SSR running on port: $SSR_PORT"

# Install Laravel scheduler cron for www-data (idempotent)
echo ""
echo "⏰ Installing Laravel scheduler cron for www-data..."
CRON_CMD="/usr/bin/php${PHP_VERSION} ${DEPLOY_PATH}/artisan schedule:run >> /var/log/graveyardjokes-scheduler.log 2>&1"
CRON_ENTRY="* * * * * ${CRON_CMD}"
# Create log file if it doesn't exist
sudo touch /var/log/graveyardjokes-scheduler.log
sudo chown www-data:www-data /var/log/graveyardjokes-scheduler.log
# Add cron entry only if not already present
sudo crontab -u www-data -l 2>/dev/null | grep -qF "$CRON_CMD" || \
    (sudo crontab -u www-data -l 2>/dev/null; echo "$CRON_ENTRY") | sudo crontab -u www-data -
echo "✅ Cron installed: ${CRON_ENTRY}"
