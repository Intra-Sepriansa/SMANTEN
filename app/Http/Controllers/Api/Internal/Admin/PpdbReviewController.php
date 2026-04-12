<?php

namespace App\Http\Controllers\Api\Internal\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\ReviewPpdbApplicationRequest;
use App\Http\Resources\PpdbApplicationResource;
use App\Models\PpdbApplication;
use App\Services\ActivityLogService;
use App\Services\PpdbEligibilityService;

class PpdbReviewController extends Controller
{
    public function __construct(
        protected ActivityLogService $activityLogService,
    ) {
    }

    public function evaluate(PpdbApplication $ppdbApplication, PpdbEligibilityService $eligibilityService): PpdbApplicationResource
    {
        $this->authorize('verify', $ppdbApplication);

        $eligibilityService->evaluate($ppdbApplication, request()->user());

        return new PpdbApplicationResource($ppdbApplication->fresh(['cycle', 'documents', 'distanceAudits']));
    }

    public function updateStatus(ReviewPpdbApplicationRequest $request, PpdbApplication $ppdbApplication): PpdbApplicationResource
    {
        $this->authorize('verify', $ppdbApplication);

        $validated = $request->validated();

        $ppdbApplication->reviews()->create([
            'reviewer_user_id' => $request->user()->getKey(),
            'review_type' => 'manual_status_update',
            'status' => $validated['status']->value,
            'notes' => $validated['notes'] ?? null,
            'payload' => $validated['payload'] ?? null,
        ]);

        $ppdbApplication->update([
            'status' => $validated['status'],
            'verified_by_user_id' => $request->user()->getKey(),
            'verified_at' => now(),
            'decision_notes' => $validated['notes'] ?? $ppdbApplication->decision_notes,
            'decided_at' => now(),
        ]);

        $this->activityLogService->log($request->user(), $ppdbApplication, 'ppdb.status.updated', 'PPDB application status updated.');

        return new PpdbApplicationResource($ppdbApplication->fresh(['cycle', 'documents']));
    }
}
