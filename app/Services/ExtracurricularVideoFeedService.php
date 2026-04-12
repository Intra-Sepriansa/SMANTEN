<?php

namespace App\Services;

use App\Enums\MediaType;
use App\Enums\PortfolioVisibility;
use App\Models\MediaAsset;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Throwable;

class ExtracurricularVideoFeedService
{
    /**
     * @return array<int, array<string, mixed>>
     */
    public function getPublicFeed(int $limit = 8): array
    {
        if ($this->hasYoutubeConfiguration()) {
            try {
                $feed = $this->fetchFromYoutube($limit);

                if ($feed !== []) {
                    return $feed;
                }
            } catch (Throwable $exception) {
                report($exception);
            }
        }

        return $this->fetchFromCuratedMediaAssets($limit);
    }

    protected function hasYoutubeConfiguration(): bool
    {
        return filled(config('services.youtube.api_key'))
            && filled(config('services.youtube.channel_id'));
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function fetchFromYoutube(int $limit): array
    {
        $response = Http::baseUrl('https://www.googleapis.com/youtube/v3')
            ->acceptJson()
            ->timeout(10)
            ->get('/search', [
                'part' => 'snippet',
                'channelId' => (string) config('services.youtube.channel_id'),
                'maxResults' => min(max($limit, 1), 12),
                'order' => 'date',
                'type' => 'video',
                'key' => (string) config('services.youtube.api_key'),
            ]);

        $response->throw();

        return collect($response->json('items', []))
            ->map(function (array $item): array {
                $videoId = data_get($item, 'id.videoId');
                $title = html_entity_decode((string) data_get($item, 'snippet.title', 'Video Sekolah'));
                $description = html_entity_decode((string) data_get($item, 'snippet.description', ''));

                return [
                    'id' => $videoId,
                    'title' => $title,
                    'category' => $this->detectCategory($title, $description),
                    'description' => Str::limit(strip_tags($description), 180),
                    'state' => 'YouTube Live Feed',
                    'provider' => 'youtube',
                    'externalUrl' => filled($videoId) ? 'https://www.youtube.com/watch?v='.$videoId : null,
                    'thumbnailUrl' => data_get($item, 'snippet.thumbnails.high.url')
                        ?? data_get($item, 'snippet.thumbnails.medium.url')
                        ?? data_get($item, 'snippet.thumbnails.default.url'),
                    'publishedAt' => data_get($item, 'snippet.publishedAt'),
                ];
            })
            ->filter(fn (array $item): bool => filled($item['id']))
            ->values()
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function fetchFromCuratedMediaAssets(int $limit): array
    {
        return MediaAsset::query()
            ->where('media_type', MediaType::ExternalVideo->value)
            ->where('visibility', PortfolioVisibility::Public->value)
            ->orderBy('sort_order')
            ->limit($limit)
            ->get()
            ->map(fn (MediaAsset $asset): array => [
                'id' => (string) $asset->getKey(),
                'title' => (string) data_get($asset->metadata, 'title', $asset->original_name ?? 'Video Kegiatan Sekolah'),
                'category' => (string) data_get($asset->metadata, 'category', 'Sekolah'),
                'description' => data_get($asset->metadata, 'description'),
                'state' => 'Kurasi Sekolah',
                'provider' => $asset->provider ?? 'youtube',
                'externalUrl' => $asset->external_url,
                'thumbnailUrl' => data_get($asset->metadata, 'thumbnail_url'),
                'publishedAt' => data_get($asset->metadata, 'published_at'),
            ])
            ->values()
            ->all();
    }

    protected function detectCategory(string $title, string $description): string
    {
        $haystack = Str::lower($title.' '.$description);

        return match (true) {
            Str::contains($haystack, ['tari', 'budaya', 'seni']) => 'Budaya',
            Str::contains($haystack, ['paskibra', 'kepemimpinan', 'upacara']) => 'Kepemimpinan',
            Str::contains($haystack, ['jurnalistik', 'media', 'publikasi']) => 'Media',
            Str::contains($haystack, ['adiwiyata', 'lingkungan', 'hijau']) => 'Lingkungan',
            default => 'Sekolah',
        };
    }
}
