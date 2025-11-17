<?php

namespace App\Jobs;

use App\Mail\LegacyHeartbeatMail;
use App\Models\LegacyMessage;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;

class ProcessLegacyHeartbeat implements ShouldQueue
{
    use Queueable;

    public function __construct(protected int $legacyMessageId)
    {
    }

    public function handle(): void
    {
        $message = LegacyMessage::with('user')->find($this->legacyMessageId);

        if (! $message || $message->status !== 'armed') {
            return;
        }

        if ($message->user->legacy_paused_at) {
            return;
        }

        if ($message->next_check_in_due_at && now()->lt($message->next_check_in_due_at)) {
            return;
        }

        $checkin = $message->checkins()->create([
            'requested_at' => now(),
            'status' => 'pending',
            'response_token' => \Str::uuid()->toString(),
        ]);

        $message->scheduleNextCheckIn();
        $message->save();

        $confirmUrl = URL::temporarySignedRoute(
            'legacy.heartbeat.confirm',
            now()->addMinutes($message->grace_period_minutes + 30),
            [
                'token' => $message->heartbeat_token,
                'checkin' => $checkin->response_token,
            ],
        );

        Mail::to($message->user->email)->queue(new LegacyHeartbeatMail($message, $confirmUrl));

        Log::info('Legacy heartbeat sent', [
            'message_id' => $message->id,
            'user_id' => $message->user_id,
            'checkin_id' => $checkin->id,
        ]);
    }
}
