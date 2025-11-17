<?php

namespace App\Models;

use App\Support\LegacyEncryption;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

class LegacyMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'body',
        'voice_note_path',
        'file_path',
        'encryption_key_id',
        'status',
        'check_in_frequency_unit',
        'check_in_frequency_value',
        'grace_period_minutes',
        'deliver_at',
        'armed_at',
        'last_check_in_at',
        'next_check_in_due_at',
        'delivery_started_at',
        'delivered_at',
        'heartbeat_token',
        'notes',
    ];

    protected $casts = [
        'deliver_at' => 'datetime',
        'armed_at' => 'datetime',
        'last_check_in_at' => 'datetime',
        'next_check_in_due_at' => 'datetime',
        'delivery_started_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    protected $hidden = [
        'encryption_key_id',
        'heartbeat_token',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $message): void {
            if (! $message->encryption_key_id) {
                $message->encryption_key_id = LegacyEncryption::wrapKey(LegacyEncryption::generateKey());

                if (! empty($message->attributes['body'])) {
                    $message->attributes['body'] = LegacyEncryption::encryptText($message, $message->attributes['body']);
                }

                if (! empty($message->attributes['notes'])) {
                    $message->attributes['notes'] = LegacyEncryption::encryptText($message, $message->attributes['notes']);
                }
            }
        });

        static::deleting(function (self $message): void {
            if ($message->file_path) {
                Storage::disk($message->file_disk ?: config('filesystems.default'))->delete($message->file_path);
            }
            if ($message->voice_note_path) {
                Storage::disk($message->voice_note_disk ?: config('filesystems.default'))->delete($message->voice_note_path);
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function recipients(): HasMany
    {
        return $this->hasMany(LegacyRecipient::class);
    }

    public function checkins(): HasMany
    {
        return $this->hasMany(LegacyCheckin::class);
    }

    protected function isArmed(): Attribute
    {
        return Attribute::get(fn (): bool => $this->status === 'armed');
    }

    protected function body(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $this->encryption_key_id ? LegacyEncryption::decryptText($this, $value) : $value,
            set: fn ($value) => $this->encryption_key_id ? LegacyEncryption::encryptText($this, $value) : $value,
        );
    }

    protected function notes(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $this->encryption_key_id ? LegacyEncryption::decryptText($this, $value) : $value,
            set: fn ($value) => $this->encryption_key_id ? LegacyEncryption::encryptText($this, $value) : $value,
        );
    }

    public function scheduleNextCheckIn(): void
    {
        $base = Carbon::now();
        $unit = $this->check_in_frequency_unit;
        $value = max(1, (int) $this->check_in_frequency_value);
        $due = match ($unit) {
            'minute' => $base->copy()->addMinutes($value),
            'hour' => $base->copy()->addHours($value),
            'week' => $base->copy()->addWeeks($value),
            'month' => $base->copy()->addMonths($value),
            default => $base->copy()->addDays($value),
        };

        $this->next_check_in_due_at = $due;
    }
}
