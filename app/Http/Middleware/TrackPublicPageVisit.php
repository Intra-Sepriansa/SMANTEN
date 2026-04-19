<?php

namespace App\Http\Middleware;

use App\Services\ActivityLogService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class TrackPublicPageVisit
{
    private const VISITOR_COOKIE = 'public_site_visitor';

    public function __construct(private ActivityLogService $activityLogService) {}

    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (! $this->shouldTrack($request, $response)) {
            return $response;
        }

        $visitorToken = $request->cookie(self::VISITOR_COOKIE) ?? (string) Str::uuid();

        $this->activityLogService->log(
            user: null,
            subject: null,
            event: 'public.page.visited',
            description: 'Pengunjung membuka halaman publik.',
            properties: [
                'routeName' => $request->route()?->getName(),
                'path' => '/'.ltrim($request->path(), '/'),
                'visitorTokenHash' => hash('sha256', $visitorToken),
            ],
        );

        if (! $request->hasCookie(self::VISITOR_COOKIE)) {
            $response->headers->setCookie(cookie()->forever(self::VISITOR_COOKIE, $visitorToken));
        }

        return $response;
    }

    private function shouldTrack(Request $request, Response $response): bool
    {
        if (! $request->isMethod('GET')) {
            return false;
        }

        if (! $response->isSuccessful()) {
            return false;
        }

        if ($request->route()?->getName() === 'sitemap') {
            return false;
        }

        return ! $request->expectsJson();
    }
}
