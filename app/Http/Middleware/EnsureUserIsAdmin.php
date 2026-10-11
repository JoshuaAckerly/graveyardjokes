<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $adminEmail = config('app.admin_email');

        $user = $request->user();

        if (! $adminEmail || $user?->email !== $adminEmail || $user->email_verified_at === null) {
            abort(403);
        }

        return $next($request);
    }
}
