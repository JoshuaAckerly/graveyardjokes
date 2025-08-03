<?php

use App\Http\Controllers\ContactController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

Route::get('/terms', fn () => Inertia::render('legal/terms'))->name('terms');
Route::get('/privacy', fn () => Inertia::render('legal/privacy'))->name('privacy');
Route::get('/cookies', fn () => Inertia::render('legal/cookies'))->name('cookies');


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
