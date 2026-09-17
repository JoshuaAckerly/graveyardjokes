# Deploy Checklist — Consolidated Graveyard Jokes

One app now contains: the **music site**, the former **studio** (blog, feeds,
gallery, newsletter under `/studio/*`), and the former **auth-system** (native
in-app auth, analytics, social scheduling, admin). Paline is untouched and
independent.

Work is on the local branch **`merge-auth`** (built on `merge-studio`), NOT pushed
and NOT deployed. This checklist is what to do when you're ready to ship.

---

## 0. Pre-deploy — code

- [ ] Review the branch history:
      `git log --oneline main..merge-auth`
      (rebrand → studio merge → auth merge, several commits).
- [ ] Merge `merge-auth` → `main` (or open a PR):
      `git checkout main && git merge --no-ff merge-auth`
- [ ] Push: `git push origin main`
- [ ] Confirm CI passes (GitHub Actions in `.github/workflows`).
- [ ] Add the missing composer dep for newsletter email (only if sending newsletters):
      `composer require resend/resend-laravel` (config/mail.php already references
      the `resend` mailer but the package isn't installed).

## 1. Database (CRITICAL — preserves your users)

The app reads users/analytics/SEO/purchases from the **`auth` connection**
(the existing `auth_system` database). Everything else uses the default DB.

- [ ] **Back up both production databases** before anything (users live in
      `auth_system`; app content in the graveyardjokes DB).
- [ ] Set the `auth` connection env on production so it points at the real
      `auth_system` DB:
      `AUTH_DB_HOST`, `AUTH_DB_PORT`, `AUTH_DB_DATABASE=auth_system`,
      `AUTH_DB_USERNAME`, `AUTH_DB_PASSWORD` (or `AUTH_DB_URL`).
- [ ] Set the default `DB_*` connection for graveyardjokes' own tables.
- [ ] Run migrations: `php artisan migrate --force`
      New tables created on the default DB: `blog_posts`, `subscribers`,
      `tiktok_videos`, `discord_posts`, `instagram_posts`, `facebook_gallery_posts`.
      `site_visits` migration is **idempotent** — it skips if the table already
      exists on the auth DB (it does), so existing analytics is preserved.
- [ ] Confirm the password-reset broker connection: `config/auth.php` pins
      `passwords.users.connection = auth` (tokens store with users). No action
      unless you override `AUTH_PASSWORD_RESET_CONNECTION`.

## 2. Sessions & auth (the 419 fix)

- [ ] **`SESSION_DOMAIN`** must match production, e.g. `.graveyardjokes.com`
      (it was previously `.ad.graveyardjokes.com`, which breaks cookies/CSRF →
      419 on login). This was the local login bug — do NOT repeat it in prod.
- [ ] `SESSION_DRIVER=database` needs a `sessions` table on the default DB
      (exists). Confirm after migrate.
- [ ] `APP_URL=https://graveyardjokes.com`, `APP_ENV=production`, `APP_KEY` set.
- [ ] **`ADMIN_EMAIL`** = the account that should see `/admin/*`
      (e.g. `admin@graveyardjokes.com`). Analytics/Social-schedule are gated on it.

## 3. Mail (for password reset + newsletter)

- [ ] Set a working mailer. Default is currently `smtp`; either provide valid
      `MAIL_*` SMTP creds, or set `MAIL_MAILER=resend` + `RESEND_KEY` (and install
      `resend/resend-laravel` per §0).
- [ ] `MAIL_FROM_ADDRESS` / `MAIL_FROM_NAME` set.
- [ ] Test: trigger `/forgot-password` and confirm an email arrives.

## 4. Social feeds & scheduler (optional — feeds are empty until synced)

- [ ] Env for the feeds you want live:
      TikTok: `TIKTOK_USERNAME`, `TIKTOK_ACCESS_TOKEN`
      Discord: `DISCORD_BOT_TOKEN`, `DISCORD_CHANNEL_ID`
      Instagram: `INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_USER_ID`
      Facebook: `FACEBOOK_PAGE_ACCESS_TOKEN`, `FACEBOOK_PAGE_ID` (+ app id/secret)
- [ ] `CLOUDFRONT_DOMAIN` + S3 (`AWS_*`, `AWS_BUCKET`) for gallery/thumbnails.
- [ ] Run initial syncs: `php artisan tiktok:sync-posts`, `discord:sync-posts`,
      `instagram:sync-posts`, `facebook:sync-posts` (+ `*:fetch-thumbnails`).
- [ ] Ensure the scheduler runs (`php artisan schedule:run` via cron). It fires
      `social:dispatch`, `app:send-pending-newsletters`, sitemap regen — all
      gated to `environments(['production'])`.

## 5. Assets & build

- [ ] `composer install --no-dev --optimize-autoloader`
- [ ] `npm ci && npm run build:ssr` (produces client + SSR bundles).
- [ ] Start/refresh the Inertia SSR process (`php artisan inertia:start-ssr`)
      per your existing deploy scripts.
- [ ] `php artisan optimize` (config/route/view cache). Re-run on each deploy.
- [ ] Upload any new CDN images if changed (hero/carousel/about already uploaded).

## 6. Routing / DNS / redirects (retire the old subdomains)

- [ ] Point/keep `graveyardjokes.com` at the merged app.
- [ ] **Redirect old subdomains** to the merged paths (301):
      `auth-system.graveyardjokes.com/*` → `graveyardjokes.com/{login,register,...}`
      `studio.graveyardjokes.com/*` → `graveyardjokes.com/studio/*`
      (nginx server blocks or app-level redirects.)
- [ ] Old removed pages already return 410 in-app: `/services*`, `/portfolio`,
      `/linkedin`. `/links` 301s to `/studio`. Verify post-deploy.
- [ ] TLS cert covers graveyardjokes.com (+ www). Note: Paline shares this cert
      and uses `paline-preview.graveyardjokes.com` — don't remove that.

## 7. Smoke test after deploy

- [ ] Public: `/`, `/about`, `/contact`, `/studio`, `/studio/blog` → 200.
- [ ] Removed: `/services`, `/portfolio`, `/linkedin` → 410; `/links` → 301 `/studio`.
- [ ] Auth: log in with an existing user → dashboard renders (no 419).
- [ ] Admin: as `ADMIN_EMAIL`, `/admin/analytics` + `/admin/social-schedule` load;
      as a non-admin, they 403.
- [ ] Password change at `/settings/password`; forgot-password sends email.
- [ ] Analytics records a new visit (visit a page, check `/admin/analytics`).
- [ ] Paline still works (independent — should be unaffected).

## 8. Retire old projects (after cutover is verified)

- [ ] `studio` repo/folder — already deleted locally; retire its production
      deploy + subdomain once redirects are confirmed.
- [ ] `auth-system` repo/folder — retire its production deploy + subdomain once
      login works on graveyardjokes and sessions/tokens are confirmed. Keep the
      GitHub repo as an archive.
- [ ] Do NOT decommission the `auth_system` **database** — the merged app still
      uses it (users/analytics/SEO) via the `auth` connection.

## 9. Rollback plan

- [ ] Keep the DB backups from §1.
- [ ] If auth breaks post-deploy, the fastest revert is redeploying the previous
      `main` and re-pointing DNS to the old auth-system/studio apps (still in git).
- [ ] Session/token note: switching to native in-app auth invalidates old
      auth-system sessions — users log in once more. This is expected, not a bug.

---

### Known follow-ups (not blockers)
- Messages/notifications feature was removed (NotificationBell). Re-add as a
  native feature later if wanted.
- `env.ts` still exports an unused `getAuthSystemUrl` helper (harmless).
- Legal pages still carry some "Studios Inc." wording — cosmetic.
