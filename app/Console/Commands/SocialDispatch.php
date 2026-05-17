<?php

namespace App\Console\Commands;

use App\Models\SocialScheduledPost;
use App\Services\SocialPoster\DiscordService;
use App\Services\SocialPoster\FacebookService;
use App\Services\SocialPoster\InstagramService;
use App\Services\SocialPoster\TwitterService;
use GuzzleHttp\Client;
use Illuminate\Console\Command;

class SocialDispatch extends Command
{
    protected $signature = 'social:dispatch';

    protected $description = 'Fire all social media posts that are due right now.';

    public function handle(): int
    {
        if (! app()->isProduction()) {
            $this->warn('social:dispatch is disabled outside of production. No posts were sent.');

            return self::SUCCESS;
        }

        $posts = SocialScheduledPost::due()->get();

        if ($posts->isEmpty()) {
            $this->line('No posts due.');

            return self::SUCCESS;
        }

        $client = new Client(['timeout' => 15]);

        foreach ($posts as $post) {
            try {
                $this->fire($post, $client);

                $post->update([
                    'status' => 'posted',
                    'posted_at' => now(),
                ]);

                $this->info("[{$post->platform}] Posted: ".\Str::limit($post->content, 60));
            } catch (\Throwable $e) {
                $post->update([
                    'status' => 'failed',
                    'error_message' => $e->getMessage(),
                ]);

                $this->error("[{$post->platform}] Failed: ".$e->getMessage());
            }
        }

        return self::SUCCESS;
    }

    private function fire(SocialScheduledPost $post, Client $client): void
    {
        match ($post->platform) {
            'discord' => (new DiscordService($client))->post($post->content, $post->media_url),
            'twitter' => (new TwitterService($client))->post($post->content),
            'facebook' => (new FacebookService($client))->post($post->content, $post->media_url),
            'instagram' => $this->fireInstagram($post, $client),
            default => throw new \RuntimeException("Unknown platform: {$post->platform}"),
        };
    }

    private function fireInstagram(SocialScheduledPost $post, Client $client): void
    {
        if (empty($post->media_url)) {
            throw new \RuntimeException('Instagram posts require a media_url (public image URL).');
        }

        (new InstagramService($client))->post($post->content, $post->media_url);
    }
}
