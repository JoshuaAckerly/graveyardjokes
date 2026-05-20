<?php

namespace App\Console\Commands;

use App\Models\SocialScheduledPost;
use Illuminate\Console\Command;

class SocialDispatchResetStuck extends Command
{
    protected $signature = 'social:dispatch:reset-stuck
        {--minutes=5 : Reset posts stuck in "processing" longer than this many minutes}';

    protected $description = 'Reset social posts stuck in "processing" back to "pending" (e.g. after a server crash mid-send).';

    public function handle(): int
    {
        $minutes = (int) $this->option('minutes');

        $count = SocialScheduledPost::processing()
            ->where('updated_at', '<=', now()->subMinutes($minutes))
            ->update(['status' => 'pending']);

        if ($count > 0) {
            $this->warn("Reset {$count} stuck post(s) from 'processing' back to 'pending'.");
        } else {
            $this->line('No stuck posts found.');
        }

        return self::SUCCESS;
    }
}
