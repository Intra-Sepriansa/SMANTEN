<?php

namespace App\Policies;

use App\Enums\RoleName;
use App\Models\PpdbApplication;
use App\Models\User;

class PpdbApplicationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole([
            RoleName::SuperAdmin->value,
            RoleName::OperatorSekolah->value,
            RoleName::StaffTu->value,
        ]);
    }

    public function view(?User $user, PpdbApplication $application): bool
    {
        if (! $user) {
            return false;
        }

        return $this->viewAny($user) || $application->user_id === $user->getKey();
    }

    public function create(?User $user = null): bool
    {
        return true;
    }

    public function verify(User $user, PpdbApplication $application): bool
    {
        return $this->viewAny($user);
    }
}
