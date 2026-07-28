<?php

use App\Modules\Cart\Controllers\CartController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'index']); // Get user's cart
        Route::post('/items', [CartController::class, 'addItem']); // Add item to cart
        Route::put('/items/{id}', [CartController::class, 'updateItem']); // Update item quantity
        Route::delete('/items/{id}', [CartController::class, 'removeItem']); // Remove item from cart
        Route::delete('/clear', [CartController::class, 'clearCart']); // Clear entire cart
    });
});
