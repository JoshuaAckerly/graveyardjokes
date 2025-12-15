# TODO

## Maintenance Tasks

### Infrastructure
- [ ] Update Forge deployment script to use `git reset --hard` for force-push compatibility
- [ ] Verify automatic sitemap generation workflow is running correctly
- [ ] Monitor server logs for errors after deployment
- [ ] Set up automated backups verification

### Dependencies
- [ ] Monitor for security updates in npm packages
- [ ] Monitor for security updates in Composer packages
- [ ] Review and update Laravel to latest patch version when available
- [ ] Keep PHP version updated on server (currently 8.3.26)

### Performance
- [ ] Review and optimize slow database queries
- [ ] Monitor API response times
- [ ] Optimize images and assets loading
- [ ] Review and update caching strategies

### Code Quality
- [ ] Continue reducing PHPStan baseline errors (currently 36)
- [ ] Add more test coverage for edge cases
- [ ] Review and update documentation as features evolve

---

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