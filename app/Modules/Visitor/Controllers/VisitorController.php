<?php

namespace App\Modules\Visitor\Controllers;

use Illuminate\Http\Request;
use App\Contracts\VisitorServiceInterface;
use Illuminate\Routing\Controller as BaseController;

class VisitorController extends BaseController
{
    public function track(Request $request, VisitorServiceInterface $visitorService): \Illuminate\Http\JsonResponse
    {
        // Handle OPTIONS request (CORS preflight)
        if ($request->getMethod() === 'OPTIONS') {
            return response()->json([], 200);
        }

        $location = $visitorService->track($request);

        // $location is expected to be an array-like structure from the service

        return response()->json([
            'success' => true,
            'message' => 'Visit tracked successfully',
            'data' => $location
        ]);
    }
}
