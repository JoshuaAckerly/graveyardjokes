<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Regenerate sitemaps daily
Schedule::command('app:generate-sitemap --url=https://graveyardjokes.com')->dailyAt('01:55');
Schedule::command('app:generate-sitemap-index --url=https://graveyardjokes.com')->dailyAt('02:00');

// Fire due social media posts every minute — production only
Schedule::command('social:dispatch')->everyMinute()->withoutOverlapping()->environments(['production']);

// Reset posts stuck in 'processing' after a mid-send crash — production only
Schedule::command('social:dispatch:reset-stuck')->everyFiveMinutes()->environments(['production']);
