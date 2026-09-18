# auth-system Retirement — Remaining Follow-ups

Migration/consolidation completed: 2026-09-18 ~18:11 UTC.
Users (15) + site_visits (~173k) + page_seos moved from `auth_system` DB into the
`graveyardjokes` DB. App repointed via `AUTH_DB_DATABASE=graveyardjokes`. Service
retired (no process/dir; nginx 301-redirects all auth-system URLs to graveyardjokes).
GitHub repos `auth-system` and `studio` archived.

## Done
- [x] DB consolidation (users, site_visits, page_seos, personal_access_tokens)
- [x] Repoint `AUTH_DB_DATABASE=graveyardjokes` + config:cache; verified login/admin/analytics
- [x] Remove dead auth-system code refs (graveyardjokes + packages), committed & pushed
- [x] Service retirement verified; nginx dead `root`/`index` directives tidied
- [x] Archived GitHub repos: auth-system, studio

## Pending — after a few days' soak (destructive / irreversible)
- [ ] **DROP DATABASE `auth_system`** — the point of no return. Do only AFTER real users
      have logged in successfully against the graveyardjokes DB and no issues surface.
      Before dropping: verify backup is restorable + take a fresh final dump.
- [ ] Remove DNS record for `auth-system.graveyardjokes.com` (currently harmless; redirects).
- [ ] Optional tidy: collapse the `auth` DB connection into the default connection and
      remove `protected $connection = 'auth'` from User/PageSeo/SiteVisit + `config/auth.php`.

## Backups / rollback path
- DB dumps + old .env + nginx config backup:
  `/var/www/backups/db-consolidation-20260918_181111/` on prod (3.151.185.242)
  - `auth_system.20260918_181111.sql.gz` (3.4M)
  - `graveyardjokes.20260918_181111.sql.gz` (178K)
