<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Services\PublicGlobalSearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GlobalSearchController extends Controller
{
    public function __invoke(Request $request, PublicGlobalSearchService $searchService): JsonResponse
    {
        $validated = $request->validate([
            'query' => ['nullable', 'string', 'max:120'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:30'],
        ]);

        $query = (string) ($validated['query'] ?? '');
        $limit = (int) ($validated['limit'] ?? 18);

        return response()->json([
            'data' => $searchService->search($query, $request->user(), $limit),
            'meta' => [
                'query' => $query,
                'limit' => $limit,
            ],
        ]);
    }
}
