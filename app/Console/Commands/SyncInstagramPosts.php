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

        if (! is_string($token) || $token === '' || ! is_string($userId) || $userId === '') {
            $this->error('INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_USER_ID must be set to non-empty strings.');

            return self::FAILURE;
        }

        $limit = min((int) $this->option('limit'), 100);
        $dryRun = (bool) $this->option('dry-run');
        $client = new Client(['timeout' => 20, 'http_errors' => false]);

        $this->info("Fetching up to {$limit} Instagram posts…");

        /** @var list<mixed> $results */
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

                if (! is_array($body)) {
                    $this->error('Instagram API returned malformed JSON or a non-object response.');

                    return self::FAILURE;
                }

                if (isset($body['error'])) {
                    $error = is_array($body['error']) ? $body['error'] : [];
                    $message = is_string($error['message'] ?? null) ? $error['message'] : 'unknown error';
                    $this->error("Instagram API error: {$message}");

                    return self::FAILURE;
                }

                $data = $body['data'] ?? null;
                if (! is_array($data) || ! array_is_list($data)) {
                    $this->error('Instagram API returned a malformed data field; expected an array of media.');

                    return self::FAILURE;
                }
                $results = array_merge($results, $data);

                $paging = $body['paging'] ?? null;
                if ($paging !== null && ! is_array($paging)) {
                    $this->error('Instagram API returned a malformed paging field.');

                    return self::FAILURE;
                }
                $next = is_array($paging) ? ($paging['next'] ?? null) : null;
                if ($next !== null && ! is_string($next)) {
                    $this->error('Instagram API returned a non-string next-page URL.');

                    return self::FAILURE;
                }
                $url = $next;
                $params = [];
            } catch (RequestException $e) {
                $this->error('Request failed: '.$e->getMessage());

                return self::FAILURE;
            }
        }

        $results = array_slice($results, 0, $limit);
        $imported = 0;
        $skipped = 0;

        foreach ($results as $rawPost) {
            $post = $this->normalizeMedia($rawPost);
            if ($post === null) {
                $skipped++;

                continue;
            }

            if (! $dryRun && InstagramPost::where('instagram_id', $post['id'])->exists()) {
                $skipped++;

                continue;
            }

            $thumbUrl = $post['thumbnail_url'] ?? ($post['media_type'] === 'IMAGE' ? $post['media_url'] : null);

            if ($dryRun) {
                $this->line("  [dry-run] {$post['id']} ({$post['media_type']}): ".substr($post['caption'] ?? '', 0, 60));
                $imported++;

                continue;
            }

            InstagramPost::create([
                'instagram_id' => $post['id'],
                'media_type' => $post['media_type'],
                'media_url' => $post['media_url'],
                'thumbnail_url' => $thumbUrl,
                'caption' => $post['caption'],
                'permalink' => $post['permalink'],
                'is_active' => true,
                'posted_at' => $post['timestamp'],
            ]);
            $imported++;
        }

        $this->info("Done. Imported: {$imported}, Skipped: {$skipped}");

        return self::SUCCESS;
    }

    /**
     * @return array{
     *     id: string,
     *     media_type: string,
     *     media_url: ?string,
     *     thumbnail_url: ?string,
     *     caption: ?string,
     *     timestamp: ?string,
     *     permalink: ?string
     * }|null
     */
    private function normalizeMedia(mixed $post): ?array
    {
        if (! is_array($post)) {
            $this->warn('Skipping malformed Instagram media: expected an object.');

            return null;
        }

        $id = $post['id'] ?? null;
        $mediaType = $post['media_type'] ?? null;
        if (! is_string($id) || $id === '' || ! is_string($mediaType) || $mediaType === '') {
            $this->warn('Skipping malformed Instagram media without a string id and media_type.');

            return null;
        }

        return [
            'id' => $id,
            'media_type' => $mediaType,
            'media_url' => $this->optionalString($post, 'media_url'),
            'thumbnail_url' => $this->optionalString($post, 'thumbnail_url'),
            'caption' => $this->optionalString($post, 'caption'),
            'timestamp' => $this->optionalString($post, 'timestamp'),
            'permalink' => $this->optionalString($post, 'permalink'),
        ];
    }

    /**
     * @param  array<string|int, mixed>  $data
     */
    private function optionalString(array $data, string $key): ?string
    {
        $value = $data[$key] ?? null;
        if ($value === null) {
            return null;
        }
        if (! is_string($value)) {
            $this->warn("Ignoring non-string {$key} in Instagram API response.");

            return null;
        }

        return $value;
    }
}
