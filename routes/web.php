<?php

use App\Http\Controllers\OgImageController;
use App\Http\Controllers\WebsiteIntakeController;
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

Route::get('/portfolio', function () {
    return Inertia::render('portfolio');
})->name('portfolio');

Route::get('/services', function () {
    return Inertia::render('services');
})->name('services');

Route::get('/services/starter', function () {
    return Inertia::render('services/starter');
})->name('services.starter');

Route::get('/services/professional', function () {
    return Inertia::render('services/professional');
})->name('services.professional');

Route::get('/services/premium', function () {
    return Inertia::render('services/premium');
})->name('services.premium');

// Legacy design routes — 301 redirect to merged Web Dev & Design packages
Route::redirect('/services/design-starter', '/services/starter', 301)->name('services.design-starter');
Route::redirect('/services/design-professional', '/services/professional', 301)->name('services.design-professional');
Route::redirect('/services/design-premium', '/services/premium', 301)->name('services.design-premium');

// Website Modernization Services
Route::get('/services/modernization-starter', function () {
    return Inertia::render('services/modernization-starter');
})->name('services.modernization-starter');

Route::get('/services/modernization-professional', function () {
    return Inertia::render('services/modernization-professional');
})->name('services.modernization-professional');

Route::get('/services/modernization-premium', function () {
    return Inertia::render('services/modernization-premium');
})->name('services.modernization-premium');

Route::get('/services/intake', [WebsiteIntakeController::class, 'create'])->name('services.intake.create');
Route::post('/services/intake', [WebsiteIntakeController::class, 'store'])->name('services.intake.store');

// API endpoint to fetch and cache Open Graph images for external sites
Route::get('/api/fetch-og-image', [OgImageController::class, 'fetch'])->name('api.fetch-og-image');
Route::get('/api/og-cache/{filename}', [OgImageController::class, 'cached'])
    ->where('filename', '[A-Za-z0-9._-]+')
    ->name('api.og-cache.show');

Route::get('/studio', function () {
    return Inertia::render('studio');
})->name('studio');

Route::get('/linkedin', function () {
    return Inertia::render('linkedin');
})->name('linkedin');

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
        ->add(Url::create($base.'/contact'))
        ->add(Url::create($base.'/portfolio'))
        ->add(Url::create($base.'/services'))
        ->add(Url::create($base.'/services/starter'))
        ->add(Url::create($base.'/services/professional'))
        ->add(Url::create($base.'/services/premium'))
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
Route::redirect('/WBG410/home.php', '/portfolio', 301);
Route::redirect('/legal/terms', '/terms', 301);
Route::redirect('/legal/privacy', '/privacy', 301);
Route::redirect('/legal/cookies', '/cookies', 301);
// Auth routes are defined in routes/auth.php. Do not override them with blanket redirects
// which can cause crawlers and validation tools to see unexpected 301 responses.

// Redirects for missing pages
Route::redirect('/illustrations', '/contact', 301);
Route::redirect('/pricing', '/services', 301);

Route::get('/login', function () {
    $rawUrl = config('services.auth_system.url', '');
    $base = rtrim(is_string($rawUrl) ? $rawUrl : '', '/api');

    return redirect()->away("{$base}/login", 302);
});

Route::get('/register', function () {
    $rawUrl = config('services.auth_system.url', '');
    $base = rtrim(is_string($rawUrl) ? $rawUrl : '', '/api');

    return redirect()->away("{$base}/register", 302);
});

Route::get('/forgot-password', function () {
    $rawUrl = config('services.auth_system.url', '');
    $base = rtrim(is_string($rawUrl) ? $rawUrl : '', '/api');

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
