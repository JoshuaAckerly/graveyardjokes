<?php

namespace App\Services;

use App\Contracts\StorageUrlGeneratorInterface;
use Illuminate\Support\Facades\Storage;

class IllustrationService
{
    protected $s3;

    protected string $prefix;

    protected ?string $cloudfrontDomain;

    protected StorageUrlGeneratorInterface $urlGenerator;

    /**
     * Backwards-compatible: first param may be the disk or the url generator.
     *
     * @param  mixed|null  $s3OrGenerator
     * @param  StorageUrlGenerator|null  $maybeGenerator
     */
    public function __construct($s3OrGenerator = null, ?StorageUrlGeneratorInterface $maybeGenerator = null)
    {
        if ($s3OrGenerator instanceof StorageUrlGeneratorInterface) {
            $this->urlGenerator = $s3OrGenerator;
            $this->s3 = Storage::disk('s3');
        } else {
            $this->s3 = $s3OrGenerator ?? Storage::disk('s3');
            $this->urlGenerator = $maybeGenerator ?? new StorageUrlGenerator($this->s3, env('CLOUDFRONT_DOMAIN') ?: null);
        }

        // Enforce canonical prefix: trim whitespace, normalize leading/trailing slashes,
        // and ensure lowercase to avoid case-sensitive S3 surprises.
        $raw = config('media.illustrations_prefix', 'images/illustrations');
        $normalized = trim($raw);
        $normalized = ltrim($normalized, '/\\');
        if ($normalized === '') {
            $normalized = 'images/illustrations';
        }
        $normalized = strtolower($normalized);
        if (! str_ends_with($normalized, '/')) {
            $normalized = $normalized.'/';
        }
        $this->prefix = $normalized;
        $this->cloudfrontDomain = config('media.cloudfront_domain') ?: null;
    }

    /**
     * Return a list of illustration URLs (strings).
     */
    public function list(): array
    {
        try {
            $files = $this->s3->files($this->prefix) ?: [];
        } catch (\Throwable $e) {
            return [];
        }

        $images = array_values(array_filter($files, function ($f) {
            return preg_match('/\.(jpg|jpeg|png|webp|gif)$/i', $f);
        }));

        $items = [];
        foreach ($images as $file) {
            $items[] = $this->makeUrl($file);
        }

        return $items;
    }

    protected function makeUrl(string $path): string
    {
        return $this->urlGenerator->url($path);
    }
}
