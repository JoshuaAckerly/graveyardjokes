<?php

namespace App\Http\Controllers\Studio;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Inertia\Inertia;
use Inertia\Response;

class BlogPostController extends Controller
{
    public function index(): Response
    {
        $posts = BlogPost::published()
            ->orderByDesc('published_at')
            ->select(['id', 'title', 'slug', 'excerpt', 'featured_image', 'author', 'published_at'])
            ->get();

        return Inertia::render('studio/Blog/Index', [
            'posts' => $posts,
        ]);
    }

    public function show(string $slug): Response
    {
        $post = BlogPost::published()
            ->where('slug', $slug)
            ->firstOrFail();

        return Inertia::render('studio/Blog/Show', [
            'post' => $post,
        ]);
    }
}
