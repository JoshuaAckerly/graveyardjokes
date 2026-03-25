<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ReportVisitToAuthSystem implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 2;

    public int $timeout = 10;

    public function __construct(private readonly array $visitData) {}

    public function handle(): void
    {
        $url = config('services.authsystem.track_url');
        $token = config('services.authsystem.track_token');

        if (! $url || ! $token) {
            return;
        }

        try {
            Http::withToken($token)
                ->timeout(8)
                ->post($url, $this->visitData);
        } catch (\Exception $e) {
            Log::warning('Failed to report visit to auth-system: '.$e->getMessage());
        }
    }
}
