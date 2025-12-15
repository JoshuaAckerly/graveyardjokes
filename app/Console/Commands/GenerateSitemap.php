<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class GenerateSitemap extends Command
{
    protected $signature = 'app:generate-sitemap';
    protected $description = 'Generate sitemap.xml for the main site';

    public function handle(): int
    {
        $this->info('Generating sitemap.xml...');

        $rawBase = config('app.url', '');
        if (!is_string($rawBase)) {
            $rawBase = '';
        }
        $base = rtrim($rawBase, '/');

        Sitemap::create()
            ->add(Url::create($base . '/'))
            ->add(Url::create($base . '/about'))
            ->add(Url::create($base . '/contact'))
            ->add(Url::create($base . '/portfolio'))
            ->add(Url::create($base . '/services'))
            ->add(Url::create($base . '/services/starter'))
            ->add(Url::create($base . '/services/professional'))
            ->add(Url::create($base . '/services/premium'))
            ->add(Url::create($base . '/terms'))
            ->add(Url::create($base . '/privacy'))
            ->add(Url::create($base . '/cookies'))
            ->writeToFile(public_path('sitemap.xml'));

        $this->info('✅ sitemap.xml written to ' . public_path('sitemap.xml'));

        return 0;
    }
}
