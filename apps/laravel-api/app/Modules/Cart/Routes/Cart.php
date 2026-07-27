<?php

use App\Modules\Cart\Controllers\CartController;
use Illuminate\Support\Facades\Route;

// Public routes (cart accessible to guests and authenticated users)
Route::prefix('cart')->group(function () {
    Route::get('/', [CartController::class, 'index']);
    Route::post('/items', [CartController::class, 'addItem']);
    Route::put('/items/{id}', [CartController::class, 'updateItem']);
    Route::delete('/items/{id}', [CartController::class, 'removeItem']);
    Route::delete('/', [CartController::class, 'clearCart']);
});
