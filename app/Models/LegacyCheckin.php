<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LegacyCheckin extends Model
{
    use HasFactory;

    protected $fillable = [
        'legacy_message_id',
        'requested_at',
        'responded_at',
        'response_token',
        'status',
    ];

    protected $casts = [
        'requested_at' => 'datetime',
        'responded_at' => 'datetime',
    ];

    public function legacyMessage(): BelongsTo
    {
        return $this->belongsTo(LegacyMessage::class);
    }
}
