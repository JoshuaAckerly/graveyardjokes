<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Facades\Http;

class GenerateSitemapIndex extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    // Add optional --validate flag to verify each sitemap URL responds with 200
    protected $signature = 'app:generate-sitemap-index {--validate : Validate each sitemap URL via HTTP before including it}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate sitemap_index.xml referencing configured subdomain sitemaps';

    public function handle(Filesystem $files)
    {
        $this->info('Generating sitemap_index.xml...');

        $subdomains = config('sitemaps.subdomains', []);
        $base = rtrim(config('app.url'), '/');
        $host = parse_url($base, PHP_URL_HOST) ?: preg_replace('#https?://#', '', $base);

        $validate = $this->option('validate');

        $candidates = [];

        // Always include the primary sitemap candidate
        $candidates[] = $base . '/sitemap.xml';

        foreach ($subdomains as $sub) {
            $candidates[] = sprintf('https://%s.%s/sitemap.xml', $sub, $host);
        }

        $entries = [];
        $summaryLines = [];
        $passed = 0;
        $skipped = 0;

        foreach ($candidates as $loc) {
            if ($validate) {
                try {
                    $this->line('Checking ' . $loc . ' ...');
                    // Use HEAD first to save bandwidth; fall back to GET if not allowed
                    $resp = Http::timeout(5)->withHeaders(['User-Agent' => 'graveyardjokes-sitemap-validator/1.0'])->head($loc);

                    if ($resp->successful()) {
                        $entries[] = $loc;
                        $this->info('OK: ' . $loc);
                        $summaryLines[] = sprintf('- %s — OK (%s)', $loc, $resp->status());
                        $passed++;
                        continue;
                    }

                    // Some servers don't respond to HEAD properly; try GET
                    $resp = Http::timeout(5)->get($loc);
                    if ($resp->successful()) {
                        $entries[] = $loc;
                        $this->info('OK (GET): ' . $loc);
                        $summaryLines[] = sprintf('- %s — OK (GET %s)', $loc, $resp->status());
                        $passed++;
                        continue;
                    }

                    $this->warn('Skipping (non-200): ' . $loc . ' [' . $resp->status() . ']');
                    $summaryLines[] = sprintf('- %s — Skipped (non-200: %s)', $loc, $resp->status());
                    $skipped++;
                } catch (\Exception $e) {
                    $this->warn('Skipping (error): ' . $loc . ' - ' . $e->getMessage());
                    $summaryLines[] = sprintf('- %s — Skipped (error: %s)', $loc, $e->getMessage());
                    $skipped++;
                }
            } else {
                $entries[] = $loc;
                $summaryLines[] = sprintf('- %s — Included (no validation)', $loc);
            }
        }

        if (empty($entries)) {
            $this->warn('No sitemap URLs passed validation; writing empty sitemap_index with primary sitemap candidate.');
            $entries = [$base . '/sitemap.xml'];
        }

        $xml = $this->buildIndexXml($entries);

        $path = public_path('sitemap_index.xml');

        try {
            $files->put($path, $xml);
            $this->info('✅ sitemap_index.xml written to ' . $path);
        } catch (\Exception $e) {
            $this->error('Failed to write sitemap_index.xml: ' . $e->getMessage());
            return 1;
        }

        // Write a human-readable summary into public/ so the workflow can include it in the PR body
        $summaryPath = public_path('sitemap_validation_summary.md');
        $summary = [];
        $summary[] = '# Sitemap validation summary';
        $summary[] = '';
        $summary[] = 'Generated: ' . now()->toIso8601String();
        $summary[] = '';
        $summary[] = 'Validation flag: ' . ($validate ? 'enabled' : 'disabled');
        $summary[] = '';
        $summary[] = "Results:";
        $summary[] = '';
        $summary = array_merge($summary, $summaryLines);
        $summary[] = '';
        $summary[] = sprintf('Passed: %d', $passed);
        $summary[] = sprintf('Skipped: %d', $skipped);
        $summary[] = '';
        $summary[] = '---';
        $summary[] = 'This file was generated automatically by `php artisan app:generate-sitemap-index`.';

        try {
            $files->put($summaryPath, implode("\n", $summary));
            $this->info('✅ sitemap validation summary written to ' . $summaryPath);
        } catch (\Exception $e) {
            $this->warn('Failed to write summary file: ' . $e->getMessage());
        }

        return 0;
    }

    protected function buildIndexXml(array $entries): string
    {
        $doc = new \DOMDocument('1.0', 'UTF-8');
        $doc->formatOutput = true;

        $root = $doc->createElement('sitemapindex');
        $root->setAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

        foreach ($entries as $loc) {
            $s = $doc->createElement('sitemap');
            $l = $doc->createElement('loc', htmlspecialchars($loc, ENT_XML1 | ENT_COMPAT, 'UTF-8'));
            $s->appendChild($l);
            $root->appendChild($s);
        }

        $doc->appendChild($root);

        return $doc->saveXML();
    }
}
