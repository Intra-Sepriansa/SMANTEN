<?php

use App\Enums\RoleName;
use App\Models\Role;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;
use function Pest\Laravel\patchJson;

it('allows super admin to update public portal settings and shares them on the home page', function () {
    $user = createInternalUserWithRole(RoleName::SuperAdmin);
    $payload = publicPortalPayload();

    actingAs($user);

    patchJson(route('internal-api.site-settings.public-portal.update'), $payload)
        ->assertOk()
        ->assertJsonPath('data.hero.primary_cta.label', 'Daftar Sekarang')
        ->assertJsonPath('data.navigation.items.1.visible', false);

    expect(
        SiteSetting::query()
            ->where('key', SiteSetting::PUBLIC_PORTAL_KEY)
            ->value('value'),
    )->toMatchArray($payload);

    get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/home')
            ->where('siteSettings.publicPortal.hero.primary_cta.label', 'Daftar Sekarang')
            ->where('siteSettings.publicPortal.hero.slides.0.image', '/images/profil/hero-banner.png')
            ->where('siteSettings.publicPortal.navigation.items.1.visible', false));
});

it('allows operator sekolah to update public portal settings', function () {
    $user = createInternalUserWithRole(RoleName::OperatorSekolah);

    actingAs($user);

    patchJson(route('internal-api.site-settings.public-portal.update'), publicPortalPayload())
        ->assertOk()
        ->assertJsonFragment([
            'href' => '/ppdb',
            'label' => 'Pendaftaran',
        ]);
});

it('forbids users without admin portal access from updating public portal settings', function () {
    $user = createInternalUserWithRole(RoleName::Guru);

    actingAs($user);

    patchJson(route('internal-api.site-settings.public-portal.update'), publicPortalPayload())
        ->assertForbidden();
});

it('keeps the public site available when the site settings table is missing', function () {
    Schema::dropIfExists('site_settings');

    get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/home')
            ->where('siteSettings.publicPortal', null));
});

it('returns a clear error when updating public portal settings before migration runs', function () {
    $user = createInternalUserWithRole(RoleName::SuperAdmin);

    Schema::dropIfExists('site_settings');

    actingAs($user);

    patchJson(route('internal-api.site-settings.public-portal.update'), publicPortalPayload())
        ->assertStatus(503)
        ->assertJsonPath('message', 'Tabel site_settings belum tersedia. Jalankan php artisan migrate terlebih dahulu.');
});

function createInternalUserWithRole(RoleName $roleName): User
{
    $user = User::factory()->createOne();
    $role = Role::query()->firstOrCreate(
        ['slug' => $roleName->value],
        ['name' => Str::headline($roleName->value)],
    );

    $user->roles()->attach($role->id, ['assigned_at' => now()]);

    return $user;
}

function publicPortalPayload(): array
{
    return [
        'hero' => [
            'slides' => [
                [
                    'image' => '/images/profil/hero-banner.png',
                    'title' => 'Portal SMA Negeri 1 Tenjo',
                    'subtitle' => 'Monitoring publik yang lebih rapi',
                ],
                [
                    'image' => '/images/sekolah/guru_mengajar.jpg',
                    'title' => 'Edit banner tanpa ubah kode',
                    'subtitle' => 'Kontrol hero utama',
                ],
                [
                    'image' => '/images/sekolah/murid_belajar.jpg',
                    'title' => 'CTA diarahkan oleh super admin',
                    'subtitle' => 'Fokus ke alur prioritas',
                ],
                [
                    'image' => '/images/sekolah/kegiatan_siswa.jpg',
                    'title' => 'Navigasi publik lebih terarah',
                    'subtitle' => 'Kelola menu aktif',
                ],
            ],
            'primary_cta' => [
                'label' => 'Daftar Sekarang',
                'href' => '/ppdb',
            ],
        ],
        'navigation' => [
            'items' => [
                [
                    'href' => '/',
                    'label' => 'Beranda Publik',
                    'visible' => true,
                    'position' => 1,
                ],
                [
                    'href' => '/profil',
                    'label' => 'Profil Sekolah',
                    'visible' => false,
                    'position' => 2,
                ],
                [
                    'href' => '/ppdb',
                    'label' => 'Pendaftaran',
                    'visible' => true,
                    'position' => 3,
                ],
            ],
        ],
    ];
}
