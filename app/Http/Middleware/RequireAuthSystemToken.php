<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class RequireAuthSystemToken
{
    public function handle(Request $request, Closure $next): JsonResponse|Response
    {
        $token = $request->bearerToken();
        if (! is_string($token) || empty($token)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        // Optionally, verify token with auth-system here
        $response = $next($request);
        if ($response instanceof JsonResponse || $response instanceof Response) {
            return $response;
        }

        // Always return a valid response type
        return response()->json(['error' => 'Invalid response type'], 500);
    }
}
