<?php

use App\Enums\RoleName;
use App\Models\MediaAsset;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\post;

it('uploads media assets with visibility and crop metadata', function () {
    Storage::fake('public');

    $user = createMediaFeatureAdminUser();
    actingAs($user);

    post(route('internal-api.media-assets.store'), [
        'file' => UploadedFile::fake()->create('panduan.pdf', 64, 'application/pdf'),
        'alt_text' => 'Panduan PPDB',
        'visibility' => 'public',
        'crop' => [
            'x' => 10,
            'y' => 20,
            'width' => 300,
            'height' => 200,
        ],
    ], ['Accept' => 'application/json'])
        ->assertCreated()
        ->assertJsonPath('data.visibility', 'public')
        ->assertJsonPath('data.crop.x', 10);

    $asset = MediaAsset::query()->firstOrFail();

    Storage::disk('public')->assertExists($asset->path);
});

function createMediaFeatureAdminUser(): User
{
    $user = User::factory()->createOne();
    $role = Role::query()->firstOrCreate(
        ['slug' => RoleName::SuperAdmin->value],
        ['name' => Str::headline(RoleName::SuperAdmin->value)],
    );

    $user->roles()->attach($role->id, ['assigned_at' => now()]);

    return $user;
}
