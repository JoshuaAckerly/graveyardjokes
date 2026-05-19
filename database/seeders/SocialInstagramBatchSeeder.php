<?php

namespace Database\Seeders;

use App\Models\SocialScheduledPost;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

/**
 * One-time seeder: schedules the Graveyard Jokes Studios Instagram launch batch.
 *
 * !! BEFORE RUNNING THIS SEEDER YOU MUST: !!
 *   1. Set INSTAGRAM_USER_ID and INSTAGRAM_ACCESS_TOKEN in .env on the production server.
 *      See .env.example for instructions on where to get these values.
 *   2. Host the three images publicly and paste their URLs into the $imageUrls array below.
 *      Instagram fetches images directly — they must be reachable by Meta's servers.
 *
 * Run on production only (after completing the steps above):
 *   php artisan db:seed --class=SocialInstagramBatchSeeder
 *
 * Posts fire automatically via the `social:dispatch` cron (every minute).
 * Re-running this seeder will insert duplicate rows — run it exactly once.
 */
class SocialInstagramBatchSeeder extends Seeder
{
    private array $imageUrls = [
        'portfolio' => 'https://graveyardjokes.com/storage/instagram/Copilot_20260516_201107.png',
        'packages' => 'https://graveyardjokes.com/storage/instagram/Copilot_20260516_201400.png',
        'blog' => 'https://graveyardjokes.com/storage/instagram/Copilot_20260516_201630.png',
    ];

    public function run(): void
    {
        $this->guardPlaceholderUrls();

        $day1 = Carbon::parse('2026-05-19 10:00:00');
        $day2 = Carbon::parse('2026-05-20 10:00:00');
        $day3 = Carbon::parse('2026-05-21 10:00:00');

        $posts = [

            // ─── Day 1: Agency Intro / Portfolio ─────────────────────────────

            [
                'scheduled_at' => $day1,
                'media_url' => $this->imageUrls['portfolio'],
                'content' => <<<'POST'
Graveyard Jokes Studios is a full-service web development and design agency based in Cheektowaga, NY.

We build websites and digital experiences for businesses that take their online presence seriously.

—

✦ Custom web development
✦ Web design and visual modernization
✦ eCommerce development
✦ SEO and digital marketing support

Seven live portfolio projects. Clean builds. Documented code. Production-ready work.

Packages starting at $799.

Link in bio → graveyardjokes.com

—

#webdesign #webdevelopment #webdesigner #webdeveloper #agencylife #digitalagency #creativestudio #smallbusiness #smallbusinessowner #entrepreneur #startuplife #businessgrowth #digitalmarketing #buffalo #buffalony #cheektowaga #westernneyork #localbusiness #wnybusiness #fullstackdeveloper #typescript #javascript #laravel #reactjs #tailwindcss #buildinpublic #portfoliowebsite #freelancedesigner #webagency #onlinebusiness
POST,
            ],

            // ─── Day 2: Service Packages ──────────────────────────────────────

            [
                'scheduled_at' => $day2,
                'media_url' => $this->imageUrls['packages'],
                'content' => <<<'POST'
New Website Design & Modernization packages are now available.

If your website is outdated, slow, difficult to navigate, or simply not converting visitors into clients — this is the fix.

—

→ Website Development — from $799
→ Website Design — from $799
→ Website Modernization — from $799

All projects include clean, documented, version-controlled code and a handoff that makes sense.

—

Link in bio to schedule a discovery call → graveyardjokes.com

—

#webdesign #websiteredesign #webdevelopment #modernization #smallbusiness #smallbusinessowner #entrepreneur #businessgrowth #digitalmarketing #agencylife #digitalagency #creativestudio #buffalo #buffalony #cheektowaga #westernneyork #wnybusiness #localbusiness #webagency #webdesigner #webdeveloper #onlinebusiness #startuplife #brandidentity #freelancedesigner #fullstackdeveloper #laravel #reactjs #tailwindcss #buildinpublic #makerscommunity
POST,
            ],

            // ─── Day 3: May 2026 Blog Update ─────────────────────────────────

            [
                'scheduled_at' => $day3,
                'media_url' => $this->imageUrls['blog'],
                'content' => <<<'POST'
Things went quiet here for a while. Worth acknowledging that before anything else.

The past few weeks included a loss in the family — someone I did not talk to enough while there was still time. That kind of absence has a particular weight to it.

—

The studio did not disappear.

The codebases are clean. The documentation is solid. The monitoring is active. The work from March and April is all still there.

The foundation held.

—

Wrote a short update on the blog — where things stood, what stays true, and what is next. Link in bio if you want to read it.

— Joshua · Graveyard Jokes Studios

—

#buildinpublic #webdev #independentstudio #makerscommunity #agencylife #creativestudio #solofounder #smallbusiness #entrepreneur #businessgrowth #buffalo #buffalony #cheektowaga #westernneyork #webdevelopment #webdesign
POST,
            ],

        ];

        foreach ($posts as $post) {
            SocialScheduledPost::create([
                'platform' => 'instagram',
                'content' => trim($post['content']),
                'media_url' => $post['media_url'],
                'scheduled_at' => $post['scheduled_at'],
                'status' => 'pending',
            ]);
        }

        $this->command->info('Seeded 3 Instagram posts for the launch batch (May 19–21).');
    }

    /**
     * Sanity-check that the image files exist on this server before seeding.
     * Resolves the storage path from the public URL.
     */
    private function guardPlaceholderUrls(): void
    {
        $storagePath = storage_path('app/public/instagram');

        foreach ($this->imageUrls as $key => $url) {
            $filename = basename($url);
            $fullPath = $storagePath.'/'.$filename;

            if (! file_exists($fullPath)) {
                $this->command->error(
                    "Cannot seed Instagram posts: image file missing for '{$key}'.\n"
                    ."Expected at: {$fullPath}\n"
                    .'Copy images to the server first — see deployment notes.'
                );
                exit(1);
            }
        }
    }
}
