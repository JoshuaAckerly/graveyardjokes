<?php

namespace Database\Seeders;

use App\Models\SocialScheduledPost;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

/**
 * Schedules the July 30 – Aug 5, 2026 social media batch for Graveyard Jokes Studios.
 *
 * Platforms: Facebook, Discord (2 posts/day — 10 total)
 * Schedule:  Weekdays at 11:00 AM (skips weekend days Aug 1–2)
 *
 * Content themes:
 *   July 30 — The agency runaround problem (direct communication model)
 *   July 31 — Documentation as a deliverable (owning what you paid for)
 *   Aug  3  — Small roster discipline (why focused > scaled)
 *   Aug  4  — The invisible cost of an outdated site (first impressions, conversion)
 *   Aug  5  — What social media management actually is (not just posting)
 *
 * Run on production only — exactly once:
 *   php artisan db:seed --class=SocialJuly30BatchSeeder --force
 */
class SocialJuly30BatchSeeder extends Seeder
{

    public function run(): void
    {
        // Idempotency guard — skip if any post is already scheduled for this batch window.
        $alreadySeeded = SocialScheduledPost::where('platform', 'facebook')
            ->whereBetween('scheduled_at', ['2026-07-30 00:00:00', '2026-08-05 23:59:59'])
            ->exists();

        if ($alreadySeeded) {
            $this->command->info('SocialJuly30BatchSeeder: posts already exist, skipping.');

            return;
        }

        $days = [
            Carbon::parse('2026-07-30 11:00:00'), // Thursday
            Carbon::parse('2026-07-31 11:00:00'), // Friday
            Carbon::parse('2026-08-03 11:00:00'), // Monday
            Carbon::parse('2026-08-04 11:00:00'), // Tuesday
            Carbon::parse('2026-08-05 11:00:00'), // Wednesday
        ];

        $posts = [

            // ═══════════════════════════════════════════════════════════════
            // DAY 1 — July 30 · THEME: The Agency Runaround
            // ═══════════════════════════════════════════════════════════════

            [
                'platform' => 'facebook',
                'scheduled_at' => $days[0],
                'media_url' => null,
                'content' => <<<'POST'
Most agencies have account managers. You email the account manager. The account manager emails the strategist. The strategist talks to the developer. The developer asks a clarifying question that gets routed back through the same chain. Three business days later, you get a response that does not fully answer what you asked.

That is not a systems problem. It is a business model problem.

Agencies built around volume need account managers to protect developer time. The account manager is a filter — and that filter has a cost, both financially and in the quality of the information that actually reaches the person doing the work.

At Graveyard Jokes Studios, you communicate directly with the person building your project. Not a coordinator. Not a liaison. The developer, who wrote the code, made the decisions, and understands why things work the way they do.

That means faster turnaround on questions. It means ambiguity gets resolved in a conversation rather than a ticket queue. It means your business context is not translated through three layers of abstraction before it reaches the work.

The tradeoff: we keep a small roster. We do not take on work we cannot give full attention to.

If you have worked with an agency before and spent more time managing the relationship than managing your business — there is another way.

🌐 graveyardjokes.com

#WebDevelopment #WebDesign #SmallBusiness #DirectCommunication #AgencyAlternative
POST,
            ],

            [
                'platform' => 'discord',
                'scheduled_at' => $days[0],
                'media_url' => null,
                'content' => <<<'POST'
Something I think about when clients describe past agency experiences:

The account manager model makes sense for large agencies. It lets them scale — one PM coordinates ten clients while developers stay heads-down. The math works for the agency.

The problem is that the filter degrades the signal. By the time your actual business context reaches the person building your product, it has been summarized twice and stripped of the nuance that matters.

The way I work: you talk to me directly. Not a project coordinator, not a liaison — me, the person writing the code.

That comes with a tradeoff: I keep a small roster. But it means the person building your product actually understands the business behind it.

If that sounds like what you have been missing from past agency work, reach out.

→ graveyardjokes.com
POST,
            ],

            // ═══════════════════════════════════════════════════════════════
            // DAY 2 — July 31 · THEME: Documentation as a Deliverable
            // ═══════════════════════════════════════════════════════════════

            [
                'platform' => 'facebook',
                'scheduled_at' => $days[1],
                'media_url' => null,
                'content' => <<<'POST'
When a project ends, most agencies hand over a login and a good luck.

What you actually receive at the end of a Graveyard Jokes Studios engagement:

A handoff document. Not a user manual — a technical overview written so that you, your team, or any future developer can actually understand what was built. What runs where. What connects to what. What requires maintenance attention and what runs automatically. What the failure modes are and how to recognize them.

This is not an afterthought. It is part of the definition of done.

We operate this way across our own portfolio of seven live production products. Every service is documented before it ships — architecture, deployment notes, cron jobs, environment variables, external integrations. Not because we plan to disappear, but because the people who built a thing should not be the only people who can maintain it.

A project you do not understand is a project you do not own. The handoff document is not an extra. It is part of what you are paying for.

🌐 graveyardjokes.com

#WebDevelopment #WebDesign #SmallBusiness #Documentation #ClientWork
POST,
            ],

            [
                'platform' => 'discord',
                'scheduled_at' => $days[1],
                'media_url' => null,
                'content' => <<<'POST'
One thing that rarely comes up in agency pitches but matters a lot after a project ends:

**Do you actually understand what was built?**

Not "click this button to publish a post" — but "if something breaks at 2am, do you know what to look at?"

Every project I deliver includes a handoff doc. Architecture overview. What's running where. What the external dependencies are. What breaks silently vs. what throws an error you'll see.

Not because I'm planning to hand it off and disappear — but because you should genuinely own what you paid to build.

Same standard across our own portfolio. Same thing for clients.

→ graveyardjokes.com
POST,
            ],

            // ═══════════════════════════════════════════════════════════════
            // DAY 3 — Aug 3 · THEME: Small Roster Discipline
            // ═══════════════════════════════════════════════════════════════

            [
                'platform' => 'facebook',
                'scheduled_at' => $days[2],
                'media_url' => null,
                'content' => <<<'POST'
There is a version of agency growth most people assume is the goal: more clients, more staff, more revenue. Scale the operation. Build the machine.

That model works for a certain kind of business. It does not work for the kind of work we do.

When a developer is managing fifteen active projects, the projects that get the least friction get the least attention. Squeaky wheel economics apply. The clients who trust the process most — who do not send check-in emails every two days — quietly get deprioritized. Not intentionally. Just as a function of how finite attention gets distributed.

Graveyard Jokes Studios intentionally carries a small roster. The reason is simple: the quality of the output is directly proportional to the attention given to it. There is a margin between "good enough" and "excellent" that only opens up when you have the space to take an extra pass. That pass is where architecture decisions get reconsidered, where copy gets tightened, where the thing that would have become a production issue gets caught before it ships.

We trade volume for that margin. The work is better for it, and so is the client experience.

If you are looking for a developer who will treat your project the same way we treat our own — reach out.

🌐 graveyardjokes.com

#WebDevelopment #WebDesign #Boutique #Quality #SmallBusiness
POST,
            ],

            [
                'platform' => 'discord',
                'scheduled_at' => $days[2],
                'media_url' => null,
                'content' => <<<'POST'
Honest take on why I keep the roster small:

I've seen what happens to code quality when a developer is stretched across too many active projects. It's not that they stop caring — it's that the margin shrinks. The extra pass that turns good code into great code only happens when there's space for it.

Small roster means I always have that space.

Currently have capacity for one or two new projects this quarter. If you've been sitting on something, now's the time.

→ graveyardjokes.com
POST,
            ],

            // ═══════════════════════════════════════════════════════════════
            // DAY 4 — Aug 4 · THEME: The Invisible Cost of an Outdated Site
            // ═══════════════════════════════════════════════════════════════

            [
                'platform' => 'facebook',
                'scheduled_at' => $days[3],
                'media_url' => null,
                'content' => <<<'POST'
An outdated website does not need to be broken to cost you business. It just needs to feel wrong.

Visitors do not consciously audit your site for design trends. They do not notice that the font choice is five years old or that the layout was built before mobile-first was standard. What they notice — in under a second, before they have finished reading anything — is whether the site feels like it belongs to a business they can trust.

That impression is formed and largely fixed before any content is read.

If your site loads slowly, the trust deficit starts there. If the first screen is crowded or unclear, it compounds. If the contact path requires more effort than it should, that is the exit. None of these are subjective aesthetic preferences. They are conversion mechanics — and they are measurable.

Modernization does not always mean a full rebuild. Sometimes it is a targeted intervention: improving load performance, redesigning the above-the-fold experience, clarifying the primary call to action. The scope depends on what is actually costing you, which is the first thing we figure out together.

If you have ever looked at your own homepage and felt like something was off, you were probably right.

🌐 graveyardjokes.com

#WebDesign #WebDevelopment #Conversion #UX #SmallBusiness #SiteAudit
POST,
            ],

            [
                'platform' => 'discord',
                'scheduled_at' => $days[3],
                'media_url' => null,
                'content' => <<<'POST'
An underappreciated thing about web design:

You don't consciously notice the font is five years old. You don't register that the layout predates mobile-first. What you notice — in about 300ms — is whether something feels trustworthy.

That first impression drives a significant amount of conversion, and it happens before a single word is read.

If your site passes that test, the rest of the content gets a chance. If it doesn't — it doesn't matter how good the copy is.

Worth looking at your own homepage from a fresh tab with that framing in mind. If it doesn't feel right to you, it probably isn't working for visitors either.

We do site modernizations — a full rebuild is not always necessary. → graveyardjokes.com
POST,
            ],

            // ═══════════════════════════════════════════════════════════════
            // DAY 5 — Aug 5 · THEME: What Social Media Management Actually Is
            // ═══════════════════════════════════════════════════════════════

            [
                'platform' => 'facebook',
                'scheduled_at' => $days[4],
                'media_url' => null,
                'content' => <<<'POST'
Social media management is not a content calendar and a scheduling tool.

Those are inputs. What you are actually paying for — or should be — is someone who understands your business well enough to represent it accurately online, consistently, and in a way that compounds over time.

Posting consistently is the floor. The businesses that get real return from social media are the ones where the content reflects a genuine point of view, speaks to the right audience, and gives that audience a reason to follow, engage, and eventually hire or buy.

That requires understanding what you do, what makes you different, and what the customer you want to attract actually cares about. A content calendar full of generic industry tips does not build that. It fills a schedule. Those are different things.

At Graveyard Jokes Studios, social media management starts with understanding your business — the services, the differentiators, the tone that is actually yours. The posts, the cadence, and the content strategy follow from that. Not the other way around.

Social media management from $99/month.

🌐 graveyardjokes.com

#SocialMediaManagement #DigitalMarketing #ContentStrategy #SmallBusiness #OnlinePresence
POST,
            ],

            [
                'platform' => 'discord',
                'scheduled_at' => $days[4],
                'media_url' => null,
                'content' => <<<'POST'
Worth saying clearly: social media management is not the same as social media posting.

There's a version of it that's just "we publish three times a week." It fills a calendar. It does not build an audience, establish credibility, or generate leads.

The version that actually works requires understanding the business — the differentiators, the customer you want, the tone that is genuinely yours. Content that reflects a real point of view builds trust over time. Generic content gets scrolled past.

We offer social media management from $99/month. If you're currently handling it yourself and running out of things to say — or if it keeps falling off the priority list because everything else is more urgent — that's exactly the problem we're solving.

→ graveyardjokes.com
POST,
            ],

        ];

        // Normalize and insert all posts.
        $records = array_map(fn ($p) => array_merge($p, [
            'status' => 'pending',
            'extra' => null,
            'error_message' => null,
            'posted_at' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]), $posts);

        SocialScheduledPost::insert($records);

        $this->command->info('SocialJuly30BatchSeeder: '.count($records).' posts scheduled.');
    }
}
