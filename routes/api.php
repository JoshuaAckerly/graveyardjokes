<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserProxyController;

Route::middleware('auth-system')->group(function () {
    Route::get('/user', [UserProxyController::class, 'user']);
    Route::get('/purchases', [UserProxyController::class, 'purchases']);
});
