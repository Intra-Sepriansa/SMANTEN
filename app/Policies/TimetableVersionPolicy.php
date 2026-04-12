<?php

namespace App\Policies;

use App\Enums\RoleName;
use App\Models\TimetableVersion;
use App\Models\User;

class TimetableVersionPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole([
            RoleName::SuperAdmin->value,
            RoleName::OperatorSekolah->value,
            RoleName::Guru->value,
        ]);
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole([
            RoleName::SuperAdmin->value,
            RoleName::OperatorSekolah->value,
        ]);
    }

    public function update(User $user, TimetableVersion $version): bool
    {
        return $this->create($user);
    }

    public function publish(User $user, TimetableVersion $version): bool
    {
        return $this->create($user);
    }
}
