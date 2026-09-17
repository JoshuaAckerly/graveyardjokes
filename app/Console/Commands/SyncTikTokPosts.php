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

        if (empty($accessToken)) {
            $this->error('TIKTOK_ACCESS_TOKEN is not set.');
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
        $dryRun = $this->option('dry-run');
        $client = new Client(['timeout' => 20, 'http_errors' => false]);

        $this->info("Fetching up to {$limit} TikTok videos…");

        try {
            $response = $client->post(self::API.'/video/list/', [
                'headers' => [
                    'Authorization' => "Bearer {$accessToken}",
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

        if (! empty($body['error']['code']) && $body['error']['code'] !== 'ok') {
            $this->error("TikTok API error: {$body['error']['message']}");

            return self::FAILURE;
        }

        $videos = $body['data']['videos'] ?? [];

        if (empty($videos)) {
            $this->info('No videos returned.');

            return self::SUCCESS;
        }

        $username = config('services.tiktok.username', 'graveyardjokes');
        $imported = 0;
        $skipped = 0;

        foreach ($videos as $video) {
            $videoId = (string) $video['id'];

            if (! $dryRun && TikTokVideo::where('tiktok_video_id', $videoId)->exists()) {
                $skipped++;

                continue;
            }

            if ($dryRun) {
                $this->line("  [dry-run] {$videoId}: ".substr($video['title'] ?? '', 0, 80));
                $imported++;

                continue;
            }

            $thumbnailUrl = $this->cacheThumbnail($video['cover_image_url'] ?? null, $videoId);

            TikTokVideo::create([
                'tiktok_video_id' => $videoId,
                'post_type' => 'video',
                'title' => $video['title'] ?? 'TikTok Video',
                'description' => $video['video_description'] ?? null,
                'thumbnail_url' => $thumbnailUrl ?? ($video['cover_image_url'] ?? null),
                'posted_at' => isset($video['create_time']) ? date('Y-m-d', $video['create_time']) : null,
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

        return $cloudfront
            ? 'https://'.rtrim($cloudfront, '/').'/'.ltrim($path, '/')
            : Storage::disk('s3')->url($path);
    }
}
