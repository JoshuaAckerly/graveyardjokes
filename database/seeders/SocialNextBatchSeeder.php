<?php

namespace Database\Seeders;

use App\Models\SocialScheduledPost;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

/**
 * Schedules the May 21–25, 2026 social media batch for Graveyard Jokes Studios.
 *
 * Platforms: Facebook, Discord, Twitter/X, Instagram (4 unique posts per day — 20 total)
 * Schedule:  Daily at 11:00 AM
 * Instagram: Images served from public/storage/instagram/
 *
 * Content themes:
 *   May 21 — First Impressions & Credibility
 *   May 22 — Mobile-First Design
 *   May 23 — UX ROI
 *   May 24 — eCommerce & Conversion
 *   May 25 — SEO & Page Speed
 *
 * Run on production only — exactly once:
 *   php artisan db:seed --class=SocialNextBatchSeeder
 *
 * Re-running this seeder will be blocked by the duplicate guard in SocialScheduleController
 * and SocialSchedule, but the model has no DB-level unique constraint — run it once.
 */
class SocialNextBatchSeeder extends Seeder
{
    private const SITE = 'https://graveyardjokes.com';

    private const IMAGES = [
        self::SITE.'/storage/instagram/Copilot_20260516_201107.png',
        self::SITE.'/storage/instagram/Copilot_20260516_201400.png',
        self::SITE.'/storage/instagram/Copilot_20260516_201630.png',
        self::SITE.'/storage/instagram/Copilot_20260516_201805.png',
        self::SITE.'/storage/instagram/Copilot_20260516_201915.png',
    ];

    public function run(): void
    {
        $days = [
            Carbon::parse('2026-05-21 11:00:00'),
            Carbon::parse('2026-05-22 11:00:00'),
            Carbon::parse('2026-05-23 11:00:00'),
            Carbon::parse('2026-05-24 11:00:00'),
            Carbon::parse('2026-05-25 11:00:00'),
        ];

        $posts = [

            // ═══════════════════════════════════════════════════════════════
            // DAY 1 — May 21 · THEME: First Impressions & Credibility
            // ═══════════════════════════════════════════════════════════════

            [
                'platform'     => 'facebook',
                'scheduled_at' => $days[0],
                'media_url'    => null,
                'content'      => <<<'POST'
75% of people judge a business's credibility based on its website design.

That is not a UX statistic. That is a sales statistic.

Before a prospect reads your pricing, your services, or your story — they have already decided whether to trust you based on how your site looks and feels. And 94% of first impressions are design-related. Users form that opinion in about 3.5 seconds.

At Graveyard Jokes Studios, every project starts from the same foundation: design that communicates credibility before a visitor clicks anything.

If your website does not match the quality of what you actually do, that gap is costing you clients you never knew were there.

Web Development · Web Design · eCommerce · SEO
Packages starting at $799. Currently taking on new clients.

🌐 graveyardjokes.com

#WebDesign #SEO #SmallBusiness #BrandStrategy
POST,
            ],

            [
                'platform'     => 'discord',
                'scheduled_at' => $days[0],
                'media_url'    => null,
                'content'      => <<<'POST'
Something I think about a lot when building client sites:

**75% of people judge a business's credibility based on its website design.**

Not the copy. Not the offer. The *design*.

94% of first impressions are design-related — users have already decided whether they trust you before they've read a single sentence. And 88% won't come back after a bad experience.

What this means in practice: visual credibility is the conversion layer most developers leave to the end. It should be baked in from the start — layout decisions, font hierarchy, spacing, color discipline. These are not cosmetic choices. They are sales decisions.

That's the thinking behind every project I build at Graveyard Jokes Studios.

🌐 **graveyardjokes.com**

#WebDesign #BrandStrategy #BuildInPublic
POST,
            ],

            [
                'platform'     => 'twitter',
                'scheduled_at' => $days[0],
                'media_url'    => null,
                'content'      => <<<'POST'
75% of people judge a business's credibility based on its website design.

That's not a design problem — it's a sales problem.

We build sites that clear that bar from day one.

🌐 graveyardjokes.com

#WebDesign #SEO
POST,
            ],

            [
                'platform'     => 'instagram',
                'scheduled_at' => $days[0],
                'media_url'    => self::IMAGES[0],
                'content'      => <<<'POST'
First impressions happen before anyone reads a word.

75% of people judge credibility based on design alone. Users decide in 3.5 seconds — before they've seen your offer, your price, or your story.

Your website is your first pitch.

Most businesses are losing it before they even know someone was there.

🌐 graveyardjokes.com

#WebDesign #BrandStrategy #DigitalMarketing #WebDevelopment #SEO #GraveyardJokesStudios
POST,
            ],

            // ═══════════════════════════════════════════════════════════════
            // DAY 2 — May 22 · THEME: Mobile-First Design
            // ═══════════════════════════════════════════════════════════════

            [
                'platform'     => 'facebook',
                'scheduled_at' => $days[1],
                'media_url'    => null,
                'content'      => <<<'POST'
63% of all web traffic now comes from mobile devices.

If your website was not built mobile-first, you are designing for the minority — and losing more than half of your visitors before they reach your offer.

Mobile users convert at 2.1% on average compared to 4.3% on desktop. That gap is almost never a traffic problem. It is a UX problem. The visitors are there. The site is losing them because the experience was not built for the device they are using.

53% of mobile users will leave if a page takes more than 3 seconds to load. That threshold is unforgiving, and most sites do not clear it.

Graveyard Jokes Studios builds every project mobile-first without exception — layout, load speed, navigation, and checkout all designed for the smallest screen first.

🌐 graveyardjokes.com

#MobileDesign #UXDesign #WebDevelopment #ConversionRate
POST,
            ],

            [
                'platform'     => 'discord',
                'scheduled_at' => $days[1],
                'media_url'    => null,
                'content'      => <<<'POST'
A dev reminder that gets overlooked more than it should:

**63% of all web traffic is mobile.**
**Mobile converts at 2.1% vs 4.3% on desktop.**

That conversion gap is almost entirely a UX problem — not a traffic problem. The visitors are there. The site is losing them.

**53% of mobile users will leave if a page takes more than 3 seconds to load.** Three seconds. Every unoptimized image, render-blocking script, and undeferred font load is eating into that budget.

If you're building a product or client site and mobile is still an afterthought — it might be worth rethinking the order of operations. The responsive breakpoint pass at the end is not mobile-first design.

🌐 **graveyardjokes.com**

#MobileFirst #WebPerformance #UXDesign #BuildInPublic
POST,
            ],

            [
                'platform'     => 'twitter',
                'scheduled_at' => $days[1],
                'media_url'    => null,
                'content'      => <<<'POST'
63% of all web traffic is mobile.

Mobile converts at 2.1%. Desktop converts at 4.3%.

That gap is a UX problem — not a traffic problem.

We build mobile-first from day one.

🌐 graveyardjokes.com

#MobileDesign #UXDesign
POST,
            ],

            [
                'platform'     => 'instagram',
                'scheduled_at' => $days[1],
                'media_url'    => self::IMAGES[1],
                'content'      => <<<'POST'
63% of your visitors are on a phone right now.

Mobile-first is not a feature. It is the baseline.

53% of mobile users leave if a page takes more than 3 seconds to load. Your site has 3 seconds to earn the next click.

If it wasn't built for mobile first — it wasn't built for your audience first.

🌐 graveyardjokes.com

#MobileDesign #WebDesign #UXDesign #WebDevelopment #MobileFirst #GraveyardJokesStudios
POST,
            ],

            // ═══════════════════════════════════════════════════════════════
            // DAY 3 — May 23 · THEME: UX Return on Investment
            // ═══════════════════════════════════════════════════════════════

            [
                'platform'     => 'facebook',
                'scheduled_at' => $days[2],
                'media_url'    => null,
                'content'      => <<<'POST'
Every $1 invested in UX can return up to $100.

That is a potential 9,900% ROI — from improving how users move through your site.

A well-designed UI can increase conversions by up to 200%. Better UX can improve them by as much as 400%. These are not agency talking points. They are documented, measurable outcomes from removing friction and making decisions easier for users.

If your business has a website that works but does not convert, the answer is rarely more traffic. It is usually better UX — clearer navigation, faster load times, stronger calls to action, and a checkout flow that was actually designed to close.

Graveyard Jokes Studios builds with conversion-focused UX on every project, from information architecture through to the final confirmation screen.

🌐 graveyardjokes.com

#UXDesign #ConversionRate #BusinessGrowth #WebDesign
POST,
            ],

            [
                'platform'     => 'discord',
                'scheduled_at' => $days[2],
                'media_url'    => null,
                'content'      => <<<'POST'
**$1 invested in UX → up to $100 in return. That's a 9,900% ROI.**

A well-designed UI: up to 200% more conversions.
Better UX overall: up to 400%.

What I find interesting as a developer is that UX ROI is one of the few areas where engineering effort has a directly traceable revenue impact. You can measure it. A/B test it. Point to the number.

Most sites with conversion problems weren't lacking traffic. They were creating friction — confusing navigation, slow loads, unclear CTAs, forms that felt like a chore. Fixing UX is usually a higher leverage move than buying more ads.

Worth keeping in mind when scoping what matters in the next build.

🌐 **graveyardjokes.com**

#UXDesign #ConversionOptimization #WebDev #BuildInPublic
POST,
            ],

            [
                'platform'     => 'twitter',
                'scheduled_at' => $days[2],
                'media_url'    => null,
                'content'      => <<<'POST'
$1 invested in UX → up to $100 return.

9,900% ROI from better user experience.

Most conversion problems are a UX problem — not a traffic problem.

🌐 graveyardjokes.com

#UXDesign #ConversionRate
POST,
            ],

            [
                'platform'     => 'instagram',
                'scheduled_at' => $days[2],
                'media_url'    => self::IMAGES[2],
                'content'      => <<<'POST'
$1 invested in UX.
Up to $100 in return.

That is not a design pitch. That is an ROI calculation.

A well-designed UI can lift conversions by 200%. Better UX overall: up to 400%.

Most conversion problems are not a traffic problem. They are a friction problem.

🌐 graveyardjokes.com

#UXDesign #ConversionOptimization #WebDesign #BusinessGrowth #DigitalMarketing #GraveyardJokesStudios
POST,
            ],

            // ═══════════════════════════════════════════════════════════════
            // DAY 4 — May 24 · THEME: eCommerce & Conversion
            // ═══════════════════════════════════════════════════════════════

            [
                'platform'     => 'facebook',
                'scheduled_at' => $days[3],
                'media_url'    => null,
                'content'      => <<<'POST'
70.22% of online shopping carts are abandoned before checkout.

For mobile, that number climbs to 85%.

Most eCommerce brands do not have a traffic problem. They have a mobile UX problem — friction in the checkout flow, slow load times, unclear trust signals, and a purchase experience that was never designed for a phone.

Reducing checkout friction can recover up to 35% of those abandoned sales. That is revenue already in your funnel. It is just not making it through.

And 24% of eCommerce users use site search — but they drive 44% of total revenue. Search is one of the highest-converting UX features on any online store, and one of the most underdeveloped.

Graveyard Jokes Studios builds eCommerce with mobile-first checkout, Stripe-powered payments, and UX designed to close — not just display.

🌐 graveyardjokes.com

#Ecommerce #ConversionRate #MobileUX #WebDevelopment
POST,
            ],

            [
                'platform'     => 'discord',
                'scheduled_at' => $days[3],
                'media_url'    => null,
                'content'      => <<<'POST'
An eCommerce stat that hits differently the more you think about it:

**70.22% of shopping carts are abandoned. On mobile: 85%.**

**Reducing checkout friction can recover up to 35% of those.**

That is recoverable revenue. Sitting in the cart. Not converting because the checkout experience was not built carefully — too many steps, bad form UX, unclear payment options, no trust signals at the critical moment.

Also: **24% of eCommerce users use site search, but they drive 44% of total revenue.** Search is massively underbuilt on most online stores.

If you're working on eCommerce, the cart and checkout flow deserve the same care as the product pages. Usually more.

🌐 **graveyardjokes.com**

#Ecommerce #UXDesign #ConversionOptimization #WebDev
POST,
            ],

            [
                'platform'     => 'twitter',
                'scheduled_at' => $days[3],
                'media_url'    => null,
                'content'      => <<<'POST'
85% of mobile shoppers abandon their cart.

That's a checkout UX problem — not a product problem.

Reducing checkout friction recovers up to 35% of those sales.

🌐 graveyardjokes.com

#Ecommerce #MobileUX #ConversionRate
POST,
            ],

            [
                'platform'     => 'instagram',
                'scheduled_at' => $days[3],
                'media_url'    => self::IMAGES[3],
                'content'      => <<<'POST'
85% of mobile shoppers abandon their cart before checkout.

That is not a product problem.
That is a UX problem.

The revenue is already in your funnel. It is just not making it through.

Reducing checkout friction can recover up to 35% of those abandoned sales.

🌐 graveyardjokes.com

#Ecommerce #MobileUX #ConversionRate #WebDevelopment #EcommerceDesign #GraveyardJokesStudios
POST,
            ],

            // ═══════════════════════════════════════════════════════════════
            // DAY 5 — May 25 · THEME: SEO & Page Speed
            // ═══════════════════════════════════════════════════════════════

            [
                'platform'     => 'facebook',
                'scheduled_at' => $days[4],
                'media_url'    => null,
                'content'      => <<<'POST'
The median load time of Google's top 10 ranking pages is 1.65 seconds.

Only 42% of websites pass all Core Web Vitals.

Speed is no longer just a performance metric — it is an SEO metric and a revenue metric. A 100ms delay in page load time can reduce conversions by 7%. Websites that load in under 2 seconds see up to 27% more organic traffic.

If your site is slow, you are not just losing users. You are losing rankings before those users ever find you.

Graveyard Jokes Studios builds every project with technical SEO from the start: optimized assets, server-side rendering where it matters, clean semantic HTML, and Core Web Vitals targets established before the first line of code is written.

🌐 graveyardjokes.com

#TechnicalSEO #PageSpeed #WebPerformance #WebDevelopment
POST,
            ],

            [
                'platform'     => 'discord',
                'scheduled_at' => $days[4],
                'media_url'    => null,
                'content'      => <<<'POST'
**Only 42% of websites pass all Core Web Vitals.**

That leaves 58% of the web underperforming in speed, stability, and responsiveness — which directly hits rankings and conversions.

- Median load time of Google's top 10 pages: **1.65 seconds**
- Pages under 2 seconds: **27% more organic traffic**
- Every 100ms delay: **7% conversion drop**

The uncomfortable truth is that most performance failures are not mysterious. They're unoptimized images, render-blocking scripts, bad font loading strategy, slow server response times, and missing caching headers. Addressable things that just were not prioritized.

If you're working through Lighthouse scores or CWV issues on a project, happy to talk through it.

🌐 **graveyardjokes.com**

#TechnicalSEO #WebPerformance #CoreWebVitals #WebDev
POST,
            ],

            [
                'platform'     => 'twitter',
                'scheduled_at' => $days[4],
                'media_url'    => null,
                'content'      => <<<'POST'
Only 42% of websites pass Core Web Vitals.

Google's top 10 median load time: 1.65 seconds.
Every 100ms slower = 7% fewer conversions.

Speed is an SEO strategy.

🌐 graveyardjokes.com

#TechnicalSEO #PageSpeed
POST,
            ],

            [
                'platform'     => 'instagram',
                'scheduled_at' => $days[4],
                'media_url'    => self::IMAGES[4],
                'content'      => <<<'POST'
Only 42% of websites pass Core Web Vitals.

The median load time for Google's top 10 pages is 1.65 seconds. Every 100ms slower costs 7% in conversions.

Speed is not a technical metric. It is a rankings metric. It is a revenue metric.

We build fast from the start — not as an afterthought.

🌐 graveyardjokes.com

#TechnicalSEO #PageSpeed #WebPerformance #WebDevelopment #CoreWebVitals #GraveyardJokesStudios
POST,
            ],

        ];

        foreach ($posts as $post) {
            SocialScheduledPost::create([
                'platform'     => $post['platform'],
                'content'      => trim($post['content']),
                'media_url'    => $post['media_url'] ?? null,
                'scheduled_at' => $post['scheduled_at'],
                'status'       => 'pending',
            ]);
        }

        $this->command->info('Seeded 20 social posts for May 21–25 batch (Facebook, Discord, Twitter/X, Instagram).');
    }
}
