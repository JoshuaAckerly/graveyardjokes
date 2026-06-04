<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ContactPageTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function contact_page_loads_and_displays_contact_heading(): void
    {
        $response = $this->get('/contact');

        $response->assertStatus(200);
        // Inertia v3 embeds the page payload in a <script data-page="app" type="application/json">
        // tag rather than a data-page attribute on the #app div.
        $html = (string) $response->getContent();

        $dom = new \DOMDocument;
        @(bool) $dom->loadHTML($html);
        $xpath = new \DOMXPath($dom);

        /** @var \DOMNodeList<\DOMElement> $nodes */
        $nodes = $xpath->query('//script[@data-page="app"]');
        $this->assertGreaterThan(0, $nodes->length, 'Could not find <script data-page="app"> element in response HTML');

        $node = $nodes->item(0);
        $this->assertNotNull($node, 'Could not retrieve <script data-page="app"> node');

        $dataPage = $node->textContent;
        $this->assertNotEmpty($dataPage, 'Inertia page script tag is empty');

        $json = json_decode($dataPage, true);
        $this->assertIsArray($json, 'Inertia page script did not decode to valid JSON');
        $this->assertEquals('contact', $json['component']);
    }
}
