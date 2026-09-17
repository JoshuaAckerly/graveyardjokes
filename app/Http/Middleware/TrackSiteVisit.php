<?php

namespace App\Http\Middleware;

use App\Models\SiteVisit;
use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\Request;

class TrackSiteVisit
{
    private const SKIP_PREFIXES = [
        '/_',
        '/livewire',
        '/telescope',
        '/horizon',
        '/sanctum',
        '/api',
        '/admin',
        '/build',
        '/storage',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        /** @var Response $response */
        $response = $next($request);

        if ($this->shouldTrack($request)) {
            $this->record($request);
        }

        return $response;
    }

    private function record(Request $request): void
    {
        try {
            $host = $request->getHost();
            $path = '/'.ltrim($request->path(), '/');
            $ip = $request->ip();
            $userAgent = $request->userAgent();

            SiteVisit::create([
                'user_id' => Auth::id(),
                'host' => $host,
                'ip_address' => $ip,
                'user_agent' => $userAgent,
                'path' => $path,
                'referer' => $request->headers->get('referer'),
                'is_bot' => SiteVisit::isBot($userAgent, $ip, $path, $host),
                'created_at' => now(),
            ]);
        } catch (\Throwable $e) {
            Log::warning('Failed to record site visit: '.$e->getMessage());
        }
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
