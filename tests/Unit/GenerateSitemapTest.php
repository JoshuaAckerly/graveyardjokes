<?php

namespace Tests\Unit;

use App\Models\PageSeo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;
use Tests\TestCase;

class GenerateSitemapTest extends TestCase
{
    use RefreshDatabase;

    private string $sitemapPath;

    protected function setUp(): void
    {
        parent::setUp();
        $this->sitemapPath = public_path('sitemap.xml');
    }

    protected function tearDown(): void
    {
        // Clean up generated file after each test
        if (File::exists($this->sitemapPath)) {
            File::delete($this->sitemapPath);
        }
        parent::tearDown();
    }

    public function test_generates_sitemap_xml_file(): void
    {
        $this->artisan('app:generate-sitemap --url=https://example.com')
            ->assertExitCode(0);

        $this->assertFileExists($this->sitemapPath);
    }

    public function test_sitemap_contains_home_url(): void
    {
        $this->artisan('app:generate-sitemap --url=https://example.com');

        $content = file_get_contents($this->sitemapPath);
        $this->assertStringContainsString('https://example.com/', $content);
    }

    public function test_sitemap_contains_all_core_pages(): void
    {
        $this->artisan('app:generate-sitemap --url=https://example.com');

        $content = file_get_contents($this->sitemapPath);

        $expectedPaths = ['/about', '/contact', '/portfolio', '/studio'];
        foreach ($expectedPaths as $path) {
            $this->assertStringContainsString('https://example.com'.$path, $content, "Sitemap missing: $path");
        }
    }

    public function test_sitemap_contains_all_service_pages(): void
    {
        $this->artisan('app:generate-sitemap --url=https://example.com');

        $content = file_get_contents($this->sitemapPath);

        $servicePaths = [
            '/services',
            '/services/starter',
            '/services/professional',
            '/services/premium',
            '/services/design-starter',
            '/services/design-professional',
            '/services/design-premium',
            '/services/modernization-starter',
            '/services/modernization-professional',
            '/services/modernization-premium',
        ];

        foreach ($servicePaths as $path) {
            $this->assertStringContainsString('https://example.com'.$path, $content, "Sitemap missing: $path");
        }
    }

    public function test_sitemap_contains_legal_pages(): void
    {
        $this->artisan('app:generate-sitemap --url=https://example.com');

        $content = file_get_contents($this->sitemapPath);

        foreach (['/terms', '/privacy', '/cookies'] as $path) {
            $this->assertStringContainsString('https://example.com'.$path, $content, "Sitemap missing: $path");
        }
    }

    public function test_sitemap_does_not_contain_auth_pages(): void
    {
        $this->artisan('app:generate-sitemap --url=https://example.com');

        $content = file_get_contents($this->sitemapPath);

        $excludedPaths = ['/login', '/register', '/forgot-password', '/settings'];
        foreach ($excludedPaths as $path) {
            $this->assertStringNotContainsString('https://example.com'.$path, $content, "Sitemap should not include: $path");
        }
    }

    public function test_sitemap_does_not_contain_api_routes(): void
    {
        $this->artisan('app:generate-sitemap --url=https://example.com');

        $content = file_get_contents($this->sitemapPath);

        $this->assertStringNotContainsString('/api/', $content);
    }

    public function test_sitemap_uses_provided_base_url(): void
    {
        $this->artisan('app:generate-sitemap --url=https://graveyardjokes.com');

        $content = file_get_contents($this->sitemapPath);

        $this->assertStringContainsString('graveyardjokes.com', $content);
        $this->assertStringNotContainsString('graveyardjokes.local', $content);
    }

    public function test_sitemap_falls_back_to_app_url_when_no_url_option(): void
    {
        config(['app.url' => 'https://fallback.example.com']);

        $this->artisan('app:generate-sitemap');

        $content = file_get_contents($this->sitemapPath);

        $this->assertStringContainsString('fallback.example.com', $content);
    }

    public function test_sitemap_excludes_noindex_pages(): void
    {
        PageSeo::create([
            'page_key' => 'test.noindex',
            'page_label' => 'Test Noindex',
            'page_url' => '/services/intake',
            'robots' => 'noindex,nofollow',
            'sitemap_priority' => 0.50,
            'sitemap_change_freq' => 'monthly',
        ]);

        $this->artisan('app:generate-sitemap --url=https://example.com');

        $content = (string) file_get_contents($this->sitemapPath);

        $this->assertStringNotContainsString('https://example.com/services/intake', $content);
    }

    public function test_sitemap_includes_indexable_pages_not_in_db(): void
    {
        // With an empty DB (no noindex overrides), core pages should still appear
        $this->artisan('app:generate-sitemap --url=https://example.com');

        $content = (string) file_get_contents($this->sitemapPath);

        $this->assertStringContainsString('https://example.com/', $content);
        $this->assertStringContainsString('https://example.com/about', $content);
    }

    public function test_sitemap_contains_priority_attributes(): void
    {
        $this->artisan('app:generate-sitemap --url=https://example.com');

        $content = file_get_contents($this->sitemapPath);

        $this->assertStringContainsString('<priority>', $content);
    }

    public function test_sitemap_contains_changefreq_attributes(): void
    {
        $this->artisan('app:generate-sitemap --url=https://example.com');

        $content = file_get_contents($this->sitemapPath);

        $this->assertStringContainsString('<changefreq>', $content);
    }

    public function test_sitemap_is_valid_xml(): void
    {
        $this->artisan('app:generate-sitemap --url=https://example.com');

        $content = file_get_contents($this->sitemapPath);

        $xml = simplexml_load_string($content);
        $this->assertNotFalse($xml, 'sitemap.xml is not valid XML');
    }

    public function test_output_confirms_file_written(): void
    {
        $this->artisan('app:generate-sitemap --url=https://example.com')
            ->expectsOutputToContain('sitemap.xml written to')
            ->assertExitCode(0);
    }
}
