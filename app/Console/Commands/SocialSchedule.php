<?php

namespace App\Console\Commands;

use App\Models\SocialScheduledPost;
use Illuminate\Console\Command;

class SocialSchedule extends Command
{
    protected $signature = 'social:schedule
        {--platform= : discord, twitter, facebook, or instagram}
        {--content=  : The post body text}
        {--at=       : When to post — any Carbon-parseable date/time (e.g. "2026-05-10 09:00", "tomorrow 9am")}
        {--media-url=: Public image URL (required for Instagram, optional for others)}';

    protected $description = 'Add a post to the social media scheduling queue.';

    private const PLATFORMS = ['discord', 'twitter', 'facebook', 'instagram'];

    public function handle(): int
    {
        $platform = $this->option('platform') ?? $this->choice(
            'Platform',
            self::PLATFORMS,
            1,
        );

        if (! in_array($platform, self::PLATFORMS, true)) {
            $this->error("Invalid platform: {$platform}. Choose from: ".implode(', ', self::PLATFORMS));

            return self::FAILURE;
        }

        $content = $this->option('content') ?? $this->ask('Post content');

        if (empty($content)) {
            $this->error('Content cannot be empty.');

            return self::FAILURE;
        }

        $atRaw = $this->option('at') ?? $this->ask('Schedule date/time (e.g. "2026-05-10 09:00")');

        try {
            $scheduledAt = \Carbon\Carbon::parse($atRaw);
        } catch (\Exception) {
            $this->error("Could not parse date/time: {$atRaw}");

            return self::FAILURE;
        }

        $mediaUrl = $this->option('media-url');

        if ($platform === 'instagram' && empty($mediaUrl)) {
            $mediaUrl = $this->ask('Instagram requires a public image URL. Enter it now (or leave blank to cancel)');
            if (empty($mediaUrl)) {
                $this->error('Cancelled — Instagram posts require a media_url.');

                return self::FAILURE;
            }
        }

        $post = SocialScheduledPost::create([
            'platform' => $platform,
            'content' => $content,
            'media_url' => $mediaUrl ?: null,
            'scheduled_at' => $scheduledAt,
            'status' => 'pending',
        ]);

        $this->info("Scheduled post #{$post->id} on {$platform} for {$scheduledAt->toDateTimeString()}.");

        return self::SUCCESS;
    }
}
