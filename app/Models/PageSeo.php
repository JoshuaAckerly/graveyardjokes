<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageSeo extends Model
{
    protected $connection = 'auth';

    protected $fillable = [
        'project',
        'page_key',
        'page_label',
        'page_url',
        'title',
        'meta_description',
        'canonical_url',
        'robots',
        'og_title',
        'og_description',
        'og_image',
        'og_type',
        'twitter_card',
        'twitter_title',
        'twitter_description',
        'twitter_image',
        'schema_json',
        'sitemap_priority',
        'sitemap_change_freq',
    ];

    protected $casts = [
        'schema_json' => 'array',
        'sitemap_priority' => 'float',
    ];

    public function isNoindex(): bool
    {
        return str_contains($this->robots ?? '', 'noindex');
    }

    public static function forPath(string $path, string $project = 'graveyardjokes'): ?self
    {
        $normalised = '/' . ltrim($path, '/');

        return self::where('project', $project)
            ->where('page_url', $normalised)
            ->first();
    }
}
