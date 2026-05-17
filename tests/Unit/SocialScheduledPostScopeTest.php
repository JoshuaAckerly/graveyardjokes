<?php

namespace Tests\Unit;

use App\Models\SocialScheduledPost;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SocialScheduledPostScopeTest extends TestCase
{
    use RefreshDatabase;

    private function makePost(array $overrides = []): SocialScheduledPost
    {
        return SocialScheduledPost::create(array_merge([
            'platform'     => 'discord',
            'content'      => 'Test post content',
            'scheduled_at' => now()->subMinutes(5),
            'status'       => 'pending',
        ], $overrides));
    }

    public function test_due_scope_returns_pending_post_with_past_scheduled_at(): void
    {
        $this->makePost(['scheduled_at' => now()->subMinutes(5), 'status' => 'pending']);

        $this->assertCount(1, SocialScheduledPost::due()->get());
    }

    public function test_due_scope_returns_post_scheduled_exactly_now(): void
    {
        $this->makePost(['scheduled_at' => now(), 'status' => 'pending']);

        $this->assertCount(1, SocialScheduledPost::due()->get());
    }

    public function test_due_scope_excludes_future_posts(): void
    {
        $this->makePost(['scheduled_at' => now()->addMinutes(10), 'status' => 'pending']);

        $this->assertCount(0, SocialScheduledPost::due()->get());
    }

    public function test_due_scope_excludes_posted_status(): void
    {
        $this->makePost(['status' => 'posted', 'posted_at' => now()]);

        $this->assertCount(0, SocialScheduledPost::due()->get());
    }

    public function test_due_scope_excludes_failed_status(): void
    {
        $this->makePost(['status' => 'failed', 'error_message' => 'Connection refused']);

        $this->assertCount(0, SocialScheduledPost::due()->get());
    }

    public function test_due_scope_returns_all_pending_past_posts(): void
    {
        $this->makePost(['platform' => 'discord', 'scheduled_at' => now()->subHour()]);
        $this->makePost(['platform' => 'twitter', 'scheduled_at' => now()->subMinutes(30)]);
        $this->makePost(['platform' => 'facebook', 'scheduled_at' => now()->addMinutes(5)]); // future, excluded

        $this->assertCount(2, SocialScheduledPost::due()->get());
    }
}
