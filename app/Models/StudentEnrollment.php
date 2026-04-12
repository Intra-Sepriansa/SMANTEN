<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentEnrollment extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_profile_id',
        'academic_year_id',
        'academic_term_id',
        'teaching_group_id',
        'roll_number',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'roll_number' => 'integer',
        ];
    }

    public function studentProfile(): BelongsTo
    {
        return $this->belongsTo(StudentProfile::class);
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function academicTerm(): BelongsTo
    {
        return $this->belongsTo(AcademicTerm::class);
    }

    public function teachingGroup(): BelongsTo
    {
        return $this->belongsTo(TeachingGroup::class);
    }
}
