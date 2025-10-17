<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;

class JokeController extends BaseController
{
    public function random(Request $request)
    {
        $path = storage_path('jokes.json');

        if (!file_exists($path)) {
            return response()->json(['error' => 'No jokes available'], 500);
        }

        $json = file_get_contents($path);
        $jokes = json_decode($json, true);

        if (!is_array($jokes) || count($jokes) === 0) {
            return response()->json(['error' => 'No jokes available'], 500);
        }

        $index = array_rand($jokes);
        $joke = $jokes[$index];

        return response()->json($joke);
    }
}
