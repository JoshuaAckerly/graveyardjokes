<?php

namespace App\Services\SocialPoster;

use GuzzleHttp\Client;

class TwitterService
{
    private const API_URL = 'https://api.twitter.com/2/tweets';

    public function __construct(private Client $client) {}

    public function post(string $content): void
    {
        $apiKey = (string) config('social.twitter.api_key');
        $apiSecret = (string) config('social.twitter.api_secret');
        $accessToken = (string) config('social.twitter.access_token');
        $accessSecret = (string) config('social.twitter.access_secret');

        if (empty($apiKey) || empty($apiSecret) || empty($accessToken) || empty($accessSecret)) {
            throw new \RuntimeException('Twitter API credentials are not fully configured.');
        }

        $authHeader = $this->buildOauthHeader($apiKey, $apiSecret, $accessToken, $accessSecret);

        $this->client->post(self::API_URL, [
            'headers' => [
                'Authorization' => $authHeader,
                'Content-Type' => 'application/json',
            ],
            'json' => ['text' => $content],
        ]);
    }

    private function buildOauthHeader(
        string $apiKey,
        string $apiSecret,
        string $accessToken,
        string $accessSecret,
    ): string {
        $nonce = rtrim(strtr(base64_encode(random_bytes(32)), '+/', '-_'), '=');
        $timestamp = (string) time();

        $oauthParams = [
            'oauth_consumer_key' => $apiKey,
            'oauth_nonce' => $nonce,
            'oauth_signature_method' => 'HMAC-SHA1',
            'oauth_timestamp' => $timestamp,
            'oauth_token' => $accessToken,
            'oauth_version' => '1.0',
        ];

        // For JSON-body requests only OAuth params go into the signature (RFC 5849 §3.4.1)
        ksort($oauthParams);
        $paramString = http_build_query($oauthParams, '', '&', PHP_QUERY_RFC3986);

        $baseString = 'POST'
            .'&'.rawurlencode(self::API_URL)
            .'&'.rawurlencode($paramString);

        $signingKey = rawurlencode($apiSecret).'&'.rawurlencode($accessSecret);
        $signature = base64_encode(hash_hmac('sha1', $baseString, $signingKey, true));

        $oauthParams['oauth_signature'] = $signature;
        ksort($oauthParams);

        $parts = array_map(
            static fn ($k, $v): string => rawurlencode($k).'="'.rawurlencode($v).'"',
            array_keys($oauthParams),
            array_values($oauthParams),
        );

        return 'OAuth '.implode(', ', $parts);
    }
}
