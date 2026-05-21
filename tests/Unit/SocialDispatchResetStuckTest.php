<?php

namespace Tests\Unit;

use App\Models\SocialScheduledPost;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SocialDispatchResetStuckTest extends TestCase
{
    use RefreshDatabase;

    private function makePost(array $overrides = []): SocialScheduledPost
    {
        return SocialScheduledPost::create(array_merge([
            'platform'     => 'facebook',
            'content'      => 'Test content',
            'scheduled_at' => now()->subMinutes(10),
            'status'       => 'processing',
        ], $overrides));
    }

    // ── Core reset behaviour ─────────────────────────────────────────────────

    public function test_resets_stuck_processing_posts_to_pending(): void
    {
        $post = $this->makePost();

        // Back-date updated_at so it looks stuck
        SocialScheduledPost::where('id', $post->id)
            ->update(['updated_at' => now()->subMinutes(10)]);

        $this->artisan('social:dispatch:reset-stuck')->assertExitCode(0);

        $this->assertDatabaseHas('social_scheduled_posts', [
            'id'     => $post->id,
            'status' => 'pending',
        ]);
    }

    public function test_does_not_reset_recently_started_processing_posts(): void
    {
        // updated_at is fresh (just created) — within the 5-minute window
        $post = $this->makePost();

        $this->artisan('social:dispatch:reset-stuck')->assertExitCode(0);

        $this->assertDatabaseHas('social_scheduled_posts', [
            'id'     => $post->id,
            'status' => 'processing',
        ]);
    }

    public function test_does_not_touch_pending_posts(): void
    {
        $post = $this->makePost(['status' => 'pending']);

        SocialScheduledPost::where('id', $post->id)
            ->update(['updated_at' => now()->subHour()]);

        $this->artisan('social:dispatch:reset-stuck')->assertExitCode(0);

        $this->assertDatabaseHas('social_scheduled_posts', [
            'id'     => $post->id,
            'status' => 'pending',
        ]);
    }

    public function test_does_not_touch_posted_posts(): void
    {
        $post = $this->makePost(['status' => 'posted', 'posted_at' => now()->subHour()]);

        SocialScheduledPost::where('id', $post->id)
            ->update(['updated_at' => now()->subHour()]);

        $this->artisan('social:dispatch:reset-stuck')->assertExitCode(0);

        $this->assertDatabaseHas('social_scheduled_posts', [
            'id'     => $post->id,
            'status' => 'posted',
        ]);
    }

    public function test_does_not_touch_failed_posts(): void
    {
        $post = $this->makePost(['status' => 'failed', 'error_message' => 'err']);

        SocialScheduledPost::where('id', $post->id)
            ->update(['updated_at' => now()->subHour()]);

        $this->artisan('social:dispatch:reset-stuck')->assertExitCode(0);

        $this->assertDatabaseHas('social_scheduled_posts', [
            'id'     => $post->id,
            'status' => 'failed',
        ]);
    }

    // ── Output messages ──────────────────────────────────────────────────────

    public function test_outputs_no_stuck_posts_message_when_nothing_to_reset(): void
    {
        $this->artisan('social:dispatch:reset-stuck')
            ->expectsOutputToContain('No stuck posts found')
            ->assertExitCode(0);
    }

    public function test_outputs_count_of_reset_posts(): void
    {
        $this->makePost();
        $this->makePost(['platform' => 'twitter']);

        SocialScheduledPost::where('status', 'processing')
            ->update(['updated_at' => now()->subMinutes(10)]);

        $this->artisan('social:dispatch:reset-stuck')
            ->expectsOutputToContain('Reset 2 stuck post(s)')
            ->assertExitCode(0);
    }

    // ── Custom --minutes option ───────────────────────────────────────────────

    public function test_respects_custom_minutes_option(): void
    {
        $post = $this->makePost();

        // updated_at is 3 minutes ago — within default 5 min window but outside 2 min
        SocialScheduledPost::where('id', $post->id)
            ->update(['updated_at' => now()->subMinutes(3)]);

        $this->artisan('social:dispatch:reset-stuck', ['--minutes' => 2])
            ->expectsOutputToContain('Reset 1 stuck post(s)')
            ->assertExitCode(0);

        $this->assertDatabaseHas('social_scheduled_posts', [
            'id'     => $post->id,
            'status' => 'pending',
        ]);
    }
}
