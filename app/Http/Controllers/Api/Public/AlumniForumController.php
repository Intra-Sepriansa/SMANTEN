<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\AlumniForumComment;
use App\Models\AlumniForumPost;
use App\Models\AlumniForumReaction;
use App\Services\AddressGeocodingService;
use App\Services\AlumniForumPostPresenter;
use App\Services\AlumniForumVisitorService;
use App\Services\AlumniProfileSyncService;
use App\Services\PublicContentModerationService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class AlumniForumController extends Controller
{
    public function index(
        Request $request,
        AlumniForumPostPresenter $presenter,
        AlumniForumVisitorService $visitorService,
    ): JsonResponse {
        $validated = $request->validate([
            'category' => ['nullable', 'string', Rule::in(['cerita', 'karir', 'kampus', 'inspirasi'])],
            'search' => ['nullable', 'string', 'max:255'],
            'sort' => ['nullable', 'string', Rule::in(['terbaru', 'populer'])],
            'graduation_year' => ['nullable', 'integer', 'min:1990', 'max:'.(date('Y') + 1)],
            'city' => ['nullable', 'string', 'max:100'],
            'institution' => ['nullable', 'string', 'max:150'],
            'occupation' => ['nullable', 'string', 'max:150'],
        ]);

        $query = AlumniForumPost::query()
            ->with([
                'alumniProfile.forumPosts',
                'comments' => fn ($query) => $query
                    ->where('moderation_status', 'approved')
                    ->latest()
                    ->limit(3),
                'reactions',
            ])
            ->where('moderation_status', 'approved')
            ->where('is_approved', true)
            ->orderByDesc('is_featured')
            ->orderByDesc('created_at');

        if ($category = $validated['category'] ?? null) {
            $query->where('category', $category);
        }

        if ($search = $validated['search'] ?? null) {
            $query->where(function (Builder $builder) use ($search): void {
                $builder->where('title', 'like', "%{$search}%")
                    ->orWhere('author_name', 'like', "%{$search}%")
                    ->orWhere('body', 'like', "%{$search}%")
                    ->orWhere('institution_name', 'like', "%{$search}%")
                    ->orWhere('occupation_title', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('province', 'like', "%{$search}%");
            });
        }

        if ($graduationYear = $validated['graduation_year'] ?? null) {
            $query->where('graduation_year', $graduationYear);
        }

        if ($city = $validated['city'] ?? null) {
            $query->where('city', 'like', "%{$city}%");
        }

        if ($institution = $validated['institution'] ?? null) {
            $query->where('institution_name', 'like', "%{$institution}%");
        }

        if ($occupation = $validated['occupation'] ?? null) {
            $query->where('occupation_title', 'like', "%{$occupation}%");
        }

        if (($validated['sort'] ?? 'terbaru') === 'populer') {
            $query->reorder()
                ->orderByDesc(DB::raw('(likes_count + comments_count + bookmarks_count + share_count)'))
                ->orderByDesc('created_at');
        }

        $visitorTokenHash = $visitorService->hashToken(
            $visitorService->resolveClientToken($request),
        );

        $posts = $query->paginate(15)->through(
            fn (AlumniForumPost $post): array => $presenter->present($post, $visitorTokenHash),
        );

        return response()->json($posts);
    }

    public function store(
        Request $request,
        AlumniForumPostPresenter $presenter,
        AddressGeocodingService $geocodingService,
        PublicContentModerationService $moderationService,
        AlumniProfileSyncService $profileSyncService,
        AlumniForumVisitorService $visitorService,
    ): JsonResponse {
        $validated = $request->validate([
            'author_name' => ['required', 'string', 'max:100'],
            'website' => ['nullable', 'string', 'max:0'],
            'graduation_year' => ['required', 'integer', 'min:1990', 'max:'.(date('Y') + 1)],
            'category' => ['required', 'string', Rule::in(['cerita', 'karir', 'kampus', 'inspirasi'])],
            'title' => ['required', 'string', 'max:200'],
            'body' => ['required', 'string', 'min:48', 'max:5000'],
            'institution_name' => ['nullable', 'string', 'max:150'],
            'occupation_title' => ['nullable', 'string', 'max:150'],
            'city' => ['nullable', 'string', 'max:100'],
            'province' => ['nullable', 'string', 'max:100'],
            'contact_email' => ['nullable', 'email', 'max:100'],
            'location_query' => ['nullable', 'string', 'max:255'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'is_open_to_mentor' => ['nullable', 'boolean'],
            'has_hiring_info' => ['nullable', 'boolean'],
        ]);

        $moderation = $moderationService->evaluateForumPost($validated);
        $location = $this->resolveLocation($validated, $geocodingService);

        $post = DB::transaction(function () use (
            $validated,
            $moderation,
            $location,
            $request,
            $profileSyncService,
        ) {
            $post = AlumniForumPost::query()->create([
                'author_name' => $validated['author_name'],
                'graduation_year' => $validated['graduation_year'],
                'category' => $validated['category'],
                'title' => $validated['title'],
                'body' => $validated['body'],
                'institution_name' => $validated['institution_name'] ?? null,
                'occupation_title' => $validated['occupation_title'] ?? null,
                'city' => $validated['city'] ?? null,
                'province' => $validated['province'] ?? null,
                'location_latitude' => $location['latitude'] ?? null,
                'location_longitude' => $location['longitude'] ?? null,
                'contact_email' => $validated['contact_email'] ?? null,
                'is_approved' => $moderation['status'] === 'approved',
                'is_featured' => false,
                'moderation_status' => $moderation['status'],
                'moderation_notes' => $moderation['notes'],
                'spam_score' => $moderation['score'],
                'is_open_to_mentor' => (bool) ($validated['is_open_to_mentor'] ?? false),
                'has_hiring_info' => (bool) ($validated['has_hiring_info'] ?? false),
                'approved_at' => $moderation['status'] === 'approved' ? now() : null,
                'last_interaction_at' => now(),
                'metadata' => [
                    'ip' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'location_query' => $validated['location_query'] ?? null,
                    'location' => $location,
                    'moderation_reasons' => $moderation['reasons'],
                ],
            ]);

            $profile = $profileSyncService->syncFromForumPost($post);

            ActivityLog::query()->create([
                'subject_type' => $post->getMorphClass(),
                'subject_id' => $post->id,
                'event' => 'alumni_forum.post_submitted',
                'description' => sprintf(
                    'Cerita alumni "%s" dikirim oleh %s dan berstatus %s.',
                    $post->title,
                    $post->author_name,
                    $post->moderation_status
                ),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'properties' => [
                    'alumni_profile_id' => $profile->id,
                    'moderation_status' => $post->moderation_status,
                    'spam_score' => $post->spam_score,
                ],
                'created_at' => now(),
            ]);

            return $post->fresh([
                'alumniProfile.forumPosts',
                'comments',
                'reactions',
            ]);
        });

        $visitorToken = $visitorService->resolveClientToken($request);
        $message = $post->moderation_status === 'approved'
            ? 'Cerita Anda berhasil dipublikasikan!'
            : 'Cerita Anda sudah diterima dan sedang menunggu moderasi.';

        return response()->json([
            'message' => $message,
            'visitorToken' => $visitorToken,
            'post' => $presenter->present(
                $post,
                $visitorService->hashToken($visitorToken),
            ),
        ], 201);
    }

    public function storeComment(
        Request $request,
        AlumniForumPost $post,
        AlumniForumPostPresenter $presenter,
        PublicContentModerationService $moderationService,
        AlumniForumVisitorService $visitorService,
    ): JsonResponse {
        abort_unless($post->moderation_status === 'approved', 404);

        $validated = $request->validate([
            'author_name' => ['required', 'string', 'max:100'],
            'website' => ['nullable', 'string', 'max:0'],
            'contact_email' => ['nullable', 'email', 'max:100'],
            'body' => ['required', 'string', 'min:8', 'max:1200'],
        ]);

        $moderation = $moderationService->evaluateForumComment($validated);

        $comment = DB::transaction(function () use ($validated, $moderation, $request, $post) {
            $comment = AlumniForumComment::query()->create([
                'alumni_forum_post_id' => $post->id,
                'author_name' => $validated['author_name'],
                'contact_email' => $validated['contact_email'] ?? null,
                'body' => $validated['body'],
                'moderation_status' => $moderation['status'],
                'spam_score' => $moderation['score'],
                'metadata' => [
                    'ip' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'moderation_reasons' => $moderation['reasons'],
                ],
            ]);

            if ($moderation['status'] === 'approved') {
                $post->increment('comments_count');
            }

            $post->forceFill(['last_interaction_at' => now()])->saveQuietly();

            ActivityLog::query()->create([
                'subject_type' => $comment->getMorphClass(),
                'subject_id' => $comment->id,
                'event' => 'alumni_forum.comment_submitted',
                'description' => sprintf(
                    'Komentar baru untuk cerita "%s" oleh %s.',
                    $post->title,
                    $validated['author_name']
                ),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'properties' => [
                    'post_id' => $post->id,
                    'moderation_status' => $comment->moderation_status,
                ],
                'created_at' => now(),
            ]);

            return $comment;
        });

        $post->load([
            'alumniProfile.forumPosts',
            'comments' => fn ($query) => $query
                ->where('moderation_status', 'approved')
                ->latest()
                ->limit(3),
            'reactions',
        ]);

        $visitorToken = $visitorService->resolveClientToken($request);

        return response()->json([
            'message' => $comment->moderation_status === 'approved'
                ? 'Komentar Anda sudah tampil di forum.'
                : 'Komentar Anda diterima dan sedang ditinjau moderator.',
            'visitorToken' => $visitorToken,
            'post' => $presenter->present(
                $post,
                $visitorService->hashToken($visitorToken),
            ),
        ], 201);
    }

    public function react(
        Request $request,
        AlumniForumPost $post,
        AlumniForumPostPresenter $presenter,
        AlumniForumVisitorService $visitorService,
    ): JsonResponse {
        abort_unless($post->moderation_status === 'approved', 404);

        $validated = $request->validate([
            'reaction_type' => ['required', 'string', Rule::in(['like', 'bookmark', 'share', 'report'])],
            'reason' => ['nullable', 'string', 'max:280'],
        ]);

        $visitorToken = $visitorService->resolveClientToken($request);
        $visitorHash = $visitorService->hashToken($visitorToken);
        $reactionType = $validated['reaction_type'];

        $active = DB::transaction(function () use ($post, $reactionType, $visitorHash, $request, $validated) {
            $existing = AlumniForumReaction::query()
                ->where('alumni_forum_post_id', $post->id)
                ->where('reaction_type', $reactionType)
                ->where('visitor_token_hash', $visitorHash)
                ->first();

            if (in_array($reactionType, ['like', 'bookmark'], true)) {
                if ($existing) {
                    $existing->delete();
                    $this->decrementReactionCounter($post, $reactionType);

                    return false;
                }

                AlumniForumReaction::query()->create([
                    'alumni_forum_post_id' => $post->id,
                    'reaction_type' => $reactionType,
                    'visitor_token_hash' => $visitorHash,
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ]);

                $this->incrementReactionCounter($post, $reactionType);

                return true;
            }

            if (! $existing) {
                AlumniForumReaction::query()->create([
                    'alumni_forum_post_id' => $post->id,
                    'reaction_type' => $reactionType,
                    'visitor_token_hash' => $visitorHash,
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'metadata' => [
                        'reason' => $validated['reason'] ?? null,
                    ],
                ]);

                $this->incrementReactionCounter($post, $reactionType);
            }

            if ($reactionType === 'report' && $post->fresh()->reports_count >= 3) {
                $post->forceFill([
                    'moderation_status' => 'pending_review',
                    'moderation_notes' => trim(
                        implode(' ', array_filter([
                            $post->moderation_notes,
                            'Konten otomatis dipindahkan ke antrian moderasi karena menerima laporan komunitas.',
                        ]))
                    ),
                    'is_approved' => false,
                ])->saveQuietly();
            }

            return true;
        });

        $post->load([
            'alumniProfile.forumPosts',
            'comments' => fn ($query) => $query
                ->where('moderation_status', 'approved')
                ->latest()
                ->limit(3),
            'reactions',
        ]);

        ActivityLog::query()->create([
            'subject_type' => $post->getMorphClass(),
            'subject_id' => $post->id,
            'event' => 'alumni_forum.reaction',
            'description' => sprintf('Interaksi %s pada cerita "%s".', $reactionType, $post->title),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'properties' => [
                'reaction_type' => $reactionType,
                'active' => $active,
            ],
            'created_at' => now(),
        ]);

        return response()->json([
            'message' => $this->reactionMessage($reactionType, $active),
            'visitorToken' => $visitorToken,
            'active' => $active,
            'post' => $presenter->present($post, $visitorHash),
        ]);
    }

    /**
     * @param  array<string, mixed>  $payload
     * @return array{latitude: float, longitude: float}|null
     */
    protected function resolveLocation(array $payload, AddressGeocodingService $geocodingService): ?array
    {
        if (isset($payload['latitude'], $payload['longitude'])) {
            return [
                'latitude' => (float) $payload['latitude'],
                'longitude' => (float) $payload['longitude'],
            ];
        }

        $query = collect([
            $payload['location_query'] ?? null,
            $payload['city'] ?? null,
            $payload['province'] ?? null,
        ])
            ->filter(fn ($value): bool => filled($value))
            ->implode(', ');

        if ($query === '') {
            return null;
        }

        $result = $geocodingService->search($query, 1, 'Indonesia')[0] ?? null;

        if (! is_array($result)) {
            return null;
        }

        return [
            'latitude' => (float) ($result['latitude'] ?? 0),
            'longitude' => (float) ($result['longitude'] ?? 0),
        ];
    }

    protected function incrementReactionCounter(AlumniForumPost $post, string $reactionType): void
    {
        $column = match ($reactionType) {
            'like' => 'likes_count',
            'bookmark' => 'bookmarks_count',
            'share' => 'share_count',
            'report' => 'reports_count',
        };

        $post->increment($column);
        $post->forceFill(['last_interaction_at' => now()])->saveQuietly();
    }

    protected function decrementReactionCounter(AlumniForumPost $post, string $reactionType): void
    {
        $column = match ($reactionType) {
            'like' => 'likes_count',
            'bookmark' => 'bookmarks_count',
            default => null,
        };

        if ($column === null) {
            return;
        }

        $currentValue = max(0, (int) $post->getAttribute($column) - 1);
        $post->forceFill([
            $column => $currentValue,
            'last_interaction_at' => now(),
        ])->saveQuietly();
    }

    protected function reactionMessage(string $reactionType, bool $active): string
    {
        return match ($reactionType) {
            'like' => $active ? 'Cerita ini masuk ke daftar apresiasi Anda.' : 'Apresiasi Anda sudah dibatalkan.',
            'bookmark' => $active ? 'Cerita disimpan ke daftar bacaan Anda.' : 'Cerita dihapus dari daftar bacaan.',
            'share' => 'Tautan cerita siap dibagikan.',
            'report' => 'Laporan Anda sudah diterima moderator.',
        };
    }
}
