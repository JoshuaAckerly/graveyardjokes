<?php

namespace App\Console\Commands;

use Aws\S3\Exception\S3Exception;
use Aws\S3\S3Client;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class NormalizeS3Prefix extends Command
{
    protected $signature = 's3:normalize-prefix'
        .' {--dry : Do not perform changes (dry run)}'
        .' {--source= : Source prefix (required) }'
        .' {--target= : Target prefix (required) }'
        .' {--bucket= : Bucket to operate on (overrides config)}'
        .' {--delete-original : Delete original objects after copy} '
        .' {--overwrite : Overwrite target if exists} '
        .' {--progress-only : Show only the progress bar and final summary (suppress per-item output)} '
        .' {--spinner : Use an indeterminate spinner instead of counting objects first} '
        .' {--limit= : Max objects to process (for safety)}'
        .' {--report-path= : Path to write JSON report (file or directory; relative paths are resolved against project root)}'
        .' {--summary-only : Emit only the JSON report and a compact summary (suitable for CI) }';

    protected $description = 'Normalize S3 object prefixes by copying objects from a source prefix to a target prefix.';

    public function handle(): int
    {
        $source = rtrim($this->option('source') ?? '', '/');
        $target = rtrim($this->option('target') ?? '', '/');

        if ($source === '' || $target === '') {
            $this->error('Both --source and --target are required.');

            return 1;
        }

        $dry = $this->option('dry');
        $delete = $this->option('delete-original');
        $overwrite = $this->option('overwrite');
        $progressOnly = $this->option('progress-only');
        $spinnerMode = $this->option('spinner');
        $summaryOnly = $this->option('summary-only');

        // summary-only implies progress-only and disables interactive spinner/bar output
        if ($summaryOnly) {
            $progressOnly = true;
            $spinnerMode = false;
        }
        $limit = $this->option('limit') ? (int) $this->option('limit') : null;

        $bucket = $this->option('bucket') ?? config('filesystems.disks.s3.bucket');
        if (! $bucket) {
            $this->error('Bucket must be specified via --bucket or filesystems.disks.s3.bucket config');

            return 1;
        }

        if (! $summaryOnly) {
            $this->info("Using bucket: $bucket");
            $this->info("Source prefix: $source");
            $this->info("Target prefix: $target");
            $this->info($dry ? 'DRY RUN (no changes will be made)' : 'LIVE RUN');
        }

        $disk = Storage::disk('s3');

        // Use AWS SDK client for efficient copy operations via CopyObject
        $client = new S3Client([
            'version' => 'latest',
            'region' => config('filesystems.disks.s3.region', 'us-east-1'),
            'endpoint' => config('filesystems.disks.s3.endpoint') ?? null,
            'use_path_style_endpoint' => config('filesystems.disks.s3.use_path_style_endpoint', true),
            'credentials' => [
                'key' => config('filesystems.disks.s3.key'),
                'secret' => config('filesystems.disks.s3.secret'),
            ],
        ]);

        $params = [
            'Bucket' => $bucket,
            'Prefix' => $source.'/',
        ];

        // If spinner mode is requested, skip counting and use an indeterminate spinner.
        $useSpinner = (bool) $spinnerMode;

        $total = 0;
        $displayTotal = null;
        $bar = null;

        if ($useSpinner) {
            $this->info('Spinner mode enabled: skipping pre-count.');
            $processed = 0;
            // spinner chars for a simple indeterminate indicator
            $spinnerChars = ['|', '/', '-', '\\'];
            $spinIndex = 0;
            $start = microtime(true);
            $paginator = $client->getPaginator('ListObjectsV2', $params);
        } else {
            // First pass: count objects so we can display a progress bar.
            $total = 0;
            $countPaginator = $client->getPaginator('ListObjectsV2', $params);
            foreach ($countPaginator as $result) {
                if (empty($result['Contents'])) {
                    continue;
                }

                foreach ($result['Contents'] as $obj) {
                    $key = $obj['Key'];
                    $total++;
                    if ($limit && $total >= $limit) {
                        // We reached the declared limit while counting.
                        break 2;
                    }
                }
            }

            if ($total === 0) {
                $this->info('No objects found for the given source prefix.');

                return 0;
            }

            // Respect the --limit if provided.
            if ($limit) {
                $displayTotal = min($total, $limit);
            } else {
                $displayTotal = $total;
            }

            $this->info("Found $total objects (showing up to $displayTotal in this run).");

            // Create the progress bar.
            $bar = $this->output->createProgressBar($displayTotal);
            $bar->start();

            $processed = 0;
            $paginator = $client->getPaginator('ListObjectsV2', $params);
        }

        $start = $start ?? microtime(true);
        // Summary counters and samples
        $copied = 0;
        $skipped = 0;
        $deletedCount = 0;
        $failed = 0;
        $samples = [];
        foreach ($paginator as $result) {
            if (empty($result['Contents'])) {
                continue;
            }

            foreach ($result['Contents'] as $obj) {
                $key = $obj['Key'];
                // Ignore keys that don't start with the prefix (defensive)
                if (strpos($key, $source.'/') !== 0) {
                    continue;
                }

                $relative = substr($key, strlen($source) + 1);
                $targetKey = $target.'/'.$relative;

                if (! $progressOnly) {
                    $this->line("Found: $key -> $targetKey");
                }

                // Check target exists
                $targetExists = false;
                try {
                    $client->headObject(['Bucket' => $bucket, 'Key' => $targetKey]);
                    $targetExists = true;
                } catch (S3Exception $e) {
                    $targetExists = false;
                }

                if ($targetExists && ! $overwrite) {
                    if (! $progressOnly) {
                        $this->line("Skipping existing target: $targetKey");
                    }
                    $skipped++;
                    $samples[] = ['action' => 'skipped', 'source' => $key, 'target' => $targetKey];
                    if ($bar) {
                        $bar->advance();
                    }

                    continue;
                }

                if ($dry) {
                    if (! $progressOnly) {
                        $this->info("DRY: Would copy $key to $targetKey");
                    }
                } else {
                    if (! $progressOnly) {
                        $this->info("Copying $key to $targetKey");
                    }
                    $client->copyObject([
                        'Bucket' => $bucket,
                        'Key' => $targetKey,
                        'CopySource' => rawurlencode("{$bucket}/{$key}"),
                    ]);
                    $copied++;
                    $samples[] = ['action' => 'copied', 'source' => $key, 'target' => $targetKey];

                    if ($delete) {
                        if (! $progressOnly) {
                            $this->info("Deleting original $key");
                        }
                        try {
                            $client->deleteObject(['Bucket' => $bucket, 'Key' => $key]);
                            $deletedCount++;
                            $samples[] = ['action' => 'deleted', 'key' => $key];
                        } catch (\Exception $e) {
                            $failed++;
                            $samples[] = ['action' => 'delete_failed', 'key' => $key, 'error' => $e->getMessage()];
                        }
                    }
                }

                $processed++;
                if ($useSpinner) {
                    // simple spinner update (overwrite line) with elapsed/time rate
                    $spinIndex++;
                    $char = $spinnerChars[$spinIndex % count($spinnerChars)];
                    $elapsed = microtime(true) - $start;
                    $rate = $elapsed > 0 ? $processed / $elapsed : $processed;
                    $elapsedStr = number_format($elapsed, 2);
                    $rateStr = number_format($rate, 2);
                    if ($progressOnly) {
                        $this->output->write("\r$char $processed (elapsed: {$elapsedStr}s, rate: {$rateStr}/s)");
                    } else {
                        $this->output->write("\r$char Processed: $processed (elapsed: {$elapsedStr}s, rate: {$rateStr}/s)");
                    }
                } else {
                    if ($bar) {
                        $bar->advance();
                    }
                }
                if ($limit && $processed >= $limit) {
                    $this->info("Limit reached ($limit). Stopping.");
                    if ($useSpinner) {
                        $this->output->write("\r");
                        $this->newLine(1);
                    } else {
                        if ($bar) {
                            $bar->finish();
                            $this->newLine(2);
                        } else {
                            $this->newLine(1);
                        }
                    }
                    break 2;
                }
            }
        }

        $elapsed = microtime(true) - $start;
        $rate = $elapsed > 0 ? $processed / $elapsed : $processed;
        $elapsedStr = number_format($elapsed, 2);
        $rateStr = number_format($rate, 2);

        if ($useSpinner) {
            // finish spinner line
            $this->output->write("\r");
            $this->newLine(1);
        } elseif ($bar) {
            $bar->finish();
            $this->newLine(2);
        } else {
            $this->newLine(1);
        }

        $this->info("Completed. Processed: $processed objects. Elapsed: {$elapsedStr}s. Rate: {$rateStr}/s");

        // Write structured JSON report for CI collection and auditing
        try {
            $requestedReportPath = $this->option('report-path');

            if ($requestedReportPath) {
                // Resolve relative paths against project root
                if (DIRECTORY_SEPARATOR === '\\') {
                    // Windows: drive letter followed by :\ or :/
                    $isAbsolute = preg_match('/^[A-Za-z]:[\\\\\/]/', $requestedReportPath) === 1;
                } else {
                    // POSIX: absolute paths start with '/'
                    $isAbsolute = strpos($requestedReportPath, DIRECTORY_SEPARATOR) === 0;
                }
                if (! $isAbsolute) {
                    $requestedReportPath = base_path($requestedReportPath);
                }

                // If the user provided a directory, write a file inside it; if they provided a filename, use it directly
                if (pathinfo($requestedReportPath, PATHINFO_EXTENSION) === 'json') {
                    $reportFile = $requestedReportPath;
                    $reportDir = dirname($reportFile);
                } else {
                    $reportDir = rtrim($requestedReportPath, DIRECTORY_SEPARATOR);
                    $reportFile = $reportDir.DIRECTORY_SEPARATOR.'s3-normalize-'.time().'.json';
                }
            } else {
                $reportDir = base_path('artifacts');
                $reportFile = $reportDir.DIRECTORY_SEPARATOR.'s3-normalize-'.time().'.json';
            }

            if (! is_dir($reportDir)) {
                mkdir($reportDir, 0775, true);
            }

            $report = [
                'timestamp' => date('c'),
                'bucket' => $bucket,
                'source' => $source,
                'target' => $target,
                'dry' => (bool) $dry,
                'options' => [
                    'delete' => (bool) $delete,
                    'overwrite' => (bool) $overwrite,
                    'spinner' => (bool) $spinnerMode,
                    'progress_only' => (bool) $progressOnly,
                    'limit' => $limit,
                ],
                'stats' => [
                    'processed' => $processed,
                    'copied' => $copied,
                    'skipped' => $skipped,
                    'deleted' => $deletedCount,
                    'failed' => $failed,
                    'elapsed_seconds' => (float) $elapsedStr,
                    'rate_per_second' => (float) $rateStr,
                ],
                // include only first 200 samples to keep report size reasonable
                'samples' => array_slice($samples, 0, 200),
            ];

            file_put_contents($reportFile, json_encode($report, JSON_PRETTY_PRINT));
            $this->info("Wrote report: $reportFile");
        } catch (\Exception $e) {
            $this->error('Failed to write report: '.$e->getMessage());
        }

        return 0;
    }
}
