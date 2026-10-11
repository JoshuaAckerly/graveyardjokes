<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class TikTokVideo extends Model
{
    protected $table = 'tiktok_videos';

    protected $fillable = [
        'tiktok_video_id',
        'post_type',
        'title',
        'description',
        'thumbnail_url',
        'posted_at',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'posted_at' => 'date',
        'is_active' => 'boolean',
    ];

    public function getEmbedUrlAttribute(): string
    {
        return "https://www.tiktok.com/embed/v2/{$this->tiktok_video_id}";
    }

    public function getVideoUrlAttribute(): string
    {
        $configuredUsername = config('services.tiktok.username', 'graveyardjokes');
        $username = ltrim(is_string($configuredUsername) ? $configuredUsername : 'graveyardjokes', '@');
        $type = $this->post_type ?? 'video';

        return "https://www.tiktok.com/@{$username}/{$type}/{$this->tiktok_video_id}";
    }

    /**
     * @param  Builder<TikTokVideo>  $query
     * @return Builder<TikTokVideo>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
