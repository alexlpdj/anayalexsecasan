<?php

namespace App\Mail;

use App\Models\InvitationGroup;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RsvpReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public InvitationGroup $group,
    ) {}

    public function envelope(): Envelope
    {
        $this->locale($this->group->default_language ?? 'es');

        return new Envelope(
            subject: __('emails.subject_reminder'),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.rsvp-reminder',
        );
    }
}
