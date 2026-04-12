<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GradeLevel extends Model
{
    use HasFactory;

    protected $fillable = [
        'grade_number',
        'label',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'grade_number' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function teachingGroups(): HasMany
    {
        return $this->hasMany(TeachingGroup::class);
    }
}
