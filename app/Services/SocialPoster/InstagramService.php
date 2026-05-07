<?php

namespace App\Services\SocialPoster;

use GuzzleHttp\Client;

class InstagramService
{
    private const GRAPH_URL = 'https://graph.facebook.com/v19.0';

    public function __construct(private Client $client) {}

    /**
     * Publish an image post to Instagram.
     * A publicly-accessible $mediaUrl is required — Instagram fetches the image itself.
     */
    public function post(string $content, string $mediaUrl): void
    {
        $userId      = config('social.instagram.user_id');
        $accessToken = config('social.instagram.access_token');

        if (empty($userId) || empty($accessToken)) {
            throw new \RuntimeException('Instagram credentials are not fully configured.');
        }

        // Step 1: Create media container
        $createResponse = $this->client->post(self::GRAPH_URL . '/' . $userId . '/media', [
            'form_params' => [
                'image_url'    => $mediaUrl,
                'caption'      => $content,
                'access_token' => $accessToken,
            ],
        ]);

        /** @var array{id: string} $data */
        $data        = json_decode((string) $createResponse->getBody(), true);
        $containerId = $data['id'] ?? null;

        if (empty($containerId)) {
            throw new \RuntimeException('Instagram media container creation returned no ID.');
        }

        // Step 2: Publish the container
        $this->client->post(self::GRAPH_URL . '/' . $userId . '/media_publish', [
            'form_params' => [
                'creation_id'  => $containerId,
                'access_token' => $accessToken,
            ],
        ]);
    }
}
