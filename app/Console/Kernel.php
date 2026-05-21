<?php

namespace App\Console;

use App\Console\Commands\FacebookPageTokens;
use App\Console\Commands\FacebookRefreshToken;
use App\Console\Commands\GenerateSitemap;
use App\Console\Commands\GenerateSitemapIndex;
use App\Console\Commands\SocialDispatch;
use App\Console\Commands\SocialDispatchResetStuck;
use App\Console\Commands\SocialSchedule;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array<int, class-string>
     */
    protected $commands = [
        GenerateSitemap::class,
        GenerateSitemapIndex::class,
        SocialDispatch::class,
        SocialDispatchResetStuck::class,
        SocialSchedule::class,
        FacebookPageTokens::class,
        FacebookRefreshToken::class,
    ];

    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Regenerate sitemap.xml at 01:55, then regenerate sitemap_index.xml at 02:00
        $schedule->command('app:generate-sitemap --url=https://graveyardjokes.com')->dailyAt('01:55');
        $schedule->command('app:generate-sitemap-index --url=https://graveyardjokes.com')->dailyAt('02:00');

        // Fire due social media posts every minute — production only
        $schedule->command('social:dispatch')->everyMinute()->withoutOverlapping()->environments(['production']);

        // Reset any posts stuck in 'processing' (e.g. after a mid-send crash) — production only
        $schedule->command('social:dispatch:reset-stuck')->everyFiveMinutes()->environments(['production']);
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
