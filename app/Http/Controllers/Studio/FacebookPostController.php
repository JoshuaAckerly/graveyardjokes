<?php

namespace App\Http\Controllers\Studio;

use App\Http\Controllers\Controller;
use App\Models\FacebookGalleryPost;
use Inertia\Inertia;

class FacebookPostController extends Controller
{
    public function index()
    {
        $posts = FacebookGalleryPost::active()
            ->orderBy('sort_order')
            ->orderByDesc('posted_at')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'title' => $p->title,
                'description' => $p->description,
                'thumbnail_url' => $p->thumbnail_url,
                'post_url' => $p->post_url,
                'posted_at' => $p->posted_at?->format('Y-m-d'),
            ]);

        return Inertia::render('studio/Facebook', ['posts' => $posts]);
    }
}
