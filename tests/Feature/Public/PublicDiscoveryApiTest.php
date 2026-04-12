<?php

use App\Enums\MediaType;
use App\Enums\OrganizationAssignmentStatus;
use App\Enums\OrganizationScope;
use App\Enums\PortfolioVisibility;
use App\Models\MediaAsset;
use App\Models\OrganizationAssignment;
use App\Models\OrganizationPosition;
use App\Models\OrganizationUnit;
use Illuminate\Support\Facades\Http;

it('geocodes address queries for ppdb mapping', function () {
    Http::fake([
        'https://nominatim.openstreetmap.org/*' => Http::response([
            [
                'display_name' => 'Babakan, Tenjo, Kabupaten Bogor, Jawa Barat, Indonesia',
                'lat' => '-6.348300',
                'lon' => '106.463800',
                'type' => 'residential',
                'address' => [
                    'road' => 'Jl. Raya Tenjo',
                    'village' => 'Babakan',
                    'county' => 'Kabupaten Bogor',
                    'state' => 'Jawa Barat',
                ],
            ],
        ], 200),
    ]);

    $response = $this->getJson('/api/public/geocode/search?q=Babakan Tenjo');

    $response
        ->assertOk()
        ->assertJsonPath('data.query', 'Babakan Tenjo')
        ->assertJsonPath('data.results.0.latitude', -6.3483)
        ->assertJsonPath('data.results.0.longitude', 106.4638)
        ->assertJsonPath('data.results.0.address.village', 'Babakan');
});

it('returns historical organization archive filtered by scope', function () {
    $unit = OrganizationUnit::query()->create([
        'scope' => OrganizationScope::SchoolManagement,
        'name' => 'Manajemen Sekolah',
        'slug' => 'manajemen-sekolah',
        'sort_order' => 1,
        'is_active' => true,
    ]);

    $position = OrganizationPosition::query()->create([
        'organization_unit_id' => $unit->id,
        'scope' => OrganizationScope::SchoolManagement,
        'title' => 'Kepala Sekolah',
        'slug' => 'kepala-sekolah',
        'hierarchy_level' => 1,
        'is_unique_holder' => true,
    ]);

    OrganizationAssignment::query()->create([
        'organization_unit_id' => $unit->id,
        'organization_position_id' => $position->id,
        'full_name_snapshot' => 'Titin Sriwartini',
        'status' => OrganizationAssignmentStatus::Active,
        'is_current' => true,
        'starts_at' => now()->subYear(),
    ]);

    OrganizationAssignment::query()->create([
        'organization_unit_id' => $unit->id,
        'organization_position_id' => $position->id,
        'full_name_snapshot' => 'Drs. Ahmad Maulana',
        'status' => OrganizationAssignmentStatus::Archived,
        'is_current' => false,
        'starts_at' => now()->subYears(5),
        'ends_at' => now()->subYears(2),
        'biography' => 'Arsip kepala sekolah periode sebelumnya.',
    ]);

    $response = $this->getJson('/api/public/organization/archive?scope=school_management');

    $response
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.name', 'Drs. Ahmad Maulana')
        ->assertJsonPath('data.0.position', 'Kepala Sekolah')
        ->assertJsonPath('data.0.scope', 'school_management');
});

it('returns curated extracurricular videos from public media assets', function () {
    MediaAsset::query()->create([
        'media_type' => MediaType::ExternalVideo,
        'visibility' => PortfolioVisibility::Public,
        'provider' => 'youtube',
        'provider_media_id' => 'yt-jurnalistik-smanten',
        'metadata' => [
            'title' => 'Jurnalistik SMANTEN',
            'category' => 'Media',
            'description' => 'Dokumentasi kegiatan jurnalistik sekolah.',
            'published_at' => now()->subDays(5)->toIso8601String(),
        ],
    ]);

    $response = $this->getJson('/api/public/videos/extracurricular?category=Media');

    $response
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.title', 'Jurnalistik SMANTEN')
        ->assertJsonPath('data.0.category', 'Media')
        ->assertJsonPath('data.0.state', 'Kurasi Sekolah');
});
