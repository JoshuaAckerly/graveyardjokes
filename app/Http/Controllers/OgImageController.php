<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Http\JsonResponse;

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
            'url' => 'required|string|max:2048|url'
        ]);
        
        $target = $request->query('url');
        
        // SSRF protection - block private/local addresses
        $host = parse_url($target, PHP_URL_HOST);
        if (!$host || $this->isPrivateAddress($host)) {
            return response()->json(['error' => 'Invalid target host'], 422);
        }
        
        // Rate limiting check
        $cacheKey = 'og_fetch_' . md5($target);
        if (Cache::has($cacheKey)) {
            return response()->json(['error' => 'Rate limited - try again later'], 429);
        }
        Cache::put($cacheKey, true, 300); // 5 minute rate limit

        try {
            // Fetch page HTML
            $resp = Http::withHeaders([
                'User-Agent' => 'GraveyardJokesBot/1.0',
            ])->timeout(6)->get($target);

            if (!$resp->successful()) {
                return response()->json(['error' => 'Failed to fetch target page', 'status' => $resp->status()], 502);
            }

            $html = $resp->body();

            // Parse for og:image using DOMDocument
            libxml_use_internal_errors(true);
            $doc = new \DOMDocument();
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
            if (!$ogImage) {
                $imgs = $xpath->query('//img[@src]');
                if ($imgs !== false) {
                    for ($i = 0; $i < $imgs->length; $i++) {
                    $node = $imgs->item($i);
                    if ($node instanceof \DOMElement) {
                        $src = $node->getAttribute('src');
                        if ($src && !Str::startsWith($src, 'data:')) {
                            $ogImage = $src;
                            break;
                        }
                    }
                }
                }
            }

            if (!$ogImage) {
                return response()->json(['error' => 'No image found on target page'], 404);
            }

            // Resolve relative URLs
            $imgUrl = $this->resolveUrl($ogImage, $target);

            // Fetch image
            $imgResp = Http::withHeaders(['User-Agent' => 'GraveyardJokesBot/1.0'])->timeout(10)->get($imgUrl);
            if (!$imgResp->successful()) {
                return response()->json(['error' => 'Failed to download image', 'status' => $imgResp->status()], 502);
            }

            $contentType = (string) ($imgResp->header('Content-Type') ?? 'image/jpeg');
            if (!Str::startsWith($contentType, 'image/')) {
                return response()->json(['error' => 'Downloaded resource is not an image', 'content-type' => $contentType], 422);
            }

            $body = $imgResp->body();
            if (empty($body) || strlen($body) < 1000) {
                // Likely an icon or tiny image; still allow but warn
                // You can change this threshold as needed
            }

            // Determine extension
            $urlPath = parse_url($imgUrl, PHP_URL_PATH);
            $pathExtension = is_string($urlPath) && $urlPath !== '' ? pathinfo($urlPath, PATHINFO_EXTENSION) : '';
            $ext = $this->extensionFromContentType($contentType) ?: ($pathExtension ?: 'jpg');
            $hash = substr(md5($imgUrl), 0, 16);
            $filename = "og-cache/{$hash}.{$ext}";

            Storage::disk('public')->put($filename, $body);

            $publicUrl = Storage::url($filename);

            return response()->json(['url' => $publicUrl]);
        } catch (\Exception $e) {
            Log::error('OG image fetch failed: ' . $e->getMessage(), ['url' => $target ?? 'unknown']);
            return response()->json(['error' => 'Failed to fetch image'], 500);
        }
    }
    
    private function isPrivateAddress(string $host): bool
    {
        $ip = gethostbyname($host);
        return !filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE);
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
            return $scheme . ':' . $maybeRelative;
        }

        // Otherwise join
        $baseParts = parse_url($base);
        $scheme = $baseParts['scheme'] ?? 'https';
        $host = $baseParts['host'] ?? '';
        $port = isset($baseParts['port']) ? ":{$baseParts['port']}" : '';
        $path = $baseParts['path'] ?? '/';

        // If relative path starts with /, use root
        if (Str::startsWith($maybeRelative, '/')) {
            $joined = "{$scheme}://{$host}{$port}" . $maybeRelative;
            return $joined;
        }

        // Otherwise remove filename from base path
        $dir = preg_replace('#/[^/]*$#', '/', $path);
        $dirStr = is_string($dir) ? $dir : '/';
        $joined = "{$scheme}://{$host}{$port}" . rtrim($dirStr, '/') . '/' . ltrim($maybeRelative, '/');
        return $joined;
    }

    /**
     * @param string $ct
     * @return string|null
     */
    protected function extensionFromContentType(string $ct): ?string
    {
        $map = [
            'image/jpeg' => 'jpg',
            'image/jpg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            'image/gif' => 'gif',
            'image/svg+xml' => 'svg',
        ];

        return $map[$ct] ?? null;
    }
}
