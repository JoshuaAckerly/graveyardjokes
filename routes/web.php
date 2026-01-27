// Redirect /auth/login to auth-system login page
Route::get('/auth/login', function () {
    return redirect()->away('http://localhost:8007/login');
});
<?php

use App\Http\Controllers\JokeController;
use App\Http\Controllers\OgImageController;
use App\Modules\Contact\Controllers\ContactController;
use App\Modules\Visitor\Controllers\VisitorController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

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

// API endpoint to fetch and cache Open Graph images for external sites
Route::get('/api/fetch-og-image', [OgImageController::class, 'fetch'])->name('api.fetch-og-image');

Route::get('/terms', fn () => Inertia::render('legal/terms'))->name('terms');
Route::get('/privacy', fn () => Inertia::render('legal/privacy'))->name('privacy');
Route::get('/cookies', fn () => Inertia::render('legal/cookies'))->name('cookies');

Route::match(['post', 'options'], '/track-visit', [VisitorController::class, 'track']);

// Random joke endpoint (returns JSON)
Route::get('/api/random-joke', [JokeController::class, 'random'])->name('api.random-joke');

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

    Sitemap::create()
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
        ->add(Url::create($base.'/cookies'))
        ->writeToFile(public_path('sitemap.xml'));

    return 'Sitemap generated!';
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
Route::redirect('/demo', '/', 301);
Route::redirect('/cryptescape', '/', 301);

// Auth pages - login, register, forgot-password now enabled

// Handle /cryptescape properly for SEO
Route::get('/cryptescape', function () {
    // Page is gone permanently
    abort(410);  // Sends HTTP 410 Gone to Google & browsers
});
Route::get('/demo', function () {
    // Page is gone permanently
    abort(410);  // Sends HTTP 410 Gone to Google & browsers
});

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
