<?php

namespace Tests\Feature;

use App\Models\SocialScheduledPost;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SocialScheduleApiTest extends TestCase
{
    use RefreshDatabase;

    private const SECRET = 'test-schedule-secret';

    protected function setUp(): void
    {
        parent::setUp();
        config(['social.schedule_secret' => self::SECRET]);
    }

    private function authHeader(): array
    {
        return ['Authorization' => 'Bearer '.self::SECRET];
    }

    // ── Authentication ────────────────────────────────────────────────────────

    public function test_returns_401_when_no_token_provided(): void
    {
        $this->postJson('/api/social/schedule', [
            'platform' => 'facebook',
            'content' => 'Hello',
            'scheduled_at' => now()->addHour()->toDateTimeString(),
        ])->assertStatus(401);
    }

    public function test_returns_401_when_wrong_token_provided(): void
    {
        $this->postJson('/api/social/schedule', [
            'platform' => 'facebook',
            'content' => 'Hello',
            'scheduled_at' => now()->addHour()->toDateTimeString(),
        ], ['Authorization' => 'Bearer wrong-secret'])->assertStatus(401);
    }

    // ── Validation ────────────────────────────────────────────────────────────

    public function test_returns_422_when_platform_is_missing(): void
    {
        $this->postJson('/api/social/schedule', [
            'content' => 'Hello',
            'scheduled_at' => now()->addHour()->toDateTimeString(),
        ], $this->authHeader())->assertStatus(422)->assertJsonValidationErrors(['platform']);
    }

    public function test_returns_422_when_platform_is_invalid(): void
    {
        $this->postJson('/api/social/schedule', [
            'platform' => 'tiktok',
            'content' => 'Hello',
            'scheduled_at' => now()->addHour()->toDateTimeString(),
        ], $this->authHeader())->assertStatus(422)->assertJsonValidationErrors(['platform']);
    }

    public function test_returns_422_when_content_is_missing(): void
    {
        $this->postJson('/api/social/schedule', [
            'platform' => 'facebook',
            'scheduled_at' => now()->addHour()->toDateTimeString(),
        ], $this->authHeader())->assertStatus(422)->assertJsonValidationErrors(['content']);
    }

    public function test_returns_422_when_scheduled_at_is_missing(): void
    {
        $this->postJson('/api/social/schedule', [
            'platform' => 'facebook',
            'content' => 'Hello',
        ], $this->authHeader())->assertStatus(422)->assertJsonValidationErrors(['scheduled_at']);
    }

    // ── Successful creation ───────────────────────────────────────────────────

    public function test_creates_post_and_returns_201(): void
    {
        $scheduledAt = now()->addDay()->toDateTimeString();

        $response = $this->postJson('/api/social/schedule', [
            'platform' => 'facebook',
            'content' => 'Hello world',
            'scheduled_at' => $scheduledAt,
        ], $this->authHeader());

        $response->assertStatus(201)
            ->assertJsonStructure(['id', 'platform', 'scheduled_at', 'status'])
            ->assertJsonFragment(['platform' => 'facebook', 'status' => 'scheduled']);

        $this->assertDatabaseHas('social_scheduled_posts', [
            'platform' => 'facebook',
            'content' => 'Hello world',
            'status' => 'pending',
        ]);
    }

    public function test_accepts_all_valid_platforms(): void
    {
        foreach (['facebook', 'discord', 'twitter', 'instagram'] as $i => $platform) {
            $this->postJson('/api/social/schedule', [
                'platform' => $platform,
                'content' => "Post for {$platform}",
                'scheduled_at' => now()->addDays($i + 1)->toDateTimeString(),
            ], $this->authHeader())->assertStatus(201);
        }

        $this->assertDatabaseCount('social_scheduled_posts', 4);
    }

    // ── Deduplication guard ───────────────────────────────────────────────────

    public function test_returns_409_when_identical_pending_post_exists(): void
    {
        $scheduledAt = now()->addDay();

        SocialScheduledPost::create([
            'platform' => 'facebook',
            'content' => 'Duplicate content',
            'scheduled_at' => $scheduledAt,
            'status' => 'pending',
        ]);

        $this->postJson('/api/social/schedule', [
            'platform' => 'facebook',
            'content' => 'Duplicate content',
            'scheduled_at' => $scheduledAt->toDateTimeString(),
        ], $this->authHeader())
            ->assertStatus(409)
            ->assertJsonFragment(['error' => 'A post with identical platform, content, and scheduled_at already exists.']);
    }

    public function test_returns_409_when_identical_processing_post_exists(): void
    {
        $scheduledAt = now()->subMinutes(5);

        SocialScheduledPost::create([
            'platform' => 'twitter',
            'content' => 'Being processed right now',
            'scheduled_at' => $scheduledAt,
            'status' => 'processing',
        ]);

        $this->postJson('/api/social/schedule', [
            'platform' => 'twitter',
            'content' => 'Being processed right now',
            'scheduled_at' => $scheduledAt->toDateTimeString(),
        ], $this->authHeader())
            ->assertStatus(409);
    }

    public function test_allows_same_content_on_different_platform(): void
    {
        $scheduledAt = now()->addDay();

        SocialScheduledPost::create([
            'platform' => 'facebook',
            'content' => 'Same content',
            'scheduled_at' => $scheduledAt,
            'status' => 'pending',
        ]);

        // Same content + time, different platform — should succeed
        $this->postJson('/api/social/schedule', [
            'platform' => 'twitter',
            'content' => 'Same content',
            'scheduled_at' => $scheduledAt->toDateTimeString(),
        ], $this->authHeader())->assertStatus(201);
    }

    public function test_allows_same_content_at_different_time(): void
    {
        SocialScheduledPost::create([
            'platform' => 'facebook',
            'content' => 'Recurring post',
            'scheduled_at' => now()->addDay(),
            'status' => 'pending',
        ]);

        // Same platform + content, different time — should succeed
        $this->postJson('/api/social/schedule', [
            'platform' => 'facebook',
            'content' => 'Recurring post',
            'scheduled_at' => now()->addDays(2)->toDateTimeString(),
        ], $this->authHeader())->assertStatus(201);
    }

    public function test_allows_repost_after_original_is_posted(): void
    {
        $scheduledAt = now()->addDay();

        SocialScheduledPost::create([
            'platform' => 'facebook',
            'content' => 'Already sent',
            'scheduled_at' => $scheduledAt,
            'status' => 'posted',
            'posted_at' => now(),
        ]);

        // 'posted' status should not block a new scheduling of the same content
        $this->postJson('/api/social/schedule', [
            'platform' => 'facebook',
            'content' => 'Already sent',
            'scheduled_at' => $scheduledAt->toDateTimeString(),
        ], $this->authHeader())->assertStatus(201);
    }
}
