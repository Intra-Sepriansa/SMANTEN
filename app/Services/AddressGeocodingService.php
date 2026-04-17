<?php

namespace App\Services;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class AddressGeocodingService
{
    /**
     * @return array<int, array<string, mixed>>
     */
    public function search(
        string $query,
        int $limit = 5,
        ?string $fallbackContext = 'Tenjo, Kabupaten Bogor, Jawa Barat, Indonesia',
    ): array {
        $response = $this->request()
            ->timeout(10)
            ->get('/search', [
                'q' => $this->normalizeQuery($query, $fallbackContext),
                'format' => 'jsonv2',
                'addressdetails' => 1,
                'limit' => min(max($limit, 1), 5),
                'countrycodes' => 'id',
            ]);

        $response->throw();

        return collect($response->json())
            ->map(fn (array $result): array => $this->formatResult($result))
            ->filter(fn (array $result): bool => filled($result['displayName']))
            ->values()
            ->all();
    }

    /**
     * @return array{
     *     displayName: string,
     *     name: string|null,
     *     type: string|null,
     *     latitude: float,
     *     longitude: float,
     *     address: array{
     *         road: string|null,
     *         village: string|null,
     *         district: string|null,
     *         city: string|null,
     *         province: string|null
     *     }
     * }|null
     */
    public function reverse(float $latitude, float $longitude): ?array
    {
        $response = $this->request()
            ->timeout(10)
            ->get('/reverse', [
                'lat' => $latitude,
                'lon' => $longitude,
                'format' => 'jsonv2',
                'addressdetails' => 1,
                'zoom' => 18,
            ]);

        $response->throw();

        $result = $response->json();

        if (! is_array($result)) {
            return null;
        }

        $formattedResult = $this->formatResult($result);

        return filled($formattedResult['displayName']) ? $formattedResult : null;
    }

    protected function request(): PendingRequest
    {
        return Http::baseUrl((string) config('services.nominatim.base_url'))
            ->acceptJson()
            ->withHeaders([
                'User-Agent' => (string) config('services.nominatim.user_agent'),
            ]);
    }

    /**
     * @param  array<string, mixed>  $result
     * @return array{
     *     displayName: string,
     *     name: string|null,
     *     type: string|null,
     *     latitude: float,
     *     longitude: float,
     *     address: array{
     *         road: string|null,
     *         village: string|null,
     *         district: string|null,
     *         city: string|null,
     *         province: string|null
     *     }
     * }
     */
    protected function formatResult(array $result): array
    {
        $address = is_array($result['address'] ?? null) ? $result['address'] : [];

        return [
            'displayName' => (string) ($result['display_name'] ?? ''),
            'name' => $result['name'] ?? null,
            'type' => $result['type'] ?? null,
            'latitude' => (float) ($result['lat'] ?? 0),
            'longitude' => (float) ($result['lon'] ?? 0),
            'address' => [
                'road' => $this->stringOrNull($address['road'] ?? null),
                'village' => $this->stringOrNull($address['village'] ?? $address['suburb'] ?? null),
                'district' => $this->resolveDistrict($address),
                'city' => $this->resolveCity($address),
                'province' => $this->stringOrNull($address['state'] ?? null),
            ],
        ];
    }

    /**
     * @param  array<string, mixed>  $address
     */
    protected function resolveDistrict(array $address): ?string
    {
        return $this->stringOrNull(
            $address['city_district']
                ?? $address['district']
                ?? $address['suburb']
                ?? $address['village']
                ?? $address['county']
                ?? null
        );
    }

    /**
     * @param  array<string, mixed>  $address
     */
    protected function resolveCity(array $address): ?string
    {
        $county = $this->stringOrNull($address['county'] ?? null);

        if ($county !== null && Str::contains(Str::lower($county), ['kabupaten', 'kota'])) {
            return $county;
        }

        return $this->stringOrNull(
            $address['city']
                ?? $address['municipality']
                ?? $address['regency']
                ?? $address['county']
                ?? null
        );
    }

    protected function stringOrNull(mixed $value): ?string
    {
        return is_string($value) && trim($value) !== '' ? trim($value) : null;
    }

    protected function normalizeQuery(string $query, ?string $fallbackContext = null): string
    {
        $normalized = trim(preg_replace('/\s+/', ' ', $query) ?? $query);

        if ($normalized === '') {
            return $normalized;
        }

        if ($fallbackContext === null) {
            return $normalized;
        }

        $normalizedLower = Str::lower($normalized);
        $contextTokens = collect(explode(',', $fallbackContext))
            ->map(fn (string $segment): string => Str::lower(trim($segment)))
            ->filter()
            ->push('indonesia')
            ->unique()
            ->values()
            ->all();

        if (Str::contains($normalizedLower, $contextTokens)) {
            return $normalized;
        }

        return $normalized.', '.$fallbackContext;
    }
}
