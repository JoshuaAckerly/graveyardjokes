<?php

namespace App\Services\SocialPoster;

use GuzzleHttp\Client;

class InstagramService
{
    private const GRAPH_URL = 'https://graph.facebook.com/v22.0';

    /** Seconds to wait between container status polls. */
    private const POLL_INTERVAL = 3;

    /** Maximum number of poll attempts before giving up (~30 s total). */
    private const POLL_MAX_ATTEMPTS = 10;

    public function __construct(private Client $client) {}

    /**
     * Publish an image post to Instagram.
     * A publicly-accessible $mediaUrl is required — Instagram fetches the image itself.
     */
    public function post(string $content, string $mediaUrl): void
    {
        $userId = config('social.instagram.user_id');
        $accessToken = config('social.instagram.access_token');

        if (empty($userId) || empty($accessToken)) {
            throw new \RuntimeException('Instagram credentials are not fully configured.');
        }

        // Step 1: Create media container
        $createResponse = $this->client->post(self::GRAPH_URL.'/'.$userId.'/media', [
            'form_params' => [
                'image_url' => $mediaUrl,
                'caption' => $content,
                'access_token' => $accessToken,
            ],
        ]);

        /** @var array{id: string} $data */
        $data = json_decode((string) $createResponse->getBody(), true);
        $containerId = $data['id'] ?? null;

        if (empty($containerId)) {
            throw new \RuntimeException('Instagram media container creation returned no ID.');
        }

        // Step 2: Poll until the container is FINISHED processing
        // Meta fetches and processes the image asynchronously; publishing before
        // the container reaches FINISHED will return error code 9007.
        $this->waitForContainer($containerId, $accessToken);

        // Step 3: Publish the container
        $this->client->post(self::GRAPH_URL.'/'.$userId.'/media_publish', [
            'form_params' => [
                'creation_id' => $containerId,
                'access_token' => $accessToken,
            ],
        ]);
    }

    /**
     * Poll the container status until FINISHED, or throw if it errors / times out.
     */
    private function waitForContainer(string $containerId, string $accessToken): void
    {
        for ($attempt = 1; $attempt <= self::POLL_MAX_ATTEMPTS; $attempt++) {
            $response = $this->client->get(self::GRAPH_URL.'/'.$containerId, [
                'query' => [
                    'fields' => 'status_code',
                    'access_token' => $accessToken,
                ],
            ]);

            /** @var array{status_code?: string} $status */
            $status = json_decode((string) $response->getBody(), true);
            $statusCode = $status['status_code'] ?? '';

            if ($statusCode === 'FINISHED') {
                return;
            }

            if ($statusCode === 'ERROR' || $statusCode === 'EXPIRED') {
                throw new \RuntimeException("Instagram container {$containerId} failed with status: {$statusCode}.");
            }

            // IN_PROGRESS or empty — keep waiting
            if ($attempt < self::POLL_MAX_ATTEMPTS) {
                sleep(self::POLL_INTERVAL);
            }
        }

        throw new \RuntimeException(
            "Instagram container {$containerId} did not reach FINISHED after "
            .(self::POLL_MAX_ATTEMPTS * self::POLL_INTERVAL).' seconds.'
        );
    }
}
