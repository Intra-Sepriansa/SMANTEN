<?php

namespace App\Services;

use App\Models\SiteSetting;
use Illuminate\Support\Facades\Schema;
use RuntimeException;

class PublicPortalSettingsService
{
    private ?bool $siteSettingsTableExists = null;

    public function hasStorage(): bool
    {
        return $this->siteSettingsTableExists ??= Schema::hasTable(
            (new SiteSetting)->getTable(),
        );
    }

    public function publicPortal(): ?array
    {
        if (! $this->hasStorage()) {
            return null;
        }

        return SiteSetting::query()
            ->where('key', SiteSetting::PUBLIC_PORTAL_KEY)
            ->value('value');
    }

    public function updatePublicPortal(array $value): SiteSetting
    {
        if (! $this->hasStorage()) {
            throw new RuntimeException(
                'The site settings table is not available. Run migrations first.',
            );
        }

        return SiteSetting::query()->updateOrCreate(
            ['key' => SiteSetting::PUBLIC_PORTAL_KEY],
            ['value' => $value],
        );
    }
}
