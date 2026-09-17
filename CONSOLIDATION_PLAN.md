# Consolidation Plan — Merge graveyardjokes + auth-system + studio

Status: DRAFT for review. No code changes until the approach in §6 is chosen.

## 1. Goal
Collapse three separate Laravel apps into ONE application:
- `graveyardjokes` (main music site) — becomes the host app
- `auth-system` (shared auth + analytics + SEO + messaging service)
- `studio` (behind-the-scenes: blog, TikTok/Discord/Facebook/Instagram feeds, gallery)

One codebase, one deploy, one database. Everything served under graveyardjokes.com
(studio + auth as path prefixes or subdomains of the single app).

## 2. Verified current state (what each app owns)

### graveyardjokes (host)
- Laravel 12 + React 19 + Inertia SSR. The rebranded music site.
- Talks to auth-system via: `AuthSystemService`, `UserProxyController`,
  `MessageProxyController`, `ReportVisitToAuthSystem` job, `TrackSiteVisit` +
  `RequireAuthSystemToken` middleware, `AuthSystemServiceProvider`, and
  login/register/forgot/reset **redirects** in routes/web.php.
- `config/database.php` defines a **separate `auth_system` DB connection**.

### auth-system (provider — the risky one)
- Owns tables: `users`, `personal_access_tokens` (Sanctum), `purchases` (PayPal),
  `site_visits` (analytics), `admin_messages`, `admin_message_reads`,
  `user_messages`, `page_seos` (central SEO manager), plus jobs/cache.
- Owns routes: `web.php`, `api.php`, `auth.php` (login/register/dashboard/profile/
  admin messages/analytics/SEO). This is where users actually authenticate.
- React (Inertia) admin UI (Pages/Admin/Seo, etc.).

### studio (consumer)
- Laravel + React. Blog (BlogPost), TikTok/Discord/Facebook/Instagram sync
  commands, image gallery, newsletter.
- Talks to auth-system via `AuthSystemService`, `MessageProxyController`,
  `ReportVisitToAuthSystem`, `TrackSiteVisit`.

### Paline (DO NOT TOUCH — confirmed independent)
- Does NOT authenticate through auth-system (no AuthSystemService, no auth API calls).
- Only shares the `graveyardjokes.com` domain/SSL cert + a `paline-preview`
  subdomain + a footer link. The merge will NOT affect Paline's auth.
- ⚠️ Caveat: if we ever change/retire the shared `graveyardjokes.com` SSL cert or
  the `paline-preview.graveyardjokes.com` subdomain, Paline's preview is affected.
  The app-merge itself does not require touching those, so Paline stays safe.

## 3. Why this is the highest-risk change
- auth-system is the **identity provider**. If login/session/token handling breaks
  during the merge, you (and admin flows) get locked out until fixed.
- Three separate MySQL databases must become one (or one app must own multiple
  connections). Table-name collisions are likely: **all three have Laravel's default
  `users`, `jobs`, `cache`, `sessions`, `personal_access_tokens`, `migrations`.**
- Auth model: today apps are cross-origin and use **token/proxy** patterns
  (RequireAuthSystemToken, UserProxyController). Merged into one app, auth becomes
  in-process (native Laravel session/guard) — a real behavioral change.
- Production cutover: DNS/nginx for auth-system.graveyardjokes.com and
  studio.graveyardjokes.com must be re-pointed, and existing user sessions/tokens
  may be invalidated.

## 4. Data ownership after merge (proposed)
Single DB. Namespaced/kept tables:
- Auth: `users`, `personal_access_tokens`, `sessions`, `password_reset_tokens`
- Commerce: `purchases`
- Analytics: `site_visits`
- Messaging: `admin_messages`, `admin_message_reads`, `user_messages`
- SEO: `page_seos`
- Content (from studio): `blog_posts`, gallery/social tables
- Framework: one set of `jobs`, `cache`, `migrations`
Collisions to resolve: studio + graveyardjokes each have their own migrations set
and possibly their own `users`/content tables — must reconcile to one schema.

## 5. URL / routing target (proposed)
Single app, routes grouped:
- `/` … music site (current graveyardjokes)
- `/studio/*` … studio content (blog, feeds, gallery) — moved from subdomain to path
- `/login`, `/register`, `/dashboard`, `/admin/*` … auth + admin (from auth-system)
Redirects: `auth-system.graveyardjokes.com/*` → `graveyardjokes.com/*`,
`studio.graveyardjokes.com/*` → `graveyardjokes.com/studio/*` (301).

## 6. Approach options (PICK ONE)

### Option A — Full merge into graveyardjokes, native in-process auth (biggest win, biggest risk)
Bring auth-system's models/migrations/routes/controllers and studio's content into
graveyardjokes. Replace the token/proxy pattern with native Laravel auth. Remove
AuthSystemService/proxy controllers. One DB. Re-point DNS.
- Pros: true single app, simplest long-term, no cross-app calls.
- Cons: largest change; auth behavior changes; session/token migration; highest
  cutover risk.

### Option B — Monorepo, keep 3 apps but one repo/deploy (staged)
Combine into one repository + one deploy pipeline, but keep the apps as separate
Laravel modules/services initially. Merge databases later.
- Pros: much lower risk; incremental; reversible.
- Cons: not a true single app yet; still has internal boundaries.

### Option C — Absorb studio now, defer auth-system (recommended first step)
Merge **studio → graveyardjokes** first (studio is a pure consumer, low risk),
prove the pattern, then tackle auth-system as a second, carefully-staged phase.
- Pros: delivers visible consolidation fast, low risk, keeps identity provider
  stable while we learn; auth merge done deliberately afterward.
- Cons: two phases instead of one.

## 7. Recommended path
**Option C, then A.**
1. Phase 1: absorb `studio` into graveyardjokes under `/studio/*` (content, feeds,
   gallery, blog). Reconcile migrations. Verify. Redirect studio subdomain.
2. Phase 2: absorb `auth-system` — migrate to native in-process auth, move
   users/purchases/analytics/SEO/messaging tables, remove proxy layer, re-point DNS,
   plan session/token cutover. Done as its own reviewed step with a rollback plan.

## 8. Pre-flight safety checklist (before ANY code)
- [ ] All three repos committed + pushed (clean working trees, on git remotes).
- [ ] Production DB backups for all three taken.
- [ ] Confirm we work on a NEW branch, not main.
- [ ] Confirm staging/local verification path (can we run the merged app locally
      end-to-end before touching prod?).
- [ ] Confirm nobody else / no live traffic mid-migration.

## 9. Open decisions for you
1. Which approach — A (full now), B (monorepo), or C (studio first, recommended)?
2. Studio URL: path `/studio/*` on the main app, or keep a studio subdomain pointing
   at the same app?
3. Auth: OK to switch from the token/proxy model to native in-app login? (Simpler,
   but changes how login works and may log existing users out once.)
4. Is there live production data (real users, purchases, analytics) that must be
   migrated and preserved, or can the merged app start fresh?
5. Timeline: do this locally first and verify before any production cutover? (Strongly
   recommended.)
