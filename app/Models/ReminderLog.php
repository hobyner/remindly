<?php

namespace App\Models;

use App\Enums\ReminderChannel;
use App\Enums\ReminderStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReminderLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'reminder_id',
        'channel',
        'status',
        'payload',
        'response',
        'error_message',
        'sent_at',
    ];

    protected $casts = [
        'payload' => 'array',
        'response' => 'array',
        'sent_at' => 'datetime',
        'channel' => ReminderChannel::class,
        'status' => ReminderStatus::class,
    ];

    public function reminder(): BelongsTo
    {
        return $this->belongsTo(Reminder::class);
    }
}
