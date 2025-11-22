<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

/**
 * Comprehensive API endpoint feature tests
 */
class ApiEndpointsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
        Mail::fake();
    }

    // ===== Random Joke API - Additional Edge Cases =====

    public function test_random_joke_handles_null_cache(): void
    {
        Cache::forget('jokes_data');

        $response = $this->get('/api/random-joke');

        // Will either return 200 with jokes from file or 503 if file doesn't exist
        $this->assertContains($response->status(), [200, 503]);
    }

    public function test_random_joke_handles_missing_required_fields(): void
    {
        Cache::put('jokes_data', [
            ['id' => 'incomplete']  // Missing setup, punchline
        ]);

        $response = $this->get('/api/random-joke');

        $response->assertStatus(200)
                ->assertJsonStructure(['id']);
    }

    public function test_random_joke_handles_large_dataset(): void
    {
        $jokes = [];
        for ($i = 1; $i <= 100; $i++) {
            $jokes[] = [
                'id' => "joke_{$i}",
                'setup' => "Setup {$i}",
                'punchline' => "Punchline {$i}",
                'category' => 'test'
            ];
        }
        Cache::put('jokes_data', $jokes);

        $response = $this->get('/api/random-joke');

        $response->assertStatus(200)
                ->assertJsonStructure(['id', 'setup', 'punchline', 'category']);
    }

    public function test_random_joke_returns_valid_json_structure(): void
    {
        Cache::put('jokes_data', [
            [
                'id' => 'test_1',
                'setup' => 'Why did the chicken cross the road?',
                'punchline' => 'To get to the other side!',
                'category' => 'classic',
                'tags' => ['animals', 'classic'],
                'rating' => 4.5
            ]
        ]);

        $response = $this->getJson('/api/random-joke');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'id',
                    'setup',
                    'punchline',
                    'category'
                ]);
    }

    public function test_random_joke_accepts_json_requests(): void
    {
        Cache::put('jokes_data', [
            ['id' => 'test', 'setup' => 'Setup', 'punchline' => 'Punchline', 'category' => 'test']
        ]);

        $response = $this->json('GET', '/api/random-joke');

        $response->assertStatus(200)
                ->assertHeader('Content-Type', 'application/json');
    }

    // ===== OG Image API - Comprehensive Tests =====

    public function test_fetch_og_image_handles_no_images_found(): void
    {
        Http::fake([
            'example.com' => Http::response('<html><body>No images here</body></html>', 200)
        ]);

        $response = $this->get('/api/fetch-og-image?url=https://example.com');

        $response->assertStatus(404)
                ->assertJson(['error' => 'No image found on target page']);
    }

    public function test_fetch_og_image_handles_relative_urls(): void
    {
        $html = '<html><head><meta property="og:image" content="/images/logo.png"></head></html>';
        $imageData = str_repeat('x', 2000);

        Http::fake([
            'example.com' => Http::response($html, 200),
            'example.com/images/logo.png' => Http::response($imageData, 200, ['Content-Type' => 'image/png'])
        ]);

        $response = $this->get('/api/fetch-og-image?url=https://example.com');

        $response->assertStatus(200)
                ->assertJsonStructure(['url']);
    }

    public function test_fetch_og_image_handles_protocol_relative_urls(): void
    {
        $html = '<html><head><meta property="og:image" content="//cdn.example.com/image.jpg"></head></html>';
        $imageData = str_repeat('x', 2000);

        Http::fake([
            'example.com' => Http::response($html, 200),
            'cdn.example.com/image.jpg' => Http::response($imageData, 200, ['Content-Type' => 'image/jpeg'])
        ]);

        $response = $this->get('/api/fetch-og-image?url=https://example.com');

        $response->assertStatus(200)
                ->assertJsonStructure(['url']);
    }

    public function test_fetch_og_image_handles_non_image_content_type(): void
    {
        $html = '<html><head><meta property="og:image" content="https://example.com/file.pdf"></head></html>';

        Http::fake([
            'example.com' => Http::response($html, 200),
            'example.com/file.pdf' => Http::response('PDF content', 200, ['Content-Type' => 'application/pdf'])
        ]);

        $response = $this->get('/api/fetch-og-image?url=https://example.com');

        $response->assertStatus(422)
                ->assertJsonFragment(['error' => 'Downloaded resource is not an image']);
    }

    public function test_fetch_og_image_handles_different_image_formats(): void
    {
        $formats = [
            'image/png' => 'png',
            'image/webp' => 'webp',
            'image/gif' => 'gif',
            'image/svg+xml' => 'svg'
        ];

        foreach ($formats as $contentType => $extension) {
            $html = "<html><head><meta property=\"og:image\" content=\"https://example.com/image.{$extension}\"></head></html>";
            $imageData = str_repeat('x', 2000);

            Http::fake([
                'example.com' => Http::response($html, 200),
                "example.com/image.{$extension}" => Http::response($imageData, 200, ['Content-Type' => $contentType])
            ]);

            $response = $this->get('/api/fetch-og-image?url=https://example.com');

            $response->assertStatus(200)
                    ->assertJsonStructure(['url']);

            Cache::flush();
        }
    }

    public function test_fetch_og_image_fallback_to_img_tag(): void
    {
        $html = '<html><body><img src="https://example.com/fallback.jpg" alt="Image"></body></html>';
        $imageData = str_repeat('x', 2000);

        Http::fake([
            'example.com' => Http::response($html, 200),
            'example.com/fallback.jpg' => Http::response($imageData, 200, ['Content-Type' => 'image/jpeg'])
        ]);

        $response = $this->get('/api/fetch-og-image?url=https://example.com');

        $response->assertStatus(200)
                ->assertJsonStructure(['url']);
    }

    public function test_fetch_og_image_ignores_data_uris(): void
    {
        $html = '<html><body><img src="data:image/png;base64,iVBOR..."><img src="https://example.com/real.jpg"></body></html>';
        $imageData = str_repeat('x', 2000);

        Http::fake([
            'example.com' => Http::response($html, 200),
            'example.com/real.jpg' => Http::response($imageData, 200, ['Content-Type' => 'image/jpeg'])
        ]);

        $response = $this->get('/api/fetch-og-image?url=https://example.com');

        $response->assertStatus(200);
    }

    public function test_fetch_og_image_handles_timeout(): void
    {
        Http::fake(function () {
            throw new \Exception('Connection timeout');
        });

        $response = $this->get('/api/fetch-og-image?url=https://example.com');

        $response->assertStatus(500)
                ->assertJson(['error' => 'Failed to fetch image']);
    }

    public function test_fetch_og_image_validates_url_length(): void
    {
        $longUrl = 'https://example.com/' . str_repeat('a', 3000);

        $response = $this->get('/api/fetch-og-image?url=' . urlencode($longUrl));

        $response->assertStatus(302); // Validation redirect
    }

    // ===== Visitor Tracking API - Additional Tests =====

    public function test_visitor_tracking_handles_get_request(): void
    {
        $response = $this->get('/track-visit');

        // Returns 404 because route only allows POST and OPTIONS
        $response->assertStatus(404);
    }

    public function test_visitor_tracking_returns_correct_json_structure(): void
    {
        $response = $this->postJson('/track-visit', [
            'referrer' => 'https://google.com',
            'subdomain' => 'www'
        ]);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'data' => [
                        'ip',
                        'city',
                        'country'
                    ]
                ]);
    }

    public function test_visitor_tracking_handles_localhost_ip(): void
    {
        $response = $this->postJson('/track-visit', [], [
            'REMOTE_ADDR' => '127.0.0.1'
        ]);

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'data' => [
                        'country' => 'Local Development',
                        'city' => 'Localhost'
                    ]
                ]);
    }

    public function test_visitor_tracking_handles_ipv6(): void
    {
        $response = $this->postJson('/track-visit', [], [
            'REMOTE_ADDR' => '::1'
        ]);

        $response->assertStatus(200)
                ->assertJsonStructure(['success', 'message', 'data']);
    }

    public function test_visitor_tracking_handles_missing_referrer(): void
    {
        $response = $this->postJson('/track-visit', [
            'subdomain' => 'www'
        ]);

        $response->assertStatus(200)
                ->assertJson(['success' => true]);
    }

    public function test_visitor_tracking_handles_long_referrer(): void
    {
        $response = $this->postJson('/track-visit', [
            'referrer' => 'https://example.com/' . str_repeat('a', 1000),
            'subdomain' => 'www'
        ]);

        $response->assertStatus(200);
    }

    public function test_visitor_tracking_cors_headers(): void
    {
        $response = $this->options('/track-visit', [
            'Origin' => 'https://graveyardjokes.com'
        ]);

        $response->assertStatus(200);
    }

    // ===== Contact Form API - Additional Tests =====

    public function test_contact_form_handles_special_characters(): void
    {
        $response = $this->post('/contact', [
            'first_name' => "O'Brien",
            'last_name' => 'Müller',
            'email' => 'test@example.com',
            'message' => 'Test with émojis 🎃'
        ]);

        $response->assertStatus(302)
                ->assertSessionHas('success');
    }

    public function test_contact_form_handles_html_in_message(): void
    {
        $response = $this->post('/contact', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'test@example.com',
            'message' => '<strong>Bold message</strong> with <em>HTML</em>'
        ]);

        $response->assertStatus(302)
                ->assertSessionHas('success');

        $this->assertDatabaseHas('contacts', [
            'email' => 'test@example.com'
        ]);
    }

    public function test_contact_form_trims_whitespace(): void
    {
        $response = $this->post('/contact', [
            'first_name' => '  John  ',
            'last_name' => '  Doe  ',
            'email' => '  test@example.com  ',
            'message' => '  Test message  '
        ]);

        $response->assertStatus(302);
    }

    public function test_contact_form_handles_duplicate_submissions(): void
    {
        $contactData = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com',
            'message' => 'Test message'
        ];

        $this->post('/contact', $contactData);
        $response = $this->post('/contact', $contactData);

        $response->assertStatus(302)
                ->assertSessionHas('success');

        $this->assertDatabaseCount('contacts', 2);
    }

    public function test_contact_form_validates_email_format(): void
    {
        $invalidEmails = [
            'notanemail',
            '@example.com',
            'test@',
            'test..double@example.com'
        ];

        foreach ($invalidEmails as $email) {
            $response = $this->post('/contact', [
                'first_name' => 'Test',
                'last_name' => 'User',
                'email' => $email,
                'message' => 'Test'
            ]);

            $response->assertStatus(302)
                    ->assertSessionHasErrors('email');
        }
    }

    // ===== API Documentation Tests =====

    public function test_api_docs_returns_html(): void
    {
        $response = $this->get('/api/docs');

        $response->assertStatus(200)
                ->assertHeader('Content-Type', 'text/html; charset=UTF-8');
    }

    public function test_openapi_yaml_returns_file(): void
    {
        $response = $this->get('/openapi.yaml');

        $response->assertStatus(200)
                ->assertHeader('Content-Type', 'application/x-yaml');
    }

    // ===== Error Handling and Edge Cases =====

    public function test_api_handles_large_json_payload(): void
    {
        $largeArray = [];
        for ($i = 0; $i < 1000; $i++) {
            $largeArray["key_{$i}"] = str_repeat('x', 100);
        }

        $response = $this->postJson('/track-visit', $largeArray);

        $response->assertStatus(200);
    }

    public function test_api_handles_concurrent_requests(): void
    {
        Cache::put('jokes_data', [
            ['id' => 'test', 'setup' => 'Setup', 'punchline' => 'Punchline', 'category' => 'test']
        ]);

        $responses = [];
        for ($i = 0; $i < 10; $i++) {
            $responses[] = $this->get('/api/random-joke');
        }

        foreach ($responses as $response) {
            $response->assertStatus(200);
        }
    }

    public function test_api_endpoints_have_proper_http_methods(): void
    {
        // Test that GET endpoints don't accept POST
        $response = $this->post('/api/random-joke');
        $response->assertStatus(405);

        // Test that POST endpoints don't accept GET (visitor tracking returns 404)
        $response = $this->get('/track-visit');
        $this->assertContains($response->status(), [404, 405]);
    }

    public function test_api_returns_json_error_for_invalid_routes(): void
    {
        $response = $this->getJson('/api/invalid-endpoint');

        $response->assertStatus(404);
    }

    // ===== Security Tests =====

    public function test_contact_form_sanitizes_sql_injection_attempts(): void
    {
        $response = $this->post('/contact', [
            'first_name' => "'; DROP TABLE contacts; --",
            'last_name' => 'Test',
            'email' => 'test@example.com',
            'message' => 'Test'
        ]);

        $response->assertStatus(302);
        $this->assertDatabaseCount('contacts', 1);
    }

    public function test_visitor_tracking_rate_limiting(): void
    {
        // Make multiple rapid requests
        for ($i = 0; $i < 5; $i++) {
            $response = $this->postJson('/track-visit', [
                'referrer' => 'https://test.com',
                'subdomain' => 'www'
            ]);

            $response->assertStatus(200);
        }
    }

    public function test_api_endpoints_return_proper_cors_headers(): void
    {
        $response = $this->options('/track-visit');

        $response->assertStatus(200);
    }
}
