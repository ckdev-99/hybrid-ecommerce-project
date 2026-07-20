<?php

use App\Modules\Authorization\Controllers\RoleController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Authorization Module Routes
|--------------------------------------------------------------------------
|
| Role and authorization management endpoints.
|
*/

// Public routes - Get roles
Route::get('/roles', [RoleController::class, 'index']);

// SuperAdmin routes - Role management (SuperAdmin only - level 1)
Route::middleware(['auth:sanctum', 'role.level:1'])->prefix('admin')->group(function () {
    Route::post('/roles', [RoleController::class, 'store']);
    Route::get('/roles/{role}', [RoleController::class, 'show']);
    Route::put('/roles/{role}', [RoleController::class, 'update']);
    Route::delete('/roles/{role}', [RoleController::class, 'destroy']);
    Route::post('/users/{user}/roles', [RoleController::class, 'assignRole']);
    Route::delete('/users/{user}/roles/{role}', [RoleController::class, 'removeRole']);
});
