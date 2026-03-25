<?php

namespace App\Modules\Visitor\Services;

use App\Contracts\VisitorServiceInterface;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class VisitorService implements VisitorServiceInterface
{
    private Client $client;

    public function __construct(?Client $client = null)
    {
        $this->client = $client ?? new Client(['timeout' => 5]);
    }

    /**
     * Track a visitor and return location data.
     *
     * @return array<string,mixed>
     */
    public function track(Request $request): array
    {
        $ip = $request->ip();

        // Use a geolocation service (IPInfo.io) but cache results to avoid repeated calls
        $location = $this->getLocationFromIP($ip);

        return $location;
    }

    /**
     * @return array<string, mixed>
     */
    public function getLocationFromIP(?string $ip): array
    {
        // Treat null or local addresses as local development
        if (is_null($ip) || in_array($ip, ['127.0.0.1', '::1', 'localhost'])) {
            return [
                'ip' => $ip,
                'country' => 'Local Development',
                'city' => 'Localhost',
            ];
        }

        $cacheKey = "geo_location_{$ip}";

        /** @var array<string, mixed> $result */
        $result = Cache::remember($cacheKey, 3600, function () use ($ip): array {
            try {
                $response = $this->client->get("http://ipinfo.io/{$ip}/json", [
                    'headers' => ['Accept' => 'application/json'],
                ]);

                $raw = (string) $response->getBody();
                $data = json_decode($raw, true);

                if (! is_array($data)) {
                    // Defensive fallback when the external API returns unexpected content
                    Log::warning('ipinfo returned non-array payload', ['ip' => $ip, 'body' => substr($raw, 0, 1000)]);
                    $data = [];
                }

                return [
                    'ip' => $ip,
                    'city' => $data['city'] ?? 'Unknown',
                    'country' => $data['country'] ?? 'Unknown',
                    'region' => $data['region'] ?? 'Unknown',
                    'timezone' => $data['timezone'] ?? 'Unknown',
                ];
            } catch (\Exception $e) {
                Log::warning('Failed to get geolocation for IP: '.$ip.' - '.$e->getMessage());

                return [
                    'ip' => $ip,
                    'country' => 'Unknown',
                    'city' => 'Unknown',
                ];
            }
        });

        return $result;
    }
}
