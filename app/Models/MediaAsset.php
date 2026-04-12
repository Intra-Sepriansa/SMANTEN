<?php

namespace App\Models;

use App\Enums\MediaType;
use App\Enums\PortfolioVisibility;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class MediaAsset extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'attachable_type',
        'attachable_id',
        'uploader_user_id',
        'media_type',
        'disk',
        'path',
        'original_name',
        'alt_text',
        'mime_type',
        'size_bytes',
        'sort_order',
        'visibility',
        'provider',
        'provider_media_id',
        'external_url',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'media_type' => MediaType::class,
            'size_bytes' => 'integer',
            'sort_order' => 'integer',
            'visibility' => PortfolioVisibility::class,
            'metadata' => 'array',
        ];
    }

    public function attachable(): MorphTo
    {
        return $this->morphTo();
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploader_user_id');
    }
}
