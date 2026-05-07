<?php

namespace App\Models;

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

    /** Posts due to fire right now. */
    public function scopeDue(\Illuminate\Database\Eloquent\Builder $query): \Illuminate\Database\Eloquent\Builder
    {
        return $query
            ->where('status', 'pending')
            ->where('scheduled_at', '<=', now());
    }
}
