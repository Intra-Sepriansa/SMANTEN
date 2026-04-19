<?php

namespace App\Policies;

use App\Enums\RoleName;
use App\Models\SiteSetting;
use App\Models\User;

class SiteSettingPolicy
{
    public function view(User $user, SiteSetting $siteSetting): bool
    {
        return $user->hasAnyRole([
            RoleName::SuperAdmin->value,
            RoleName::OperatorSekolah->value,
        ]);
    }

    public function update(User $user, SiteSetting $siteSetting): bool
    {
        return $this->view($user, $siteSetting);
    }
}
