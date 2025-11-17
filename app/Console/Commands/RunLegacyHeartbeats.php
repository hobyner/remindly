<?php

namespace App\Console\Commands;

use App\Jobs\DeliverLegacyMessage;
use App\Jobs\ProcessLegacyHeartbeat;
use App\Models\LegacyMessage;
use Illuminate\Console\Command;

class RunLegacyHeartbeats extends Command
{
    protected $signature = 'legacy:run-heartbeats';

    protected $description = 'Dispatch heartbeat prompts and delivery jobs for legacy messages';

    public function handle(): int
    {
        $heartbeatCandidates = LegacyMessage::query()
            ->where('status', 'armed')
            ->where(function ($query): void {
                $query->whereNull('next_check_in_due_at')
                    ->orWhere('next_check_in_due_at', '<=', now());
            })
            ->get();

        foreach ($heartbeatCandidates as $message) {
            ProcessLegacyHeartbeat::dispatch($message->id)->onQueue('legacy');
        }

        $deliveryCandidates = LegacyMessage::query()
            ->where('status', 'armed')
            ->whereNotNull('last_check_in_at')
            ->whereRaw('TIMESTAMPDIFF(MINUTE, last_check_in_at, ?) >= grace_period_minutes', [now()])
            ->where(function ($query): void {
                $query->whereNull('deliver_at')
                    ->orWhere('deliver_at', '<=', now());
            })
            ->get();

        foreach ($deliveryCandidates as $message) {
            DeliverLegacyMessage::dispatch($message->id)->onQueue('legacy');
        }

        $this->info(sprintf(
            'Dispatch complete. Heartbeats: %d, deliveries: %d',
            $heartbeatCandidates->count(),
            $deliveryCandidates->count(),
        ));

        return self::SUCCESS;
    }
}
