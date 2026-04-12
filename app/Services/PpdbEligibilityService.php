<?php

namespace App\Services;

use App\Enums\PpdbApplicationStatus;
use App\Enums\PpdbTrackType;
use App\Models\PpdbApplication;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PpdbEligibilityService
{
    public function __construct(
        protected HaversineDistanceService $distanceService,
        protected ActivityLogService $activityLogService,
    ) {
    }

    public function evaluate(PpdbApplication $application, ?User $actor = null): PpdbApplication
    {
        $cycle = $application->cycle;

        if (
            $application->latitude === null
            || $application->longitude === null
            || $cycle->school_latitude === null
            || $cycle->school_longitude === null
        ) {
            throw ValidationException::withMessages([
                'coordinates' => 'Application and cycle coordinates must be complete before eligibility evaluation.',
            ]);
        }

        $distance = $this->distanceService->calculateInMeters(
            (float) $application->latitude,
            (float) $application->longitude,
            (float) $cycle->school_latitude,
            (float) $cycle->school_longitude,
        );

        $hasRejectedDocuments = $application->documents()
            ->where('status', 'rejected')
            ->exists();

        $withinZone = $cycle->default_zone_radius_km === null
            ? true
            : $distance <= ((float) $cycle->default_zone_radius_km * 1000);

        $nextStatus = match (true) {
            $hasRejectedDocuments => PpdbApplicationStatus::UnderReview,
            $application->track_type === PpdbTrackType::Zonasi && ! $withinZone => PpdbApplicationStatus::Verified,
            default => PpdbApplicationStatus::Eligible,
        };

        return DB::transaction(function () use ($application, $distance, $cycle, $nextStatus, $actor, $withinZone) {
            $application->forceFill([
                'distance_meters' => $distance,
                'distance_calculated_at' => now(),
                'status' => $nextStatus,
            ])->save();

            $application->distanceAudits()->create([
                'calculated_by_user_id' => $actor?->getKey(),
                'origin_latitude' => $application->latitude,
                'origin_longitude' => $application->longitude,
                'school_latitude' => $cycle->school_latitude,
                'school_longitude' => $cycle->school_longitude,
                'distance_meters' => $distance,
                'formula_version' => 'haversine:v1',
                'calculated_at' => now(),
                'metadata' => [
                    'within_zone' => $withinZone,
                    'track_type' => $application->track_type->value,
                ],
            ]);

            $this->activityLogService->log(
                $actor,
                $application,
                'ppdb.eligibility.evaluated',
                'PPDB application eligibility evaluated.',
                [
                    'distance_meters' => $distance,
                    'within_zone' => $withinZone,
                    'status' => $nextStatus->value,
                ],
            );

            return $application->fresh(['distanceAudits']);
        });
    }
}
