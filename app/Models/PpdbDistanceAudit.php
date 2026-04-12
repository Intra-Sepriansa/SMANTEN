<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PpdbDistanceAudit extends Model
{
    use HasFactory;

    protected $fillable = [
        'ppdb_application_id',
        'calculated_by_user_id',
        'origin_latitude',
        'origin_longitude',
        'school_latitude',
        'school_longitude',
        'distance_meters',
        'formula_version',
        'calculated_at',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'origin_latitude' => 'decimal:7',
            'origin_longitude' => 'decimal:7',
            'school_latitude' => 'decimal:7',
            'school_longitude' => 'decimal:7',
            'distance_meters' => 'decimal:2',
            'calculated_at' => 'datetime',
            'metadata' => 'array',
        ];
    }

    public function application(): BelongsTo
    {
        return $this->belongsTo(PpdbApplication::class, 'ppdb_application_id');
    }

    public function calculatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'calculated_by_user_id');
    }
}
