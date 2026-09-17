<?php

namespace App\Mail;

use App\Models\BlogPost;
use App\Models\Subscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BlogPostNewsletterMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly BlogPost $post,
        public readonly Subscriber $subscriber,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->post->title.' — Graveyard Jokes Studios',
        );
    }

    public function content(): Content
    {
        $appUrl = config('app.url', '');
        if (! is_string($appUrl)) {
            $appUrl = '';
        }
        $base = rtrim($appUrl, '/');

        return new Content(
            view: 'emails.blog_post_newsletter',
            with: [
                'postUrl' => $base.'/studio/blog/'.$this->post->slug,
                'unsubscribeUrl' => url('/studio/newsletter/unsubscribe/'.$this->subscriber->unsubscribe_token),
            ],
        );
    }
}
