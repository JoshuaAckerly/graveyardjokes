<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class GoogleSearchConsoleAuthorize extends Command
{
    protected $signature = 'gsc:authorize {--redirect-uri= : Override the redirect URI}';

    protected $description = 'One-time OAuth 2.0 authorization flow to obtain a Google Search Console refresh token';

    public function handle(): int
    {
        $clientId = (string) config('services.google_search_console.client_id', '');
        $clientSecret = (string) config('services.google_search_console.client_secret', '');

        if ($clientId === '' || $clientSecret === '') {
            $this->error('GOOGLE_SEARCH_CONSOLE_CLIENT_ID and GOOGLE_SEARCH_CONSOLE_CLIENT_SECRET must be set in your .env before running this command.');

            return self::FAILURE;
        }

        $redirectUri = $this->option('redirect-uri')
            ? (string) $this->option('redirect-uri')
            : rtrim((string) config('app.url', 'http://localhost'), '/').'/admin/oauth/gsc/callback';

        $scope = 'https://www.googleapis.com/auth/webmasters.readonly';

        $authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?'.http_build_query([
            'client_id' => $clientId,
            'redirect_uri' => $redirectUri,
            'response_type' => 'code',
            'scope' => $scope,
            'access_type' => 'offline',
            'prompt' => 'consent',
        ]);

        $this->newLine();
        $this->info('Step 1 — Enable the "Google Search Console API" in your Google Cloud Console, then visit this URL to authorize:');
        $this->newLine();
        $this->line($authUrl);
        $this->newLine();
        $this->comment('After authorizing, Google will redirect to:');
        $this->line("  {$redirectUri}?code=<authorization_code>&...");
        $this->newLine();

        /** @var string $code */
        $code = $this->ask('Step 2 — Paste the authorization code from the redirect URL here');

        if (! is_string($code) || trim($code) === '') {
            $this->error('No authorization code provided.');

            return self::FAILURE;
        }

        $this->info('Exchanging authorization code for tokens...');

        $response = Http::asForm()->post('https://oauth2.googleapis.com/token', [
            'client_id' => $clientId,
            'client_secret' => $clientSecret,
            'code' => trim($code),
            'redirect_uri' => $redirectUri,
            'grant_type' => 'authorization_code',
        ]);

        if (! $response->successful()) {
            $this->error('Token exchange failed: '.$response->body());

            return self::FAILURE;
        }

        $refreshToken = $response->json('refresh_token');

        if (! is_string($refreshToken) || $refreshToken === '') {
            $this->error('No refresh token returned. Ensure "access_type=offline" and "prompt=consent" were included in the auth URL.');
            $this->line('Full response: '.$response->body());

            return self::FAILURE;
        }

        $this->newLine();
        $this->info('✓ Success! Add the following to your .env:');
        $this->newLine();
        $this->line('GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN='.$refreshToken);
        $this->newLine();
        $this->comment('The client_id and client_secret can be the same OAuth app you use for Google Business Profile.');
        $this->comment('Also set: GOOGLE_SEARCH_CONSOLE_SITE_URL=https://graveyardjokes.com');

        return self::SUCCESS;
    }
}
