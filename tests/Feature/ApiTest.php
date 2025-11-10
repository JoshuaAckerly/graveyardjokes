<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_random_joke_endpoint_returns_json(): void
    {
        // Mock jokes data in cache
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
                ->assertJsonStructure([
                    'id',
                    'setup', 
                    'punchline',
                    'category'
                ]);
    }

    public function test_random_joke_endpoint_handles_no_jokes(): void
    {
        Cache::forget('jokes_data');

        $response = $this->get('/api/random-joke');

        $response->assertStatus(503)
                ->assertJson(['error' => 'No jokes available']);
    }

    public function test_fetch_og_image_validates_url(): void
    {
        $response = $this->get('/api/fetch-og-image');

        $response->assertStatus(422);
    }

    public function test_fetch_og_image_blocks_private_addresses(): void
    {
        $response = $this->get('/api/fetch-og-image?url=http://localhost');

        $response->assertStatus(422)
                ->assertJson(['error' => 'Invalid target host']);
    }

    public function test_contact_form_validation(): void
    {
        $response = $this->post('/contact', []);

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

        $this->assertDatabaseHas('contacts', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com',
            'message' => 'Test message'
        ]);
    }

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
                    'data' => [
                        'ip',
                        'city',
                        'country'
                    ]
                ]);
    }

    public function test_api_documentation_routes(): void
    {
        $response = $this->get('/api/docs');
        $response->assertStatus(200);

        $response = $this->get('/openapi.yaml');
        $response->assertStatus(200)
                ->assertHeader('Content-Type', 'application/x-yaml');
    }
}