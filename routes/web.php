<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\OgImageController;
use App\Modules\Contact\Controllers\ContactController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\SitemapIndex;
use Spatie\Sitemap\Tags\Url;

Route::domain('www.graveyardjokes.com')->group(function () {
    Route::any('/{any?}', function (Request $request, ?string $any = null) {
        $path = ltrim((string) ($any ?? ''), '/');
        $target = 'https://graveyardjokes.com'.($path !== '' ? '/'.$path : '/');
        $query = $request->getQueryString();

        if (is_string($query) && $query !== '') {
            $target .= '?'.$query;
        }

        return redirect()->to($target, 301);
    })->where('any', '.*');
});

// ─── MAINTENANCE MODE (disabled — security audit complete) ──────────────────
// Uncomment to re-enable:
// Route::get('/{any}', function () {
//     return response()->view('errors.503', [], 503);
// })->where('any', '.*')->name('maintenance');
// ─────────────────────────────────────────────────────────────────────────────

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/about', function () {
    return Inertia::render('about');
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('contact');
})->name('contact');

Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

// ─── Web-dev/agency pages permanently removed in the music rebrand ──────────
// Return 410 Gone so search engines drop the old agency URLs cleanly.
Route::get('/portfolio', fn () => abort(410))->name('portfolio');
Route::get('/services', fn () => abort(410))->name('services');
Route::get('/services/{any}', fn () => abort(410))->where('any', '.*');
Route::post('/services/{any}', fn () => abort(410))->where('any', '.*');
Route::get('/linkedin', fn () => abort(410))->name('linkedin');
// ────────────────────────────────────────────────────────────────────────────

// API endpoint to fetch and cache Open Graph images for external sites
Route::get('/api/fetch-og-image', [OgImageController::class, 'fetch'])->name('api.fetch-og-image');
Route::get('/api/og-cache/{filename}', [OgImageController::class, 'cached'])
    ->where('filename', '[A-Za-z0-9._-]+')
    ->name('api.og-cache.show');

Route::get('/studio', function () {
    return Inertia::render('studio');
})->name('studio');

// ─── Studio section (merged from the studio app) ────────────────────────────
Route::prefix('studio')->name('studio.')->group(function () {
    Route::get('/blog', [\App\Http\Controllers\Studio\BlogPostController::class, 'index'])->name('blog.index');
    Route::get('/blog/{slug}', [\App\Http\Controllers\Studio\BlogPostController::class, 'show'])->name('blog.show');

    Route::get('/video-log', [\App\Http\Controllers\Studio\VideoLogController::class, 'index'])->name('video-log');
    Route::get('/video-log/api', [\App\Http\Controllers\Studio\VideoLogController::class, 'api'])->name('video-log.api');
    Route::get('/video-log/serve', [\App\Http\Controllers\Studio\VideoLogController::class, 'serve'])->name('video-log.serve');

    Route::get('/discord', [\App\Http\Controllers\Studio\DiscordPostController::class, 'index'])->name('discord');
    Route::get('/instagram', [\App\Http\Controllers\Studio\InstagramPostController::class, 'index'])->name('instagram');

    Route::get('/facebook', [\App\Http\Controllers\Studio\FacebookPostController::class, 'index'])->name('facebook');
    Route::get('/illustrations', [\App\Http\Controllers\Studio\IllustrationController::class, 'index'])->name('illustrations');
    Route::get('/illustrations/api', [\App\Http\Controllers\Studio\IllustrationController::class, 'api'])->name('illustrations.api');

    Route::post('/newsletter/subscribe', [\App\Http\Controllers\Studio\NewsletterController::class, 'store'])->name('newsletter.subscribe');
    Route::get('/newsletter/unsubscribe/{token}', [\App\Http\Controllers\Studio\NewsletterController::class, 'unsubscribe'])->name('newsletter.unsubscribe');

    Route::get('/admin/subscribers', [\App\Http\Controllers\Studio\Admin\SubscriberController::class, 'index'])
        ->middleware('auth')
        ->name('admin.subscribers');
});
// ────────────────────────────────────────────────────────────────────────────



// The Links hub was merged into /studio — redirect for anyone with the old URL.
Route::redirect('/links', '/studio', 301)->name('links');

Route::get('/terms', fn () => Inertia::render('legal/terms'))->name('terms');
Route::get('/privacy', fn () => Inertia::render('legal/privacy'))->name('privacy');
Route::get('/cookies', fn () => Inertia::render('legal/cookies'))->name('cookies');

// API Documentation
Route::get('/openapi.yaml', function () {
    return response()->file(base_path('openapi.yaml'), [
        'Content-Type' => 'application/x-yaml',
    ]);
})->name('api.openapi');

Route::get('/api/docs', function () {
    return response()->file(public_path('api-docs.html'));
})->name('api.docs');

// Test route for subdomain tracking
Route::get('/tracking-test', function () {
    return view('tracking-test');
});

Route::get('/generate-sitemap', function () {
    // Use the configured app URL as the base so generated sitemap contains
    // absolute URLs that match the production host (avoids .test entries).
    $rawBase = config('app.url', '');
    if (! is_string($rawBase)) {
        $rawBase = '';
    }
    $base = rtrim($rawBase, '/');

    $sitemap = Sitemap::create()
        ->add(Url::create($base.'/'))
        ->add(Url::create($base.'/about'))
        ->add(Url::create($base.'/links'))
        ->add(Url::create($base.'/contact'))
        ->add(Url::create($base.'/terms'))
        ->add(Url::create($base.'/privacy'))
        ->add(Url::create($base.'/cookies'));

    Storage::disk('public')->put('sitemap.xml', $sitemap->render());

    $index = SitemapIndex::create()->add($base.'/sitemap.xml');
    $subdomains = config('sitemaps.subdomains', []);

    if (is_array($subdomains)) {
        foreach ($subdomains as $subdomain) {
            if (is_string($subdomain) && $subdomain !== '') {
                $index->add('https://'.$subdomain.'.graveyardjokes.com/sitemap.xml');
            }
        }
    }

    Storage::disk('public')->put('sitemap_index.xml', $index->render());

    return 'Sitemap generated!';
});

Route::get('/sitemap.xml', function () {
    if (! Storage::disk('public')->exists('sitemap.xml')) {
        abort(404);
    }

    return response(Storage::disk('public')->get('sitemap.xml'), 200, [
        'Content-Type' => 'application/xml; charset=UTF-8',
    ]);
})->name('sitemap.xml');

Route::get('/sitemap_index.xml', function () {
    if (Storage::disk('public')->exists('sitemap_index.xml')) {
        return response(Storage::disk('public')->get('sitemap_index.xml'), 200, [
            'Content-Type' => 'application/xml; charset=UTF-8',
        ]);
    }

    $rawBase = config('app.url', '');
    if (! is_string($rawBase)) {
        $rawBase = '';
    }
    $base = rtrim($rawBase, '/');

    $index = SitemapIndex::create()->add($base.'/sitemap.xml');
    $subdomains = config('sitemaps.subdomains', []);

    if (is_array($subdomains)) {
        foreach ($subdomains as $subdomain) {
            if (is_string($subdomain) && $subdomain !== '') {
                $index->add('https://'.$subdomain.'.graveyardjokes.com/sitemap.xml');
            }
        }
    }

    return response($index->render(), 200, [
        'Content-Type' => 'application/xml; charset=UTF-8',
    ]);
})->name('sitemap.index');

// Handle /cryptescape and /demo as 410 Gone before any redirects
Route::get('/cryptescape', function () {
    abort(410);  // Sends HTTP 410 Gone to Google & browsers
});
Route::get('/demo', function () {
    abort(410);  // Sends HTTP 410 Gone to Google & browsers
});

// Redirect old pages to homepage or anchors
Route::redirect('/WBG410/home.php', '/', 301);
Route::redirect('/legal/terms', '/terms', 301);
Route::redirect('/legal/privacy', '/privacy', 301);
Route::redirect('/legal/cookies', '/cookies', 301);
// Auth routes are defined in routes/auth.php. Do not override them with blanket redirects
// which can cause crawlers and validation tools to see unexpected 301 responses.

// Redirects for missing pages
Route::redirect('/illustrations', '/contact', 301);
Route::redirect('/pricing', '/', 301);

Route::get('/login', function () {
    $rawUrl = config('services.auth_system.url', '');
    $base = preg_replace('#/api/?$#', '', is_string($rawUrl) ? $rawUrl : '') ?: 'https://auth-system.graveyardjokes.com';

    if (app()->environment('local') && $base === 'http://auth-system.graveyardjokes.test') {
        $base = 'http://auth-system.graveyardjokes.test:8007';
    }

    return redirect()->away("{$base}/login", 302);
});

Route::get('/register', function () {
    $rawUrl = config('services.auth_system.url', '');
    $base = preg_replace('#/api/?$#', '', is_string($rawUrl) ? $rawUrl : '') ?: 'https://auth-system.graveyardjokes.com';

    if (app()->environment('local') && $base === 'http://auth-system.graveyardjokes.test') {
        $base = 'http://auth-system.graveyardjokes.test:8007';
    }

    return redirect()->away("{$base}/register", 302);
});

Route::get('/forgot-password', function () {
    $rawUrl = config('services.auth_system.url', '');
    $base = preg_replace('#/api/?$#', '', is_string($rawUrl) ? $rawUrl : '') ?: 'https://auth-system.graveyardjokes.com';

    if (app()->environment('local') && $base === 'http://auth-system.graveyardjokes.test') {
        $base = 'http://auth-system.graveyardjokes.test:8007';
    }

    return redirect()->away("{$base}/forgot-password", 302);
});

Route::get('/reset-password/{token}', function (Request $request, string $token) {
    $target = 'https://auth-system.graveyardjokes.com/reset-password/'.$token;
    $query = $request->getQueryString();

    if (is_string($query) && $query !== '') {
        $target .= '?'.$query;
    }

    return redirect()->away($target, 302);
})->where('token', '.*');

// Explicitly mark auth-related endpoints as permanently removed (410 Gone)
// so crawlers get a clear signal instead of a redirect or soft-404.
// $goneRoutes and 410 aborts removed to re-enable auth routes

// OAuth callback — only used during gsc:authorize one-time setup
Route::get('/admin/oauth/gsc/callback', function (Request $request) {
    $code = $request->query('code');
    $error = $request->query('error');

    if ($error) {
        return response('<h1>OAuth Error</h1><p>'.htmlspecialchars((string) $error).'</p>', 400);
    }

    if (! $code) {
        return response('<h1>No code returned</h1>', 400);
    }

    return response(
        '<h1 style="font-family:monospace">Authorization Code</h1>'
        .'<p style="font-family:monospace;font-size:1.2em;word-break:break-all">'.htmlspecialchars((string) $code).'</p>'
        .'<p>Copy the code above and paste it into the <code>php artisan gsc:authorize</code> prompt.</p>',
        200
    );
})->name('oauth.gsc.callback');

Route::fallback(function () {
    abort(404);
});

Route::get('/test-csrf', function () {
    dd(csrf_token());
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

Route::get('/auth-system-demo', function () {
    return Inertia::render('AuthSystemDemoPage');
})->name('auth-system-demo');
