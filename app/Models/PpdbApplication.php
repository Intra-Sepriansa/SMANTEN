<?php

namespace App\Models;

use App\Enums\PpdbApplicationStatus;
use App\Enums\PpdbTrackType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class PpdbApplication extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'ppdb_cycle_id',
        'user_id',
        'verified_by_user_id',
        'registration_number',
        'track_type',
        'status',
        'full_name',
        'birth_date',
        'gender',
        'nisn',
        'phone',
        'email',
        'previous_school_name',
        'address_line',
        'village',
        'district',
        'city',
        'province',
        'postal_code',
        'latitude',
        'longitude',
        'distance_meters',
        'distance_calculated_at',
        'ketm_flag',
        'special_condition_flag',
        'achievements_summary',
        'submission_payload',
        'submitted_at',
        'verified_at',
        'decided_at',
        'decision_notes',
    ];

    protected function casts(): array
    {
        return [
            'track_type' => PpdbTrackType::class,
            'status' => PpdbApplicationStatus::class,
            'birth_date' => 'date',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'distance_meters' => 'decimal:2',
            'distance_calculated_at' => 'datetime',
            'ketm_flag' => 'boolean',
            'special_condition_flag' => 'boolean',
            'submission_payload' => 'array',
            'submitted_at' => 'datetime',
            'verified_at' => 'datetime',
            'decided_at' => 'datetime',
        ];
    }

    public function cycle(): BelongsTo
    {
        return $this->belongsTo(PpdbCycle::class, 'ppdb_cycle_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function verifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by_user_id');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(PpdbApplicationDocument::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(PpdbApplicationReview::class);
    }

    public function distanceAudits(): HasMany
    {
        return $this->hasMany(PpdbDistanceAudit::class);
    }
}
