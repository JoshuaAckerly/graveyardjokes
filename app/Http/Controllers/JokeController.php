<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class JokeController extends BaseController
{
    public function random(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $jokes = Cache::remember('jokes_data', 3600, function () {
                $path = storage_path('jokes.json');
                
                if (!file_exists($path) || !is_readable($path)) {
                    return null;
                }
                
                $json = file_get_contents($path);
                if ($json === false) {
                    return null;
                }
                
                $data = json_decode($json, true);
                return is_array($data) ? $data : null;
            });
            
            if (!$jokes || count($jokes) === 0) {
                return response()->json(['error' => 'No jokes available'], 503);
            }
            
            $joke = $jokes[array_rand($jokes)];
            
            if (!is_array($joke)) {
                return response()->json(['error' => 'Invalid joke data'], 500);
            }
            
            return response()->json($joke);
        } catch (\Exception $e) {
            Log::error('Failed to fetch random joke: ' . $e->getMessage());
            return response()->json(['error' => 'Service temporarily unavailable'], 503);
        }
    }
}
