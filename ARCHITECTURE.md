# Architecture Documentation

This document provides an overview of the Graveyard Jokes application architecture, design patterns, and technical decisions.

## 📋 Table of Contents

- [System Overview](#system-overview)
- [Architecture Patterns](#architecture-patterns)
- [Technology Stack](#technology-stack)
- [Application Layers](#application-layers)
- [Data Flow](#data-flow)
- [Key Components](#key-components)
- [Design Decisions](#design-decisions)
- [Security Architecture](#security-architecture)
- [Performance Considerations](#performance-considerations)
- [Scalability](#scalability)

## 🎯 System Overview

Graveyard Jokes is a modern full-stack web application built with a **monolithic architecture** using Laravel as the backend framework and React as the frontend library, connected via Inertia.js for a seamless single-page application experience.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Client (Browser)                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │          React 19 + TypeScript Frontend          │  │
│  │  (Inertia.js Client / Vite HMR / Tailwind CSS)  │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/HTTPS (Inertia Protocol)
                     │
┌────────────────────▼────────────────────────────────────┐
│                 Web Server (Nginx/Apache)                │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│               PHP-FPM / Laravel 12 Backend               │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Controllers → Services → Models → Database      │  │
│  │  Middleware, Validation, Mail, Queue, Cache      │  │
│  └──────────────────────────────────────────────────┘  │
└─────┬──────────────┬──────────────┬───────────────────┘
      │              │              │
┌─────▼───┐    ┌────▼─────┐   ┌───▼──────┐
│ MySQL/  │    │  Redis   │   │  File    │
│ Postgres│    │  Cache   │   │  Storage │
└─────────┘    └──────────┘   └──────────┘
```

### Core Principles

1. **Separation of Concerns**: Business logic in services, presentation in controllers/components
2. **Dependency Injection**: Laravel's service container manages dependencies
3. **Repository Pattern**: (Implicit via Eloquent ORM)
4. **Service Layer Pattern**: Business logic encapsulated in service classes
5. **API-First Thinking**: Public APIs for potential mobile/external integrations
6. **Type Safety**: TypeScript on frontend, PHPStan on backend

## 🏗️ Architecture Patterns

### 1. Model-View-Controller (MVC)

Laravel follows the MVC pattern:

- **Models** (`app/Models/`): Data structures and database interactions
- **Views** (`resources/js/Pages/`, `resources/views/`): UI rendering (Inertia pages, Blade templates)
- **Controllers** (`app/Http/Controllers/`): Request handling and response formatting

### 2. Service Layer Pattern

Business logic is encapsulated in service classes:

```
Controller → Service → Model → Database
   ↓           ↓
Response   Business Logic
```

**Example**:
```php
// Controller handles HTTP
class JokeController {
    public function __construct(private JokeService $jokeService) {}
    
    public function random() {
        return response()->json($this->jokeService->getRandomJoke());
    }
}

// Service handles business logic
class JokeService {
    public function getRandomJoke() {
        return Cache::remember('jokes_data', 3600, function() {
            return Joke::all();
        })->random();
    }
}
```

### 3. Module-Based Organization

Features are organized into modules:

```
app/Modules/
├── Contact/
│   ├── Controllers/
│   ├── Mail/
│   ├── Models/
│   └── Services/
└── Visitor/
    ├── Controllers/
    ├── Models/
    └── Services/
```

### 4. Component-Driven Frontend

React components are organized by function:

```
resources/js/
├── Components/       # Reusable UI components
│   ├── ui/          # Base UI primitives (buttons, cards, etc.)
│   └── JokeCard.tsx # Feature components
├── Layouts/         # Page layouts
├── Pages/           # Full pages (Inertia endpoints)
└── types/           # TypeScript definitions
```

## 🛠️ Technology Stack

### Backend Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Framework** | Laravel 12 | Core application framework |
| **Language** | PHP 8.4 | Server-side programming |
| **Database** | MySQL 8.0+ | Primary data storage |
| **Cache** | Redis | Session, cache, queue storage |
| **Queue** | Laravel Queue | Background job processing |
| **Mail** | Laravel Mail | Email notifications |
| **Static Analysis** | PHPStan | Code quality & type checking |
| **HTTP Client** | Guzzle | External API requests |

### Frontend Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Framework** | React 19 | UI library |
| **Language** | TypeScript 5.7 | Type-safe JavaScript |
| **Build Tool** | Vite 7 | Fast development & bundling |
| **Routing** | Inertia.js 2 | SPA without building an API |
| **Styling** | Tailwind CSS 4 | Utility-first CSS |
| **UI Components** | Radix UI | Accessible component primitives |
| **Animation** | Framer Motion | Smooth animations |
| **State Management** | React Hooks | Local component state |

### Infrastructure

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Web Server** | Nginx | HTTP server & reverse proxy |
| **Process Manager** | Supervisor | Queue worker management |
| **SSL** | Let's Encrypt | Free SSL certificates |
| **Deployment** | Hypervisor (Custom Scripts) | Server management & deployment |
| **CI/CD** | GitHub Actions | Automated testing & deployment |

## 📚 Application Layers

### 1. Presentation Layer

**Responsibilities**: User interface, user input handling, response formatting

**Components**:
- **Inertia Pages** (`resources/js/Pages/`): Full page components
- **React Components** (`resources/js/Components/`): Reusable UI elements
- **Blade Templates** (`resources/views/`): Server-rendered HTML (minimal use)
- **Controllers** (`app/Http/Controllers/`): Request handling

**Example Flow**:
```
User clicks button → React component → Inertia request → Controller
```

### 2. Application Layer

**Responsibilities**: Business logic, use cases, application workflows

**Components**:
- **Services** (`app/Services/`): Business logic encapsulation
- **Form Requests** (`app/Http/Requests/`): Validation rules
- **Middleware** (`app/Http/Middleware/`): Request filtering
- **Mail** (`app/Mail/`): Email composition
- **Jobs** (`app/Jobs/`): Background tasks

**Example Flow**:
```
Controller → Service → Model → Database
                ↓
           Mail/Queue/Cache
```

### 3. Domain Layer

**Responsibilities**: Core business entities and rules

**Components**:
- **Models** (`app/Models/`): Eloquent models (entities)
- **Contracts** (`app/Contracts/`): Interfaces
- **Value Objects**: Immutable data structures

**Example**:
```php
class Joke extends Model {
    protected $fillable = ['setup', 'punchline', 'category'];
    
    public function isValid(): bool {
        return !empty($this->setup) && !empty($this->punchline);
    }
}
```

### 4. Infrastructure Layer

**Responsibilities**: External service interactions, data persistence

**Components**:
- **Database Migrations** (`database/migrations/`)
- **Seeders** (`database/seeders/`)
- **Providers** (`app/Providers/`)
- **Configuration** (`config/`)

## 🔄 Data Flow

### Request/Response Cycle

#### Traditional Page Load
```
1. Browser requests /contact
2. Nginx → PHP-FPM → Laravel Router
3. Route matches → Controller method
4. Controller returns Inertia::render('contact')
5. Laravel renders Blade wrapper with React root
6. React app hydrates on client
7. Page interactive
```

#### Inertia SPA Navigation
```
1. User clicks link with Inertia
2. Inertia makes XHR request with X-Inertia header
3. Laravel detects Inertia request
4. Controller returns JSON (props + component name)
5. Inertia client mounts React component with props
6. No full page reload
```

#### API Request
```
1. Client makes request to /api/random-joke
2. Laravel Router → JokeController::random()
3. Controller → JokeService::getRandomJoke()
4. Service checks cache
   ├─ Hit: Return cached data
   └─ Miss: Query database, cache result
5. Return JSON response
```

### Data Flow Diagram

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ HTTP Request
       ▼
┌──────────────────┐
│  Nginx (Port 80) │
└──────┬───────────┘
       │
       ▼
┌─────────────────────┐
│   Laravel Router    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐      ┌──────────────┐
│  Middleware Stack   │◄────►│ Auth/Session │
└──────┬──────────────┘      └──────────────┘
       │
       ▼
┌─────────────────────┐
│    Controller       │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐      ┌──────────────┐
│      Service        │◄────►│    Cache     │
└──────┬──────────────┘      └──────────────┘
       │
       ▼
┌─────────────────────┐      ┌──────────────┐
│       Model         │◄────►│   Database   │
└──────┬──────────────┘      └──────────────┘
       │
       ▼
┌─────────────────────┐
│   Response/View     │
└─────────────────────┘
```

## 🔑 Key Components

### Backend Components

#### 1. Controllers

Handle HTTP requests and return responses.

```php
// app/Http/Controllers/JokeController.php
class JokeController extends Controller {
    public function random(): JsonResponse {
        $joke = $this->jokeService->getRandomJoke();
        return response()->json($joke);
    }
}
```

#### 2. Services

Encapsulate business logic.

```php
// app/Services/JokeService.php
class JokeService {
    public function getRandomJoke(): ?Joke {
        return Cache::remember('jokes_data', 3600, 
            fn() => Joke::all()
        )->random();
    }
}
```

#### 3. Models

Represent database entities.

```php
// app/Models/Contact.php
class Contact extends Model {
    protected $fillable = [
        'first_name', 'last_name', 'email', 'message'
    ];
}
```

#### 4. Middleware

Filter HTTP requests.

```php
// Example: CORS middleware
class HandleCors {
    public function handle($request, Closure $next) {
        return $next($request)
            ->header('Access-Control-Allow-Origin', '*');
    }
}
```

#### 5. Mail

Compose emails.

```php
// app/Mail/ContactMessage.php
class ContactMessage extends Mailable {
    public function __construct(public Contact $contact) {}
    
    public function build() {
        return $this->view('emails.contact')
            ->subject('New Contact Form Submission');
    }
}
```

### Frontend Components

#### 1. Pages (Inertia)

Full-page React components.

```tsx
// resources/js/Pages/Contact.tsx
export default function Contact({ flash }) {
    return (
        <AppLayout>
            <Head title="Contact" />
            <ContactForm />
        </AppLayout>
    );
}
```

#### 2. Components

Reusable UI elements.

```tsx
// resources/js/Components/JokeCard.tsx
export function JokeCard({ joke }: { joke: Joke }) {
    return (
        <div className="rounded-lg bg-white p-6 shadow">
            <h3>{joke.setup}</h3>
            <p>{joke.punchline}</p>
        </div>
    );
}
```

#### 3. Layouts

Page structure templates.

```tsx
// resources/js/Layouts/AppLayout.tsx
export default function AppLayout({ children }) {
    return (
        <div>
            <Navigation />
            <main>{children}</main>
            <Footer />
        </div>
    );
}
```

## 💡 Design Decisions

### 1. Why Inertia.js?

**Rationale**: Provides SPA experience without building a separate API.

**Benefits**:
- No API endpoints needed for internal routes
- SSR support for SEO
- Shared state management simplified
- Type-safe props with TypeScript

**Trade-offs**:
- Coupled frontend/backend deployment
- Less suitable for mobile apps (addressed with public API endpoints)

### 2. Why Service Layer?

**Rationale**: Separate business logic from HTTP concerns.

**Benefits**:
- Reusable across controllers, commands, jobs
- Easier to test in isolation
- Clear separation of concerns

### 3. Why Module Structure?

**Rationale**: Group related files by feature, not by type.

**Benefits**:
- Easier to navigate related code
- Encourages feature cohesion
- Scales better than flat structure

**Example**:
```
✅ Good: app/Modules/Contact/Controllers/ContactController.php
❌ Bad:  app/Http/Controllers/ContactController.php (mixed with unrelated controllers)
```

### 4. Why TypeScript?

**Rationale**: Catch errors at compile-time, improve DX.

**Benefits**:
- Type safety across frontend
- Better IDE autocomplete
- Refactoring confidence
- Self-documenting interfaces

### 5. Why Redis for Cache/Queue?

**Rationale**: Fast, persistent, supports multiple data structures.

**Benefits**:
- Faster than file-based cache
- Atomic operations
- Pub/sub capabilities
- Persistent queue storage

## 🔒 Security Architecture

### 1. Input Validation

All user input is validated using Laravel Form Requests:

```php
class StoreContactRequest extends FormRequest {
    public function rules(): array {
        return [
            'email' => ['required', 'email', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ];
    }
}
```

### 2. CSRF Protection

Laravel's CSRF middleware protects all POST/PUT/DELETE requests:

```html
<!-- Automatically included by Inertia -->
<input type="hidden" name="_token" value="{{ csrf_token() }}">
```

### 3. SQL Injection Prevention

Eloquent ORM uses parameter binding:

```php
// ✅ Safe: Parameterized query
$user = User::where('email', $email)->first();

// ❌ Unsafe: Raw SQL (if misused)
DB::select("SELECT * FROM users WHERE email = '$email'"); // Never do this
```

### 4. XSS Prevention

React automatically escapes output:

```tsx
// ✅ Safe: React escapes by default
<div>{userInput}</div>

// ⚠️ Dangerous: Only use for trusted content
<div dangerouslySetInnerHTML={{ __html: trustedHtml }} />
```

### 5. SSRF Protection

Open Graph image fetcher validates URLs:

```php
// Prevent access to private/local addresses
if (filter_var($ip, FILTER_VALIDATE_IP, 
    FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) {
    throw new \Exception('Invalid or private IP address');
}
```

### 6. Rate Limiting

API endpoints are rate-limited:

```php
Route::middleware('throttle:60,1')->group(function () {
    Route::get('/api/random-joke', [JokeController::class, 'random']);
});
```

## ⚡ Performance Considerations

### 1. Caching Strategy

**Multi-Layer Caching**:

1. **OPcache**: PHP opcode cache (server-level)
2. **Redis Cache**: Application data (1-hour TTL for jokes)
3. **Browser Cache**: Static assets (1-year expiry)
4. **CDN**: (Future consideration)

**Cache Keys**:
```php
'jokes_data' => 3600,              // 1 hour
'geo_location_{ip}' => 3600,       // 1 hour
'og_fetch_{md5(url)}' => 300,      // 5 minutes
```

### 2. Database Optimization

- **Indexes**: On frequently queried columns (email, created_at)
- **Eager Loading**: Prevent N+1 queries
- **Connection Pooling**: Reuse database connections

### 3. Asset Optimization

- **Vite Code Splitting**: Automatic chunk splitting
- **Tree Shaking**: Remove unused code
- **Minification**: Compress JS/CSS
- **Image Optimization**: Compress uploaded images

### 4. Query Optimization

```php
// ✅ Good: Eager load relationships
$contacts = Contact::with('user')->get();

// ❌ Bad: N+1 query problem
$contacts = Contact::all();
foreach ($contacts as $contact) {
    $user = $contact->user; // Separate query for each
}
```

## 📈 Scalability

### Current Architecture

- **Single server** deployment
- **Vertical scaling** (increase server resources)

### Horizontal Scaling Path

When needed, the application can scale horizontally:

```
       ┌─────────────┐
       │ Load Balancer│
       └──────┬───────┘
              │
    ┌─────────┴─────────┐
    │                   │
┌───▼────┐         ┌───▼────┐
│ App    │         │ App    │
│ Server │         │ Server │
│   1    │         │   2    │
└────┬───┘         └────┬───┘
     │                  │
     └────────┬─────────┘
              │
    ┌─────────▼──────────┐
    │                    │
┌───▼────┐         ┌─────▼───┐
│ MySQL  │         │  Redis  │
│ (RDS)  │         │ (Cache) │
└────────┘         └─────────┘
```

### Scaling Strategies

1. **Database**: Read replicas, connection pooling
2. **Cache**: Redis cluster, separate cache/session stores
3. **Queue**: Multiple queue workers, separate queue servers
4. **Storage**: S3/object storage for uploads
5. **CDN**: CloudFlare for static assets

### Current Bottlenecks

1. **Database**: Single MySQL instance
2. **File Storage**: Local disk (not shared across servers)
3. **Session Storage**: Redis (single point of failure without replication)

## 📊 Monitoring & Observability

### Logging

```php
// Application logs
Log::info('Joke served', ['id' => $joke->id]);
Log::error('Failed to fetch OG image', ['url' => $url]);

// Query logs (dev only)
DB::enableQueryLog();
```

### Error Tracking

- **Laravel Log**: `storage/logs/laravel.log`
- **Web Server Logs**: Nginx access/error logs
- **PHP-FPM Logs**: PHP error logs

### Performance Monitoring

- **Laravel Telescope**: Development debugging (optional)
- **APM Tools**: New Relic, Blackfire (production)

## 🎓 Additional Resources

- [Laravel Architecture Concepts](https://laravel.com/docs/lifecycle)
- [Inertia.js How It Works](https://inertiajs.com/how-it-works)
- [React Architecture Best Practices](https://react.dev/learn/thinking-in-react)
- [Clean Architecture Principles](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

**Build with Intent! 🏗️**
