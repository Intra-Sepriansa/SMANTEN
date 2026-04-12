<?php

namespace App\Models;

use App\Enums\TimetableEntryStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class TimetableEntry extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'timetable_version_id',
        'teaching_group_id',
        'timetable_period_id',
        'room_id',
        'subject_id',
        'employee_id',
        'original_entry_id',
        'status',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'status' => TimetableEntryStatus::class,
        ];
    }

    public function timetableVersion(): BelongsTo
    {
        return $this->belongsTo(TimetableVersion::class);
    }

    public function teachingGroup(): BelongsTo
    {
        return $this->belongsTo(TeachingGroup::class);
    }

    public function timetablePeriod(): BelongsTo
    {
        return $this->belongsTo(TimetablePeriod::class);
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function originalEntry(): BelongsTo
    {
        return $this->belongsTo(self::class, 'original_entry_id');
    }
}
