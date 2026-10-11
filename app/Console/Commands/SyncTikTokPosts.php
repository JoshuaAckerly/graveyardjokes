<?php

namespace App\Console\Commands;

use App\Models\TikTokVideo;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class SyncTikTokPosts extends Command
{
    protected $signature = 'tiktok:sync-posts
                            {--limit=20 : Max videos to fetch}
                            {--dry-run : Show what would be imported without saving}';

    protected $description = 'Sync your TikTok videos via the TikTok Content API (requires TIKTOK_ACCESS_TOKEN)';

    private const API = 'https://open.tiktokapis.com/v2';

    public function handle(): int
    {
        $accessToken = config('services.tiktok.access_token');

        if (! is_string($accessToken) || $accessToken === '') {
            $this->error('TIKTOK_ACCESS_TOKEN must be set to a non-empty string.');
            $this->line('');
            $this->line('To set up:');
            $this->line('  1. Go to https://developers.tiktok.com and create an app.');
            $this->line('  2. Enable the "Video Query" scope.');
            $this->line('  3. Complete the OAuth flow to get an access token.');
            $this->line('  4. Set TIKTOK_ACCESS_TOKEN in your .env.');
            $this->line('');
            $this->line('Alternatively, import individual videos by URL:');
            $this->line('  php artisan tiktok:fetch-thumbnails --import=https://www.tiktok.com/@graveyardjokes/video/ID');

            return self::FAILURE;
        }

        $limit = (int) $this->option('limit');
        $dryRun = (bool) $this->option('dry-run');
        $client = new Client(['timeout' => 20, 'http_errors' => false]);

        $this->info("Fetching up to {$limit} TikTok videos…");

        try {
            $response = $client->post(self::API.'/video/list/', [
                'headers' => [
                    'Authorization' => '******',
                    'Content-Type' => 'application/json',
                ],
                'json' => [
                    'fields' => 'id,title,video_description,cover_image_url,create_time,share_url',
                    'max_count' => min($limit, 20),
                ],
            ]);
        } catch (RequestException $e) {
            $this->error('TikTok API request failed: '.$e->getMessage());

            return self::FAILURE;
        }

        $body = json_decode((string) $response->getBody(), true);
        if (! is_array($body)) {
            $this->error('TikTok API returned malformed JSON or a non-object response.');

            return self::FAILURE;
        }

        $error = $body['error'] ?? null;
        if ($error !== null) {
            if (! is_array($error)) {
                $this->error('TikTok API returned a malformed error payload.');

                return self::FAILURE;
            }
            $errorCode = $error['code'] ?? null;
            $errorMessage = $error['message'] ?? null;
            if (! is_string($errorCode) || ! is_string($errorMessage)) {
                $this->error('TikTok API returned an incomplete error payload.');

                return self::FAILURE;
            }
            if ($errorCode !== 'ok') {
                $this->error("TikTok API error: {$errorMessage}");

                return self::FAILURE;
            }
        }

        $data = $body['data'] ?? null;
        if (! is_array($data)) {
            $this->error('TikTok API response is missing a valid data object.');

            return self::FAILURE;
        }
        $rawVideos = $data['videos'] ?? null;
        if (! is_array($rawVideos) || ! array_is_list($rawVideos)) {
            $this->error('TikTok API response is missing a valid videos array.');

            return self::FAILURE;
        }

        if ($rawVideos === []) {
            $this->info('No videos returned.');

            return self::SUCCESS;
        }

        $imported = 0;
        $skipped = 0;

        foreach ($rawVideos as $rawVideo) {
            $video = $this->normalizeVideo($rawVideo);
            if ($video === null) {
                $skipped++;

                continue;
            }
            $videoId = $video['id'];

            if (! $dryRun && TikTokVideo::where('tiktok_video_id', $videoId)->exists()) {
                $skipped++;

                continue;
            }

            if ($dryRun) {
                $this->line("  [dry-run] {$videoId}: ".substr($video['title'] ?? '', 0, 80));
                $imported++;

                continue;
            }

            $thumbnailUrl = $this->cacheThumbnail($video['cover_image_url'], $videoId);

            TikTokVideo::create([
                'tiktok_video_id' => $videoId,
                'post_type' => 'video',
                'title' => $video['title'] ?? 'TikTok Video',
                'description' => $video['video_description'],
                'thumbnail_url' => $thumbnailUrl ?? $video['cover_image_url'],
                'posted_at' => $video['create_time'] !== null ? date('Y-m-d', $video['create_time']) : null,
                'is_active' => true,
                'sort_order' => 0,
            ]);
            $imported++;
        }

        $this->info("Done. Imported: {$imported}, Skipped: {$skipped}");

        if (! $dryRun) {
            Cache::forget('video-log.api');
        }

        return self::SUCCESS;
    }

    /**
     * @return array{
     *     id: string,
     *     title: ?string,
     *     video_description: ?string,
     *     cover_image_url: ?string,
     *     create_time: ?int
     * }|null
     */
    private function normalizeVideo(mixed $video): ?array
    {
        if (! is_array($video)) {
            $this->warn('Skipping malformed TikTok video: expected an object.');

            return null;
        }

        $rawId = $video['id'] ?? null;
        if (! is_string($rawId) && ! is_int($rawId)) {
            $this->warn('Skipping malformed TikTok video without a string or integer id.');

            return null;
        }
        $id = (string) $rawId;
        if ($id === '') {
            $this->warn('Skipping malformed TikTok video with an empty id.');

            return null;
        }

        $createTime = $video['create_time'] ?? null;
        if ($createTime !== null && ! is_int($createTime)) {
            $this->warn("Ignoring malformed create_time for TikTok video {$id}.");
            $createTime = null;
        }

        return [
            'id' => $id,
            'title' => $this->optionalString($video, 'title', $id),
            'video_description' => $this->optionalString($video, 'video_description', $id),
            'cover_image_url' => $this->optionalString($video, 'cover_image_url', $id),
            'create_time' => $createTime,
        ];
    }

    /**
     * @param  array<string|int, mixed>  $video
     */
    private function optionalString(array $video, string $key, string $videoId): ?string
    {
        $value = $video[$key] ?? null;
        if ($value === null) {
            return null;
        }
        if (! is_string($value)) {
            $this->warn("Ignoring non-string {$key} for TikTok video {$videoId}.");

            return null;
        }

        return $value;
    }

    private function cacheThumbnail(?string $url, string $videoId): ?string
    {
        if (! $url) {
            return null;
        }

        $s3Path = "tiktok-thumbnails/{$videoId}.jpg";

        try {
            if (Storage::disk('s3')->exists($s3Path)) {
                return $this->cdnUrl($s3Path);
            }
        } catch (\Throwable) {
        }

        try {
            $client = new Client(['timeout' => 15, 'http_errors' => false]);
            $response = $client->get($url);
            if ($response->getStatusCode() === 200) {
                Storage::disk('s3')->put($s3Path, (string) $response->getBody());

                return $this->cdnUrl($s3Path);
            }
        } catch (\Throwable $e) {
            $this->warn("Could not cache thumbnail for {$videoId}: {$e->getMessage()}");
        }

        return null;
    }

    private function cdnUrl(string $path): string
    {
        $cloudfront = config('media.cloudfront_domain');
        if ($cloudfront !== null && ! is_string($cloudfront)) {
            $this->warn('Ignoring non-string media.cloudfront_domain configuration.');
            $cloudfront = null;
        }

        return $cloudfront
            ? 'https://'.rtrim($cloudfront, '/').'/'.ltrim($path, '/')
            : Storage::disk('s3')->url($path);
    }
}
