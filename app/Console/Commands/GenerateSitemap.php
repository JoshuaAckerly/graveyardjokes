<?php

namespace App\Console\Commands;

use App\Models\PageSeo;
use Illuminate\Console\Command;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class GenerateSitemap extends Command
{
    protected $signature = 'app:generate-sitemap {--url= : The base URL to use for the sitemap}';

    protected $description = 'Generate sitemap.xml for the main site';

    public function handle(): int
    {
        $this->info('Generating sitemap.xml...');

        $baseUrl = $this->option('url') ?: config('app.url', '');
        if (! is_string($baseUrl)) {
            $baseUrl = '';
        }
        $base = rtrim($baseUrl, '/');

        // Paths marked noindex in the DB should be excluded from the sitemap
        $noindexPaths = PageSeo::where('robots', 'like', '%noindex%')
            ->pluck('page_url')
            ->map(fn (mixed $p) => rtrim((string) $p, '/'))
            ->all();

        $shouldInclude = function (string $path) use ($base, $noindexPaths): bool {
            $stripped = str_replace($base, '', rtrim($path, '/'));

            return ! in_array($stripped, $noindexPaths, true);
        };

        $sitemap = Sitemap::create();

        $entries = [
            // Core pages
            [$base.'/', 1.0, Url::CHANGE_FREQUENCY_WEEKLY],
            [$base.'/about', 0.7, Url::CHANGE_FREQUENCY_MONTHLY],
            [$base.'/contact', 0.6, Url::CHANGE_FREQUENCY_MONTHLY],
            [$base.'/portfolio', 0.8, Url::CHANGE_FREQUENCY_MONTHLY],
            [$base.'/studio', 0.5, Url::CHANGE_FREQUENCY_MONTHLY],
            // Services overview + pricing tiers
            [$base.'/services', 0.9, Url::CHANGE_FREQUENCY_MONTHLY],
            [$base.'/services/starter', 0.8, Url::CHANGE_FREQUENCY_MONTHLY],
            [$base.'/services/professional', 0.8, Url::CHANGE_FREQUENCY_MONTHLY],
            [$base.'/services/premium', 0.8, Url::CHANGE_FREQUENCY_MONTHLY],
            // Design service detail pages
            [$base.'/services/design-starter', 0.7, Url::CHANGE_FREQUENCY_MONTHLY],
            [$base.'/services/design-professional', 0.7, Url::CHANGE_FREQUENCY_MONTHLY],
            [$base.'/services/design-premium', 0.7, Url::CHANGE_FREQUENCY_MONTHLY],
            // Modernization service detail pages
            [$base.'/services/modernization-starter', 0.7, Url::CHANGE_FREQUENCY_MONTHLY],
            [$base.'/services/modernization-professional', 0.7, Url::CHANGE_FREQUENCY_MONTHLY],
            [$base.'/services/modernization-premium', 0.7, Url::CHANGE_FREQUENCY_MONTHLY],
            // Legal pages
            [$base.'/terms', 0.3, Url::CHANGE_FREQUENCY_YEARLY],
            [$base.'/privacy', 0.3, Url::CHANGE_FREQUENCY_YEARLY],
            [$base.'/cookies', 0.3, Url::CHANGE_FREQUENCY_YEARLY],
        ];

        foreach ($entries as [$url, $priority, $changeFreq]) {
            if ($shouldInclude($url)) {
                $sitemap->add(Url::create($url)->setPriority($priority)->setChangeFrequency($changeFreq));
            }
        }

        $sitemap->writeToFile(public_path('sitemap.xml'));

        $this->info('✅ sitemap.xml written to '.public_path('sitemap.xml'));

        return 0;
    }
}
