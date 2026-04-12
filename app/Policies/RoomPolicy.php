<?php

namespace App\Policies;

use App\Enums\RoleName;
use App\Models\Room;
use App\Models\User;

class RoomPolicy
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

    public function update(User $user, Room $room): bool
    {
        return $this->create($user);
    }
}
