<?php

namespace App\Models;

use App\Enums\EmployeeType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'employee_number',
        'full_name',
        'employee_type',
        'gender',
        'birth_date',
        'phone',
        'email',
        'address',
        'is_active',
        'joined_at',
        'ended_at',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'employee_type' => EmployeeType::class,
            'birth_date' => 'date',
            'is_active' => 'boolean',
            'joined_at' => 'date',
            'ended_at' => 'date',
            'metadata' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function homeroomTeachingGroups(): HasMany
    {
        return $this->hasMany(TeachingGroup::class, 'homeroom_employee_id');
    }

    public function subjects(): BelongsToMany
    {
        return $this->belongsToMany(Subject::class)
            ->withPivot(['academic_year_id', 'is_primary'])
            ->withTimestamps();
    }

    public function timetableEntries(): HasMany
    {
        return $this->hasMany(TimetableEntry::class);
    }

    public function organizationAssignments(): HasMany
    {
        return $this->hasMany(OrganizationAssignment::class);
    }
}
