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

Route::redirect('/services', '/#services', 301);
Route::redirect('/WBG410/home.php', '/', 301);


Route::fallback(function () {
    abort(404);
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
