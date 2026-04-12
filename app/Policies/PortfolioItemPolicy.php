<?php

namespace App\Policies;

use App\Enums\RoleName;
use App\Models\PortfolioItem;
use App\Models\User;

class PortfolioItemPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole([
            RoleName::SuperAdmin->value,
            RoleName::OperatorSekolah->value,
            RoleName::Guru->value,
            RoleName::Siswa->value,
            RoleName::JurnalisSiswa->value,
        ]);
    }

    public function create(User $user): bool
    {
        return $this->viewAny($user);
    }

    public function update(User $user, PortfolioItem $item): bool
    {
        return $user->hasAnyRole([
            RoleName::SuperAdmin->value,
            RoleName::OperatorSekolah->value,
            RoleName::Guru->value,
        ]) || $item->creator_user_id === $user->getKey();
    }

    public function moderate(User $user, PortfolioItem $item): bool
    {
        return $user->hasAnyRole([
            RoleName::SuperAdmin->value,
            RoleName::OperatorSekolah->value,
            RoleName::Guru->value,
        ]);
    }
}
