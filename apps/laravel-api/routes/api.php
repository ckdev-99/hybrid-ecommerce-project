<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Load module routes
$moduleRoutes = [
    app_path('Modules/Auth/Routes/auth.php'),
    app_path('Modules/Users/Routes/users.php'),
    app_path('Modules/Authorization/Routes/roles.php'),
    app_path('Modules/Categories/Routes/categories.php'),
    app_path('Modules/Products/Routes/products.php'),
];

foreach ($moduleRoutes as $routeFile) {
    if (file_exists($routeFile)) {
        require_once $routeFile;
    }
}

// Health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toIso8601String(),
    ]);
})->name('health');
