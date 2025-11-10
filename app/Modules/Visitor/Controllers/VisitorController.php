<?php

namespace App\Modules\Visitor\Controllers;

use Illuminate\Http\Request;
use App\Contracts\VisitorServiceInterface;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Log;

class VisitorController extends BaseController
{
    public function track(Request $request, VisitorServiceInterface $visitorService): \Illuminate\Http\JsonResponse
    {
        // Handle OPTIONS request (CORS preflight)
        if ($request->getMethod() === 'OPTIONS') {
            return response()->json([], 200);
        }

        try {
            $location = $visitorService->track($request);

            return response()->json([
                'success' => true,
                'message' => 'Visit tracked successfully',
                'data' => $location
            ]);
        } catch (\Exception $e) {
            Log::error('Visitor tracking failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Tracking failed'
            ], 500);
        }
    }
}
