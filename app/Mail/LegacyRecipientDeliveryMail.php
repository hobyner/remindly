<?php

namespace App\Mail;

use App\Models\LegacyMessage;
use App\Models\LegacyRecipient;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LegacyRecipientDeliveryMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public LegacyMessage $message,
        public LegacyRecipient $recipient,
        public string $viewUrl,
        public string $secondaryCode,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'A private message has been released to you',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.legacy.recipient',
            with: [
                'messageTitle' => $this->message->title,
                'recipientName' => $this->recipient->name,
                'viewUrl' => $this->viewUrl,
                'secondaryCode' => $this->secondaryCode,
            ],
        );
    }
}
