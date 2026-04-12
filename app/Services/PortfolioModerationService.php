<?php

namespace App\Services;

use App\Enums\PortfolioItemStatus;
use App\Models\PortfolioItem;
use App\Models\User;

class PortfolioModerationService
{
    public function __construct(
        protected ActivityLogService $activityLogService,
    ) {
    }

    public function approve(PortfolioItem $item, User $actor): PortfolioItem
    {
        $item->forceFill([
            'status' => PortfolioItemStatus::Approved,
            'approved_by_user_id' => $actor->getKey(),
            'approved_at' => now(),
        ])->save();

        $this->activityLogService->log($actor, $item, 'portfolio.approved', 'Portfolio item approved.');

        return $item->fresh();
    }

    public function publish(PortfolioItem $item, User $actor): PortfolioItem
    {
        if ($item->status !== PortfolioItemStatus::Approved) {
            $item = $this->approve($item, $actor);
        }

        $item->forceFill([
            'status' => PortfolioItemStatus::Published,
            'published_at' => now(),
        ])->save();

        $this->activityLogService->log($actor, $item, 'portfolio.published', 'Portfolio item published.');

        return $item->fresh();
    }
}
