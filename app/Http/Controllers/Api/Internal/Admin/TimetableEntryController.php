<?php

namespace App\Http\Controllers\Api\Internal\Admin;

use App\Enums\TimetableEntryStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreTimetableEntryRequest;
use App\Http\Resources\TimetableEntryResource;
use App\Models\Employee;
use App\Models\Room;
use App\Models\TeachingGroup;
use App\Models\TimetableEntry;
use App\Models\TimetablePeriod;
use App\Models\TimetableVersion;
use App\Services\ActivityLogService;
use App\Services\RoomAllocationConflictService;

class TimetableEntryController extends Controller
{
    public function __construct(
        protected ActivityLogService $activityLogService,
        protected RoomAllocationConflictService $conflictService,
    ) {
    }

    public function index()
    {
        $this->authorize('viewAny', TimetableVersion::class);

        $versionId = request('timetable_version_id');

        $query = TimetableEntry::query()->with(['teachingGroup', 'timetablePeriod', 'room', 'subject', 'employee']);

        if ($versionId) {
            $query->where('timetable_version_id', $versionId);
        }

        return TimetableEntryResource::collection($query->paginate());
    }

    public function store(StoreTimetableEntryRequest $request): TimetableEntryResource
    {
        $this->authorize('create', TimetableVersion::class);

        $validated = $request->validated();

        $version = TimetableVersion::findOrFail($validated['timetable_version_id']);
        $period = TimetablePeriod::findOrFail($validated['timetable_period_id']);
        $group = TeachingGroup::findOrFail($validated['teaching_group_id']);
        $room = Room::findOrFail($validated['room_id']);
        $employee = Employee::findOrFail($validated['employee_id']);

        $this->conflictService->assertNoConflict($version, $period, $group, $room, $employee);

        $entry = TimetableEntry::create([
            ...$validated,
            'status' => $validated['status'] ?? TimetableEntryStatus::Scheduled,
        ]);

        $this->activityLogService->log($request->user(), $entry, 'timetable.entry.created', 'Timetable entry created.');

        return new TimetableEntryResource($entry->load(['teachingGroup', 'timetablePeriod', 'room', 'subject', 'employee']));
    }

    public function update(StoreTimetableEntryRequest $request, TimetableEntry $timetableEntry): TimetableEntryResource
    {
        $this->authorize('update', $timetableEntry->timetableVersion);

        $validated = $request->validated();

        $version = TimetableVersion::findOrFail($validated['timetable_version_id']);
        $period = TimetablePeriod::findOrFail($validated['timetable_period_id']);
        $group = TeachingGroup::findOrFail($validated['teaching_group_id']);
        $room = Room::findOrFail($validated['room_id']);
        $employee = Employee::findOrFail($validated['employee_id']);

        $this->conflictService->assertNoConflict($version, $period, $group, $room, $employee, $timetableEntry);

        $timetableEntry->update([
            ...$validated,
            'status' => $validated['status'] ?? $timetableEntry->status,
        ]);

        $this->activityLogService->log($request->user(), $timetableEntry, 'timetable.entry.updated', 'Timetable entry updated.');

        return new TimetableEntryResource($timetableEntry->load(['teachingGroup', 'timetablePeriod', 'room', 'subject', 'employee']));
    }
}
