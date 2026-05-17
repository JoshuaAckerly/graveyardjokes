<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class OgImageEdgeCasesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    public function test_ssrf_protection_blocks_private_ip_range(): void
    {
        $response = $this->get('/api/fetch-og-image?url=http://192.168.1.1/page');

        $response->assertStatus(422)
            ->assertJson(['error' => 'Invalid target host']);
    }

    public function test_ssrf_protection_blocks_loopback_ip(): void
    {
        $response = $this->get('/api/fetch-og-image?url=http://127.0.0.1/secret');

        $response->assertStatus(422)
            ->assertJson(['error' => 'Invalid target host']);
    }

    public function test_ssrf_protection_blocks_class_a_private_ip(): void
    {
        $response = $this->get('/api/fetch-og-image?url=http://10.0.0.1/internal');

        $response->assertStatus(422)
            ->assertJson(['error' => 'Invalid target host']);
    }

    public function test_rate_limiting_returns_429_when_cache_key_already_set(): void
    {
        $url = 'https://example.com';
        $cacheKey = 'og_fetch_'.md5($url);
        Cache::put($cacheKey, true, 300);

        $response = $this->get('/api/fetch-og-image?url='.$url);

        $response->assertStatus(429)
            ->assertJson(['error' => 'Rate limited - try again later']);
    }

    public function test_image_download_failure_returns_502(): void
    {
        $html = '<html><head><meta property="og:image" content="https://example.com/hero.jpg"></head></html>';

        Http::fake([
            'example.com' => Http::response($html, 200),
            'example.com/hero.jpg' => Http::response('Not Found', 404),
        ]);

        $response = $this->get('/api/fetch-og-image?url=https://example.com');

        $response->assertStatus(502)
            ->assertJson(['error' => 'Failed to download image']);
    }

    public function test_page_fetch_failure_returns_502(): void
    {
        Http::fake([
            'example.com' => Http::response('Server Error', 503),
        ]);

        $response = $this->get('/api/fetch-og-image?url=https://example.com');

        $response->assertStatus(502)
            ->assertJson(['error' => 'Failed to fetch target page']);
    }

    public function test_cached_endpoint_rejects_filename_with_invalid_characters(): void
    {
        // Filename with a space (encoded %20) — fails the [A-Za-z0-9._-]+ regex
        $response = $this->get('/api/og-cache/'.rawurlencode('file name.jpg'));

        $response->assertStatus(404);
    }

    public function test_cached_endpoint_returns_svg_placeholder_when_file_missing(): void
    {
        $response = $this->get('/api/og-cache/nonexistent1234.jpg');

        $response->assertStatus(200)
            ->assertHeader('Content-Type', 'image/svg+xml; charset=UTF-8');
    }

    public function test_cached_endpoint_svg_placeholder_contains_preview_unavailable(): void
    {
        $response = $this->get('/api/og-cache/myproject1234.jpg');

        $response->assertStatus(200);
        $this->assertStringContainsString('Preview Unavailable', (string) $response->getContent());
    }

    public function test_cached_endpoint_serves_stored_file(): void
    {
        Storage::disk('public')->put('og-cache/test_abc123.jpg', str_repeat('x', 2000));

        $response = $this->get('/api/og-cache/test_abc123.jpg');

        $response->assertStatus(200);
    }
}
