<?php

namespace Database\Seeders;

use App\Models\SocialScheduledPost;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

/**
 * Schedules the Sep 7–18, 2026 social media batch for Graveyard Jokes Studios.
 *
 * Platforms: Facebook, Discord, Instagram (3 posts/day — 30 total)
 * Schedule:  Weekdays at 11:00 AM (two full work weeks)
 * Note: google_business is on its own weekly Thursday 10 AM cadence
 *       (already scheduled separately) and is not duplicated here.
 *
 * Content themes:
 *   Sep 7  — Local SEO & Google Business Profile
 *   Sep 8  — Website security & maintenance (not just "we'll fix it if it breaks")
 *   Sep 9  — The discovery call: what we ask before writing any code
 *   Sep 10 — Why Laravel + React instead of a website builder
 *   Sep 11 — Analytics: filtering bot noise so the numbers are real
 *   Sep 14 — Branding consistency across every platform
 *   Sep 15 — The 48-hour response promise
 *   Sep 16 — What "built and maintained in-house" actually means
 *   Sep 17 — Redesign vs. rebuild: how we decide
 *   Sep 18 — Q3 studio check-in / recap
 *
 * Run on production only — exactly once:
 *   php artisan db:seed --class=SocialSep2026BatchSeeder --force
 */
class SocialSep2026BatchSeeder extends Seeder
{
    private const S3 = 'https://graveyardjokes-cdn.s3.us-east-2.amazonaws.com/graveyardjokes/social';

    private const IMAGES = [
        self::S3.'/agency-intro.png',
        self::S3.'/portfolio-showcase.png',
        self::S3.'/services-packages.png',
    ];

    public function run(): void
    {
        // Idempotency guard — skip if any post is already scheduled for this window.
        $alreadySeeded = SocialScheduledPost::where('platform', 'facebook')
            ->whereBetween('scheduled_at', ['2026-09-07 00:00:00', '2026-09-18 23:59:59'])
            ->exists();

        if ($alreadySeeded) {
            $this->command->info('SocialSep2026BatchSeeder: posts already exist, skipping.');

            return;
        }

        $days = [
            Carbon::parse('2026-09-07 11:00:00'), // Monday
            Carbon::parse('2026-09-08 11:00:00'), // Tuesday
            Carbon::parse('2026-09-09 11:00:00'), // Wednesday
            Carbon::parse('2026-09-10 11:00:00'), // Thursday
            Carbon::parse('2026-09-11 11:00:00'), // Friday
            Carbon::parse('2026-09-14 11:00:00'), // Monday
            Carbon::parse('2026-09-15 11:00:00'), // Tuesday
            Carbon::parse('2026-09-16 11:00:00'), // Wednesday
            Carbon::parse('2026-09-17 11:00:00'), // Thursday
            Carbon::parse('2026-09-18 11:00:00'), // Friday
        ];

        $posts = [

            // ═══════════════════════════════════════════════════════════════
            // DAY 1 — Sep 7 · THEME: Local SEO & Google Business Profile
            // ═══════════════════════════════════════════════════════════════

            [
                'platform' => 'facebook',
                'scheduled_at' => $days[0],
                'media_url' => null,
                'content' => <<<'POST'
Your website is not the only thing Google ranks.

A lot of businesses spend everything on the website and nothing on the Google Business Profile that shows up before anyone even clicks through to it — the map pin, the reviews, the hours, the photos, the posts.

Local SEO runs through both. A fast, well-structured website matters. So does a Business Profile that is verified, categorized correctly, actively updated, and responding to reviews.

We manage both sides — the site and the profile — because ranking locally means showing up correctly everywhere someone might find you first.

🌐 graveyardjokes.com

#LocalSEO #GoogleBusinessProfile #SmallBusiness #DigitalMarketing #WesternNY
POST,
            ],
            [
                'platform' => 'discord',
                'scheduled_at' => $days[0],
                'media_url' => null,
                'content' => <<<'POST'
Something that gets overlooked constantly: your Google Business Profile is doing as much ranking work as your actual website, sometimes more, for local search.

Map pack results show up above organic listings for most "near me" searches. If your profile is unverified, miscategorized, or hasn't posted anything in six months, you are losing that real estate to a competitor who is.

We treat GBP management as part of the same system as the website — same content calendar, same monitoring, same accountability.

🌐 **graveyardjokes.com**

#LocalSEO #GoogleBusinessProfile #SmallBusiness
POST,
            ],
            [
                'platform' => 'instagram',
                'scheduled_at' => $days[0],
                'media_url' => self::IMAGES[0],
                'content' => <<<'POST'
Your website isn't the first thing people see. Your Google Business Profile is.

Map pin. Reviews. Hours. Photos. If that's not actively managed, you're losing the local search before anyone reaches your site.

We manage both.

🌐 graveyardjokes.com

#LocalSEO #GoogleBusinessProfile #SmallBusiness #DigitalMarketing #GraveyardJokesStudios
POST,
            ],

            // ═══════════════════════════════════════════════════════════════
            // DAY 2 — Sep 8 · THEME: Website security & maintenance
            // ═══════════════════════════════════════════════════════════════

            [
                'platform' => 'facebook',
                'scheduled_at' => $days[1],
                'media_url' => null,
                'content' => <<<'POST'
"We'll fix it if it breaks" is not a maintenance plan. It's a bet that nothing breaks at a convenient time.

Unpatched CMS plugins, expired SSL certificates, outdated dependencies with known vulnerabilities, no backup taken in months — these are not hypothetical risks. They are the most common way small business websites go down, get defaced, or get quietly used to serve malware to visitors.

Real maintenance means monitored uptime, scheduled backups that are actually tested for restore, dependency updates on a cadence, and a security patch process that doesn't wait for something to go visibly wrong.

It's not the exciting part of running a website. It's the part that determines whether the exciting part — the traffic, the conversions, the reputation — is still standing next year.

🌐 graveyardjokes.com

#WebsiteMaintenance #WebSecurity #SmallBusiness #DigitalMarketing
POST,
            ],
            [
                'platform' => 'discord',
                'scheduled_at' => $days[1],
                'media_url' => null,
                'content' => <<<'POST'
Real talk on maintenance: most "my site got hacked" stories start with a plugin that hadn't been updated in over a year, on a host with no backup retention, discovered only because Google started flagging the domain.

None of that is exotic. It's just neglect compounding until it's expensive.

What we run instead: automated dependency updates, tested backup restores (not just backups that exist — backups that have actually been restored once to confirm they work), uptime monitoring with alerting, and a patch cadence that doesn't wait for a CVE to make headlines.

Boring on purpose. That's the point.

🌐 **graveyardjokes.com**
POST,
            ],
            [
                'platform' => 'instagram',
                'scheduled_at' => $days[1],
                'media_url' => self::IMAGES[1],
                'content' => <<<'POST'
"We'll fix it if it breaks" is not a maintenance plan.

Monitored uptime. Tested backups. Patched dependencies. That's what keeps a site standing.

Boring on purpose.

🌐 graveyardjokes.com

#WebsiteMaintenance #WebSecurity #SmallBusiness #GraveyardJokesStudios
POST,
            ],

            // ═══════════════════════════════════════════════════════════════
            // DAY 3 — Sep 9 · THEME: The discovery call
            // ═══════════════════════════════════════════════════════════════

            [
                'platform' => 'facebook',
                'scheduled_at' => $days[2],
                'media_url' => null,
                'content' => <<<'POST'
Before we write a single line of code, we ask questions that have nothing to do with design.

What is the actual goal of this website — leads, sales, bookings, credibility? Who is the customer that matters most, and what do they need to see in the first five seconds? What is working on the current site, if anything, and what is actively costing you business? What does success look like in 90 days, not just at launch?

Skipping this step is how businesses end up with a beautiful site that does not convert, because it was built to look good instead of built to do a job.

The discovery call is not a formality before the real work starts. It is the first and most important part of the real work.

🌐 graveyardjokes.com

#WebDesign #WebDevelopment #SmallBusiness #DigitalStrategy
POST,
            ],
            [
                'platform' => 'discord',
                'scheduled_at' => $days[2],
                'media_url' => null,
                'content' => <<<'POST'
Process note: the discovery call happens before any design mockup, any wireframe, any line of code.

The questions are deliberately not about color palettes or fonts. They're about the business — what the site actually needs to accomplish, who it needs to convince, what's currently broken or missing, and what a win looks like 90 days after launch.

Skip that step and you get a site that looks right and performs wrong. Every project starts here for a reason.

🌐 **graveyardjokes.com**
POST,
            ],
            [
                'platform' => 'instagram',
                'scheduled_at' => $days[2],
                'media_url' => self::IMAGES[2],
                'content' => <<<'POST'
Before a single line of code, we ask what this site actually needs to do — not what it should look like.

Design without a goal is just decoration.

🌐 graveyardjokes.com

#WebDesign #WebDevelopment #SmallBusiness #GraveyardJokesStudios
POST,
            ],

            // ═══════════════════════════════════════════════════════════════
            // DAY 4 — Sep 10 · THEME: Why Laravel + React over a website builder
            // ═══════════════════════════════════════════════════════════════

            [
                'platform' => 'facebook',
                'scheduled_at' => $days[3],
                'media_url' => null,
                'content' => <<<'POST'
Website builders are not wrong for every business. They are wrong for businesses that are going to outgrow them, which is more businesses than the builders' marketing admits.

Templated platforms trade flexibility for speed at setup. That trade works fine until you need a custom checkout flow, an integration with a tool that isn't in the app marketplace, a performance fix that requires touching code you don't have access to, or a design that doesn't fit inside the theme's constraints.

We build on Laravel and React — an open backend framework and a modern frontend library, not a proprietary black box. That means full control over performance, security, integrations, and design, with no platform lock-in and no monthly fee to a page-builder company for the privilege of hosting your own business.

It takes more skill to build this way. It is also the only way to build something that scales with you instead of around you.

🌐 graveyardjokes.com

#WebDevelopment #Laravel #React #SmallBusiness #CustomWebsite
POST,
            ],
            [
                'platform' => 'discord',
                'scheduled_at' => $days[3],
                'media_url' => null,
                'content' => <<<'POST'
Tech stack note, since people ask: everything we build runs on Laravel (backend) and React (frontend), not a page-builder platform.

The tradeoff with builders is real — faster initial setup, but you hit a wall the moment you need something outside the template: a custom integration, a non-standard checkout flow, a performance fix that requires actual code access.

Open frameworks mean no platform lock-in, no forced monthly fee to the builder company, and no ceiling on what the site can eventually do.

Slower to start. No ceiling later. That's the trade we make on purpose.

🌐 **graveyardjokes.com**
POST,
            ],
            [
                'platform' => 'instagram',
                'scheduled_at' => $days[3],
                'media_url' => self::IMAGES[0],
                'content' => <<<'POST'
Website builders trade flexibility for speed. We build on Laravel + React instead — open frameworks, full control, no ceiling on what the site can become.

Slower to start. No ceiling later.

🌐 graveyardjokes.com

#WebDevelopment #Laravel #React #GraveyardJokesStudios
POST,
            ],

            // ═══════════════════════════════════════════════════════════════
            // DAY 5 — Sep 11 · THEME: Analytics without the bot noise
            // ═══════════════════════════════════════════════════════════════

            [
                'platform' => 'facebook',
                'scheduled_at' => $days[4],
                'media_url' => null,
                'content' => <<<'POST'
A visitor count is not an analytics strategy. Neither is a bounce rate you have never questioned.

Most small business dashboards are full of noise — bot traffic inflating page views, crawler hits counted as visits, your own team's browsing mixed in with actual customer behavior. If you have never filtered that out, your numbers are not telling you what is actually happening on your site.

Real analytics means knowing which pages convert, where visitors actually come from, how long a real human spends before leaving, and separating that signal from the automated traffic that hits every public website on the internet constantly.

We build that filtering into every site we manage, because a decision made on bad data is worse than no decision at all.

🌐 graveyardjokes.com

#Analytics #DataDrivenMarketing #SmallBusiness #DigitalMarketing
POST,
            ],
            [
                'platform' => 'discord',
                'scheduled_at' => $days[4],
                'media_url' => null,
                'content' => <<<'POST'
Unpopular but true opinion: most small business "analytics" are mostly noise.

Bot traffic, crawler hits, scrapers running out of cloud datacenters with browser-spoofed user agents — all of it inflates page view counts and makes bounce rate meaningless if it's not filtered out. We spent real time this year making sure our own dashboards separate real human visits from that noise, because a decision made on bad data is worse than guessing.

If your analytics dashboard has never had someone actively audit what's actually hitting it, the numbers you're looking at are probably wrong.

🌐 **graveyardjokes.com**
POST,
            ],
            [
                'platform' => 'instagram',
                'scheduled_at' => $days[4],
                'media_url' => self::IMAGES[1],
                'content' => <<<'POST'
A visitor count means nothing if half of it is bots.

Real analytics means filtering the noise before you trust the number.

🌐 graveyardjokes.com

#Analytics #DataDrivenMarketing #SmallBusiness #GraveyardJokesStudios
POST,
            ],

            // ═══════════════════════════════════════════════════════════════
            // DAY 6 — Sep 14 · THEME: Branding consistency across platforms
            // ═══════════════════════════════════════════════════════════════

            [
                'platform' => 'facebook',
                'scheduled_at' => $days[5],
                'media_url' => null,
                'content' => <<<'POST'
The same business should not look like three different companies depending on which platform you find it on.

Inconsistent logos, mismatched color schemes, a tone on Instagram that has nothing to do with the tone on the website, contact information that is current in one place and outdated in another — every one of these gaps chips away at trust before a potential client has decided anything about the actual work.

Consistency is not about being flashy. It is about being recognizable and credible everywhere someone encounters you, in whatever order they encounter you.

We manage brand presence as one system across the website, social platforms, and Google Business Profile — same voice, same visual identity, same information, everywhere.

🌐 graveyardjokes.com

#Branding #BrandStrategy #SmallBusiness #DigitalMarketing
POST,
            ],
            [
                'platform' => 'discord',
                'scheduled_at' => $days[5],
                'media_url' => null,
                'content' => <<<'POST'
Small thing that matters more than it should: your brand should look and sound like the same business everywhere someone finds it.

Different logo crop on Instagram than the website. Contact info that's current on Facebook but outdated on Google. A completely different tone across platforms. All of it reads as inattention, even when the actual work is solid.

We run brand presence as one system — one voice, one visual identity, synced information — across every platform, not managed platform-by-platform in isolation.

🌐 **graveyardjokes.com**
POST,
            ],
            [
                'platform' => 'instagram',
                'scheduled_at' => $days[5],
                'media_url' => self::IMAGES[2],
                'content' => <<<'POST'
You shouldn't look like three different businesses depending on where someone finds you.

One voice. One identity. Everywhere.

🌐 graveyardjokes.com

#Branding #BrandStrategy #SmallBusiness #GraveyardJokesStudios
POST,
            ],

            // ═══════════════════════════════════════════════════════════════
            // DAY 7 — Sep 15 · THEME: The 48-hour response promise
            // ═══════════════════════════════════════════════════════════════

            [
                'platform' => 'facebook',
                'scheduled_at' => $days[6],
                'media_url' => null,
                'content' => <<<'POST'
If you have ever emailed an agency and waited two weeks for a reply, you already know why this matters.

We respond to client messages within 48 hours, without exception. Not because it is a nice gesture, but because availability is part of what you are actually paying for. A website management retainer that comes with a two-week response time on urgent issues is not really a retainer — it is a subscription to eventual help.

Small teams have an advantage here that large agencies structurally cannot match: fewer layers between you and the person who can actually fix the problem.

🌐 graveyardjokes.com

#ClientService #SmallBusiness #DigitalMarketing #Agency
POST,
            ],
            [
                'platform' => 'discord',
                'scheduled_at' => $days[6],
                'media_url' => null,
                'content' => <<<'POST'
Standing policy: 48-hour response time on all client messages, no exceptions, urgent or not.

This is one of the actual advantages of staying a small, focused studio instead of scaling into a bigger agency with account managers and ticket queues between you and the person who can fix your problem. Fewer layers. Faster answers.

Availability is part of the service, not an extra.

🌐 **graveyardjokes.com**
POST,
            ],
            [
                'platform' => 'instagram',
                'scheduled_at' => $days[6],
                'media_url' => self::IMAGES[0],
                'content' => <<<'POST'
48-hour response time. No exceptions.

Availability is part of the service, not an extra.

🌐 graveyardjokes.com

#ClientService #SmallBusiness #GraveyardJokesStudios
POST,
            ],

            // ═══════════════════════════════════════════════════════════════
            // DAY 8 — Sep 16 · THEME: What "built and maintained in-house" means
            // ═══════════════════════════════════════════════════════════════

            [
                'platform' => 'facebook',
                'scheduled_at' => $days[7],
                'media_url' => null,
                'content' => <<<'POST'
"Built and maintained in-house" is a phrase we use often, so it is worth being specific about what it actually means.

It means the same team that wrote the code is the team that gets paged if something breaks. It means no outsourced development shop that disappears after handoff, no subcontractor churn between the sales conversation and the actual build, no support ticket that gets routed through three time zones before reaching someone who understands the codebase.

Every project in our portfolio — seven live sites, spanning streaming platforms, eCommerce stores, and content management systems — is built and maintained this way. That accountability does not scale infinitely, which is exactly why we keep a small roster instead of overselling capacity.

🌐 graveyardjokes.com

#WebDevelopment #SmallBusiness #InHouse #DigitalAgency
POST,
            ],
            [
                'platform' => 'discord',
                'scheduled_at' => $days[7],
                'media_url' => null,
                'content' => <<<'POST'
Get asked this enough that it's worth restating: when we say "in-house," we mean the person who built your site is the same person who gets the alert if it goes down.

No outsourced dev shop, no subcontractor rotation, no support ticket routed through people who've never seen the codebase. Seven live projects in the portfolio right now, all held to that same standard.

It's also why we deliberately keep the client roster small — that level of accountability doesn't scale to fifty accounts.

🌐 **graveyardjokes.com**
POST,
            ],
            [
                'platform' => 'instagram',
                'scheduled_at' => $days[7],
                'media_url' => self::IMAGES[1],
                'content' => <<<'POST'
"Built and maintained in-house" means the person who built it is the person who gets the alert if it breaks.

No outsourcing. No handoffs.

🌐 graveyardjokes.com

#WebDevelopment #SmallBusiness #GraveyardJokesStudios
POST,
            ],

            // ═══════════════════════════════════════════════════════════════
            // DAY 9 — Sep 17 · THEME: Redesign vs. rebuild
            // ═══════════════════════════════════════════════════════════════

            [
                'platform' => 'facebook',
                'scheduled_at' => $days[8],
                'media_url' => null,
                'content' => <<<'POST'
Not every outdated website needs to be torn down and rebuilt from zero. Knowing the difference saves clients real money.

A redesign makes sense when the underlying structure is sound — the CMS is reasonable, the hosting is stable, the core functionality works — but the visual design, content, and user experience have fallen behind. That is a faster, cheaper path to a modern-feeling site.

A rebuild is the right call when the foundation itself is the problem: an unsupported platform, security debt that keeps compounding, a codebase nobody can safely modify anymore, or a business model the current site was never built to support.

We evaluate that honestly before quoting either option, because the more expensive answer is not always the right one.

🌐 graveyardjokes.com

#WebDesign #WebDevelopment #SmallBusiness #WebsiteRedesign
POST,
            ],
            [
                'platform' => 'discord',
                'scheduled_at' => $days[8],
                'media_url' => null,
                'content' => <<<'POST'
Question we get more than expected: "does my site need a redesign or a full rebuild?"

Redesign: the foundation is fine — stable hosting, reasonable CMS, working core functionality — but the look, content, and UX are dated. Faster and cheaper.

Rebuild: the foundation itself is the problem. Unsupported platform, compounding security debt, a codebase nobody can safely touch anymore.

We give the honest answer during the audit, even when it's the cheaper one.

🌐 **graveyardjokes.com**
POST,
            ],
            [
                'platform' => 'instagram',
                'scheduled_at' => $days[8],
                'media_url' => self::IMAGES[2],
                'content' => <<<'POST'
Redesign or rebuild? Depends on whether the foundation is the problem or just the look.

We tell you honestly which one you actually need.

🌐 graveyardjokes.com

#WebDesign #WebsiteRedesign #GraveyardJokesStudios
POST,
            ],

            // ═══════════════════════════════════════════════════════════════
            // DAY 10 — Sep 18 · THEME: Q3 studio check-in
            // ═══════════════════════════════════════════════════════════════

            [
                'platform' => 'facebook',
                'scheduled_at' => $days[9],
                'media_url' => null,
                'content' => <<<'POST'
Quick studio update as we head into the last stretch of Q3.

This summer: Google Business Profile management came fully online, analytics got a real overhaul so the numbers we report actually reflect real visitors instead of bot noise, and the social media system got more reliable — fewer dropped posts, faster recovery when something does fail.

None of that is flashy work. All of it is the kind of infrastructure that has to be solid before the visible stuff — the campaigns, the launches, the client sites — can be trusted.

Heading into Q4: more client work, more portfolio additions, and the same weekly cadence of updates we committed to earlier this year.

🌐 graveyardjokes.com

#StudioUpdate #BuildInPublic #SmallBusiness #DigitalAgency
POST,
            ],
            [
                'platform' => 'discord',
                'scheduled_at' => $days[9],
                'media_url' => null,
                'content' => <<<'POST'
Quarterly-ish check-in since it's been a minute since the last one.

Shipped this summer: Google Business Profile is fully wired up and posting reliably, analytics got audited and cleaned up (bot traffic and internal testing no longer pollute the numbers), and the social dispatch system is more resilient — fewer silent failures, faster recovery when something does break.

Boring infrastructure work, mostly invisible from the outside, but it's what everything visible gets built on top of.

Heading into Q4: more client builds, more portfolio updates, same weekly cadence.

🌐 **graveyardjokes.com**
POST,
            ],
            [
                'platform' => 'instagram',
                'scheduled_at' => $days[9],
                'media_url' => self::IMAGES[0],
                'content' => <<<'POST'
Quick Q3 check-in: analytics cleaned up, Google Business Profile fully online, social system more reliable.

Boring infrastructure. Necessary foundation.

More coming in Q4.

🌐 graveyardjokes.com

#StudioUpdate #BuildInPublic #GraveyardJokesStudios
POST,
            ],
        ];

        foreach ($posts as $post) {
            SocialScheduledPost::create([
                'platform' => $post['platform'],
                'content' => $post['content'],
                'media_url' => $post['media_url'],
                'scheduled_at' => $post['scheduled_at'],
                'status' => 'pending',
            ]);
        }

        $this->command->info('SocialSep2026BatchSeeder: scheduled '.count($posts).' posts.');
    }
}
