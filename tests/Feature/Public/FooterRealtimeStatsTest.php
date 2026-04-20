<?php

use App\Services\PublicRealtimeStatsService;
use Inertia\Testing\AssertableInertia as Assert;

use function Pest\Laravel\get;

it('shares realtime visitor counters with public inertia pages', function () {
    app(PublicRealtimeStatsService::class)->trackVisitor(hash('sha256', 'visitor-a'));
    app(PublicRealtimeStatsService::class)->trackVisitor(hash('sha256', 'visitor-b'));

    get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/home')
            ->where('publicRealtime.liveOnline', 3)
            ->where('publicRealtime.totalVisits', 3)
            ->where('publicRealtime.todayVisits', 3)
            ->where('publicRealtime.totalVisitors', 3)
            ->where('publicRealtime.todayVisitors', 3)
            ->where('publicRealtime.todayPageViews', 1)
            ->where('publicRealtime.windowMinutes', 5));
});
