<?php

use App\Models\AcademicYear;
use App\Models\PpdbApplication;
use App\Models\PpdbCycle;
use App\Services\PpdbEligibilityService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('evaluates ppdb eligibility and records distance audit', function () {
    $academicYear = AcademicYear::create([
        'name' => '2026/2027',
        'starts_on' => '2026-07-13',
        'ends_on' => '2027-06-25',
        'is_active' => true,
    ]);

    $cycle = PpdbCycle::create([
        'academic_year_id' => $academicYear->id,
        'name' => 'PPDB 2026/2027',
        'status' => 'active',
        'school_latitude' => -6.3483,
        'school_longitude' => 106.4638,
        'default_zone_radius_km' => 5,
    ]);

    $application = PpdbApplication::create([
        'ppdb_cycle_id' => $cycle->id,
        'registration_number' => 'PPDB-TEST-001',
        'track_type' => 'zonasi',
        'status' => 'submitted',
        'full_name' => 'Calon Siswa Test',
        'latitude' => -6.3512,
        'longitude' => 106.4702,
    ]);

    $service = app(PpdbEligibilityService::class);

    $service->evaluate($application);

    $application->refresh();

    expect($application->distance_meters)->not->toBeNull()
        ->and($application->status->value)->toBe('eligible')
        ->and($application->distanceAudits()->count())->toBe(1);
});
