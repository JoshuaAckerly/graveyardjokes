<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/dashboard', fn () => Inertia::render('Dashboard'))->middleware('auth');


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
