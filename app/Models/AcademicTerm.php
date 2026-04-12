<?php

namespace App\Models;

use App\Enums\AcademicTermType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AcademicTerm extends Model
{
    use HasFactory;

    protected $fillable = [
        'academic_year_id',
        'name',
        'term_type',
        'starts_on',
        'ends_on',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'term_type' => AcademicTermType::class,
            'starts_on' => 'date',
            'ends_on' => 'date',
            'is_active' => 'boolean',
        ];
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function timetableVersions(): HasMany
    {
        return $this->hasMany(TimetableVersion::class);
    }
}
