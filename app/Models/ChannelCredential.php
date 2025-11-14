<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChannelCredential extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'channel',
        'settings',
        'verified_at',
        'status',
    ];

    protected $casts = [
        'settings' => 'array',
        'verified_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
