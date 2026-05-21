<?php

namespace Tests\Unit;

use App\Models\SocialScheduledPost;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SocialScheduleCommandTest extends TestCase
{
    use RefreshDatabase;

    // ── Validation ────────────────────────────────────────────────────────────

    public function test_fails_when_invalid_platform_passed_as_option(): void
    {
        $this->artisan('social:schedule', [
            '--platform' => 'tiktok',
            '--content' => 'Hello',
            '--at' => now()->addDay()->toDateTimeString(),
        ])->assertExitCode(1);

        $this->assertDatabaseCount('social_scheduled_posts', 0);
    }

    public function test_fails_when_unparseable_date_passed(): void
    {
        $this->artisan('social:schedule', [
            '--platform' => 'facebook',
            '--content' => 'Hello',
            '--at' => 'not-a-date-xyzzy-12345',
        ])
            ->expectsOutputToContain('Could not parse date/time')
            ->assertExitCode(1);

        $this->assertDatabaseCount('social_scheduled_posts', 0);
    }

    public function test_fails_for_instagram_without_media_url(): void
    {
        $this->artisan('social:schedule', [
            '--platform' => 'instagram',
            '--content' => 'Hello',
            '--at' => now()->addDay()->toDateTimeString(),
            '--media-url' => null,
        ])
        // The command will interactively ask for media-url; simulate an empty answer
            ->expectsQuestion('Instagram requires a public image URL. Enter it now (or leave blank to cancel)', '')
            ->assertExitCode(1);

        $this->assertDatabaseCount('social_scheduled_posts', 0);
    }

    // ── Successful scheduling ─────────────────────────────────────────────────

    public function test_creates_post_with_all_options(): void
    {
        $at = now()->addDay()->toDateTimeString();

        $this->artisan('social:schedule', [
            '--platform' => 'facebook',
            '--content' => 'Scheduled via CLI',
            '--at' => $at,
        ])->assertExitCode(0);

        $this->assertDatabaseHas('social_scheduled_posts', [
            'platform' => 'facebook',
            'content' => 'Scheduled via CLI',
            'status' => 'pending',
        ]);
    }

    public function test_creates_post_with_media_url(): void
    {
        $this->artisan('social:schedule', [
            '--platform' => 'instagram',
            '--content' => 'Instagram post',
            '--at' => now()->addDay()->toDateTimeString(),
            '--media-url' => 'https://example.com/image.jpg',
        ])->assertExitCode(0);

        $this->assertDatabaseHas('social_scheduled_posts', [
            'platform' => 'instagram',
            'media_url' => 'https://example.com/image.jpg',
            'status' => 'pending',
        ]);
    }

    // ── Deduplication guard ───────────────────────────────────────────────────

    public function test_warns_and_fails_when_identical_pending_post_exists(): void
    {
        $at = now()->addDay();

        SocialScheduledPost::create([
            'platform' => 'facebook',
            'content' => 'Duplicate post',
            'scheduled_at' => $at,
            'status' => 'pending',
        ]);

        $this->artisan('social:schedule', [
            '--platform' => 'facebook',
            '--content' => 'Duplicate post',
            '--at' => $at->toDateTimeString(),
        ])
            ->expectsOutputToContain('already exists')
            ->assertExitCode(1);

        // Only the original row should exist
        $this->assertDatabaseCount('social_scheduled_posts', 1);
    }

    public function test_warns_and_fails_when_identical_processing_post_exists(): void
    {
        $at = now()->subMinutes(5);

        SocialScheduledPost::create([
            'platform' => 'twitter',
            'content' => 'Being sent right now',
            'scheduled_at' => $at,
            'status' => 'processing',
        ]);

        $this->artisan('social:schedule', [
            '--platform' => 'twitter',
            '--content' => 'Being sent right now',
            '--at' => $at->toDateTimeString(),
        ])
            ->expectsOutputToContain('already exists')
            ->assertExitCode(1);

        $this->assertDatabaseCount('social_scheduled_posts', 1);
    }

    public function test_allows_same_content_on_different_platform(): void
    {
        $at = now()->addDay();

        SocialScheduledPost::create([
            'platform' => 'facebook',
            'content' => 'Cross-platform post',
            'scheduled_at' => $at,
            'status' => 'pending',
        ]);

        $this->artisan('social:schedule', [
            '--platform' => 'twitter',
            '--content' => 'Cross-platform post',
            '--at' => $at->toDateTimeString(),
        ])->assertExitCode(0);

        $this->assertDatabaseCount('social_scheduled_posts', 2);
    }

    public function test_allows_same_content_at_different_time(): void
    {
        SocialScheduledPost::create([
            'platform' => 'discord',
            'content' => 'Weekly update',
            'scheduled_at' => now()->addDay(),
            'status' => 'pending',
        ]);

        $this->artisan('social:schedule', [
            '--platform' => 'discord',
            '--content' => 'Weekly update',
            '--at' => now()->addDays(7)->toDateTimeString(),
        ])->assertExitCode(0);

        $this->assertDatabaseCount('social_scheduled_posts', 2);
    }
}
