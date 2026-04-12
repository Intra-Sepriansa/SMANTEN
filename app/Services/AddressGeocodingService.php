<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class AddressGeocodingService
{
    /**
     * @return array<int, array<string, mixed>>
     */
    public function search(string $query, int $limit = 5): array
    {
        $response = Http::baseUrl((string) config('services.nominatim.base_url'))
            ->acceptJson()
            ->withHeaders([
                'User-Agent' => (string) config('services.nominatim.user_agent'),
            ])
            ->timeout(10)
            ->get('/search', [
                'q' => $this->normalizeQuery($query),
                'format' => 'jsonv2',
                'addressdetails' => 1,
                'limit' => min(max($limit, 1), 5),
                'countrycodes' => 'id',
            ]);

        $response->throw();

        return collect($response->json())
            ->map(fn (array $result): array => [
                'displayName' => (string) ($result['display_name'] ?? ''),
                'name' => $result['name'] ?? null,
                'type' => $result['type'] ?? null,
                'latitude' => (float) ($result['lat'] ?? 0),
                'longitude' => (float) ($result['lon'] ?? 0),
                'address' => [
                    'road' => data_get($result, 'address.road'),
                    'village' => data_get($result, 'address.village') ?? data_get($result, 'address.suburb'),
                    'district' => data_get($result, 'address.city_district') ?? data_get($result, 'address.county'),
                    'city' => data_get($result, 'address.city') ?? data_get($result, 'address.county'),
                    'province' => data_get($result, 'address.state'),
                ],
            ])
            ->filter(fn (array $result): bool => filled($result['displayName']))
            ->values()
            ->all();
    }

    protected function normalizeQuery(string $query): string
    {
        $normalized = trim(preg_replace('/\s+/', ' ', $query) ?? $query);

        if ($normalized === '') {
            return $normalized;
        }

        $knownContext = ['tenjo', 'bogor', 'jawa barat', 'indonesia'];

        if (Str::contains(Str::lower($normalized), $knownContext)) {
            return $normalized;
        }

        return $normalized.', Tenjo, Kabupaten Bogor, Jawa Barat, Indonesia';
    }
}
