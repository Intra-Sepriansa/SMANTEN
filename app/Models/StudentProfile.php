<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class StudentProfile extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'nis',
        'nisn',
        'full_name',
        'gender',
        'birth_date',
        'address',
        'village',
        'district',
        'city',
        'province',
        'postal_code',
        'latitude',
        'longitude',
        'enrollment_status',
        'admitted_at',
        'graduated_at',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'admitted_at' => 'date',
            'graduated_at' => 'date',
            'metadata' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function guardians(): BelongsToMany
    {
        return $this->belongsToMany(Guardian::class, 'student_guardian')
            ->withPivot(['relationship_type', 'is_primary_contact', 'is_financial_guardian'])
            ->withTimestamps();
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(StudentEnrollment::class);
    }

    public function portfolioProjectMembers(): HasMany
    {
        return $this->hasMany(PortfolioProjectMember::class);
    }

    public function organizationAssignments(): HasMany
    {
        return $this->hasMany(OrganizationAssignment::class);
    }
}
