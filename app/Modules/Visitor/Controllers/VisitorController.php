<?php

namespace App\Modules\Visitor\Controllers;

use Illuminate\Http\Request;
use App\Contracts\VisitorServiceInterface;
use Illuminate\Routing\Controller as BaseController;

class VisitorController extends BaseController
{
    public function track(Request $request, VisitorServiceInterface $visitorService)
    {
        // Handle OPTIONS request (CORS preflight)
        if ($request->getMethod() === 'OPTIONS') {
            return response('', 200);
        }

        $location = $visitorService->track($request);

        return response()->json([
            'success' => true,
            'message' => 'Visit tracked successfully',
            'data' => $location
        ]);
    }
}
