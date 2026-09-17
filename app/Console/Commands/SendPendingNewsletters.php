<?php

namespace App\Console\Commands;

use App\Mail\BlogPostNewsletterMail;
use App\Models\BlogPost;
use App\Models\Subscriber;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendPendingNewsletters extends Command
{
    protected $signature = 'app:send-pending-newsletters';

    protected $description = 'Send the newsletter for any published blog post that hasn\'t been emailed to subscribers yet';

    public function handle(): int
    {
        $posts = BlogPost::published()->whereNull('newsletter_sent_at')->get();

        if ($posts->isEmpty()) {
            $this->line('No pending posts to notify subscribers about.');

            return self::SUCCESS;
        }

        $subscribers = Subscriber::confirmed()->get();

        foreach ($posts as $post) {
            if ($subscribers->isEmpty()) {
                $this->warn("No confirmed subscribers — marking \"{$post->title}\" as sent without emailing anyone.");
                $post->update(['newsletter_sent_at' => now()]);

                continue;
            }

            $this->info("Sending \"{$post->title}\" to {$subscribers->count()} subscriber(s)…");
            $sent = 0;
            $failed = 0;

            foreach ($subscribers as $subscriber) {
                try {
                    Mail::to($subscriber->email)->send(new BlogPostNewsletterMail($post, $subscriber));
                    $sent++;
                } catch (\Throwable $e) {
                    $this->warn("  Failed for {$subscriber->email}: {$e->getMessage()}");
                    $failed++;
                }
            }

            $post->update(['newsletter_sent_at' => now()]);
            $this->info("  Sent: {$sent}  |  Failed: {$failed}");
        }

        return self::SUCCESS;
    }
}
