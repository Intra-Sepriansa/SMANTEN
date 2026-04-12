<?php

namespace App\Models;

use App\Enums\PpdbTrackType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PpdbTrackQuota extends Model
{
    use HasFactory;

    protected $fillable = [
        'ppdb_cycle_id',
        'track_type',
        'quota_percentage',
        'quota_seats',
        'is_active',
        'settings',
    ];

    protected function casts(): array
    {
        return [
            'track_type' => PpdbTrackType::class,
            'quota_percentage' => 'decimal:2',
            'quota_seats' => 'integer',
            'is_active' => 'boolean',
            'settings' => 'array',
        ];
    }

    public function ppdbCycle(): BelongsTo
    {
        return $this->belongsTo(PpdbCycle::class);
    }
}
