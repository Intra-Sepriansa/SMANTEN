<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class AlumniProfile extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'student_profile_id',
        'graduation_year',
        'full_name',
        'slug',
        'institution_name',
        'occupation_title',
        'career_cluster',
        'city',
        'province',
        'contact_email',
        'contact_phone',
        'bio',
        'is_public_profile',
        'is_open_to_mentor',
        'has_hiring_info',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'graduation_year' => 'integer',
            'is_public_profile' => 'boolean',
            'is_open_to_mentor' => 'boolean',
            'has_hiring_info' => 'boolean',
            'metadata' => 'array',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (self $profile): void {
            if ($profile->slug === null || ($profile->isDirty('full_name') && ! $profile->isDirty('slug'))) {
                $profile->slug = $profile->buildUniqueSlug($profile->full_name);
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function studentProfile(): BelongsTo
    {
        return $this->belongsTo(StudentProfile::class);
    }

    public function tracerStudyResponses(): HasMany
    {
        return $this->hasMany(TracerStudyResponse::class);
    }

    public function forumPosts(): HasMany
    {
        return $this->hasMany(AlumniForumPost::class);
    }

    protected function buildUniqueSlug(?string $source): string
    {
        $base = Str::slug($source ?: 'alumni');

        if ($base === '') {
            $base = 'alumni';
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
