<?php

namespace App\Http\Controllers\Api\Internal\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\UpdatePublicPortalSettingRequest;
use App\Models\SiteSetting;
use App\Models\SiteSettingRevision;
use App\Services\ActivityLogService;
use App\Services\PublicPortalSettingsService;
use Illuminate\Http\JsonResponse;

class PublicPortalSettingController extends Controller
{
    public function __construct(
        protected ActivityLogService $activityLogService,
    ) {}

    public function update(
        UpdatePublicPortalSettingRequest $request,
        PublicPortalSettingsService $settingsService,
    ): JsonResponse {
        if (! $settingsService->hasStorage()) {
            return response()->json([
                'message' => 'Tabel site_settings belum tersedia. Jalankan php artisan migrate terlebih dahulu.',
            ], 503);
        }

        $siteSetting = SiteSetting::query()->firstOrNew([
            'key' => SiteSetting::PUBLIC_PORTAL_KEY,
        ]);

        $this->authorize('update', $siteSetting);

        $siteSetting = $settingsService->updatePublicPortal($request->validated());
        $revision = SiteSettingRevision::query()->create([
            'site_setting_id' => $siteSetting->id,
            'user_id' => $request->user()?->getKey(),
            'version' => ((int) SiteSettingRevision::query()
                ->whereBelongsTo($siteSetting)
                ->max('version')) + 1,
            'value' => $siteSetting->value,
            'notes' => 'Update dari panel website',
        ]);

        $this->activityLogService->log(
            $request->user(),
            $siteSetting,
            'site.public_portal.updated',
            'Public portal settings updated.',
            ['revision_version' => $revision->version],
        );

        return response()->json([
            'data' => $siteSetting->value,
            'revision' => [
                'id' => $revision->id,
                'version' => $revision->version,
            ],
        ]);
    }
}
