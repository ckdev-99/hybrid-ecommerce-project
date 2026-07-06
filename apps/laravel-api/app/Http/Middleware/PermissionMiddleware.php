<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PermissionMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $user = $request->user();

        //check if user is authenticated
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated. Please Login.',
            ], 401);
        }

        // Check if user has the required permission
        if (!$user->hasPermissioln($permission)) {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden. You lack permission: ' . $permission,
            ], 403);
        }

        return $next($request);
    }
}
