<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\AlumniForumComment;
use App\Models\AlumniForumPost;
use App\Models\AlumniProfile;
use App\Models\Article;
use App\Models\PortfolioItem;
use App\Models\Room;
use App\Models\TimetableEntry;
use App\Models\TracerStudyResponse;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class InternalDashboardController extends Controller
{
    public function admin(): Response
    {
        $studentCount = User::whereHas('roles', function ($query) {
            $query->whereIn('slug', ['siswa', 'jurnalis_siswa']);
        })->count();

        $teacherCount = User::whereHas('roles', function ($query) {
            $query->where('slug', 'guru');
        })->count();

        $articleCount = Article::count();
        $roomCount = Room::count() ?? 30;

        $publicAlumniCount = AlumniProfile::query()
            ->where('is_public_profile', true)
            ->count();

        $tracerSubmittedCount = TracerStudyResponse::query()->count();
        $tracerDisplayableCount = TracerStudyResponse::query()
            ->where('is_publicly_displayable', true)
            ->count();

        $forumPostCount = AlumniForumPost::query()->count();
        $forumCommentCount = AlumniForumComment::query()->count();
        $pendingModerationCount = AlumniForumPost::query()
            ->where('moderation_status', 'pending_review')
            ->count();
        $reportedPostCount = AlumniForumPost::query()
            ->where('reports_count', '>', 0)
            ->count();

        $topCities = TracerStudyResponse::query()
            ->selectRaw('location_city as label, COUNT(*) as aggregate')
            ->where('is_publicly_displayable', true)
            ->whereNotNull('location_city')
            ->groupBy('location_city')
            ->orderByDesc('aggregate')
            ->limit(6)
            ->get()
            ->map(fn ($row) => [
                'unit' => (string) $row->label,
                'count' => (int) $row->aggregate,
            ])
            ->values()
            ->all();

        $topInstitutions = TracerStudyResponse::query()
            ->selectRaw('institution_name as label, COUNT(*) as aggregate')
            ->whereNotNull('institution_name')
            ->groupBy('institution_name')
            ->orderByDesc('aggregate')
            ->limit(6)
            ->get()
            ->map(fn ($row) => [
                'unit' => (string) $row->label,
                'count' => (int) $row->aggregate,
            ])
            ->values()
            ->all();

        $activityMix = TracerStudyResponse::query()
            ->selectRaw('COALESCE(current_activity, "lainnya") as label, COUNT(*) as aggregate')
            ->groupBy('current_activity')
            ->orderByDesc('aggregate')
            ->limit(5)
            ->get()
            ->map(fn ($row, int $index) => [
                'name' => ucfirst((string) $row->label),
                'value' => (int) $row->aggregate,
                'color' => ['#10B981', '#0EA5E9', '#8B5CF6', '#F59E0B', '#F43F5E'][$index % 5],
            ])
            ->values()
            ->all();

        $forumHealth = collect([
            ['name' => 'Approved', 'value' => AlumniForumPost::query()->where('moderation_status', 'approved')->count(), 'color' => '#10B981'],
            ['name' => 'Review', 'value' => $pendingModerationCount, 'color' => '#F59E0B'],
            ['name' => 'Reported', 'value' => $reportedPostCount, 'color' => '#F43F5E'],
            ['name' => 'Komentar', 'value' => $forumCommentCount, 'color' => '#0EA5E9'],
        ])->all();

        $recentForumPosts = AlumniForumPost::query()
            ->orderByDesc('created_at')
            ->limit(6)
            ->get(['id', 'title', 'author_name', 'slug', 'moderation_status', 'likes_count', 'comments_count', 'reports_count', 'created_at'])
            ->map(fn (AlumniForumPost $post) => [
                'id' => $post->id,
                'title' => $post->title,
                'authorName' => $post->author_name,
                'url' => $post->slug ? route('alumni.story.show', $post->slug, absolute: false) : null,
                'moderationStatus' => $post->moderation_status,
                'likesCount' => $post->likes_count,
                'commentsCount' => $post->comments_count,
                'reportsCount' => $post->reports_count,
                'createdAt' => optional($post->created_at)?->toIso8601String(),
            ])
            ->values()
            ->all();

        $recentActivity = ActivityLog::query()
            ->where('event', 'like', 'alumni_forum.%')
            ->latest('created_at')
            ->limit(6)
            ->get()
            ->map(fn (ActivityLog $log) => [
                'id' => $log->id,
                'title' => str_replace('alumni_forum.', '', $log->event),
                'description' => $log->description ?? 'Aktivitas forum alumni tercatat.',
                'time' => optional($log->created_at)?->diffForHumans(),
            ])
            ->values()
            ->all();

        return Inertia::render('internal/admin-dashboard', [
            'stats' => [
                'studentCount' => $studentCount,
                'teacherCount' => $teacherCount,
                'articleCount' => $articleCount,
                'roomCount' => $roomCount,
                'publicAlumniCount' => $publicAlumniCount,
                'tracerSubmittedCount' => $tracerSubmittedCount,
                'tracerDisplayableCount' => $tracerDisplayableCount,
                'forumPostCount' => $forumPostCount,
                'forumCommentCount' => $forumCommentCount,
                'pendingModerationCount' => $pendingModerationCount,
                'reportedPostCount' => $reportedPostCount,
            ],
            'tracer' => [
                'topCities' => $topCities,
                'topInstitutions' => $topInstitutions,
                'activityMix' => $activityMix,
                'forumHealth' => $forumHealth,
                'recentForumPosts' => $recentForumPosts,
                'recentActivity' => $recentActivity,
            ],
        ]);
    }

    public function guru(): Response
    {
        $user = Auth::user();

        // Approximate counts for Guru dashboard
        $kelasDiampu = TimetableEntry::query()
            ->whereHas('employee', fn ($q) => $q->where('user_id', $user?->id))
            ->distinct('teaching_group_id')
            ->count('teaching_group_id');

        $jadwalHariIni = TimetableEntry::query()
            ->whereHas('employee', fn ($q) => $q->where('user_id', $user?->id))
            ->where('day_of_week', now()->dayOfWeekIso)
            ->count();

        $portfolioReview = PortfolioItem::query()
            ->where('status', 'submitted')
            ->count(); // in reality, filtered by guru's subjects or classes

        return Inertia::render('internal/guru-dashboard', [
            'stats' => [
                'kelasDiampu' => $kelasDiampu,
                'jadwalHariIni' => $jadwalHariIni,
                'portfolioReview' => $portfolioReview,
            ],
            'upcomingClasses' => [], // placeholder for actual schedule
            'pendingReviews' => [], // placeholder for requested reviews
        ]);
    }

    public function siswa(): Response
    {
        $user = Auth::user();

        $jadwalHariIni = 0; // Requires linking User -> StudentProfile -> StudentEnrollment -> TeachingGroup

        $karyaSaya = PortfolioItem::query()
            ->where('creator_user_id', $user?->id)
            ->count();

        $pengumuman = Article::query()
            ->whereHas('category', fn ($q) => $q->where('slug', 'pengumuman'))
            ->where('status', 'published')
            ->count();

        return Inertia::render('internal/siswa-dashboard', [
            'stats' => [
                'jadwalHariIni' => $jadwalHariIni,
                'karyaSaya' => $karyaSaya,
                'pengumuman' => $pengumuman,
            ],
        ]);
    }

    public function wali(): Response
    {
        $user = Auth::user();

        // Typical Wali checks guardian -> students
        $profilAnak = 0; // Number of linked children profiles
        $jadwalAnak = 0; // Scheduled classes for the day

        $pengumuman = Article::query()
            ->whereHas('category', fn ($q) => $q->where('slug', 'pengumuman'))
            ->where('status', 'published')
            ->count();

        return Inertia::render('internal/wali-dashboard', [
            'stats' => [
                'profilAnak' => $profilAnak,
                'jadwalAnak' => $jadwalAnak,
                'pengumuman' => $pengumuman,
            ],
        ]);
    }
}
