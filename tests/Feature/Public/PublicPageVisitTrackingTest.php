<?php

use App\Models\ActivityLog;

use function Pest\Laravel\get;

it('tracks public page visits and stores a visitor cookie', function () {
    $response = get(route('home'));

    $response
        ->assertOk()
        ->assertCookie('public_site_visitor');

    $visitLog = ActivityLog::query()
        ->where('event', 'public.page.visited')
        ->latest('id')
        ->first();

    expect($visitLog)->not->toBeNull();
    expect($visitLog?->description)->toBe('Pengunjung membuka halaman publik.');
    expect(data_get($visitLog?->properties, 'routeName'))->toBe('home');
    expect(data_get($visitLog?->properties, 'path'))->toBe('/');
    expect(data_get($visitLog?->properties, 'visitorTokenHash'))->toBeString();
});

it('does not track sitemap requests as public visits', function () {
    get(route('sitemap'))->assertOk();

    expect(
        ActivityLog::query()
            ->where('event', 'public.page.visited')
            ->count()
    )->toBe(0);
});
