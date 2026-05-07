<?php

namespace App\Services\SocialPoster;

use GuzzleHttp\Client;

class DiscordService
{
    public function __construct(private Client $client) {}

    public function post(string $content, ?string $mediaUrl = null): void
    {
        $webhookUrl = config('social.discord.webhook_url');

        if (empty($webhookUrl)) {
            throw new \RuntimeException('DISCORD_WEBHOOK_URL is not configured.');
        }

        $body = ['content' => $content];

        if ($mediaUrl !== null) {
            // Discord auto-embeds image URLs appended to content
            $body['content'] = $content."\n".$mediaUrl;
        }

        $this->client->post($webhookUrl, ['json' => $body]);
    }
}
