<?php

namespace App\Mail;

use App\Models\Reminder;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Reminder $reminder, public array $content)
    {
    }

    public function build(): self
    {
        return $this->subject($this->content['subject'])
            ->markdown('emails.reminder', [
                'body' => $this->content['body'],
                'reminder' => $this->reminder,
            ]);
    }
}
