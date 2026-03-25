<?php

namespace App\Http\Middleware;

use App\Jobs\ReportVisitToAuthSystem;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrackSiteVisit
{
    private const SKIP_PREFIXES = [
        '/_',
        '/livewire',
        '/telescope',
        '/horizon',
        '/sanctum',
        '/api',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if ($this->shouldTrack($request)) {
            ReportVisitToAuthSystem::dispatch([
                'host' => $request->getHost(),
                'path' => '/'.ltrim($request->path(), '/'),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'referer' => $request->headers->get('referer'),
            ]);
        }

        return $response;
    }

    private function shouldTrack(Request $request): bool
    {
        if (! $request->isMethod('GET')) {
            return false;
        }

        $path = '/'.ltrim($request->path(), '/');

        foreach (self::SKIP_PREFIXES as $prefix) {
            if (str_starts_with($path, $prefix)) {
                return false;
            }
        }

        return true;
    }
}
