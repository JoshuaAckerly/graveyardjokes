<?php

namespace App\Console\Commands;

use App\Mail\BlogPostNewsletterMail;
use App\Models\BlogPost;
use App\Models\Subscriber;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendBlogPostNewsletter extends Command
{
    protected $signature = 'app:send-newsletter {slug : The slug of the blog post to send} {--force : Resend even if already marked as sent}';

    protected $description = 'Send a blog post to all confirmed newsletter subscribers';

    public function handle(): int
    {
        $slug = $this->argument('slug');

        $post = BlogPost::published()->where('slug', $slug)->first();

        if (! $post) {
            $this->error("No published blog post found with slug \"{$slug}\".");

            return 1;
        }

        if ($post->newsletter_sent_at && ! $this->option('force')) {
            $this->warn("\"{$post->title}\" was already emailed to subscribers on {$post->newsletter_sent_at}. Pass --force to resend.");

            return 1;
        }

        $subscribers = Subscriber::confirmed()->get();

        if ($subscribers->isEmpty()) {
            $this->warn('No confirmed subscribers found. Nothing sent.');

            return 0;
        }

        $this->info("Sending \"{$post->title}\" to {$subscribers->count()} subscriber(s)…");

        $bar = $this->output->createProgressBar($subscribers->count());
        $bar->start();

        $sent = 0;
        $failed = 0;

        foreach ($subscribers as $subscriber) {
            try {
                Mail::to($subscriber->email)->send(new BlogPostNewsletterMail($post, $subscriber));
                $sent++;
            } catch (\Throwable $e) {
                $this->newLine();
                $this->warn("  Failed for {$subscriber->email}: {$e->getMessage()}");
                $failed++;
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info("✅ Sent: {$sent}  |  Failed: {$failed}");

        $post->update(['newsletter_sent_at' => now()]);

        return 0;
    }
}
