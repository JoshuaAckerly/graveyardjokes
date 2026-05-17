<?php

namespace Database\Seeders;

use App\Models\SocialScheduledPost;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

/**
 * One-time seeder: schedules the Graveyard Jokes Studios launch batch.
 *
 * Platforms: Facebook, Discord, Twitter/X (3 posts each — 9 total)
 * Schedule:  May 17 (portfolio intro), May 18 (service packages), May 19 (blog update)
 *
 * Run on production only:
 *   php artisan db:seed --class=SocialLaunchBatchSeeder
 *
 * Posts fire automatically via the `social:dispatch` cron (every minute).
 * Re-running this seeder will insert duplicate rows — run it exactly once.
 *
 * Instagram is handled separately via SocialInstagramBatchSeeder once
 * credentials and image URLs are ready.
 */
class SocialLaunchBatchSeeder extends Seeder
{
    public function run(): void
    {
        $day1 = Carbon::parse('2026-05-17 10:00:00');
        $day2 = Carbon::parse('2026-05-18 10:00:00');
        $day3 = Carbon::parse('2026-05-19 10:00:00');

        $posts = [

            // ─── Day 1: Agency Intro / Portfolio ─────────────────────────────

            [
                'platform'     => 'facebook',
                'scheduled_at' => $day1,
                'content'      => <<<'POST'
Graveyard Jokes Studios builds websites and digital experiences for businesses that take their online presence seriously.

We are a full-service creative web studio based in Cheektowaga, New York. Our services cover web development, web design, eCommerce development, SEO, and digital marketing — everything you need to build a site that works and grows with your business.

Our portfolio spans seven live projects built from the ground up, maintained in production, and optimized for performance:

• Lunar Blood — band management platform with audio streaming, tour management, and a Stripe-powered merch store
• Hollow Press — media agency and record label platform with artist CMS, press releases, and a blog
• The Velvet Pulse — indie rock band site with full discography, tour dates, and media
• Velvet Radio — podcast platform with episode streaming, transcripts, and listener submissions
• Synth Veil — DJ and electronic artist site with GSAP animations and a cyberpunk aesthetic

Every project shares the same standard: zero TypeScript errors, comprehensive documentation, production monitoring, and P95 response times within target.

If you are looking for a development partner who delivers clean, documented, production-ready work — that is what we do.

Packages starting at $499. Currently taking on new clients.

🌐 graveyardjokes.com
POST,
            ],

            [
                'platform'     => 'discord',
                'scheduled_at' => $day1,
                'content'      => <<<'POST'
Hey everyone — I am Joshua, the founder of **Graveyard Jokes Studios**, a small web development and design agency out of Cheektowaga, NY.

I have been heads-down building for the past several months and figured it was time to actually show up in places where people doing this kind of work gather.

**What the studio does:**
- Custom web development (Laravel + React, modern full-stack)
- Web design and visual modernization
- eCommerce builds (Stripe integration, custom storefronts)
- SEO and digital marketing support

**What is in the portfolio right now:**
Seven live projects — a band management platform with audio streaming and a Stripe merch store, a record label CMS with press and artist management, a podcast platform, a DJ/electronic artist site with GSAP animations, and more. All are in production, actively maintained, and documented.

Zero TypeScript errors across all projects. P95 response times within target. Monitoring baselines set.

If you are working on something and need a development partner, or just want to see the portfolio, the link is below.

🌐 **graveyardjokes.com**
POST,
            ],

            // ─── Day 2: Service Packages ──────────────────────────────────────

            [
                'platform'     => 'facebook',
                'scheduled_at' => $day2,
                'content'      => <<<'POST'
New Website Design & Modernization packages are now available at Graveyard Jokes Studios.

If your website is outdated, slow, hard to navigate, or simply not converting visitors into clients — this is the fix.

Three service categories:

📦 Website Development — from $799
Starter ($799) · Professional ($1,499) · Premium ($2,499)
New builds from the ground up. Single-page sites to full platforms with eCommerce, streaming, and custom integrations.

🎨 Website Design — from $499
Starter ($499) · Professional ($999) · Premium ($1,799)
Wireframes, Figma mockups, UI design systems, brand guidelines, and interactive prototypes.

⚙️ Website Modernization — from $699
Starter ($699) · Professional ($1,299) · Premium ($1,999)
Visual refresh, performance optimization, modern framework updates, accessibility compliance, and full tech stack migrations.

All projects include clean documentation, version-controlled code, and a handoff that actually makes sense.

Message us or visit the link below to schedule a discovery call.

🌐 graveyardjokes.com
POST,
            ],

            [
                'platform'     => 'discord',
                'scheduled_at' => $day2,
                'content'      => <<<'POST'
**Studio Update — New Service Packages Available**

Graveyard Jokes Studios just launched dedicated Website Design and Modernization packages for businesses whose current site no longer reflects the quality of what they actually do.

**Website Development** — from $799
New builds, single-page to full platform. eCommerce, streaming, custom API integrations.

**Website Design** — from $499
Wireframes, Figma mockups, UI design systems, brand guidelines, interactive prototypes.

**Website Modernization** — from $699
Visual refresh, performance optimization, framework updates, accessibility compliance, full stack migrations.

All work is documented, version-controlled, and handed off properly.

Currently taking on new clients → 🌐 **graveyardjokes.com**
POST,
            ],

            // ─── Day 3: May 2026 Blog Update ─────────────────────────────────

            [
                'platform'     => 'facebook',
                'scheduled_at' => $day3,
                'content'      => <<<'POST'
Posted a new update on the studio blog.

Things went quiet here for a while — worth acknowledging that directly. The past few weeks included a loss in the family and a slower pace. But the studio did not disappear. The codebases stayed clean. The documentation is solid. The work from March and April is all still there.

"The foundation is solid, which means coming back to it is not starting over. It is picking up where things left off."

The plan from here: weekly updates, no gaps — and a sharper focus on reaching the right clients.

If you have been watching what we build, this one is worth a read.

🔗 graveyardjokes.com/blog
POST,
            ],

            [
                'platform'     => 'discord',
                'scheduled_at' => $day3,
                'content'      => <<<'POST'
**Studio Update — May 2026**

Things went quiet here for a while. Worth acknowledging that directly.

Life got full — a loss in the family, a slower pace for a few weeks. But the studio did not disappear. The codebases stayed clean. The documentation from March and April is all still there. Zero-error builds across all seven projects.

The foundation is solid. Coming back to it is not starting over.

From here: weekly updates, no gaps. And a shift toward growth — reaching out more actively to potential clients.

If you are curious about what kept, there is a short post on the blog.

🔗 **graveyardjokes.com/blog**
POST,
            ],

            // ─── Twitter/X ────────────────────────────────────────────────────
            // 280-character limit. URLs count as 23 chars regardless of length.

            [
                'platform'     => 'twitter',
                'scheduled_at' => $day1,
                'content'      => <<<'POST'
Graveyard Jokes Studios — a full-service web agency based in Cheektowaga, NY.

Seven live portfolio projects. Clean builds. Zero errors in production.

Packages starting at $499.

🌐 graveyardjokes.com

#WebDevelopment #WebDesign #Agency
POST,
            ],

            [
                'platform'     => 'twitter',
                'scheduled_at' => $day2,
                'content'      => <<<'POST'
New: Website Design & Modernization packages are live.

If your site is outdated, slow, or not converting — we fix that.

Dev from $799. Design from $499. Modernization from $699.

🌐 graveyardjokes.com

#WebDesign #WebsiteRedesign #SmallBusiness
POST,
            ],

            [
                'platform'     => 'twitter',
                'scheduled_at' => $day3,
                'content'      => <<<'POST'
Things went quiet here for a while. The studio did not disappear.

The work is clean. The docs are solid. The foundation held.

"The foundation is solid — coming back to it is not starting over."

🔗 graveyardjokes.com/blog

#BuildInPublic #WebDev
POST,
            ],

        ];

        foreach ($posts as $post) {
            SocialScheduledPost::create([
                'platform'     => $post['platform'],
                'content'      => trim($post['content']),
                'media_url'    => null,
                'scheduled_at' => $post['scheduled_at'],
                'status'       => 'pending',
            ]);
        }

        $this->command->info('Seeded 9 social posts for the launch batch (May 17–19): Facebook, Discord, Twitter/X.');
    }
}
