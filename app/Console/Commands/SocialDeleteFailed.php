<?php

namespace App\Console\Commands;

use App\Models\SocialScheduledPost;
use Illuminate\Console\Command;

class SocialDeleteFailed extends Command
{
    protected $signature = 'social:delete-failed
        {--platform= : Only delete failed posts for this platform (e.g. instagram)}
        {--id=*      : Specific post IDs to delete (repeatable: --id=1 --id=2)}';

    protected $description = 'Permanently delete failed social posts.';

    public function handle(): int
    {
        $query = SocialScheduledPost::where('status', 'failed');

        $platform = $this->option('platform');
        if (! empty($platform)) {
            $query->where('platform', $platform);
        }

        $ids = $this->option('id');
        if (! empty($ids)) {
            $query->whereIn('id', $ids);
        }

        $posts = $query->get();

        if ($posts->isEmpty()) {
            $this->line('No failed posts found matching those criteria.');

            return self::SUCCESS;
        }

        $this->table(
            ['ID', 'Platform', 'Scheduled At', 'Error'],
            $posts->map(fn ($p) => [
                $p->id,
                $p->platform,
                $p->scheduled_at->toDateTimeString(),
                \Str::limit($p->error_message ?? '—', 80),
            ])
        );

        if (! $this->confirm("Permanently delete {$posts->count()} failed post(s)?")) {
            $this->line('Aborted.');

            return self::SUCCESS;
        }

        SocialScheduledPost::whereIn('id', $posts->pluck('id'))->delete();

        $this->info("Deleted {$posts->count()} failed post(s).");

        return self::SUCCESS;
    }
}
