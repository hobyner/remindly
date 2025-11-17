<?php

namespace App\Jobs;

use App\Mail\LegacyCreatorDeliveredMail;
use App\Models\LegacyMessage;
use App\Services\LegacyChannelDispatcher;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

class DeliverLegacyMessage implements ShouldQueue
{
    use Queueable;

    public function __construct(protected int $legacyMessageId)
    {
    }

    public function handle(): void
    {
        $message = LegacyMessage::with(['recipients', 'user'])->find($this->legacyMessageId);

        if (! $message || in_array($message->status, ['delivered', 'cancelled'], true)) {
            return;
        }

        $message->update([
            'status' => 'delivering',
            'delivery_started_at' => now(),
        ]);

        $dispatcher = new LegacyChannelDispatcher();

        foreach ($message->recipients as $recipient) {
            if (! $recipient->verification_code) {
                $recipient->verification_code = Str::random(40);
            }
            $recipient->secondary_code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            $recipient->secondary_verified_at = null;

            $viewUrl = URL::temporarySignedRoute(
                'legacy.recipient.view',
                now()->addDays(14),
                [
                    'recipient' => $recipient->id,
                    'token' => $recipient->verification_code,
                ],
            );

            $dispatcher->send($recipient, $message, $viewUrl, $recipient->secondary_code);

            $recipient->delivery_status = 'sent';
            $recipient->delivery_channel = $recipient->channel_preference;
            $recipient->delivered_at = now();
            $recipient->save();
        }

        $message->update([
            'status' => 'delivered',
            'delivered_at' => now(),
        ]);

        Mail::to($message->user->email)->queue(new LegacyCreatorDeliveredMail($message));

        Log::info('Legacy message delivered', [
            'message_id' => $message->id,
            'recipients' => $message->recipients->count(),
        ]);
    }
}
