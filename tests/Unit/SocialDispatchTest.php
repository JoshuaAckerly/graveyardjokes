<?php

namespace Tests\Unit;

use App\Models\SocialScheduledPost;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SocialDispatchTest extends TestCase
{
    use RefreshDatabase;

    private function makePost(array $overrides = []): SocialScheduledPost
    {
        return SocialScheduledPost::create(array_merge([
            'platform' => 'facebook',
            'content' => 'Test post content',
            'scheduled_at' => now()->subMinutes(5),
            'status' => 'pending',
        ], $overrides));
    }

    // ── Production guard ─────────────────────────────────────────────────────

    public function test_does_nothing_outside_production(): void
    {
        // Default test env is 'testing' — dispatch should be a no-op.
        $this->makePost();

        $this->artisan('social:dispatch')
            ->expectsOutputToContain('disabled outside of production')
            ->assertExitCode(0);

        $this->assertDatabaseHas('social_scheduled_posts', ['status' => 'pending']);
    }

    // ── Queue empty ──────────────────────────────────────────────────────────

    public function test_reports_no_posts_due_when_queue_is_empty(): void
    {
        $this->app['env'] = 'production';

        $this->artisan('social:dispatch')
            ->expectsOutputToContain('No posts due')
            ->assertExitCode(0);
    }

    // ── Already-terminal statuses are not re-processed ───────────────────────

    public function test_does_not_claim_already_processing_posts(): void
    {
        $this->app['env'] = 'production';

        $post = $this->makePost(['status' => 'processing']);

        $this->artisan('social:dispatch')->assertExitCode(0);

        // Still processing — dispatch must not touch it
        $this->assertDatabaseHas('social_scheduled_posts', [
            'id' => $post->id,
            'status' => 'processing',
        ]);
    }

    public function test_does_not_re_process_posted_posts(): void
    {
        $this->app['env'] = 'production';

        $post = $this->makePost(['status' => 'posted', 'posted_at' => now()->subMinutes(1)]);

        $this->artisan('social:dispatch')->assertExitCode(0);

        $this->assertDatabaseHas('social_scheduled_posts', [
            'id' => $post->id,
            'status' => 'posted',
        ]);
    }

    public function test_does_not_re_process_failed_posts(): void
    {
        $this->app['env'] = 'production';

        $post = $this->makePost(['status' => 'failed', 'error_message' => 'Previous error']);

        $this->artisan('social:dispatch')->assertExitCode(0);

        $this->assertDatabaseHas('social_scheduled_posts', [
            'id' => $post->id,
            'status' => 'failed',
        ]);
    }

    public function test_does_not_claim_future_posts(): void
    {
        $this->app['env'] = 'production';

        $post = $this->makePost(['scheduled_at' => now()->addHour()]);

        $this->artisan('social:dispatch')->assertExitCode(0);

        $this->assertDatabaseHas('social_scheduled_posts', [
            'id' => $post->id,
            'status' => 'pending',
        ]);
    }

    // ── Failure path (credentials absent in test env triggers RuntimeException) ──

    public function test_marks_post_failed_when_service_throws(): void
    {
        $this->app['env'] = 'production';

        // Social credentials are not configured in test env — the service will
        // throw RuntimeException('Facebook page credentials are not fully configured.')
        // which is caught by the command and stored as error_message.
        config(['social.facebook.page_id' => null, 'social.facebook.access_token' => null]);

        $post = $this->makePost(['platform' => 'facebook']);

        $this->artisan('social:dispatch')->assertExitCode(0);

        $this->assertDatabaseHas('social_scheduled_posts', [
            'id' => $post->id,
            'status' => 'failed',
        ]);

        $record = SocialScheduledPost::find($post->id);
        $this->assertNotEmpty($record->error_message);
    }

    public function test_stores_error_message_on_failure(): void
    {
        $this->app['env'] = 'production';

        config(['social.facebook.page_id' => null, 'social.facebook.access_token' => null]);

        $post = $this->makePost(['platform' => 'facebook']);

        $this->artisan('social:dispatch')->assertExitCode(0);

        $record = SocialScheduledPost::find($post->id);
        $this->assertStringContainsString('credentials', $record->error_message);
    }

    public function test_continues_processing_remaining_posts_after_one_fails(): void
    {
        $this->app['env'] = 'production';

        config([
            'social.facebook.page_id' => null,
            'social.discord.webhook_url' => null,
        ]);

        $facebook = $this->makePost(['platform' => 'facebook']);
        $discord = $this->makePost(['platform' => 'discord']);

        $this->artisan('social:dispatch')->assertExitCode(0);

        // Both should be 'failed' (no credentials), but both should have been attempted
        $this->assertSame('failed', SocialScheduledPost::find($facebook->id)->status);
        $this->assertSame('failed', SocialScheduledPost::find($discord->id)->status);
    }

    // ── Atomic claim: processing posts not picked up by a second run ──────────

    public function test_second_dispatch_does_not_re_claim_already_claimed_posts(): void
    {
        $this->app['env'] = 'production';

        config(['social.facebook.page_id' => null]);

        // First dispatch claims and fails the post
        $post = $this->makePost(['platform' => 'facebook']);
        $this->artisan('social:dispatch')->assertExitCode(0);

        $this->assertSame('failed', SocialScheduledPost::find($post->id)->status);

        // Second dispatch should find nothing due (post is now 'failed')
        $this->artisan('social:dispatch')
            ->expectsOutputToContain('No posts due')
            ->assertExitCode(0);
    }
}
