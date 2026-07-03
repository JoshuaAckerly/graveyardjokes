<?php

namespace Database\Seeders;

use App\Models\SocialScheduledPost;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

/**
 * Schedules the July 7–11, 2026 social media batch for Graveyard Jokes Studios.
 *
 * Platforms: Facebook, Discord, Twitter/X, Instagram (4 unique posts per day — 20 total)
 * Schedule:  Daily at 11:00 AM
 * Instagram: Images cycled from public/storage/instagram/ (3 available)
 *
 * Content themes:
 *   July  7 — Web Presence vs. "Just a Website" (first impressions, credibility)
 *   July  8 — The Cost of Waiting (why delaying a site rebuild loses business)
 *   July  9 — Stack Transparency (what we build with and why it matters)
 *   July 10 — How the Process Works (from first call to launch)
 *   July 11 — Mid-Year CTA (Q3 is the right time to start for a Q4-ready site)
 *
 * Run on production only — exactly once:
 *   php artisan db:seed --class=SocialJuly7BatchSeeder --force
 */
class SocialJuly7BatchSeeder extends Seeder
{
    private const SITE = 'https://graveyardjokes.com';

    private const IMAGES = [
        self::SITE.'/storage/instagram/Copilot_20260516_201107.png',
        self::SITE.'/storage/instagram/Copilot_20260516_201400.png',
        self::SITE.'/storage/instagram/Copilot_20260516_201630.png',
    ];

    public function run(): void
    {
        $days = [
            Carbon::parse('2026-07-07 11:00:00'),
            Carbon::parse('2026-07-08 11:00:00'),
            Carbon::parse('2026-07-09 11:00:00'),
            Carbon::parse('2026-07-10 11:00:00'),
            Carbon::parse('2026-07-11 11:00:00'),
        ];

        $posts = [

            // ═══════════════════════════════════════════════════════════════
            // DAY 1 — July 7 · THEME: Web Presence vs. "Just a Website"
            // ═══════════════════════════════════════════════════════════════

            [
                'platform' => 'facebook',
                'scheduled_at' => $days[0],
                'media_url' => null,
                'content' => <<<'POST'
There is a difference between having a website and having a web presence.

A website is a page that exists. A web presence is the sum of everything a potential client finds when they look you up — your site's speed, its design, its clarity, the way it describes what you do and who it is for.

Most people form an opinion about a site in under a second. That is not enough time to read a headline. It is pure visual and experiential signal: does this feel like a business I can trust?

A site that loads slowly, looks outdated, or makes it hard to figure out what you offer is not neutral. It actively works against you. The visitor does not spend time diagnosing what is wrong — they just leave.

If your current site does not represent what your business actually is, it is working against you every day it stays up.

We build web presences — not just websites.

🌐 graveyardjokes.com

#WebDesign #WebDevelopment #SmallBusiness #BrandStrategy #WebPresence
POST,
            ],

            [
                'platform' => 'discord',
                'scheduled_at' => $days[0],
                'media_url' => null,
                'content' => <<<'POST'
Something I think about when approaching a new client site:

The goal is not to make something that looks impressive in a portfolio screenshot. It is to make something that converts — that communicates what the business does, earns trust quickly, and makes the next step obvious.

That requires making decisions that are not always design decisions: what goes above the fold, what the primary CTA is, how the nav is structured, how fast the page loads, whether the copy describes what the visitor cares about (not what the business owner is proud of).

A lot of sites fail not because they look bad but because they are organized around the business's internal perspective instead of the visitor's perspective. "About us" sections that lead with founding dates. Service pages that use jargon. Contact pages buried three clicks deep.

Good web presence design is information architecture as much as it is visual design.

🌐 **graveyardjokes.com**

#WebDesign #UX #BuildInPublic #SmallBusiness
POST,
            ],

            [
                'platform' => 'twitter',
                'scheduled_at' => $days[0],
                'media_url' => null,
                'content' => <<<'POST'
There's a difference between having a website and having a web presence.

Speed. Clarity. Trust signals. A CTA that makes the next step obvious.

Most visitors form an opinion in under a second. That's before they've read a word.

🌐 graveyardjokes.com

#WebDesign #SmallBusiness #WebPresence
POST,
            ],

            [
                'platform' => 'instagram',
                'scheduled_at' => $days[0],
                'media_url' => self::IMAGES[0],
                'content' => <<<'POST'
A website that exists is not the same as a web presence that works.

Speed. Clarity. Trust signals on the first screen. A next step that is obvious.

Visitors form an opinion before they've finished reading the headline.

We build sites that convert — not just sites that exist.

🌐 graveyardjokes.com

#WebDesign #WebDevelopment #SmallBusiness #BrandStrategy #WebPresence #GraveyardJokesStudios
POST,
            ],

            // ═══════════════════════════════════════════════════════════════
            // DAY 2 — July 8 · THEME: The Cost of Waiting
            // ═══════════════════════════════════════════════════════════════

            [
                'platform' => 'facebook',
                'scheduled_at' => $days[1],
                'media_url' => null,
                'content' => <<<'POST'
"We'll update the site later" is one of the most expensive decisions a small business makes without realizing it.

Every week an outdated or broken site is live, it is the first thing potential clients see. Every week a business operates without a site at all, it is invisible to anyone who looks it up before reaching out.

The delay feels free because there is no invoice attached to it. But the opportunity cost is real — leads that bounced, clients that went elsewhere, credibility that was not established.

The best time to fix a site is before you needed it. The second best time is now.

A professional web presence from Graveyard Jokes Studios starts at $799. We keep scope tight, timelines clear, and the client informed at every stage. Most projects launch in 4–6 weeks.

🌐 graveyardjokes.com

#WebDevelopment #SmallBusiness #WebDesign #BusinessGrowth
POST,
            ],

            [
                'platform' => 'discord',
                'scheduled_at' => $days[1],
                'media_url' => null,
                'content' => <<<'POST'
There is a specific kind of invisible cost that small business owners underestimate: the compounding cost of a site that is "good enough for now."

It does not show up as a line item. It shows up as:
- A potential client who looked you up and went with someone else
- A referral who could not find anything about you and moved on
- A pitch that went poorly because your site did not support your credibility

The site that would have changed those outcomes already exists in some form — it just was not built yet.

The practical fix is not complicated. Get the current state of the site assessed. Understand what is hurting conversion. Fix it. The gap between "adequate" and "effective" is usually smaller than people expect.

That is the first conversation we have with clients — not a sales pitch, just an honest look at what is working and what is not.

🌐 **graveyardjokes.com**

#WebDevelopment #SmallBusiness #BusinessGrowth #BuildInPublic
POST,
            ],

            [
                'platform' => 'twitter',
                'scheduled_at' => $days[1],
                'media_url' => null,
                'content' => <<<'POST'
"We'll update the site later" has no invoice attached — but the cost is real.

Every week an outdated site is live, it's working against you.

Starting at $799. Most projects launch in 4–6 weeks.

🌐 graveyardjokes.com

#WebDevelopment #SmallBusiness #WebDesign
POST,
            ],

            [
                'platform' => 'instagram',
                'scheduled_at' => $days[1],
                'media_url' => self::IMAGES[1],
                'content' => <<<'POST'
The delay feels free because there's no invoice attached to it.

But every week an outdated or broken site is the first thing a potential client sees — it's costing you.

Leads that bounced. Clients that went elsewhere. Credibility that was never established.

Starting at $799. Most projects launch in 4–6 weeks.

🌐 graveyardjokes.com

#WebDevelopment #SmallBusiness #WebDesign #BusinessGrowth #GraveyardJokesStudios
POST,
            ],

            // ═══════════════════════════════════════════════════════════════
            // DAY 3 — July 9 · THEME: Stack Transparency
            // ═══════════════════════════════════════════════════════════════

            [
                'platform' => 'facebook',
                'scheduled_at' => $days[2],
                'media_url' => null,
                'content' => <<<'POST'
Every project we build runs on the same core stack: Laravel 12, React 19, TypeScript, Tailwind CSS, deployed to AWS EC2.

That consistency is a deliberate choice, and it matters for clients in practical ways.

Laravel is a mature, actively maintained PHP framework with an exceptional ecosystem — queues, schedulers, notifications, file storage, authentication, testing tools, all built in or one package away. It handles the backend without reinventing the wheel.

React 19 with TypeScript gives us a typed component system that scales as the project grows. Bugs that would appear at runtime in JavaScript get caught at compile time in TypeScript. Tailwind keeps the styling consistent and fast to iterate on.

AWS EC2 means we own the infrastructure — no platform lock-in, no surprise plan changes, no traffic limits. The client's data and application live on a server we control.

This is not the cheapest stack to run and it is not the fastest to scaffold. It is the stack that holds up in production, is safe to hand off, and does not surprise you three years later.

🌐 graveyardjokes.com

#WebDevelopment #Laravel #React #TypeScript #AWS #TechStack
POST,
            ],

            [
                'platform' => 'discord',
                'scheduled_at' => $days[2],
                'media_url' => null,
                'content' => <<<'POST'
The full stack behind every Graveyard Jokes Studios project, if anyone is curious:

**Backend:** Laravel 12 — routing, models, jobs, queues, scheduling, migrations, tests. The whole application layer.

**Frontend bridge:** Inertia.js — server-side routing with client-side rendering. No separate API layer to maintain for standard CRUD pages. React components receive typed props directly from controllers.

**Frontend:** React 19 + TypeScript + Tailwind CSS. Typed components, Zod schemas for validation, consistent utility-class styling.

**Testing:** PHPUnit for backend feature + unit tests. Vitest for frontend. Every project has test coverage before it ships.

**Infra:** AWS EC2 (Ubuntu), Nginx, Let's Encrypt SSL, S3 for file storage, RDS or local MySQL depending on scope.

**CI/CD:** GitHub Actions — type check, lint, build, and test on every push to main.

The consistency across every project means lower context-switching cost, shared patterns, and the ability to reuse solved problems.

🌐 **graveyardjokes.com**

#Laravel #React #TypeScript #WebDevelopment #BuildInPublic #TechStack
POST,
            ],

            [
                'platform' => 'twitter',
                'scheduled_at' => $days[2],
                'media_url' => null,
                'content' => <<<'POST'
Every project we build:

→ Laravel 12 (backend)
→ Inertia + React 19 + TypeScript (frontend)
→ Tailwind CSS (styling)
→ PHPUnit + Vitest (tests)
→ AWS EC2 + S3 (infra)
→ GitHub Actions (CI/CD)

Same stack. Every project. Consistent, tested, ownable.

🌐 graveyardjokes.com

#Laravel #React #WebDevelopment #TechStack
POST,
            ],

            [
                'platform' => 'instagram',
                'scheduled_at' => $days[2],
                'media_url' => self::IMAGES[2],
                'content' => <<<'POST'
Same stack on every project.

Laravel 12. React 19. TypeScript. Tailwind. AWS EC2. GitHub Actions.

Consistency means fewer surprises, faster iteration, and code you can actually own long-term.

Not the cheapest stack. The one that holds up in production.

🌐 graveyardjokes.com

#WebDevelopment #Laravel #React #TypeScript #TechStack #GraveyardJokesStudios
POST,
            ],

            // ═══════════════════════════════════════════════════════════════
            // DAY 4 — July 10 · THEME: How the Process Works
            // ═══════════════════════════════════════════════════════════════

            [
                'platform' => 'facebook',
                'scheduled_at' => $days[3],
                'media_url' => null,
                'content' => <<<'POST'
A lot of people hesitate to reach out about a project because they are not sure what happens next. Here is exactly what the process looks like at Graveyard Jokes Studios.

First, a conversation. We talk through what you need, what you already have, and what a successful outcome looks like. No pitch — just a diagnostic.

Then a scope. We put together a clear description of what gets built, what is out of scope, what it costs, and how long it takes. You approve it or we revise it. Nothing starts until the scope is agreed on.

Then we build. You will see the project at key milestones — not at the end. Review cycles are built into the timeline so feedback gets incorporated, not appended.

Then we launch. DNS cutover, SSL, monitoring, and a handoff document so you know exactly what you have and how it works.

Then post-launch support. Questions, small fixes, and guidance on how to manage the site yourself are all part of the engagement.

That is the full picture. If it sounds straightforward, that is intentional.

🌐 graveyardjokes.com

#WebDevelopment #WebDesign #SmallBusiness #ClientExperience #Process
POST,
            ],

            [
                'platform' => 'discord',
                'scheduled_at' => $days[3],
                'media_url' => null,
                'content' => <<<'POST'
The thing that makes client work go badly is almost always the same: unclear scope, no defined review points, and surprises at launch.

The way I structure projects to avoid that:

1. **Scoping call first** — understand what the business actually needs vs. what they think they need. These are often different.
2. **Written scope doc** — what is in, what is out, what success looks like. Signed off before any work starts.
3. **Milestone reviews** — the client sees the project at design, at functional prototype, and at pre-launch. Not just at the end.
4. **Documented handoff** — what was built, how it is deployed, how to manage it, what to do if something breaks. The client should not need to call me to change a page title.

Most of the friction in agency-client relationships comes from one side or the other not knowing what to expect. The process is the fix for that.

🌐 **graveyardjokes.com**

#WebDevelopment #ClientWork #Process #BuildInPublic #SmallBusiness
POST,
            ],

            [
                'platform' => 'twitter',
                'scheduled_at' => $days[3],
                'media_url' => null,
                'content' => <<<'POST'
How a project works at Graveyard Jokes Studios:

1. Diagnostic call — understand what you actually need
2. Written scope — what gets built, what it costs, how long
3. Milestone reviews — you see it before it's done
4. Launch + handoff doc
5. Post-launch support

No surprises. No disappearing after launch.

🌐 graveyardjokes.com

#WebDevelopment #SmallBusiness #Process
POST,
            ],

            [
                'platform' => 'instagram',
                'scheduled_at' => $days[3],
                'media_url' => self::IMAGES[0],
                'content' => <<<'POST'
A lot of people hesitate to reach out because they don't know what happens next.

Here's the short version: a conversation, a written scope, milestone reviews so you see it before it's finished, a launch, and a handoff doc so you actually understand what you own.

No surprises. No disappearing after launch.

🌐 graveyardjokes.com

#WebDevelopment #WebDesign #SmallBusiness #ClientExperience #Process #GraveyardJokesStudios
POST,
            ],

            // ═══════════════════════════════════════════════════════════════
            // DAY 5 — July 11 · THEME: Mid-Year CTA
            // ═══════════════════════════════════════════════════════════════

            [
                'platform' => 'facebook',
                'scheduled_at' => $days[4],
                'media_url' => null,
                'content' => <<<'POST'
We are now past the midpoint of 2026. If a new website or a site rebuild was on the list for this year and has not happened yet, Q3 is the right time to start.

A project that kicks off in July can realistically launch in late August or September — well before Q4, when attention is on end-of-year activity, holiday campaigns, and budget planning. A site that is live and indexed by October has months of SEO runway before the end of the year.

Starting in September means launching in November at the earliest — which means scrambling during the part of the year when you least want to.

Graveyard Jokes Studios is currently accepting new clients. Packages start at $799. We keep the roster intentionally small so every project gets the attention it deserves.

If you have something in mind, now is a good time to reach out.

🌐 graveyardjokes.com

#WebDevelopment #WebDesign #SmallBusiness #Q3Planning #MidYear
POST,
            ],

            [
                'platform' => 'discord',
                'scheduled_at' => $days[4],
                'media_url' => null,
                'content' => <<<'POST'
Mid-year check-in: Graveyard Jokes Studios is taking on new client work for Q3.

If you have been putting off a site build, redesign, custom application, or digital marketing engagement — July is a better start than September. Projects that kick off this month can be live by late August, before Q4 planning kicks in.

The current stack: Laravel 12 / React 19 / TypeScript / Tailwind / AWS. Every project includes design, development, deployment, and post-launch support. Scope and timeline are agreed on before any work starts.

Packages start at $799. Feel free to DM or reach out through the site.

🌐 **graveyardjokes.com**

#WebDevelopment #OpenForWork #SmallBusiness #Q3 #Laravel
POST,
            ],

            [
                'platform' => 'twitter',
                'scheduled_at' => $days[4],
                'media_url' => null,
                'content' => <<<'POST'
We are past the midpoint of 2026.

A project that starts in July can launch in late August — well before Q4.

Currently taking on new clients. Packages from $799.

🌐 graveyardjokes.com

#WebDevelopment #OpenForWork #SmallBusiness #Q3
POST,
            ],

            [
                'platform' => 'instagram',
                'scheduled_at' => $days[4],
                'media_url' => self::IMAGES[1],
                'content' => <<<'POST'
Past the midpoint of 2026.

If a new site was on the list for this year — July is the right time to start. A project that kicks off now can launch before Q4.

Currently taking on new clients. Packages from $799.

🌐 graveyardjokes.com

#WebDevelopment #WebDesign #SmallBusiness #OpenForWork #Q3Planning #GraveyardJokesStudios
POST,
            ],

        ];

        foreach ($posts as $post) {
            SocialScheduledPost::create([
                'platform' => $post['platform'],
                'content' => trim($post['content']),
                'media_url' => $post['media_url'] ?? null,
                'scheduled_at' => $post['scheduled_at'],
                'status' => 'pending',
            ]);
        }

        $this->command->info('Seeded 20 social posts for July 7–11 batch (Facebook, Discord, Twitter/X, Instagram).');
    }
}
