<?php
namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactPageTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function contact_page_loads_and_displays_contact_heading()
    {
        $response = $this->get('/contact');

        $response->assertStatus(200);
        // The page is rendered via Inertia; extract the JSON from the data-page attribute
        $html = $response->getContent();

        // Load into DOM and find the #app div
        $dom = new \DOMDocument();
        // Suppress warnings from invalid HTML fragments
        @$dom->loadHTML($html);
        $app = $dom->getElementById('app');
        $this->assertNotNull($app, 'Could not find #app element in response HTML');

        $dataPage = $app->getAttribute('data-page');
        $this->assertNotEmpty($dataPage, 'data-page attribute is empty');

        // HTML entities are encoded in the attribute; decode before JSON parsing
        $decoded = html_entity_decode($dataPage, ENT_QUOTES | ENT_HTML5);
        $json = json_decode($decoded, true);
        $this->assertIsArray($json, 'data-page did not decode to valid JSON');
        $this->assertEquals('contact', $json['component']);
    }
}
