<?php

namespace App\Http\Controllers\Api\Internal\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\AssignUserRolesRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\RoleAssignmentService;

class RoleAssignmentController extends Controller
{
    public function update(AssignUserRolesRequest $request, User $user, RoleAssignmentService $roleAssignmentService): UserResource
    {
        $this->authorize('assignRoles', User::class);

        $roleAssignmentService->syncRoles($user, $request->validated('roles'), $request->user());

        return new UserResource($user->load('roles'));
    }
}
