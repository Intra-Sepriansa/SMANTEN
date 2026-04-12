<?php

use App\Services\HaversineDistanceService;

it('calculates haversine distance in meters', function () {
    $service = new HaversineDistanceService();

    $distance = $service->calculateInMeters(-6.3483, 106.4638, -6.3512, 106.4702);

    expect($distance)->toBeGreaterThan(100)
        ->and($distance)->toBeLessThan(1000);
});
