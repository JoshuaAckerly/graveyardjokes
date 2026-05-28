<?php

namespace App\Console\Commands;

use App\Services\GoogleBusinessProfileService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class GoogleBusinessListLocations extends Command
{
    protected $signature = 'google-business:list-locations';

    protected $description = 'List all Google Business Profile accounts and locations to find your GOOGLE_BUSINESS_LOCATION_NAME';

    public function handle(GoogleBusinessProfileService $service): int
    {
        try {
            $accessToken = $service->getAccessToken();
        } catch (\RuntimeException $e) {
            $this->error('Could not obtain access token: '.$e->getMessage());
            $this->comment('Make sure GOOGLE_BUSINESS_CLIENT_ID, GOOGLE_BUSINESS_CLIENT_SECRET, and GOOGLE_BUSINESS_REFRESH_TOKEN are set in your .env.');

            return self::FAILURE;
        }

        // Fetch accounts
        $accountsResponse = Http::withToken($accessToken)
            ->get('https://mybusinessaccountmanagement.googleapis.com/v1/accounts');

        if (! $accountsResponse->successful()) {
            $this->error('Failed to fetch accounts: '.$accountsResponse->body());

            return self::FAILURE;
        }

        $accounts = $accountsResponse->json('accounts') ?? [];

        if (! is_array($accounts) || count($accounts) === 0) {
            $this->warn('No accounts found for this Google profile.');

            return self::SUCCESS;
        }

        foreach ($accounts as $account) {
            $accountName = is_array($account) ? ($account['name'] ?? 'unknown') : 'unknown';
            $accountType = is_array($account) ? ($account['type'] ?? '') : '';
            $this->info("Account: {$accountName}  (type: {$accountType})");

            // Fetch locations for this account
            $locationsResponse = Http::withToken($accessToken)
                ->get("https://mybusinessbusinessinformation.googleapis.com/v1/{$accountName}/locations", [
                    'readMask' => 'name,title',
                ]);

            if (! $locationsResponse->successful()) {
                $this->warn("  Could not fetch locations for {$accountName}: ".$locationsResponse->body());

                continue;
            }

            $locations = $locationsResponse->json('locations') ?? [];

            if (! is_array($locations) || count($locations) === 0) {
                $this->line('  (no locations found)');

                continue;
            }

            foreach ($locations as $location) {
                if (! is_array($location)) {
                    continue;
                }
                $name = $location['name'] ?? 'unknown';
                $title = $location['title'] ?? '';
                $this->line("  Location: {$name}  \"{$title}\"");
                $this->comment("    → Set GOOGLE_BUSINESS_LOCATION_NAME={$name}");
            }
        }

        return self::SUCCESS;
    }
}
