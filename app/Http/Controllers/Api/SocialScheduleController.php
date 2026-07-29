<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SocialScheduledPost;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SocialScheduleController extends Controller
{
    private const PLATFORMS = ['discord', 'twitter', 'facebook', 'instagram', 'google_business'];

    public function store(Request $request): JsonResponse
    {
        // Validate bearer token
        $secret = config('social.schedule_secret');
        $provided = $request->bearerToken();

        if (empty($secret) || ! hash_equals($secret, (string) $provided)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Validate payload
        $data = $request->validate([
            'platform' => ['required', 'string', 'in:'.implode(',', self::PLATFORMS)],
            'content' => ['required', 'string', 'max:5000'],
            'scheduled_at' => ['required', 'string'],
            'media_url' => ['nullable', 'url'],
        ]);

        // Parse human-friendly date strings ("tomorrow 9am", "2026-05-11 09:00", "now")
        try {
            $scheduledAt = Carbon::parse($data['scheduled_at']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid scheduled_at: '.$e->getMessage()], 422);
        }

        // Reject if an identical pending post already exists — prevents the
        // triple-post bug caused by scheduling the same content multiple times.
        $exists = SocialScheduledPost::where('platform', $data['platform'])
            ->where('content', $data['content'])
            ->where('scheduled_at', $scheduledAt)
            ->whereIn('status', ['pending', 'processing'])
            ->exists();

        if ($exists) {
            return response()->json([
                'error' => 'A post with identical platform, content, and scheduled_at already exists.',
            ], 409);
        }

        $post = SocialScheduledPost::create([
            'platform' => $data['platform'],
            'content' => $data['content'],
            'media_url' => $data['media_url'] ?? null,
            'scheduled_at' => $scheduledAt,
            'status' => 'pending',
        ]);

        return response()->json([
            'id' => $post->id,
            'platform' => $post->platform,
            'scheduled_at' => $scheduledAt->toDateTimeString(),
            'status' => 'scheduled',
        ], 201);
    }

    public function index(Request $request): JsonResponse
    {
        // Validate bearer token
        $secret = config('social.schedule_secret');
        $provided = $request->bearerToken();

        if (empty($secret) || ! hash_equals($secret, (string) $provided)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $posts = SocialScheduledPost::orderBy('scheduled_at')
            ->get(['id', 'platform', 'content', 'media_url', 'scheduled_at', 'status', 'posted_at', 'error_message']);

        return response()->json(['data' => $posts]);
    }

    /** DELETE /api/social/schedule?status=failed&platform=facebook — bulk delete by filter. */
    public function destroyBulk(Request $request): JsonResponse
    {
        $secret = config('social.schedule_secret');
        $provided = $request->bearerToken();

        if (empty($secret) || ! hash_equals($secret, (string) $provided)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $data = $request->validate([
            'status' => ['nullable', 'string', 'in:pending,processing,posted,failed,cancelled'],
            'platform' => ['nullable', 'string', 'in:'.implode(',', self::PLATFORMS)],
        ]);

        $query = SocialScheduledPost::query();

        if (! empty($data['status'])) {
            $query->where('status', $data['status']);
        }

        if (! empty($data['platform'])) {
            $query->where('platform', $data['platform']);
        }

        // Require at least one filter to prevent accidental wipe of everything.
        if (empty($data['status']) && empty($data['platform'])) {
            return response()->json(['error' => 'Provide at least one filter: status or platform.'], 422);
        }

        $count = $query->count();
        $query->delete();

        return response()->json(['deleted' => $count]);
    }
}
