<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class AlumniForumPost extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'alumni_profile_id',
        'author_name',
        'graduation_year',
        'category',
        'title',
        'slug',
        'body',
        'institution_name',
        'occupation_title',
        'city',
        'province',
        'location_latitude',
        'location_longitude',
        'contact_email',
        'likes_count',
        'views_count',
        'comments_count',
        'bookmarks_count',
        'share_count',
        'reports_count',
        'is_approved',
        'is_featured',
        'moderation_status',
        'moderation_notes',
        'spam_score',
        'is_open_to_mentor',
        'has_hiring_info',
        'approved_at',
        'last_interaction_at',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'graduation_year' => 'integer',
            'location_latitude' => 'decimal:7',
            'location_longitude' => 'decimal:7',
            'likes_count' => 'integer',
            'views_count' => 'integer',
            'comments_count' => 'integer',
            'bookmarks_count' => 'integer',
            'share_count' => 'integer',
            'reports_count' => 'integer',
            'is_approved' => 'boolean',
            'is_featured' => 'boolean',
            'spam_score' => 'integer',
            'is_open_to_mentor' => 'boolean',
            'has_hiring_info' => 'boolean',
            'approved_at' => 'datetime',
            'last_interaction_at' => 'datetime',
            'metadata' => 'array',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (self $post): void {
            if ($post->slug === null || ($post->isDirty('title') && ! $post->isDirty('slug'))) {
                $post->slug = $post->buildUniqueSlug($post->title);
            }
        });
    }

    public function alumniProfile(): BelongsTo
    {
        return $this->belongsTo(AlumniProfile::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(AlumniForumComment::class)->latest();
    }

    public function reactions(): HasMany
    {
        return $this->hasMany(AlumniForumReaction::class);
    }

    protected function buildUniqueSlug(?string $source): string
    {
        $base = Str::slug($source ?: 'cerita-alumni');

        if ($base === '') {
            $base = 'cerita-alumni';
        }

        $slug = $base;
        $suffix = 2;

        while (
            static::query()
                ->where('slug', $slug)
                ->when($this->exists, fn ($query) => $query->whereKeyNot($this->getKey()))
                ->exists()
        ) {
            $slug = $base.'-'.$suffix;
            $suffix++;
        }

        return $slug;
    }
}
