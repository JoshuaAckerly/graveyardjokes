<?php

namespace Database\Seeders;

use App\Models\SocialScheduledPost;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class SocialPostsWeekSeeder extends Seeder
{
    public function run(): void
    {
        $s3Base = 'https://graveyardjokes-cdn.s3.us-east-2.amazonaws.com/graveyardjokes/social';

        $posts = [

            // ────────────────────── MONDAY JUNE 8 ───────────────────────

            [
                'platform' => 'twitter',
                'scheduled_at' => '2026-06-08 09:00:00',
                'content' => "Graveyard Jokes Studios manages social media, SEO, and websites for small businesses in Cheektowaga, NY.\n\nSocial media management. SEO management. Website management.\n\nPackages starting at \$799. Currently taking on new clients.\n\n🌐 graveyardjokes.com\n\n#SocialMediaManagement #SEOManagement #DigitalMarketing",
            ],
            [
                'platform' => 'facebook',
                'scheduled_at' => '2026-06-08 11:00:00',
                'content' => "Graveyard Jokes Studios manages your online presence so you can focus on running your business.\n\nWe are a social media management, SEO, and website management agency based in Cheektowaga, New York. Whether your goal is to grow on social media, rank higher in search, or keep your website running smoothly — we handle it directly, with no handoffs and no agency runaround.\n\nOur portfolio spans seven live projects built from the ground up — each one maintained in production, monitored, and documented to the same standard we bring to every client engagement.\n\nWhat we offer:\n- Social media management (content, scheduling, engagement, analytics)\n- SEO management (keyword research, on-page optimization, technical audits, reporting)\n- Website management (maintenance, updates, security, performance monitoring)\n\nPackages starting at \$799. Retainers and custom plans also available.\n\nReach out through our website or send us a message directly.\n\n🌐 graveyardjokes.com\n\n#SocialMediaManagement #SEO #WebsiteManagement #DigitalMarketing #Agency #Buffalo #WesternNY",
            ],

            // ────────────────────── TUESDAY JUNE 9 ──────────────────────

            [
                'platform' => 'instagram',
                'scheduled_at' => '2026-06-09 09:00:00',
                'media_url' => "$s3Base/agency-intro.png",
                'content' => "Graveyard Jokes Studios manages your online presence — social media, SEO, and website management — so you can focus on running your business.\n\n—\n\nWhat we do:\n\n✦ Social media management\n✦ SEO management\n✦ Website management\n\n—\n\nSeven live portfolio projects. Consistent, documented, production-ready work.\n\nPackages starting at \$799.\n\nLink in bio → graveyardjokes.com\n\n—\n\n#socialmediamanagement #seomanagement #websitemanagement #digitalmarketing #agencylife #digitalagency #creativestudio #smallbusiness #smallbusinessowner #entrepreneur #startuplife #businessgrowth #localmarketing #buffalo #buffalony #cheektowaga #westernneyork #localbusiness #wnybusiness #searchengineoptimization #contentmarketing #socialmediamarketing #websitemaintenance #googleseo #buildinpublic #freelancedesigner #onlinepresence #onlinebusiness #brandidentity #smallbiz",
            ],
            [
                'platform' => 'discord',
                'scheduled_at' => '2026-06-09 13:00:00',
                'content' => "Hey everyone — I am Joshua, the founder of **Graveyard Jokes Studios**, a small web development and design agency out of Cheektowaga, NY.\n\nI have been heads-down building for the past several months and figured it was time to actually show up in places where people doing this kind of work gather.\n\n**What the studio does:**\n- Custom web development (Laravel + React, modern stack)\n- Web design and visual modernization\n- eCommerce builds (Stripe integration, custom storefronts)\n- SEO and digital marketing support\n\n**What's in the portfolio right now:**\nSeven live projects — a band management platform with audio streaming and a Stripe-powered merch store, a record label CMS with press/artist management, a podcast platform, a DJ/electronic artist site with GSAP animations, and a few others. All of them are in production, actively maintained, and documented.\n\nZero TypeScript errors across all projects as of April 2026. P95 response times in range. Monitoring baselines set.\n\nIf you are working on something and need a development partner, or if you just want to see what the portfolio looks like, the link is below. Happy to answer questions here too.\n\n🌐 **graveyardjokes.com**",
            ],

            // ────────────────────── WEDNESDAY JUNE 10 ───────────────────

            [
                'platform' => 'twitter',
                'scheduled_at' => '2026-06-10 09:00:00',
                'content' => "New service packages are live.\n\nSocial media management, SEO, and website management — all under one roof.\n\nSocial Media Management from \$799. SEO Management from \$799. Website Management from \$799.\n\n🌐 graveyardjokes.com\n\n#SocialMediaManagement #SEOManagement #SmallBusiness",
            ],
            [
                'platform' => 'facebook',
                'scheduled_at' => '2026-06-10 11:00:00',
                'content' => "We have structured our services around the three things that move the needle most for small businesses online — social media, search visibility, and a website that actually works.\n\nIf your social presence is inconsistent, your Google ranking is low, or your website needs regular care and updates — we handle all of it.\n\nOur packages:\n\nSocial Media Management — from \$799\nStarter (\$799) · Professional (\$1,499) · Premium (\$2,499)\nContent planning, scheduling, caption writing, engagement tracking, and monthly analytics reports across your platforms.\n\nSEO Management — from \$799\nStarter (\$799) · Professional (\$999) · Premium (\$1,799)\nKeyword research, on-page optimization, technical audits, backlink analysis, local SEO, and regular performance reporting.\n\nWebsite Management — from \$799\nStarter (\$799) · Professional (\$1,299) · Premium (\$1,999)\nMonthly security scans, dependency updates, performance optimization, content updates, uptime monitoring, and backup management.\n\nAll packages include direct communication, transparent reporting, and no agency middlemen.\n\nReady to start? Message us or visit the link below to schedule a discovery call.\n\n🌐 graveyardjokes.com\n\n#SocialMediaManagement #SEOManagement #WebsiteManagement #SmallBusiness #DigitalMarketing #Agency",
            ],

            // ────────────────────── THURSDAY JUNE 11 ────────────────────

            [
                'platform' => 'instagram',
                'scheduled_at' => '2026-06-11 09:00:00',
                'media_url' => "$s3Base/portfolio-showcase.png",
                'content' => "Seven live projects. Seven production-ready builds.\n\nSwipe to see what we have been building — and the standard behind every one of them.\n\n—\n\nEvery project in the portfolio shares the same foundation: clean code, comprehensive documentation, production monitoring, and zero-error builds.\n\nThat is what we bring to client work.\n\n—\n\nLink in bio to see the full portfolio → graveyardjokes.com\n\n—\n\n#webdesign #webdevelopment #portfoliowebsite #webdesigner #webdeveloper #agencylife #digitalagency #creativestudio #buildinpublic #fullstackdeveloper #laravel #reactjs #tailwindcss #typescript #javascript #frontenddevelopment #backenddevelopment #smallbusiness #entrepreneur #businessgrowth #digitalmarketing #makerscommunity #buffalo #buffalony #cheektowaga #westernneyork #wnybusiness #localbusiness #webagency #onlinebusiness",
            ],
            [
                'platform' => 'discord',
                'scheduled_at' => '2026-06-11 13:00:00',
                'content' => "# Studio Update — June 2026\n\nThings went quiet for a while. Worth acknowledging that directly.\n\nLife got full — a loss in the family, a slower pace for a few weeks. But the studio did not disappear. The codebases stayed clean. The documentation from March and April is all still there. Zero-error builds across all seven projects.\n\nThe foundation is solid. Coming back to it is not starting over.\n\n---\n\n**What is happening now:**\n\nThe focus is shifting. We spent the first few months of 2026 building infrastructure and making sure everything was production-ready. That work is done.\n\nNow the goal is growth — reaching out to potential clients directly and advertising more actively.\n\n**New this month:**\n\n- Social Media Management, SEO Management, and Website Management packages are live\n- Active client outreach starting this week\n- Social media presence launching across Facebook, Twitter, Instagram, and TikTok\n- Weekly studio updates resuming — no more gaps\n\n---\n\n**If you know someone who needs their social media managed, SEO improved, or website kept up to date, this is a good time to point them our way.**\n\nPackages starting at \$799. Currently taking on new clients.\n\n🌐 graveyardjokes.com",
            ],

            // ──────────────────────── FRIDAY JUNE 12 ────────────────────

            [
                'platform' => 'twitter',
                'scheduled_at' => '2026-06-12 09:00:00',
                'content' => "New post on the studio blog — an honest update on the past few weeks, what stayed solid, and what comes next.\n\n\"The foundation is solid, which means coming back to it is not starting over.\"\n\n🔗 graveyardjokes.com/blog\n\n#BuildInPublic #WebDev",
            ],
            [
                'platform' => 'facebook',
                'scheduled_at' => '2026-06-12 10:00:00',
                'content' => "Things went quiet here for a while. Worth being honest about that.\n\nThe past few weeks included a loss in the family. That kind of absence has a particular weight to it. Not sharp grief, but something slower. I have been sitting with that.\n\nThe studio did not disappear. The codebases are clean. The documentation is solid. The monitoring is active. The foundation held.\n\n\"The foundation is solid, which means coming back to it is not starting over. It is picking up where things left off.\"\n\nWrote a short update on the blog — where things stood, what stays true, and what is next.\n\n🔗 graveyardjokes.com/blog\n\n#BuildInPublic #WebDev #IndependentStudio #GraveyardJokes",
            ],
            [
                'platform' => 'instagram',
                'scheduled_at' => '2026-06-12 11:00:00',
                'media_url' => "$s3Base/services-packages.png",
                'content' => "Three services. One partner. Your whole online presence, handled.\n\n—\n\n→ Social Media Management — from \$799\n→ SEO Management — from \$799\n→ Website Management — from \$799\n\nAll packages include direct communication and transparent reporting — no agency runaround.\n\n—\n\nLink in bio to schedule a discovery call → graveyardjokes.com\n\n—\n\n#socialmediamanagement #seomanagement #websitemanagement #digitalmarketing #smallbusiness #smallbusinessowner #entrepreneur #businessgrowth #agencylife #digitalagency #creativestudio #buffalo #buffalony #cheektowaga #westernneyork #wnybusiness #localbusiness #onlinepresence #searchengineoptimization #contentmarketing #socialmediamarketing #websitemaintenance #googleseo #freelancedesigner #buildinpublic #onlinebusiness #startuplife #brandidentity #localmarketing #smallbiz",
            ],
            [
                'platform' => 'discord',
                'scheduled_at' => '2026-06-12 14:00:00',
                'content' => "**New service packages are live at Graveyard Jokes Studios.**\n\nIf you or anyone you know needs help with social media, SEO, or website management — here is what we offer:\n\n**Social Media Management — from \$799/mo**\nContent calendar, scheduling, caption writing, engagement tracking, and monthly analytics. We handle your platforms so you can focus on your business.\n\n**SEO Management — from \$799/mo**\nKeyword research, on-page optimization, technical audits, local SEO, and monthly reporting. Built to actually move rankings.\n\n**Website Management — from \$799/mo**\nSecurity scans, dependency updates, performance optimization, content updates, uptime monitoring, and backup management.\n\nAll packages include direct communication with no agency middlemen. Custom and retainer plans available.\n\nPortfolio: seven live projects in production — Laravel + React, Stripe integrations, full admin dashboards, monitoring active across all of them.\n\n🌐 **graveyardjokes.com** — message us or reach out through the site.",
            ],
        ];

        foreach ($posts as $post) {
            SocialScheduledPost::create([
                'platform' => $post['platform'],
                'content' => $post['content'],
                'media_url' => $post['media_url'] ?? null,
                'scheduled_at' => Carbon::parse($post['scheduled_at']),
                'status' => 'pending',
            ]);
            $this->command->info("Scheduled [{$post['platform']}] at {$post['scheduled_at']}");
        }

        $this->command->info("\nDone. ".count($posts).' posts scheduled.');
    }
}
