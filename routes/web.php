<?php

use App\Modules\Contact\Controllers\ContactController;
use App\Modules\Visitor\Controllers\VisitorController;
use App\Http\Controllers\JokeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;
use App\Http\Controllers\OgImageController;

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

// API endpoint to fetch and cache Open Graph images for external sites
Route::get('/api/fetch-og-image', [OgImageController::class, 'fetch'])->name('api.fetch-og-image');

Route::get('/terms', fn() => Inertia::render('legal/terms'))->name('terms');
Route::get('/privacy', fn() => Inertia::render('legal/privacy'))->name('privacy');
Route::get('/cookies', fn() => Inertia::render('legal/cookies'))->name('cookies');

Route::match(['post', 'options'], '/track-visit', [VisitorController::class, 'track']);

// Random joke endpoint (returns JSON)
Route::get('/api/random-joke', [JokeController::class, 'random'])->name('api.random-joke');

// Test route for subdomain tracking
Route::get('/tracking-test', function () {
    return view('tracking-test');
});

Route::get('/generate-sitemap', function () {
    // Use the configured app URL as the base so generated sitemap contains
    // absolute URLs that match the production host (avoids .test entries).
    $rawBase = config('app.url', '');
    if (!is_string($rawBase)) {
        $rawBase = '';
    }
    $base = rtrim($rawBase, '/');

    Sitemap::create()
        ->add(Url::create($base . '/'))
        ->add(Url::create($base . '/about'))
        ->add(Url::create($base . '/contact'))
        ->add(Url::create($base . '/portfolio'))
        ->writeToFile(public_path('sitemap.xml'));

    return 'Sitemap generated!';
});

// Redirect old pages to homepage or anchors
Route::redirect('/services', '/contact', 301);
Route::redirect('/WBG410/home.php', '/portfolio', 301);
Route::redirect('/legal/terms', '/terms', 301);
Route::redirect('/legal/privacy', '/privacy', 301);
Route::redirect('/legal/cookies', '/cookies', 301);
// Auth routes are defined in routes/auth.php. Do not override them with blanket redirects
// which can cause crawlers and validation tools to see unexpected 301 responses.

// Redirects for missing pages
Route::redirect('/illustrations', '/contact', 301);
Route::redirect('/pricing', '/plans');



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
$goneRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/reset-password/{token}',
    '/verify-email',
    '/confirm-password',
];

foreach ($goneRoutes as $route) {
    Route::match(['get', 'post'], $route, function () {
        abort(410);
    });
}


Route::fallback(function () {
    abort(404);
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
