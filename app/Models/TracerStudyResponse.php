<?php

namespace App\Models;

use App\Enums\TracerStudyStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TracerStudyResponse extends Model
{
    use HasFactory;

    protected $fillable = [
        'alumni_profile_id',
        'verified_by_user_id',
        'status',
        'current_activity',
        'institution_name',
        'major',
        'occupation_title',
        'industry',
        'location_city',
        'location_province',
        'started_at',
        'monthly_income_range',
        'reflections',
        'is_publicly_displayable',
        'submitted_at',
        'verified_at',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'status' => TracerStudyStatus::class,
            'started_at' => 'date',
            'is_publicly_displayable' => 'boolean',
            'submitted_at' => 'datetime',
            'verified_at' => 'datetime',
            'metadata' => 'array',
        ];
    }

    public function alumniProfile(): BelongsTo
    {
        return $this->belongsTo(AlumniProfile::class);
    }

    public function verifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by_user_id');
    }
}
