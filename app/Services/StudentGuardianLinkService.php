<?php

namespace App\Services;

use App\Models\Guardian;
use App\Models\StudentProfile;
use App\Models\User;

class StudentGuardianLinkService
{
    public function __construct(
        protected ActivityLogService $activityLogService,
    ) {
    }

    public function link(
        StudentProfile $student,
        Guardian $guardian,
        string $relationshipType,
        bool $isPrimaryContact = false,
        bool $isFinancialGuardian = false,
        ?User $actor = null,
    ): void {
        $student->guardians()->syncWithoutDetaching([
            $guardian->getKey() => [
                'relationship_type' => $relationshipType,
                'is_primary_contact' => $isPrimaryContact,
                'is_financial_guardian' => $isFinancialGuardian,
            ],
        ]);

        $this->activityLogService->log(
            $actor,
            $student,
            'student.guardian.linked',
            'Guardian linked to student.',
            [
                'guardian_id' => $guardian->getKey(),
                'relationship_type' => $relationshipType,
                'is_primary_contact' => $isPrimaryContact,
                'is_financial_guardian' => $isFinancialGuardian,
            ],
        );
    }
}
