<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class LinkedInAuthorize extends Command
{
    protected $signature = 'linkedin:authorize';

    protected $description = 'OAuth 2.0 flow to obtain a LinkedIn access token for posting';

    public function handle(): int
    {
        $clientId = (string) config('services.linkedin.client_id', '');
        $clientSecret = (string) config('services.linkedin.client_secret', '');

        if ($clientId === '' || $clientSecret === '') {
            $this->error('LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET must be set in your .env before running this command.');
            $this->line('Create an app at https://www.linkedin.com/developers/apps, add the "Share on LinkedIn" product.');

            return self::FAILURE;
        }

        $redirectUri = 'http://localhost';
        // w_organization_social lets you post as a company page if you are an admin
        $scope = 'openid profile w_member_social w_organization_social r_organization_social';

        $authUrl = 'https://www.linkedin.com/oauth/v2/authorization?'.http_build_query([
            'response_type' => 'code',
            'client_id' => $clientId,
            'redirect_uri' => $redirectUri,
            'scope' => $scope,
        ]);

        $this->newLine();
        $this->info('Step 1 — Visit this URL in your browser and authorize:');
        $this->newLine();
        $this->line($authUrl);
        $this->newLine();
        $this->comment('After authorizing, you will be redirected to http://localhost?code=<code>&...');
        $this->comment('Copy the "code" query parameter value.');
        $this->newLine();

        /** @var string $code */
        $code = $this->ask('Step 2 — Paste the authorization code here');

        if (! is_string($code) || trim($code) === '') {
            $this->error('No authorization code provided.');

            return self::FAILURE;
        }

        $this->info('Exchanging code for access token...');

        $response = Http::asForm()->post('https://www.linkedin.com/oauth/v2/accessToken', [
            'grant_type' => 'authorization_code',
            'code' => trim($code),
            'redirect_uri' => $redirectUri,
            'client_id' => $clientId,
            'client_secret' => $clientSecret,
        ]);

        if (! $response->successful()) {
            $this->error('Token exchange failed: '.$response->body());

            return self::FAILURE;
        }

        $accessToken = $response->json('access_token');

        if (! is_string($accessToken) || $accessToken === '') {
            $this->error('No access token returned. Response: '.$response->body());

            return self::FAILURE;
        }

        // Fetch the person URN
        $meResponse = Http::withHeaders([
            'Authorization' => 'Bearer '.$accessToken,
            'LinkedIn-Version' => '202502',
        ])->get('https://api.linkedin.com/v2/me');

        $personId = $meResponse->successful() ? $meResponse->json('id') : null;
        $authorUrn = is_string($personId) ? "urn:li:person:{$personId}" : null;

        $expiresIn = $response->json('expires_in', 5184000); // default 60 days
        $expiryDays = (int) round($expiresIn / 86400);

        $this->newLine();
        $this->info('✓ Success! Add the following to your .env:');
        $this->newLine();
        $this->line("LINKEDIN_ACCESS_TOKEN={$accessToken}");
        if ($authorUrn) {
            $this->line("LINKEDIN_AUTHOR_URN={$authorUrn}");
        } else {
            $this->warn('Could not auto-detect your person URN. Set LINKEDIN_AUTHOR_URN manually.');
            $this->line('Format: urn:li:person:PERSON_ID  or  urn:li:organization:ORG_ID');
        }
        $this->newLine();
        $this->comment("Token expires in ~{$expiryDays} days. Re-run this command to refresh it.");
        $this->comment('To post as a company page instead, set LINKEDIN_AUTHOR_URN=urn:li:organization:YOUR_ORG_ID');

        return self::SUCCESS;
    }
}
