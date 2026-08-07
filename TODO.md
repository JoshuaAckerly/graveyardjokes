# TODO

## Maintenance Tasks

### Infrastructure
- [x] Verify automatic sitemap generation workflow is running correctly
- [ ] Monitor server logs for errors after deployment
- [x] Set up automated backups verification

### Google Business Profile Integration
- [x] OAuth flow completed — `GOOGLE_BUSINESS_CLIENT_ID`, `CLIENT_SECRET`, `REFRESH_TOKEN` all set
- [x] Reviews, business info, and posts endpoints live at `/api/business/*`
- [x] Frontend components: `GoogleReviews`, `BusinessHours`, `BusinessPosts` wired up
- [x] `GooglePlacesService` implemented as automatic fallback in `BusinessProfileController`
- [x] Places API key + Place ID obtained and set in local `.env`
- [ ] **Add `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACES_PLACE_ID` to production server `.env`**, then `php artisan cache:clear` — Places API will then serve reviews/hours as the live data source
- [ ] **GBP API quota is 0** — Google never granted access. `GOOGLE_BUSINESS_LOCATION_NAME` is blank until resolved. Options:
  - Request quota increase: https://console.cloud.google.com → APIs & Services → Quotas → `mybusinessaccountmanagement.googleapis.com`
  - Or re-apply via https://developers.google.com/my-business/content/prereqs if original request was not actioned

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

## LinkedIn Integration
- [ ] Create LinkedIn app at https://www.linkedin.com/developers/apps → add "Share on LinkedIn" product
- [ ] Add `LINKEDIN_CLIENT_ID` and `LINKEDIN_CLIENT_SECRET` to `.env`
- [ ] Run `php artisan linkedin:authorize` → copy `LINKEDIN_ACCESS_TOKEN` and `LINKEDIN_AUTHOR_URN` to production `.env` + `cache:clear`
- [ ] Note: access token expires ~60 days — re-run `linkedin:authorize` to refresh

## Automation
- [x] Add Dependabot (`.github/dependabot.yml`) for npm + composer automated dependency PRs
- [x] Add weekly scheduled production uptime check workflow (curl all subdomains, fail on non-200)
- [x] Add weekly scheduled security audit workflow (npm audit + composer audit, open issue on findings)

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