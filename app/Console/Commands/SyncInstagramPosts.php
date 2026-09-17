<?php

namespace App\Console\Commands;

use App\Models\InstagramPost;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Console\Command;

class SyncInstagramPosts extends Command
{
    protected $signature = 'instagram:sync-posts
                            {--limit=50 : Max posts to fetch}
                            {--dry-run : Show what would be imported without saving}';

    protected $description = 'Sync media from your Instagram Business account into instagram_posts';

    private const GRAPH = 'https://graph.facebook.com/v22.0';

    public function handle(): int
    {
        $token = config('services.instagram.access_token');
        $userId = config('services.instagram.user_id');

        if (empty($token) || empty($userId)) {
            $this->error('INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_USER_ID must be set.');

            return self::FAILURE;
        }

        $limit = min((int) $this->option('limit'), 100);
        $dryRun = $this->option('dry-run');
        $client = new Client(['timeout' => 20, 'http_errors' => false]);

        $this->info("Fetching up to {$limit} Instagram posts…");

        $results = [];
        $url = self::GRAPH."/{$userId}/media";
        $params = [
            'fields' => 'id,media_type,media_url,thumbnail_url,caption,timestamp,permalink',
            'access_token' => $token,
            'limit' => min($limit, 100),
        ];

        while ($url && count($results) < $limit) {
            try {
                $response = $client->get($url, ['query' => $params]);
                $body = json_decode((string) $response->getBody(), true);

                if (isset($body['error'])) {
                    $this->error("Instagram API error: {$body['error']['message']}");

                    return self::FAILURE;
                }

                $results = array_merge($results, $body['data'] ?? []);
                $url = $body['paging']['next'] ?? null;
                $params = [];
            } catch (RequestException $e) {
                $this->error('Request failed: '.$e->getMessage());

                return self::FAILURE;
            }
        }

        $results = array_slice($results, 0, $limit);
        $imported = 0;
        $skipped = 0;

        foreach ($results as $post) {
            if (! $dryRun && InstagramPost::where('instagram_id', $post['id'])->exists()) {
                $skipped++;

                continue;
            }

            // Videos use thumbnail_url; images use media_url
            $thumbUrl = $post['thumbnail_url'] ?? ($post['media_type'] === 'IMAGE' ? ($post['media_url'] ?? null) : null);

            if ($dryRun) {
                $this->line("  [dry-run] {$post['id']} ({$post['media_type']}): ".substr($post['caption'] ?? '', 0, 60));
                $imported++;

                continue;
            }

            InstagramPost::create([
                'instagram_id' => $post['id'],
                'media_type' => $post['media_type'],
                'media_url' => $post['media_url'] ?? null,
                'thumbnail_url' => $thumbUrl,
                'caption' => $post['caption'] ?? null,
                'permalink' => $post['permalink'] ?? null,
                'is_active' => true,
                'posted_at' => $post['timestamp'] ?? null,
            ]);
            $imported++;
        }

        $this->info("Done. Imported: {$imported}, Skipped: {$skipped}");

        return self::SUCCESS;
    }
}
