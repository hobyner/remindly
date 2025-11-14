<?php

namespace App\Models;

use App\Enums\ReminderChannel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ReminderTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'category',
        'channel',
        'subject',
        'body',
        'placeholders',
        'is_default',
    ];

    protected $casts = [
        'placeholders' => 'array',
        'is_default' => 'boolean',
        'channel' => ReminderChannel::class,
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reminders(): HasMany
    {
        return $this->hasMany(Reminder::class);
    }
}
