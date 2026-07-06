<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleLevelMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, int $level): Response
    {
        $user = $request->user();

        //check if user is authenticated
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated. Please Login.',
            ], 401);
        }

        // Check if user's level allows access (lower level = higher privilege)
        if ($user->min_level > $level) {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden. insufficient privileges.',
            ], 403);
        }
        return $next($request);
    }
}
