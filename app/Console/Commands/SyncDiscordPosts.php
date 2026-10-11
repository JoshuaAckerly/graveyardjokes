<?php

namespace App\Console\Commands;

use App\Models\DiscordPost;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Console\Command;

class SyncDiscordPosts extends Command
{
    protected $signature = 'discord:sync-posts
                            {--limit=50 : Max messages to fetch}
                            {--dry-run : Show what would be imported without saving}';

    protected $description = 'Sync messages from your Discord channel into discord_posts';

    private const API = 'https://discord.com/api/v10';

    public function handle(): int
    {
        $token = config('services.discord.bot_token');
        $channelId = config('services.discord.channel_id');

        if (! is_string($token) || $token === '' || ! is_string($channelId) || $channelId === '') {
            $this->error('DISCORD_BOT_TOKEN and DISCORD_CHANNEL_ID must be set to non-empty strings.');
            $this->line('');
            $this->line('To set up:');
            $this->line('  1. Go to https://discord.com/developers/applications and create a bot.');
            $this->line('  2. Add the bot to your server with the Read Messages / View Channels permission.');
            $this->line('  3. Set DISCORD_BOT_TOKEN and DISCORD_CHANNEL_ID in your .env.');

            return self::FAILURE;
        }

        $limit = min((int) $this->option('limit'), 100);
        $dryRun = (bool) $this->option('dry-run');

        $client = new Client([
            'timeout' => 20,
            'http_errors' => false,
            'headers' => ['Authorization' => "Bot {$token}"],
        ]);

        $this->info("Fetching up to {$limit} messages from channel {$channelId}…");

        $guildId = null;
        try {
            $chanResponse = $client->get(self::API."/channels/{$channelId}");
            $channelData = $this->decodeResponse((string) $chanResponse->getBody());
            if ($channelData !== null) {
                $guildId = $this->optionalString($channelData, 'guild_id', 'Discord channel response');
            }
        } catch (\Throwable $e) {
            $this->warn('Could not fetch Discord channel details: '.$e->getMessage());
        }

        if ($guildId === null) {
            $this->warn('Discord channel response did not contain a valid guild_id; generated jump URLs may be incomplete.');
        }

        try {
            $response = $client->get(self::API."/channels/{$channelId}/messages", [
                'query' => ['limit' => $limit],
            ]);
        } catch (RequestException $e) {
            $this->error('Discord API request failed: '.$e->getMessage());

            return self::FAILURE;
        }

        $body = $this->decodeResponse((string) $response->getBody());
        if ($body === null) {
            return self::FAILURE;
        }

        if (array_key_exists('code', $body)) {
            $rawCode = $body['code'];
            if (is_int($rawCode) || is_string($rawCode)) {
                $code = (string) $rawCode;
            } else {
                $this->warn('Ignoring malformed code in Discord API error response.');
                $code = 'unknown';
            }
            $message = $this->optionalString($body, 'message', 'Discord API error response') ?? 'unknown';
            $this->error("Discord API error {$code}: {$message}");

            return self::FAILURE;
        }

        if (! array_is_list($body)) {
            $this->error('Discord API returned an invalid messages payload; expected a JSON array.');

            return self::FAILURE;
        }

        $imported = 0;
        $skipped = 0;

        foreach ($body as $rawMessage) {
            $message = $this->normalizeMessage($rawMessage);
            if ($message === null) {
                $skipped++;

                continue;
            }

            $hasContent = $message['content'] !== '';
            $hasAttachment = $message['attachments'] !== [] || $message['embeds'] !== [];
            if (! $hasContent && ! $hasAttachment) {
                $skipped++;

                continue;
            }

            $jumpUrl = "https://discord.com/channels/{$guildId}/{$channelId}/{$message['id']}";

            if (! $dryRun && DiscordPost::where('jump_url', $jumpUrl)->exists()) {
                $skipped++;

                continue;
            }

            $imageUrl = null;
            foreach ($message['attachments'] as $attachment) {
                if ($attachment['url'] !== null && str_starts_with($attachment['content_type'] ?? '', 'image/')) {
                    $imageUrl = $attachment['url'];
                    break;
                }
            }
            if ($imageUrl === null) {
                foreach ($message['embeds'] as $embed) {
                    $imageUrl = $embed['image'] ?? $embed['thumbnail'];
                    if ($imageUrl !== null) {
                        break;
                    }
                }
            }

            $firstLine = strtok($message['content'], "\n") ?: '';

            if ($dryRun) {
                $this->line("  [dry-run] {$message['id']}: ".substr($firstLine, 0, 80));
                $imported++;

                continue;
            }

            DiscordPost::create([
                'title' => \Str::limit($firstLine, 100),
                'content' => $message['content'],
                'author' => $message['author'],
                'channel' => $channelId,
                'jump_url' => $jumpUrl,
                'image_url' => $imageUrl,
                'is_published' => true,
                'posted_at' => $message['timestamp'],
            ]);
            $imported++;
        }

        $this->info("Done. Imported: {$imported}, Skipped: {$skipped}");

        return self::SUCCESS;
    }

    /**
     * @return array<mixed, mixed>|null
     */
    private function decodeResponse(string $json): ?array
    {
        $decoded = json_decode($json, true);
        if (! is_array($decoded)) {
            $this->error('Discord API returned malformed JSON or a non-object response.');

            return null;
        }

        return $decoded;
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

    /**
     * @return array{
     *     id: string,
     *     content: string,
     *     timestamp: string,
     *     author: ?string,
     *     attachments: list<array{content_type: ?string, url: ?string}>,
     *     embeds: list<array{image: ?string, thumbnail: ?string}>
     * }|null
     */
    private function normalizeMessage(mixed $message): ?array
    {
        if (! is_array($message)) {
            $this->warn('Skipping malformed Discord message: expected an object.');

            return null;
        }

        $id = $this->optionalString($message, 'id', 'Discord message');
        $timestamp = $this->optionalString($message, 'timestamp', 'Discord message');
        if ($id === null || $timestamp === null) {
            $this->warn('Skipping malformed Discord message without a string id and timestamp.');

            return null;
        }

        $content = $this->optionalString($message, 'content', 'Discord message') ?? '';
        $author = null;
        if (isset($message['author'])) {
            if (is_array($message['author'])) {
                $author = $this->optionalString($message['author'], 'username', 'Discord message author');
            } else {
                $this->warn('Ignoring malformed author in Discord message.');
            }
        }

        $attachments = [];
        if (isset($message['attachments'])) {
            if (! is_array($message['attachments']) || ! array_is_list($message['attachments'])) {
                $this->warn("Ignoring malformed attachments in Discord message {$id}.");
            } else {
                foreach ($message['attachments'] as $attachment) {
                    if (! is_array($attachment)) {
                        $this->warn("Ignoring malformed attachment in Discord message {$id}.");

                        continue;
                    }
                    $attachments[] = [
                        'content_type' => $this->optionalString($attachment, 'content_type', 'Discord attachment'),
                        'url' => $this->optionalString($attachment, 'url', 'Discord attachment'),
                    ];
                }
            }
        }

        $embeds = [];
        if (isset($message['embeds'])) {
            if (! is_array($message['embeds']) || ! array_is_list($message['embeds'])) {
                $this->warn("Ignoring malformed embeds in Discord message {$id}.");
            } else {
                foreach ($message['embeds'] as $embed) {
                    if (! is_array($embed)) {
                        $this->warn("Ignoring malformed embed in Discord message {$id}.");

                        continue;
                    }
                    $embeds[] = [
                        'image' => $this->nestedUrl($embed, 'image', $id),
                        'thumbnail' => $this->nestedUrl($embed, 'thumbnail', $id),
                    ];
                }
            }
        }

        return [
            'id' => $id,
            'content' => $content,
            'timestamp' => $timestamp,
            'author' => $author,
            'attachments' => $attachments,
            'embeds' => $embeds,
        ];
    }

    /**
     * @param  array<string|int, mixed>  $embed
     */
    private function nestedUrl(array $embed, string $key, string $messageId): ?string
    {
        if (! isset($embed[$key])) {
            return null;
        }
        if (! is_array($embed[$key])) {
            $this->warn("Ignoring malformed {$key} in Discord message {$messageId}.");

            return null;
        }

        return $this->optionalString($embed[$key], 'url', "Discord embed {$key}");
    }
}
