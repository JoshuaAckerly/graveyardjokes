#!/bin/bash
# Initial Server Setup Script for Ubuntu Test VM
# Run this ONCE on your fresh Ubuntu server VM

set -e

echo "🔧 Setting up Ubuntu Test Server for Graveyard Jokes"
echo "======================================================"

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Add PHP repository
echo "➕ Adding PHP 8.3 repository..."
sudo apt install -y software-properties-common
sudo add-apt-repository -y ppa:ondrej/php
sudo apt update

# Install required packages
echo "📥 Installing required packages..."
sudo apt install -y \
    nginx \
    mysql-server \
    redis-server \
    supervisor \
    php8.3-cli \
    php8.3-fpm \
    php8.3-mysql \
    php8.3-redis \
    php8.3-mbstring \
    php8.3-xml \
    php8.3-curl \
    php8.3-zip \
    php8.3-gd \
    php8.3-bcmath \
    git \
    curl \
    unzip

# Install Composer
echo "🎵 Installing Composer..."
if ! command -v composer &> /dev/null; then
    curl -sS https://getcomposer.org/installer | php
    sudo mv composer.phar /usr/local/bin/composer
    echo "✅ Composer installed"
else
    echo "✅ Composer already installed"
fi

# Install Node.js 22
echo "📗 Installing Node.js 22..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt install -y nodejs
    echo "✅ Node.js $(node --version) installed"
else
    echo "✅ Node.js already installed: $(node --version)"
fi

# Create database
echo "🗄️ Setting up MySQL database..."
sudo mysql -e "CREATE DATABASE IF NOT EXISTS graveyardjokes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'graveyardjokes'@'localhost' IDENTIFIED BY 'test123password';"
sudo mysql -e "GRANT ALL PRIVILEGES ON graveyardjokes.* TO 'graveyardjokes'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"
echo "✅ Database created: graveyardjokes"
echo "   Username: graveyardjokes"
echo "   Password: test123password"

# Clone repository
echo "📦 Cloning repository..."
if [ ! -d "/var/www/graveyardjokes" ]; then
    cd /var/www
    sudo git clone https://github.com/YOUR_USERNAME/graveyardjokes.git
    sudo chown -R $USER:www-data graveyardjokes
    echo "✅ Repository cloned"
else
    echo "⚠️  Repository already exists at /var/www/graveyardjokes"
fi

cd /var/www/graveyardjokes

# Set up environment file
echo "⚙️ Setting up environment file..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    
    # Update .env with test configuration
    sed -i 's/***REMOVED***/APP_ENV=staging/' .env
    sed -i 's/***REMOVED***/***REMOVED***/' .env
    sed -i 's/APP_URL=http:\/\/localhost/APP_URL=http:\/\/YOUR_VM_IP/' .env
    sed -i 's/DB_CONNECTION=sqlite/***REMOVED***/' .env
    sed -i 's/# ***REMOVED***/***REMOVED***/' .env
    sed -i 's/# ***REMOVED***/***REMOVED***/' .env
    sed -i 's/# DB_DATABASE=laravel/DB_DATABASE=graveyardjokes/' .env
    sed -i 's/# DB_USERNAME=root/***REMOVED***/' .env
    sed -i 's/# DB_PASSWORD=/DB_PASSWORD=test123password/' .env
    
    echo "✅ .env file created and configured"
else
    echo "⚠️  .env file already exists"
fi

# Install dependencies
echo "🐘 Installing PHP dependencies..."
composer install

echo "📦 Installing Node dependencies..."
npm ci

# Generate application key
echo "🔑 Generating application key..."
php artisan key:generate

# Run migrations
echo "🗄️ Running database migrations..."
php artisan migrate --force

# Build assets
echo "🎨 Building frontend assets..."
npm run build:ssr

# Set permissions
echo "🔐 Setting permissions..."
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

# Configure Nginx
echo "🌐 Configuring Nginx..."
sudo tee /etc/nginx/sites-available/graveyardjokes > /dev/null <<'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name _;  # Accept any hostname
    root /var/www/graveyardjokes/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;
    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/graveyardjokes /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
echo "🔄 Testing and restarting Nginx..."
sudo nginx -t
sudo systemctl restart nginx

# Configure Supervisor for queue workers
echo "👷 Configuring Supervisor for queue workers..."
sudo tee /etc/supervisor/conf.d/graveyardjokes-worker.conf > /dev/null <<EOF
[program:graveyardjokes-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/graveyardjokes/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=1
redirect_stderr=true
stdout_logfile=/var/www/graveyardjokes/storage/logs/worker.log
stopwaitsecs=3600
EOF

sudo supervisorctl reread
sudo supervisorctl update

# Start SSR server
echo "🌟 Starting SSR server..."
cd /var/www/graveyardjokes
nohup node bootstrap/ssr/ssr.mjs > storage/logs/ssr.log 2>&1 &

echo ""
echo "✅ Setup completed successfully!"
echo "======================================================"
echo "🌐 Your test server is ready!"
echo ""
echo "📝 Important Information:"
echo "   - Project location: /var/www/graveyardjokes"
echo "   - Database: graveyardjokes"
echo "   - DB User: graveyardjokes"
echo "   - DB Password: test123password"
echo "   - Access your site: http://YOUR_VM_IP"
echo ""
echo "📋 Next Steps:"
echo "   1. Update .env with your actual settings"
echo "   2. Visit http://YOUR_VM_IP to test your site"
echo "   3. Use ./deploy-test.sh for future deployments"
echo ""
echo "🔍 Useful Commands:"
echo "   - Check Nginx status: sudo systemctl status nginx"
echo "   - Check PHP-FPM status: sudo systemctl status php8.3-fpm"
echo "   - Check logs: tail -f /var/www/graveyardjokes/storage/logs/laravel.log"
echo "   - Check SSR logs: tail -f /var/www/graveyardjokes/storage/logs/ssr.log"
echo ""
