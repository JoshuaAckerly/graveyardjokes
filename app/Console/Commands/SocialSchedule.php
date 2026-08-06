<?php

namespace App\Console\Commands;

use App\Models\SocialScheduledPost;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SocialSchedule extends Command
{
    protected $signature = 'social:schedule
        {--platform= : discord, twitter, facebook, instagram, or google_business}
        {--content=  : The post body text}
        {--at=       : When to post — any Carbon-parseable date/time (e.g. "2026-05-10 09:00", "tomorrow 9am")}
        {--media-url= : Public image URL (required for Instagram, optional for others)}';

    protected $description = 'Add a post to the social media scheduling queue.';

    private const PLATFORMS = ['discord', 'twitter', 'facebook', 'instagram', 'google_business', 'linkedin'];

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
            $scheduledAt = Carbon::parse($atRaw);
        } catch (\Throwable) {
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

        // Warn if an identical pending post already exists.
        $exists = SocialScheduledPost::where('platform', $platform)
            ->where('content', $content)
            ->where('scheduled_at', $scheduledAt)
            ->whereIn('status', ['pending', 'processing'])
            ->exists();

        if ($exists) {
            $this->warn('A pending post with identical platform, content, and scheduled_at already exists. Skipping to avoid duplicates.');

            return self::FAILURE;
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
