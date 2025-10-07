<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\NewVisitorNotification;

class VisitorController extends Controller
{
    public function track(Request $request)
    {
        $ip = $request->ip();
        
        // Use a geolocation service (MaxMind, IPInfo, etc.)
        $location = $this->getLocationFromIP($ip);
        
        // Store visit and send email
        $this->sendVisitorEmail($location);
        
        // Return a JSON response so frontend knows it worked
        return response()->json([
            'success' => true,
            'message' => 'Visit tracked successfully',
            'data' => $location
        ]);
    }

    // Send visitor email notification
    private function sendVisitorEmail($location)
    {
        // Prepare visitor data with all details
        $visitorData = [
            'ip' => $location['ip'],
            'city' => $location['city'],
            'country' => $location['country'],
            'timestamp' => now()->toDateTimeString(),
            'user_agent' => request()->userAgent()
        ];
        
        // Log the visitor info
        Log::info('New visitor tracked!', $visitorData);
        
        try {
            // Send email notification
            Mail::to('admin@graveyardjokes.com')->send(
                new NewVisitorNotification($visitorData)
            );
            
            Log::info('Visitor notification email sent successfully');
        } catch (\Exception $e) {
            Log::error('Failed to send visitor notification email: ' . $e->getMessage());
        }
    }

    // Dummy implementation for geolocation lookup
    private function getLocationFromIP($ip)
    {
        // In a real application, integrate with a geolocation API here.
        return [
            'ip' => $ip,
            'country' => 'Unknown',
            'city' => 'Unknown'
        ];
    }
}