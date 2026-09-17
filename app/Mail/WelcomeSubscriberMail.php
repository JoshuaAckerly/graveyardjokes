<?php

namespace App\Mail;

use App\Models\Subscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WelcomeSubscriberMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public readonly Subscriber $subscriber) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Welcome to the Graveyard Jokes Studios blog',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.welcome_subscriber',
            with: [
                'unsubscribeUrl' => url('/studio/newsletter/unsubscribe/'.$this->subscriber->unsubscribe_token),
            ],
        );
    }
}
