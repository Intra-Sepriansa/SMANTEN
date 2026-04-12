<?php

namespace App\Models;

use App\Enums\TimetableVersionStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class TimetableVersion extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'academic_term_id',
        'name',
        'status',
        'effective_from',
        'effective_until',
        'published_at',
        'published_by_user_id',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'status' => TimetableVersionStatus::class,
            'effective_from' => 'date',
            'effective_until' => 'date',
            'published_at' => 'datetime',
        ];
    }

    public function academicTerm(): BelongsTo
    {
        return $this->belongsTo(AcademicTerm::class);
    }

    public function publishedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'published_by_user_id');
    }

    public function entries(): HasMany
    {
        return $this->hasMany(TimetableEntry::class);
    }
}
