<?php

namespace Database\Seeders;

use App\Models\SocialScheduledPost;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

/**
 * Schedules the May 26–30, 2026 social media batch for Graveyard Jokes Studios.
 *
 * Platforms: Facebook, Discord, Twitter/X, Instagram (4 unique posts per day — 20 total)
 * Schedule:  Daily at 11:00 AM
 * Instagram: Images cycled from public/storage/instagram/ (3 available)
 *
 * Content themes:
 *   May 26 — Blog post promotion (Week Four: Spear, RSS, Triple-Post fix)
 *   May 27 — Digital Marketing & Social Media Management
 *   May 28 — Custom Web Application Development
 *   May 29 — Portfolio Showcase (client sites)
 *   May 30 — Pricing & Packages CTA
 *
 * Run on production only — exactly once:
 *   php artisan db:seed --class=SocialMay26BatchSeeder --force
 */
class SocialMay26BatchSeeder extends Seeder
{
    private const SITE = 'https://graveyardjokes.com';
    private const BLOG_POST_URL = 'https://studio.graveyardjokes.com/blog/week-four-may-2026';

    private const IMAGES = [
        self::SITE . '/storage/instagram/Copilot_20260516_201107.png',
        self::SITE . '/storage/instagram/Copilot_20260516_201400.png',
        self::SITE . '/storage/instagram/Copilot_20260516_201630.png',
    ];

    public function run(): void
    {
        $days = [
            Carbon::parse('2026-05-26 11:00:00'),
            Carbon::parse('2026-05-27 11:00:00'),
            Carbon::parse('2026-05-28 11:00:00'),
            Carbon::parse('2026-05-29 11:00:00'),
            Carbon::parse('2026-05-30 11:00:00'),
        ];

        $posts = [

            // ═══════════════════════════════════════════════════════════════
            // DAY 1 — May 26 · THEME: Blog Post Promotion
            // ═══════════════════════════════════════════════════════════════

            [
                'platform' => 'facebook',
                'scheduled_at' => $days[0],
                'media_url' => null,
                'content' => <<<'POST'
New post on the studio blog — Week Four recap.

This week: Noteleks finally has a visible weapon. The spear now spawns at the character's hand, tracks the physics projectile through the air, and launches at exactly the right frame in the throw animation. The timing took some work — a 266ms delay synced to the moment the skeleton's arm comes back down.

Hollow Press got an RSS feed. Graveyard Jokes' social dispatcher was triple-posting to Facebook due to a race condition — fixed with an atomic DB transaction and a stuck-post recovery command.

Read the full breakdown:
👉 studio.graveyardjokes.com/blog/week-four-may-2026

#GameDev #WebDevelopment #BuildInPublic #IndieGameDev #Laravel #Phaser
POST,
            ],

            [
                'platform' => 'discord',
                'scheduled_at' => $days[0],
                'media_url' => null,
                'content' => <<<'POST'
Week four recap is up on the blog.

**Noteleks — SpearSprite:** The weapon has a visual now. A `SpearSprite` class tracks the physics projectile position and rotation each frame. The tricky part was timing — the projectile spawn is deferred 266ms via `scene.time.delayedCall`, synced to the frame in the Spine animation when the hand comes back to rest. The throw looks like a throw now.

**Hollow Press — RSS:** `/feed.rss` is live. Valid RSS 2.0, autodiscovery in the layout `<head>`, 3 tests green.

**Graveyard Jokes — Facebook triple-post fix:** The social dispatcher had a race condition. Two scheduler ticks would each query for due posts and claim the same ones. Fixed with `DB::transaction` + `lockForUpdate()` — the post transitions from `pending` → `processing` before any API call, so concurrent processes can't double-claim it.

Full post: **studio.graveyardjokes.com/blog/week-four-may-2026**

#BuildInPublic #GameDev #Laravel #WebDev
POST,
            ],

            [
                'platform' => 'twitter',
                'scheduled_at' => $days[0],
                'media_url' => null,
                'content' => <<<'POST'
Week four dev log is up.

→ Noteleks: spear has a visible sprite now, launch timed to the throw animation
→ Hollow Press: RSS feed live at /feed.rss
→ GJ social dispatcher: fixed a race condition that was triple-posting to Facebook

studio.graveyardjokes.com/blog/week-four-may-2026

#BuildInPublic #GameDev #IndieGameDev
POST,
            ],

            [
                'platform' => 'instagram',
                'scheduled_at' => $days[0],
                'media_url' => self::IMAGES[0],
                'content' => <<<'POST'
Week four dev log is live.

The spear in Noteleks finally has a body — it spawns at the skeleton's hand and tracks through the air. Hollow Press got an RSS feed. And a race condition that was posting to Facebook three times in a row is fixed.

Read the full breakdown at the link in bio.

studio.graveyardjokes.com/blog/week-four-may-2026

#BuildInPublic #GameDev #IndieGameDev #WebDevelopment #Laravel #GraveyardJokesStudios
POST,
            ],

            // ═══════════════════════════════════════════════════════════════
            // DAY 2 — May 27 · THEME: Digital Marketing & Social Media Management
            // ═══════════════════════════════════════════════════════════════

            [
                'platform' => 'facebook',
                'scheduled_at' => $days[1],
                'media_url' => null,
                'content' => <<<'POST'
Most small businesses have social media accounts. Very few have a strategy behind them.

Posting inconsistently, reusing the same content across platforms, and ignoring platform-specific best practices — these are not just missed opportunities. They actively signal to potential clients that the business is not paying attention to its own brand.

Digital marketing is not about volume. It is about consistency, targeting, and showing up in the right places with the right message at the right time.

At Graveyard Jokes Studios, we handle social media management as part of our digital marketing packages — content scheduling, platform optimization, and performance tracking. So you can focus on running your business instead of managing your feed.

Packages starting at $799. Currently taking on new clients.

🌐 graveyardjokes.com

#DigitalMarketing #SocialMediaMarketing #SmallBusiness #ContentStrategy #MarketingStrategy
POST,
            ],

            [
                'platform' => 'discord',
                'scheduled_at' => $days[1],
                'media_url' => null,
                'content' => <<<'POST'
Something I think about when building content systems like the social dispatcher:

The hardest part of digital marketing for small businesses is not writing the posts. It is doing it consistently without it becoming a full-time job.

Scheduled content pipelines — where posts are planned, written, approved, and queued ahead of time — are the operational solution to that problem. You do not think about what to post at 10:59 AM because you decided two weeks ago.

The same principle applies to the technical side: the dispatching system should handle retries, prevent duplicates, log failures, and alert on stuck posts automatically. The marketer (or the business owner) should never need to debug a missed post.

That is what the social dispatch system on Graveyard Jokes is built to do.

🌐 **graveyardjokes.com**

#DigitalMarketing #ContentStrategy #BuildInPublic #WebDev
POST,
            ],

            [
                'platform' => 'twitter',
                'scheduled_at' => $days[1],
                'media_url' => null,
                'content' => <<<'POST'
Social media without a strategy behind it is just noise.

Consistency, platform-specific content, and a clear message — that's what actually builds an audience.

We handle the strategy and execution.

🌐 graveyardjokes.com

#DigitalMarketing #SocialMedia #SmallBusiness
POST,
            ],

            [
                'platform' => 'instagram',
                'scheduled_at' => $days[1],
                'media_url' => self::IMAGES[1],
                'content' => <<<'POST'
Posting inconsistently is worse than not posting at all.

It signals to potential clients that you do not pay close attention to your own brand. If that is the impression your social presence gives — what does it say about how you'll handle their project?

Consistency is the baseline. Strategy is what turns it into growth.

We build and manage both.

🌐 graveyardjokes.com

#DigitalMarketing #SocialMediaMarketing #ContentStrategy #SmallBusiness #BrandStrategy #GraveyardJokesStudios
POST,
            ],

            // ═══════════════════════════════════════════════════════════════
            // DAY 3 — May 28 · THEME: Custom Web Application Development
            // ═══════════════════════════════════════════════════════════════

            [
                'platform' => 'facebook',
                'scheduled_at' => $days[2],
                'media_url' => null,
                'content' => <<<'POST'
Off-the-shelf platforms work until they do not.

Most businesses outgrow template-based solutions the moment they need something that does not fit a preset layout or a standard plugin. Custom portals, internal tools, client dashboards, automated workflows, API integrations — these are problems that generic platforms were never designed to solve.

Custom web applications built on a solid backend framework give you exactly the functionality your business needs, without the performance tax of features you never asked for.

Graveyard Jokes Studios builds custom Laravel applications tailored to your workflow — from small internal tools to full-stack client-facing products. If your current setup has forced you to work around it, it might be time for something built around you.

Packages starting at $799. Currently taking on new clients.

🌐 graveyardjokes.com

#WebDevelopment #Laravel #CustomSoftware #BusinessAutomation #SmallBusiness
POST,
            ],

            [
                'platform' => 'discord',
                'scheduled_at' => $days[2],
                'media_url' => null,
                'content' => <<<'POST'
One of the things I find most interesting about building custom apps vs. templates:

Template platforms impose a mental model on the business. The business learns to think in terms of what the platform allows. Custom builds flip that — the software is modeled on how the business actually works.

That gap — between what a business needs to do and what a generic platform lets it do — is usually where friction hides. Workarounds, spreadsheets alongside the platform, manual steps that should be automated. All of it a symptom of software that was not built for the actual workflow.

The Laravel stack I use for every project is well-suited to custom work: typed models, clean routing, Inertia for the frontend bridge, and a testing setup that makes refactoring safe. It scales from a small internal tool to a full-stack SaaS.

🌐 **graveyardjokes.com**

#Laravel #WebDevelopment #CustomSoftware #BuildInPublic
POST,
            ],

            [
                'platform' => 'twitter',
                'scheduled_at' => $days[2],
                'media_url' => null,
                'content' => <<<'POST'
Off-the-shelf platforms work until you need something they were never built for.

Custom apps — built around how your business actually works.

🌐 graveyardjokes.com

#WebDevelopment #Laravel #CustomSoftware
POST,
            ],

            [
                'platform' => 'instagram',
                'scheduled_at' => $days[2],
                'media_url' => self::IMAGES[2],
                'content' => <<<'POST'
Template platforms impose a model on your business.

Custom software is modeled on your business.

When your current setup has you working around it instead of with it — that's the sign.

We build custom Laravel applications from internal tools to full-stack client-facing products.

🌐 graveyardjokes.com

#WebDevelopment #CustomSoftware #Laravel #BusinessTools #WebDesign #GraveyardJokesStudios
POST,
            ],

            // ═══════════════════════════════════════════════════════════════
            // DAY 4 — May 29 · THEME: Portfolio Showcase
            // ═══════════════════════════════════════════════════════════════

            [
                'platform' => 'facebook',
                'scheduled_at' => $days[3],
                'media_url' => null,
                'content' => <<<'POST'
The Graveyard Jokes Studios portfolio spans five active client sites — each a full-stack Laravel and React build with its own product focus.

The Velvet Pulse is a music review platform. Hollow Press is an editorial publication. Lunar Blood is a merchandise store with Stripe-powered checkout. Velvet Radio is an internet radio station with a live Icecast stream. Synth Veil is a music artist showcase.

Every project in the portfolio started from zero — architecture decisions, database design, frontend component system, API design, deployment pipeline, CI/CD, and monitoring all done in-house. The stack is consistent across all of them: Laravel 12, React 19, TypeScript, Tailwind CSS, hosted on AWS EC2.

These are the kinds of projects we build for clients. If you have something in mind, the best way to start is a conversation.

🌐 graveyardjokes.com

#WebDevelopment #Portfolio #Laravel #React #SmallBusiness #WebDesign
POST,
            ],

            [
                'platform' => 'discord',
                'scheduled_at' => $days[3],
                'media_url' => null,
                'content' => <<<'POST'
Quick portfolio rundown if you are curious what the Graveyard Jokes Studios stack looks like in practice:

- **The Velvet Pulse** — music review platform; editorial-style layout, tag system, author profiles
- **Hollow Press** — publication; full article system, RSS feed, search with monitoring
- **Lunar Blood** — merchandise store; Stripe checkout, order management, email confirmations
- **Velvet Radio** — internet radio; Icecast + Liquidsoap stream, HTML5 audio player, episode management
- **Synth Veil** — music artist site; release catalog, social links, press kit

Every one of these is Laravel 12 / React 19 / TypeScript / Tailwind / AWS EC2. The architecture is similar across all of them, which makes each one easier to extend and maintain.

The portfolio itself lives at graveyardjokes.com if you want to see the actual sites.

🌐 **graveyardjokes.com**

#Portfolio #WebDevelopment #Laravel #BuildInPublic
POST,
            ],

            [
                'platform' => 'twitter',
                'scheduled_at' => $days[3],
                'media_url' => null,
                'content' => <<<'POST'
5 full-stack client sites in the portfolio:

→ The Velvet Pulse — music reviews
→ Hollow Press — editorial platform
→ Lunar Blood — merch store w/ Stripe
→ Velvet Radio — live internet radio
→ Synth Veil — artist showcase

All Laravel 12 / React 19 / AWS EC2.

🌐 graveyardjokes.com

#WebDevelopment #Portfolio #Laravel
POST,
            ],

            [
                'platform' => 'instagram',
                'scheduled_at' => $days[3],
                'media_url' => self::IMAGES[0],
                'content' => <<<'POST'
Five full-stack sites in the portfolio.

Music reviews. An editorial publication. A merch store. A live internet radio station. A music artist showcase.

Every one built from zero — architecture, database, frontend, deployment, monitoring.

This is the kind of work we do for clients.

🌐 graveyardjokes.com

#Portfolio #WebDevelopment #Laravel #React #WebDesign #GraveyardJokesStudios
POST,
            ],

            // ═══════════════════════════════════════════════════════════════
            // DAY 5 — May 30 · THEME: Pricing & Packages CTA
            // ═══════════════════════════════════════════════════════════════

            [
                'platform' => 'facebook',
                'scheduled_at' => $days[4],
                'media_url' => null,
                'content' => <<<'POST'
Graveyard Jokes Studios is currently taking on new clients.

Our packages start at $799 for a professional web presence and go up from there depending on scope. Every package includes design, development, deployment, and post-launch support. No templates — everything is built specifically for your business.

If you have been thinking about a new website, a redesign, an eCommerce store, or a custom web application, now is a good time to reach out. We keep the client roster small intentionally — it means every project gets full attention from start to finish.

Reach out directly through the site or reply here. Happy to talk through what you need.

🌐 graveyardjokes.com

#WebDesign #WebDevelopment #Ecommerce #SmallBusiness #TakeClients
POST,
            ],

            [
                'platform' => 'discord',
                'scheduled_at' => $days[4],
                'media_url' => null,
                'content' => <<<'POST'
Graveyard Jokes Studios is open for new client work.

Packages start at $799. Scope varies — a straightforward professional site is on the lower end; eCommerce, custom applications, and ongoing digital marketing add to that. Every project is quoted after a conversation about what you actually need.

The stack is Laravel + React + TypeScript + Tailwind, deployed to AWS. If you have a specific tech requirement or are working in a different environment, worth discussing — we have built on other stacks too.

If you have a project in mind, feel free to DM or reach out through the site.

🌐 **graveyardjokes.com**

#WebDevelopment #OpenForWork #Laravel #SmallBusiness
POST,
            ],

            [
                'platform' => 'twitter',
                'scheduled_at' => $days[4],
                'media_url' => null,
                'content' => <<<'POST'
Open for new clients.

Web development, web design, eCommerce, custom apps, digital marketing.
Packages from $799. Small roster — projects get full attention.

🌐 graveyardjokes.com

#WebDevelopment #OpenForWork #SmallBusiness
POST,
            ],

            [
                'platform' => 'instagram',
                'scheduled_at' => $days[4],
                'media_url' => self::IMAGES[1],
                'content' => <<<'POST'
Currently taking on new clients.

Web development. Web design. eCommerce. Custom web applications. Digital marketing.

Packages from $799. Small roster — every project gets full attention.

If you have been sitting on a project idea, now is a good time to reach out.

🌐 graveyardjokes.com

#WebDesign #WebDevelopment #Ecommerce #SmallBusiness #OpenForWork #GraveyardJokesStudios
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

        $this->command->info('Seeded 20 social posts for May 26–30 batch (Facebook, Discord, Twitter/X, Instagram).');
    }
}
