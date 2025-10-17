<?php

namespace App\Modules\Visitor\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewVisitorNotification extends Mailable
{
    use Queueable, SerializesModels;

    public array $visitorData;

    public function __construct(array $visitorData)
    {
        $this->visitorData = $visitorData;
    }

    public function envelope(): Envelope
    {
        $city = $this->visitorData['city'] ?? 'Unknown';
        $country = $this->visitorData['country'] ?? 'Unknown';
        return new Envelope(subject: "New visitor from {$city}, {$country}");
    }

    public function content(): Content
    {
        return new Content(view: 'emails.new-visitor', with: ['visitor' => $this->visitorData]);
    }

    public function attachments(): array
    {
        return [];
    }
}
