<?php

namespace App\Models\Concerns;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

trait InteractsWithRoles
{
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class)
            ->withPivot(['assigned_by_user_id', 'assigned_at', 'expires_at'])
            ->withTimestamps();
    }

    public function resolvedPermissions(): EloquentCollection
    {
        return $this->roles
            ->pluck('permissions')
            ->flatten()
            ->filter(fn ($permission) => $permission instanceof Permission)
            ->unique('id')
            ->values();
    }

    public function hasRole(string $role): bool
    {
        return $this->roles->contains(fn (Role $assignedRole) => $assignedRole->slug === $role);
    }

    public function hasAnyRole(array|string $roles): bool
    {
        $roles = is_array($roles) ? $roles : [$roles];

        return $this->roles->contains(fn (Role $assignedRole) => in_array($assignedRole->slug, $roles, true));
    }

    public function hasPermissionTo(string $permission): bool
    {
        return $this->resolvedPermissions()
            ->contains(fn (Permission $assignedPermission) => $assignedPermission->slug === $permission);
    }
}
