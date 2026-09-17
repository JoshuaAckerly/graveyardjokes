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

        if (empty($token) || empty($channelId)) {
            $this->error('DISCORD_BOT_TOKEN and DISCORD_CHANNEL_ID must be set.');
            $this->line('');
            $this->line('To set up:');
            $this->line('  1. Go to https://discord.com/developers/applications and create a bot.');
            $this->line('  2. Add the bot to your server with the Read Messages / View Channels permission.');
            $this->line('  3. Set DISCORD_BOT_TOKEN and DISCORD_CHANNEL_ID in your .env.');

            return self::FAILURE;
        }

        $limit = min((int) $this->option('limit'), 100);
        $dryRun = $this->option('dry-run');

        $client = new Client([
            'timeout' => 20,
            'http_errors' => false,
            'headers' => ['Authorization' => "Bot {$token}"],
        ]);

        $this->info("Fetching up to {$limit} messages from channel {$channelId}…");

        // Fetch guild_id from the channel — it's not included in message objects
        $guildId = null;
        try {
            $chanResponse = $client->get(self::API."/channels/{$channelId}");
            $chanData = json_decode((string) $chanResponse->getBody(), true);
            $guildId = $chanData['guild_id'] ?? null;
        } catch (\Throwable) {
        }

        try {
            $response = $client->get(self::API."/channels/{$channelId}/messages", [
                'query' => ['limit' => $limit],
            ]);
        } catch (RequestException $e) {
            $this->error('Discord API request failed: '.$e->getMessage());

            return self::FAILURE;
        }

        $body = json_decode((string) $response->getBody(), true);

        if (isset($body['code'])) {
            $this->error("Discord API error {$body['code']}: ".($body['message'] ?? 'unknown'));

            return self::FAILURE;
        }

        $imported = 0;
        $skipped = 0;

        foreach ($body as $msg) {
            // Skip messages with neither text nor attachments/embeds
            $hasContent = ! empty($msg['content']);
            $hasAttachment = ! empty($msg['attachments']) || ! empty($msg['embeds']);
            if (! $hasContent && ! $hasAttachment) {
                $skipped++;

                continue;
            }

            $jumpUrl = "https://discord.com/channels/{$guildId}/{$channelId}/{$msg['id']}";

            if (! $dryRun && DiscordPost::where('jump_url', $jumpUrl)->exists()) {
                $skipped++;

                continue;
            }

            $imageUrl = null;
            foreach ($msg['attachments'] ?? [] as $attachment) {
                if (str_starts_with($attachment['content_type'] ?? '', 'image/')) {
                    $imageUrl = $attachment['url'];
                    break;
                }
            }
            // Also check embeds for image
            if (! $imageUrl) {
                foreach ($msg['embeds'] ?? [] as $embed) {
                    $imageUrl = $embed['image']['url'] ?? $embed['thumbnail']['url'] ?? null;
                    if ($imageUrl) {
                        break;
                    }
                }
            }

            $content = $msg['content'];
            $firstLine = strtok($content, "\n");

            if ($dryRun) {
                $this->line("  [dry-run] {$msg['id']}: ".substr($firstLine, 0, 80));
                $imported++;

                continue;
            }

            DiscordPost::create([
                'title' => \Str::limit($firstLine, 100),
                'content' => $content,
                'author' => $msg['author']['username'] ?? null,
                'channel' => $channelId,
                'jump_url' => $jumpUrl,
                'image_url' => $imageUrl,
                'is_published' => true,
                'posted_at' => $msg['timestamp'],
            ]);
            $imported++;
        }

        $this->info("Done. Imported: {$imported}, Skipped: {$skipped}");

        return self::SUCCESS;
    }
}
