<?php

namespace App\Console\Commands;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Console\Command;

/**
 * Exchanges a short-lived Facebook User Access Token for a long-lived one (~60 days).
 * Then fetches a Page Access Token for the configured page — page tokens derived
 * from a long-lived user token do not expire.
 *
 * Usage:
 *   php artisan social:facebook-refresh --token=EAAx…
 */
class FacebookRefreshToken extends Command
{
    protected $signature = 'social:facebook-refresh
        {--token= : Short-lived user access token from Graph Explorer}';

    protected $description = 'Exchange a short-lived Facebook token for a long-lived Page Access Token.';

    private const GRAPH_URL = 'https://graph.facebook.com/v22.0';

    public function handle(): int
    {
        $shortToken = $this->option('token') ?? $this->ask('Paste your short-lived user token from Graph Explorer');

        if (empty($shortToken)) {
            $this->error('No token provided.');

            return self::FAILURE;
        }

        $appId = (string) env('FACEBOOK_APP_ID');
        $appSecret = (string) env('FACEBOOK_APP_SECRET');

        if (empty($appId) || empty($appSecret)) {
            $this->error('FACEBOOK_APP_ID and FACEBOOK_APP_SECRET must be set in .env.');
            $this->line('Find them at: https://developers.facebook.com → your app → Settings → Basic');

            return self::FAILURE;
        }

        $client = new Client(['timeout' => 15]);

        // Step 1: Exchange for long-lived user token
        $this->line('Exchanging for long-lived user token...');
        try {
            $response = $client->get(self::GRAPH_URL.'/oauth/access_token', [
                'query' => [
                    'grant_type' => 'fb_exchange_token',
                    'client_id' => $appId,
                    'client_secret' => $appSecret,
                    'fb_exchange_token' => $shortToken,
                ],
            ]);
        } catch (ClientException $e) {
            $body = json_decode((string) $e->getResponse()->getBody(), true);
            $message = $body['error']['message'] ?? $e->getMessage();
            $this->error('Token exchange failed: '.$message);

            return self::FAILURE;
        }

        /** @var array{access_token: string, expires_in?: int} $data */
        $data = json_decode((string) $response->getBody(), true);
        $longUserToken = $data['access_token'] ?? null;
        $expiresIn = $data['expires_in'] ?? null;

        if (empty($longUserToken)) {
            $this->error('No access_token in exchange response.');

            return self::FAILURE;
        }

        $expiryNote = $expiresIn
            ? now()->addSeconds((int) $expiresIn)->toDateTimeString()
            : 'unknown';

        $this->info("Long-lived user token obtained (expires ~{$expiryNote}).");

        // Step 2: Get Page Access Token (page tokens from long-lived user tokens never expire)
        $this->line('Fetching page access token...');
        try {
            $pagesResponse = $client->get(self::GRAPH_URL.'/me/accounts', [
                'query' => [
                    'access_token' => $longUserToken,
                    'fields' => 'id,name,access_token',
                ],
            ]);
        } catch (ClientException $e) {
            $body = json_decode((string) $e->getResponse()->getBody(), true);
            $message = $body['error']['message'] ?? $e->getMessage();
            $this->error('Failed to fetch pages: '.$message);
            $this->line('');
            $this->line('At minimum, add this long-lived user token to .env as FACEBOOK_PAGE_ACCESS_TOKEN');
            $this->line('and it will work for 60 days:');
            $this->line("FACEBOOK_PAGE_ACCESS_TOKEN={$longUserToken}");

            return self::FAILURE;
        }

        /** @var array{data: array<int, array{id: string, name: string, access_token: string}>} $pages */
        $pages = json_decode((string) $pagesResponse->getBody(), true);

        if (empty($pages['data'])) {
            $this->warn('No pages found. Page may be in a Business Portfolio.');
            $this->line('');
            $this->line('Use this long-lived user token temporarily (valid ~60 days):');
            $this->line("FACEBOOK_PAGE_ACCESS_TOKEN={$longUserToken}");

            return self::SUCCESS;
        }

        $this->line('');
        $this->info('Pages found — page tokens derived from long-lived tokens do NOT expire:');
        $this->line('');

        $headers = ['Page ID', 'Name', 'Page Access Token (never expires)'];
        $rows = array_map(
            static fn (array $p): array => [$p['id'], $p['name'], $p['access_token']],
            $pages['data'],
        );
        $this->table($headers, $rows);

        $this->line('');
        $this->line('Add to your .env:');
        $this->line('');
        foreach ($pages['data'] as $page) {
            $this->line("# {$page['name']}");
            $this->line("FACEBOOK_PAGE_ID={$page['id']}");
            $this->line("FACEBOOK_PAGE_ACCESS_TOKEN={$page['access_token']}");
            $this->line('');
        }

        return self::SUCCESS;
    }
}
