<?php

namespace App\Services;

use App\Contracts\StorageUrlGeneratorInterface;
use App\Models\VideoLog;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class VideoLogService
{
    /**
     * Underlying S3 disk. Kept untyped to allow injection of test doubles in unit tests.
     *
     * @var mixed
     */
    protected $s3;

    protected string $videoPrefix;

    protected string $imagePrefix;

    protected ?string $cloudfrontDomain;

    protected StorageUrlGenerator $urlGenerator;

    /**
     * Backwards-compatible constructor: first param may be the disk or the url generator.
     * Prefer injecting a StorageUrlGenerator for URL resolution.
     *
     * @param  mixed|null  $s3OrGenerator
     * @param  StorageUrlGenerator|null  $maybeGenerator
     */
    public function __construct($s3OrGenerator = null, ?StorageUrlGeneratorInterface $maybeGenerator = null)
    {
        if ($s3OrGenerator instanceof StorageUrlGenerator) {
            $this->urlGenerator = $s3OrGenerator;
            $this->s3 = Storage::disk('s3');
        } else {
            $this->s3 = $s3OrGenerator ?? Storage::disk('s3');
            $this->urlGenerator = $maybeGenerator ?? new StorageUrlGenerator($this->s3, config('media.cloudfront_domain') ?: null);
        }

        $this->videoPrefix = config('media.video_prefix', 'video-logs');
        $this->imagePrefix = rtrim(config('media.image_prefix', 'images/vlogs'), '/');
        $this->cloudfrontDomain = config('media.cloudfront_domain') ?: null;
    }

    /**
     * Return an array of VideoLog objects.
     *
     * @return VideoLog[]
     */
    public function list(): array
    {
        // Decide whether to use S3: use S3 when the default disk is 's3', or when an AWS_BUCKET is configured
        // and we're not in testing. This mirrors the previous controller logic.
        $defaultDisk = (string) config('filesystems.default');
        $s3Bucket = (string) config('filesystems.disks.s3.bucket');
        $useS3 = ($defaultDisk === 's3') || (! app()->environment('testing') && $s3Bucket !== '');

        if (! $useS3) {
            return $this->staticFallbackItems();
        }

        $files = [];

        foreach ($this->candidateVideoPrefixes() as $prefix) {
            try {
                $candidateFiles = $this->s3->files($prefix);
            } catch (\Throwable $e) {
                $candidateFiles = [];
            }

            $candidateVideos = array_filter($candidateFiles, function ($f) {
                $ext = Str::lower(pathinfo($f, PATHINFO_EXTENSION));

                return in_array($ext, ['mp4', 'webm', 'mov', 'm4v']);
            });

            if (! empty($candidateVideos)) {
                $files = $candidateFiles;
                break;
            }
        }

        // Filter video extensions
        $videos = array_filter($files, function ($f) {
            $ext = Str::lower(pathinfo($f, PATHINFO_EXTENSION));

            return in_array($ext, ['mp4', 'webm', 'mov', 'm4v']);
        });

        if (empty($videos)) {
            return $this->staticFallbackItems();
        }

        // Optionally sort by last modified if available
        usort($videos, function ($a, $b) {
            try {
                $ma = $this->s3->lastModified($a) ?: 0;
                $mb = $this->s3->lastModified($b) ?: 0;

                return $mb <=> $ma;
            } catch (\Throwable $e) {
                return 0;
            }
        });

        $imageFiles = [];
        $selectedImagePrefix = $this->imagePrefix;
        foreach ($this->candidateImagePrefixes() as $prefix) {
            try {
                $candidateImages = $this->s3->files($prefix);
            } catch (\Throwable $e) {
                $candidateImages = [];
            }

            if (! empty($candidateImages)) {
                $imageFiles = $candidateImages;
                $selectedImagePrefix = $prefix;
                break;
            }
        }

        $items = [];

        foreach ($videos as $i => $file) {
            $basename = pathinfo($file, PATHINFO_FILENAME);

            // Find a per-video thumbnail
            $thumbnailKey = null;
            foreach (['jpg', 'jpeg', 'png', 'webp', 'gif'] as $ext) {
                $candidate = $selectedImagePrefix.'/'.$basename.'.'.$ext;
                try {
                    if ($this->s3->exists($candidate)) {
                        $thumbnailKey = $candidate;
                        break;
                    }
                } catch (\Throwable $e) {
                    // ignore
                }
            }

            // fallback to first available image in images/vlogs
            if (! $thumbnailKey && count($imageFiles) > 0) {
                $thumbnailKey = $imageFiles[0];
            }

            $videoUrl = $this->makeS3Url($file);
            $thumbUrl = $thumbnailKey ? $this->makeS3Url($thumbnailKey) : url('/images/vlogs/default.svg');

            $items[] = new VideoLog([
                'id' => $i + 1,
                'title' => str_replace(['-', '_'], ' ', ucfirst($basename)),
                'date' => date('Y-m-d'),
                'thumbnail' => $thumbUrl,
                'url' => $videoUrl,
                'description' => null,
            ]);
        }

        return $items;
    }

    protected function makeS3Url(string $path): string
    {
        return $this->urlGenerator->url($path);
    }

    /**
     * @return string[]
     */
    protected function candidateVideoPrefixes(): array
    {
        $prefixes = [$this->videoPrefix, 'video-logs', 'studio/video-logs', 'studio/videos'];

        if (str_starts_with($this->videoPrefix, 'studio/')) {
            $prefixes[] = substr($this->videoPrefix, strlen('studio/'));
        } else {
            $prefixes[] = 'studio/'.ltrim($this->videoPrefix, '/');
        }

        return array_values(array_unique(array_filter(array_map(function ($prefix) {
            return trim((string) $prefix, '/');
        }, $prefixes))));
    }

    /**
     * @return string[]
     */
    protected function candidateImagePrefixes(): array
    {
        $prefixes = [$this->imagePrefix, 'images/vlogs', 'studio/images/vlogs'];

        if (str_starts_with($this->imagePrefix, 'studio/')) {
            $prefixes[] = substr($this->imagePrefix, strlen('studio/'));
        } else {
            $prefixes[] = 'studio/'.ltrim($this->imagePrefix, '/');
        }

        return array_values(array_unique(array_filter(array_map(function ($prefix) {
            return trim((string) $prefix, '/');
        }, $prefixes))));
    }

    /**
     * @return VideoLog[]
     */
    protected function staticFallbackItems(): array
    {
        $sessionVideo = $this->makeS3Url('studio/video-logs/session.mp4');
        $conceptVideo = $this->makeS3Url('studio/video-logs/3d-concept.mp4');
        $sessionThumbnail = $this->makeS3Url('studio/images/vlogs/session-thumbnail.jpg');
        $conceptThumbnail = $this->makeS3Url('studio/images/vlogs/3d-thumbnail.jpg');

        return [
            new VideoLog([
                'id' => 1,
                'title' => 'Studio Update — Composing Session',
                'date' => '2025-10-10',
                'thumbnail' => $sessionThumbnail,
                'url' => $sessionVideo,
                'description' => 'A look into the music composing session with new synth textures.',
            ]),
            new VideoLog([
                'id' => 2,
                'title' => '3D Character Concept Walkthrough',
                'date' => '2025-09-28',
                'thumbnail' => $conceptThumbnail,
                'url' => $conceptVideo,
                'description' => 'Discussing the 2D to 3D pipeline and collaborations.',
            ]),
        ];
    }
}
