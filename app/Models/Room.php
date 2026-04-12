<?php

namespace App\Models;

use App\Enums\RoomType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Room extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'room_type',
        'campus_zone',
        'floor_level',
        'capacity',
        'is_schedulable',
        'supports_moving_class',
        'is_active',
        'description',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'room_type' => RoomType::class,
            'floor_level' => 'integer',
            'capacity' => 'integer',
            'is_schedulable' => 'boolean',
            'supports_moving_class' => 'boolean',
            'is_active' => 'boolean',
            'metadata' => 'array',
        ];
    }

    public function timetableEntries(): HasMany
    {
        return $this->hasMany(TimetableEntry::class);
    }
}
