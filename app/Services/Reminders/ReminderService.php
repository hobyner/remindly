<?php

namespace App\Services\Reminders;

use App\Enums\ReminderStatus;
use App\Jobs\SendReminderJob;
use App\Models\Reminder;
use App\Models\User;
use Carbon\Carbon;

class ReminderService
{
    public function create(User $user, array $data): Reminder
    {
        $sendAt = Carbon::parse($data['send_at'], $data['timezone'] ?? 'UTC')->setTimezone('UTC');

        $reminder = $user->reminders()->create([
            ...$data,
            'send_at' => $sendAt,
            'next_run_at' => $sendAt,
            'status' => ReminderStatus::Scheduled,
        ]);

        return $reminder->load(['contact', 'template']);
    }

    public function update(Reminder $reminder, array $data): Reminder
    {
        if (isset($data['send_at'])) {
            $sendAt = Carbon::parse($data['send_at'], $data['timezone'] ?? $reminder->timezone)->setTimezone('UTC');
            $data['send_at'] = $sendAt;
            $data['next_run_at'] = $sendAt;
        }

        $reminder->update($data);

        return $reminder->fresh(['contact', 'template']);
    }

    public function queue(Reminder $reminder): Reminder
    {
        $reminder->update([
            'status' => ReminderStatus::Queued,
            'next_run_at' => $reminder->next_run_at ?? $reminder->send_at,
        ]);

        SendReminderJob::dispatch($reminder->id);

        return $reminder->fresh(['contact', 'template']);
    }

    public function dispatchDue(): int
    {
        $dispatched = 0;
        Reminder::due()
            ->with(['contact', 'template'])
            ->chunkById(50, function ($reminders) use (&$dispatched): void {
                foreach ($reminders as $reminder) {
                    $this->queue($reminder);
                    $dispatched++;
                }
            });

        return $dispatched;
    }
}
