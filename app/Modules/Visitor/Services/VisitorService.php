<?php

namespace App\Modules\Visitor\Services;

use App\Contracts\VisitorServiceInterface;
use GuzzleHttp\Client;
use GuzzleHttp\ClientInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
use App\Modules\Visitor\Mail\NewVisitorNotification;

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
     * @param Request $request
     * @return array<string,mixed>
     */
    public function track(Request $request): array
    {
        $ip = $request->ip();

        // Use a geolocation service (IPInfo.io) but cache results to avoid repeated calls
        $location = $this->getLocationFromIP($ip);

        // Attempt to send a notification email (throttled by cache)
        $this->sendVisitorEmail($location, $request);

        return $location;
    }

    public function getLocationFromIP(?string $ip): array
    {
        // Treat null or local addresses as local development
        if (is_null($ip) || in_array($ip, ['127.0.0.1', '::1', 'localhost'])) {
            return [
                'ip' => $ip,
                'country' => 'Local Development',
                'city' => 'Localhost'
            ];
        }

        $cacheKey = "geo_location_{$ip}";

        return Cache::remember($cacheKey, 3600, function () use ($ip) {
            try {
                $response = $this->client->get("http://ipinfo.io/{$ip}/json", [
                    'headers' => ['Accept' => 'application/json']
                ]);

                $raw = (string) $response->getBody();
                $data = json_decode($raw, true);

                if (!is_array($data)) {
                    // Defensive fallback when the external API returns unexpected content
                    Log::warning('ipinfo returned non-array payload', ['ip' => $ip, 'body' => substr($raw, 0, 1000)]);
                    $data = [];
                }

                return [
                    'ip' => $ip,
                    'city' => $data['city'] ?? 'Unknown',
                    'country' => $data['country'] ?? 'Unknown',
                    'region' => $data['region'] ?? 'Unknown',
                    'timezone' => $data['timezone'] ?? 'Unknown'
                ];
            } catch (\Exception $e) {
                Log::warning('Failed to get geolocation for IP: ' . $ip . ' - ' . $e->getMessage());

                return [
                    'ip' => $ip,
                    'country' => 'Unknown',
                    'city' => 'Unknown'
                ];
            }
        });
    }

    private function sendVisitorEmail(array $location, ?Request $request = null): void
    {
        $visitorData = [
            'ip' => $location['ip'] ?? null,
            'city' => $location['city'] ?? null,
            'country' => $location['country'] ?? null,
            'timestamp' => now()->toDateTimeString(),
            'user_agent' => $request ? $request->userAgent() : request()->userAgent(),
            'referrer' => $request ? $request->input('referrer') : request()->header('referer'),
            'subdomain' => $request ? $request->input('subdomain') : request()->getHost()
        ];

        Log::info('New visitor tracked!', $visitorData);

        $ua = $visitorData['user_agent'] ?? '';
        $keyHash = substr(sha1(($visitorData['ip'] ?? '') . '|' . $ua), 0, 20);
        $cacheKey = "visitor_notification_sent_{$keyHash}";

        // Get TTL from config or env, with fallback to 24 hours
        $ttl = (int) (config('tracking.visitor_ttl') ?? env('TRACK_VISITOR_EMAIL_TTL', 86400));

        if (Cache::has($cacheKey)) {
            Log::info('Visitor notification skipped (recently notified).', ['cache_key' => $cacheKey]);
            return;
        }

        try {
            Mail::to('admin@graveyardjokes.com')->send(new NewVisitorNotification($visitorData));
            Cache::put($cacheKey, true, $ttl);
            Log::info('Visitor notification email sent successfully', ['cache_key' => $cacheKey]);
        } catch (\Exception $e) {
            Log::error('Failed to send visitor notification email: ' . $e->getMessage());
        }
    }
}
