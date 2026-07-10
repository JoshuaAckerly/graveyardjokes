# graveyardjokes

## Purpose
Joke-sharing platform and web development services portfolio site. Doubles as a client-facing showcase for Graveyard Jokes Studios' development services.

## Tech Stack
- **Backend**: Laravel 12, PHP 8.2+, Sanctum (session), Spatie Sitemap, Google Analytics Data API
- **Frontend**: React 19, TypeScript 5.7, Inertia.js 3, Tailwind CSS 4, Vite
- **Testing**: PHPUnit 11 (`php artisan test`), Vitest + React Testing Library, Playwright (E2E)
- **Storage**: MySQL (prod), SQLite (tests), AWS S3 (OG images), Redis (optional)
- **Integrations**: PayPal, Google Analytics Data API, auth-system SSO proxy

## Architecture

### Module Pattern
Business logic is organized into `app/Modules/` with self-contained sub-directories:
- `app/Modules/Contact/Controllers/ContactController.php`
- `app/Modules/Visitor/Controllers/VisitorController.php`

### Services Layer (`app/Services/`)
- `AuthSystemService` — proxies auth calls to the centralized auth-system API
- `GoogleAnalyticsService` — wraps Google Analytics Data API
- `ContactService` — handles contact form delivery
- `VisitorService` — geolocation + visitor tracking logic

### Controllers (`app/Http/Controllers/`)
- `JokeController` — serves random jokes (JSON API via `GET /api/random-joke`)
- `OgImageController` — fetches and disk-caches external OG images (`GET /api/fetch-og-image`)
- `WebsiteIntakeController` — website project intake form submissions
- `Api/UserProxyController`, `Api/MessageProxyController` — proxies to auth-system, protected by `auth-system` middleware

### Models (`app/Models/`)
- `User`, `Contact`, `WebsiteIntakeSubmission`

### Routes
- `routes/web.php` — Inertia pages: home, about, contact, portfolio, services, sitemap. Includes `www.` subdomain redirect (301).
- `routes/api.php` — OG image fetch, visitor tracking (throttle 60/min), random joke, auth-system proxy routes

### Frontend (`resources/js/`)
- Pages: `pages/` (welcome, about, contact, portfolio, services)
- Components: `components/`
- Hooks: `hooks/`
- Types: `types/`
- Utils: `utils/`, `lib/`, `data/`
- SSR entry: `ssr.tsx`
- Tests: `__tests__/`

## Key Patterns
- Auth for this app is handled entirely by **auth-system** via `AuthSystemService`. Do not add local auth logic.
- Visitor tracking uses `throttle:60,1` middleware and accepts both `POST` and `OPTIONS` (CORS preflight).
- OG images are fetched server-side and cached to disk/S3 to avoid CORS issues on the frontend.
- Ziggy routes are typed — always use `route('name')` helper in TypeScript.

## Build & Test
```bash
php artisan test
npm run test            # Vitest
npm run build:ssr       # Production SSR build
npm run capture:homepages   # Screenshot utility (scripts/capture-homepages.mjs)
npm run organize:s3     # Dry-run S3 image organizer
npm run organize:s3:execute  # Execute S3 reorganization
```

## Notable Files
- `deploy-production.sh` — production deployment script
- `deploy-test.sh` — test server deployment
- `scripts/` — S3 organizer, homepage capture utilities
- `openapi.yaml` — API spec
- `phpstan.neon` / `phpstan-baseline.neon` — static analysis config
