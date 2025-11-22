# Graveyard Jokes

> A modern, full-stack web application for sharing jokes with visitor tracking, analytics, and dynamic content delivery.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)](https://www.typescriptlang.org/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Documentation](#documentation)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [API](#api)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Graveyard Jokes is a full-stack web application built with Laravel 12 and React 19, featuring server-side rendering (SSR) with Inertia.js. The platform delivers jokes with a focus on performance, analytics, and user engagement.

**Live Site**: [https://graveyardjokes.com](https://graveyardjokes.com)

### Key Highlights

- 🚀 **Modern Stack**: Laravel 12 backend with React 19 + TypeScript frontend
- ⚡ **SSR Support**: Server-side rendering with Inertia.js for optimal SEO
- 📊 **Analytics**: Visitor tracking with geolocation and Google Analytics integration
- 🎨 **UI Components**: Radix UI primitives with Tailwind CSS 4
- 🔒 **Security**: SSRF protection, rate limiting, and input validation
- 📧 **Email Notifications**: Automated contact form and visitor tracking emails
- 🖼️ **OG Image Caching**: Smart Open Graph image fetching and caching
- ✅ **Quality Assurance**: PHPStan static analysis, ESLint, Prettier, and comprehensive testing

## ✨ Features

### Core Functionality
- **Random Joke API**: Retrieve random jokes from a curated collection
- **Contact Form**: Submit inquiries with email notifications
- **Visitor Tracking**: Track visitor analytics with IP geolocation
- **SEO Optimization**: Automated sitemap generation and meta tags
- **Open Graph Support**: Dynamic OG image fetching and caching

### Developer Experience
- **Type Safety**: Full TypeScript support across frontend
- **Code Quality**: PHPStan level 8, Laravel Pint, ESLint configuration
- **Hot Module Replacement**: Fast development with Vite
- **Automated Testing**: PHPUnit and Jest test suites
- **CI/CD**: GitHub Actions workflows for automated testing and deployment

## 🛠 Tech Stack

### Backend
- **Framework**: Laravel 12.x
- **PHP Version**: 8.3+ (8.4 recommended)
- **Database**: MySQL/PostgreSQL compatible
- **Cache**: File/Redis/Memcached support
- **Queue**: Laravel Queue for background jobs

### Frontend
- **Framework**: React 19.x
- **Language**: TypeScript 5.7
- **Build Tool**: Vite 7.x
- **Routing**: Inertia.js 2.x
- **Styling**: Tailwind CSS 4.x
- **UI Components**: Radix UI, Headless UI
- **Animation**: Framer Motion

### DevOps & Tools
- **Package Managers**: Composer, npm
- **Static Analysis**: PHPStan (Larastan), TypeScript
- **Code Formatting**: Laravel Pint, Prettier
- **Linting**: ESLint
- **Testing**: PHPUnit, Jest, Playwright
- **CI/CD**: GitHub Actions
- **Version Control**: Git

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **PHP** 8.3+ (8.4 recommended)
- **Composer** 2.x
- **Node.js** 18+ (22.x recommended)
- **npm** or **pnpm**
- **Git**
- **MySQL** 8.0+ or **PostgreSQL** 13+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/JoshuaAckerly/graveyardjokes.git
   cd graveyardjokes
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node dependencies**
   ```bash
   npm ci
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Configure your database** (edit `.env`)
   ```env
   ***REMOVED***
   ***REMOVED***
   ***REMOVED***
   DB_DATABASE=graveyardjokes
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

6. **Run migrations**
   ```bash
   php artisan migrate
   ```

7. **Build frontend assets**
   ```bash
   npm run build
   ```

8. **Start development server**
   ```bash
   composer dev
   ```
   
   Or manually:
   ```bash
   php artisan serve
   npm run dev
   ```

9. **Visit the application**
   - Frontend: `http://localhost:8000`
   - Vite HMR: `http://localhost:5173`

### Quick Development Commands

```bash
# Start all development services (server + queue + vite)
composer dev

# Start with SSR support
composer dev:ssr

# Run tests
composer test

# Code formatting
vendor/bin/pint              # PHP
npm run format              # Frontend

# Linting
npm run lint

# Static analysis
./vendor/bin/phpstan analyse -c phpstan.neon --memory-limit=2G
```

## 📚 Documentation

Comprehensive documentation is available in the following files:

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and design patterns
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines and workflow
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Detailed development setup and workflows
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment guides and server configuration
- **[TESTING.md](./TESTING.md)** - Testing strategies and test writing guide
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Complete API reference

### Quick Links

- [Project Structure](#) - See [ARCHITECTURE.md](./ARCHITECTURE.md)
- [Coding Standards](#) - See [CONTRIBUTING.md](./CONTRIBUTING.md)
- [Environment Variables](#) - See [DEVELOPMENT.md](./DEVELOPMENT.md)
- [Troubleshooting](#) - See [DEVELOPMENT.md](./DEVELOPMENT.md)

## 💻 Development

### Project Structure

```
graveyardjokes/
├── app/                    # Laravel application code
│   ├── Http/              # Controllers, middleware, requests
│   ├── Models/            # Eloquent models
│   ├── Services/          # Business logic services
│   ├── Mail/              # Mailable classes
│   └── Providers/         # Service providers
├── resources/
│   ├── js/               # React/TypeScript frontend
│   │   ├── Components/   # React components
│   │   ├── Layouts/      # Page layouts
│   │   ├── Pages/        # Inertia pages
│   │   └── types/        # TypeScript definitions
│   ├── css/              # Stylesheets
│   └── views/            # Blade templates
├── routes/               # Application routes
├── tests/                # PHPUnit tests
├── public/               # Public assets
└── storage/              # Logs, cache, uploads
```

### Key Technologies

- **Inertia.js**: Seamless SPA experience without building an API
- **Ziggy**: Laravel route helpers in JavaScript
- **Spatie Sitemap**: Automated sitemap generation
- **Google Analytics Data API**: Analytics integration
- **Guzzle**: HTTP client for external requests

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feat/your-feature
   ```

2. **Make changes and test**
   ```bash
   npm run dev           # Start Vite
   composer test         # Run tests
   ```

3. **Format and lint code**
   ```bash
   vendor/bin/pint       # Format PHP
   npm run format        # Format JS/TS
   npm run lint          # Lint frontend
   ```

4. **Run static analysis**
   ```bash
   ./vendor/bin/phpstan analyse -c phpstan.neon
   npm run types         # Check TypeScript
   ```

5. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feat/your-feature
   ```

6. **Open a Pull Request**

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## 🧪 Testing

### Running Tests

```bash
# Run all tests
./vendor/bin/phpunit

# Run specific test suite
./vendor/bin/phpunit tests/Feature
./vendor/bin/phpunit tests/Unit

# Run frontend tests
npm test
npm run test:watch

# Run with coverage
./vendor/bin/phpunit --coverage-html coverage
```

### Test Coverage

Current test coverage includes:
- ✅ Feature tests (9 tests)
- ✅ API endpoint tests
- ✅ Contact form validation
- ✅ Visitor tracking
- ⚠️ Unit tests (expanding)

See [TESTING.md](./TESTING.md) for comprehensive testing documentation.

## 🚢 Deployment

### Production Build

```bash
# Build frontend assets for production
npm run build

# Clear and cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
php artisan migrate --force

# Generate sitemap
php artisan sitemap:generate
```

### Server Requirements

- PHP 8.3+ with required extensions
- Composer
- Node.js (for build process)
- MySQL 8.0+ or PostgreSQL 13+
- Redis (recommended for cache/queue)
- SSL certificate (for HTTPS)

### Laravel Forge Deployment

Automated deployment script is available in `deploy-forge.sh`.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🔌 API

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/random-joke` | Get a random joke |
| `GET` | `/api/fetch-og-image` | Fetch Open Graph image |
| `POST` | `/contact` | Submit contact form |
| `POST` | `/track-visit` | Track visitor analytics |

### Example Usage

```bash
# Get random joke
curl https://graveyardjokes.com/api/random-joke

# Response
{
  "id": "joke_001",
  "setup": "Why don't skeletons fight each other?",
  "punchline": "They don't have the guts!",
  "category": "graveyard"
}
```

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details on:

- Code of Conduct
- Development process
- How to submit pull requests
- Coding standards
- Commit message conventions

### Quick Contribution Guide

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Laravel Framework Team
- React Team
- Inertia.js Team
- All contributors and maintainers

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/JoshuaAckerly/graveyardjokes/issues)
- **Email**: admin@graveyardjokes.com
- **Documentation**: See documentation files listed above

---

**Made with ❤️ by Graveyard Jokes Studios**
