<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AuthSystemService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserProxyController extends Controller
{
    protected AuthSystemService $authSystem;

    public function __construct(AuthSystemService $authSystem)
    {
        $this->authSystem = $authSystem;
    }

    public function user(Request $request): JsonResponse
    {
        $token = $request->bearerToken();
        if (!is_string($token)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $user = $this->authSystem->getUser($token);
        return response()->json($user);
    }

    public function purchases(Request $request): JsonResponse
    {
        $token = $request->bearerToken();
        if (!is_string($token)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $purchases = $this->authSystem->getPurchases($token);
        return response()->json($purchases);
    }
}
