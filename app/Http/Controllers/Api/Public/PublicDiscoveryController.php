<?php

namespace App\Http\Controllers\Api\Public;

use App\Enums\OrganizationAssignmentStatus;
use App\Enums\OrganizationScope;
use App\Http\Controllers\Controller;
use App\Models\OrganizationAssignment;
use App\Services\AddressGeocodingService;
use App\Services\ExtracurricularVideoFeedService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Throwable;

class PublicDiscoveryController extends Controller
{
    public function geocode(Request $request, AddressGeocodingService $geocodingService): JsonResponse
    {
        $validated = $request->validate([
            'q' => ['required', 'string', 'min:5', 'max:255'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:5'],
        ]);

        try {
            $results = $geocodingService->search(
                $validated['q'],
                $validated['limit'] ?? 5,
            );
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'message' => 'Layanan geocoding belum dapat diakses. Coba lagi beberapa saat.',
            ], 503);
        }

        return response()->json([
            'data' => [
                'query' => $validated['q'],
                'results' => $results,
            ],
        ]);
    }

    public function organizationArchive(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'scope' => ['nullable', 'string', Rule::in([
                OrganizationScope::SchoolManagement->value,
                OrganizationScope::StudentOrganization->value,
            ])],
            'limit' => ['nullable', 'integer', 'min:1', 'max:24'],
        ]);

        $archive = OrganizationAssignment::query()
            ->with(['organizationUnit', 'organizationPosition'])
            ->where(function ($query): void {
                $query
                    ->where('is_current', false)
                    ->orWhereIn('status', [
                        OrganizationAssignmentStatus::Completed->value,
                        OrganizationAssignmentStatus::Archived->value,
                    ]);
            })
            ->when(
                $validated['scope'] ?? null,
                fn ($query, string $scope) => $query->whereHas(
                    'organizationUnit',
                    fn ($unitQuery) => $unitQuery->where('scope', $scope),
                ),
            )
            ->orderByDesc('ends_at')
            ->orderByDesc('starts_at')
            ->limit($validated['limit'] ?? 12)
            ->get()
            ->map(fn (OrganizationAssignment $assignment): array => [
                'id' => $assignment->id,
                'scope' => $assignment->organizationUnit?->scope?->value ?? OrganizationScope::SchoolManagement->value,
                'unit' => $assignment->organizationUnit?->name,
                'unitSlug' => $assignment->organizationUnit?->slug,
                'position' => $assignment->organizationPosition?->title,
                'positionSlug' => $assignment->organizationPosition?->slug,
                'name' => $assignment->full_name_snapshot,
                'biography' => $assignment->biography,
                'status' => $assignment->status?->value,
                'startsAt' => optional($assignment->starts_at)?->toIso8601String(),
                'endsAt' => optional($assignment->ends_at)?->toIso8601String(),
                'periodLabel' => $this->buildPeriodLabel($assignment),
            ])
            ->values()
            ->all();

        return response()->json([
            'data' => $archive,
        ]);
    }

    public function extracurricularVideos(
        Request $request,
        ExtracurricularVideoFeedService $videoFeedService,
    ): JsonResponse {
        $validated = $request->validate([
            'category' => ['nullable', 'string', 'max:50'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:12'],
        ]);

        $items = collect($videoFeedService->getPublicFeed($validated['limit'] ?? 8))
            ->when(
                $validated['category'] ?? null,
                fn ($collection, string $category) => $collection->filter(
                    fn (array $item): bool => Str::lower((string) ($item['category'] ?? '')) === Str::lower($category),
                ),
            )
            ->values()
            ->all();

        return response()->json([
            'data' => $items,
        ]);
    }

    protected function buildPeriodLabel(OrganizationAssignment $assignment): string
    {
        $startYear = $assignment->starts_at?->format('Y');
        $endYear = $assignment->ends_at?->format('Y');

        return match (true) {
            $startYear !== null && $endYear !== null => $startYear.' - '.$endYear,
            $startYear !== null => 'Mulai '.$startYear,
            $endYear !== null => 'Selesai '.$endYear,
            default => 'Periode tidak dipublikasikan',
        };
    }
}
