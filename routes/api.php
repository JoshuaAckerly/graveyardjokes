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

use App\Http\Controllers\Api\BusinessProfileController;
use App\Http\Controllers\Api\SocialScheduleController;

// Google Business Profile — public read endpoints (cached server-side)
Route::prefix('business')->group(function () {
    Route::get('/reviews', [BusinessProfileController::class, 'reviews']);
    Route::get('/info', [BusinessProfileController::class, 'info']);
    Route::get('/posts', [BusinessProfileController::class, 'posts']);
});

// Google Business Profile — write endpoints (admin only, session auth)
Route::prefix('business')->middleware(['auth', 'admin'])->group(function () {
    Route::post('/reviews/{reviewId}/reply', [BusinessProfileController::class, 'replyToReview']);
    Route::post('/posts', [BusinessProfileController::class, 'createPost']);
});

// Social media post scheduling — protected by SOCIAL_SCHEDULE_SECRET bearer token
Route::post('/social/schedule', [SocialScheduleController::class, 'store']);
Route::get('/social/schedule', [SocialScheduleController::class, 'index']);
Route::delete('/social/schedule', [SocialScheduleController::class, 'destroyBulk']);
