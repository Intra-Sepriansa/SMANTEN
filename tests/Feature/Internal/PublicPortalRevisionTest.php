<?php

use App\Enums\RoleName;
use App\Models\Role;
use App\Models\SiteSetting;
use App\Models\SiteSettingRevision;
use App\Models\User;
use Illuminate\Support\Str;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;
use function Pest\Laravel\patchJson;
use function Pest\Laravel\postJson;

it('stores public portal revisions and restores an older version', function () {
    $user = createRevisionFeatureAdminUser();
    actingAs($user);

    $firstPayload = revisionFeaturePublicPortalPayload('Hero versi pertama');
    $secondPayload = revisionFeaturePublicPortalPayload('Hero versi kedua');

    patchJson(route('internal-api.site-settings.public-portal.update'), $firstPayload)
        ->assertOk()
        ->assertJsonPath('revision.version', 1);

    patchJson(route('internal-api.site-settings.public-portal.update'), $secondPayload)
        ->assertOk()
        ->assertJsonPath('revision.version', 2);

    expect(SiteSettingRevision::query()->count())->toBe(2);

    $firstRevision = SiteSettingRevision::query()->where('version', 1)->firstOrFail();

    getJson(route('internal-api.site-settings.public-portal.revisions.index'))
        ->assertOk()
        ->assertJsonPath('data.0.version', 2);

    postJson(route('internal-api.site-settings.public-portal.revisions.restore', $firstRevision))
        ->assertOk()
        ->assertJsonPath('data.revision.version', 3);

    $storedValue = SiteSetting::query()
        ->where('key', SiteSetting::PUBLIC_PORTAL_KEY)
        ->firstOrFail()
        ->value;

    expect($storedValue['hero']['slides'][0]['title'])->toBe('Hero versi pertama');
});

function createRevisionFeatureAdminUser(): User
{
    $user = User::factory()->createOne();
    $role = Role::query()->firstOrCreate(
        ['slug' => RoleName::SuperAdmin->value],
        ['name' => Str::headline(RoleName::SuperAdmin->value)],
    );

    $user->roles()->attach($role->id, ['assigned_at' => now()]);

    return $user;
}

function revisionFeaturePublicPortalPayload(string $title): array
{
    return [
        'hero' => [
            'slides' => [
                ['image' => '/images/a.jpg', 'title' => $title, 'subtitle' => 'Satu'],
                ['image' => '/images/b.jpg', 'title' => 'Slide dua', 'subtitle' => 'Dua'],
                ['image' => '/images/c.jpg', 'title' => 'Slide tiga', 'subtitle' => 'Tiga'],
                ['image' => '/images/d.jpg', 'title' => 'Slide empat', 'subtitle' => 'Empat'],
            ],
            'primary_cta' => [
                'label' => 'Buka',
                'href' => '/berita',
            ],
        ],
        'navigation' => [
            'items' => [
                ['href' => '/', 'label' => 'Beranda', 'visible' => true, 'position' => 1],
                ['href' => '/profil', 'label' => 'Profil', 'visible' => true, 'position' => 2],
            ],
        ],
        'publishing' => [
            'status' => 'published',
            'scheduled_at' => null,
        ],
        'seo' => [
            'title' => 'SEO '.$title,
            'description' => 'Deskripsi SEO untuk pengujian revision.',
            'keywords' => 'cms, sekolah',
        ],
    ];
}
