<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AuthSystemService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageProxyController extends Controller
{
    protected AuthSystemService $authSystem;

    public function __construct(AuthSystemService $authSystem)
    {
        $this->authSystem = $authSystem;
    }

    public function index(Request $request): JsonResponse
    {
        $token = $request->bearerToken();
        if (! is_string($token) || $token === '') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $messages = $this->authSystem->getMessages($token);

        if ($messages === null) {
            return response()->json(['error' => 'Unable to fetch messages'], 502);
        }

        return response()->json($messages);
    }

    public function markRead(Request $request, int $id): JsonResponse
    {
        $token = $request->bearerToken();
        if (! is_string($token) || $token === '') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $success = $this->authSystem->markMessageRead($token, $id);

        if (! $success) {
            return response()->json(['error' => 'Unable to mark message as read'], 502);
        }

        return response()->json(['success' => true]);
    }

    public function markAllRead(Request $request): JsonResponse
    {
        $token = $request->bearerToken();
        if (! is_string($token) || $token === '') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $success = $this->authSystem->markAllMessagesRead($token);

        if (! $success) {
            return response()->json(['error' => 'Unable to mark messages as read'], 502);
        }

        return response()->json(['success' => true]);
    }
}
