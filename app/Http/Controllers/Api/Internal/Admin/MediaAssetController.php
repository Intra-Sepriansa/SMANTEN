<?php

namespace App\Http\Controllers\Api\Internal\Admin;

use App\Enums\MediaType;
use App\Enums\PortfolioVisibility;
use App\Http\Controllers\Controller;
use App\Models\MediaAsset;
use App\Services\ActivityLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class MediaAssetController extends Controller
{
    public function __construct(
        protected ActivityLogService $activityLogService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => ['nullable', Rule::enum(MediaType::class)],
            'visibility' => ['nullable', Rule::enum(PortfolioVisibility::class)],
            'q' => ['nullable', 'string', 'max:120'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:60'],
        ]);

        $assets = MediaAsset::query()
            ->with('uploader:id,name,email')
            ->when(
                $validated['type'] ?? null,
                fn ($query, string $type) => $query->where('media_type', $type),
            )
            ->when(
                $validated['visibility'] ?? null,
                fn ($query, string $visibility) => $query->where('visibility', $visibility),
            )
            ->when($validated['q'] ?? null, function ($query, string $keyword): void {
                $query->where(function ($builder) use ($keyword): void {
                    $builder
                        ->where('original_name', 'like', "%{$keyword}%")
                        ->orWhere('alt_text', 'like', "%{$keyword}%")
                        ->orWhere('external_url', 'like', "%{$keyword}%");
                });
            })
            ->orderBy('sort_order')
            ->latest()
            ->paginate($validated['limit'] ?? 24)
            ->through(fn (MediaAsset $asset): array => $this->presentAsset($asset));

        return response()->json($assets);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'file' => ['nullable', 'required_without:external_url', 'file', 'max:51200', 'mimes:jpg,jpeg,png,webp,pdf,mp4,mov,webm'],
            'external_url' => ['nullable', 'required_without:file', 'url', 'max:500'],
            'alt_text' => ['nullable', 'string', 'max:160'],
            'visibility' => ['nullable', Rule::enum(PortfolioVisibility::class)],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:65535'],
            'crop' => ['nullable', 'array'],
            'crop.x' => ['nullable', 'numeric', 'min:0'],
            'crop.y' => ['nullable', 'numeric', 'min:0'],
            'crop.width' => ['nullable', 'numeric', 'min:1'],
            'crop.height' => ['nullable', 'numeric', 'min:1'],
            'crop.rotate' => ['nullable', 'numeric', 'min:-360', 'max:360'],
        ]);

        $file = $request->file('file');
        $path = $file?->store('media-library', 'public');
        $mediaType = $file
            ? $this->mediaTypeFromMime((string) $file->getMimeType())
            : MediaType::ExternalVideo;

        $asset = MediaAsset::query()->create([
            'uploader_user_id' => $request->user()?->getKey(),
            'media_type' => $mediaType,
            'disk' => 'public',
            'path' => $path,
            'original_name' => $file?->getClientOriginalName(),
            'alt_text' => $validated['alt_text'] ?? null,
            'mime_type' => $file?->getMimeType(),
            'size_bytes' => $file?->getSize(),
            'sort_order' => $validated['sort_order'] ?? 0,
            'visibility' => $validated['visibility'] ?? PortfolioVisibility::Internal,
            'external_url' => $validated['external_url'] ?? null,
            'metadata' => [
                'crop' => $validated['crop'] ?? null,
            ],
        ]);

        $this->activityLogService->log(
            $request->user(),
            $asset,
            'media_asset.created',
            'Media asset uploaded.',
            ['original_name' => $asset->original_name, 'media_type' => $asset->media_type?->value],
        );

        return response()->json([
            'data' => $this->presentAsset($asset->load('uploader:id,name,email')),
        ], 201);
    }

    public function update(Request $request, MediaAsset $mediaAsset): JsonResponse
    {
        $validated = $request->validate([
            'alt_text' => ['nullable', 'string', 'max:160'],
            'visibility' => ['nullable', Rule::enum(PortfolioVisibility::class)],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:65535'],
            'crop' => ['nullable', 'array'],
            'crop.x' => ['nullable', 'numeric', 'min:0'],
            'crop.y' => ['nullable', 'numeric', 'min:0'],
            'crop.width' => ['nullable', 'numeric', 'min:1'],
            'crop.height' => ['nullable', 'numeric', 'min:1'],
            'crop.rotate' => ['nullable', 'numeric', 'min:-360', 'max:360'],
        ]);

        $metadata = $mediaAsset->metadata ?? [];

        if (array_key_exists('crop', $validated)) {
            $metadata['crop'] = $validated['crop'];
        }

        $mediaAsset->update([
            'alt_text' => array_key_exists('alt_text', $validated) ? $validated['alt_text'] : $mediaAsset->alt_text,
            'visibility' => $validated['visibility'] ?? $mediaAsset->visibility,
            'sort_order' => $validated['sort_order'] ?? $mediaAsset->sort_order,
            'metadata' => $metadata,
        ]);

        $this->activityLogService->log(
            $request->user(),
            $mediaAsset,
            'media_asset.updated',
            'Media asset metadata updated.',
        );

        return response()->json([
            'data' => $this->presentAsset($mediaAsset->fresh('uploader:id,name,email')),
        ]);
    }

    public function destroy(Request $request, MediaAsset $mediaAsset): JsonResponse
    {
        $mediaAsset->delete();

        $this->activityLogService->log(
            $request->user(),
            $mediaAsset,
            'media_asset.deleted',
            'Media asset moved to trash.',
        );

        return response()->json([
            'message' => 'Media berhasil dipindahkan ke arsip.',
        ]);
    }

    private function mediaTypeFromMime(string $mimeType): MediaType
    {
        return match (true) {
            str_starts_with($mimeType, 'image/') => MediaType::Image,
            str_starts_with($mimeType, 'video/') => MediaType::Video,
            default => MediaType::Document,
        };
    }

    private function presentAsset(MediaAsset $asset): array
    {
        return [
            'id' => $asset->id,
            'type' => $asset->media_type?->value,
            'url' => $asset->path ? Storage::disk($asset->disk)->url($asset->path) : $asset->external_url,
            'originalName' => $asset->original_name,
            'altText' => $asset->alt_text,
            'mimeType' => $asset->mime_type,
            'sizeBytes' => $asset->size_bytes,
            'visibility' => $asset->visibility?->value,
            'sortOrder' => $asset->sort_order,
            'crop' => $asset->metadata['crop'] ?? null,
            'uploadedBy' => $asset->uploader ? [
                'id' => $asset->uploader->id,
                'name' => $asset->uploader->name,
            ] : null,
            'createdAt' => optional($asset->created_at)->toIso8601String(),
        ];
    }
}
