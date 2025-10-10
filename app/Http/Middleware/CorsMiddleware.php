<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CorsMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Get the origin from the request
        $origin = $request->headers->get('Origin');
        
        // Check if origin is from a graveyardjokes subdomain or local development
        $isAllowedOrigin = $origin && (
            str_contains($origin, '.graveyardjokes.com') || 
            $origin === 'https://graveyardjokes.com' ||
            str_contains($origin, '.test') || // Allow local development
            str_contains($origin, 'localhost') ||
            str_contains($origin, '127.0.0.1')
        );

        // Handle preflight OPTIONS request
        if ($request->getMethod() === "OPTIONS" && $isAllowedOrigin) {
            $response = response('', 200);
            $response->headers->set('Access-Control-Allow-Origin', $origin);
            $response->headers->set('Access-Control-Allow-Credentials', 'true');
            $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-TOKEN, Authorization, X-Requested-With');
            $response->headers->set('Access-Control-Max-Age', '86400');
            return $response;
        }

        $response = $next($request);

        // Add CORS headers for allowed origins
        if ($isAllowedOrigin) {
            $response->headers->set('Access-Control-Allow-Origin', $origin);
            $response->headers->set('Access-Control-Allow-Credentials', 'true');
            $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-TOKEN, Authorization, X-Requested-With');
        }

        return $response;
    }
}
