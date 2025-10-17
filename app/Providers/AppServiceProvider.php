<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Contracts\AnalyticsInterface;
use App\Services\GoogleAnalyticsService;
use App\Contracts\VisitorServiceInterface;
use App\Modules\Visitor\Services\VisitorService as ModuleVisitorService;
use App\Contracts\ContactServiceInterface;
use App\Modules\Contact\Services\ContactService as ModuleContactService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Bind service contracts to concrete implementations to support modular swapping.
        $this->app->bind(AnalyticsInterface::class, GoogleAnalyticsService::class);
    $this->app->bind(VisitorServiceInterface::class, ModuleVisitorService::class);
    $this->app->bind(\App\Contracts\ContactServiceInterface::class, ModuleContactService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
