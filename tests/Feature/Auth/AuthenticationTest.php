<?php

use App\Enums\RoleName;
use App\Enums\UserStatus;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\RateLimiter;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Fortify\Features;

test('login screen can be rendered', function () {
    $response = $this->get(route('login'));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/login')
            ->where('canResetPassword', true)
            ->where('canRegister', true)
            ->where('securityProfile.guard', 'web')
            ->where('securityProfile.supportsTwoFactor', true)
            ->where('securityProfile.loginAttemptsPerMinute', 5),
        );
});

test('users can authenticate using the login screen', function () {
    Carbon::setTestNow('2026-04-18 09:30:00');

    $user = User::factory()->create([
        'last_login_at' => null,
        'last_seen_at' => null,
    ]);

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));

    expect($user->refresh()->last_login_at?->toDateTimeString())->toBe(now()->toDateTimeString())
        ->and($user->last_seen_at?->toDateTimeString())->toBe(now()->toDateTimeString());

    Carbon::setTestNow();
});

test('super admins are redirected to the admin dashboard after login', function () {
    $role = Role::query()->create([
        'name' => 'Super Admin',
        'slug' => RoleName::SuperAdmin->value,
        'description' => 'Administrator utama platform.',
        'is_system' => true,
    ]);

    $user = User::factory()->create();
    $user->roles()->attach($role->id, ['assigned_at' => now()]);

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticatedAs($user);
    $response->assertRedirect(route('dashboard.admin', absolute: false));
});

test('users with two factor enabled are redirected to two factor challenge', function () {
    $this->skipUnlessFortifyHas(Features::twoFactorAuthentication());

    Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]);

    $user = User::factory()->create();

    $user->forceFill([
        'two_factor_secret' => encrypt('test-secret'),
        'two_factor_recovery_codes' => encrypt(json_encode(['code1', 'code2'])),
        'two_factor_confirmed_at' => now(),
    ])->save();

    $response = $this->post(route('login'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertRedirect(route('two-factor.login'));
    $response->assertSessionHas('login.id', $user->id);
    $this->assertGuest();
});

test('users can not authenticate with invalid password', function () {
    $user = User::factory()->create();

    $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});

test('users with inactive accounts can not authenticate', function () {
    $user = User::factory()->create([
        'status' => UserStatus::Suspended,
        'last_login_at' => null,
    ]);

    $response = $this
        ->from(route('login'))
        ->post(route('login.store'), [
            'email' => $user->email,
            'password' => 'password',
        ]);

    $response
        ->assertRedirect(route('login'))
        ->assertSessionHasErrors([
            'email' => 'Akun ini tidak aktif untuk portal internal. Hubungi super admin.',
        ]);

    $this->assertGuest();
    expect($user->refresh()->last_login_at)->toBeNull();
});

test('users can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('logout'));

    $this->assertGuest();
    $response->assertRedirect(route('home'));
});

test('users are rate limited', function () {
    $user = User::factory()->create();

    RateLimiter::increment(md5('login'.implode('|', [$user->email, '127.0.0.1'])), amount: 5);

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $response->assertTooManyRequests();
});
