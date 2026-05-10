<?php

use App\Http\Controllers\JokeController;
use App\Http\Controllers\OgImageController;
use App\Modules\Visitor\Controllers\VisitorController;

// API endpoint to fetch and cache Open Graph images for external sites
Route::get('/fetch-og-image', [OgImageController::class, 'fetch'])->name('api.fetch-og-image');

// Visitor tracking (POST/OPTIONS) with rate limiting
Route::middleware(['throttle:60,1'])->group(function () {
    Route::post('/track-visit', [VisitorController::class, 'track']);
    Route::options('/track-visit', [VisitorController::class, 'track']);
});

// Random joke endpoint (returns JSON)
Route::get('/random-joke', [JokeController::class, 'random'])->name('api.random-joke');

use App\Http\Controllers\Api\MessageProxyController;
use App\Http\Controllers\Api\SocialScheduleController;
use App\Http\Controllers\Api\UserProxyController;

Route::middleware('auth-system')->group(function () {
    Route::get('/user', [UserProxyController::class, 'user']);
    Route::get('/purchases', [UserProxyController::class, 'purchases']);
});

Route::get('/messages', [MessageProxyController::class, 'index']);
Route::patch('/messages/read-all', [MessageProxyController::class, 'markAllRead']);
Route::patch('/messages/{id}/read', [MessageProxyController::class, 'markRead']);

// Social media post scheduling — protected by SOCIAL_SCHEDULE_SECRET bearer token
Route::post('/social/schedule', [SocialScheduleController::class, 'store']);
Route::get('/social/schedule', [SocialScheduleController::class, 'index']);
