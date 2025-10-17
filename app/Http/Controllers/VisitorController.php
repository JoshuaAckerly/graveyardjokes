<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\NewVisitorNotification;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Cache;

class VisitorController extends Controller
{
    public function track(Request $request)
    {
        // Handle OPTIONS request (CORS preflight)
        if ($request->getMethod() === 'OPTIONS') {
            return response('', 200);
        }

        $ip = $request->ip();
        
        // Use a geolocation service (MaxMind, IPInfo, etc.)
        $location = $this->getLocationFromIP($ip);
        
        // Store visit and send email
        $this->sendVisitorEmail($location, $request);
        
        // Return a JSON response
        return response()->json([
            'success' => true,
            'message' => 'Visit tracked successfully',
            'data' => $location
        ]);
    }

    // Send visitor email notification
    private function sendVisitorEmail($location, $request = null)
    {
        // Prepare visitor data with all details
        $visitorData = [
            'ip' => $location['ip'],
            'city' => $location['city'],
            'country' => $location['country'],
            'timestamp' => now()->toDateTimeString(),
            'user_agent' => request()->userAgent(),
            'referrer' => $request ? $request->input('referrer') : request()->header('referer'),
            'subdomain' => $request ? $request->input('subdomain') : request()->getHost()
        ];
        
        // Log the visitor info
        Log::info('New visitor tracked!', $visitorData);
        // Prevent sending more than one email per visitor (by IP + user agent) within a TTL
        $ua = $visitorData['user_agent'] ?? '';
        $keyHash = substr(sha1($visitorData['ip'] . '|' . $ua), 0, 20);
        $cacheKey = "visitor_notification_sent_{$keyHash}";

        // TTL in seconds - configurable via .env (default: 86400 = 1 day)
        $ttl = env('TRACK_VISITOR_EMAIL_TTL', 86400);

        if (Cache::has($cacheKey)) {
            Log::info('Visitor notification skipped (recently notified).', ['cache_key' => $cacheKey]);
            return;
        }

        try {
            // Send email notification
            Mail::to('admin@graveyardjokes.com')->send(
                new NewVisitorNotification($visitorData)
            );

            // Mark as notified in cache
            Cache::put($cacheKey, true, $ttl);

            Log::info('Visitor notification email sent successfully', ['cache_key' => $cacheKey]);
        } catch (\Exception $e) {
            Log::error('Failed to send visitor notification email: ' . $e->getMessage());
        }
    }

    // Get location from IP using IPInfo.io
    public function getLocationFromIP($ip)
    {
        // Skip localhost IPs
        if (in_array($ip, ['127.0.0.1', '::1', 'localhost'])) {
            return [
                'ip' => $ip,
                'country' => 'Local Development',
                'city' => 'Localhost'
            ];
        }

        // Cache the result for 1 hour to avoid repeated API calls for same IP
        $cacheKey = "geo_location_{$ip}";
        
        return Cache::remember($cacheKey, 3600, function () use ($ip) {
            try {
                $client = new Client();
                
                // Using IPInfo.io free API (no key required for basic usage)
                $response = $client->get("http://ipinfo.io/{$ip}/json", [
                    'timeout' => 5,
                    'headers' => [
                        'Accept' => 'application/json'
                    ]
                ]);
                
                $data = json_decode($response->getBody(), true);
                
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
}