<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\GoogleBusinessProfileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class BusinessProfileController extends Controller
{
    public function __construct(private GoogleBusinessProfileService $service) {}

    public function reviews(): JsonResponse
    {
        try {
            $data = Cache::remember('gbp_reviews', 1800, function () {
                return $this->service->getReviews(20);
            });

            return response()->json($data);
        } catch (\RuntimeException $e) {
            return response()->json(['error' => 'Unable to fetch reviews'], 503);
        }
    }

    public function info(): JsonResponse
    {
        try {
            $data = Cache::remember('gbp_info', 21600, function () {
                return $this->service->getBusinessInfo();
            });

            return response()->json($data);
        } catch (\RuntimeException $e) {
            return response()->json(['error' => 'Unable to fetch business info'], 503);
        }
    }

    public function posts(): JsonResponse
    {
        try {
            $data = Cache::remember('gbp_posts', 900, function () {
                return $this->service->getPosts(10);
            });

            return response()->json($data);
        } catch (\RuntimeException $e) {
            return response()->json(['error' => 'Unable to fetch posts'], 503);
        }
    }

    public function replyToReview(Request $request, string $reviewId): JsonResponse
    {
        $validated = $request->validate([
            'comment' => ['required', 'string', 'max:4096'],
        ]);

        try {
            $data = $this->service->replyToReview($reviewId, $validated['comment']);
            Cache::forget('gbp_reviews');

            return response()->json($data);
        } catch (\RuntimeException $e) {
            return response()->json(['error' => 'Unable to post reply'], 503);
        }
    }

    public function createPost(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'topicType'             => ['required', 'string', 'in:STANDARD,EVENT,OFFER,ALERT'],
            'summary'               => ['required', 'string', 'max:1500'],
            'callToAction.actionType' => ['nullable', 'string'],
            'callToAction.url'      => ['nullable', 'url'],
        ]);

        try {
            $data = $this->service->createPost($validated);
            Cache::forget('gbp_posts');

            return response()->json($data, 201);
        } catch (\RuntimeException $e) {
            return response()->json(['error' => 'Unable to create post'], 503);
        }
    }
}
