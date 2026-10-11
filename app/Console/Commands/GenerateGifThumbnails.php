<?php

namespace App\Console\Commands;

use App\Services\IllustrationService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Console\Command\Command as SymfonyCommand;

class GenerateGifThumbnails extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:generate-gif-thumbnails {--force : Force regeneration of existing thumbnails}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate thumbnail images for GIF files in the illustrations directory';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $service = new IllustrationService;
        $illustrations = $service->list();

        $this->info('Found '.count($illustrations).' illustrations');

        $gifCount = 0;
        $thumbnailCount = 0;

        foreach ($illustrations as $illustration) {
            $parsedPath = parse_url($illustration, PHP_URL_PATH);
            $filename = basename(is_string($parsedPath) ? $parsedPath : '');

            if (! preg_match('/\.gif$/i', $filename)) {
                continue;
            }

            $gifCount++;
            $thumbnailFilename = preg_replace('/\.gif$/i', '_thumb.jpg', $filename);
            if (! is_string($thumbnailFilename)) {
                continue;
            }

            // Check if thumbnail already exists
            $thumbnailPath = str_replace($filename, $thumbnailFilename, $this->getS3Path($illustration));

            if (! $this->option('force') && Storage::disk('s3')->exists($thumbnailPath)) {
                $this->line("Thumbnail already exists for {$filename}, skipping...");

                continue;
            }

            $this->info("Generating thumbnail for {$filename}...");

            if ($this->generateThumbnail($illustration, $thumbnailPath)) {
                $thumbnailCount++;
                $this->line("✓ Generated thumbnail for {$filename}");
            } else {
                $this->error("✗ Failed to generate thumbnail for {$filename}");
            }
        }

        $this->info("Processed {$gifCount} GIFs, generated {$thumbnailCount} thumbnails");

        return SymfonyCommand::SUCCESS;
    }

    private function getS3Path(string $url): string
    {
        // Extract the path from CloudFront/S3 URL
        $parsed = parse_url($url);
        $path = is_array($parsed) && is_string($parsed['path'] ?? null) ? $parsed['path'] : '';

        // Remove leading slash if present
        return ltrim($path, '/');
    }

    private function generateThumbnail(string $gifUrl, string $thumbnailPath): bool
    {
        try {
            // Get the S3 path from the CloudFront URL
            $s3Path = $this->getS3Path($gifUrl);

            // Get the GIF content directly from S3
            $gifContent = Storage::disk('s3')->get($s3Path);
            if (! $gifContent) {
                return false;
            }

            // Create image from GIF
            $image = imagecreatefromstring($gifContent);
            if (! $image) {
                return false;
            }

            // Get original dimensions
            $width = imagesx($image);
            $height = imagesy($image);

            // Calculate thumbnail size (maintain aspect ratio, max 400px width)
            $maxWidth = 400;
            $maxHeight = 300;

            if ($width > $height) {
                $newWidth = max(1, min($width, $maxWidth));
                $newHeight = max(1, intval($height * ($newWidth / $width)));
            } else {
                $newHeight = max(1, min($height, $maxHeight));
                $newWidth = max(1, intval($width * ($newHeight / $height)));
            }

            // Create thumbnail
            $thumbnail = imagecreatetruecolor($newWidth, $newHeight);
            if ($thumbnail === false) {
                imagedestroy($image);

                return false;
            }

            // Enable alpha blending for better quality
            imagealphablending($thumbnail, false);
            imagesavealpha($thumbnail, true);

            // Resize
            imagecopyresampled($thumbnail, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

            // Save as JPEG
            ob_start();
            imagejpeg($thumbnail, null, 85);
            $jpegContent = ob_get_clean();
            if (! is_string($jpegContent)) {
                imagedestroy($image);
                imagedestroy($thumbnail);

                return false;
            }

            // Upload to S3
            $result = Storage::disk('s3')->put($thumbnailPath, $jpegContent, 'public');

            // Clean up memory
            imagedestroy($image);
            imagedestroy($thumbnail);

            return $result !== false;

        } catch (\Exception $e) {
            $this->error('Error generating thumbnail: '.$e->getMessage());

            return false;
        }
    }
}
