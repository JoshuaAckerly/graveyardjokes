<?php

use App\Http\Controllers\ContactController;
use App\Http\Controllers\VisitorController;
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

Route::get('/terms', fn() => Inertia::render('legal/terms'))->name('terms');
Route::get('/privacy', fn() => Inertia::render('legal/privacy'))->name('privacy');
Route::get('/cookies', fn() => Inertia::render('legal/cookies'))->name('cookies');

Route::match(['post', 'options'], '/track-visit', [VisitorController::class, 'track']);

// Test route for subdomain tracking
Route::get('/tracking-test', function () {
    return view('tracking-test');
});

Route::get('/generate-sitemap', function () {
    Sitemap::create()
        ->add(Url::create('/'))
        ->add(Url::create('/about'))
        ->add(Url::create('/contact'))
        ->add(Url::create('/portfolio'))
        ->writeToFile(public_path('sitemap.xml'));

    return 'Sitemap generated!';
});

// Redirect old pages to homepage or anchors
Route::redirect('/services', '/contact', 301);
Route::redirect('/WBG410/home.php', '/portfolio', 301);
Route::redirect('/legal/terms', '/terms', 301);
Route::redirect('/legal/privacy', '/privacy', 301);
Route::redirect('/legal/cookies', '/cookies', 301);
Route::redirect('/login', '/about', 301);
Route::redirect('/register', '/about', 301);
Route::redirect('/reset-password', '/about', 301);
Route::redirect('/forgot-password', '/about', 301);
Route::redirect('/reset-password/{token}', '/about', 301);
Route::redirect('/verify-email', '/about', 301);
Route::redirect('/confirm-password', '/about', 301);

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


Route::fallback(function () {
    abort(404);
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
