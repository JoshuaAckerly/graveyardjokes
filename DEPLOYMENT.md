# Deployment Guide

This guide covers deploying the Graveyard Jokes application to production environments, with specific focus on Laravel Forge deployment.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Server Requirements](#server-requirements)
- [Laravel Forge Deployment](#laravel-forge-deployment)
- [Manual Deployment](#manual-deployment)
- [Server Configuration](#server-configuration)
- [Environment Configuration](#environment-configuration)
- [SSL/HTTPS Setup](#sslhttps-setup)
- [Post-Deployment](#post-deployment)
- [CI/CD Integration](#cicd-integration)
- [Zero-Downtime Deployment](#zero-downtime-deployment)
- [Rollback Procedures](#rollback-procedures)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

## ✅ Prerequisites

Before deploying, ensure you have:

- [ ] Server with root or sudo access
- [ ] Domain name configured
- [ ] SSL certificate (Let's Encrypt recommended)
- [ ] Database server (MySQL 8.0+ or PostgreSQL 13+)
- [ ] Redis server (optional but recommended)
- [ ] Git repository access
- [ ] Deployment credentials configured

## 🖥️ Server Requirements

### Minimum Requirements

- **OS**: Ubuntu 20.04 LTS or later (recommended)
- **PHP**: 8.3+ (8.4 recommended)
- **Memory**: 1GB RAM minimum (2GB+ recommended)
- **Storage**: 10GB minimum
- **CPU**: 1 core minimum (2+ recommended)

### Required PHP Extensions

```bash
sudo apt-get install -y \
    php8.4-cli \
    php8.4-fpm \
    php8.4-mysql \
    php8.4-pgsql \
    php8.4-mbstring \
    php8.4-xml \
    php8.4-curl \
    php8.4-zip \
    php8.4-gd \
    php8.4-bcmath \
    php8.4-redis
```

### Required Software

```bash
# Nginx or Apache
sudo apt-get install nginx

# MySQL
sudo apt-get install mysql-server

# Redis (optional but recommended)
sudo apt-get install redis-server

# Supervisor (for queue workers)
sudo apt-get install supervisor

# Node.js (for building assets)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

## 🚀 Laravel Forge Deployment

Laravel Forge provides simplified deployment for Laravel applications.

### 1. Create Server on Forge

1. Log in to [Laravel Forge](https://forge.laravel.com)
2. Click "Create Server"
3. Choose provider (DigitalOcean, AWS, Linode, etc.)
4. Select server size (minimum 1GB RAM)
5. Choose PHP version (8.4)
6. Enable database (MySQL/PostgreSQL)
7. Enable Redis (recommended)
8. Create server

### 2. Create Site

1. Go to your server in Forge
2. Click "New Site"
3. Enter domain: `graveyardjokes.com`
4. Select project type: "General PHP / Laravel"
5. Create site

### 3. Configure Git Repository

1. Go to site settings
2. Click "Git Repository"
3. Select provider: GitHub
4. Enter repository: `JoshuaAckerly/graveyardjokes`
5. Branch: `main`
6. Click "Install Repository"

### 4. Set Environment Variables

1. Go to "Environment"
2. Update `.env` values:

```env
APP_NAME="Graveyard Jokes"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://graveyardjokes.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=forge
DB_USERNAME=forge
DB_PASSWORD=your_database_password

CACHE_STORE=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=your_smtp_host
MAIL_PORT=587
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@graveyardjokes.com"
MAIL_FROM_NAME="${APP_NAME}"

TRACK_VISITOR_EMAIL_TTL=86400
```

3. Click "Save"

### 5. Configure Deployment Script

The project includes a `deploy-forge.sh` script. Update Forge's deployment script:

```bash
cd /home/forge/graveyardjokes.com

git pull origin main

$FORGE_COMPOSER install --no-interaction --prefer-dist --optimize-autoloader --no-dev

( flock -w 10 9 || exit 1
    echo 'Restarting FPM...'; sudo -S service php8.4-fpm reload ) 9>/tmp/fpmlock

if [ -f artisan ]; then
    $FORGE_PHP artisan migrate --force
    $FORGE_PHP artisan config:cache
    $FORGE_PHP artisan route:cache
    $FORGE_PHP artisan view:cache
    $FORGE_PHP artisan sitemap:generate
fi

# Build frontend assets
npm ci
npm run build

# Restart queue workers
$FORGE_PHP artisan queue:restart
```

### 6. Enable Quick Deploy

1. Go to "Apps"
2. Enable "Quick Deploy"
3. Now pushes to `main` branch will auto-deploy

### 7. Configure SSL

1. Go to "SSL"
2. Select "LetsEncrypt"
3. Enter domains: `graveyardjokes.com,www.graveyardjokes.com`
4. Click "Obtain Certificate"
5. Forge will automatically configure SSL

### 8. Set Up Queue Worker

1. Go to "Daemons"
2. Click "New Daemon"
3. Configuration:
   - Command: `php artisan queue:work redis --sleep=3 --tries=3 --timeout=90`
   - User: `forge`
   - Directory: `/home/forge/graveyardjokes.com`
4. Click "Create Daemon"

### 9. Configure Scheduler

1. Go to "Scheduler"
2. Verify cron entry exists:
   ```
   * * * * * php /home/forge/graveyardjokes.com/artisan schedule:run >> /dev/null 2>&1
   ```

### 10. Deploy!

1. Click "Deploy Now"
2. Monitor deployment log
3. Visit your site at `https://graveyardjokes.com`

## 🔧 Manual Deployment

If not using Forge, follow these steps:

### 1. Set Up Server

```bash
# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install required packages
sudo apt-get install -y nginx mysql-server redis-server supervisor
sudo apt-get install -y php8.4-fpm php8.4-mysql php8.4-redis php8.4-mbstring php8.4-xml php8.4-curl

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Create Database

```bash
sudo mysql
```

```sql
CREATE DATABASE graveyardjokes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'graveyardjokes'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON graveyardjokes.* TO 'graveyardjokes'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Clone Repository

```bash
cd /var/www
sudo git clone https://github.com/JoshuaAckerly/graveyardjokes.git
sudo chown -R www-data:www-data graveyardjokes
cd graveyardjokes
```

### 4. Install Dependencies

```bash
# PHP dependencies
composer install --no-dev --optimize-autoloader

# Node dependencies and build
npm ci
npm run build
```

### 5. Configure Environment

```bash
cp .env.example .env
php artisan key:generate
```

Edit `.env` with production values.

### 6. Set Permissions

```bash
sudo chown -R www-data:www-data /var/www/graveyardjokes
sudo chmod -R 755 /var/www/graveyardjokes
sudo chmod -R 775 /var/www/graveyardjokes/storage
sudo chmod -R 775 /var/www/graveyardjokes/bootstrap/cache
```

### 7. Run Migrations

```bash
php artisan migrate --force
```

### 8. Optimize Application

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan sitemap:generate
```

### 9. Configure Nginx

Create `/etc/nginx/sites-available/graveyardjokes`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name graveyardjokes.com www.graveyardjokes.com;
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
        fastcgi_pass unix:/var/run/php/php8.4-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/graveyardjokes /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 10. Configure Queue Worker

Create `/etc/supervisor/conf.d/graveyardjokes-worker.conf`:

```ini
[program:graveyardjokes-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/graveyardjokes/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/graveyardjokes/storage/logs/worker.log
stopwaitsecs=3600
```

Start worker:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start graveyardjokes-worker:*
```

### 11. Configure Scheduler

```bash
sudo crontab -e -u www-data
```

Add:

```
* * * * * cd /var/www/graveyardjokes && php artisan schedule:run >> /dev/null 2>&1
```

## 🔒 SSL/HTTPS Setup

### Using Let's Encrypt (Certbot)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d graveyardjokes.com -d www.graveyardjokes.com

# Test auto-renewal
sudo certbot renew --dry-run
```

Certbot will automatically:
- Obtain SSL certificate
- Configure Nginx
- Set up auto-renewal

## 🔐 Environment Configuration

### Production .env Settings

```env
# Application
APP_NAME="Graveyard Jokes"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://graveyardjokes.com
APP_KEY=base64:your_key_here

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=graveyardjokes
DB_USERNAME=graveyardjokes
DB_PASSWORD=secure_password

# Cache & Sessions
CACHE_STORE=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
SESSION_LIFETIME=120

# Redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Mail
MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=your_sendgrid_api_key
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@graveyardjokes.com"
MAIL_FROM_NAME="Graveyard Jokes"

# Analytics
GOOGLE_ANALYTICS_PROPERTY_ID=your_property_id

# Services
IPINFO_TOKEN=your_ipinfo_token
TRACK_VISITOR_EMAIL_TTL=86400

# Logging
LOG_CHANNEL=stack
LOG_LEVEL=error
```

### Security Checklist

- [ ] `APP_DEBUG=false`
- [ ] Strong `APP_KEY` generated
- [ ] Secure database credentials
- [ ] HTTPS enabled
- [ ] File permissions correct (755/775)
- [ ] `.env` file protected (not in git)
- [ ] Redis password set (if exposed)
- [ ] Firewall configured
- [ ] SSH key authentication only
- [ ] Regular backups enabled

## 📦 Post-Deployment

### 1. Verify Installation

```bash
# Check application status
php artisan about

# Test database connection
php artisan migrate:status

# Verify cache is working
php artisan tinker
>>> Cache::put('test', 'value', 60);
>>> Cache::get('test');

# Test queue
php artisan queue:work --once
```

### 2. Generate Sitemap

```bash
php artisan sitemap:generate
```

### 3. Warm Up Cache

```bash
# Visit key pages to warm cache
curl https://graveyardjokes.com
curl https://graveyardjokes.com/api/random-joke
```

### 4. Monitor Logs

```bash
# Application logs
tail -f storage/logs/laravel.log

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# PHP-FPM logs
sudo tail -f /var/log/php8.4-fpm.log
```

## 🔄 CI/CD Integration

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.4'
          extensions: mbstring, xml, curl, zip, bcmath, pdo_mysql, redis

      - name: Install Composer dependencies
        run: composer install --no-dev --optimize-autoloader --no-interaction

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install NPM dependencies
        run: npm ci

      - name: Build assets
        run: npm run build

      - name: Run tests
        run: |
          cp .env.example .env
          php artisan key:generate
          php artisan test

      - name: Deploy to Forge
        if: success()
        uses: jbrooksuk/laravel-forge-action@v1
        with:
          forge_token: ${{ secrets.FORGE_API_TOKEN }}
          servers: ${{ secrets.FORGE_SERVER_ID }}
          sites: ${{ secrets.FORGE_SITE_ID }}
```

### Forge API Secrets

Add to GitHub repository secrets:
- `FORGE_API_TOKEN`: Your Laravel Forge API token
- `FORGE_SERVER_ID`: Your Forge server ID
- `FORGE_SITE_ID`: Your Forge site ID

### Deployment Branches

**Production**: `main` → graveyardjokes.com
**Staging**: `staging` → staging.graveyardjokes.com

Create staging environment:

```bash
# On Forge, create new site for staging
# Configure separate deployment script
# Use staging database credentials
```

## ⚡ Zero-Downtime Deployment

### Using Envoy

Install Envoy:

```bash
composer global require laravel/envoy
```

Create `Envoy.blade.php`:

```php
@servers(['production' => 'forge@your-server.com'])

@setup
    $repository = 'git@github.com:JoshuaAckerly/graveyardjokes.git';
    $releases_dir = '/home/forge/graveyardjokes.com/releases';
    $app_dir = '/home/forge/graveyardjokes.com';
    $release = date('YmdHis');
    $new_release_dir = $releases_dir .'/'. $release;
@endsetup

@story('deploy')
    clone_repository
    run_composer
    run_npm
    update_symlinks
    migrate_database
    optimize_app
    restart_services
@endstory

@task('clone_repository')
    echo "Cloning repository"
    [ -d {{ $releases_dir }} ] || mkdir {{ $releases_dir }}
    git clone --depth 1 {{ $repository }} {{ $new_release_dir }}
    cd {{ $new_release_dir }}
    git reset --hard {{ $commit }}
@endtask

@task('run_composer')
    echo "Installing composer dependencies"
    cd {{ $new_release_dir }}
    composer install --prefer-dist --no-dev --optimize-autoloader --no-interaction
@endtask

@task('run_npm')
    echo "Building assets"
    cd {{ $new_release_dir }}
    npm ci
    npm run build
@endtask

@task('update_symlinks')
    echo "Linking storage and .env"
    ln -nfs {{ $app_dir }}/storage {{ $new_release_dir }}/storage
    ln -nfs {{ $app_dir }}/.env {{ $new_release_dir }}/.env
    ln -nfs {{ $new_release_dir }} {{ $app_dir }}/current
@endtask

@task('migrate_database')
    echo "Running migrations"
    cd {{ $new_release_dir }}
    php artisan migrate --force
@endtask

@task('optimize_app')
    echo "Optimizing application"
    cd {{ $new_release_dir }}
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
@endtask

@task('restart_services')
    echo "Restarting services"
    php artisan queue:restart
    sudo service php8.4-fpm reload
@endtask
```

Deploy with:

```bash
envoy run deploy --commit=main
```

### Blue-Green Deployment

For critical updates with instant rollback:

```bash
# Prepare blue environment (current)
cd /var/www/blue
git pull
composer install
npm run build

# Test blue environment
curl http://localhost:8001/health

# Prepare green environment (new)
cd /var/www/green
git pull
composer install
npm run build

# Switch Nginx to green
sudo ln -sf /etc/nginx/sites-available/graveyardjokes-green /etc/nginx/sites-enabled/graveyardjokes
sudo nginx -t && sudo nginx -s reload

# If issues, switch back to blue
sudo ln -sf /etc/nginx/sites-available/graveyardjokes-blue /etc/nginx/sites-enabled/graveyardjokes
sudo nginx -s reload
```

## 🔙 Rollback Procedures

### Quick Rollback (Forge)

1. Go to Forge site
2. Click "Deployment History"
3. Find last working deployment
4. Click "Deploy This Commit"

### Manual Rollback

#### Using Git

```bash
cd /var/www/graveyardjokes

# Find commit to rollback to
git log --oneline -10

# Rollback
git reset --hard <commit-hash>

# Reinstall dependencies
composer install --no-dev
npm ci && npm run build

# Run migrations down if needed
php artisan migrate:rollback --step=1

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan view:clear

# Restart services
php artisan queue:restart
sudo systemctl reload php8.4-fpm
```

#### Database Rollback

```bash
# Rollback last migration
php artisan migrate:rollback --step=1

# Rollback multiple migrations
php artisan migrate:rollback --step=3

# Rollback all migrations (DANGEROUS)
php artisan migrate:reset
```

#### Using Database Backup

```bash
# Restore from backup
mysql -u root -p graveyardjokes < backup_20250115.sql

# Verify restoration
mysql -u root -p graveyardjokes -e "SELECT COUNT(*) FROM contacts;"
```

### Rollback Checklist

- [ ] Identify the issue (check logs)
- [ ] Determine safe rollback point
- [ ] Notify team/users if needed
- [ ] Perform rollback
- [ ] Verify application works
- [ ] Check database integrity
- [ ] Monitor for issues
- [ ] Document incident

### Emergency Maintenance Mode

If you need to take site offline:

```bash
# Enable maintenance mode
php artisan down --refresh=15 --secret="emergency-token"

# Access via: https://graveyardjokes.com/emergency-token

# Perform fixes
git pull
composer install
php artisan migrate

# Disable maintenance mode
php artisan up
```

## 📊 Monitoring & Maintenance

### Health Checks

Set up monitoring for:

- [ ] Website availability (uptime monitoring)
- [ ] SSL certificate expiration
- [ ] Disk space usage
- [ ] Database performance
- [ ] Queue workers status
- [ ] Error rates

### Recommended Tools

- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry, Bugsnag
- **Performance**: New Relic, Blackfire
- **Logs**: Papertrail, Logtail

### Regular Maintenance

#### Daily
- Monitor error logs
- Check queue status

#### Weekly
- Review analytics
- Check disk space
- Review security logs

#### Monthly
- Update dependencies
- Review and optimize database
- Check SSL certificate
- Backup verification

### Backup Strategy

```bash
# Database backup
mysqldump -u root -p graveyardjokes > backup_$(date +%Y%m%d).sql

# Application backup
tar -czf app_backup_$(date +%Y%m%d).tar.gz /var/www/graveyardjokes

# Automated backup (add to cron)
0 2 * * * /usr/local/bin/backup-script.sh
```

### Updates

```bash
# Pull latest code
cd /var/www/graveyardjokes
git pull origin main

# Update dependencies
composer install --no-dev --optimize-autoloader
npm ci
npm run build

# Run migrations
php artisan migrate --force

# Clear and cache
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Restart services
php artisan queue:restart
sudo systemctl reload php8.4-fpm
```

## 🔧 Troubleshooting

### Common Issues

#### 1. 500 Internal Server Error

```bash
# Check logs
tail -f storage/logs/laravel.log

# Check permissions
sudo chown -R www-data:www-data /var/www/graveyardjokes
sudo chmod -R 775 storage bootstrap/cache

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan view:clear
```

#### 2. Queue Not Processing

```bash
# Check supervisor status
sudo supervisorctl status

# Restart queue workers
php artisan queue:restart
sudo supervisorctl restart graveyardjokes-worker:*

# Check Redis connection
php artisan tinker
>>> Redis::ping();
```

#### 3. Assets Not Loading

```bash
# Rebuild assets
npm ci
npm run build

# Check Nginx configuration
sudo nginx -t

# Clear browser cache
```

#### 4. Database Connection Issues

```bash
# Test connection
php artisan tinker
>>> DB::connection()->getPdo();

# Check credentials in .env
# Verify MySQL is running
sudo systemctl status mysql
```

#### 5. SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test SSL
openssl s_client -connect graveyardjokes.com:443
```

### Performance Optimization

#### Enable OPcache

Edit `/etc/php/8.4/fpm/php.ini`:

```ini
opcache.enable=1
opcache.memory_consumption=128
opcache.interned_strings_buffer=8
opcache.max_accelerated_files=10000
opcache.revalidate_freq=60
opcache.fast_shutdown=1
```

#### Configure Redis Memory

Edit `/etc/redis/redis.conf`:

```conf
maxmemory 256mb
maxmemory-policy allkeys-lru
```

#### Nginx Optimization

```nginx
# Add to server block
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;

# Browser caching
location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Deployment Security Best Practices

#### 1. Use Deploy Keys

Generate SSH deploy key:

```bash
ssh-keygen -t ed25519 -C "deploy@graveyardjokes.com" -f ~/.ssh/graveyardjokes_deploy
```

Add public key to GitHub as read-only deploy key.

#### 2. Restrict File Permissions

```bash
# Application files (read-only for web server)
sudo chown -R forge:www-data /var/www/graveyardjokes
sudo chmod -R 755 /var/www/graveyardjokes

# Writable directories only
sudo chmod -R 775 storage bootstrap/cache

# Protect .env
chmod 600 .env
```

#### 3. Firewall Configuration

```bash
# UFW configuration
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

#### 4. Secure Environment Variables

Never commit `.env` to version control:

```bash
# Verify .env is gitignored
git check-ignore .env

# Use Laravel secrets for sensitive data
php artisan env:encrypt --key=base64:your-encryption-key
```

#### 5. Database Security

```bash
# Use strong passwords
# Limit database user privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON graveyardjokes.* TO 'app_user'@'localhost';

# Regular backups with encryption
mysqldump graveyardjokes | gzip | openssl enc -aes-256-cbc -salt -out backup.sql.gz.enc
```

### Deployment Monitoring Checklist

After each deployment, verify:

- [ ] Site loads properly (https://graveyardjokes.com)
- [ ] SSL certificate is valid
- [ ] API endpoints respond correctly
- [ ] Database migrations completed
- [ ] Assets are served correctly (no 404s)
- [ ] Queue workers are running
- [ ] Cron jobs are scheduled
- [ ] Error rate is normal
- [ ] Response times are acceptable
- [ ] No critical errors in logs

### Multi-Environment Configuration

#### Staging Environment

```env
# .env.staging
APP_ENV=staging
APP_DEBUG=false
APP_URL=https://staging.graveyardjokes.com

DB_DATABASE=graveyardjokes_staging
MAIL_MAILER=log  # Don't send real emails
```

#### Production Environment

```env
# .env.production
APP_ENV=production
APP_DEBUG=false
APP_URL=https://graveyardjokes.com

DB_DATABASE=graveyardjokes
MAIL_MAILER=smtp
```

### CDN Integration

If using a CDN (Cloudflare, AWS CloudFront):

```env
# .env
ASSET_URL=https://cdn.graveyardjokes.com
VITE_ASSET_URL=https://cdn.graveyardjokes.com
```

Update Nginx to serve static assets with long cache headers:

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header X-Content-Type-Options "nosniff";
}
```

## 📞 Support

For deployment issues:

1. Check logs first: `storage/logs/laravel.log`
2. Review [DEVELOPMENT.md](./DEVELOPMENT.md) for local testing
3. Check [GitHub Issues](https://github.com/JoshuaAckerly/graveyardjokes/issues)
4. Contact: admin@graveyardjokes.com

### Deployment Emergency Contacts

- **Primary**: admin@graveyardjokes.com
- **GitHub**: @JoshuaAckerly
- **Laravel Forge**: [forge.laravel.com](https://forge.laravel.com)
- **Server Provider**: Check your hosting dashboard

---

**Deploy with Confidence! 🚀**

*Last updated: November 22, 2025*
