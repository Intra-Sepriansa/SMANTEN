<?php

namespace App\Models;

use App\Enums\PortfolioItemStatus;
use App\Enums\PortfolioVisibility;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class PortfolioItem extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'portfolio_project_id',
        'creator_user_id',
        'approved_by_user_id',
        'title',
        'slug',
        'item_type',
        'summary',
        'content',
        'status',
        'visibility',
        'is_featured',
        'price_estimate',
        'approved_at',
        'published_at',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'status' => PortfolioItemStatus::class,
            'visibility' => PortfolioVisibility::class,
            'is_featured' => 'boolean',
            'price_estimate' => 'decimal:2',
            'approved_at' => 'datetime',
            'published_at' => 'datetime',
            'metadata' => 'array',
        ];
    }

    public function portfolioProject(): BelongsTo
    {
        return $this->belongsTo(PortfolioProject::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_user_id');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by_user_id');
    }

    public function mediaAssets(): MorphMany
    {
        return $this->morphMany(MediaAsset::class, 'attachable');
    }
}
