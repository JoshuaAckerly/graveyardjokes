<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\GoogleBusinessProfileService;
use App\Services\GooglePlacesService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class BusinessProfileController extends Controller
{
    public function __construct(
        private GoogleBusinessProfileService $service,
        private GooglePlacesService $places,
    ) {}

    public function reviews(): JsonResponse
    {
        $data = $this->cachedWithFallback(
            'gbp_reviews', 1800,
            fn () => $this->service->getReviews(20),
            'places_reviews',
            fn () => $this->places->getReviews(),
        );

        return $data
            ? response()->json($data)
            : response()->json(['error' => 'Unable to fetch reviews'], 503);
    }

    public function info(): JsonResponse
    {
        $data = $this->cachedWithFallback(
            'gbp_info', 21600,
            fn () => $this->service->getBusinessInfo(),
            'places_info',
            fn () => $this->places->getBusinessInfo(),
        );

        return $data
            ? response()->json($data)
            : response()->json(['error' => 'Unable to fetch business info'], 503);
    }

    public function posts(): JsonResponse
    {
        $data = $this->cachedWithFallback(
            'gbp_posts', 900,
            fn () => $this->service->getPosts(10),
        );

        return $data
            ? response()->json($data)
            : response()->json(['error' => 'Unable to fetch posts'], 503);
    }

    public function replyToReview(Request $request, string $reviewId): JsonResponse
    {
        /** @var array{comment: string} $validated */
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
            'topicType' => ['required', 'string', 'in:STANDARD,EVENT,OFFER,ALERT'],
            'summary' => ['required', 'string', 'max:1500'],
            'callToAction.actionType' => ['nullable', 'string'],
            'callToAction.url' => ['nullable', 'url'],
        ]);

        try {
            /** @var array<string, mixed> $validated */
            $data = $this->service->createPost($validated);
            Cache::forget('gbp_posts');

            return response()->json($data, 201);
        } catch (\RuntimeException $e) {
            return response()->json(['error' => 'Unable to create post'], 503);
        }
    }

    /**
     * Try primary cached fetch; on failure try optional fallback cached fetch.
     *
     * @return array<string, mixed>|null Returns data on success, null if all sources fail.
     */
    private function cachedWithFallback(
        string $primaryKey,
        int $ttl,
        callable $primary,
        ?string $fallbackKey = null,
        ?callable $fallback = null,
    ): ?array {
        try {
            /** @var array<string, mixed> $data */
            $data = Cache::remember($primaryKey, $ttl, $primary);

            return $data;
        } catch (\RuntimeException) {
            if ($fallback !== null && $fallbackKey !== null && $this->places->isConfigured()) {
                try {
                    /** @var array<string, mixed> $data */
                    $data = Cache::remember($fallbackKey, $ttl, $fallback);

                    return $data;
                } catch (\RuntimeException) {
                    // fall through
                }
            }

            return null;
        }
    }
}
