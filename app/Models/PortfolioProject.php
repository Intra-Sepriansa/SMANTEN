<?php

namespace App\Models;

use App\Enums\PortfolioVisibility;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class PortfolioProject extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'academic_year_id',
        'p5_theme_id',
        'mentor_employee_id',
        'title',
        'slug',
        'category',
        'exhibition_name',
        'event_date',
        'description',
        'visibility',
        'is_featured',
        'starts_on',
        'ends_on',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'visibility' => PortfolioVisibility::class,
            'event_date' => 'date',
            'is_featured' => 'boolean',
            'starts_on' => 'date',
            'ends_on' => 'date',
            'metadata' => 'array',
        ];
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function p5Theme(): BelongsTo
    {
        return $this->belongsTo(P5Theme::class);
    }

    public function mentor(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'mentor_employee_id');
    }

    public function members(): HasMany
    {
        return $this->hasMany(PortfolioProjectMember::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(PortfolioItem::class);
    }
}
