<?php

namespace App\Http\Middleware;

use App\Models\PublicSiteVisitor;
use App\Services\ActivityLogService;
use App\Services\PublicRealtimeStatsService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class TrackPublicPageVisit
{
    private const VISITOR_COOKIE = 'public_site_visitor';

    public function __construct(
        private ActivityLogService $activityLogService,
        private PublicRealtimeStatsService $realtimeStatsService,
    ) {}

    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $visitorToken = $request->cookie(self::VISITOR_COOKIE) ?? (string) Str::uuid();
        $visitorTokenHash = hash('sha256', $visitorToken);
        $shouldTrackRequest = $this->shouldTrackRequest($request);
        $visitLog = null;
        $trackedVisitor = null;

        if ($shouldTrackRequest) {
            $trackedVisitor = $this->realtimeStatsService->recordVisit(
                visitorTokenHash: $visitorTokenHash,
                path: '/'.ltrim($request->path(), '/'),
                routeName: $request->route()?->getName(),
            );

            $visitLog = $this->activityLogService->log(
                user: null,
                subject: null,
                event: 'public.page.visited',
                description: 'Pengunjung membuka halaman publik.',
                properties: [
                    'routeName' => $request->route()?->getName(),
                    'path' => '/'.ltrim($request->path(), '/'),
                    'visitorTokenHash' => $visitorTokenHash,
                ],
            );
        }

        try {
            $response = $next($request);
        } catch (Throwable $exception) {
            $visitLog?->delete();
            $this->discardTrackedVisit($trackedVisitor);

            throw $exception;
        }

        if ($shouldTrackRequest && ! $this->shouldTrackResponse($response)) {
            $visitLog?->delete();
            $this->discardTrackedVisit($trackedVisitor);

            return $response;
        }

        if (! $request->hasCookie(self::VISITOR_COOKIE)) {
            $response->headers->setCookie(cookie()->forever(self::VISITOR_COOKIE, $visitorToken));
        }

        return $response;
    }

    private function shouldTrackRequest(Request $request): bool
    {
        if (! $request->isMethod('GET')) {
            return false;
        }

        if ($request->route()?->getName() === 'sitemap') {
            return false;
        }

        return ! $request->expectsJson();
    }

    private function shouldTrackResponse(Response $response): bool
    {
        if (! $response->isSuccessful()) {
            return false;
        }

        return true;
    }

    private function discardTrackedVisit(?PublicSiteVisitor $trackedVisitor): void
    {
        if ($trackedVisitor === null) {
            return;
        }

        $this->realtimeStatsService->discardVisit($trackedVisitor);
    }
}
