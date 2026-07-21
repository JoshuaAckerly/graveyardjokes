<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class PasswordResetLinkController extends Controller
{
    /**
     * Show the password reset link request page.
     */
    public function create(Request $request): RedirectResponse
    {
        return redirect()->away($this->authSystemUrl('/forgot-password'), 302);
    }

    private function authSystemUrl(string $path = ''): string
    {
        $rawUrl = config('services.auth_system.url', '');
        $base = preg_replace('#/api/?$#', '', is_string($rawUrl) ? $rawUrl : '') ?: 'https://auth-system.graveyardjokes.com';

        if (app()->environment('local') && $base === 'http://auth-system.graveyardjokes.local') {
            $base = 'http://auth-system.graveyardjokes.local:8007';
        }

        return rtrim($base, '/').'/'.ltrim($path, '/');
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        Password::sendResetLink(
            $request->only('email')
        );

        return back()->with('status', __('A reset link will be sent if the account exists.'));
    }
}
