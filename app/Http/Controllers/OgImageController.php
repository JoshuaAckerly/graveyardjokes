<?php

namespace App\Http\Controllers;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class OgImageController
{
    /**
     * Fetch an Open Graph or representative image for the provided URL.
     * Stores it on the public disk under `og-cache/` and returns the public URL.
     *
     * Query param: url (required) - the site to fetch.
     */
    public function fetch(Request $request): JsonResponse
    {
        $request->validate([
            'url' => 'required|string|max:2048|url',
        ]);

        $target = $request->query('url');

        $targetAddress = $this->validatedPublicTarget($target);
        if ($targetAddress === null) {
            return response()->json(['error' => 'Invalid target host'], 422);
        }

        // Rate limiting check
        $cacheKey = 'og_fetch_'.md5($target);
        if (Cache::has($cacheKey)) {
            return response()->json(['error' => 'Rate limited - try again later'], 429);
        }
        Cache::put($cacheKey, true, 300); // 5 minute rate limit

        try {
            // Fetch page HTML
            /** @var Response $resp */
            $resp = $this->requestFor($targetAddress, 6)->get($target);

            if (! $resp->successful()) {
                return response()->json(['error' => 'Failed to fetch target page', 'status' => $resp->status()], 502);
            }

            $html = $resp->body();

            // Parse for og:image using DOMDocument
            libxml_use_internal_errors(true);
            $doc = new \DOMDocument;
            $doc->loadHTML($html);
            $xpath = new \DOMXPath($doc);

            $ogImage = null;

            // Look for <meta property="og:image" content="...">
            $meta = $xpath->query("//meta[@property='og:image' or @name='og:image']");
            if ($meta !== false && $meta->length > 0) {
                $node = $meta->item(0);
                if ($node instanceof \DOMElement) {
                    $ogImage = $node->getAttribute('content');
                }
            }

            // Fallback: find candidate <img> tags and pick the first reasonably-sized src
            if (! $ogImage) {
                $imgs = $xpath->query('//img[@src]');
                if ($imgs !== false) {
                    for ($i = 0; $i < $imgs->length; $i++) {
                        $node = $imgs->item($i);
                        if ($node instanceof \DOMElement) {
                            $src = $node->getAttribute('src');
                            if ($src && ! Str::startsWith($src, 'data:')) {
                                $ogImage = $src;
                                break;
                            }
                        }
                    }
                }
            }

            if (! $ogImage) {
                return response()->json(['error' => 'No image found on target page'], 404);
            }

            // Resolve relative URLs
            $imgUrl = $this->resolveUrl($ogImage, $target);

            $imageAddress = $this->validatedPublicTarget($imgUrl);
            if ($imageAddress === null) {
                return response()->json(['error' => 'Invalid image host'], 422);
            }

            // Fetch image
            /** @var Response $imgResp */
            $imgResp = $this->requestFor($imageAddress, 10)->get($imgUrl);
            if (! $imgResp->successful()) {
                return response()->json(['error' => 'Failed to download image', 'status' => $imgResp->status()], 502);
            }

            $contentType = strtolower(trim(explode(';', (string) ($imgResp->header('Content-Type') ?: ''), 2)[0]));
            $extension = $this->extensionFromContentType($contentType);
            if ($extension === null) {
                return response()->json(['error' => 'Downloaded resource is not an image', 'content-type' => $contentType], 422);
            }

            $body = $imgResp->body();
            if (empty($body) || strlen($body) < 1000) {
                // Likely an icon or tiny image; still allow but warn
                // You can change this threshold as needed
            }

            // Determine extension
            $hash = substr(md5($imgUrl), 0, 16);
            $filename = "og-cache/{$hash}.{$extension}";

            Storage::disk('public')->put($filename, $body);

            $publicUrl = route('api.og-cache.show', ['filename' => basename($filename)]);

            return response()->json(['url' => $publicUrl]);
        } catch (\Exception $e) {
            Log::error('OG image fetch failed: '.$e->getMessage(), ['url' => $target ?? 'unknown']);

            return response()->json(['error' => 'Failed to fetch image'], 500);
        }
    }

    public function cached(string $filename): BinaryFileResponse|\Illuminate\Http\Response
    {
        if (! preg_match('/^[A-Za-z0-9._-]+$/', $filename)) {
            abort(404);
        }

        $storagePath = "og-cache/{$filename}";
        if (! Storage::disk('public')->exists($storagePath)) {
            $label = pathinfo($filename, PATHINFO_FILENAME);
            $safeLabel = preg_replace('/[^A-Za-z0-9.-]/', ' ', (string) $label) ?: 'Project Preview';
            $svg = <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720" role="img" aria-label="{$safeLabel}">
    <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#1e293b"/>
        </linearGradient>
    </defs>
    <rect width="1280" height="720" fill="url(#bg)"/>
    <g fill="#94a3b8" font-family="Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" text-anchor="middle">
        <text x="640" y="342" font-size="40" font-weight="600">Preview Unavailable</text>
        <text x="640" y="392" font-size="26">{$safeLabel}</text>
    </g>
</svg>
SVG;

            return response($svg, 200, [
                'Content-Type' => 'image/svg+xml; charset=UTF-8',
                'Cache-Control' => 'public, max-age=3600',
            ]);
        }

        $absolutePath = Storage::disk('public')->path($storagePath);

        return response()->file($absolutePath, [
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }

    /**
     * @return array{host: string, port: int, resolve: ?string}|null
     */
    private function validatedPublicTarget(string $url): ?array
    {
        $parts = parse_url($url);
        $host = strtolower((string) ($parts['host'] ?? ''));
        $scheme = strtolower((string) ($parts['scheme'] ?? ''));
        $port = $parts['port'] ?? ($scheme === 'https' ? 443 : 80);

        if (
            $host === ''
            || str_ends_with($host, '.')
            || $host === 'localhost'
            || str_ends_with($host, '.localhost')
            || str_ends_with($host, '.local')
            || str_ends_with($host, '.test')
            || ! in_array($scheme, ['http', 'https'], true)
            || isset($parts['user'])
            || isset($parts['pass'])
            || ! in_array([$scheme, $port], [['http', 80], ['https', 443]], true)
        ) {
            return null;
        }

        if (filter_var($host, FILTER_VALIDATE_IP)) {
            $addresses = [$host];
        } elseif (app()->runningUnitTests()) {
            return ['host' => $host, 'port' => $port, 'resolve' => null];
        } else {
            if (! extension_loaded('curl')) {
                throw new \RuntimeException('Secure external image fetching requires the PHP cURL extension.');
            }

            $records = dns_get_record($host, DNS_A | DNS_AAAA);
            $addresses = [];

            foreach ($records ?: [] as $record) {
                if (is_string($record['ip'] ?? null)) {
                    $addresses[] = $record['ip'];
                }
                if (is_string($record['ipv6'] ?? null)) {
                    $addresses[] = $record['ipv6'];
                }
            }
        }

        if ($addresses === []) {
            return null;
        }

        foreach ($addresses as $address) {
            if (! filter_var($address, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                return null;
            }
        }

        $resolve = null;
        if (! filter_var($host, FILTER_VALIDATE_IP)) {
            $address = $addresses[0];
            $curlAddress = str_contains($address, ':') ? "[{$address}]" : $address;
            $resolve = "{$host}:{$port}:{$curlAddress}";
        }

        return ['host' => $host, 'port' => $port, 'resolve' => $resolve];
    }

    /**
     * @param  array{host: string, port: int, resolve: ?string}  $address
     */
    private function requestFor(array $address, int $timeout): PendingRequest
    {
        $options = ['allow_redirects' => false];
        if ($address['resolve'] !== null) {
            $options['curl'] = [CURLOPT_RESOLVE => [$address['resolve']]];
        }

        return Http::withOptions($options)
            ->withHeaders(['User-Agent' => 'GraveyardJokesBot/1.0'])
            ->timeout($timeout);
    }

    /**
     * Resolve a possibly-relative URL against a base.
     */
    protected function resolveUrl(string $maybeRelative, string $base): string
    {
        // If already absolute
        if (Str::startsWith($maybeRelative, ['http://', 'https://'])) {
            return $maybeRelative;
        }

        // If protocol-relative
        if (Str::startsWith($maybeRelative, '//')) {
            $scheme = parse_url($base, PHP_URL_SCHEME) ?: 'https';

            return $scheme.':'.$maybeRelative;
        }

        // Otherwise join
        $baseParts = parse_url($base);
        $scheme = $baseParts['scheme'] ?? 'https';
        $host = $baseParts['host'] ?? '';
        $port = isset($baseParts['port']) ? ":{$baseParts['port']}" : '';
        $path = $baseParts['path'] ?? '/';

        // If relative path starts with /, use root
        if (Str::startsWith($maybeRelative, '/')) {
            $joined = "{$scheme}://{$host}{$port}".$maybeRelative;

            return $joined;
        }

        // Otherwise remove filename from base path
        $dir = preg_replace('#/[^/]*$#', '/', $path);
        $dirStr = is_string($dir) ? $dir : '/';
        $joined = "{$scheme}://{$host}{$port}".rtrim($dirStr, '/').'/'.ltrim($maybeRelative, '/');

        return $joined;
    }

    protected function extensionFromContentType(string $ct): ?string
    {
        $map = [
            'image/jpeg' => 'jpg',
            'image/jpg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            'image/gif' => 'gif',
        ];

        return $map[$ct] ?? null;
    }
}
