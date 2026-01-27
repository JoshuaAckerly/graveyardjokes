<?php

use App\Http\Controllers\Api\UserProxyController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth-system')->group(function () {
    Route::get('/user', [UserProxyController::class, 'user']);
    Route::get('/purchases', [UserProxyController::class, 'purchases']);
});
