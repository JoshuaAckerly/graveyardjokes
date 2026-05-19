<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Regenerate sitemap index daily at 02:00
Schedule::command('app:generate-sitemap-index --url=https://graveyardjokes.com')->dailyAt('02:00');
