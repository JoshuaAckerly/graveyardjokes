<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SocialScheduledPost;
use Inertia\Inertia;
use Inertia\Response;

class SocialScheduleController extends Controller
{
    public function index(): Response
    {
        $posts = SocialScheduledPost::query()
            ->orderBy('scheduled_at')
            ->get()
            ->map(fn (SocialScheduledPost $post): array => [
                'id' => $post->id,
                'platform' => $post->platform ?? 'unknown',
                'content' => $post->content ?? '',
                'media_url' => $post->media_url,
                'scheduled_at' => $post->scheduled_at->toIso8601String(),
                'posted_at' => $post->posted_at?->toIso8601String(),
                'status' => $post->status ?? 'unknown',
                'error_message' => $post->error_message,
                'is_overdue' => $post->status === 'pending'
                    && $post->scheduled_at !== null
                    && now()->greaterThanOrEqualTo($post->scheduled_at),
            ])
            ->values();

        $counts = $posts->countBy('status');
        $countFor = static function (string $status) use ($counts): int {
            $count = $counts->get($status, 0);

            return is_int($count) ? $count : 0;
        };

        return Inertia::render('admin/SocialSchedule/Index', [
            'posts' => $posts,
            'stats' => [
                'total' => $posts->count(),
                'pending' => $countFor('pending'),
                'posted' => $countFor('posted'),
                'failed' => $countFor('failed'),
                'processing' => $countFor('processing'),
                'cancelled' => $countFor('cancelled'),
                'overdue_pending' => $posts->where('is_overdue', true)->count(),
            ],
        ]);
    }
}
