<?php

namespace App\Http\Controllers\Studio;

use App\Http\Controllers\Controller;
use App\Models\TikTokVideo;
use App\Services\VideoLogService;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class VideoLogController extends Controller
{
    protected VideoLogService $videoLogService;

    public function __construct(VideoLogService $videoLogService)
    {
        $this->videoLogService = $videoLogService;
    }

    public function index()
    {
        return Inertia::render('studio/VideoLog');
    }

    public function api(Request $request)
    {
        $data = Cache::remember('video-log.api', now()->addHours(6), function () {
            $tikTokVideos = TikTokVideo::active()
                ->orderBy('sort_order')
                ->orderByDesc('posted_at')
                ->orderByDesc('created_at')
                ->get();

            if ($tikTokVideos->isNotEmpty()) {
                return $tikTokVideos->map(fn ($video) => [
                    'id' => $video->id,
                    'title' => $video->title,
                    'date' => $video->posted_at
                        ? $video->posted_at->format('Y-m-d')
                        : $video->created_at->format('Y-m-d'),
                    'thumbnail' => $video->thumbnail_url ?? '',
                    'url' => $video->video_url,
                    'embed_url' => $video->embed_url,
                    'description' => $video->description,
                ])->values()->all();
            }

            $items = $this->videoLogService->list();

            return collect($items)->map(fn ($v) => [
                'id' => $v->id,
                'title' => $v->title,
                'date' => $v->date,
                'thumbnail' => $v->thumbnail,
                'url' => $v->url,
                'description' => $v->description,
            ])->values()->all();
        });

        return response()->json(['data' => $data]);
    }

    /**
     * Serve a file from the configured s3 disk. Used for testing/dev when the adapter
     * doesn't provide public URLs (for example Storage::fake()).
     *
     * Query param: path (required)
     */
    public function serve(Request $request)
    {
        // Only expose the proxy outside production to avoid an open S3 read endpoint.
        if (app()->environment('production')) {
            abort(404);
        }

        $path = (string) $request->query('path');

        if ($path === '') {
            return response('Bad request', 400);
        }

        try {
            /** @var FilesystemAdapter $disk */
            $disk = Storage::disk('s3');
            if (! $disk->exists($path)) {
                return response('Not found', 404);
            }

            $contents = $disk->get($path);

            $mime = 'application/octet-stream';
            try {
                if (method_exists($disk, 'mimeType')) {
                    $mime = $disk->mimeType($path) ?: $mime;
                } else {
                    $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
                    $map = [
                        'mp4' => 'video/mp4',
                        'webm' => 'video/webm',
                        'mov' => 'video/quicktime',
                        'm4v' => 'video/x-m4v',
                        'jpg' => 'image/jpeg',
                        'jpeg' => 'image/jpeg',
                        'png' => 'image/png',
                        'webp' => 'image/webp',
                    ];
                    if (isset($map[$ext])) {
                        $mime = $map[$ext];
                    }
                }
            } catch (\Throwable $e) {
                // ignore and fall back to default
            }

            return response($contents, 200)->header('Content-Type', $mime);
        } catch (\Throwable $e) {
            Log::error('Error serving video file: '.$e->getMessage());

            return response('Error', 500);
        }
    }
}
