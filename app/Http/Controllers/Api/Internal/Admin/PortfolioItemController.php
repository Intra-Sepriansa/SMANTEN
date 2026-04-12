<?php

namespace App\Http\Controllers\Api\Internal\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\ModeratePortfolioItemRequest;
use App\Http\Requests\Api\StorePortfolioItemRequest;
use App\Http\Resources\PortfolioItemResource;
use App\Models\PortfolioItem;
use App\Services\ActivityLogService;
use App\Services\PortfolioModerationService;

class PortfolioItemController extends Controller
{
    public function __construct(
        protected ActivityLogService $activityLogService,
    ) {
    }

    public function index()
    {
        $this->authorize('viewAny', PortfolioItem::class);

        return PortfolioItemResource::collection(
            PortfolioItem::query()->with('portfolioProject')->latest()->paginate(),
        );
    }

    public function store(StorePortfolioItemRequest $request): PortfolioItemResource
    {
        $this->authorize('create', PortfolioItem::class);

        $portfolioItem = PortfolioItem::create([
            ...$request->validated(),
            'creator_user_id' => $request->user()->getKey(),
        ]);

        $this->activityLogService->log($request->user(), $portfolioItem, 'portfolio.item.created', 'Portfolio item created.');

        return new PortfolioItemResource($portfolioItem->load('portfolioProject'));
    }

    public function update(StorePortfolioItemRequest $request, PortfolioItem $portfolioItem): PortfolioItemResource
    {
        $this->authorize('update', $portfolioItem);

        $portfolioItem->update($request->validated());

        $this->activityLogService->log($request->user(), $portfolioItem, 'portfolio.item.updated', 'Portfolio item updated.');

        return new PortfolioItemResource($portfolioItem->load('portfolioProject'));
    }

    public function moderate(ModeratePortfolioItemRequest $request, PortfolioItem $portfolioItem, PortfolioModerationService $moderationService): PortfolioItemResource
    {
        $this->authorize('moderate', $portfolioItem);

        $portfolioItem = match ($request->validated('action')) {
            'approve' => $moderationService->approve($portfolioItem, $request->user()),
            default => $moderationService->publish($portfolioItem, $request->user()),
        };

        return new PortfolioItemResource($portfolioItem->load('portfolioProject'));
    }
}
