<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class DiscordPost extends Model
{
    protected $fillable = [
        'title',
        'content',
        'author',
        'channel',
        'jump_url',
        'image_url',
        'is_published',
        'posted_at',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'posted_at' => 'datetime',
    ];

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }
}
