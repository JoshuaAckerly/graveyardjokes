<?php

namespace App\Services\SocialPoster;

use GuzzleHttp\Client;

class FacebookService
{
    private const GRAPH_URL = 'https://graph.facebook.com/v19.0';

    public function __construct(private Client $client) {}

    public function post(string $content, ?string $mediaUrl = null): void
    {
        $pageId = config('social.facebook.page_id');
        $accessToken = config('social.facebook.access_token');

        if (empty($pageId) || empty($accessToken)) {
            throw new \RuntimeException('Facebook page credentials are not fully configured.');
        }

        if ($mediaUrl !== null) {
            // Photo post — use /photos endpoint, caption holds the text
            $this->client->post(self::GRAPH_URL.'/'.$pageId.'/photos', [
                'form_params' => [
                    'url' => $mediaUrl,
                    'caption' => $content,
                    'access_token' => $accessToken,
                ],
            ]);
        } else {
            // Text-only post
            $this->client->post(self::GRAPH_URL.'/'.$pageId.'/feed', [
                'form_params' => [
                    'message' => $content,
                    'access_token' => $accessToken,
                ],
            ]);
        }
    }
}
