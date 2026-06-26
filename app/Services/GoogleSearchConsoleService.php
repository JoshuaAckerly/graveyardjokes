<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class GoogleSearchConsoleService
{
    private const TOKEN_URL = 'https://oauth2.googleapis.com/token';

    private const TOKEN_CACHE_KEY = 'gsc_access_token';

    private string $clientId;

    private string $clientSecret;

    private string $refreshToken;

    private string $siteUrl;

    public function __construct()
    {
        $this->clientId = (string) config('services.google_search_console.client_id', '');
        $this->clientSecret = (string) config('services.google_search_console.client_secret', '');
        $this->refreshToken = (string) config('services.google_search_console.refresh_token', '');
        $this->siteUrl = rtrim((string) config('services.google_search_console.site_url', ''), '/');
    }

    /**
     * Returns the top queries for a given page path over the last 28 days,
     * sorted by clicks descending.
     *
     * @return array{rows: array<int, array{query: string, clicks: int, impressions: int, ctr: float, position: float}>, error?: string}
     */
    public function getPagePerformance(string $pagePath): array
    {
        $accessToken = $this->getAccessToken();

        if ($accessToken === null) {
            return ['rows' => [], 'error' => 'Failed to obtain access token.'];
        }

        $pageUrl = $this->siteUrl . '/' . ltrim($pagePath, '/');
        $encodedSite = rawurlencode($this->siteUrl . '/');

        $endDate = now()->toDateString();
        $startDate = now()->subDays(28)->toDateString();

        $response = Http::withToken($accessToken)
            ->post("https://www.googleapis.com/webmasters/v3/sites/{$encodedSite}/searchAnalytics/query", [
                'startDate' => $startDate,
                'endDate' => $endDate,
                'dimensions' => ['query'],
                'dimensionFilterGroups' => [
                    [
                        'filters' => [
                            [
                                'dimension' => 'page',
                                'operator' => 'equals',
                                'expression' => $pageUrl,
                            ],
                        ],
                    ],
                ],
                'rowLimit' => 25,
                'orderBy' => [
                    ['fieldName' => 'clicks', 'sortOrder' => 'DESCENDING'],
                ],
            ]);

        if (! $response->successful()) {
            return ['rows' => [], 'error' => 'Search Console API error: ' . $response->body()];
        }

        /** @var array{rows?: array<int, array{keys: string[], clicks: int, impressions: int, ctr: float, position: float}>} $body */
        $body = $response->json();
        $rawRows = $body['rows'] ?? [];

        $rows = array_map(fn (array $row) => [
            'query'       => $row['keys'][0] ?? '',
            'clicks'      => (int) ($row['clicks'] ?? 0),
            'impressions' => (int) ($row['impressions'] ?? 0),
            'ctr'         => round((float) ($row['ctr'] ?? 0) * 100, 2),
            'position'    => round((float) ($row['position'] ?? 0), 1),
        ], $rawRows);

        return ['rows' => $rows];
    }

    private function getAccessToken(): ?string
    {
        $cached = Cache::get(self::TOKEN_CACHE_KEY);
        if (is_string($cached) && $cached !== '') {
            return $cached;
        }

        if ($this->refreshToken === '') {
            return null;
        }

        $response = Http::asForm()->post(self::TOKEN_URL, [
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret,
            'refresh_token' => $this->refreshToken,
            'grant_type' => 'refresh_token',
        ]);

        if (! $response->successful()) {
            return null;
        }

        $token = $response->json('access_token');
        if (! is_string($token) || $token === '') {
            return null;
        }

        $expiresIn = (int) ($response->json('expires_in') ?? 3500);
        Cache::put(self::TOKEN_CACHE_KEY, $token, $expiresIn - 60);

        return $token;
    }
}
