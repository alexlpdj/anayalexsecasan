<?php

namespace App\Mail;

use App\Models\InvitationGroup;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RsvpConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public bool $attending;

    public function __construct(
        public InvitationGroup $group,
    ) {
        $this->attending = $group->guests->contains(fn($g) => $g->attending === true);
    }

    public function envelope(): Envelope
    {
        $this->locale($this->group->default_language ?? 'es');

        $subject = $this->attending
            ? __('emails.subject_confirmation')
            : __('emails.subject_confirmation_decline');

        return new Envelope(
            subject: $subject,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.rsvp-confirmation',
            with: [
                'attending' => $this->attending,
            ],
        );
    }
}
