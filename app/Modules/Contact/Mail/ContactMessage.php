<?php

namespace App\Modules\Contact\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactMessage extends Mailable
{
    use Queueable, SerializesModels;

    public $first_name;
    public $last_name;
    public $email;
    public $message;

    public function __construct($first_name, $last_name, $email, $message)
    {
        $this->first_name = $first_name;
        $this->last_name = $last_name;
        $this->email = $email;
        $this->message = $message;
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Contact Message');
    }

    public function content(): Content
    {
        return new Content(markdown: 'emails.contact.message');
    }

    public function attachments(): array
    {
        return [];
    }
}
