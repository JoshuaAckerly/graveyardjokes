<?php

namespace App\Http\Controllers\Studio;

use App\Http\Controllers\Controller;
use App\Models\FacebookGalleryPost;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class FacebookPostController extends Controller
{
    public function index(): Response
    {
        $posts = FacebookGalleryPost::active()
            ->orderBy('sort_order')
            ->orderByDesc('posted_at')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (FacebookGalleryPost $p): array => [
                'id' => $p->id,
                'title' => $p->title,
                'description' => $p->description,
                'thumbnail_url' => $p->thumbnail_url,
                'post_url' => $p->post_url,
                'posted_at' => $p->posted_at === null ? null : Carbon::parse($p->posted_at)->format('Y-m-d'),
            ]);

        return Inertia::render('studio/Facebook', ['posts' => $posts]);
    }
}
