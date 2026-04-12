<?php

namespace App\Policies;

use App\Enums\RoleName;
use App\Models\OrganizationAssignment;
use App\Models\User;

class OrganizationAssignmentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole([
            RoleName::SuperAdmin->value,
            RoleName::OperatorSekolah->value,
            RoleName::Guru->value,
            RoleName::JurnalisSiswa->value,
        ]);
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole([
            RoleName::SuperAdmin->value,
            RoleName::OperatorSekolah->value,
        ]);
    }

    public function update(User $user, OrganizationAssignment $assignment): bool
    {
        return $this->create($user);
    }

    public function activate(User $user, OrganizationAssignment $assignment): bool
    {
        return $this->create($user);
    }
}
