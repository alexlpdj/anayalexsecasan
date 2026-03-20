<?php

namespace App\Mail;

use App\Models\InvitationGroup;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdminRsvpNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public InvitationGroup $group,
        public bool $attending,
        public bool $isUpdate,
    ) {}

    public function envelope(): Envelope
    {
        $action = $this->attending ? 'confirmado' : 'rechazado';
        $prefix = $this->isUpdate ? '[Modificación] ' : '';

        return new Envelope(
            subject: "{$prefix}{$this->group->name} ha {$action} la invitación",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.admin-rsvp-notification',
        );
    }
}
