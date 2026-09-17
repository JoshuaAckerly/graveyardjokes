<?php

namespace App\Console\Commands;

use App\Models\TikTokVideo;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class FetchTikTokThumbnails extends Command
{
    protected $signature = 'tiktok:fetch-thumbnails
                            {--force : Re-fetch thumbnails even if already set}
                            {--import=* : TikTok video URLs to import (e.g. https://www.tiktok.com/@user/video/123)}';

    protected $description = 'Fetch thumbnails for TikTok videos via the oEmbed API, optionally importing new ones';

    public function handle(): int
    {
        $username = config('services.tiktok.username', 'graveyardjokes');
        $client = new Client([
            'timeout' => 15,
            'allow_redirects' => true,
            'http_errors' => false,
            'headers' => [
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            ],
        ]);

        // --import: add new video URLs before fetching thumbnails
        $importUrls = $this->option('import');
        if ($importUrls) {
            $this->importVideos($client, $importUrls, $username);
        }

        // Fetch thumbnails for rows that need them
        $query = TikTokVideo::query();
        if (! $this->option('force')) {
            $query->whereNull('thumbnail_url');
        }
        $videos = $query->get();

        if ($videos->isEmpty()) {
            $this->info('No videos need thumbnails.');

            return self::SUCCESS;
        }

        $this->info("Fetching thumbnails for {$videos->count()} video(s)…");
        $bar = $this->output->createProgressBar($videos->count());
        $updated = 0;
        $failed = 0;

        $bar->start();

        foreach ($videos as $video) {
            // TikTok oEmbed always uses /video/ path regardless of post_type
            $videoUrl = "https://www.tiktok.com/@{$username}/video/{$video->tiktok_video_id}";

            $result = $this->fetchOEmbed($client, $videoUrl);

            if ($result) {
                $data = [];
                if (! empty($result['thumbnail_url'])) {
                    $cached = $this->cacheThumbnail($client, $result['thumbnail_url'], $video->tiktok_video_id);
                    $data['thumbnail_url'] = $cached ?? $result['thumbnail_url'];
                }
                // Update title only if it's still the default placeholder
                if (! empty($result['title']) && in_array($video->title, ['Video Log', 'Photo Post', ''])) {
                    $data['title'] = $result['title'];
                }
                if ($data) {
                    $video->update($data);
                    $updated++;
                }
            } else {
                $failed++;
            }

            $bar->advance();
            usleep(random_int(500_000, 1_200_000)); // 0.5–1.2 s polite delay
        }

        $bar->finish();
        $this->newLine();
        $this->info("Done. Updated: {$updated}, Failed: {$failed}");

        Cache::forget('video-log.api');

        return $failed === 0 ? self::SUCCESS : self::FAILURE;
    }

    private function importVideos(Client $client, array $urls, string $username): void
    {
        $this->info('Importing '.count($urls).' video(s)…');
        $imported = 0;
        $skipped = 0;

        foreach ($urls as $url) {
            // Accept both /video/ and /photo/ URLs
            if (! preg_match('#/(?:video|photo)/(\d+)#', $url, $m)) {
                $this->warn("Could not extract video ID from: {$url}");
                $skipped++;

                continue;
            }

            $videoId = $m[1];
            $postType = str_contains($url, '/photo/') ? 'photo' : 'video';

            if (TikTokVideo::where('tiktok_video_id', $videoId)->exists()) {
                $this->line("  Skipped (already exists): {$videoId}");
                $skipped++;

                continue;
            }

            $oembed = $this->fetchOEmbed($client, $url);

            $thumbnailUrl = null;
            if (! empty($oembed['thumbnail_url'])) {
                $thumbnailUrl = $this->cacheThumbnail($client, $oembed['thumbnail_url'], $videoId)
                    ?? $oembed['thumbnail_url'];
            }

            TikTokVideo::create([
                'tiktok_video_id' => $videoId,
                'post_type' => $postType,
                'title' => $oembed['title'] ?? 'TikTok Video',
                'description' => null,
                'thumbnail_url' => $thumbnailUrl,
                'is_active' => true,
                'sort_order' => 0,
            ]);

            $this->line("  Imported: {$videoId}");
            $imported++;
            usleep(600_000);
        }

        $this->info("Import done. Imported: {$imported}, Skipped: {$skipped}");
    }

    private function cacheThumbnail(Client $client, string $thumbnailUrl, string $videoId): ?string
    {
        $s3Path = "studio/video-logs/thumbnails/{$videoId}.jpg";

        // Return existing cached URL if already uploaded.
        // Wrapped in try/catch: HeadObject may be denied (403) if the IAM policy only
        // grants PutObject. In that case we fall through and re-upload rather than crash.
        try {
            if (Storage::disk('s3')->exists($s3Path)) {
                return $this->cdnUrl($s3Path);
            }
        } catch (\Throwable $e) {
            // Cannot check existence — proceed to (re-)upload
        }

        try {
            $response = $client->get($thumbnailUrl, ['http_errors' => false, 'timeout' => 15]);
            if ($response->getStatusCode() !== 200) {
                return null;
            }

            $contents = (string) $response->getBody();
            $ok = Storage::disk('s3')->put($s3Path, $contents);

            if (! $ok) {
                $this->warn("S3 upload failed for {$videoId}");

                return null;
            }

            return $this->cdnUrl($s3Path);
        } catch (\Throwable $e) {
            $this->warn("Could not cache thumbnail for {$videoId}: {$e->getMessage()}");

            return null;
        }
    }

    private function cdnUrl(string $s3Path): string
    {
        $cloudfront = config('media.cloudfront_domain');
        if ($cloudfront) {
            return 'https://'.rtrim($cloudfront, '/').'/'.ltrim($s3Path, '/');
        }

        return Storage::disk('s3')->url($s3Path);
    }

    private function fetchOEmbed(Client $client, string $videoUrl): ?array
    {
        try {
            $response = $client->get('https://www.tiktok.com/oembed', [
                'query' => ['url' => $videoUrl],
            ]);

            if ($response->getStatusCode() !== 200) {
                $this->newLine();
                $this->warn("oEmbed returned HTTP {$response->getStatusCode()} for {$videoUrl}");

                return null;
            }

            $data = json_decode((string) $response->getBody(), true);

            if (empty($data) || isset($data['status_code'])) {
                $this->newLine();
                $this->warn("oEmbed error for {$videoUrl}: ".json_encode($data));

                return null;
            }

            return $data;
        } catch (RequestException $e) {
            $this->newLine();
            $this->error("Request failed for {$videoUrl}: ".$e->getMessage());

            return null;
        }
    }
}
