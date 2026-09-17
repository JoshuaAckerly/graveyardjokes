<?php

namespace App\Http\Controllers\Studio;

use App\Http\Controllers\Controller;
use App\Models\InstagramPost;
use Inertia\Inertia;

class InstagramPostController extends Controller
{
    public function index()
    {
        $posts = InstagramPost::active()
            ->orderByDesc('posted_at')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'instagram_id' => $p->instagram_id,
                'media_type' => $p->media_type,
                'media_url' => $p->media_url,
                'thumbnail_url' => $p->thumbnail_url,
                'caption' => $p->caption,
                'permalink' => $p->permalink,
                'posted_at' => $p->posted_at?->format('Y-m-d'),
            ]);

        return Inertia::render('studio/Instagram', ['posts' => $posts]);
    }
}
