<?php

use App\Modules\Categories\Controllers\CategoryController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Categories Module Routes
|--------------------------------------------------------------------------
|
| Product category management endpoints.
|
*/

// Public routes - Browse categories
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/parents', [CategoryController::class, 'parents']);
Route::get('/categories/featured', [CategoryController::class, 'featured']);
Route::get('/categories/tree', [CategoryController::class, 'tree']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);

// Admin routes - Category management
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    // Role level check: Level 2 and above (Admin, SuperAdmin)  
    Route::middleware('role.level:2')->group(function () {
        Route::post('/store/categories', [CategoryController::class, 'store']);
        Route::put('/update/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/delete/categories/{category}', [CategoryController::class, 'destroy']);
        Route::post('/categories/reorder', [CategoryController::class, 'reorder']);
    });
});
