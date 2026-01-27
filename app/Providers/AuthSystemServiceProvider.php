<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\AuthSystemService;

class AuthSystemServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton(AuthSystemService::class, function ($app) {
            return new AuthSystemService();
        });
    }

    public function boot()
    {
        //
    }
}
