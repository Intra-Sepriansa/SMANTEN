<?php

use App\Enums\PpdbApplicationStatus;
use App\Enums\PpdbTrackType;
use App\Enums\RoleName;
use App\Models\PpdbApplication;
use App\Models\PpdbCycle;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Str;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;

it('exports ppdb applications as csv for admins', function () {
    $user = createExportFeatureAdminUser();
    $cycle = PpdbCycle::query()->create([
        'name' => 'PPDB 2026',
        'status' => 'active',
    ]);

    PpdbApplication::query()->create([
        'ppdb_cycle_id' => $cycle->id,
        'registration_number' => 'PPDB-2026-0001',
        'track_type' => PpdbTrackType::Zonasi,
        'status' => PpdbApplicationStatus::Submitted,
        'full_name' => 'Calon Siswa Export',
        'email' => 'calon@example.test',
        'submitted_at' => now(),
    ]);

    actingAs($user);

    $response = get(route('internal-api.exports.ppdb-applications'));

    $response->assertOk();

    expect($response->streamedContent())
        ->toContain('PPDB-2026-0001')
        ->toContain('Calon Siswa Export');
});

function createExportFeatureAdminUser(): User
{
    $user = User::factory()->createOne();
    $role = Role::query()->firstOrCreate(
        ['slug' => RoleName::SuperAdmin->value],
        ['name' => Str::headline(RoleName::SuperAdmin->value)],
    );

    $user->roles()->attach($role->id, ['assigned_at' => now()]);

    return $user;
}
