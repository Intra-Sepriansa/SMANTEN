<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'curriculum_category',
        'weekly_periods',
        'is_active',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'weekly_periods' => 'integer',
            'is_active' => 'boolean',
            'metadata' => 'array',
        ];
    }

    public function employees(): BelongsToMany
    {
        return $this->belongsToMany(Employee::class)
            ->withPivot(['academic_year_id', 'is_primary'])
            ->withTimestamps();
    }

    public function timetableEntries(): HasMany
    {
        return $this->hasMany(TimetableEntry::class);
    }
}
