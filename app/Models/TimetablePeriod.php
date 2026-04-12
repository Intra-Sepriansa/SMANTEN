<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TimetablePeriod extends Model
{
    use HasFactory;

    protected $fillable = [
        'academic_year_id',
        'name',
        'day_of_week',
        'sequence',
        'starts_at',
        'ends_at',
        'is_break',
    ];

    protected function casts(): array
    {
        return [
            'day_of_week' => 'integer',
            'sequence' => 'integer',
            'starts_at' => 'datetime:H:i:s',
            'ends_at' => 'datetime:H:i:s',
            'is_break' => 'boolean',
        ];
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function timetableEntries(): HasMany
    {
        return $this->hasMany(TimetableEntry::class);
    }
}
