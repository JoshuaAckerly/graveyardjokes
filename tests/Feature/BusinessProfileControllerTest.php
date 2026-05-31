<?php

namespace Tests\Feature;

use App\Services\GoogleBusinessProfileService;
use App\Services\GooglePlacesService;
use Illuminate\Support\Facades\Cache;
use Mockery;
use Mockery\Expectation;
use Mockery\MockInterface;
use Tests\TestCase;

class BusinessProfileControllerTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Cache::flush();
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_reviews_returns_gbp_data_when_available(): void
    {
        /** @var GoogleBusinessProfileService&MockInterface $gbp */
        $gbp = Mockery::mock(GoogleBusinessProfileService::class);
        /** @var Expectation $e */
        $e = $gbp->shouldReceive('getReviews');
        $e->once()->andReturn(['reviews' => [], 'averageRating' => 5.0, 'totalReviewCount' => 10]);
        $this->app->instance(GoogleBusinessProfileService::class, $gbp);

        /** @var GooglePlacesService&MockInterface $places */
        $places = Mockery::mock(GooglePlacesService::class);
        $places->shouldNotReceive('getReviews');
        $this->app->instance(GooglePlacesService::class, $places);

        $this->getJson('/api/business/reviews')
            ->assertOk()
            ->assertJsonFragment(['averageRating' => 5.0]);
    }

    public function test_reviews_falls_back_to_places_when_gbp_fails(): void
    {
        /** @var GoogleBusinessProfileService&MockInterface $gbp */
        $gbp = Mockery::mock(GoogleBusinessProfileService::class);
        /** @var Expectation $e */
        $e = $gbp->shouldReceive('getReviews');
        $e->once()->andThrow(new \RuntimeException('GBP not authorized'));
        $this->app->instance(GoogleBusinessProfileService::class, $gbp);

        /** @var GooglePlacesService&MockInterface $places */
        $places = Mockery::mock(GooglePlacesService::class);
        /** @var Expectation $ec */
        $ec = $places->shouldReceive('isConfigured');
        $ec->once()->andReturn(true);
        /** @var Expectation $er */
        $er = $places->shouldReceive('getReviews');
        $er->once()->andReturn([
            'averageRating' => 4.7,
            'totalReviewCount' => 8,
            'reviews' => [],
            'source' => 'places',
        ]);
        $this->app->instance(GooglePlacesService::class, $places);

        $this->getJson('/api/business/reviews')
            ->assertOk()
            ->assertJsonFragment(['source' => 'places', 'averageRating' => 4.7]);
    }

    public function test_reviews_returns_503_when_gbp_fails_and_places_not_configured(): void
    {
        /** @var GoogleBusinessProfileService&MockInterface $gbp */
        $gbp = Mockery::mock(GoogleBusinessProfileService::class);
        /** @var Expectation $e */
        $e = $gbp->shouldReceive('getReviews');
        $e->once()->andThrow(new \RuntimeException('GBP not authorized'));
        $this->app->instance(GoogleBusinessProfileService::class, $gbp);

        /** @var GooglePlacesService&MockInterface $places */
        $places = Mockery::mock(GooglePlacesService::class);
        /** @var Expectation $ec */
        $ec = $places->shouldReceive('isConfigured');
        $ec->once()->andReturn(false);
        $this->app->instance(GooglePlacesService::class, $places);

        $this->getJson('/api/business/reviews')
            ->assertStatus(503)
            ->assertJson(['error' => 'Unable to fetch reviews']);
    }

    public function test_reviews_returns_503_when_both_services_fail(): void
    {
        /** @var GoogleBusinessProfileService&MockInterface $gbp */
        $gbp = Mockery::mock(GoogleBusinessProfileService::class);
        /** @var Expectation $e */
        $e = $gbp->shouldReceive('getReviews');
        $e->once()->andThrow(new \RuntimeException('GBP failed'));
        $this->app->instance(GoogleBusinessProfileService::class, $gbp);

        /** @var GooglePlacesService&MockInterface $places */
        $places = Mockery::mock(GooglePlacesService::class);
        /** @var Expectation $ec */
        $ec = $places->shouldReceive('isConfigured');
        $ec->once()->andReturn(true);
        /** @var Expectation $er */
        $er = $places->shouldReceive('getReviews');
        $er->once()->andThrow(new \RuntimeException('Places failed'));
        $this->app->instance(GooglePlacesService::class, $places);

        $this->getJson('/api/business/reviews')
            ->assertStatus(503)
            ->assertJson(['error' => 'Unable to fetch reviews']);
    }

    public function test_info_falls_back_to_places_when_gbp_fails(): void
    {
        /** @var GoogleBusinessProfileService&MockInterface $gbp */
        $gbp = Mockery::mock(GoogleBusinessProfileService::class);
        /** @var Expectation $e */
        $e = $gbp->shouldReceive('getBusinessInfo');
        $e->once()->andThrow(new \RuntimeException('GBP not authorized'));
        $this->app->instance(GoogleBusinessProfileService::class, $gbp);

        /** @var GooglePlacesService&MockInterface $places */
        $places = Mockery::mock(GooglePlacesService::class);
        /** @var Expectation $ec */
        $ec = $places->shouldReceive('isConfigured');
        $ec->once()->andReturn(true);
        /** @var Expectation $ei */
        $ei = $places->shouldReceive('getBusinessInfo');
        $ei->once()->andReturn([
            'name' => 'Graveyard Jokes',
            'rating' => 4.9,
            'openingHours' => null,
            'address' => '26 Wells Ave, Cheektowaga, NY 14227',
            'source' => 'places',
        ]);
        $this->app->instance(GooglePlacesService::class, $places);

        $this->getJson('/api/business/info')
            ->assertOk()
            ->assertJsonFragment(['source' => 'places', 'name' => 'Graveyard Jokes']);
    }

    public function test_info_returns_503_when_gbp_fails_and_places_not_configured(): void
    {
        /** @var GoogleBusinessProfileService&MockInterface $gbp */
        $gbp = Mockery::mock(GoogleBusinessProfileService::class);
        /** @var Expectation $e */
        $e = $gbp->shouldReceive('getBusinessInfo');
        $e->once()->andThrow(new \RuntimeException('GBP not authorized'));
        $this->app->instance(GoogleBusinessProfileService::class, $gbp);

        /** @var GooglePlacesService&MockInterface $places */
        $places = Mockery::mock(GooglePlacesService::class);
        /** @var Expectation $ec */
        $ec = $places->shouldReceive('isConfigured');
        $ec->once()->andReturn(false);
        $this->app->instance(GooglePlacesService::class, $places);

        $this->getJson('/api/business/info')
            ->assertStatus(503)
            ->assertJson(['error' => 'Unable to fetch business info']);
    }
}
