<?php

namespace App\Services;

use App\Models\AlumniForumComment;
use App\Models\AlumniForumPost;
use Illuminate\Support\Str;
use Throwable;

class AlumniForumPostPresenter
{
    public function __construct(
        protected AddressGeocodingService $geocodingService,
        protected AlumniProfilePresenter $alumniProfilePresenter,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function present(AlumniForumPost $post, ?string $visitorTokenHash = null, bool $detailed = false): array
    {
        $post->loadMissing([
            'alumniProfile',
            'comments' => fn ($query) => $query
                ->where('moderation_status', 'approved')
                ->latest()
                ->limit($detailed ? 20 : 3),
            'reactions',
        ]);

        $location = $this->resolveLocation($post);

        return [
            'id' => $post->id,
            'slug' => $post->slug,
            'detailUrl' => $post->slug ? route('alumni.story.show', $post->slug, absolute: false) : null,
            'authorName' => $post->author_name,
            'graduationYear' => $post->graduation_year,
            'category' => $post->category,
            'title' => $post->title,
            'excerpt' => Str::limit($post->body, $detailed ? 500 : 180),
            'body' => $post->body,
            'institutionName' => $post->institution_name,
            'occupationTitle' => $post->occupation_title,
            'city' => $post->city,
            'province' => $post->province,
            'likesCount' => $post->likes_count,
            'viewsCount' => $post->views_count,
            'commentsCount' => $post->comments_count,
            'bookmarksCount' => $post->bookmarks_count,
            'shareCount' => $post->share_count,
            'reportsCount' => $post->reports_count,
            'isFeatured' => $post->is_featured,
            'moderationStatus' => $post->moderation_status,
            'isOpenToMentor' => $post->is_open_to_mentor,
            'hasHiringInfo' => $post->has_hiring_info,
            'createdAt' => $post->created_at?->toISOString(),
            'updatedAt' => $post->updated_at?->toISOString(),
            'location' => $location,
            'locationMapUrl' => $this->buildLocationMapUrl($location),
            'profile' => $post->alumniProfile
                ? $this->alumniProfilePresenter->presentSummary($post->alumniProfile)
                : null,
            'comments' => $post->comments
                ->map(fn (AlumniForumComment $comment): array => [
                    'id' => $comment->id,
                    'authorName' => $comment->author_name,
                    'body' => $comment->body,
                    'createdAt' => $comment->created_at?->toISOString(),
                ])
                ->values()
                ->all(),
            'viewerState' => [
                'liked' => $this->hasReaction($post, 'like', $visitorTokenHash),
                'bookmarked' => $this->hasReaction($post, 'bookmark', $visitorTokenHash),
                'reported' => $this->hasReaction($post, 'report', $visitorTokenHash),
                'shared' => $this->hasReaction($post, 'share', $visitorTokenHash),
            ],
        ];
    }

    /**
     * @param  iterable<AlumniForumPost>  $posts
     * @return array<int, array<string, mixed>>
     */
    public function presentMany(iterable $posts, ?string $visitorTokenHash = null, bool $detailed = false): array
    {
        return collect($posts)
            ->map(fn (AlumniForumPost $post): array => $this->present($post, $visitorTokenHash, $detailed))
            ->values()
            ->all();
    }

    /**
     * @return array{latitude: float, longitude: float}|null
     */
    protected function resolveLocation(AlumniForumPost $post): ?array
    {
        if ($post->location_latitude !== null && $post->location_longitude !== null) {
            return [
                'latitude' => (float) $post->location_latitude,
                'longitude' => (float) $post->location_longitude,
            ];
        }

        $metadata = is_array($post->metadata) ? $post->metadata : [];
        $location = $this->extractLocationFromMetadata($metadata);

        if ($location !== null) {
            return $location;
        }

        $query = collect([$post->city, $post->province])
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

        $metadata['location'] = $location;
        $post->forceFill([
            'metadata' => $metadata,
            'location_latitude' => $location['latitude'],
            'location_longitude' => $location['longitude'],
        ]);

        if (
            $post->exists
            && ($post->isDirty('metadata') || $post->isDirty('location_latitude') || $post->isDirty('location_longitude'))
        ) {
            $post->saveQuietly();
        }

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

    protected function hasReaction(AlumniForumPost $post, string $type, ?string $visitorTokenHash): bool
    {
        if ($visitorTokenHash === null || ! $post->relationLoaded('reactions')) {
            return false;
        }

        return $post->reactions->contains(
            fn ($reaction): bool => $reaction->reaction_type === $type
                && $reaction->visitor_token_hash === $visitorTokenHash
        );
    }
}
