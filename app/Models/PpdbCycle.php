<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PpdbCycle extends Model
{
    use HasFactory;

    protected $fillable = [
        'academic_year_id',
        'name',
        'status',
        'capacity',
        'school_latitude',
        'school_longitude',
        'default_zone_radius_km',
        'application_opens_at',
        'application_closes_at',
        'announcement_at',
        'rules_snapshot',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'capacity' => 'integer',
            'school_latitude' => 'decimal:7',
            'school_longitude' => 'decimal:7',
            'default_zone_radius_km' => 'decimal:2',
            'application_opens_at' => 'datetime',
            'application_closes_at' => 'datetime',
            'announcement_at' => 'datetime',
            'rules_snapshot' => 'array',
        ];
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function trackQuotas(): HasMany
    {
        return $this->hasMany(PpdbTrackQuota::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(PpdbApplication::class);
    }
}
