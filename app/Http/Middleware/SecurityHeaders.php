<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        $response->headers->set(
            'Content-Security-Policy',
            implode('; ', [
                "default-src 'self'",
                "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.paypal.com https://www.paypalobjects.com https://www.googletagmanager.com https://pagead2.googlesyndication.com https://js.hcaptcha.com https://newassets.hcaptcha.com",
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://newassets.hcaptcha.com",
                "font-src 'self' https://fonts.gstatic.com",
                "img-src 'self' data: blob: https: http:",
                "connect-src 'self' https://www.paypal.com https://api.paypal.com https://www.google-analytics.com https://stats.g.doubleclick.net https://hcaptcha.com https://newassets.hcaptcha.com",
                'frame-src https://www.paypal.com https://newassets.hcaptcha.com https://hcaptcha.com https://googleads.g.doubleclick.net',
                "object-src 'none'",
                "base-uri 'self'",
                "form-action 'self'",
            ])
        );

        return $response;
    }
}
