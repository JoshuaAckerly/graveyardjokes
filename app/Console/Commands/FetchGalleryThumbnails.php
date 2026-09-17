<?php

namespace App\Console\Commands;

use App\Models\FacebookGalleryPost;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class FetchGalleryThumbnails extends Command
{
    protected $signature = 'gallery:fetch-thumbnails
                            {--force : Re-fetch thumbnails even if already set}
                            {--token= : Facebook App Access Token (overrides FACEBOOK_APP_ACCESS_TOKEN env)}
                            {--scrape : Use page scraping instead of Graph API}
                            {--cookie= : Facebook session cookie string for authenticated scraping (e.g. "c_user=XXX; xs=YYY")}
                            {--import=* : Facebook post URLs to import (e.g. https://www.facebook.com/photo?fbid=123)}
                            {--page= : Facebook profile/page URL — discover and import all photos from its Photos tab}';

    protected $description = 'Fetch thumbnails for Facebook gallery posts via the Graph API or page scraping';

    public function handle(): int
    {
        // --page: discover photo URLs from a Facebook profile/page photos tab
        $pageUrl = $this->option('page');

        // Build the initial client early so --page can use it
        $discoveryClient = new Client([
            'timeout' => 20,
            'allow_redirects' => true,
            'headers' => [
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language' => 'en-US,en;q=0.9',
            ],
        ]);

        if ($pageUrl) {
            $discovered = $this->discoverPhotosFromPage($discoveryClient, $pageUrl);
            if ($discovered) {
                $this->importPosts($discovered);
            }
        }

        // --import: add new post URLs before fetching thumbnails
        $importUrls = $this->option('import');
        if ($importUrls) {
            $this->importPosts($importUrls);
        }

        $useScrape = $this->option('scrape');
        // Prefer a user access token (works for personal profile photos) over app token
        $rawToken = $this->option('token')
            ?? config('services.facebook.user_access_token')
            ?? config('services.facebook.app_access_token');
        $cookieString = $this->option('cookie');

        // If no token configured, automatically fall back to scraping
        if (! $rawToken) {
            $useScrape = true;
            $this->warn('No Facebook access token found — falling back to page scraping.');
        }

        $client = $discoveryClient;

        $token = null;

        if (! $useScrape) {
            // If the value looks like APP_ID|APP_SECRET, exchange it for a real app access token
            $token = $rawToken;
            if (str_contains($rawToken, '|')) {
                [$appId, $appSecret] = explode('|', $rawToken, 2);
                $this->info('Exchanging credentials for app access token…');
                try {
                    $resp = $client->get('https://graph.facebook.com/oauth/access_token', [
                        'query' => [
                            'client_id' => $appId,
                            'client_secret' => $appSecret,
                            'grant_type' => 'client_credentials',
                        ],
                    ]);
                    $data = json_decode((string) $resp->getBody(), true);
                    $token = $data['access_token'] ?? null;
                    if (! $token) {
                        $this->warn('Token exchange failed — falling back to page scraping.');
                        $useScrape = true;
                    } else {
                        $this->info('Token obtained.');
                    }
                } catch (RequestException $e) {
                    $errBody = $e->hasResponse() ? (string) $e->getResponse()->getBody() : $e->getMessage();
                    $this->warn("Token exchange request failed: {$errBody}");
                    $this->warn('Falling back to page scraping…');
                    $useScrape = true;
                }
            }
        }

        if ($useScrape) {
            $this->info('Using page scraping mode (public posts only).');
            if (! $cookieString) {
                $this->warn('No --cookie provided. Private/login-walled photos will fail.');
                $this->line('  To authenticate: extract c_user and xs cookies from your browser and pass');
                $this->line('  --cookie="c_user=YOUR_USER_ID; xs=YOUR_XS_VALUE"');
            }
        }

        $query = FacebookGalleryPost::query();
        if (! $this->option('force')) {
            $query->whereNull('thumbnail_url');
        }
        $posts = $query->get();

        if ($posts->isEmpty()) {
            $this->info('No posts need thumbnails.');

            return self::SUCCESS;
        }

        $bar = $this->output->createProgressBar($posts->count());
        $updated = 0;
        $failed = 0;

        $bar->start();

        foreach ($posts as $post) {
            $thumbnail = $useScrape
                ? $this->fetchViaScraping($client, $post->post_url, $post->id, $cookieString)
                : $this->fetchViaGraphApi($client, $token, $post->post_url, $post->id);

            if ($thumbnail) {
                $persisted = $this->persistToS3($client, $thumbnail, $post->id);
                $post->update(['thumbnail_url' => $persisted]);
                $updated++;
            } else {
                $failed++;
            }

            $bar->advance();

            // Polite delay to avoid triggering rate-limits when scraping
            if ($useScrape) {
                usleep(random_int(800_000, 2_000_000)); // 0.8–2 s
            }
        }

        $bar->finish();
        $this->newLine();
        $this->info("Done. Updated: {$updated}, Failed: {$failed}");

        Cache::forget('illustrations.api');

        return $failed === 0 ? self::SUCCESS : self::FAILURE;
    }

    private function fetchViaGraphApi(Client $client, string $token, string $postUrl, int $postId): ?string
    {
        if (! preg_match('/fbid=(\d+)/', $postUrl, $m)) {
            // Handle /{page_id}/videos/{video_id} — fetch thumbnail from video node
            if (preg_match('#/videos/(\d+)#', $postUrl, $vm)) {
                return $this->fetchVideoThumbnail($client, $token, $vm[1], $postId);
            }

            // Handle /{page_id}/posts/{post_id} — fetch image from post attachments
            if (preg_match('#/(\d+)/posts/(\d+)#', $postUrl, $pm)) {
                return $this->fetchPostAttachmentImage($client, $token, "{$pm[1]}_{$pm[2]}", $postId);
            }

            $this->newLine();
            $this->warn("Could not extract ID from post #{$postId} URL");

            return null;
        }

        $fbid = $m[1];

        // Try the direct Graph API first (works for Page photos)
        try {
            $response = $client->get("https://graph.facebook.com/v19.0/{$fbid}", [
                'query' => [
                    'fields' => 'images',
                    'access_token' => $token,
                ],
            ]);

            $data = json_decode((string) $response->getBody(), true);
            $images = $data['images'] ?? [];

            // Pick the smallest image ≤600px wide, fallback to smallest overall
            usort($images, fn ($a, $b) => $b['width'] <=> $a['width']); // largest→smallest
            foreach ($images as $img) {
                if ($img['width'] <= 600) {
                    return $img['source'];
                }
            }
            $thumbnail = $images[count($images) - 1]['source'] ?? null;

            if ($thumbnail) {
                return $thumbnail;
            }
        } catch (RequestException $e) {
            $errBody = $e->hasResponse() ? (string) $e->getResponse()->getBody() : $e->getMessage();
            $errData = json_decode($errBody, true);
            $errCode = $errData['error']['code'] ?? 0;

            // Code 200 = Missing Permissions (personal profile photo) — fall through to oEmbed
            if ($errCode !== 200) {
                $this->newLine();
                $this->error("Failed post #{$postId} (fbid={$fbid}): {$errBody}");

                return null;
            }
        }

        // Fallback: oEmbed API — works for public posts on personal profiles too
        return $this->fetchViaOEmbed($client, $token, $postUrl, $postId);
    }

    private function fetchVideoThumbnail(Client $client, string $token, string $videoId, int $postId): ?string
    {
        try {
            $response = $client->get("https://graph.facebook.com/v19.0/{$videoId}", [
                'query' => ['fields' => 'picture', 'access_token' => $token],
                'http_errors' => false,
            ]);
            $data = json_decode((string) $response->getBody(), true);
            $thumbnail = $data['picture'] ?? null;
            if (! $thumbnail) {
                $this->newLine();
                $this->warn("No picture field for video post #{$postId} (video_id={$videoId})");
            }

            return $thumbnail;
        } catch (RequestException $e) {
            $this->newLine();
            $this->error("Video thumbnail failed for post #{$postId}: ".$e->getMessage());

            return null;
        }
    }

    private function fetchPostAttachmentImage(Client $client, string $token, string $graphPostId, int $postId): ?string
    {
        try {
            $response = $client->get("https://graph.facebook.com/v19.0/{$graphPostId}", [
                'query' => ['fields' => 'attachments{media{image{src}}}', 'access_token' => $token],
                'http_errors' => false,
            ]);
            $data = json_decode((string) $response->getBody(), true);
            $thumbnail = $data['attachments']['data'][0]['media']['image']['src'] ?? null;
            if (! $thumbnail) {
                $this->newLine();
                $this->warn("No attachment image for post #{$postId} (graph_id={$graphPostId})");
            }

            return $thumbnail;
        } catch (RequestException $e) {
            $this->newLine();
            $this->error("Attachment fetch failed for post #{$postId}: ".$e->getMessage());

            return null;
        }
    }

    private function fetchViaOEmbed(Client $client, string $token, string $postUrl, int $postId): ?string
    {
        // Videos use a different oEmbed endpoint
        $endpoint = str_contains($postUrl, '/videos/') ? 'oembed_video' : 'oembed_photo';

        try {
            $response = $client->get("https://graph.facebook.com/v19.0/{$endpoint}", [
                'query' => [
                    'url' => $postUrl,
                    'access_token' => $token,
                    'fields' => 'thumbnail_url,thumbnail_width,thumbnail_height',
                ],
                'http_errors' => false,
            ]);

            $data = json_decode((string) $response->getBody(), true);
            $thumbnail = $data['thumbnail_url'] ?? null;

            if ($thumbnail) {
                return $thumbnail;
            }

            // oEmbed succeeded but no thumbnail — try getting the full photo_url
            $thumbnail = $data['photo_url'] ?? null;
            if ($thumbnail) {
                return $thumbnail;
            }

            $this->newLine();
            $this->warn("oEmbed returned no thumbnail for post #{$postId}");
        } catch (RequestException $e) {
            $this->newLine();
            $errBody = $e->hasResponse() ? (string) $e->getResponse()->getBody() : $e->getMessage();
            $this->error("oEmbed failed for post #{$postId}: {$errBody}");
        }

        return null;
    }

    private function fetchViaScraping(Client $client, string $postUrl, int $postId, ?string $cookieString = null): ?string
    {
        // www.facebook.com photo pages return 400 without a login session.
        // mbasic.facebook.com is the lightweight mobile version which serves
        // public photo pages without requiring cookies/authentication.
        $url = str_replace(
            ['https://www.facebook.com', 'http://www.facebook.com', 'https://facebook.com'],
            'https://mbasic.facebook.com',
            $postUrl
        );
        // mbasic uses photo.php rather than the SPA-style /photo/ path
        $url = str_replace('/photo/', '/photo.php', $url);
        // Strip &set= parameter — mbasic ignores it but it can confuse the route
        $url = (string) preg_replace('/[?&]set=[^&]+/', '', $url);
        // Re-add leading ? if we stripped it along with the first param
        if (! str_contains($url, '?') && str_contains($url, 'fbid=')) {
            $url = (string) preg_replace('/fbid=/', '?fbid=', $url, 1);
        }

        $headers = [
            'User-Agent' => 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
            'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language' => 'en-US,en;q=0.9',
        ];

        if ($cookieString) {
            $headers['Cookie'] = $cookieString;
        }

        try {
            $response = $client->get($url, [
                'headers' => $headers,
                'allow_redirects' => ['max' => 5, 'track_redirects' => true],
            ]);
            $html = (string) $response->getBody();

            // Detect login wall — Facebook redirected us to a login page
            $redirectHistory = $response->getHeader('X-Guzzle-Redirect-History');
            $landedOnLogin = array_filter($redirectHistory, fn ($r) => str_contains($r, '/login.php'));
            if ($landedOnLogin || str_contains($html, 'id="login_form"') || str_contains($html, 'name="login"')) {
                $this->newLine();
                $this->warn("Post #{$postId}: Facebook requires login. Pass your session cookie with --cookie=\"c_user=XXX; xs=YYY\"");

                return null;
            }

            // Facebook embeds photo CDN URLs in inline JSON/HTML.
            // t39.30808-6 = post photo; t39.30808-1 = profile pic (skip those).
            // Collect all scontent fbcdn URLs, prefer post-photo type.
            preg_match_all(
                '/https:\/\/scontent[^\s"\'<\\\\]+fbcdn\.net[^\s"\'<\\\\]+/i',
                $html,
                $matches
            );

            $urls = array_unique(array_map('html_entity_decode', $matches[0]));
            $photo = null;

            // Prefer t39.30808-6 (standard post photo)
            foreach ($urls as $url) {
                if (str_contains($url, 't39.30808-6')) {
                    $photo = $url;
                    break;
                }
            }

            // Fall back to first non-profile-pic scontent URL
            if (! $photo) {
                foreach ($urls as $url) {
                    if (! str_contains($url, 't39.30808-1')) {
                        $photo = $url;
                        break;
                    }
                }
            }

            if (! $photo) {
                $this->newLine();
                $this->warn("No photo URL found for post #{$postId}");
            }

            return $photo;
        } catch (RequestException $e) {
            $this->newLine();
            $status = $e->hasResponse() ? $e->getResponse()->getStatusCode() : 'N/A';
            $this->error("Failed post #{$postId} (HTTP {$status}): ".$e->getMessage());

            return null;
        }
    }

    private function discoverPhotosFromPage(Client $client, string $pageUrl): array
    {
        // mbasic.facebook.com is the lightweight mobile version — much more
        // parse-friendly and less aggressively blocked than the full site.
        $mbasic = str_replace(
            ['https://www.facebook.com', 'http://www.facebook.com', 'https://facebook.com'],
            'https://mbasic.facebook.com',
            $pageUrl
        );

        $base = rtrim($mbasic, '/');

        // For profile.php?id=NNN style, photos tab is ?id=NNN&v=photos
        if (str_contains($base, 'profile.php')) {
            $photosUrl = $base.'&v=photos';
        } else {
            $photosUrl = $base.'/photos';
        }

        $candidateUrls = [$photosUrl, $base];

        $fbids = [];

        foreach ($candidateUrls as $url) {
            $this->info("Scanning: {$url}");
            try {
                $response = $client->get($url);
                $html = (string) $response->getBody();

                // Extract fbid=NNN from href/JSON anywhere in the page
                preg_match_all('/fbid[=\\\\"]+(\d{10,})/i', $html, $m);
                foreach ($m[1] as $id) {
                    $fbids[$id] = true;
                }

                // Also capture photo?fbid=NNN patterns
                preg_match_all('/photo\?fbid=(\d{10,})/i', $html, $m2);
                foreach ($m2[1] as $id) {
                    $fbids[$id] = true;
                }

                // mbasic uses /photo.php?fbid=NNN
                preg_match_all('/photo\.php\?fbid=(\d{10,})/i', $html, $m3);
                foreach ($m3[1] as $id) {
                    $fbids[$id] = true;
                }
            } catch (RequestException $e) {
                $status = $e->hasResponse() ? $e->getResponse()->getStatusCode() : 'N/A';
                $this->warn("Could not fetch {$url} (HTTP {$status}) — skipping.");
            }

            usleep(500_000); // 0.5 s between requests
        }

        if (empty($fbids)) {
            $this->warn('No photo IDs found on the profile page. The page may be private or require login.');
            $this->line('Open your Facebook profile, click a photo, and copy the URL, then use:');
            $this->line('  php artisan gallery:fetch-thumbnails --import="https://www.facebook.com/photo?fbid=NNN"');

            return [];
        }

        $photoUrls = array_map(
            fn ($id) => "https://www.facebook.com/photo?fbid={$id}",
            array_keys($fbids)
        );

        $this->info('Discovered '.count($photoUrls).' photo URL(s) from the profile page.');

        return $photoUrls;
    }

    /**
     * Download image from fbcdn URL and persist to S3 so it survives URL expiry.
     */
    private function persistToS3(Client $client, string $fbcdnUrl, int $postId): string
    {
        try {
            $response = $client->get($fbcdnUrl);
            $imageContent = (string) $response->getBody();

            $contentType = $response->getHeaderLine('Content-Type');
            $ext = match (true) {
                str_contains($contentType, 'png') => 'png',
                str_contains($contentType, 'webp') => 'webp',
                str_contains($contentType, 'gif') => 'gif',
                default => 'jpg',
            };

            $s3Key = 'studio/images/gallery-thumbnails/post-'.$postId.'.'.$ext;

            $ok = Storage::disk('s3')->put($s3Key, $imageContent, [
                'ContentType' => $contentType ?: 'image/jpeg',
            ]);

            if (! $ok) {
                throw new \RuntimeException('Storage::put returned false — check AWS credentials and bucket permissions.');
            }

            $cloudfrontDomain = config('media.cloudfront_domain');
            if (is_string($cloudfrontDomain) && $cloudfrontDomain !== '') {
                return 'https://'.$cloudfrontDomain.'/'.$s3Key;
            }

            return Storage::disk('s3')->url($s3Key);
        } catch (\Throwable $e) {
            $this->warn("Could not persist thumbnail to S3 for post #{$postId}: ".$e->getMessage());

            // Fall back to the original URL (will expire, but better than nothing)
            return $fbcdnUrl;
        }
    }

    private function importPosts(array $urls): void
    {
        $this->info('Importing '.count($urls).' post(s)…');
        $imported = 0;
        $skipped = 0;

        foreach ($urls as $url) {
            $url = trim($url);
            if (! $url) {
                continue;
            }

            if (FacebookGalleryPost::where('post_url', $url)->exists()) {
                $this->line("  Skipped (already exists): {$url}");
                $skipped++;

                continue;
            }

            FacebookGalleryPost::create([
                'post_url' => $url,
                'title' => null,
                'is_active' => true,
                'sort_order' => 0,
            ]);

            $this->line("  Imported: {$url}");
            $imported++;
        }

        $this->info("Import done. Imported: {$imported}, Skipped: {$skipped}");
    }
}
