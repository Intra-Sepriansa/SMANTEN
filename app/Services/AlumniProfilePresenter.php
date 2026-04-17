<?php

namespace App\Services;

use App\Models\AlumniProfile;
use Throwable;

class AlumniProfilePresenter
{
    public function __construct(
        protected AddressGeocodingService $geocodingService,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function presentSummary(AlumniProfile $profile): array
    {
        $location = $this->resolveLocation($profile);

        return [
            'id' => $profile->id,
            'slug' => $profile->slug,
            'url' => $profile->slug ? route('alumni.profile.show', $profile->slug, absolute: false) : null,
            'fullName' => $profile->full_name,
            'graduationYear' => $profile->graduation_year,
            'institutionName' => $profile->institution_name,
            'occupationTitle' => $profile->occupation_title,
            'city' => $profile->city,
            'province' => $profile->province,
            'bio' => $profile->bio,
            'isVerified' => $profile->is_public_profile,
            'mentorshipBadge' => $profile->is_open_to_mentor,
            'hiringBadge' => $profile->has_hiring_info,
            'storyCount' => $profile->relationLoaded('forumPosts')
                ? $profile->forumPosts->count()
                : $profile->forumPosts()->count(),
            'location' => $location,
            'locationMapUrl' => $this->buildLocationMapUrl($location),
        ];
    }

    /**
     * @param  iterable<AlumniProfile>  $profiles
     * @return array<int, array<string, mixed>>
     */
    public function presentMany(iterable $profiles): array
    {
        return collect($profiles)
            ->map(fn (AlumniProfile $profile): array => $this->presentSummary($profile))
            ->values()
            ->all();
    }

    /**
     * @return array{latitude: float, longitude: float}|null
     */
    protected function resolveLocation(AlumniProfile $profile): ?array
    {
        $metadata = is_array($profile->metadata) ? $profile->metadata : [];
        $location = $this->extractLocationFromMetadata($metadata);

        if ($location !== null) {
            return $location;
        }

        $forumLocation = $profile->relationLoaded('forumPosts')
            ? $profile->forumPosts->firstWhere('location_latitude', '!==', null)
            : $profile->forumPosts()
                ->whereNotNull('location_latitude')
                ->orderByDesc('created_at')
                ->first();

        if ($forumLocation?->location_latitude !== null && $forumLocation?->location_longitude !== null) {
            $location = [
                'latitude' => (float) $forumLocation->location_latitude,
                'longitude' => (float) $forumLocation->location_longitude,
            ];

            $this->persistLocation($profile, $metadata, $location);

            return $location;
        }

        $query = collect([$profile->city, $profile->province])
            ->filter(fn (?string $value): bool => filled($value))
            ->unique()
            ->implode(', ');

        if ($query === '') {
            return null;
        }

        try {
            $result = $this->geocodingService->search($query, 1, 'Indonesia')[0] ?? null;
        } catch (Throwable $exception) {
            report($exception);

            return null;
        }

        if (! is_array($result)) {
            return null;
        }

        $location = [
            'latitude' => (float) ($result['latitude'] ?? 0),
            'longitude' => (float) ($result['longitude'] ?? 0),
        ];

        if (! is_finite($location['latitude']) || ! is_finite($location['longitude'])) {
            return null;
        }

        $this->persistLocation($profile, $metadata, $location);

        return $location;
    }

    /**
     * @param  array<string, mixed>  $metadata
     * @return array{latitude: float, longitude: float}|null
     */
    protected function extractLocationFromMetadata(array $metadata): ?array
    {
        $latitude = data_get($metadata, 'location.latitude');
        $longitude = data_get($metadata, 'location.longitude');

        if (! is_numeric($latitude) || ! is_numeric($longitude)) {
            return null;
        }

        return [
            'latitude' => (float) $latitude,
            'longitude' => (float) $longitude,
        ];
    }

    /**
     * @param  array<string, mixed>  $metadata
     * @param  array{latitude: float, longitude: float}  $location
     */
    protected function persistLocation(AlumniProfile $profile, array $metadata, array $location): void
    {
        $metadata['location'] = $location;
        $profile->forceFill(['metadata' => $metadata]);

        if ($profile->exists && $profile->isDirty('metadata')) {
            $profile->saveQuietly();
        }
    }

    /**
     * @param  array{latitude: float, longitude: float}|null  $location
     */
    protected function buildLocationMapUrl(?array $location): ?string
    {
        if ($location === null) {
            return null;
        }

        return 'https://www.google.com/maps/search/?'.http_build_query([
            'api' => 1,
            'query' => $location['latitude'].','.$location['longitude'],
        ]);
    }
}
