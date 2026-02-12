<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class GuestQuestionMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $groupName,
        public string $question,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Nueva pregunta de {$this->groupName}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.guest-question',
        );
    }
}
