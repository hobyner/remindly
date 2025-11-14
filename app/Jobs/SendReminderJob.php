<?php

namespace App\Jobs;

use App\Enums\ReminderChannel;
use App\Enums\ReminderStatus;
use App\Mail\ReminderMail;
use App\Models\Reminder;
use App\Models\ReminderLog;
use App\Services\Messaging\TemplateRenderer;
use App\Services\Messaging\WhatsAppClient;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Throwable;

class SendReminderJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public function __construct(public int $reminderId)
    {
    }

    public function handle(TemplateRenderer $renderer, WhatsAppClient $whatsAppClient): void
    {
        $reminder = Reminder::with(['contact', 'template', 'user.channelCredentials'])->find($this->reminderId);

        if (!$reminder) {
            return;
        }

        $content = $renderer->render($reminder);

        try {
            $response = match ($reminder->channel) {
                ReminderChannel::WhatsApp => $whatsAppClient->sendTextMessage($reminder, $content),
                ReminderChannel::Email => $this->sendEmail($reminder, $content),
            };

            ReminderLog::create([
                'reminder_id' => $reminder->id,
                'channel' => $reminder->channel,
                'status' => ReminderStatus::Sent,
                'payload' => $content,
                'response' => $response,
                'sent_at' => now(),
            ]);

            $reminder->last_run_at = now();
            $reminder->status = ReminderStatus::Sent;
            $reminder->scheduleNextRun($reminder->next_run_at ?? $reminder->send_at);
            $reminder->save();
        } catch (Throwable $exception) {
            ReminderLog::create([
                'reminder_id' => $reminder->id,
                'channel' => $reminder->channel,
                'status' => ReminderStatus::Failed,
                'payload' => $content,
                'error_message' => $exception->getMessage(),
            ]);

            $reminder->status = ReminderStatus::Failed;
            $reminder->save();

            throw $exception;
        }
    }

    private function sendEmail(Reminder $reminder, array $content): array
    {
        if (!$reminder->contact?->email) {
            throw new \RuntimeException('Contact email missing');
        }

        Mail::to($reminder->contact->email)->send(new ReminderMail($reminder, $content));

        return ['status' => 'mail_queued'];
    }
}
