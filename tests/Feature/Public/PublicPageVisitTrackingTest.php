<?php

use App\Http\Middleware\TrackPublicPageVisit;
use App\Models\ActivityLog;
use App\Models\PublicSiteVisitor;
use Illuminate\Support\Facades\Route;

use function Pest\Laravel\get;
use function Pest\Laravel\withCookie;

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

    $visitor = PublicSiteVisitor::query()->sole();

    expect($visitor->visitor_token_hash)->toBe(data_get($visitLog?->properties, 'visitorTokenHash'));
    expect($visitor->last_route_name)->toBe('home');
    expect($visitor->last_path)->toBe('/');
    expect($visitor->page_views)->toBe(1);
});

it('counts the same public visitor once while increasing page views', function () {
    withCookie('public_site_visitor', 'repeat-visitor')->get(route('home'))->assertOk();
    withCookie('public_site_visitor', 'repeat-visitor')->get(route('profile'))->assertOk();

    $visitor = PublicSiteVisitor::query()->sole();

    expect($visitor->visitor_token_hash)->toBe(hash('sha256', 'repeat-visitor'));
    expect($visitor->last_route_name)->toBe('profile');
    expect($visitor->last_path)->toBe('/profil');
    expect($visitor->page_views)->toBe(2);
    expect(
        ActivityLog::query()
            ->where('event', 'public.page.visited')
            ->count()
    )->toBe(2);
});

it('does not track sitemap requests as public visits', function () {
    get(route('sitemap'))->assertOk();

    expect(
        ActivityLog::query()
            ->where('event', 'public.page.visited')
            ->count()
    )->toBe(0);
    expect(PublicSiteVisitor::query()->count())->toBe(0);
});

it('does not keep visitor counters for failed public responses', function () {
    Route::get('/testing-failed-public-visit', fn () => response('Failed', 500))
        ->middleware(TrackPublicPageVisit::class)
        ->name('testing.failed-public-visit');

    get('/testing-failed-public-visit')->assertServerError();

    expect(
        ActivityLog::query()
            ->where('event', 'public.page.visited')
            ->count()
    )->toBe(0);
    expect(PublicSiteVisitor::query()->count())->toBe(0);
});
