<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        /** @var Response $response */
        $response = $next($request);

        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

        if ($request->isSecure()) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }

        $isNonProd = app()->environment('local', 'testing');

        $response->headers->set(
            'Content-Security-Policy',
            implode('; ', [
                "default-src 'self'",
                "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.paypal.com https://www.paypalobjects.com https://www.googletagmanager.com https://pagead2.googlesyndication.com https://js.hcaptcha.com https://newassets.hcaptcha.com".($isNonProd ? ' http://graveyardjokes.test:* http://*.graveyardjokes.test:* http://localhost:* http://dev.ad.graveyardjokes.com:* http://10.0.1.20:*' : ''),
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.bunny.net https://newassets.hcaptcha.com".($isNonProd ? ' http://graveyardjokes.test:* http://*.graveyardjokes.test:* http://localhost:* http://dev.ad.graveyardjokes.com:* http://10.0.1.20:*' : ''),
                "font-src 'self' https://fonts.gstatic.com https://fonts.bunny.net",
                "img-src 'self' data: blob: https: http:",
                "connect-src 'self' https://graveyardjokes.com https://*.graveyardjokes.com https://www.paypal.com https://api.paypal.com https://www.google-analytics.com https://stats.g.doubleclick.net https://hcaptcha.com https://newassets.hcaptcha.com".($isNonProd ? ' http://graveyardjokes.test:* http://*.graveyardjokes.test:* http://localhost:* http://dev.ad.graveyardjokes.com:* http://10.0.1.20:* ws://graveyardjokes.test:* ws://*.graveyardjokes.test:* ws://localhost:* ws://dev.ad.graveyardjokes.com:* ws://10.0.1.20:* ws://0.0.0.0:*' : ''),
                'frame-src https://www.paypal.com https://newassets.hcaptcha.com https://hcaptcha.com https://googleads.g.doubleclick.net',
                "object-src 'none'",
                "base-uri 'self'",
                "form-action 'self'",
            ])
        );

        return $response;
    }
}
