# Test Server Deployment Guide

This guide helps you deploy Graveyard Jokes to your Ubuntu test VM for learning and testing.

## 📋 Prerequisites

- Ubuntu test VM with sudo access
- Git repository pushed to GitHub/GitLab
- SSH access to your test VM

## 🚀 Initial Setup (Run Once)

### Step 1: Push Your Code to Git

```bash
# On your Ubuntu desktop
cd /home/joshua/Documents/graveyardjokes
git add .
git commit -m "Clean up for test deployment"
git push origin main
```

### Step 2: Copy Setup Script to Server

```bash
# Copy the setup script to your test server
scp setup-test-server.sh user@YOUR_VM_IP:~/
```

### Step 3: Run Setup on Server

```bash
# SSH into your test server
ssh user@YOUR_VM_IP

# Run the setup script
chmod +x setup-test-server.sh
./setup-test-server.sh
```

**Note:** Edit the script first to replace `YOUR_USERNAME` with your GitHub username.

### Step 4: Update Environment Variables

```bash
# On the test server
cd /var/www/graveyardjokes
nano .env

# Update these important settings:
APP_URL=http://YOUR_VM_IP
MAIL_MAILER=log  # Or configure real mail
# Add any other necessary configurations
```

### Step 5: Test Your Site

Visit `http://YOUR_VM_IP` in your browser!

## 🔄 Deploying Updates

After the initial setup, deploy updates using:

```bash
# On your test server
cd /var/www/graveyardjokes
./deploy-test.sh
```

Or from your desktop using rsync:

```bash
# From your Ubuntu desktop
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude 'vendor' \
  --exclude '.git' \
  --exclude 'storage/logs/*' \
  --exclude '.env' \
  /home/joshua/Documents/graveyardjokes/ \
  user@YOUR_VM_IP:/var/www/graveyardjokes/

# Then SSH and rebuild
ssh user@YOUR_VM_IP
cd /var/www/graveyardjokes
./deploy-test.sh
```

## 📂 What Was Cleaned Up

The project has been cleaned and prepared with:

1. **Updated .gitignore** - Excludes:
   - Generated files (sitemaps, OG cache)
   - OS-specific files (.DS_Store, Thumbs.db)

2. **Removed Generated Files**:
   - Sitemap XML files (regenerated on server)
   - Cached OG images (regenerated on demand)

3. **New Deployment Scripts**:
   - `setup-test-server.sh` - One-time server setup
   - `deploy-test.sh` - Deployment script for updates

## 🛠️ Manual Deployment Steps (No Scripts)

If you prefer to understand each step:

### On Test Server:

```bash
cd /var/www/graveyardjokes

# Pull latest code
git pull origin main

# Update dependencies
composer install --no-dev --optimize-autoloader
npm ci

# Build assets
npm run build:ssr

# Stop SSR server
lsof -ti:13714 | xargs kill -TERM 2>/dev/null || true

# Run migrations
php artisan migrate --force

# Clear and cache
php artisan optimize
php artisan app:generate-sitemap --url=https://graveyardjokes.com

# Fix permissions
sudo chown -R www-data:www-data storage bootstrap/cache

# Restart services
sudo systemctl restart php8.3-fpm
node bootstrap/ssr/ssr.mjs &
```

## 🔍 Troubleshooting

### Check Logs
```bash
# Laravel logs
tail -f /var/www/graveyardjokes/storage/logs/laravel.log

# SSR logs
tail -f /var/www/graveyardjokes/storage/logs/ssr.log

# Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### Check Services
```bash
# Nginx status
sudo systemctl status nginx

# PHP-FPM status
sudo systemctl status php8.3-fpm

# Check if SSR is running
lsof -ti:13714
```

### Common Issues

**502 Bad Gateway:**
- Check PHP-FPM: `sudo systemctl restart php8.3-fpm`
- Check permissions on storage folder

**White screen:**
- Check Laravel logs
- Run: `php artisan config:clear`

**Assets not loading:**
- Check if build succeeded: `ls -la public/build/`
- Run: `npm run build:ssr`

## 📊 What This Deployment Includes

✅ Nginx web server  
✅ PHP 8.3 with required extensions  
✅ MySQL database  
✅ Redis for caching/queues  
✅ Supervisor for queue workers  
✅ SSR (Server-Side Rendering)  
✅ Automatic optimization  
✅ Log rotation  

## 🔐 Security Notes for Test Server

This is a **TEST ENVIRONMENT**. For production:

- Use strong passwords (not "test123password")
- Enable firewall (ufw)
- Set up SSL/HTTPS
- Use proper secrets in .env
- Disable DEBUG mode
- Set APP_ENV=production

## 📝 Files Modified/Created

- `.gitignore` - Updated with deployment exclusions
- `deploy-test.sh` - Deployment script (on server)
- `setup-test-server.sh` - Initial server setup
- `TEST_DEPLOYMENT.md` - This guide

## 🎯 Next Steps

1. Test all features on your test server
2. Document any issues or configuration changes needed
3. Use this experience to prepare for production deployment
4. Consider setting up:
   - Automated backups
   - Monitoring (uptime checks)
   - CI/CD pipeline (GitHub Actions)

## 📚 Related Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) - Full production deployment guide
- [DEVELOPMENT.md](DEVELOPMENT.md) - Local development setup
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
