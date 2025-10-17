# Graveyard Jokes

A small Laravel-based site for sharing jokes. This repository contains a PHP (Laravel 12) backend and a small frontend using Vite + React/TSX in `resources/js`.

## Quick start

Requirements
- PHP 8.3+ (8.4 recommended)
- Composer
- Node.js (>=18, recommended 22+ to match CI runner)
- npm
- Git

Local setup
1. Clone the repo:

   git clone https://github.com/JoshuaAckerly/graveyardjokes.git
2. Install PHP dependencies:

   composer install
3. Install Node dependencies and build assets:

   npm ci
   npm run build
4. Copy environment and generate key:

   cp .env.example .env
   php artisan key:generate
5. Run tests (see Testing section below) -- PHPUnit is used for the PHP test suite.

## Development workflow
- Branching
  - Create feature branches off `main`.
  - Keep each PR small and focused. Merge order for current refactor work: PR A (mailables & contact service) → PR D (tests cleanup) → PR B (visitor fixes) → PR C (controllers hardening).

- Static analysis and baseline
  - Larastan (PHPStan) is used. Configuration is in `phpstan.neon` and the current baseline is in `phpstan-baseline.neon`.
  - To run locally:

    ./vendor/bin/phpstan analyse -c phpstan.neon --memory-limit=2G

- Formatting & linting
  - PHP: `vendor/bin/pint` (Pint auto-fixes some style errors in CI)
  - Frontend: `npm run format` (prettier) and `npm run lint` (eslint)

## Testing
- Run the PHPUnit suite locally:

  ./vendor/bin/phpunit

- Test notes:
  - The current test suite is small (9 tests). CI runs phpunit on `main` and PRs.
  - PHPUnit deprecations may appear; they should be addressed in follow-up cleanup PRs.

## CI (GitHub Actions)
- Workflows live in `.github/workflows/`:
  - `ci.yml` runs PHP checks (composer install, php -l, phpunit, phpstan) and Node checks (build & lint).
  - `tests.yml` and `lint.yml` also run on pushes/PRs for separate responsibilities.

- CI notes:
  - The workflows generate a temporary `.env` (copy `.env.example` and run `php artisan key:generate`) so tests that depend on APP_KEY behave correctly in CI.
  - If a workflow job fails to resolve an action version (e.g., `shivammathur/setup-php@v4`), use a pinned supported version (v3) or rely on the runner system PHP.

## Merging and release checklist
- Before merging to `main`:
  - Run `composer install` and `npm ci && npm run build` locally.
  - Run `./vendor/bin/phpstan analyse -c phpstan.neon` and fix any new issues.
  - Run `./vendor/bin/phpunit` and ensure tests pass.
  - Ensure the PR has a description and small, focused changes. Prefer multiple small PRs over one large refactor.

## Local troubleshooting
- If `vendor` is missing, run `composer install`.
- If Node build fails due to engine versions, try upgrading Node to match CI (22.x) or adjust local environment.

## Contributing
- Open an issue for larger changes.
- For small fixes, open a branch named `feat/<topic>` or `fix/<topic>` and create a PR.
- Keep PRs small and well-scoped. Use the PR checklist in `.github/` for required checks.

## Contact
If you need help running anything locally or want me to monitor CI runs or open follow-up PRs, tell me which task to take next.
