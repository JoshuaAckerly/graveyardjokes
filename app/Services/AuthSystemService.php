<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class AuthSystemService
{
    protected string $baseUrl;

    public function __construct()
    {
        $this->baseUrl = config('services.auth_system.url', 'http://auth-system.local/api');
    }

    public function login(string $email, string $password): ?string
    {
        $response = Http::post($this->baseUrl.'/login', [
            'email' => $email,
            'password' => $password,
        ]);
        if ($response->successful()) {
            return $response->json('token');
        }

        return null;
    }

    public function getUser(string $token): ?array
    {
        $response = Http::withToken($token)->get($this->baseUrl.'/user');

        return $response->json();
    }

    public function getPurchases(string $token): ?array
    {
        $response = Http::withToken($token)->get($this->baseUrl.'/purchases');

        return $response->json();
    }
}
