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

    /**
     * @var array<string,mixed>
     */
    public array $visitorData;

    /**
     * @param array<string,mixed> $visitorData
     */
    public function __construct(array $visitorData)
    {
        $this->visitorData = $visitorData;
    }

    public function envelope(): Envelope
    {
        $city = (string) ($this->visitorData['city'] ?? 'Unknown');
        $country = (string) ($this->visitorData['country'] ?? 'Unknown');
        return new Envelope(subject: 'New visitor from ' . $city . ', ' . $country);
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
