<?php

namespace App\Models;

use App\Enums\ReminderChannel;
use App\Enums\ReminderStatus;
use App\Enums\ReminderType;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Reminder extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'contact_id',
        'reminder_template_id',
        'title',
        'description',
        'channel',
        'type',
        'send_at',
        'timezone',
        'repeat_type',
        'repeat_interval',
        'repeat_weekdays',
        'repeat_day_of_month',
        'status',
        'last_run_at',
        'next_run_at',
        'metadata',
    ];

    protected $casts = [
        'send_at' => 'datetime',
        'last_run_at' => 'datetime',
        'next_run_at' => 'datetime',
        'repeat_weekdays' => 'array',
        'metadata' => 'array',
        'channel' => ReminderChannel::class,
        'status' => ReminderStatus::class,
        'type' => ReminderType::class,
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(ReminderTemplate::class, 'reminder_template_id');
    }

    public function logs(): HasMany
    {
        return $this->hasMany(ReminderLog::class);
    }

    public function scopeDue(Builder $query): Builder
    {
        return $query->where('status', ReminderStatus::Scheduled)
            ->whereNotNull('next_run_at')
            ->where('next_run_at', '<=', now());
    }

    public function scheduleNextRun(?CarbonInterface $from = null): void
    {
        $fromDate = $from ?? $this->send_at;

        if ($this->repeat_type === 'none') {
            $this->next_run_at = null;
            $this->status = ReminderStatus::Sent;
            return;
        }

        $interval = max($this->repeat_interval, 1);

        $next = match ($this->repeat_type) {
            'daily' => $fromDate->copy()->addDays($interval),
            'weekly' => $fromDate->copy()->addWeeks($interval),
            'monthly' => $fromDate->copy()->addMonths($interval),
            'yearly' => $fromDate->copy()->addYears($interval),
            default => null,
        };

        if ($next) {
            $this->next_run_at = $next;
            $this->status = ReminderStatus::Scheduled;
        }
    }
}
