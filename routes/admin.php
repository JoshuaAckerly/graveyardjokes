<?php

use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\Admin\SocialScheduleController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics');
    Route::get('/social-schedule', [SocialScheduleController::class, 'index'])->name('social-schedule.index');
});
