# Graveyard Jokes — Free Stock Image Shopping List (Rebrand)

Acoustic-indie, low-key, honest. Goal: a cohesive, moody-but-warm look.
Pick ONE consistent mood across all images so the site feels intentional
(see "Choose a mood" below). Grab everything from:

- **Unsplash** — https://unsplash.com  (best for moody/atmospheric)
- **Pexels** — https://pexels.com
- **Pixabay** — https://pixabay.com

All three are free for commercial use, no attribution required. Download the
**largest size** offered (you'll optimize later).

---

## Choose ONE mood (keep it consistent)

- **Dark & moody** — dim rooms, shadow, tungsten glow, film grain. Intimate, nocturnal.
- **Warm & vintage** — analog film tones, cassette/vinyl, golden light, grain. Nostalgic.
- **Minimal B&W** — high-contrast black and white, negative space. Timeless, understated.
- **Earthy / natural** — fog, forests, overcast light, muted greens/browns. Folky, acoustic.

Recommended for acoustic indie: **Warm & vintage** or **Earthy/natural**.
Whatever you pick, favor images with (1) a dominant dark or muted area where
white text sits readably, and (2) similar color temperature so they match.

---

## The image slots (what the site actually uses)

Replace these. Dimensions are targets — bigger is fine, you'll resize/convert.

### 1. Logo  ⭐ (identity-defining)
- Current: `GraveYardJokesLogoJester.svg` (jester/skull — agency era)
- Need: a simple **wordmark or symbol** for the musician brand.
- Note: stock sites are NOT ideal for a logo. Options:
  - Free logo/text: use a clean font wordmark "Graveyard Jokes" (I can build a
    text-based logo in code — no image needed).
  - Or a simple symbol (moon, moth, matchstick, single leaf) from Unsplash/Pixabay
    as PNG with transparent background (search "minimal line icon png transparent").
- Target: square-ish, transparent PNG or SVG, ~512×512.

### 2. Hero background  ⭐⭐ (biggest look-setter)
- Slot: homepage hero (`welcome.tsx`, currently `AdobeStock_327183052.webp`)
- Search: `dim room warm light`, `acoustic guitar shadow`, `foggy forest morning`,
  `analog studio night`, `vinyl record close up`, `candle low light`
- Target: **wide landscape, ~2400×1400** (it's shown as a wide banner, top-cropped).
- Must have a darker zone for the headline text to sit on.

### 3. Carousel images ×3
- Slot: homepage carousel (`carousel.tsx`)
  1. "Follow along" — search `phone film photo`, `hands writing lyrics`, `notebook pen dim`
  2. "Songs in progress" — search `acoustic guitar hands`, `home recording setup`, `piano keys warm`
  3. "Games / building" — search `desk night coding warm`, `retro game controller moody`
- Target: **landscape ~1600×900** each, same mood/temperature as the hero.

### 4. About / section banner
- Slot: about page banner (`about.tsx`, `aboutBanner.webp`)
- Search: `songwriting quiet`, `two people music`, `guitar case road`, `soft window light room`
- Target: **wide ~2000×1000**.

### 5. Section / services image
- Slot: `services.tsx` (`AdobeStock_949366383.webp`) — parked commerce section
- Search: same mood; something neutral like `texture paper grain`, `merch mockup blank`
- Target: **~1600×1000**. Low priority (parked).

### 6. Portfolio / games placeholder
- Slot: fallback when a project has no preview (`ProjectCard.tsx`,
  `portfolio-placeholder.webp` / `AdobeStock_471779082.webp`)
- Search: `abstract dark texture`, `grain gradient moody`
- Target: **~1200×800**. A clean abstract texture works great here.

### 7. (Optional) Contact snapcode / social
- Already uses icon CDNs; usually no new image needed.

---

## Naming convention (grab-as-you-go)

Rename files as you download so wiring them in is painless:

- `logo.png` (or we do a text logo)
- `hero.webp`  (or hero.jpg — we convert)
- `carousel-1.jpg`, `carousel-2.jpg`, `carousel-3.jpg`
- `about-banner.jpg`
- `services.jpg`
- `portfolio-placeholder.jpg`

Put them all in one folder, e.g. `~/Documents/graveyardjokes-new-images/`.

---

## Quick sourcing tips

- On Unsplash, click a photo → **Download free** → choose the largest.
- Prefer photos with **space/negative area** for text overlays (hero, banners).
- Grab **2–3 candidates per slot** so you can pick the set that matches best.
- Keep an eye on **color temperature** — mixing cold-blue and warm-orange photos
  is the #1 thing that makes a site feel incoherent.

---

## When you have them

Tell me the folder path. I'll then:
1. Optimize + convert to `.webp` at the right sizes.
2. Drop them into the project and update all code references.
3. Upload to your CDN/S3 bucket (`graveyardjokes-cdn`).
4. (Then we can do the scroll animations on top of the new look.)
