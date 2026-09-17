<?php

namespace App\Console\Commands;

use App\Models\InstagramPost;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class CacheInstagramThumbnails extends Command
{
    protected $signature = 'instagram:cache-thumbnails
                            {--force : Re-cache thumbnails even if already on S3}';

    protected $description = 'Download Instagram media to S3 so URLs never expire';

    private const GRAPH = 'https://graph.facebook.com/v22.0';

    public function handle(): int
    {
        $token = config('services.instagram.access_token');
        $userId = config('services.instagram.user_id');

        if (empty($token) || empty($userId)) {
            $this->error('INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_USER_ID must be set.');

            return self::FAILURE;
        }

        $client = new Client(['timeout' => 30, 'http_errors' => false]);

        $query = InstagramPost::query();
        if (! $this->option('force')) {
            $cloudfrontDomain = (string) config('media.cloudfront_domain', '');
            $s3Domain = 'amazonaws.com';
            $query->where(function ($q) use ($cloudfrontDomain, $s3Domain) {
                $q->whereNull('thumbnail_url')
                    ->orWhere(function ($q2) use ($cloudfrontDomain, $s3Domain) {
                        if ($cloudfrontDomain) {
                            $q2->whereNot('thumbnail_url', 'like', "%{$cloudfrontDomain}%");
                        }
                        $q2->whereNot('thumbnail_url', 'like', "%{$s3Domain}%");
                    });
            });
        }

        $posts = $query->get();

        if ($posts->isEmpty()) {
            $this->info('No posts need thumbnail caching.');

            return self::SUCCESS;
        }

        $this->info("Caching thumbnails for {$posts->count()} post(s)…");
        $bar = $this->output->createProgressBar($posts->count());
        $updated = 0;
        $failed = 0;

        $bar->start();

        foreach ($posts as $post) {
            // Fetch fresh URLs from Graph API — stored URLs expire in ~48h
            $freshUrls = $this->fetchFreshUrls($client, $token, $post->instagram_id);

            $thumbSource = $freshUrls['thumbnail_url'] ?? $freshUrls['media_url'] ?? $post->thumbnail_url;
            $mediaSource = $freshUrls['media_url'] ?? $post->media_url;

            if (empty($thumbSource)) {
                $this->newLine();
                $this->warn("No thumbnail source for post #{$post->id} ({$post->instagram_id})");
                $failed++;
                $bar->advance();

                continue;
            }

            $s3Thumb = $this->cacheToS3($client, $thumbSource, $post->id, 'thumb');
            $s3Media = ($mediaSource && $mediaSource !== $thumbSource)
                ? $this->cacheToS3($client, $mediaSource, $post->id, 'media')
                : $s3Thumb;

            if ($s3Thumb) {
                $post->update([
                    'thumbnail_url' => $s3Thumb,
                    'media_url' => $s3Media ?? $post->media_url,
                ]);
                $updated++;
            } else {
                $failed++;
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info("Done. Updated: {$updated}, Failed: {$failed}");

        Cache::forget('instagram.api');

        return $failed === 0 ? self::SUCCESS : self::FAILURE;
    }

    /** @return array<string, string|null> */
    private function fetchFreshUrls(Client $client, string $token, string $instagramId): array
    {
        try {
            $response = $client->get(self::GRAPH."/{$instagramId}", [
                'query' => [
                    'fields' => 'media_url,thumbnail_url,media_type',
                    'access_token' => $token,
                ],
            ]);

            $data = json_decode((string) $response->getBody(), true);

            if (isset($data['error'])) {
                $this->newLine();
                $this->warn("API error for {$instagramId}: {$data['error']['message']}");

                return [];
            }

            return [
                'media_url' => $data['media_url'] ?? null,
                'thumbnail_url' => $data['thumbnail_url'] ?? null,
            ];
        } catch (RequestException $e) {
            $this->newLine();
            $this->warn("Request failed for {$instagramId}: ".$e->getMessage());

            return [];
        }
    }

    private function cacheToS3(Client $client, string $sourceUrl, int $postId, string $type): ?string
    {
        try {
            $response = $client->get($sourceUrl);

            if ($response->getStatusCode() !== 200) {
                $this->newLine();
                $this->warn("HTTP {$response->getStatusCode()} downloading {$type} for post #{$postId}");

                return null;
            }

            $contents = (string) $response->getBody();
            $contentType = $response->getHeaderLine('Content-Type');
            $ext = match (true) {
                str_contains($contentType, 'mp4') => 'mp4',
                str_contains($contentType, 'png') => 'png',
                str_contains($contentType, 'webp') => 'webp',
                default => 'jpg',
            };

            $s3Key = "studio/images/instagram/post-{$postId}-{$type}.{$ext}";

            $ok = Storage::disk('s3')->put($s3Key, $contents, [
                'ContentType' => $contentType ?: 'image/jpeg',
            ]);

            if (! $ok) {
                $this->newLine();
                $this->warn("S3 upload failed for post #{$postId} ({$type}) — check AWS credentials.");

                return null;
            }

            $cloudfront = config('media.cloudfront_domain');
            if (is_string($cloudfront) && $cloudfront !== '') {
                return 'https://'.$cloudfront.'/'.$s3Key;
            }

            return Storage::disk('s3')->url($s3Key);
        } catch (\Throwable $e) {
            $this->newLine();
            $this->warn("Could not cache {$type} for post #{$postId}: ".$e->getMessage());

            return null;
        }
    }
}
