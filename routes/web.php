<?php

use App\Http\Controllers\ContactController;
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
Route::redirect('/services', '/contact', 301);          // Anchor section on homepage
Route::redirect('/WBG410/home.php', '/', 301);           // Old PHP page → homepage
Route::redirect('/legal/terms', '/terms', 301);     // Old terms URL
Route::redirect('/legal/privacy', '/privacy', 301); // Old privacy URL
Route::redirect('/legal/cookies', '/cookies', 301); // Old cookies URL
Route::redirect('/login', '/', 301);                  // Old login page → homepage
Route::redirect('/register', '/', 301);               // Old register page → homepage
Route::redirect('/dashboard', '/', 301);              // Old dashboard page → homepage
Route::redirect('/home', '/', 301);                   // Old home page → homepage
Route::redirect('/forgot-password', '/', 301);        // Old forgot-password page → homepage
Route::redirect('/reset-password', '/', 301);         // Old reset-password page → homepage

// Handle /cryptescape properly for SEO
Route::get('/cryptescape', function () {
    // Page is gone permanently
    abort(410);  // Sends HTTP 410 Gone to Google & browsers
});


Route::fallback(function () {
    abort(404);
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
