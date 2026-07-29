<?php

namespace App\Console\Commands;

use App\Models\SocialScheduledPost;
use App\Services\GoogleBusinessProfileService;
use App\Services\SocialPoster\DiscordService;
use App\Services\SocialPoster\FacebookService;
use App\Services\SocialPoster\InstagramService;
use App\Services\SocialPoster\TwitterService;
use GuzzleHttp\Client;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

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

        // Atomically claim all due posts by transitioning them from pending →
        // processing inside a single transaction with a row-level lock.  Any
        // concurrent dispatch process that reaches this point simultaneously
        // will block on lockForUpdate() and find no rows left to claim once
        // the lock is released.
        $posts = DB::transaction(function () {
            $due = SocialScheduledPost::due()->lockForUpdate()->get();

            if ($due->isNotEmpty()) {
                SocialScheduledPost::whereIn('id', $due->pluck('id'))
                    ->update(['status' => 'processing']);
            }

            return $due;
        });

        if ($posts->isEmpty()) {
            $this->line('No posts due.');

            return self::SUCCESS;
        }

        // Timeout raised to 60 s to accommodate Instagram's container-status polling
        // (up to 10 polls × 3 s interval + HTTP round-trips per poll).
        $client = new Client(['timeout' => 60]);

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
            'google_business' => $this->fireGoogleBusiness($post),
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

    private function fireGoogleBusiness(SocialScheduledPost $post): void
    {
        (new GoogleBusinessProfileService)->createPost([
            'topicType' => 'STANDARD',
            'summary' => $post->content,
        ]);
    }
}
