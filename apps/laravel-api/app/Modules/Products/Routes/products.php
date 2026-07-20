<?php

use App\Modules\Products\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Products Module Routes
|--------------------------------------------------------------------------
|
| Product management endpoints.
|
*/

// Public routes - Browse products
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/featured', [ProductController::class, 'featured']);
Route::get('/products/{product}', [ProductController::class, 'show']);

// Admin routes - Product management
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::middleware('role.level:2')->group(function () {
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{product}', [ProductController::class, 'update']);
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);
        Route::put('/products/{product}/stock', [ProductController::class, 'updateStock']);
        Route::get('/all-categories', [ProductController::class, 'getCategoriesList']);
    });
});
