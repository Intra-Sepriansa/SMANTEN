<?php

namespace App\Policies;

use App\Enums\RoleName;
use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole([
            RoleName::SuperAdmin->value,
            RoleName::OperatorSekolah->value,
        ]);
    }

    public function update(User $user, User $model): bool
    {
        return $this->viewAny($user) || $user->is($model);
    }

    public function assignRoles(User $user): bool
    {
        return $user->hasRole(RoleName::SuperAdmin->value);
    }
}
