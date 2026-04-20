<?php

namespace App\Http\Controllers\Api\Internal\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Models\SiteSettingRevision;
use App\Services\ActivityLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SiteSettingRevisionController extends Controller
{
    public function __construct(
        protected ActivityLogService $activityLogService,
    ) {}

    public function index(): JsonResponse
    {
        $siteSetting = SiteSetting::query()->firstOrNew([
            'key' => SiteSetting::PUBLIC_PORTAL_KEY,
        ]);

        $this->authorize('view', $siteSetting);

        if (! $siteSetting->exists) {
            return response()->json(['data' => []]);
        }

        $revisions = SiteSettingRevision::query()
            ->with('user:id,name,email')
            ->whereBelongsTo($siteSetting)
            ->latest('version')
            ->limit(20)
            ->get()
            ->map(fn (SiteSettingRevision $revision): array => $this->presentRevision($revision))
            ->values();

        return response()->json([
            'data' => $revisions,
        ]);
    }

    public function restore(Request $request, SiteSettingRevision $revision): JsonResponse
    {
        $siteSetting = $revision->siteSetting;

        abort_unless($siteSetting?->key === SiteSetting::PUBLIC_PORTAL_KEY, 404);

        $this->authorize('update', $siteSetting);

        $siteSetting->update([
            'value' => $revision->value,
        ]);

        $restoredRevision = SiteSettingRevision::query()->create([
            'site_setting_id' => $siteSetting->id,
            'user_id' => $request->user()?->getKey(),
            'version' => $this->nextVersion($siteSetting),
            'value' => $revision->value,
            'notes' => 'Rollback dari versi '.$revision->version,
        ]);

        $this->activityLogService->log(
            $request->user(),
            $siteSetting,
            'site.public_portal.rollback',
            'Public portal settings restored from revision.',
            [
                'from_version' => $revision->version,
                'new_version' => $restoredRevision->version,
            ],
        );

        return response()->json([
            'data' => [
                'setting' => $siteSetting->value,
                'revision' => $this->presentRevision($restoredRevision->load('user:id,name,email')),
            ],
        ]);
    }

    private function nextVersion(SiteSetting $siteSetting): int
    {
        return ((int) SiteSettingRevision::query()
            ->whereBelongsTo($siteSetting)
            ->max('version')) + 1;
    }

    private function presentRevision(SiteSettingRevision $revision): array
    {
        $heroSlides = collect($revision->value['hero']['slides'] ?? []);
        $navigationItems = collect($revision->value['navigation']['items'] ?? []);

        return [
            'id' => $revision->id,
            'version' => $revision->version,
            'notes' => $revision->notes,
            'heroTitle' => $heroSlides->first()['title'] ?? null,
            'heroSlidesCount' => $heroSlides->count(),
            'visibleNavigationCount' => $navigationItems
                ->filter(fn (array $item): bool => (bool) ($item['visible'] ?? false))
                ->count(),
            'createdBy' => $revision->user ? [
                'id' => $revision->user->id,
                'name' => $revision->user->name,
            ] : null,
            'createdAt' => optional($revision->created_at)->toIso8601String(),
        ];
    }
}
