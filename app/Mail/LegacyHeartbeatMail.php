<?php

namespace App\Mail;

use App\Models\LegacyMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LegacyHeartbeatMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public LegacyMessage $message,
        public string $confirmUrl,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Are you ok? Legacy heartbeat needed',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.legacy.heartbeat',
            with: [
                'messageTitle' => $this->message->title,
                'confirmUrl' => $this->confirmUrl,
                'frequency' => sprintf(
                    'every %d %s',
                    $this->message->check_in_frequency_value,
                    $this->message->check_in_frequency_unit . ($this->message->check_in_frequency_value > 1 ? 's' : '')
                ),
            ],
        );
    }
}
