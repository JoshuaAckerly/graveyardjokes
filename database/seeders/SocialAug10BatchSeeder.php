<?php

namespace Database\Seeders;

use App\Models\SocialScheduledPost;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

/**
 * Schedules the Aug 10–14, 2026 social media batch for Graveyard Jokes Studios.
 *
 * Platforms: Facebook, Discord, Instagram (3 posts/day — 15 total)
 * Schedule:  Mon–Fri at 11:00 AM
 *
 * Content themes:
 *   Aug 10 — SEO: the long game (compounding returns, what to actually expect)
 *   Aug 11 — Why a website, not just a social media page (own your platform)
 *   Aug 12 — Page speed is a conversion metric
 *   Aug 13 — Looks good vs. actually works (design clarity vs. visual polish)
 *   Aug 14 — What a monthly website management retainer actually includes
 *
 * Run on production only — exactly once:
 *   php artisan db:seed --class=SocialAug10BatchSeeder --force
 */
class SocialAug10BatchSeeder extends Seeder
{
    private const S3 = 'https://graveyardjokes-cdn.s3.us-east-2.amazonaws.com/graveyardjokes/social';

    public function run(): void
    {
        // Idempotency guard — skip if any post is already scheduled for this window.
        $alreadySeeded = SocialScheduledPost::where('platform', 'facebook')
            ->whereBetween('scheduled_at', ['2026-08-10 00:00:00', '2026-08-14 23:59:59'])
            ->exists();

        if ($alreadySeeded) {
            $this->command->info('SocialAug10BatchSeeder: posts already exist, skipping.');

            return;
        }

        $days = [
            Carbon::parse('2026-08-10 11:00:00'), // Monday
            Carbon::parse('2026-08-11 11:00:00'), // Tuesday
            Carbon::parse('2026-08-12 11:00:00'), // Wednesday
            Carbon::parse('2026-08-13 11:00:00'), // Thursday
            Carbon::parse('2026-08-14 11:00:00'), // Friday
        ];

        $images = [
            0 => self::S3.'/agency-intro.png',
            1 => self::S3.'/portfolio-showcase.png',
            2 => self::S3.'/services-packages.png',
            3 => self::S3.'/agency-intro.png',
            4 => self::S3.'/portfolio-showcase.png',
        ];

        $posts = [

            // ═══════════════════════════════════════════════════════════════
            // DAY 1 — Aug 10 · THEME: SEO: The Long Game
            // ═══════════════════════════════════════════════════════════════

            [
                'platform' => 'facebook',
                'scheduled_at' => $days[0],
                'media_url' => null,
                'content' => <<<'POST'
Search engine optimization is a compounding investment. That is both its greatest advantage and its most common misrepresentation.

The honest version: meaningful organic rankings take months. Not because the work is slow, but because trust — which is what Google's algorithm is ultimately measuring — is built through accumulated signals over time. Domain authority. Backlinks from credible sources. Consistent publishing. Low bounce rates. Page speed. Structured data. These do not change overnight.

What changes quickly: technical issues that are actively suppressing your current rankings. If your site is not indexed correctly, if page titles are duplicated, if your mobile experience is broken, if your load time is in the bottom quartile — fixing those things can produce visible movement within weeks.

The first phase of SEO work is always a technical audit. Clear the drag before you apply the thrust.

After that, the compounding begins. Well-structured content, properly targeted, that earns links and builds topical authority over time. Not a shortcut. Not a trick. Just consistent, correctly-directed work that builds something that lasts.

If someone promises you first-page results in 30 days, they are either running paid ads and calling it SEO, or they are going to get your domain penalized.

🌐 graveyardjokes.com

#SEO #SearchEngineOptimization #DigitalMarketing #SmallBusiness #LocalSEO
POST,
            ],

            [
                'platform' => 'discord',
                'scheduled_at' => $days[0],
                'media_url' => null,
                'content' => <<<'POST'
One thing that takes longer to explain than it should to clients who've been burned before:

SEO is not a lever you pull. It's a system you build.

The technical work — fixing crawl errors, page speed, indexing issues — moves fast and often produces quick wins. But ranking for competitive keywords against established domains takes months because it requires trust accumulation at the domain level. No shortcut exists there.

The agencies promising fast results are usually running paid campaigns and calling it SEO, or doing short-term tactics that earn a penalty 6 months later.

The honest version: fix the technical drag first, then build the right content consistently. The results compound.

→ graveyardjokes.com
POST,
            ],

            [
                'platform' => 'instagram',
                'scheduled_at' => $days[0],
                'media_url' => $images[0],
                'content' => <<<'POST'
SEO is not something that happens fast. It is something that compounds.

The technical work starts immediately — fixing what is actively dragging your rankings. The rest is building trust, authority, and relevance over time through the right content in the right places.

No one who promises page-one results in 30 days is talking about sustainable organic ranking.

We run honest SEO. It takes longer and it lasts.

Link in bio → graveyardjokes.com

#seo #searchengineoptimization #digitalmarketing #seotips #localseo #seoagency #smallbusiness #smallbusinessowner #entrepreneur #businessgrowth #googlesearch #googleranking #onpageseo #technicalseo #contentmarketing #organicgrowth #buffalo #buffalony #cheektowaga #westernneyork #wnybusiness #localbusiness #onlinepresence #buildinpublic #agencylife #digitalagency #graveyardjokestudios
POST,
            ],

            // ═══════════════════════════════════════════════════════════════
            // DAY 2 — Aug 11 · THEME: Website vs. Social Media Page
            // ═══════════════════════════════════════════════════════════════

            [
                'platform' => 'facebook',
                'scheduled_at' => $days[1],
                'media_url' => null,
                'content' => <<<'POST'
A Facebook page is not a website. Neither is an Instagram profile, a Google Business listing, or a TikTok account.

When you build a business presence exclusively on platforms you do not own, you are renting space on someone else's property under terms that can change — and have changed, repeatedly — without your consent.

Organic reach on Facebook has declined every year since 2012. Algorithms change. Platforms get acquired. Accounts get suspended. Content policies shift. TikTok nearly got banned in the United States this year. These are not theoretical risks. They are documented events that destroyed overnight the audience reach of businesses that had not maintained an independent web presence.

Your website is the one digital asset you own. The design, the content, the data, the performance — all of it exists on infrastructure you control, with a domain you hold, governed by contracts you signed.

Social media is a distribution channel. It is a way to drive traffic to the asset you own. Treating it as the asset itself is a structural vulnerability.

A professional website does not have to cost what most agencies charge. We have packages starting at $799 for businesses that need a solid, well-built foundation to own.

🌐 graveyardjokes.com

#WebDesign #WebDevelopment #SmallBusiness #DigitalMarketing #OwnYourPlatform
POST,
            ],

            [
                'platform' => 'discord',
                'scheduled_at' => $days[1],
                'media_url' => null,
                'content' => <<<'POST'
This comes up a lot when talking to small businesses that are "just using Facebook for now":

Social media reach is rented. Algorithm changes, platform rule changes, account suspensions — you are operating on someone else's infrastructure under someone else's terms.

Your website is the only digital property you actually own. Your email list is second.

Social is a distribution channel — not the asset itself. Treating it as the asset is a meaningful business risk most small businesses underestimate until something changes.

→ graveyardjokes.com
POST,
            ],

            [
                'platform' => 'instagram',
                'scheduled_at' => $days[1],
                'media_url' => $images[1],
                'content' => <<<'POST'
Your Instagram profile is not a website.

When the algorithm changes, your reach changes with it. When the platform changes its rules, you adapt or lose access. When the platform gets acquired or banned, you start over.

Your website is the one digital asset you actually own.

Social media is how you drive traffic to it.

Link in bio → graveyardjokes.com

#webdesign #webdevelopment #smallbusiness #entrepreneur #digitalmarketing #ownyourplatform #websitedesign #businessowner #socialmediamarketing #onlinepresence #websitedevelopment #agencylife #digitalagency #creativestudio #buffalo #buffalony #cheektowaga #westernneyork #wnybusiness #localbusiness #graveyardjokestudios #buildinpublic #onlinebusiness #websitemanagement #smallbiz #businessgrowth #brandidentity #freelancedesigner #webagency #startuplife
POST,
            ],

            // ═══════════════════════════════════════════════════════════════
            // DAY 3 — Aug 12 · THEME: Page Speed Is a Conversion Metric
            // ═══════════════════════════════════════════════════════════════

            [
                'platform' => 'facebook',
                'scheduled_at' => $days[2],
                'media_url' => null,
                'content' => <<<'POST'
A one-second delay in page load time reduces conversions by 7%.

That statistic has been cited in digital marketing circles long enough that it has become wallpaper. But the underlying mechanic is real and measurable: users who encounter friction at any point in a conversion path — slow initial load, slow transition to the target page, slow response to an action — abandon at a higher rate than users who do not.

Speed is not an aesthetic preference. It is a conversion metric. It is the difference between a site that works and a site that looks like it should work.

What slows a site down: unoptimized images, render-blocking scripts, an oversized front-end bundle, slow time-to-first-byte from underpowered hosting, no caching layer, and missing CDN configuration. Most of these are fixable without a full rebuild.

A technical performance audit takes a few hours. The impact — load time reduction, improved Core Web Vitals score, better mobile performance — is measurable in days and compounds against search rankings over time.

If your site has not been audited for performance in the last year, it almost certainly has drag you could remove without touching the design.

🌐 graveyardjokes.com

#WebPerformance #WebDevelopment #CoreWebVitals #PageSpeed #SmallBusiness #SEO
POST,
            ],

            [
                'platform' => 'discord',
                'scheduled_at' => $days[2],
                'media_url' => null,
                'content' => <<<'POST'
Fast take on web performance for anyone maintaining production sites:

Core Web Vitals are a documented ranking factor. LCP (Largest Contentful Paint) and CLS (Cumulative Layout Shift) show up directly in Google Search Console. A site that's slow or visually unstable on load is being actively penalized in organic rankings, not just in user experience.

The three most common fixable issues I find on audits:
1. Images not compressed or in modern formats (WebP/AVIF)
2. JS bundles loaded synchronously in the `<head>` blocking render
3. No CDN, so TTFB varies widely by user geography

Usually 1 day of work for a meaningful improvement.

→ graveyardjokes.com
POST,
            ],

            [
                'platform' => 'instagram',
                'scheduled_at' => $days[2],
                'media_url' => $images[2],
                'content' => <<<'POST'
A 1-second delay in page load costs 7% of conversions.

Speed is not an aesthetic choice. It is a revenue metric.

If your site has not been performance-audited in the past year, it has drag you could remove without touching the design.

Link in bio → graveyardjokes.com

#pagespeed #webperformance #corewebvitals #webdevelopment #seo #conversionoptimization #smallbusiness #entrepreneur #businessgrowth #digitalmarketing #agencylife #digitalagency #websitedesign #websitemanagement #webdesign #buffalo #buffalony #cheektowaga #westernneyork #wnybusiness #localbusiness #graveyardjokestudios #buildinpublic #technicalseo #googleranking #onlinebusiness #webagency #startuplife #freelancedesigner #onlinepresence
POST,
            ],

            // ═══════════════════════════════════════════════════════════════
            // DAY 4 — Aug 13 · THEME: Looks Good vs. Actually Works
            // ═══════════════════════════════════════════════════════════════

            [
                'platform' => 'facebook',
                'scheduled_at' => $days[3],
                'media_url' => null,
                'content' => <<<'POST'
The most common tension in web design is between aesthetics and function — and the framing of it as a tension is usually wrong.

A site that looks good and does not convert is a failed design. The visual work was done well and the strategic work was skipped. The goal of a business website is not to look like an award submission. It is to guide a specific type of visitor through a specific path to a specific action, in a way that feels effortless.

That requires visual clarity, not just visual appeal. The hierarchy of information has to be legible on a first scan. The call to action has to be obvious without being obnoxious. The copy has to be confident and direct. The layout has to work on a phone. The load time has to not test anyone's patience.

A skilled designer understands that all of these are design decisions, not separate disciplines. Typography, spacing, contrast, motion — all of these control where the eye goes and how trust is built in the first few seconds.

We build sites that do both. The aesthetic bar matters. The function bar matters more. When the tradeoff exists, function wins.

If your current site looks fine but is not producing the results you expect from it, the problem is probably not the color palette.

🌐 graveyardjokes.com

#WebDesign #UX #ConversionDesign #SmallBusiness #WebDevelopment #DigitalMarketing
POST,
            ],

            [
                'platform' => 'discord',
                'scheduled_at' => $days[3],
                'media_url' => null,
                'content' => <<<'POST'
Design vs. conversion — a thought that comes up a lot in client work:

Visual polish is not the same as design that works. A site can be beautiful and strategically incoherent — no clear hierarchy, weak CTA placement, copy that hedges instead of commits.

The questions that matter on a business homepage:
- What does this business do? (should be clear in 3 seconds)
- Who is it for? (should be answered without scrolling)
- What should I do next? (one obvious answer)

If a visitor has to think to answer any of those, the design is not done.

→ graveyardjokes.com
POST,
            ],

            [
                'platform' => 'instagram',
                'scheduled_at' => $days[3],
                'media_url' => $images[3],
                'content' => <<<'POST'
A beautiful website that does not convert is a failed design.

Visual clarity, not just visual appeal. A clear path to action. Copy that commits. Layout that works on a phone.

We build both sides.

Link in bio → graveyardjokes.com

#webdesign #ux #conversionoptimization #websitedesign #webdevelopment #smallbusiness #entrepreneur #businessgrowth #digitalmarketing #agencylife #digitalagency #creativestudio #buffalo #buffalony #cheektowaga #westernneyork #wnybusiness #localbusiness #graveyardjokestudios #buildinpublic #onlinebusiness #webagency #freelancedesigner #brandidentity #uxdesign #userexperience #websitemanagement #onlinepresence #startuplife #designthinking
POST,
            ],

            // ═══════════════════════════════════════════════════════════════
            // DAY 5 — Aug 14 · THEME: What a Website Management Retainer Includes
            // ═══════════════════════════════════════════════════════════════

            [
                'platform' => 'facebook',
                'scheduled_at' => $days[4],
                'media_url' => null,
                'content' => <<<'POST'
"Website management" is one of those service descriptions that means everything and nothing until you break down what is actually included.

The short version of what it is not: it is not "we host your site and respond to support tickets." That is basic hosting. Website management is a proactive service, not a reactive one.

What a monthly management retainer at Graveyard Jokes Studios actually covers:

Security. Monthly scans for vulnerabilities. Dependency updates — both server-side and front-end — before they become exposure points. SSL certificate monitoring. Login protection review.

Performance. Monthly review of Core Web Vitals, page load performance, and cache configuration. Regression testing after any update to ensure nothing degraded.

Content. Scheduled content updates — new hours, updated copy, changed pricing, new service listings — handled within a defined SLA rather than adding to your to-do list.

Backups. Automated daily backups with verified restore procedures. Not just "backups exist" but "we know we can restore from them."

Monitoring. Uptime monitoring with alerting. You do not find out about an outage from a customer.

Documentation. Any structural change to the site is documented. Not a changelog email. An updated technical record that reflects the current state of the codebase.

This is the standard we hold for our own portfolio of seven live production products. It is the same standard we bring to client sites.

Retainer starting at $799/month.

🌐 graveyardjokes.com

#WebsiteManagement #WebDevelopment #SmallBusiness #WebMaintenance #DigitalMarketing
POST,
            ],

            [
                'platform' => 'discord',
                'scheduled_at' => $days[4],
                'media_url' => null,
                'content' => <<<'POST'
On the management side of production systems — something I think about a lot:

"Website maintenance" is usually sold as break-fix. Something goes wrong, you open a ticket, someone fixes it.

That is not maintenance. That is a reactive support contract.

Actual maintenance is proactive: scheduled dependency updates before they accumulate into a security debt, performance baselines so you notice when something regresses, monthly security scans so you find the issue before a visitor does.

The cost of being proactive is a monthly fee. The cost of being reactive is a bad day that happens at the worst possible time.

→ graveyardjokes.com
POST,
            ],

            [
                'platform' => 'instagram',
                'scheduled_at' => $days[4],
                'media_url' => $images[4],
                'content' => <<<'POST'
Website management is not waiting for something to break.

It is security patches before they become vulnerabilities. Performance reviews before the slowdown costs conversions. Backups verified before you need them.

Proactive, not reactive.

Retainers starting at $799/month.

Link in bio → graveyardjokes.com

#websitemanagement #websitemaintenance #webdevelopment #smallbusiness #entrepreneur #businessgrowth #digitalmarketing #agencylife #digitalagency #creativestudio #buffalo #buffalony #cheektowaga #westernneyork #wnybusiness #localbusiness #graveyardjokestudios #buildinpublic #onlinebusiness #webagency #securityfirst #websitedesign #technicalseo #webdesign #startuplife #onlinepresence #smallbiz #freelancedesigner #monthlyretainer #proactive
POST,
            ],

        ];

        foreach ($posts as $post) {
            SocialScheduledPost::create([
                'platform' => $post['platform'],
                'content' => $post['content'],
                'media_url' => $post['media_url'] ?? null,
                'scheduled_at' => $post['scheduled_at'],
                'status' => 'pending',
            ]);
            $this->command->info("Scheduled [{$post['platform']}] at {$post['scheduled_at']->toDateTimeString()}");
        }

        $this->command->info("\nDone. ".count($posts).' posts scheduled.');
    }
}
