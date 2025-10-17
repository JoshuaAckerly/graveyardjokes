<?php
// app/Services/GoogleAnalyticsService.php

namespace App\Services;
use App\Contracts\AnalyticsInterface;

class GoogleAnalyticsService implements AnalyticsInterface
{
    public function getRealTimeVisitors(): array
    {
        // Minimal implementation for now; concrete GA4 calls can be added later.
        // Return an empty array when no data is available to keep contract simple.
        return [];
    }
}