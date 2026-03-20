<?php

namespace App\Mail;

use App\Models\InvitationGroup;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdminSongNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public InvitationGroup $group,
        public string $trackTitle,
        public string $artistName,
        public ?string $artworkUrl,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "{$this->group->name} ha sugerido una canción: {$this->trackTitle}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.admin-song-notification',
        );
    }
}
