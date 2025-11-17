<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LegacyRecipient extends Model
{
    use HasFactory;

    protected $fillable = [
        'legacy_message_id',
        'name',
        'email',
        'phone',
        'channel_preference',
        'verification_code',
        'verified_at',
        'delivered_at',
        'delivery_channel',
        'delivery_status',
        'delivery_error',
    ];

    protected $casts = [
        'verified_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    public function legacyMessage(): BelongsTo
    {
        return $this->belongsTo(LegacyMessage::class);
    }
}
