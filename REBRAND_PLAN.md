# Graveyard Jokes — Rebrand Plan: Web Agency → Musician

Status: DRAFT for review. Nothing will be changed or deleted until you approve.

## 1. Goal

Turn `graveyardjokes` from a web-design/agency portfolio site into a **musician's
site + personal creative hub**. Stop pushing website-building as a service.
Keep helping people who ask (teach-them + hosting), but that is no longer the pitch.
Lean into **music** and **game development**, and give yourself a private space for
routines/schedules to stay motivated.

Alongside this, cleanly retire 5 decommissioned projects from the codebase, then
delete their local folders (they live in git + production, so local deletion is safe).

- KEEP: `graveyardjokes`, `paline`, `auth-system`, `noteleks`, `studio`
- DELETE (local folders, last step): `lunarblood`, `synthveil`, `velvetradio`,
  `hollowpress`, `thevelvetpulse`

## 2. What graveyardjokes is today (verified in code)

- Laravel 12 + React 19 + Inertia SSR, Tailwind 4, deployed at graveyardjokes.com.
- Pages: `welcome`, `about`, `services` (+ starter/professional/premium/modernization/seo/
  maintenance), `portfolio`, `studio`, `contact`, `linkedin`, legal pages, admin.
- Commerce: PayPal checkout, service packages, website-intake flow.
- `portfolioItems.ts` lists the client/portfolio work — including all 5 doomed projects
  plus Paline.
- Nav (`Menu.tsx`): Home / About / Contact / Portfolio / Services / Studio / Login.
- Cross-project glue: `vite.config.ts`, `config/sitemaps.php`, `.github/workflows/
  uptime-check.yml`, `scripts/organize-s3-images.mjs` all enumerate the 5 projects.

## 3. Confirmed decisions

1. **Artist name:** keep **"Graveyard Jokes"**.
2. **Music direction:** **acoustic indie**, written as a **two-person songwriting team**
   (with sister). **No shows and no recordings yet** — keep the presence **low and honest**,
   add more over time. No fake tour dates / discography / coming-soon-EP hype.
3. **Commerce:** **keep** PayPal/commerce infrastructure for **future merch**
   (no active agency service selling; merch not built yet — keep plumbing, hide/park UI).
4. **Portfolio page:** convert to a **dev/games showcase** — keep **Paline** as a real
   entry, drop the 5 dead projects.
5. **Music features:** **Links hub** page (Spotify/Apple/YouTube/socials) + coming-soon EP
   presence. (Player/shows/EPK/mailing list: not now unless you add them.)
6. **Games:** **section now**, featuring **noteleks**.
7. **Routine/schedule app:** lives in **auth-system** (not graveyardjokes).
8. **business-documents:** **clean out** the 5 dead projects' folders.

### 3b. Consolidation (SEPARATE, LARGER EFFORT — planned, not part of rebrand)
User also wants to eventually **merge studio + auth-system + graveyardjokes into one
site**. This is NOT part of the rebrand and will get its own design doc, because:
- **auth-system is a shared service.** Verified: graveyardjokes AND studio (and the
  doomed projects) all call it via `AuthSystemService`, `ReportVisitToAuthSystem`,
  and `config('services.auth_system.url')`. graveyardjokes redirects
  login/register/forgot/reset to `auth-system.graveyardjokes.com`.
- Merging a shared auth provider into one consumer affects every other consumer's
  login + visitor tracking, plus DB/session/migration/subdomain routing.
- Recommendation: **rebrand + cleanup first (this doc), consolidation second (own doc)**.

## 4. Reference cleanup map (the 5 doomed projects)

Grep across the workspace found ~387 files. They fall into 3 buckets:

### Bucket A — LIVE CODE in kept projects (MUST fix; breakage risk)
- `graveyardjokes/vite.config.ts` (15) — build/proxy/subdomain config
- `graveyardjokes/resources/js/data/portfolioItems.ts` (5) — portfolio entries
- `graveyardjokes/resources/js/pages/about.tsx` (8)
- `graveyardjokes/resources/js/pages/studio.tsx` (5)
- `graveyardjokes/config/sitemaps.php` (5) — subdomain sitemap list
- `graveyardjokes/.github/workflows/uptime-check.yml` (5) — CI uptime targets
- `graveyardjokes/scripts/organize-s3-images.mjs` (12)
- `auth-system/database/seeders/PageSeoSeeder.php` (127) — SEO seed rows
- `studio/scripts/seed_blog_post.php`, `studio/database/migrations/*add_july_2026_blog_post*`
- workspace `scripts/*.sh` (portfolio-monitoring, friday-gate-check, commit-all,
  update-project-docs, create-legal-docs) — enumerate project lists

### Bucket B — HISTORICAL DOCS (optional; cosmetic, no runtime impact)
- `Sprint_Boards/**`, `docs/reports/**`, `docs/planning/**`, `monitoring-history/**`,
  `business-documents/**`, `WORKSPACE_STATUS.md`, `WORKSPACE_AI_INSTRUCTIONS.md`,
  `.instructions.md`, `docs/QUICK_REFERENCE.md`, etc.
- Recommendation: leave as historical record, OR do a light pass to drop dead entries
  from active reference docs (QUICK_REFERENCE, WORKSPACE_STATUS, monitoring scripts).
  Your call.

### Bucket C — INSIDE the doomed projects themselves (ignore)
- Everything under `lunarblood/`, `synthveil/`, `velvetradio/`, `hollowpress/`,
  `thevelvetpulse/` — deleted wholesale in the final step.

## 5. Execution phases (after you approve section 3)

### Phase 1 — Codebase reference cleanup (kept projects only)
- Remove the 5 projects from `portfolioItems.ts`, `about.tsx`, `studio.tsx`,
  `vite.config.ts`, `config/sitemaps.php`, `uptime-check.yml`, `organize-s3-images.mjs`.
- Clean `auth-system` PageSeoSeeder + `studio` seeds/migrations of dead project rows.
- Update workspace `scripts/*.sh` project lists.
- Regenerate/prune sitemap subdomain list.

### Phase 2 — Rebrand content/identity (per your section 3 answers)
- Rewrite `welcome`, `about`, nav (`Menu.tsx`/`MobileMenu.tsx`) for musician identity.
- Add/replace pages: Music/Releases, Shows (optional), Links hub, Games (optional).
- Decide services/commerce fate (remove or slim down per 3.3).
- Update meta/OG/SEO, titles, `app.blade.php`, favicons/logo as needed.
- (Optional) personal routine/schedule area behind auth.

### Phase 3 — Verify
- `npm run build`, `npm run types`, `npm run test` (vitest), PHP tests if touched.
- Fix anything the rebrand broke (routes, imports, SSR).

### Phase 4 — Delete local folders (only after Phases 1–3 verified)
- Confirm each of the 5 has a clean git remote + is on production.
- `rm -rf` the 5 local directories.
- Optional: remove their `business-documents/<project>` folders too (your call).

## 6. Safety notes

- No deletions until the codebase is clean and the build passes.
- Deletion is local only; code remains in git remotes + production.
- Historical docs (Bucket B) are left intact unless you say otherwise.
- Each phase is committed separately so anything is easy to roll back.
