# Development Guide

This guide provides detailed information for setting up and working with the Graveyard Jokes project in a development environment.

## 📋 Table of Contents

- [Environment Setup](#environment-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Available Commands](#available-commands)
- [Environment Variables](#environment-variables)
- [Database Management](#database-management)
- [Frontend Development](#frontend-development)
- [Backend Development](#backend-development)
- [Debugging](#debugging)
- [Troubleshooting](#troubleshooting)

## 🔧 Environment Setup

### System Requirements

- **PHP**: 8.3+ (8.4 recommended)
  - Extensions: BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML, cURL
- **Composer**: 2.x
- **Node.js**: 18+ (22.x recommended for CI compatibility)
- **npm**: 9+ (or pnpm 8+)
- **Database**: MySQL 8.0+ or PostgreSQL 13+
- **Redis**: Optional but recommended for cache/queue
- **Git**: Latest version

### Installation Steps

#### 1. Clone Repository

```bash
git clone https://github.com/JoshuaAckerly/graveyardjokes.git
cd graveyardjokes
```

#### 2. Install PHP Dependencies

```bash
composer install
```

If you encounter memory issues:

```bash
COMPOSER_MEMORY_LIMIT=-1 composer install
```

#### 3. Install Node Dependencies

```bash
npm ci
```

Or with pnpm:

```bash
pnpm install --frozen-lockfile
```

#### 4. Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` with your local settings:

```env
APP_NAME="Graveyard Jokes"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=graveyardjokes
DB_USERNAME=your_username
DB_PASSWORD=your_password

CACHE_STORE=file
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
```

#### 5. Generate Application Key

```bash
php artisan key:generate
```

#### 6. Create Database

```bash
# MySQL
mysql -u root -p
CREATE DATABASE graveyardjokes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# PostgreSQL
createdb graveyardjokes
```

#### 7. Run Migrations

```bash
php artisan migrate
```

#### 8. Seed Database (Optional)

```bash
php artisan db:seed
```

#### 9. Create Storage Link

```bash
php artisan storage:link
```

#### 10. Build Frontend Assets

```bash
npm run build
```

### IDE Setup

#### VS Code

Recommended extensions:

```json
{
  "recommendations": [
    "bmewburn.vscode-intelephense-client",
    "bradlc.vscode-tailwindcss",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "junstyle.php-cs-fixer",
    "mikestead.dotenv",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

Settings (`.vscode/settings.json`):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[php]": {
    "editor.defaultFormatter": "junstyle.php-cs-fixer"
  },
  "php.suggest.basic": false,
  "intelephense.diagnostics.undefinedTypes": false
}
```

#### PhpStorm

1. Enable Laravel plugin
2. Configure PHP interpreter (PHP 8.3+)
3. Enable Composer autoload
4. Set code style to PSR-12
5. Configure Xdebug for debugging

## 📁 Project Structure

```
graveyardjokes/
├── app/
│   ├── Console/           # Artisan commands
│   ├── Contracts/         # Interface contracts
│   ├── Http/
│   │   ├── Controllers/   # HTTP controllers
│   │   ├── Middleware/    # HTTP middleware
│   │   └── Requests/      # Form requests
│   ├── Mail/             # Mailable classes
│   ├── Models/           # Eloquent models
│   ├── Modules/          # Feature modules
│   ├── Providers/        # Service providers
│   └── Services/         # Business logic services
├── bootstrap/            # Framework bootstrap
├── config/              # Configuration files
├── database/
│   ├── factories/       # Model factories
│   ├── migrations/      # Database migrations
│   └── seeders/        # Database seeders
├── public/             # Public web root
│   ├── build/         # Compiled assets (gitignored)
│   └── storage/       # Public storage symlink
├── resources/
│   ├── css/          # Stylesheets
│   ├── js/           # Frontend source
│   │   ├── Components/ # React components
│   │   ├── Layouts/    # Page layouts
│   │   ├── Pages/      # Inertia pages
│   │   └── types/      # TypeScript types
│   └── views/        # Blade templates
├── routes/
│   ├── api.php       # API routes
│   ├── console.php   # Console routes
│   └── web.php       # Web routes
├── storage/
│   ├── app/         # Application storage
│   ├── framework/   # Framework storage
│   └── logs/        # Log files
├── tests/
│   ├── Feature/     # Feature tests
│   └── Unit/        # Unit tests
└── vendor/          # Composer dependencies (gitignored)
```

### Key Files

- **`vite.config.ts`**: Vite build configuration
- **`tsconfig.json`**: TypeScript configuration
- **`phpstan.neon`**: PHPStan configuration
- **`phpunit.xml`**: PHPUnit configuration
- **`composer.json`**: PHP dependencies
- **`package.json`**: Node dependencies
- **`.env`**: Environment variables (gitignored)
- **`.env.example`**: Environment template

## 🔄 Development Workflow

### Starting Development Servers

#### Option 1: All-in-One (Recommended)

```bash
composer dev
```

This starts:
- Laravel development server (port 8000)
- Queue worker
- Vite dev server with HMR (port 5173)

#### Option 2: With SSR Support

```bash
composer dev:ssr
```

This starts:
- Laravel development server
- Queue worker
- Laravel Pail (log viewer)
- Inertia SSR server
- Vite dev server

#### Option 3: Manual Start

```bash
# Terminal 1: Laravel server
php artisan serve

# Terminal 2: Vite dev server
npm run dev

# Terminal 3 (optional): Queue worker
php artisan queue:work

# Terminal 4 (optional): SSR server
php artisan inertia:start-ssr
```

### Hot Module Replacement (HMR)

Vite provides instant HMR for frontend changes:

1. Start development server: `npm run dev`
2. Edit React components in `resources/js/`
3. See changes instantly in browser (no refresh needed)

### Making Changes

#### Backend Changes (PHP)

1. Edit PHP files in `app/`, `routes/`, etc.
2. Changes take effect immediately
3. If modifying config, run: `php artisan config:clear`
4. If modifying routes, run: `php artisan route:clear`

#### Frontend Changes (React/TypeScript)

1. Edit files in `resources/js/`
2. HMR updates browser automatically
3. Type errors shown in terminal and browser console

#### Database Changes

1. Create migration:
   ```bash
   php artisan make:migration create_jokes_table
   ```

2. Edit migration in `database/migrations/`

3. Run migration:
   ```bash
   php artisan migrate
   ```

4. Rollback if needed:
   ```bash
   php artisan migrate:rollback
   ```

## 📜 Available Commands

### Composer Scripts

```bash
# Start all dev services
composer dev

# Start with SSR
composer dev:ssr

# Run tests
composer test
```

### Artisan Commands

```bash
# Development
php artisan serve              # Start dev server
php artisan tinker            # Interactive REPL
php artisan route:list        # List all routes
php artisan queue:work        # Start queue worker

# Database
php artisan migrate           # Run migrations
php artisan migrate:fresh     # Drop all tables and re-run
php artisan migrate:rollback  # Rollback last migration
php artisan db:seed          # Run seeders

# Cache
php artisan cache:clear      # Clear application cache
php artisan config:clear     # Clear config cache
php artisan route:clear      # Clear route cache
php artisan view:clear       # Clear compiled views

# Production optimization
php artisan config:cache     # Cache configuration
php artisan route:cache      # Cache routes
php artisan view:cache       # Compile views

# Custom commands
php artisan sitemap:generate # Generate sitemap
```

### NPM Scripts

```bash
# Development
npm run dev                  # Start Vite dev server

# Building
npm run build               # Build for production
npm run build:ssr           # Build with SSR support

# Testing
npm test                    # Run Jest tests
npm run test:watch          # Run tests in watch mode

# Code quality
npm run lint                # Run ESLint
npm run format              # Format with Prettier
npm run format:check        # Check formatting
npm run types               # Check TypeScript types

# Other
npm run capture:homepages   # Capture homepage screenshots
```

### Static Analysis

```bash
# PHPStan
./vendor/bin/phpstan analyse -c phpstan.neon --memory-limit=2G

# Generate baseline (if needed)
./vendor/bin/phpstan analyse -c phpstan.neon --generate-baseline

# Laravel Pint (code formatting)
vendor/bin/pint
vendor/bin/pint --test  # Check without fixing
```

## 🔐 Environment Variables

### Application

```env
APP_NAME="Graveyard Jokes"
APP_ENV=local                    # local, production, testing
APP_KEY=base64:...              # Generate with: php artisan key:generate
APP_DEBUG=true                  # true for development, false for production
APP_URL=http://localhost:8000
```

### Database

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=graveyardjokes
DB_USERNAME=root
DB_PASSWORD=
```

### Cache & Queue

```env
CACHE_STORE=file               # file, redis, memcached
QUEUE_CONNECTION=sync          # sync, database, redis
SESSION_DRIVER=file            # file, cookie, database, redis
```

### Mail

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="noreply@graveyardjokes.com"
MAIL_FROM_NAME="${APP_NAME}"
```

### Services

```env
# Google Analytics (optional)
GOOGLE_ANALYTICS_PROPERTY_ID=

# IPInfo for geolocation (optional)
IPINFO_TOKEN=

# Visitor tracking
TRACK_VISITOR_EMAIL_TTL=86400  # 24 hours in seconds
```

### Vite

```env
VITE_APP_NAME="${APP_NAME}"
```

## 🗄️ Database Management

### Creating Migrations

```bash
# Create migration
php artisan make:migration create_contacts_table

# Create migration with model
php artisan make:model Contact -m

# Create migration with model, factory, and seeder
php artisan make:model Contact -mfs
```

### Migration Best Practices

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email');
            $table->text('message');
            $table->timestamps();
            
            // Add indexes
            $table->index('email');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
```

### Using Seeders

```bash
# Create seeder
php artisan make:seeder JokeSeeder

# Run all seeders
php artisan db:seed

# Run specific seeder
php artisan db:seed --class=JokeSeeder

# Fresh migration with seed
php artisan migrate:fresh --seed
```

### Database Commands

```bash
# Drop all tables and re-migrate
php artisan migrate:fresh

# Rollback and re-run migrations
php artisan migrate:refresh

# Show migration status
php artisan migrate:status

# Rollback specific number of migrations
php artisan migrate:rollback --step=2
```

## 🎨 Frontend Development

### React Component Guidelines

```tsx
// resources/js/Components/JokeCard.tsx
import { useState } from 'react';
import type { Joke } from '@/types';

interface JokeCardProps {
    joke: Joke;
    className?: string;
}

export function JokeCard({ joke, className = '' }: JokeCardProps) {
    const [revealed, setRevealed] = useState(false);

    return (
        <div className={`rounded-lg bg-white p-6 shadow ${className}`}>
            <h3 className="mb-4 text-lg font-semibold">{joke.setup}</h3>
            {revealed && (
                <p className="text-gray-600">{joke.punchline}</p>
            )}
            <button
                onClick={() => setRevealed(true)}
                className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
                Reveal
            </button>
        </div>
    );
}
```

### Inertia Pages

```tsx
// resources/js/Pages/Jokes/Index.tsx
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { JokeCard } from '@/Components/JokeCard';
import type { Joke } from '@/types';

interface JokesIndexProps {
    jokes: Joke[];
}

export default function JokesIndex({ jokes }: JokesIndexProps) {
    return (
        <AppLayout>
            <Head title="Jokes" />
            
            <div className="container mx-auto px-4 py-8">
                <h1 className="mb-8 text-3xl font-bold">Jokes</h1>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {jokes.map((joke) => (
                        <JokeCard key={joke.id} joke={joke} />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
```

### TypeScript Types

```typescript
// resources/js/types/index.d.ts
export interface Joke {
    id: string;
    setup: string;
    punchline: string;
    category: string;
}

export interface Contact {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    message: string;
    created_at: string;
}

export interface PageProps {
    auth: {
        user: User | null;
    };
    flash: {
        success?: string;
        error?: string;
    };
}
```

### Styling with Tailwind

```tsx
// Use utility classes
<button className="rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600">
    Click me
</button>

// Conditional classes
<div className={`rounded-lg p-4 ${error ? 'bg-red-100' : 'bg-green-100'}`}>
    {message}
</div>

// With clsx/cn helper
import { cn } from '@/lib/utils';

<button className={cn(
    "rounded-lg px-4 py-2",
    isPrimary ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800",
    isDisabled && "opacity-50 cursor-not-allowed"
)}>
    {children}
</button>
```

## 🔧 Backend Development

### Controller Best Practices

```php
<?php

namespace App\Http\Controllers;

use App\Services\JokeService;
use Illuminate\Http\JsonResponse;
use Inertia\Response;

class JokeController extends Controller
{
    public function __construct(
        private readonly JokeService $jokeService
    ) {}

    public function index(): Response
    {
        $jokes = $this->jokeService->getAllJokes();
        
        return inertia('Jokes/Index', [
            'jokes' => $jokes,
        ]);
    }

    public function random(): JsonResponse
    {
        $joke = $this->jokeService->getRandomJoke();
        
        if (!$joke) {
            return response()->json(
                ['error' => 'No jokes available'],
                503
            );
        }
        
        return response()->json($joke);
    }
}
```

### Service Layer Pattern

```php
<?php

namespace App\Services;

use App\Models\Joke;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class JokeService
{
    private const CACHE_KEY = 'jokes_data';
    private const CACHE_TTL = 3600; // 1 hour

    public function getAllJokes(): Collection
    {
        return Cache::remember(
            self::CACHE_KEY,
            self::CACHE_TTL,
            fn() => Joke::all()
        );
    }

    public function getRandomJoke(): ?Joke
    {
        $jokes = $this->getAllJokes();
        
        return $jokes->isNotEmpty() 
            ? $jokes->random() 
            : null;
    }

    public function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }
}
```

### Form Requests

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ];
    }

    public function messages(): array
    {
        return [
            'first_name.required' => 'Please enter your first name.',
            'email.email' => 'Please enter a valid email address.',
        ];
    }
}
```

## 🐛 Debugging

### Laravel Telescope (Optional)

```bash
# Install Telescope
composer require laravel/telescope --dev

# Install and migrate
php artisan telescope:install
php artisan migrate

# Access at http://localhost:8000/telescope
```

### Laravel Pail (Log Viewer)

```bash
# Start log viewer
php artisan pail

# With custom filters
php artisan pail --filter="error,warning"
```

### Xdebug Configuration

```ini
; php.ini
zend_extension=xdebug
xdebug.mode=debug
xdebug.start_with_request=yes
xdebug.client_port=9003
```

### Debugging Tips

```php
// Dump and die
dd($variable);

// Dump without dying
dump($variable);

// Log debugging
\Log::debug('Debug message', ['data' => $variable]);

// Ray debugging (if installed)
ray($variable);
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Permission Errors

```bash
# Fix storage permissions
chmod -R 775 storage bootstrap/cache
```

#### 2. Composer Memory Issues

```bash
COMPOSER_MEMORY_LIMIT=-1 composer install
```

#### 3. Node Version Mismatch

```bash
# Use nvm to switch Node version
nvm use 22
```

#### 4. Database Connection Errors

```env
# Check .env settings
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306

# Test connection
php artisan migrate:status
```

#### 5. Vite Not Connecting

```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Rebuild
npm run build
```

#### 6. PHPStan Errors

```bash
# Update baseline if needed (only for unavoidable errors)
./vendor/bin/phpstan analyse --generate-baseline

# Clear result cache
./vendor/bin/phpstan clear-result-cache
```

### Getting Help

1. Check [GitHub Issues](https://github.com/JoshuaAckerly/graveyardjokes/issues)
2. Review Laravel documentation
3. Check React/Inertia documentation
4. Open a new issue with details

## 📚 Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://react.dev)
- [Inertia.js Documentation](https://inertiajs.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Vite Documentation](https://vitejs.dev)

---

**Happy Developing! 🚀**
