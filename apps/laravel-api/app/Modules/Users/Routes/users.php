<?php

use App\Modules\Users\Controllers\ProfileController;
use App\Modules\Users\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Users Module Routes
|--------------------------------------------------------------------------
|
| User profile and management endpoints.
|
*/

// Protected routes - Current user profile
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
});

// Admin routes - User management (SuperAdmin and Admin only - level 2+)
Route::middleware(['auth:sanctum', 'role.level:2'])->prefix('admin')->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{user}/status', [UserController::class, 'updateStatus']);
});
