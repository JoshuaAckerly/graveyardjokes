<?php

namespace Tests\Unit;

use App\Services\GooglePlacesService;
use Illuminate\Support\Facades\Http;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class GooglePlacesServiceTest extends TestCase
{
    private GooglePlacesService $service;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'services.google_places.api_key'  => 'test-api-key',
            'services.google_places.place_id' => 'ChIJtest123',
        ]);

        $this->service = new GooglePlacesService;
    }

    #[Test]
    public function it_is_configured_when_both_env_vars_are_set(): void
    {
        $this->assertTrue($this->service->isConfigured());
    }

    #[Test]
    public function it_is_not_configured_when_api_key_is_missing(): void
    {
        config(['services.google_places.api_key' => '']);
        $service = new GooglePlacesService;

        $this->assertFalse($service->isConfigured());
    }

    #[Test]
    public function it_is_not_configured_when_place_id_is_missing(): void
    {
        config(['services.google_places.place_id' => '']);
        $service = new GooglePlacesService;

        $this->assertFalse($service->isConfigured());
    }

    #[Test]
    public function get_reviews_returns_structured_data(): void
    {
        Http::fake([
            'maps.googleapis.com/*' => Http::response([
                'status' => 'OK',
                'result' => [
                    'rating'              => 4.8,
                    'user_ratings_total'  => 42,
                    'reviews'             => [
                        ['author_name' => 'Alice', 'rating' => 5, 'text' => 'Great!'],
                    ],
                ],
            ]),
        ]);

        $result = $this->service->getReviews();

        $this->assertSame(4.8, $result['averageRating']);
        $this->assertSame(42, $result['totalReviewCount']);
        $this->assertIsArray($result['reviews']);
        $this->assertCount(1, (array) $result['reviews']);
        $this->assertSame('places', $result['source']);
    }

    #[Test]
    public function get_reviews_throws_on_api_error_status(): void
    {
        Http::fake([
            'maps.googleapis.com/*' => Http::response([
                'status' => 'REQUEST_DENIED',
                'result' => [],
            ]),
        ]);

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Google Places API error: REQUEST_DENIED');

        $this->service->getReviews();
    }

    #[Test]
    public function get_reviews_throws_on_http_failure(): void
    {
        Http::fake([
            'maps.googleapis.com/*' => Http::response([], 500),
        ]);

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Google Places reviews request failed');

        $this->service->getReviews();
    }

    #[Test]
    public function get_business_info_returns_structured_data(): void
    {
        Http::fake([
            'maps.googleapis.com/*' => Http::response([
                'status' => 'OK',
                'result' => [
                    'name'              => 'Graveyard Jokes',
                    'rating'            => 4.9,
                    'formatted_address' => '26 Wells Ave, Cheektowaga, NY 14227',
                    'opening_hours'     => [
                        'open_now'     => true,
                        'weekday_text' => ['Monday: 9:00 AM – 5:00 PM'],
                    ],
                ],
            ]),
        ]);

        $result = $this->service->getBusinessInfo();

        $this->assertSame('Graveyard Jokes', $result['name']);
        $this->assertSame(4.9, $result['rating']);
        $this->assertSame('26 Wells Ave, Cheektowaga, NY 14227', $result['address']);
        $this->assertNotNull($result['openingHours']);
        $this->assertSame('places', $result['source']);
    }

    #[Test]
    public function get_business_info_throws_on_api_error_status(): void
    {
        Http::fake([
            'maps.googleapis.com/*' => Http::response([
                'status' => 'INVALID_REQUEST',
                'result' => [],
            ]),
        ]);

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Google Places API error: INVALID_REQUEST');

        $this->service->getBusinessInfo();
    }

    #[Test]
    public function get_business_info_throws_on_http_failure(): void
    {
        Http::fake([
            'maps.googleapis.com/*' => Http::response([], 503),
        ]);

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Google Places info request failed');

        $this->service->getBusinessInfo();
    }

    #[Test]
    public function get_reviews_handles_missing_optional_fields(): void
    {
        Http::fake([
            'maps.googleapis.com/*' => Http::response([
                'status' => 'OK',
                'result' => [],
            ]),
        ]);

        $result = $this->service->getReviews();

        $this->assertNull($result['averageRating']);
        $this->assertSame(0, $result['totalReviewCount']);
        $this->assertSame([], $result['reviews']);
    }
}
