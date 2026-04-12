<?php

namespace App\Http\Controllers\Api\Internal\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreOrganizationAssignmentRequest;
use App\Http\Resources\OrganizationAssignmentResource;
use App\Models\OrganizationAssignment;
use App\Services\ActivityLogService;
use App\Services\OrganizationStructureService;

class OrganizationAssignmentController extends Controller
{
    public function __construct(
        protected ActivityLogService $activityLogService,
    ) {
    }

    public function index()
    {
        $this->authorize('viewAny', OrganizationAssignment::class);

        return OrganizationAssignmentResource::collection(
            OrganizationAssignment::query()
                ->with(['organizationPosition', 'organizationUnit'])
                ->latest()
                ->paginate(),
        );
    }

    public function store(StoreOrganizationAssignmentRequest $request): OrganizationAssignmentResource
    {
        $this->authorize('create', OrganizationAssignment::class);

        $assignment = OrganizationAssignment::create($request->validated());

        $this->activityLogService->log($request->user(), $assignment, 'organization.assignment.created', 'Organization assignment created.');

        return new OrganizationAssignmentResource($assignment->load(['organizationPosition', 'organizationUnit']));
    }

    public function update(StoreOrganizationAssignmentRequest $request, OrganizationAssignment $organizationAssignment): OrganizationAssignmentResource
    {
        $this->authorize('update', $organizationAssignment);

        $organizationAssignment->update($request->validated());

        $this->activityLogService->log($request->user(), $organizationAssignment, 'organization.assignment.updated', 'Organization assignment updated.');

        return new OrganizationAssignmentResource($organizationAssignment->load(['organizationPosition', 'organizationUnit']));
    }

    public function activate(OrganizationAssignment $organizationAssignment, OrganizationStructureService $structureService): OrganizationAssignmentResource
    {
        $this->authorize('activate', $organizationAssignment);

        $structureService->activateAssignment($organizationAssignment, request()->user());

        return new OrganizationAssignmentResource($organizationAssignment->fresh(['organizationPosition', 'organizationUnit']));
    }
}
