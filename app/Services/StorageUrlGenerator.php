<?php

namespace App\Services;

use App\Contracts\StorageUrlGeneratorInterface;

class StorageUrlGenerator implements StorageUrlGeneratorInterface
{
    /** @var mixed Underlying filesystem adapter (may be a FilesystemAdapter) */
    protected $disk;

    protected ?string $cloudfrontDomain;

    protected ?int $defaultExpires;

    /**
     * @param  mixed  $disk
     */
    public function __construct($disk, ?string $cloudfrontDomain = null, ?int $defaultExpires = null)
    {
        $this->disk = $disk;
        $this->cloudfrontDomain = $cloudfrontDomain;
        $this->defaultExpires = $defaultExpires ?? (int) env('VIDEO_URL_EXPIRES', 60);
    }

    /**
     * Return a public URL for a storage path, honoring testing proxy, temporaryUrl if available,
     * and optional CloudFront hostname rewrite.
     */
    public function url(string $path, ?int $expiresMinutes = null): string
    {
        // In testing, prefer the local proxy when either the configured filesystem is 'local',
        // when the injected disk does not support generating temporary/presigned URLs
        // (for example Storage::fake('s3') in unit tests), or when the disk's generated
        // URL points back to the application host (some fakes return app URLs). This preserves
        // integration behavior where a real 's3' disk (MinIO/AWS) can still produce presigned URLs.
        if (app()->environment('testing')) {
            // If default is local, always proxy
            if (config('filesystems.default') === 'local') {
                return url('/studio/video-log/serve?path='.rawurlencode($path));
            }

            // If the disk cannot produce temporary URLs, proxy
            if (! method_exists($this->disk, 'temporaryUrl')) {
                return url('/studio/video-log/serve?path='.rawurlencode($path));
            }

            // Otherwise, try to probe the disk's url/temporaryUrl to detect fakes that
            // return an application-hosted URL (e.g., https://studio.test/...). If so, use the proxy.
            try {
                $candidate = '';
                if (method_exists($this->disk, 'temporaryUrl')) {
                    $candidate = $this->disk->temporaryUrl($path, now()->addMinutes(5));
                } else {
                    $candidate = $this->disk->url($path);
                }

                if ($candidate) {
                    $parsedCandidate = parse_url((string) $candidate);
                    $appUrl = parse_url(config('app.url') ?: url('/'));

                    // If candidate includes presigned signature/query params, consider it a valid
                    // presigned URL and do NOT proxy (MinIO/AWS presigned URLs include signature-related query params).
                    if (isset($parsedCandidate['query'])) {
                        parse_str($parsedCandidate['query'], $candidateQs);
                        if (isset($candidateQs['X-Amz-Algorithm']) || isset($candidateQs['X-Amz-Signature']) || isset($candidateQs['Signature']) || isset($candidateQs['X-Amz-SignedHeaders']) || isset($candidateQs['X-Amz-Expires'])) {
                            // It's a presigned URL; use it.
                            // do nothing here — allow normal flow to use $candidate
                        } else {
                            // If no signature-like params and host matches app host, proxy
                            if (isset($parsedCandidate['host']) && isset($appUrl['host']) && $parsedCandidate['host'] === $appUrl['host']) {
                                return url('/studio/video-log/serve?path='.rawurlencode($path));
                            }
                        }
                    } else {
                        // No query — if host matches app host, treat as fake and proxy
                        if (isset($parsedCandidate['host']) && isset($appUrl['host']) && $parsedCandidate['host'] === $appUrl['host']) {
                            return url('/studio/video-log/serve?path='.rawurlencode($path));
                        }
                    }
                }
            } catch (\Throwable $e) {
                // If probing fails, fall back to proxy in testing to be safe for unit tests
                return url('/studio/video-log/serve?path='.rawurlencode($path));
            }
        }

        $expires = $expiresMinutes ?? $this->defaultExpires;

        try {
            if (method_exists($this->disk, 'temporaryUrl')) {
                $url = $this->disk->temporaryUrl($path, now()->addMinutes((int) $expires));
            } else {
                $url = $this->disk->url($path);
            }
        } catch (\Throwable $e) {
            try {
                $url = $this->disk->url($path);
            } catch (\Throwable $e) {
                $url = '';
            }
        }

        // If we have a URL and a CloudFront domain, rewrite the host.
        if ($this->cloudfrontDomain && $url) {
            $parsed = parse_url($url);
            if ($parsed && isset($parsed['scheme'])) {
                $scheme = $parsed['scheme'];
                $url = $scheme.'://'.rtrim($this->cloudfrontDomain, '/').(isset($parsed['path']) ? $parsed['path'] : '');
                if (isset($parsed['query'])) {
                    $url .= '?'.$parsed['query'];
                }
            }
        }

        // If we still don't have a URL (both temporaryUrl and url may have failed),
        // attempt to construct a reasonable S3-compatible URL using env vars.
        if (! $url) {
            $endpoint = env('AWS_ENDPOINT') ?: config('filesystems.disks.s3.endpoint') ?: '';
            $bucket = env('AWS_BUCKET') ?: config('filesystems.disks.s3.bucket') ?: '';

            if ($endpoint && $bucket) {
                // Normalize endpoint (remove trailing slash)
                $endpoint = rtrim($endpoint, '/');
                $pathPart = ltrim($path, '/');

                // If endpoint looks like a full URL, use it as base
                if (preg_match('#^https?://#', $endpoint)) {
                    // If path-style endpoints are used, include bucket in path
                    $usePathStyle = filter_var(env('AWS_USE_PATH_STYLE_ENDPOINT', config('filesystems.disks.s3.use_path_style_endpoint', false)), FILTER_VALIDATE_BOOLEAN);
                    if ($usePathStyle) {
                        $url = $endpoint.'/'.trim($bucket, '/').'/'.$pathPart;
                    } else {
                        // virtual-hosted style
                        $parsed = parse_url($endpoint);
                        $scheme = $parsed['scheme'] ?? 'https';
                        $host = $parsed['host'] ?? $endpoint;
                        $url = $scheme.'://'.$bucket.'.'.$host.'/'.$pathPart;
                    }
                } else {
                    // If endpoint isn't a URL, just join pieces
                    $url = $endpoint.'/'.trim($bucket, '/').'/'.$pathPart;
                }

                // If a CloudFront domain is configured, apply the rewrite now
                if ($this->cloudfrontDomain && $url) {
                    $parsed = parse_url($url);
                    $scheme = $parsed['scheme'] ?? 'https';
                    $url = $scheme.'://'.rtrim($this->cloudfrontDomain, '/').(isset($parsed['path']) ? $parsed['path'] : '');
                    if (isset($parsed['query'])) {
                        $url .= '?'.$parsed['query'];
                    }
                }
            }
        }

        // In local/non-production development, avoid returning insecure (http) or
        // IP-hosted URLs that would trigger mixed-content warnings when the app
        // is served over HTTPS. Instead, proxy such paths through the application
        // serve endpoint so the browser requests from the same origin (HTTPS).
        if ($url && ! app()->environment('production')) {
            try {
                $parsed = parse_url($url);
                $isInsecureScheme = isset($parsed['scheme']) && strtolower($parsed['scheme']) === 'http';
                $isIpHost = isset($parsed['host']) && preg_match('/^\d{1,3}(?:\.\d{1,3}){3}$/', $parsed['host']);

                if ($isInsecureScheme || $isIpHost) {
                    return url('/studio/video-log/serve?path='.rawurlencode($path));
                }
            } catch (\Throwable $e) {
                // ignore and fall through
            }
        }

        return $url ?: '';
    }
}
