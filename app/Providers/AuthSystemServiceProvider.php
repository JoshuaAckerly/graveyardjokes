<?php

namespace App\Providers;

use App\Services\AuthSystemService;
use Illuminate\Support\ServiceProvider;

class AuthSystemServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(AuthSystemService::class, function ($app) {
            return new AuthSystemService;
        });
    }

    public function boot(): void
    {
        //
    }
}
