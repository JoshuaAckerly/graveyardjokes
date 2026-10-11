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
      Before dropping: complete an isolated restore test of the fresh final dump below.
- [ ] Remove DNS record for `auth-system.graveyardjokes.com` (currently harmless; redirects).
- [ ] Optional tidy: collapse the `auth` DB connection into the default connection and
      remove `protected $connection = 'auth'` from User/PageSeo/SiteVisit + `config/auth.php`.

## Fresh final dump

- [x] Final dump taken 2026-10-11 18:33 UTC from production database `auth_system`.
- File: `/var/www/backups/auth-system-retirement-20261011/auth_system.final_20261011T1833Z.sql.gz`
- Size: 3,553,598 bytes (about 3.39 MiB compressed).
- SHA-256: `a5875d84a7c1479d08cc45a1c720a8c29f870283882da72c73438a493bc3ca16`
- Integrity: `gzip -t` passed; dump header identifies `auth_system`; 16 table
  definitions and 45 insert statements are present.
- Permissions: backup file `0600`, containing directory `0700` (`ubuntu:ubuntu`).
- Restore has **not** been tested. Keep `auth_system` until a restore test into an
  isolated database succeeds and the production soak period is accepted.

## Backups / rollback path
- DB dumps + old .env + nginx config backup:
  `/var/www/backups/db-consolidation-20260918_181111/` on prod (3.151.185.242)
  - `auth_system.20260918_181111.sql.gz` (3.4M)
  - `graveyardjokes.20260918_181111.sql.gz` (178K)
