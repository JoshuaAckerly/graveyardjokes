# Deployment Guide

This guide covers deploying the Graveyard Jokes application using Hypervisor, our custom deployment system with separate development and test server environments.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Server Requirements](#server-requirements)
- [Hypervisor Deployment](#hypervisor-deployment)
- [Development Server](#development-server)
- [Test Server](#test-server)
- [Production Deployment](#production-deployment)
- [Portfolio Batched Deployment](#portfolio-batched-deployment)
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

- [ ] Development server with root or sudo access
- [ ] Test server with root or sudo access
- [ ] Production server (AWS EC2 recommended)
- [ ] Domain names configured
- [ ] SSL certificates (Let's Encrypt recommended)
- [ ] Database servers (MySQL 8.0+ or PostgreSQL 13+)
- [ ] Redis servers (optional but recommended)
- [ ] Git repository access
- [ ] SSH access to all servers

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

# PM2 (for SSR server management)
sudo npm install -g pm2

# Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

## 🚀 Hypervisor Deployment

Hypervisor is our custom deployment system that manages deployments across development, test, and production environments using automated scripts.

### Environment Overview

- **Development Server**: Local development environment with hot reloading
- **Test Server**: Staging environment for testing and QA
- **Production Server**: Live environment (AWS EC2)

### Deployment Scripts

The project includes automated deployment scripts:

- `deploy-production.sh` - Production deployment to AWS EC2
- `deploy-test.sh` - Test server deployment to Ubuntu VM
- `setup-test-server.sh` - Initial test server setup
- `scripts/deploy-all-batched.sh` - Portfolio-wide production batched deployment that runs each site's remote deploy script

### 1. Initial Server Setup

For each environment, run the appropriate setup:

**Test Server:**
```bash
# Copy setup script to test server
scp setup-test-server.sh user@YOUR_TEST_SERVER:~/

# Run setup on test server
ssh user@YOUR_TEST_SERVER
chmod +x setup-test-server.sh
./setup-test-server.sh
```

**Production Server:**
Manual setup required (see server configuration section).

### 2. Configure Environment Variables

Update `.env` files for each environment:

**Development (.env):**
```env
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=graveyardjokes_dev

# ... other dev settings
```

**Test (.env):**
```env
APP_ENV=testing
APP_DEBUG=false
APP_URL=https://test.graveyardjokes.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=graveyardjokes_test

# ... other test settings
```

**Production (.env):**
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://graveyardjokes.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=graveyardjokes_prod

# ... other production settings
```

### 3. Deploy to Environments

**Development:**
```bash
# Local deployment
composer install
npm install
npm run build
php artisan migrate
```

**Test Server:**
```bash
# From your local machine
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude 'vendor' \
  --exclude '.git' \
  --exclude 'storage/logs/*' \
  --exclude '.env' \
  /path/to/graveyardjokes/ \
  user@TEST_SERVER:/var/www/graveyardjokes/

# SSH and deploy
ssh user@TEST_SERVER
cd /var/www/graveyardjokes
./deploy-test.sh
```

**Production:**
```bash
# Copy to production server
scp deploy-production.sh user@PRODUCTION_SERVER:~/

# SSH and deploy
ssh user@PRODUCTION_SERVER
cd /var/www/graveyardjokes
./deploy-production.sh
```

## 💻 Development Server

### Local Development Setup

1. **Clone repository**
   ```bash
   git clone https://github.com/JoshuaAckerly/graveyardjokes.git
   cd graveyardjokes
   ```

2. **Install dependencies**
   ```bash
   composer install
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Database setup**
   ```bash
   # Update .env with local database credentials
   php artisan migrate
   ```

5. **Start development servers**
   ```bash
   # Terminal 1: Laravel
   php artisan serve --port=8000
   
   # Terminal 2: Vite
   npm run dev
   
   # Terminal 3: SSR
   php artisan inertia:start-ssr --port=13714
   ```

### Development URLs

- Application: http://localhost:8000
- Vite HMR: http://localhost:5173
- SSR Server: http://localhost:13714

## 🧪 Test Server

### Test Environment Setup

The test server runs on Ubuntu VM with automated deployment.

### Deployment Process

1. **Push code to testing branch**
   ```bash
   git checkout testing
   git add .
   git commit -m "Deploy to test"
   git push origin testing
   ```

2. **Deploy using script**
   ```bash
   ssh user@TEST_SERVER
   cd /var/www/graveyardjokes
   ./deploy-test.sh
   ```

### Test Server Features

- Automated database migrations
- SSR server management
- Log rotation
- Queue worker management
- Nginx configuration

### Monitoring Test Deployments

```bash
# Check deployment logs
tail -f /var/www/graveyardjokes/storage/logs/laravel.log

# Check SSR logs
tail -f /var/www/graveyardjokes/storage/logs/ssr.log

# Check Nginx status
sudo systemctl status nginx
```

## 🏭 Production Deployment

### Production Server Setup

Production runs on AWS EC2 with high availability.

### Deployment Process

1. **Push to main branch**
   ```bash
   git checkout main
   git add .
   git commit -m "Deploy to production"
   git push origin main
   ```

2. **Deploy using production script**
   ```bash
   ssh user@PRODUCTION_SERVER
   cd /var/www/graveyardjokes
   ./deploy-production.sh
   ```

## 📦 Portfolio Batched Deployment

Use this from the polyrepo root when deploying all portfolio sites in controlled batches:

```bash
cd /home/joshua/Documents
bash scripts/deploy-all-batched.sh
```

Default batches are:

- `lunarblood`, `hollowpress`, `studio`
- `graveyardjokes`, `synthveil`
- `thevelvetpulse`, `velvetradio`

Include auth deployment in a final batch when needed:

```bash
bash scripts/deploy-all-batched.sh --include-auth-system
```

Use `--dry-run` to preview remote commands before an actual rollout:

```bash
bash scripts/deploy-all-batched.sh --preflight-only
bash scripts/deploy-all-batched.sh --dry-run
```

### Production Features

- PM2 for SSR server management
- Automated asset optimization
- Database migration with --force
- Cache clearing and rebuilding
- Queue worker restart

### Production Monitoring

```bash
# Check PM2 processes
pm2 list

# Check SSR server
pm2 logs graveyardjokes-ssr

# Check PHP-FPM
sudo systemctl status php8.4-fpm
```

## 🔧 Server Configuration

### Nginx Configuration

Create `/etc/nginx/sites-available/graveyardjokes`:

```nginx
server {
    listen 80;
    server_name graveyardjokes.com www.graveyardjokes.com;
    root /var/www/graveyardjokes/public;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    index index.php index.html index.htm;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.4-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }

    # SSR proxy
    location /ssr {
        proxy_pass http://127.0.0.1:13714;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/graveyardjokes /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### MySQL Setup

```bash
# Secure MySQL installation
sudo mysql_secure_installation

# Create database and user
sudo mysql -u root -p

CREATE DATABASE graveyardjokes_prod;
CREATE USER 'graveyardjokes'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON graveyardjokes_prod.* TO 'graveyardjokes'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Redis Setup

```bash
# Install and configure Redis
sudo apt-get install redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

### Supervisor Configuration

Create `/etc/supervisor/conf.d/graveyardjokes-worker.conf`:

```ini
[program:graveyardjokes-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/graveyardjokes/artisan queue:work redis --sleep=3 --tries=3 --timeout=90
directory=/var/www/graveyardjokes
user=www-data
numprocs=2
priority=999
autostart=true
autorestart=true
startretries=3
redirect_stderr=true
stdout_logfile=/var/www/graveyardjokes/storage/logs/worker.log
```

Update supervisor:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start graveyardjokes-worker:*
```

### Cron Jobs

Add to crontab:
```bash
sudo crontab -e

# Add this line:
* * * * * php /var/www/graveyardjokes/artisan schedule:run >> /dev/null 2>&1
```

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
php artisan app:generate-sitemap --url=https://graveyardjokes.com
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
GOOGLE_ANALYTICS_TRACKING_ID=G-XXXXXXXXXX

# Services
IPINFO_TOKEN=your_ipinfo_token
VISITOR_NOTIFICATION_TTL=300

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
php artisan app:generate-sitemap --url=https://graveyardjokes.com
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

## 🔄 CI/CD Integration

### GitHub Actions Workflow

The project includes automated CI/CD with GitHub Actions:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, testing ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup PHP
        uses: actions/setup-php@v4
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

  deploy-test:
    if: github.ref == 'refs/heads/testing' && github.event_name == 'push'
    needs: test
    runs-on: ubuntu-latest
    
    steps:
      - name: Deploy to Test Server
        run: |
          echo "Deploying to test server using Hypervisor"
          # Add your test server deployment commands here
          # Example: rsync, SSH commands, or webhook calls

  deploy-production:
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    needs: test
    runs-on: ubuntu-latest
    
    steps:
      - name: Deploy to Production
        run: |
          echo "Deploying to production using Hypervisor"
          # Add your production deployment commands here
```

### Deployment Secrets

Add to GitHub repository secrets:
- `TEST_SERVER_HOST`: Test server hostname/IP
- `TEST_SERVER_USER`: SSH user for test server
- `PRODUCTION_SERVER_HOST`: Production server hostname/IP
- `PRODUCTION_SERVER_USER`: SSH user for production server
- `SSH_PRIVATE_KEY`: Private SSH key for server access

### Deployment Branches

**Production**: `main` → graveyardjokes.com (AWS EC2)
**Test**: `testing` → test.graveyardjokes.com (Ubuntu VM)
**Development**: `develop` → localhost:8000

## ⚡ Zero-Downtime Deployment

### Using Hypervisor Scripts

The deployment scripts ensure zero-downtime by:

1. **Staged Deployment**: Code is deployed to a staging area first
2. **Asset Building**: Frontend assets are built before switching
3. **Service Restart**: Services are restarted gracefully
4. **Health Checks**: Basic health checks ensure deployment success

### Rollback Procedures

**Test Server Rollback:**
```bash
# SSH to test server
ssh user@test-server
cd /var/www/graveyardjokes
git reset --hard HEAD~1
./deploy-test.sh
```

**Production Rollback:**
```bash
# SSH to production server
ssh user@production-server
cd /var/www/graveyardjokes
git reset --hard HEAD~1
./deploy-production.sh
```

### Monitoring Deployments

**Check deployment status:**
```bash
# Test server
ssh user@test-server 'tail -f /var/www/graveyardjokes/storage/logs/laravel.log'

# Production server
ssh user@production-server 'pm2 logs graveyardjokes-ssr'
```

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

### Quick Rollback (Hypervisor)

1. SSH to the affected server
2. Navigate to project directory
3. Reset to previous commit: `git reset --hard HEAD~1`
4. Run deployment script: `./deploy-production.sh` or `./deploy-test.sh`

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

# Fix writable paths (recommended)
sudo chown -R www-data:www-data storage bootstrap/cache
sudo find storage bootstrap/cache -type d -exec chmod 775 {} \;
sudo find storage bootstrap/cache -type f -exec chmod 664 {} \;

# Rebuild caches as web user
sudo -u www-data php artisan optimize:clear
sudo -u www-data php artisan optimize
```

If you see `file_put_contents(...storage/framework/views/...): Permission denied`,
clear compiled views and reapply the commands above.

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
sudo chown -R www-data:www-data /var/www/graveyardjokes
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
4. Contact: joshua@graveyardjokes.com

### Deployment Emergency Contacts

- **Primary**: joshua@graveyardjokes.com
- **GitHub**: @JoshuaAckerly
- **AWS Console**: For production server issues
- **Server Provider**: Check your hosting dashboard

---

**Deploy with Confidence! 🚀**

*Last updated: January 17, 2026*
