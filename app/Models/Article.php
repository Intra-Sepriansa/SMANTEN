<?php

namespace App\Models;

use App\Enums\ArticleStatus;
use App\Enums\PortfolioVisibility;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Article extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'article_category_id',
        'author_user_id',
        'reviewer_user_id',
        'featured_media_asset_id',
        'title',
        'slug',
        'excerpt',
        'body',
        'status',
        'visibility',
        'is_featured',
        'approved_at',
        'published_at',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'status' => ArticleStatus::class,
            'visibility' => PortfolioVisibility::class,
            'is_featured' => 'boolean',
            'approved_at' => 'datetime',
            'published_at' => 'datetime',
            'metadata' => 'array',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ArticleCategory::class, 'article_category_id');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_user_id');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_user_id');
    }

    public function featuredMedia(): BelongsTo
    {
        return $this->belongsTo(MediaAsset::class, 'featured_media_asset_id');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class)->withTimestamps();
    }

    public function mediaAssets(): MorphMany
    {
        return $this->morphMany(MediaAsset::class, 'attachable');
    }
}
