<?php

namespace App\Services;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;

class GooglePlacesService
{
    private const BASE_URL = 'https://maps.googleapis.com/maps/api/place/details/json';

    private string $apiKey;

    private string $placeId;

    public function __construct()
    {
        /** @var string $apiKey */
        $apiKey = config('services.google_places.api_key', '');
        /** @var string $placeId */
        $placeId = config('services.google_places.place_id', '');
        $this->apiKey = $apiKey;
        $this->placeId = $placeId;
    }

    public function isConfigured(): bool
    {
        return $this->apiKey !== '' && $this->placeId !== '';
    }

    /**
     * Fetch reviews data (overall rating, count, and recent reviews).
     *
     * @return array<string, mixed>
     */
    public function getReviews(): array
    {
        $response = Http::get(self::BASE_URL, [
            'place_id' => $this->placeId,
            'fields'   => 'rating,user_ratings_total,reviews',
            'key'      => $this->apiKey,
        ]);

        if (! $response instanceof Response || ! $response->successful()) {
            throw new \RuntimeException('Google Places reviews request failed: '.(($response instanceof Response) ? $response->body() : ''));
        }

        /** @var array<string, mixed> $data */
        $data = $response->json();
        $status = is_string($data['status'] ?? null) ? $data['status'] : '';

        if ($status !== 'OK') {
            throw new \RuntimeException('Google Places API error: '.$status);
        }

        /** @var array<string, mixed> $result */
        $result = is_array($data['result'] ?? null) ? $data['result'] : [];

        return [
            'averageRating'    => is_float($result['rating'] ?? null) || is_int($result['rating'] ?? null) ? $result['rating'] : null,
            'totalReviewCount' => is_int($result['user_ratings_total'] ?? null) ? $result['user_ratings_total'] : 0,
            'reviews'          => is_array($result['reviews'] ?? null) ? $result['reviews'] : [],
            'source'           => 'places',
        ];
    }

    /**
     * Fetch business info (name, rating, hours, address).
     *
     * @return array<string, mixed>
     */
    public function getBusinessInfo(): array
    {
        $response = Http::get(self::BASE_URL, [
            'place_id' => $this->placeId,
            'fields'   => 'name,rating,opening_hours,formatted_address',
            'key'      => $this->apiKey,
        ]);

        if (! $response instanceof Response || ! $response->successful()) {
            throw new \RuntimeException('Google Places info request failed: '.(($response instanceof Response) ? $response->body() : ''));
        }

        /** @var array<string, mixed> $data */
        $data = $response->json();
        $status = is_string($data['status'] ?? null) ? $data['status'] : '';

        if ($status !== 'OK') {
            throw new \RuntimeException('Google Places API error: '.$status);
        }

        /** @var array<string, mixed> $result */
        $result = is_array($data['result'] ?? null) ? $data['result'] : [];

        return [
            'name'         => is_string($result['name'] ?? null) ? $result['name'] : null,
            'rating'       => is_float($result['rating'] ?? null) || is_int($result['rating'] ?? null) ? $result['rating'] : null,
            'openingHours' => is_array($result['opening_hours'] ?? null) ? $result['opening_hours'] : null,
            'address'      => is_string($result['formatted_address'] ?? null) ? $result['formatted_address'] : null,
            'source'       => 'places',
        ];
    }
}
