<?php

use App\Enums\MediaType;
use App\Enums\OrganizationAssignmentStatus;
use App\Enums\OrganizationScope;
use App\Enums\PortfolioVisibility;
use App\Models\AlumniForumPost;
use App\Models\MediaAsset;
use App\Models\OrganizationAssignment;
use App\Models\OrganizationPosition;
use App\Models\OrganizationUnit;
use Illuminate\Support\Facades\Http;
use Inertia\Testing\AssertableInertia as Assert;

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

it('reverse geocodes coordinates for alumni location autofill', function () {
    Http::fake([
        'https://nominatim.openstreetmap.org/*' => Http::response([
            'display_name' => 'Singabraja, Tenjo, Kabupaten Bogor, Jawa Barat, Indonesia',
            'lat' => '-6.442517',
            'lon' => '106.461658',
            'type' => 'residential',
            'address' => [
                'village' => 'Singabraja',
                'city' => 'Bogor',
                'county' => 'Kabupaten Bogor',
                'state' => 'Jawa Barat',
            ],
        ], 200),
    ]);

    $this->getJson('/api/public/geocode/reverse?latitude=-6.442517&longitude=106.461658')
        ->assertOk()
        ->assertJsonPath('data.result.displayName', 'Singabraja, Tenjo, Kabupaten Bogor, Jawa Barat, Indonesia')
        ->assertJsonPath('data.result.latitude', -6.442517)
        ->assertJsonPath('data.result.longitude', 106.461658)
        ->assertJsonPath('data.result.address.village', 'Singabraja')
        ->assertJsonPath('data.result.address.city', 'Kabupaten Bogor')
        ->assertJsonPath('data.result.address.province', 'Jawa Barat');
});

it('hydrates alumni forum post locations in the public api response', function () {
    Http::fake([
        'https://nominatim.openstreetmap.org/*' => Http::response([
            [
                'display_name' => 'Bogor, Jawa Barat, Indonesia',
                'lat' => '-6.595038',
                'lon' => '106.816635',
                'type' => 'city',
                'address' => [
                    'city' => 'Bogor',
                    'state' => 'Jawa Barat',
                ],
            ],
        ], 200),
    ]);

    $post = AlumniForumPost::query()->create([
        'author_name' => 'Intra Sepriansa',
        'graduation_year' => 2020,
        'category' => 'cerita',
        'title' => 'Perjalanan saya setelah lulus',
        'body' => 'Saya berbagi pengalaman belajar dan bekerja.',
        'city' => 'Bogor',
        'province' => 'Jawa Barat',
        'is_approved' => true,
    ]);

    $this->getJson('/api/public/alumni-forum')
        ->assertOk()
        ->assertJsonPath('data.0.id', $post->id)
        ->assertJsonPath('data.0.location.latitude', -6.595038)
        ->assertJsonPath('data.0.location.longitude', 106.816635)
        ->assertJsonPath(
            'data.0.locationMapUrl',
            'https://www.google.com/maps/search/?api=1&query=-6.595038%2C106.816635',
        );

    expect($post->fresh()->metadata)->toMatchArray([
        'location' => [
            'latitude' => -6.595038,
            'longitude' => 106.816635,
        ],
    ]);
});

it('hydrates alumni forum post locations in the alumni page props', function () {
    Http::fake([
        'https://nominatim.openstreetmap.org/*' => Http::response([
            [
                'display_name' => 'Jakarta, Daerah Khusus Ibukota Jakarta, Indonesia',
                'lat' => '-6.208763',
                'lon' => '106.845599',
                'type' => 'city',
                'address' => [
                    'city' => 'Jakarta',
                    'state' => 'DKI Jakarta',
                ],
            ],
        ], 200),
    ]);

    $post = AlumniForumPost::query()->create([
        'author_name' => 'Alumni Jakarta',
        'graduation_year' => 2024,
        'category' => 'kampus',
        'title' => 'Perjalanan saya sebagai mahasiswa',
        'body' => 'Saya sedang kuliah dan aktif organisasi.',
        'institution_name' => 'Universitas Esa Unggul',
        'city' => 'Jakarta',
        'province' => 'DKI Jakarta',
        'is_approved' => true,
    ]);

    $this->get('/alumni')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/alumni')
            ->where('forumPosts.0.id', $post->id)
            ->where('forumPosts.0.location.latitude', -6.208763)
            ->where('forumPosts.0.location.longitude', 106.845599)
            ->where(
                'forumPosts.0.locationMapUrl',
                'https://www.google.com/maps/search/?api=1&query=-6.208763%2C106.845599',
            ),
        );
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
