<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RequireAuthSystemToken
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();
        if (! $token) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Optionally, verify token with auth-system here
        return $next($request);
    }
}
