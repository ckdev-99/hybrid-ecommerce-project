<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Request  $request
     * @param  \Closure  $next
     * @param  string  $role
     * @return Response
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!$request->user()?->hasRole($role)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. This action requires ' . $role . ' privileges.',
            ], 403);
        }

        return $next($request);
    }
}
