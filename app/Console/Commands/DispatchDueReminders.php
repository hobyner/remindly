<?php

namespace App\Console\Commands;

use App\Services\Reminders\ReminderService;
use Illuminate\Console\Command;

class DispatchDueReminders extends Command
{
    protected $signature = 'remindly:dispatch-due';

    protected $description = 'Queue reminders that are due for sending';

    public function handle(ReminderService $reminderService): int
    {
        $count = $reminderService->dispatchDue();
        $this->info("Queued {$count} reminders for delivery.");

        return self::SUCCESS;
    }
}
