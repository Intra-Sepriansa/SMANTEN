<?php

use App\Models\OrganizationAssignment;
use App\Models\OrganizationPosition;
use App\Models\OrganizationUnit;
use App\Services\OrganizationStructureService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('keeps only one current holder for unique organization positions', function () {
    $unit = OrganizationUnit::create([
        'scope' => 'school_management',
        'name' => 'Manajemen Sekolah',
        'slug' => 'manajemen-sekolah',
        'is_active' => true,
    ]);

    $position = OrganizationPosition::create([
        'organization_unit_id' => $unit->id,
        'scope' => 'school_management',
        'title' => 'Kepala Sekolah',
        'slug' => 'kepala-sekolah',
        'hierarchy_level' => 1,
        'is_unique_holder' => true,
    ]);

    $firstAssignment = OrganizationAssignment::create([
        'organization_unit_id' => $unit->id,
        'organization_position_id' => $position->id,
        'full_name_snapshot' => 'Pemegang Lama',
        'status' => 'active',
        'is_current' => true,
    ]);

    $secondAssignment = OrganizationAssignment::create([
        'organization_unit_id' => $unit->id,
        'organization_position_id' => $position->id,
        'full_name_snapshot' => 'Pemegang Baru',
        'status' => 'planned',
        'is_current' => false,
    ]);

    $service = app(OrganizationStructureService::class);
    $service->activateAssignment($secondAssignment);

    expect($secondAssignment->fresh()->is_current)->toBeTrue()
        ->and($firstAssignment->fresh()->is_current)->toBeFalse()
        ->and($firstAssignment->fresh()->status->value)->toBe('completed');
});
