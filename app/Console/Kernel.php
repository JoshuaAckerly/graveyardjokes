<?php

namespace App\Console;

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
        \App\Console\Commands\GenerateSitemapIndex::class,
        \App\Console\Commands\SocialDispatch::class,
        \App\Console\Commands\SocialSchedule::class,
        \App\Console\Commands\FacebookPageTokens::class,
        \App\Console\Commands\FacebookRefreshToken::class,
    ];

    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Regenerate sitemap index daily at 02:00
        $schedule->command('app:generate-sitemap-index --url=https://graveyardjokes.com')->dailyAt('02:00');

        // Fire due social media posts every minute — production only
        $schedule->command('social:dispatch')->everyMinute()->withoutOverlapping()->environments(['production']);
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
