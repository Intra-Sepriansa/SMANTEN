<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\Room;
use App\Models\TeachingGroup;
use App\Models\TimetableEntry;
use App\Models\TimetablePeriod;
use App\Models\TimetableVersion;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class RoomAllocationConflictService
{
    public function findConflicts(
        TimetableVersion $version,
        TimetablePeriod $period,
        TeachingGroup $group,
        Room $room,
        Employee $employee,
        ?TimetableEntry $ignoreEntry = null,
    ): Collection {
        return TimetableEntry::query()
            ->where('timetable_version_id', $version->getKey())
            ->where('timetable_period_id', $period->getKey())
            ->when($ignoreEntry, fn ($query) => $query->whereKeyNot($ignoreEntry->getKey()))
            ->where(function ($query) use ($group, $room, $employee) {
                $query
                    ->where('teaching_group_id', $group->getKey())
                    ->orWhere('room_id', $room->getKey())
                    ->orWhere('employee_id', $employee->getKey());
            })
            ->get();
    }

    public function assertNoConflict(
        TimetableVersion $version,
        TimetablePeriod $period,
        TeachingGroup $group,
        Room $room,
        Employee $employee,
        ?TimetableEntry $ignoreEntry = null,
    ): void {
        $conflicts = $this->findConflicts($version, $period, $group, $room, $employee, $ignoreEntry);

        if ($conflicts->isEmpty()) {
            return;
        }

        throw ValidationException::withMessages([
            'timetable' => sprintf(
                'Scheduling conflict detected for version %s, period %s, room %s, teacher %s, or teaching group %s.',
                $version->name,
                $period->name,
                $room->name,
                $employee->full_name,
                $group->name,
            ),
        ]);
    }
}
