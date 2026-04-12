<?php

namespace App\Services;

use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Arr;

class RoleAssignmentService
{
    public function __construct(
        protected ActivityLogService $activityLogService,
    ) {
    }

    public function syncRoles(User $user, array|string $roles, ?User $actor = null): void
    {
        $roles = Arr::wrap($roles);

        $roleIds = Role::query()
            ->whereIn('slug', $roles)
            ->pluck('id')
            ->all();

        $pivotData = collect($roleIds)->mapWithKeys(fn (int $roleId) => [
            $roleId => [
                'assigned_by_user_id' => $actor?->getKey(),
                'assigned_at' => now(),
                'updated_at' => now(),
                'created_at' => now(),
            ],
        ])->all();

        $user->roles()->sync($pivotData);

        $this->activityLogService->log(
            $actor,
            $user,
            'user.roles.synced',
            'User roles synchronized.',
            ['roles' => $roles],
        );
    }
}
