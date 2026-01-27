<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RequireAuthSystemToken
{
    public function handle(Request $request, Closure $next): \Illuminate\Http\JsonResponse|\Illuminate\Http\Response
    {
        $token = $request->bearerToken();
        if (! is_string($token) || empty($token)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        // Optionally, verify token with auth-system here
        $response = $next($request);
        if ($response instanceof \Illuminate\Http\JsonResponse || $response instanceof \Illuminate\Http\Response) {
            return $response;
        }

        // Always return a valid response type
        return response()->json(['error' => 'Invalid response type'], 500);
    }
}
