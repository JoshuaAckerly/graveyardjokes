<?php

namespace Tests\Unit;

use App\Services\GoogleBusinessProfileService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class GoogleBusinessProfileServiceTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Cache::flush();
    }

    public function test_access_token_requires_oauth_config(): void
    {
        config([
            'services.google_business.client_id' => '',
            'services.google_business.client_secret' => '',
            'services.google_business.refresh_token' => '',
        ]);

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Google Business OAuth config missing: GOOGLE_BUSINESS_CLIENT_ID, GOOGLE_BUSINESS_CLIENT_SECRET, GOOGLE_BUSINESS_REFRESH_TOKEN');

        (new GoogleBusinessProfileService)->getAccessToken();
    }

    public function test_posts_require_location_name_before_http_request(): void
    {
        config([
            'services.google_business.client_id' => 'client-id',
            'services.google_business.client_secret' => 'client-secret',
            'services.google_business.refresh_token' => 'refresh-token',
            'services.google_business.location_name' => '',
        ]);

        Http::fake();

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('GOOGLE_BUSINESS_LOCATION_NAME is not configured');

        try {
            (new GoogleBusinessProfileService)->getPosts();
        } finally {
            Http::assertNothingSent();
        }
    }
}
