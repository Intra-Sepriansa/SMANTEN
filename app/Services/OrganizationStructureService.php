<?php

namespace App\Services;

use App\Enums\OrganizationAssignmentStatus;
use App\Models\OrganizationAssignment;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class OrganizationStructureService
{
    public function __construct(
        protected ActivityLogService $activityLogService,
    ) {
    }

    public function activateAssignment(OrganizationAssignment $assignment, ?User $actor = null): OrganizationAssignment
    {
        return DB::transaction(function () use ($assignment, $actor) {
            $position = $assignment->organizationPosition;

            if ($position && $position->is_unique_holder) {
                OrganizationAssignment::query()
                    ->where('organization_position_id', $position->getKey())
                    ->whereKeyNot($assignment->getKey())
                    ->where('is_current', true)
                    ->update([
                        'is_current' => false,
                        'status' => OrganizationAssignmentStatus::Completed->value,
                    ]);
            }

            $assignment->forceFill([
                'status' => OrganizationAssignmentStatus::Active,
                'is_current' => true,
            ])->save();

            $this->activityLogService->log(
                $actor,
                $assignment,
                'organization.assignment.activated',
                'Organization assignment activated.',
                ['position_id' => $assignment->organization_position_id],
            );

            return $assignment->fresh();
        });
    }
}
