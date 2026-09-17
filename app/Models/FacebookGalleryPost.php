<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class FacebookGalleryPost extends Model
{
    protected $table = 'facebook_gallery_posts';

    protected $fillable = [
        'post_url',
        'title',
        'description',
        'tags',
        'thumbnail_url',
        'posted_at',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'posted_at' => 'date',
            'is_active' => 'boolean',
            'tags' => 'array',
        ];
    }

    public function getEmbedUrlAttribute(): string
    {
        return 'https://www.facebook.com/plugins/post.php?href='.urlencode($this->post_url).'&width=500&show_text=false';
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
