<?php

namespace App\Services\SocialPoster;

use GuzzleHttp\Client;

class LinkedInService
{
    private const API_URL = 'https://api.linkedin.com/rest/posts';

    private const VERSION = '202502';

    public function __construct(private Client $client) {}

    public function post(string $content, ?string $mediaUrl = null): void
    {
        $accessToken = (string) config('social.linkedin.access_token');
        $authorUrn = (string) config('social.linkedin.author_urn');

        if (empty($accessToken) || empty($authorUrn)) {
            throw new \RuntimeException('LinkedIn credentials are not fully configured (LINKEDIN_ACCESS_TOKEN, LINKEDIN_AUTHOR_URN).');
        }

        $body = [
            'author' => $authorUrn,
            'commentary' => $content,
            'visibility' => 'PUBLIC',
            'distribution' => [
                'feedDistribution' => 'MAIN_FEED',
                'targetEntities' => [],
                'thirdPartyDistributionChannels' => [],
            ],
            'lifecycleState' => 'PUBLISHED',
            'isReshareDisabledByAuthor' => false,
        ];

        if ($mediaUrl !== null) {
            $body['content'] = [
                'article' => [
                    'source' => $mediaUrl,
                ],
            ];
        }

        $this->client->post(self::API_URL, [
            'headers' => [
                'Authorization' => 'Bearer '.$accessToken,
                'Content-Type' => 'application/json',
                'LinkedIn-Version' => self::VERSION,
                'X-Restli-Protocol-Version' => '2.0.0',
            ],
            'json' => $body,
        ]);
    }
}
