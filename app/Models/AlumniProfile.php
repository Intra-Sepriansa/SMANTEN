<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class AlumniProfile extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'student_profile_id',
        'graduation_year',
        'full_name',
        'institution_name',
        'occupation_title',
        'career_cluster',
        'city',
        'province',
        'contact_email',
        'contact_phone',
        'bio',
        'is_public_profile',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'graduation_year' => 'integer',
            'is_public_profile' => 'boolean',
            'metadata' => 'array',
        ];
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
}
