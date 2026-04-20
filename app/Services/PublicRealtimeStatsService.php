<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\PublicSiteVisitor;
use Illuminate\Support\Facades\DB;

class PublicRealtimeStatsService
{
    private const ACTIVE_TTL_MINUTES = 5;

    public function trackVisitor(string $visitorTokenHash): void
    {
        $this->recordVisit($visitorTokenHash);
    }

    public function recordVisit(
        string $visitorTokenHash,
        ?string $path = null,
        ?string $routeName = null,
    ): PublicSiteVisitor {
        $now = now();
        $request = request();

        return DB::transaction(function () use ($visitorTokenHash, $path, $routeName, $now, $request): PublicSiteVisitor {
            $visitor = PublicSiteVisitor::query()
                ->where('visitor_token_hash', $visitorTokenHash)
                ->lockForUpdate()
                ->first();

            if (! $visitor instanceof PublicSiteVisitor) {
                $visitor = new PublicSiteVisitor([
                    'visitor_token_hash' => $visitorTokenHash,
                    'first_seen_at' => $now,
                    'page_views' => 0,
                ]);
            }

            $visitor->fill([
                'last_seen_at' => $now,
                'last_path' => $path,
                'last_route_name' => $routeName,
                'ip_address' => $request?->ip(),
                'user_agent' => $request?->userAgent(),
            ]);

            $visitor->page_views = ((int) $visitor->page_views) + 1;
            $visitor->save();

            return $visitor;
        });
    }

    public function discardVisit(PublicSiteVisitor $visitor): void
    {
        DB::transaction(function () use ($visitor): void {
            $freshVisitor = PublicSiteVisitor::query()
                ->whereKey($visitor->getKey())
                ->lockForUpdate()
                ->first();

            if (! $freshVisitor instanceof PublicSiteVisitor) {
                return;
            }

            if ($freshVisitor->page_views <= 1) {
                $freshVisitor->delete();

                return;
            }

            $freshVisitor->page_views -= 1;
            $freshVisitor->save();
        });
    }

    /**
     * @return array{liveOnline: int, totalVisits: int, todayVisits: int, totalVisitors: int, todayVisitors: int, pageViews: int, todayPageViews: int, windowMinutes: int, lastUpdatedAt: string}
     */
    public function summary(): array
    {
        $activeSince = now()->subMinutes(self::ACTIVE_TTL_MINUTES);
        $today = now()->startOfDay();
        $totalVisitors = PublicSiteVisitor::query()->count();
        $todayVisitors = PublicSiteVisitor::query()
            ->where('last_seen_at', '>=', $today)
            ->count();

        return [
            'liveOnline' => PublicSiteVisitor::query()
                ->where('last_seen_at', '>=', $activeSince)
                ->count(),
            'totalVisits' => $totalVisitors,
            'todayVisits' => $todayVisitors,
            'totalVisitors' => $totalVisitors,
            'todayVisitors' => $todayVisitors,
            'pageViews' => (int) PublicSiteVisitor::query()->sum('page_views'),
            'todayPageViews' => ActivityLog::query()
                ->where('event', 'public.page.visited')
                ->where('created_at', '>=', $today)
                ->count(),
            'windowMinutes' => self::ACTIVE_TTL_MINUTES,
            'lastUpdatedAt' => now()->toIso8601String(),
        ];
    }
}
