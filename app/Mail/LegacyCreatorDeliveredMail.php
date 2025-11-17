<?php

namespace App\Mail;

use App\Models\LegacyMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LegacyCreatorDeliveredMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public LegacyMessage $message,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: sprintf('Legacy message delivered: %s', $this->message->title),
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.legacy.creator',
            with: [
                'messageTitle' => $this->message->title,
                'recipientNames' => $this->message->recipients->pluck('name')->join(', '),
            ],
        );
    }
}
