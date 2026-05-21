<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class SocialScheduledPost extends Model
{
    protected $fillable = [
        'platform',
        'content',
        'media_url',
        'extra',
        'scheduled_at',
        'posted_at',
        'status',
        'error_message',
    ];

    protected $casts = [
        'extra' => 'array',
        'scheduled_at' => 'datetime',
        'posted_at' => 'datetime',
    ];

    // Valid statuses: pending → processing → posted | failed
    // 'processing' means a dispatch worker has claimed the row and is actively
    // sending it.  Rows stuck in 'processing' for > 5 minutes can be reset
    // back to 'pending' via `php artisan social:dispatch:reset-stuck`.

    /** Posts due to fire right now (only unclaimed/pending rows). */
    public function scopeDue(Builder $query): Builder
    {
        return $query
            ->where('status', 'pending')
            ->where('scheduled_at', '<=', now());
    }

    /** Posts currently being processed by a dispatch worker. */
    public function scopeProcessing(Builder $query): Builder
    {
        return $query->where('status', 'processing');
    }
}
