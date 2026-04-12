<?php

namespace App\Http\Controllers\Api\Internal\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreTimetableVersionRequest;
use App\Http\Resources\TimetableVersionResource;
use App\Models\TimetableVersion;
use App\Services\ActivityLogService;
use App\Services\TimetablePublishingService;

class TimetableVersionController extends Controller
{
    public function __construct(
        protected ActivityLogService $activityLogService,
    ) {
    }

    public function index()
    {
        $this->authorize('viewAny', TimetableVersion::class);

        return TimetableVersionResource::collection(
            TimetableVersion::query()
                ->with(['academicTerm', 'entries'])
                ->latest()
                ->paginate(),
        );
    }

    public function store(StoreTimetableVersionRequest $request): TimetableVersionResource
    {
        $this->authorize('create', TimetableVersion::class);

        $version = TimetableVersion::create($request->validated());

        $this->activityLogService->log($request->user(), $version, 'timetable.version.created', 'Timetable version created.');

        return new TimetableVersionResource($version->load('academicTerm'));
    }

    public function publish(TimetableVersion $timetableVersion, TimetablePublishingService $publishingService): TimetableVersionResource
    {
        $this->authorize('publish', $timetableVersion);

        $publishingService->publish($timetableVersion, request()->user());

        return new TimetableVersionResource($timetableVersion->fresh(['academicTerm', 'entries']));
    }
}
