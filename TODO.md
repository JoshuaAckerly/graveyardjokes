# TODO

## Maintenance Tasks

### Infrastructure
- [x] Verify automatic sitemap generation workflow is running correctly
- [ ] Monitor server logs for errors after deployment
- [x] Set up automated backups verification

### Google Business Profile Integration
- [ ] **Awaiting Google API access approval (7–10 days from May 28, 2026)**
- [ ] Once approved: run `php artisan google-business:list-locations` to get `GOOGLE_BUSINESS_LOCATION_NAME` and add to `.env`
- [x] ~~Wire up Google Places API fallback~~ — `GooglePlacesService` implemented, `BusinessProfileController` falls back automatically when GBP is unavailable
  - Enable Places API in Google Cloud Console
  - Create a restricted API key (Places API only, IP-restricted)
  - Find Place ID via https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder
  - Add `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACES_PLACE_ID` to `.env` (already in `.env.example`)

### Dependencies
- [ ] Monitor for security updates in npm packages
- [ ] Monitor for security updates in Composer packages
- [ ] Review and update Laravel to latest patch version when available
- [ ] Keep PHP version updated on server (currently 8.4 — see ARCHITECTURE.md)

### Performance
- [ ] Review and optimize slow database queries
- [ ] Monitor API response times
- [ ] Optimize images and assets loading
- [ ] Review and update caching strategies

### Code Quality
- [x] Continue reducing PHPStan baseline errors (baseline cleared — 0 errors at level max)
- [ ] Add more test coverage for edge cases
- [ ] Review and update documentation as features evolve
- [x] Update all documentation to reflect Linux backend setup (remove Windows references)

---

## Automation
- [ ] Add Dependabot (`.github/dependabot.yml`) for npm + composer automated dependency PRs
- [ ] Add weekly scheduled production uptime check workflow (curl all subdomains, fail on non-200)
- [ ] Add weekly scheduled security audit workflow (npm audit + composer audit, open issue on findings)

## Completed Items

### Testing ✅
- [x] Add unit tests for models
- [x] Add unit tests for services
- [x] Add unit tests for controllers
- [x] Add feature tests for API endpoints
- [x] Add frontend component tests (MobileMenu, Carousel, ApplicationLogo)
- [x] Add frontend page tests (Welcome, About, Portfolio)
- [x] Fix import.meta.env mocking in Jest for component/page tests that use Vite env vars

### Code Quality ✅
- [x] Address PHPUnit deprecations
- [x] Review and update phpstan baseline (75 → 36 errors, 51% reduction)
- [x] Add type hints where missing
- [x] Fix ESLint and TypeScript errors
- [x] Format code with Prettier

### Development ✅
- [x] Complete PR A (mailables & contact service)
- [x] Complete PR D (tests cleanup)
- [x] Complete PR B (visitor fixes)
- [x] Complete PR C (controllers hardening)

### Documentation ✅
- [x] Add API documentation
- [x] Document deployment process
- [x] Add contributing guidelines

### Project Cleanup ✅
- [x] Remove generated/temporary files
- [x] Update .gitignore for generated files
- [x] Organize documentation files
- [x] Fix all linting and type errors