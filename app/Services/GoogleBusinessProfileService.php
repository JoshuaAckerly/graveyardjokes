<?php

namespace App\Services;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class GoogleBusinessProfileService
{
    private const TOKEN_URL = 'https://oauth2.googleapis.com/token';
    private const REVIEWS_BASE = 'https://mybusiness.googleapis.com/v4';
    private const INFO_BASE = 'https://mybusinessbusinessinformation.googleapis.com/v1';
    private const POSTS_BASE = 'https://mybusiness.googleapis.com/v4';
    private const TOKEN_CACHE_KEY = 'google_business_access_token';

    private string $clientId;
    private string $clientSecret;
    private string $refreshToken;
    private string $locationName;

    public function __construct()
    {
        $this->clientId = (string) config('services.google_business.client_id', '');
        $this->clientSecret = (string) config('services.google_business.client_secret', '');
        $this->refreshToken = (string) config('services.google_business.refresh_token', '');
        $this->locationName = (string) config('services.google_business.location_name', '');
    }

    /**
     * Get a valid access token, refreshing via the stored refresh token if needed.
     */
    public function getAccessToken(): string
    {
        /** @var string|null $cached */
        $cached = Cache::get(self::TOKEN_CACHE_KEY);
        if ($cached !== null) {
            return $cached;
        }

        $response = Http::asForm()->post(self::TOKEN_URL, [
            'client_id'     => $this->clientId,
            'client_secret' => $this->clientSecret,
            'refresh_token' => $this->refreshToken,
            'grant_type'    => 'refresh_token',
        ]);

        $token = $response->json('access_token');
        $expiresIn = (int) ($response->json('expires_in') ?? 3600);

        if (! is_string($token) || $token === '') {
            throw new \RuntimeException('Failed to obtain Google Business access token: '.$response->body());
        }

        // Cache for 5 minutes less than the expiry to be safe
        Cache::put(self::TOKEN_CACHE_KEY, $token, $expiresIn - 300);

        return $token;
    }

    /**
     * Fetch reviews for the configured location.
     *
     * @return array<string, mixed>
     */
    public function getReviews(int $pageSize = 20): array
    {
        $response = Http::withToken($this->getAccessToken())
            ->get(self::REVIEWS_BASE.'/'.$this->locationName.'/reviews', [
                'pageSize' => $pageSize,
            ]);

        if (! $response instanceof Response || ! $response->successful()) {
            throw new \RuntimeException('Google Business reviews request failed: '.$response->body());
        }

        $data = $response->json();

        return is_array($data) ? $data : [];
    }

    /**
     * Fetch business info (hours, description) for the configured location.
     *
     * @return array<string, mixed>
     */
    public function getBusinessInfo(): array
    {
        $response = Http::withToken($this->getAccessToken())
            ->get(self::INFO_BASE.'/'.$this->locationName, [
                'readMask' => 'regularHours,specialHours,metadata,description,name,title',
            ]);

        if (! $response instanceof Response || ! $response->successful()) {
            throw new \RuntimeException('Google Business info request failed: '.$response->body());
        }

        $data = $response->json();

        return is_array($data) ? $data : [];
    }

    /**
     * Fetch local posts for the configured location.
     *
     * @return array<string, mixed>
     */
    public function getPosts(int $pageSize = 10): array
    {
        $response = Http::withToken($this->getAccessToken())
            ->get(self::POSTS_BASE.'/'.$this->locationName.'/localPosts', [
                'pageSize' => $pageSize,
            ]);

        if (! $response instanceof Response || ! $response->successful()) {
            throw new \RuntimeException('Google Business posts request failed: '.$response->body());
        }

        $data = $response->json();

        return is_array($data) ? $data : [];
    }

    /**
     * Reply to (or update the reply on) an existing review.
     *
     * @return array<string, mixed>
     */
    public function replyToReview(string $reviewId, string $comment): array
    {
        $url = self::REVIEWS_BASE.'/'.$this->locationName.'/reviews/'.$reviewId.'/reply';

        $response = Http::withToken($this->getAccessToken())
            ->put($url, ['comment' => $comment]);

        if (! $response instanceof Response || ! $response->successful()) {
            throw new \RuntimeException('Google Business reply request failed: '.$response->body());
        }

        $data = $response->json();

        return is_array($data) ? $data : [];
    }

    /**
     * Create a new local post on the configured location.
     *
     * @param  array<string, mixed>  $postData
     * @return array<string, mixed>
     */
    public function createPost(array $postData): array
    {
        $response = Http::withToken($this->getAccessToken())
            ->post(self::POSTS_BASE.'/'.$this->locationName.'/localPosts', $postData);

        if (! $response instanceof Response || ! $response->successful()) {
            throw new \RuntimeException('Google Business create post request failed: '.$response->body());
        }

        $data = $response->json();

        return is_array($data) ? $data : [];
    }
}
