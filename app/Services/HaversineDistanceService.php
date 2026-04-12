<?php

namespace App\Services;

class HaversineDistanceService
{
    public function calculateInMeters(
        float $originLatitude,
        float $originLongitude,
        float $destinationLatitude,
        float $destinationLongitude,
    ): float {
        $earthRadius = 6371000;

        $latFrom = deg2rad($originLatitude);
        $lngFrom = deg2rad($originLongitude);
        $latTo = deg2rad($destinationLatitude);
        $lngTo = deg2rad($destinationLongitude);

        $latitudeDelta = $latTo - $latFrom;
        $longitudeDelta = $lngTo - $lngFrom;

        $angle = 2 * asin(sqrt(
            pow(sin($latitudeDelta / 2), 2)
            + cos($latFrom) * cos($latTo) * pow(sin($longitudeDelta / 2), 2),
        ));

        return round($angle * $earthRadius, 2);
    }
}
