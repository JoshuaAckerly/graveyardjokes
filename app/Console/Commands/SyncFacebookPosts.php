<?php

namespace App\Console\Commands;

use App\Models\FacebookGalleryPost;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class SyncFacebookPosts extends Command
{
    protected $signature = 'facebook:sync-posts
                            {--limit=50 : Max posts to fetch per endpoint (photos + feed)}
                            {--dry-run : Show what would be imported without saving}';

    protected $description = 'Sync photos and posts from your Facebook page into facebook_gallery_posts';

    private const GRAPH = 'https://graph.facebook.com/v22.0';

    public function handle(): int
    {
        $token = config('services.facebook.page_access_token')
            ?? config('services.facebook.user_access_token');
        $pageId = config('services.facebook.page_id');

        if (! is_string($token) || $token === '') {
            $this->error('FACEBOOK_PAGE_ACCESS_TOKEN or FACEBOOK_USER_ACCESS_TOKEN must be set to a non-empty string.');

            return self::FAILURE;
        }

        if (! is_string($pageId) || $pageId === '') {
            // Auto-discover the page ID from the user token
            $pageId = $this->discoverPageId($token);
            if (! $pageId) {
                $this->error('FACEBOOK_PAGE_ID is not set and could not be auto-discovered.');

                return self::FAILURE;
            }
            $this->line("Auto-discovered page ID: {$pageId}");

            // Exchange for a page-scoped token for better permissions
            $pageToken = $this->getPageToken($token, $pageId);
            if (is_string($pageToken) && $pageToken !== '') {
                $token = $pageToken;
            }
        }

        $limit = (int) $this->option('limit');
        $dryRun = $this->option('dry-run');
        $client = new Client(['timeout' => 20, 'http_errors' => false]);

        $imported = 0;
        $skipped = 0;

        // ── Photos ──────────────────────────────────────────────────────────
        $this->info('Fetching page photos…');
        $photos = $this->fetchPaged($client, "{$pageId}/photos", [
            'fields' => 'id,name,created_time,images,link',
            'type' => 'uploaded',
        ], $token, $limit);

        foreach ($photos as $rawPhoto) {
            $photo = $this->normalizePhoto($rawPhoto);
            if ($photo === null) {
                $skipped++;

                continue;
            }

            $url = $this->canonicalPhotoUrl($photo['id'], $photo['link'] ?? null);

            if (! $dryRun && FacebookGalleryPost::where('post_url', $url)->exists()) {
                $skipped++;

                continue;
            }

            // Pick the largest image available
            $images = $photo['images'];
            usort($images, fn ($a, $b) => $b['width'] <=> $a['width']);
            $thumbnailUrl = $images[0]['source'];

            $description = $photo['name'] ?? null;

            if ($dryRun) {
                $this->line("  [dry-run] photo {$photo['id']}: ".($description ? substr($description, 0, 60) : '(no caption)'));
                $imported++;

                continue;
            }

            FacebookGalleryPost::create([
                'post_url' => $url,
                'title' => $description ? \Str::limit($description, 100) : 'Facebook Photo',
                'description' => $description,
                'thumbnail_url' => $thumbnailUrl,
                'posted_at' => $this->formatPostedAt($photo['created_time']),
                'is_active' => true,
                'sort_order' => 0,
            ]);
            $imported++;
        }

        $this->info("Photos: imported {$imported}, skipped {$skipped}");

        // ── Feed posts (images and text-only) ────────────────────────────────
        $this->info('Fetching page feed posts…');
        $feedImported = 0;
        $feedSkipped = 0;

        $posts = $this->fetchPaged($client, "{$pageId}/posts", [
            'fields' => 'id,message,created_time,full_picture,permalink_url',
        ], $token, $limit);

        foreach ($posts as $rawPost) {
            $post = $this->normalizeFeedPost($rawPost);
            if ($post === null) {
                $feedSkipped++;

                continue;
            }

            $message = $post['message'] ?? null;
            $picture = $post['full_picture'] ?? null;

            // Nothing to show — no caption and no image
            if (empty($message) && empty($picture)) {
                $feedSkipped++;

                continue;
            }

            $url = $this->normalizePermalink($post['permalink_url'] ?? null, $pageId) ?? "https://www.facebook.com/{$post['id']}";
            $title = $message ? \Str::limit($message, 100) : 'Facebook Post';

            if (! $dryRun && (
                FacebookGalleryPost::where('post_url', $url)->exists() ||
                // Skip if the same caption was already imported as a photo upload
                ($title !== 'Facebook Post' && FacebookGalleryPost::where('title', $title)->where('post_url', 'not like', '%/posts/%')->exists())
            )) {
                $feedSkipped++;

                continue;
            }

            if ($dryRun) {
                $this->line("  [dry-run] post {$post['id']}: ".($message ? substr($message, 0, 60) : '(no message)'));
                $feedImported++;

                continue;
            }

            FacebookGalleryPost::create([
                'post_url' => $url,
                'title' => $title,
                'description' => $message,
                'thumbnail_url' => $picture,
                'posted_at' => $this->formatPostedAt($post['created_time']),
                'is_active' => true,
                'sort_order' => 0,
            ]);
            $feedImported++;
        }

        $this->info("Feed posts: imported {$feedImported}, skipped {$feedSkipped}");

        if (! $dryRun) {
            Cache::forget('illustrations.api');
        }

        return self::SUCCESS;
    }

    /**
     * Facebook's `permalink_url` can carry a stale leading page/actor ID left over from before
     * a Page merge/ID change (the trailing post or video ID stays valid, but the old actor ID
     * segment 404s — "content isn't available"). Force it to the page ID we actually queried with.
     */
    private function normalizePermalink(?string $permalinkUrl, string $pageId): ?string
    {
        if (empty($permalinkUrl)) {
            return null;
        }

        // preg_replace_callback avoids the classic "$1" + literal-digits backreference
        // ambiguity you'd get building "$1{$pageId}$2" as a plain replacement string.
        return preg_replace_callback(
            '#^(https://www\.facebook\.com/)\d+(/(?:posts|videos)/)#',
            fn (array $m) => $m[1].$pageId.$m[2],
            $permalinkUrl
        );
    }

    /**
     * The Graph API `link` field returns the legacy `photo.php?fbid=..&set=..&type=3` format,
     * which the Facebook mobile app doesn't reliably deep-link to. Build the modern
     * `/photo/?fbid=..&set=..` share URL instead (fbid alone resolves the photo regardless of page).
     */
    private function canonicalPhotoUrl(string $fbid, ?string $legacyLink): string
    {
        $set = null;
        if ($legacyLink && preg_match('/set=([^&]+)/', $legacyLink, $m)) {
            $set = $m[1];
        }

        return $set
            ? "https://www.facebook.com/photo/?fbid={$fbid}&set={$set}"
            : "https://www.facebook.com/photo/?fbid={$fbid}";
    }

    /**
     * @param  array<string, scalar|null>  $params
     * @return list<mixed>
     */
    private function fetchPaged(Client $client, string $endpoint, array $params, string $token, int $limit): array
    {
        $results = [];
        $url = self::GRAPH."/{$endpoint}";
        $params['access_token'] = $token;
        $params['limit'] = min($limit, 100);

        while ($url && count($results) < $limit) {
            try {
                $response = $client->get($url, ['query' => $params]);
                $body = json_decode((string) $response->getBody(), true);

                if (! is_array($body)) {
                    $this->warn('Graph API returned malformed JSON or a non-object response.');
                    break;
                }

                if (isset($body['error'])) {
                    $error = is_array($body['error']) ? $body['error'] : [];
                    $message = is_string($error['message'] ?? null) ? $error['message'] : 'unknown error';
                    $this->warn("Graph API error: {$message}");
                    break;
                }

                $data = $body['data'] ?? null;
                if (! is_array($data) || ! array_is_list($data)) {
                    $this->warn('Graph API returned a malformed data field; expected an array of records.');
                    break;
                }

                $results = array_merge($results, $data);
                $paging = $body['paging'] ?? null;
                if ($paging !== null && ! is_array($paging)) {
                    $this->warn('Graph API returned a malformed paging field; stopping pagination.');
                    break;
                }
                $next = is_array($paging) ? ($paging['next'] ?? null) : null;
                if ($next !== null && ! is_string($next)) {
                    $this->warn('Graph API returned a non-string next-page URL; stopping pagination.');
                    break;
                }
                $url = $next;
                $params = []; // next page URL already has all params
            } catch (RequestException $e) {
                $this->error('Request failed: '.$e->getMessage());
                break;
            }
        }

        return array_slice($results, 0, $limit);
    }

    /**
     * @return array{id: string, name: ?string, created_time: ?string, link: ?string, images: list<array{width: int, source: ?string}>}|null
     */
    private function normalizePhoto(mixed $photo): ?array
    {
        if (! is_array($photo)) {
            $this->warn('Skipping malformed Facebook photo: expected an object.');

            return null;
        }

        $id = $photo['id'] ?? null;
        if (! is_string($id) || $id === '') {
            $this->warn('Skipping malformed Facebook photo without a string id.');

            return null;
        }

        $name = $this->optionalString($photo, 'name', 'Facebook photo');
        $createdTime = $this->optionalString($photo, 'created_time', 'Facebook photo');
        $link = $this->optionalString($photo, 'link', 'Facebook photo');
        $images = [];
        if (isset($photo['images'])) {
            if (! is_array($photo['images']) || ! array_is_list($photo['images'])) {
                $this->warn("Ignoring malformed images for Facebook photo {$id}.");
            } else {
                foreach ($photo['images'] as $image) {
                    if (! is_array($image)) {
                        $this->warn("Ignoring malformed image for Facebook photo {$id}.");

                        continue;
                    }
                    $width = $image['width'] ?? null;
                    if (! is_int($width)) {
                        $this->warn("Ignoring Facebook photo image without an integer width for {$id}.");

                        continue;
                    }
                    $images[] = [
                        'width' => $width,
                        'source' => $this->optionalString($image, 'source', 'Facebook photo image'),
                    ];
                }
            }
        }

        return [
            'id' => $id,
            'name' => $name,
            'created_time' => $createdTime,
            'link' => $link,
            'images' => $images,
        ];
    }

    /**
     * @return array{id: string, message: ?string, created_time: ?string, full_picture: ?string, permalink_url: ?string}|null
     */
    private function normalizeFeedPost(mixed $post): ?array
    {
        if (! is_array($post)) {
            $this->warn('Skipping malformed Facebook feed post: expected an object.');

            return null;
        }

        $id = $post['id'] ?? null;
        if (! is_string($id) || $id === '') {
            $this->warn('Skipping malformed Facebook feed post without a string id.');

            return null;
        }

        return [
            'id' => $id,
            'message' => $this->optionalString($post, 'message', 'Facebook feed post'),
            'created_time' => $this->optionalString($post, 'created_time', 'Facebook feed post'),
            'full_picture' => $this->optionalString($post, 'full_picture', 'Facebook feed post'),
            'permalink_url' => $this->optionalString($post, 'permalink_url', 'Facebook feed post'),
        ];
    }

    /**
     * @param  array<string|int, mixed>  $data
     */
    private function optionalString(array $data, string $key, string $context): ?string
    {
        $value = $data[$key] ?? null;
        if ($value === null) {
            return null;
        }
        if (! is_string($value)) {
            $this->warn("Ignoring non-string {$key} in {$context}.");

            return null;
        }

        return $value;
    }

    private function formatPostedAt(?string $createdTime): ?string
    {
        if ($createdTime === null) {
            return null;
        }

        $timestamp = strtotime($createdTime);
        if ($timestamp === false) {
            $this->warn('Ignoring malformed created_time in Facebook API response.');

            return null;
        }

        return date('Y-m-d', $timestamp);
    }

    private function discoverPageId(string $userToken): ?string
    {
        $client = new Client(['timeout' => 10, 'http_errors' => false]);
        try {
            $response = $client->get(self::GRAPH.'/me/accounts', [
                'query' => ['access_token' => $userToken, 'fields' => 'id,name'],
            ]);
            $body = json_decode((string) $response->getBody(), true);
            if (! is_array($body)) {
                $this->warn('Facebook page discovery returned a malformed response.');

                return null;
            }
            $pages = $body['data'] ?? null;
            if (! is_array($pages) || ! array_is_list($pages)) {
                $this->warn('Facebook page discovery returned a malformed data field.');

                return null;
            }
            $firstPage = $pages[0] ?? null;
            if (! is_array($firstPage)) {
                $this->warn('Facebook page discovery returned a malformed page record.');

                return null;
            }
            $pageId = $firstPage['id'] ?? null;

            return is_string($pageId) && $pageId !== '' ? $pageId : null;
        } catch (\Throwable) {
            return null;
        }
    }

    private function getPageToken(string $userToken, string $pageId): ?string
    {
        $client = new Client(['timeout' => 10, 'http_errors' => false]);
        try {
            $response = $client->get(self::GRAPH.'/me/accounts', [
                'query' => ['access_token' => $userToken, 'fields' => 'id,access_token'],
            ]);
            $body = json_decode((string) $response->getBody(), true);
            if (! is_array($body)) {
                $this->warn('Facebook page-token response was malformed.');

                return null;
            }
            $pages = $body['data'] ?? null;
            if (! is_array($pages) || ! array_is_list($pages)) {
                $this->warn('Facebook page-token response contained malformed page data.');

                return null;
            }
            foreach ($pages as $page) {
                if (! is_array($page)) {
                    $this->warn('Ignoring malformed page in Facebook page-token response.');

                    continue;
                }
                if (($page['id'] ?? null) === $pageId) {
                    $pageToken = $page['access_token'] ?? null;

                    return is_string($pageToken) && $pageToken !== '' ? $pageToken : null;
                }
            }
        } catch (\Throwable $e) {
            $this->warn('Could not retrieve Facebook page token: '.$e->getMessage());
        }

        return null;
    }
}
