<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PortfolioProjectMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'portfolio_project_id',
        'student_profile_id',
        'member_role',
        'is_lead',
    ];

    protected function casts(): array
    {
        return [
            'is_lead' => 'boolean',
        ];
    }

    public function portfolioProject(): BelongsTo
    {
        return $this->belongsTo(PortfolioProject::class);
    }

    public function studentProfile(): BelongsTo
    {
        return $this->belongsTo(StudentProfile::class);
    }
}
