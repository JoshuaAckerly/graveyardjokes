<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class AuthSystemService
{
    protected string $baseUrl;

    public function __construct()
    {
        $url = config('services.auth_system.url', 'http://auth-system.local/api');
        $this->baseUrl = is_string($url) ? $url : 'http://auth-system.local/api';
    }

    public function login(string $email, string $password): ?string
    {
        $response = Http::post($this->baseUrl.'/login', [
            'email' => $email,
            'password' => $password,
        ]);
        if ($response instanceof \Illuminate\Http\Client\Response && $response->successful()) {
            $token = $response->json('token');

            return is_string($token) ? $token : null;
        }

        return null;
    }

    /**
     * @return array<string, mixed>|null
     */
    public function getUser(string $token): ?array
    {
        $response = Http::withToken($token)->get($this->baseUrl.'/user');
        if ($response instanceof \Illuminate\Http\Client\Response) {
            $data = $response->json();
            if (is_array($data)) {
                // Filter to ensure string keys
                return array_filter($data, 'is_string', ARRAY_FILTER_USE_KEY) ?: null;
            }
        }

        return null;
    }

    /**
     * @return array<int, array<string, mixed>>|null
     */
    public function getPurchases(string $token): ?array
    {
        $response = Http::withToken($token)->get($this->baseUrl.'/purchases');
        if ($response instanceof \Illuminate\Http\Client\Response) {
            $data = $response->json();
            if (is_array($data)) {
                // Ensure each item is an array with string keys
                $result = [];
                foreach ($data as $item) {
                    if (is_array($item)) {
                        $result[] = array_filter($item, 'is_string', ARRAY_FILTER_USE_KEY);
                    }
                }

                return $result ?: null;
            }
        }

        return null;
    }

    /**
     * @return array<string, mixed>|null
     */
    public function getMessages(string $token): ?array
    {
        $response = Http::withToken($token)->get($this->baseUrl.'/messages');
        if ($response instanceof \Illuminate\Http\Client\Response && $response->successful()) {
            $data = $response->json();
            if (is_array($data)) {
                /** @var array<string, mixed> $typed */
                $typed = $data;

                return $typed;
            }
        }

        return null;
    }

    public function markMessageRead(string $token, int $id): bool
    {
        $response = Http::withToken($token)->patch($this->baseUrl.'/messages/'.$id.'/read');

        return $response instanceof \Illuminate\Http\Client\Response && $response->successful();
    }

    public function markAllMessagesRead(string $token): bool
    {
        $response = Http::withToken($token)->patch($this->baseUrl.'/messages/read-all');

        return $response instanceof \Illuminate\Http\Client\Response && $response->successful();
    }
}
