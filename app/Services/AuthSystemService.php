<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class AuthSystemService
{
    protected $baseUrl;

    public function __construct()
    {
        $this->baseUrl = env('AUTH_SYSTEM_URL', 'http://auth-system.local/api');
    }

    public function login($email, $password)
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

    public function getUser($token)
    {
        $response = Http::withToken($token)->get($this->baseUrl.'/user');

        return $response->json();
    }

    public function getPurchases($token)
    {
        $response = Http::withToken($token)->get($this->baseUrl.'/purchases');

        return $response->json();
    }
}
