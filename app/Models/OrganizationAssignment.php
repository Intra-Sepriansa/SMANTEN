<?php

namespace App\Models;

use App\Enums\OrganizationAssignmentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrganizationAssignment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'organization_unit_id',
        'organization_position_id',
        'user_id',
        'employee_id',
        'student_profile_id',
        'full_name_snapshot',
        'status',
        'is_current',
        'sort_order',
        'starts_at',
        'ends_at',
        'biography',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'status' => OrganizationAssignmentStatus::class,
            'is_current' => 'boolean',
            'sort_order' => 'integer',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'metadata' => 'array',
        ];
    }

    public function organizationUnit(): BelongsTo
    {
        return $this->belongsTo(OrganizationUnit::class);
    }

    public function organizationPosition(): BelongsTo
    {
        return $this->belongsTo(OrganizationPosition::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function studentProfile(): BelongsTo
    {
        return $this->belongsTo(StudentProfile::class);
    }
}
