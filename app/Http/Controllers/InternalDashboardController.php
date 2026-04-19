<?php

namespace App\Http\Controllers;

use App\Enums\ArticleStatus;
use App\Enums\OrganizationAssignmentStatus;
use App\Enums\PortfolioItemStatus;
use App\Enums\PpdbApplicationStatus;
use App\Enums\PpdbTrackType;
use App\Enums\TimetableVersionStatus;
use App\Enums\UserStatus;
use App\Models\ActivityLog;
use App\Models\AlumniForumComment;
use App\Models\AlumniForumPost;
use App\Models\AlumniProfile;
use App\Models\Article;
use App\Models\OrganizationAssignment;
use App\Models\OrganizationPosition;
use App\Models\OrganizationUnit;
use App\Models\PortfolioItem;
use App\Models\PpdbApplication;
use App\Models\PpdbApplicationDocument;
use App\Models\Room;
use App\Models\TimetableEntry;
use App\Models\TimetableVersion;
use App\Models\TracerStudyResponse;
use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class InternalDashboardController extends Controller
{
    public function admin(Request $request): Response
    {
        $stats = $this->buildAdminStats();
        $visitorFilters = $this->resolvePublicVisitorFilters($request);

        return Inertia::render('internal/admin-dashboard', [
            'stats' => $stats,
            'filters' => [
                'from' => $visitorFilters['fromInput'],
                'until' => $visitorFilters['untilInput'],
            ],
            'publicVisitors' => $this->buildPublicVisitorAnalytics(
                from: $visitorFilters['from'],
                until: $visitorFilters['until'],
            ),
            'focusBoard' => $this->buildFocusBoard($stats),
            'systemPulse' => $this->buildSystemPulse($stats),
            'priorityLanes' => $this->buildPriorityLanes($stats),
            'forumWatchlist' => $this->buildForumWatchlist(),
            'activityFeed' => $this->buildRecentActivity(),
        ]);
    }

    public function adminPpdb(): Response
    {
        $stats = $this->buildAdminStats();

        return Inertia::render('internal/admin-ppdb', [
            'stats' => $stats,
            'ppdbDesk' => $this->buildPpdbDesk(),
            'priorityLanes' => $this->buildPriorityLanes($stats),
        ]);
    }

    public function adminPpdbShow(PpdbApplication $ppdbApplication): Response
    {
        return Inertia::render('internal/admin-ppdb-detail', [
            'application' => $this->mapPpdbApplication(
                $ppdbApplication->loadMissing($this->ppdbApplicationRelations()),
            ),
            'decisionOptions' => $this->ppdbDecisionOptions(),
        ]);
    }

    public function adminOrganization(): Response
    {
        return Inertia::render('internal/admin-organization', [
            'stats' => $this->buildAdminStats(),
            'organizationDesk' => $this->buildOrganizationDesk(),
        ]);
    }

    public function adminArticles(): Response
    {
        return Inertia::render('internal/admin-articles', [
            'stats' => $this->buildAdminStats(),
            'articleDesk' => $this->buildArticleDesk(),
        ]);
    }

    public function adminPortfolio(): Response
    {
        return Inertia::render('internal/admin-portfolio', [
            'stats' => $this->buildAdminStats(),
            'portfolioDesk' => $this->buildPortfolioDesk(),
        ]);
    }

    public function adminTeachers(): Response
    {
        return Inertia::render('internal/admin-teachers', [
            'stats' => $this->buildAdminStats(),
            'teacherDesk' => $this->buildTeacherDesk(),
        ]);
    }

    public function adminSchedule(): Response
    {
        return Inertia::render('internal/admin-schedule', [
            'stats' => $this->buildAdminStats(),
            'scheduleDesk' => $this->buildScheduleDesk(),
        ]);
    }

    public function adminStudents(): Response
    {
        return Inertia::render('internal/admin-students', [
            'stats' => $this->buildAdminStats(),
            'studentDesk' => $this->buildStudentDesk(),
        ]);
    }

    public function adminStudentSchedule(): Response
    {
        return Inertia::render('internal/admin-student-schedule', [
            'stats' => $this->buildAdminStats(),
            'studentDesk' => $this->buildStudentDesk(),
            'scheduleDesk' => $this->buildScheduleDesk(),
        ]);
    }

    public function adminStudentPortfolio(): Response
    {
        return Inertia::render('internal/admin-student-portfolio', [
            'stats' => $this->buildAdminStats(),
            'studentDesk' => $this->buildStudentDesk(),
            'portfolioDesk' => $this->buildPortfolioDesk(),
        ]);
    }

    public function adminWebsite(): Response
    {
        return Inertia::render('internal/admin-website', [
            'stats' => $this->buildAdminStats(),
            'activityFeed' => $this->buildRecentActivity(6),
        ]);
    }

    private function buildForumWatchlist(int $limit = 6): array
    {
        return AlumniForumPost::query()
            ->orderByDesc('reports_count')
            ->orderByDesc('comments_count')
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get([
                'id',
                'title',
                'author_name',
                'slug',
                'moderation_status',
                'likes_count',
                'comments_count',
                'reports_count',
                'created_at',
            ])
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
    }

    private function buildRecentActivity(int $limit = 8): array
    {
        return ActivityLog::query()
            ->with('user:id,name')
            ->latest('created_at')
            ->limit($limit)
            ->get(['id', 'user_id', 'event', 'description', 'created_at'])
            ->map(fn (ActivityLog $log) => [
                'id' => $log->id,
                'title' => (string) Str::of((string) $log->event)
                    ->replace(['.', '_'], ' ')
                    ->headline(),
                'description' => $log->description
                    ?? ($log->user?->name
                        ? "Aktivitas dicatat oleh {$log->user->name}."
                        : 'Aktivitas sistem tercatat.'),
                'time' => $log->created_at?->diffForHumans() ?? 'Baru saja',
            ])
            ->values()
            ->all();
    }

    /**
     * @return array{from: CarbonInterface, until: CarbonInterface, fromInput: string, untilInput: string}
     */
    private function resolvePublicVisitorFilters(Request $request): array
    {
        $defaultFrom = now()->subDays(13)->startOfDay();
        $defaultUntil = now()->endOfDay();

        $fromInput = $request->string('from')->toString();
        $untilInput = $request->string('until')->toString();

        $from = $this->parseDashboardDate($fromInput)?->startOfDay() ?? $defaultFrom;
        $until = $this->parseDashboardDate($untilInput)?->endOfDay() ?? $defaultUntil;

        if ($from->gt($until)) {
            [$from, $until] = [$until->copy()->startOfDay(), $from->copy()->endOfDay()];
        }

        return [
            'from' => $from,
            'until' => $until,
            'fromInput' => $from->toDateString(),
            'untilInput' => $until->toDateString(),
        ];
    }

    private function parseDashboardDate(string $value): ?CarbonInterface
    {
        if ($value === '') {
            return null;
        }

        try {
            return Carbon::createFromFormat('Y-m-d', $value);
        } catch (\Throwable) {
            return null;
        }
    }

    private function buildPublicVisitorAnalytics(
        CarbonInterface $from,
        CarbonInterface $until,
    ): array {
        $logs = ActivityLog::query()
            ->where('event', 'public.page.visited')
            ->whereBetween('created_at', [$from, $until])
            ->orderBy('created_at')
            ->get(['id', 'properties', 'created_at']);

        $dailyVisitors = [];
        $dailyPageViews = [];
        $uniqueVisitors = [];

        foreach ($logs as $log) {
            $date = $log->created_at?->toDateString();
            $visitorTokenHash = data_get($log->properties, 'visitorTokenHash');

            if ($date === null) {
                continue;
            }

            $dailyPageViews[$date] = ($dailyPageViews[$date] ?? 0) + 1;

            if ($visitorTokenHash) {
                $dailyVisitors[$date][$visitorTokenHash] = true;
                $uniqueVisitors[$visitorTokenHash] = true;
            }
        }

        $series = [];
        $cursor = $from->copy()->startOfDay();
        $lastDay = $until->copy()->startOfDay();

        while ($cursor->lte($lastDay)) {
            $date = $cursor->toDateString();

            $series[] = [
                'date' => $date,
                'label' => $cursor->translatedFormat('d M'),
                'visitors' => count($dailyVisitors[$date] ?? []),
                'pageViews' => $dailyPageViews[$date] ?? 0,
            ];

            $cursor = $cursor->addDay();
        }

        return [
            'totalVisitors' => count($uniqueVisitors),
            'totalPageViews' => $logs->count(),
            'series' => $series,
        ];
    }

    private function buildOrganizationDesk(): array
    {
        $recentAssignments = OrganizationAssignment::query()
            ->with([
                'organizationUnit:id,name,scope',
                'organizationPosition:id,organization_unit_id,title',
            ])
            ->latest('starts_at')
            ->latest('id')
            ->limit(8)
            ->get([
                'id',
                'organization_unit_id',
                'organization_position_id',
                'full_name_snapshot',
                'status',
                'is_current',
                'starts_at',
                'ends_at',
            ])
            ->map(fn (OrganizationAssignment $assignment) => [
                'id' => $assignment->id,
                'person' => $assignment->full_name_snapshot,
                'unit' => $assignment->organizationUnit?->name,
                'scope' => $this->humanizeLabel($assignment->organizationUnit?->scope?->value),
                'position' => $assignment->organizationPosition?->title,
                'status' => $assignment->status?->value,
                'statusLabel' => $this->humanizeLabel($assignment->status?->value),
                'isCurrent' => $assignment->is_current,
                'startsAt' => optional($assignment->starts_at)?->toIso8601String(),
                'endsAt' => optional($assignment->ends_at)?->toIso8601String(),
            ])
            ->values()
            ->all();

        $scopeMix = OrganizationUnit::query()
            ->selectRaw('scope, COUNT(*) as aggregate')
            ->where('is_active', true)
            ->groupBy('scope')
            ->orderByDesc('aggregate')
            ->get()
            ->map(fn ($row) => [
                'label' => $this->humanizeLabel($row->scope),
                'count' => (int) $row->aggregate,
            ])
            ->values()
            ->all();

        return [
            'activeUnitCount' => OrganizationUnit::query()->where('is_active', true)->count(),
            'positionCount' => OrganizationPosition::query()->count(),
            'uniquePositionCount' => OrganizationPosition::query()->where('is_unique_holder', true)->count(),
            'recentAssignments' => $recentAssignments,
            'scopeMix' => $scopeMix,
        ];
    }

    private function buildArticleDesk(): array
    {
        $recentArticles = Article::query()
            ->with([
                'category:id,name,slug',
                'author:id,name',
                'reviewer:id,name',
            ])
            ->latest('updated_at')
            ->latest('id')
            ->limit(8)
            ->get([
                'id',
                'article_category_id',
                'author_user_id',
                'reviewer_user_id',
                'title',
                'slug',
                'status',
                'is_featured',
                'published_at',
                'updated_at',
            ])
            ->map(fn (Article $article) => [
                'id' => $article->id,
                'title' => $article->title,
                'slug' => $article->slug,
                'status' => $article->status?->value,
                'statusLabel' => $this->humanizeLabel($article->status?->value),
                'isFeatured' => $article->is_featured,
                'category' => $article->category?->name,
                'author' => $article->author?->name,
                'reviewer' => $article->reviewer?->name,
                'publishedAt' => optional($article->published_at)?->toIso8601String(),
                'updatedAt' => optional($article->updated_at)?->toIso8601String(),
            ])
            ->values()
            ->all();

        $topAuthors = Article::query()
            ->selectRaw('author_user_id, COUNT(*) as aggregate')
            ->whereNotNull('author_user_id')
            ->groupBy('author_user_id')
            ->orderByDesc('aggregate')
            ->limit(5)
            ->with('author:id,name')
            ->get()
            ->map(fn (Article $article) => [
                'author' => $article->author?->name ?? 'Tanpa penulis',
                'count' => (int) $article->aggregate,
            ])
            ->values()
            ->all();

        return [
            'recentArticles' => $recentArticles,
            'featuredCount' => Article::query()
                ->where('status', ArticleStatus::Published)
                ->where('is_featured', true)
                ->count(),
            'topAuthors' => $topAuthors,
        ];
    }

    private function buildPortfolioDesk(): array
    {
        $recentItems = PortfolioItem::query()
            ->with([
                'portfolioProject:id,title,slug',
                'creator:id,name',
                'approver:id,name',
            ])
            ->latest('updated_at')
            ->latest('id')
            ->limit(8)
            ->get([
                'id',
                'portfolio_project_id',
                'creator_user_id',
                'approved_by_user_id',
                'title',
                'slug',
                'status',
                'item_type',
                'is_featured',
                'published_at',
                'updated_at',
            ])
            ->map(fn (PortfolioItem $item) => [
                'id' => $item->id,
                'title' => $item->title,
                'slug' => $item->slug,
                'status' => $item->status?->value,
                'statusLabel' => $this->humanizeLabel($item->status?->value),
                'itemType' => $this->humanizeLabel($item->item_type),
                'isFeatured' => $item->is_featured,
                'project' => $item->portfolioProject?->title,
                'creator' => $item->creator?->name,
                'approver' => $item->approver?->name,
                'publishedAt' => optional($item->published_at)?->toIso8601String(),
                'updatedAt' => optional($item->updated_at)?->toIso8601String(),
            ])
            ->values()
            ->all();

        $topCreators = PortfolioItem::query()
            ->selectRaw('creator_user_id, COUNT(*) as aggregate')
            ->whereNotNull('creator_user_id')
            ->groupBy('creator_user_id')
            ->orderByDesc('aggregate')
            ->limit(5)
            ->with('creator:id,name')
            ->get()
            ->map(fn (PortfolioItem $item) => [
                'creator' => $item->creator?->name ?? 'Tanpa kreator',
                'count' => (int) $item->aggregate,
            ])
            ->values()
            ->all();

        return [
            'recentItems' => $recentItems,
            'featuredCount' => PortfolioItem::query()
                ->where('status', PortfolioItemStatus::Published)
                ->where('is_featured', true)
                ->count(),
            'topCreators' => $topCreators,
        ];
    }

    private function buildTeacherDesk(): array
    {
        $teachers = $this->baseUsersByRoleQuery(['guru'])
            ->withCount(['authoredArticles', 'createdPortfolioItems'])
            ->latest('last_seen_at')
            ->latest('id')
            ->limit(8)
            ->get([
                'id',
                'name',
                'email',
                'status',
                'email_verified_at',
                'two_factor_confirmed_at',
                'last_seen_at',
            ])
            ->map(fn (User $teacher) => [
                'id' => $teacher->id,
                'name' => $teacher->name,
                'email' => $teacher->email,
                'status' => $teacher->status?->value,
                'statusLabel' => $this->humanizeLabel($teacher->status?->value),
                'isVerified' => $teacher->email_verified_at !== null,
                'hasTwoFactor' => $teacher->two_factor_confirmed_at !== null,
                'lastSeenAt' => optional($teacher->last_seen_at)?->toIso8601String(),
                'articleCount' => $teacher->authored_articles_count,
                'portfolioCount' => $teacher->created_portfolio_items_count,
            ])
            ->values()
            ->all();

        return [
            'teachers' => $teachers,
            'verifiedCount' => $this->baseUsersByRoleQuery(['guru'])
                ->whereNotNull('email_verified_at')
                ->count(),
            'twoFactorCount' => $this->baseUsersByRoleQuery(['guru'])
                ->whereNotNull('two_factor_confirmed_at')
                ->count(),
            'recentlySeenCount' => $this->baseUsersByRoleQuery(['guru'])
                ->where('last_seen_at', '>=', now()->subDay())
                ->count(),
        ];
    }

    private function buildScheduleDesk(): array
    {
        $versions = TimetableVersion::query()
            ->with([
                'academicTerm:id,name',
                'publishedBy:id,name',
            ])
            ->withCount('entries')
            ->latest('updated_at')
            ->latest('id')
            ->limit(6)
            ->get([
                'id',
                'academic_term_id',
                'name',
                'status',
                'effective_from',
                'effective_until',
                'published_at',
                'published_by_user_id',
            ])
            ->map(fn (TimetableVersion $version) => [
                'id' => $version->id,
                'name' => $version->name,
                'term' => $version->academicTerm?->name,
                'status' => $version->status?->value,
                'statusLabel' => $this->humanizeLabel($version->status?->value),
                'entriesCount' => $version->entries_count,
                'effectiveFrom' => optional($version->effective_from)?->toDateString(),
                'effectiveUntil' => optional($version->effective_until)?->toDateString(),
                'publishedAt' => optional($version->published_at)?->toIso8601String(),
                'publishedBy' => $version->publishedBy?->name,
            ])
            ->values()
            ->all();

        $rooms = Room::query()
            ->orderByDesc('is_active')
            ->orderBy('code')
            ->limit(8)
            ->get([
                'id',
                'code',
                'name',
                'room_type',
                'capacity',
                'is_schedulable',
                'supports_moving_class',
                'is_active',
            ])
            ->map(fn (Room $room) => [
                'id' => $room->id,
                'code' => $room->code,
                'name' => $room->name,
                'roomType' => $this->humanizeLabel($room->room_type?->value),
                'capacity' => $room->capacity,
                'isSchedulable' => $room->is_schedulable,
                'supportsMovingClass' => $room->supports_moving_class,
                'isActive' => $room->is_active,
            ])
            ->values()
            ->all();

        $recentEntries = TimetableEntry::query()
            ->with([
                'teachingGroup:id,name',
                'timetablePeriod:id,name,day_of_week',
                'room:id,code,name',
                'subject:id,name',
                'employee:id,user_id,full_name',
                'employee.user:id,name',
            ])
            ->latest('id')
            ->limit(8)
            ->get([
                'id',
                'teaching_group_id',
                'timetable_period_id',
                'room_id',
                'subject_id',
                'employee_id',
                'status',
            ])
            ->map(fn (TimetableEntry $entry) => [
                'id' => $entry->id,
                'teachingGroup' => $entry->teachingGroup?->name,
                'period' => $entry->timetablePeriod?->name,
                'dayLabel' => $this->dayOfWeekLabel($entry->timetablePeriod?->day_of_week),
                'room' => $entry->room ? trim("{$entry->room->code} {$entry->room->name}") : null,
                'subject' => $entry->subject?->name,
                'teacher' => $entry->employee?->user?->name ?? $entry->employee?->full_name,
                'status' => $entry->status?->value,
                'statusLabel' => $this->humanizeLabel($entry->status?->value),
            ])
            ->values()
            ->all();

        return [
            'versions' => $versions,
            'rooms' => $rooms,
            'recentEntries' => $recentEntries,
        ];
    }

    private function buildStudentDesk(): array
    {
        $studentRoles = ['siswa', 'jurnalis_siswa'];

        $students = $this->baseUsersByRoleQuery($studentRoles)
            ->withCount(['createdPortfolioItems'])
            ->latest('last_seen_at')
            ->latest('id')
            ->limit(8)
            ->get([
                'id',
                'name',
                'email',
                'status',
                'email_verified_at',
                'last_seen_at',
            ])
            ->map(fn (User $student) => [
                'id' => $student->id,
                'name' => $student->name,
                'email' => $student->email,
                'status' => $student->status?->value,
                'statusLabel' => $this->humanizeLabel($student->status?->value),
                'isVerified' => $student->email_verified_at !== null,
                'lastSeenAt' => optional($student->last_seen_at)?->toIso8601String(),
                'portfolioCount' => $student->created_portfolio_items_count,
            ])
            ->values()
            ->all();

        $portfolioLeaders = $this->baseUsersByRoleQuery($studentRoles)
            ->withCount(['createdPortfolioItems'])
            ->orderByDesc('created_portfolio_items_count')
            ->orderByDesc('last_seen_at')
            ->limit(5)
            ->get(['id', 'name'])
            ->map(fn (User $student) => [
                'id' => $student->id,
                'name' => $student->name,
                'portfolioCount' => $student->created_portfolio_items_count,
            ])
            ->values()
            ->all();

        return [
            'students' => $students,
            'portfolioLeaders' => $portfolioLeaders,
            'recentlySeenCount' => $this->baseUsersByRoleQuery($studentRoles)
                ->where('last_seen_at', '>=', now()->subDay())
                ->count(),
            'verifiedCount' => $this->baseUsersByRoleQuery($studentRoles)
                ->whereNotNull('email_verified_at')
                ->count(),
        ];
    }

    private function baseUsersByRoleQuery(array $roleSlugs): Builder
    {
        return User::query()->whereHas('roles', function (Builder $query) use ($roleSlugs) {
            $query->whereIn('slug', $roleSlugs);
        });
    }

    private function humanizeLabel(string|\BackedEnum|null $value): string
    {
        if ($value instanceof \BackedEnum) {
            $value = (string) $value->value;
        }

        if ($value === null || $value === '') {
            return 'Tidak tersedia';
        }

        return Str::of($value)
            ->replace(['-', '_'], ' ')
            ->headline()
            ->toString();
    }

    private function dayOfWeekLabel(?int $dayOfWeek): string
    {
        return match ($dayOfWeek) {
            1 => 'Senin',
            2 => 'Selasa',
            3 => 'Rabu',
            4 => 'Kamis',
            5 => 'Jumat',
            6 => 'Sabtu',
            7 => 'Minggu',
            default => 'Tidak diketahui',
        };
    }

    private function buildAdminStats(): array
    {
        $now = now();

        $userStatusCounts = User::query()
            ->selectRaw('status, COUNT(*) as aggregate')
            ->groupBy('status')
            ->pluck('aggregate', 'status');

        $articleStatusCounts = Article::query()
            ->selectRaw('status, COUNT(*) as aggregate')
            ->groupBy('status')
            ->pluck('aggregate', 'status');

        $portfolioStatusCounts = PortfolioItem::query()
            ->selectRaw('status, COUNT(*) as aggregate')
            ->groupBy('status')
            ->pluck('aggregate', 'status');

        $ppdbStatusCounts = PpdbApplication::query()
            ->selectRaw('status, COUNT(*) as aggregate')
            ->groupBy('status')
            ->pluck('aggregate', 'status');

        $timetableStatusCounts = TimetableVersion::query()
            ->selectRaw('status, COUNT(*) as aggregate')
            ->groupBy('status')
            ->pluck('aggregate', 'status');

        $organizationStatusCounts = OrganizationAssignment::query()
            ->selectRaw('status, COUNT(*) as aggregate')
            ->groupBy('status')
            ->pluck('aggregate', 'status');

        $forumStatusCounts = AlumniForumPost::query()
            ->selectRaw('moderation_status, COUNT(*) as aggregate')
            ->groupBy('moderation_status')
            ->pluck('aggregate', 'moderation_status');

        $studentCount = User::query()->whereHas('roles', function ($query) {
            $query->whereIn('slug', ['siswa', 'jurnalis_siswa']);
        })->count();

        $teacherCount = User::query()->whereHas('roles', function ($query) {
            $query->where('slug', 'guru');
        })->count();

        $roomCount = Room::query()
            ->where('is_active', true)
            ->count();

        $publicAlumniCount = AlumniProfile::query()
            ->where('is_public_profile', true)
            ->count();

        $tracerSubmittedCount = TracerStudyResponse::query()->count();
        $tracerDisplayableCount = TracerStudyResponse::query()
            ->where('is_publicly_displayable', true)
            ->count();

        $forumPostCount = AlumniForumPost::query()->count();
        $forumCommentCount = AlumniForumComment::query()->count();
        $reportedPostCount = AlumniForumPost::query()
            ->where('reports_count', '>', 0)
            ->count();

        $activeUserCount = (int) ($userStatusCounts[UserStatus::Active->value] ?? 0);
        $pendingUserCount = (int) ($userStatusCounts[UserStatus::Pending->value] ?? 0);
        $suspendedUserCount = (int) ($userStatusCounts[UserStatus::Suspended->value] ?? 0);
        $verifiedUserCount = User::query()->whereNotNull('email_verified_at')->count();
        $twoFactorEnabledCount = User::query()->whereNotNull('two_factor_confirmed_at')->count();
        $recentlySeenUserCount = User::query()
            ->where('last_seen_at', '>=', $now->copy()->subDay())
            ->count();

        $articleCount = Article::query()->count();
        $publishedArticleCount = (int) ($articleStatusCounts[ArticleStatus::Published->value] ?? 0);
        $draftArticleCount = (int) ($articleStatusCounts[ArticleStatus::Draft->value] ?? 0);
        $articleInReviewCount = (int) ($articleStatusCounts[ArticleStatus::InReview->value] ?? 0);

        $portfolioSubmittedCount = (int) ($portfolioStatusCounts[PortfolioItemStatus::Submitted->value] ?? 0);
        $portfolioPublishedCount = (int) ($portfolioStatusCounts[PortfolioItemStatus::Published->value] ?? 0);

        $ppdbSubmittedCount = PpdbApplication::query()->count();
        $ppdbUnderReviewCount = (int) ($ppdbStatusCounts[PpdbApplicationStatus::UnderReview->value] ?? 0);
        $ppdbAcceptedCount = (int) ($ppdbStatusCounts[PpdbApplicationStatus::Accepted->value] ?? 0);

        $publishedTimetableCount = (int) ($timetableStatusCounts[TimetableVersionStatus::Published->value] ?? 0);
        $draftTimetableCount = (int) ($timetableStatusCounts[TimetableVersionStatus::Draft->value] ?? 0);

        $activeOrganizationCount = (int) ($organizationStatusCounts[OrganizationAssignmentStatus::Active->value] ?? 0);
        $currentOrganizationCount = OrganizationAssignment::query()
            ->where('is_current', true)
            ->count();

        $approvedForumPostCount = (int) ($forumStatusCounts['approved'] ?? 0);
        $pendingModerationCount = (int) ($forumStatusCounts['pending_review'] ?? 0);

        return [
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
            'approvedForumPostCount' => $approvedForumPostCount,
            'activeUserCount' => $activeUserCount,
            'pendingUserCount' => $pendingUserCount,
            'suspendedUserCount' => $suspendedUserCount,
            'verifiedUserCount' => $verifiedUserCount,
            'twoFactorEnabledCount' => $twoFactorEnabledCount,
            'recentlySeenUserCount' => $recentlySeenUserCount,
            'publishedArticleCount' => $publishedArticleCount,
            'draftArticleCount' => $draftArticleCount,
            'articleInReviewCount' => $articleInReviewCount,
            'portfolioSubmittedCount' => $portfolioSubmittedCount,
            'portfolioPublishedCount' => $portfolioPublishedCount,
            'ppdbSubmittedCount' => $ppdbSubmittedCount,
            'ppdbUnderReviewCount' => $ppdbUnderReviewCount,
            'ppdbAcceptedCount' => $ppdbAcceptedCount,
            'publishedTimetableCount' => $publishedTimetableCount,
            'draftTimetableCount' => $draftTimetableCount,
            'activeOrganizationCount' => $activeOrganizationCount,
            'currentOrganizationCount' => $currentOrganizationCount,
            'liveContentCount' => $publishedArticleCount + $portfolioPublishedCount,
            'urgentQueueCount' => $pendingModerationCount
                + $articleInReviewCount
                + $portfolioSubmittedCount
                + $ppdbUnderReviewCount
                + $draftTimetableCount,
        ];
    }

    private function buildTracerInsights(array $stats): array
    {
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

        $forumHealth = [
            ['name' => 'Approved', 'value' => $stats['approvedForumPostCount'], 'color' => '#10B981'],
            ['name' => 'Review', 'value' => $stats['pendingModerationCount'], 'color' => '#F59E0B'],
            ['name' => 'Reported', 'value' => $stats['reportedPostCount'], 'color' => '#F43F5E'],
            ['name' => 'Komentar', 'value' => $stats['forumCommentCount'], 'color' => '#0EA5E9'],
        ];

        $recentForumPosts = AlumniForumPost::query()
            ->orderByDesc('reports_count')
            ->orderByDesc('comments_count')
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
            ->with('user:id,name')
            ->latest('created_at')
            ->limit(8)
            ->get(['id', 'user_id', 'event', 'description', 'created_at'])
            ->map(fn (ActivityLog $log) => [
                'id' => $log->id,
                'title' => (string) Str::of((string) $log->event)
                    ->replace(['.', '_'], ' ')
                    ->headline(),
                'description' => $log->description
                    ?? ($log->user?->name
                        ? "Aktivitas dicatat oleh {$log->user->name}."
                        : 'Aktivitas sistem tercatat.'),
                'time' => $log->created_at?->diffForHumans() ?? 'Baru saja',
            ])
            ->values()
            ->all();

        return [
            'topCities' => $topCities,
            'topInstitutions' => $topInstitutions,
            'activityMix' => $activityMix,
            'forumHealth' => $forumHealth,
            'recentForumPosts' => $recentForumPosts,
            'recentActivity' => $recentActivity,
        ];
    }

    private function buildPpdbDesk(): array
    {
        $applications = PpdbApplication::query()
            ->with($this->ppdbApplicationRelations())
            ->latest('submitted_at')
            ->latest('created_at')
            ->limit(36)
            ->get()
            ->map(fn (PpdbApplication $application) => $this->mapPpdbApplication($application))
            ->values()
            ->all();

        return [
            'applications' => $applications,
            'statusOptions' => collect(PpdbApplicationStatus::cases())
                ->map(fn (PpdbApplicationStatus $status) => [
                    'value' => $status->value,
                    'label' => $this->ppdbStatusLabel($status->value),
                ])
                ->values()
                ->all(),
            'trackOptions' => collect(PpdbTrackType::cases())
                ->map(fn (PpdbTrackType $track) => [
                    'value' => $track->value,
                    'label' => $this->ppdbTrackLabel($track->value),
                ])
                ->values()
                ->all(),
            'decisionOptions' => $this->ppdbDecisionOptions(),
        ];
    }

    private function ppdbApplicationRelations(): array
    {
        return [
            'cycle:id,name',
            'verifiedBy:id,name',
            'documents:id,ppdb_application_id,verified_by_user_id,document_type,original_name,path,mime_type,size_bytes,status,verified_at,rejection_reason',
            'documents.verifiedBy:id,name',
            'reviews:id,ppdb_application_id,reviewer_user_id,review_type,status,notes,created_at',
            'reviews.reviewer:id,name',
            'distanceAudits:id,ppdb_application_id,calculated_by_user_id,distance_meters,formula_version,calculated_at,metadata',
        ];
    }

    private function mapPpdbApplication(PpdbApplication $application): array
    {
        $documentStatusCounts = $application->documents
            ->groupBy(fn (PpdbApplicationDocument $document) => $document->status?->value ?? 'pending')
            ->map->count();

        $latestReview = $application->reviews
            ->sortByDesc('created_at')
            ->first();

        $latestDistanceAudit = $application->distanceAudits
            ->sortByDesc('calculated_at')
            ->first();

        return [
            'id' => $application->id,
            'registrationNumber' => $application->registration_number,
            'fullName' => $application->full_name,
            'trackType' => $application->track_type?->value,
            'trackLabel' => $this->ppdbTrackLabel($application->track_type?->value),
            'status' => $application->status?->value,
            'statusLabel' => $this->ppdbStatusLabel($application->status?->value),
            'phone' => $application->phone,
            'email' => $application->email,
            'previousSchoolName' => $application->previous_school_name,
            'address' => implode(', ', array_filter([
                $application->address_line,
                $application->village,
                $application->district,
                $application->city,
                $application->province,
                $application->postal_code,
            ])),
            'submittedAt' => optional($application->submitted_at)?->toIso8601String(),
            'verifiedAt' => optional($application->verified_at)?->toIso8601String(),
            'decidedAt' => optional($application->decided_at)?->toIso8601String(),
            'decisionNotes' => $application->decision_notes,
            'verifiedBy' => $application->verifiedBy?->name,
            'distanceKm' => $application->distance_meters !== null
                ? round(((float) $application->distance_meters) / 1000, 2)
                : null,
            'latestDistanceAudit' => $latestDistanceAudit ? [
                'distanceKm' => round(((float) $latestDistanceAudit->distance_meters) / 1000, 2),
                'formulaVersion' => $latestDistanceAudit->formula_version,
                'calculatedAt' => optional($latestDistanceAudit->calculated_at)?->toIso8601String(),
            ] : null,
            'flags' => [
                'ketm' => $application->ketm_flag,
                'specialCondition' => $application->special_condition_flag,
            ],
            'cycle' => [
                'id' => $application->cycle?->id,
                'name' => $application->cycle?->name,
            ],
            'documentsSummary' => [
                'total' => $application->documents->count(),
                'verified' => (int) ($documentStatusCounts['verified'] ?? 0),
                'pending' => (int) ($documentStatusCounts['pending'] ?? 0),
                'rejected' => (int) ($documentStatusCounts['rejected'] ?? 0),
            ],
            'documents' => $application->documents
                ->map(fn (PpdbApplicationDocument $document) => [
                    'id' => $document->id,
                    'type' => Str::headline(str_replace('_', ' ', $document->document_type)),
                    'originalName' => $document->original_name,
                    'status' => $document->status?->value,
                    'statusLabel' => $this->ppdbDocumentStatusLabel($document->status?->value),
                    'verifiedAt' => optional($document->verified_at)?->toIso8601String(),
                    'verifiedBy' => $document->verifiedBy?->name,
                    'sizeBytes' => $document->size_bytes,
                    'mimeType' => $document->mime_type,
                    'path' => $document->path,
                    'rejectionReason' => $document->rejection_reason,
                ])
                ->values()
                ->all(),
            'reviews' => $application->reviews
                ->sortByDesc('created_at')
                ->values()
                ->map(fn ($review) => [
                    'id' => $review->id,
                    'reviewType' => $review->review_type,
                    'status' => $review->status,
                    'statusLabel' => $this->ppdbStatusLabel($review->status),
                    'notes' => $review->notes,
                    'reviewer' => $review->reviewer?->name,
                    'createdAt' => optional($review->created_at)?->toIso8601String(),
                ])
                ->all(),
            'latestReview' => $latestReview ? [
                'status' => $latestReview->status,
                'statusLabel' => $this->ppdbStatusLabel($latestReview->status),
                'notes' => $latestReview->notes,
                'reviewer' => $latestReview->reviewer?->name,
                'createdAt' => optional($latestReview->created_at)?->toIso8601String(),
            ] : null,
        ];
    }

    private function ppdbDecisionOptions(): array
    {
        return collect([
            PpdbApplicationStatus::UnderReview,
            PpdbApplicationStatus::Verified,
            PpdbApplicationStatus::Eligible,
            PpdbApplicationStatus::Accepted,
            PpdbApplicationStatus::Waitlisted,
            PpdbApplicationStatus::Rejected,
        ])->map(fn (PpdbApplicationStatus $status) => [
            'value' => $status->value,
            'label' => $this->ppdbStatusLabel($status->value),
        ])->values()->all();
    }

    private function ppdbStatusLabel(?string $status): string
    {
        return match ($status) {
            PpdbApplicationStatus::Draft->value => 'Draft',
            PpdbApplicationStatus::Submitted->value => 'Submitted',
            PpdbApplicationStatus::UnderReview->value => 'Under Review',
            PpdbApplicationStatus::Verified->value => 'Verified',
            PpdbApplicationStatus::Eligible->value => 'Eligible',
            PpdbApplicationStatus::Accepted->value => 'Accepted',
            PpdbApplicationStatus::Waitlisted->value => 'Waitlisted',
            PpdbApplicationStatus::Rejected->value => 'Rejected',
            PpdbApplicationStatus::Withdrawn->value => 'Withdrawn',
            default => 'Unknown',
        };
    }

    private function ppdbTrackLabel(?string $trackType): string
    {
        return match ($trackType) {
            'zonasi' => 'Zonasi',
            'afirmasi' => 'Afirmasi',
            'prestasi' => 'Prestasi',
            'perpindahan' => 'Perpindahan',
            default => 'Tidak diketahui',
        };
    }

    private function ppdbDocumentStatusLabel(?string $status): string
    {
        return match ($status) {
            'verified' => 'Verified',
            'rejected' => 'Rejected',
            default => 'Pending',
        };
    }

    private function buildSystemPulse(array $stats): array
    {
        return [
            [
                'key' => 'identity',
                'eyebrow' => 'Governance',
                'title' => 'Akses & Akun',
                'value' => $stats['activeUserCount'],
                'suffix' => 'akun aktif',
                'description' => 'Memastikan akses portal internal tetap terverifikasi, sehat, dan terkontrol.',
                'tone' => $stats['suspendedUserCount'] > 0 ? 'warning' : 'positive',
                'highlights' => [
                    ['label' => 'Pending', 'value' => $stats['pendingUserCount']],
                    ['label' => 'Terverifikasi', 'value' => $stats['verifiedUserCount']],
                    ['label' => '2FA aktif', 'value' => $stats['twoFactorEnabledCount']],
                ],
            ],
            [
                'key' => 'publication',
                'eyebrow' => 'Public Surface',
                'title' => 'Konten & Moderasi',
                'value' => $stats['liveContentCount'],
                'suffix' => 'konten live',
                'description' => 'Menjaga ritme publikasi sekolah tetap aktif tanpa menumpuk antrean review.',
                'tone' => $stats['urgentQueueCount'] > 0 ? 'warning' : 'positive',
                'highlights' => [
                    ['label' => 'Artikel review', 'value' => $stats['articleInReviewCount']],
                    ['label' => 'Karya submitted', 'value' => $stats['portfolioSubmittedCount']],
                    ['label' => 'Forum review', 'value' => $stats['pendingModerationCount']],
                ],
            ],
            [
                'key' => 'admission',
                'eyebrow' => 'Admissions',
                'title' => 'PPDB & Seleksi',
                'value' => $stats['ppdbSubmittedCount'],
                'suffix' => 'aplikasi masuk',
                'description' => 'Memantau intake, verifikasi, dan keputusan agar proses penerimaan tidak tertahan.',
                'tone' => $stats['ppdbUnderReviewCount'] > 0 ? 'warning' : 'info',
                'highlights' => [
                    ['label' => 'Under review', 'value' => $stats['ppdbUnderReviewCount']],
                    ['label' => 'Accepted', 'value' => $stats['ppdbAcceptedCount']],
                    ['label' => 'Tracer publik', 'value' => $stats['tracerDisplayableCount']],
                ],
            ],
            [
                'key' => 'academic',
                'eyebrow' => 'Academic Ops',
                'title' => 'Jadwal & Struktur',
                'value' => $stats['publishedTimetableCount'],
                'suffix' => 'jadwal tayang',
                'description' => 'Mengecek kesiapan operasional sekolah dari ruang, jadwal, dan penugasan organisasi.',
                'tone' => $stats['draftTimetableCount'] > 0 ? 'warning' : 'info',
                'highlights' => [
                    ['label' => 'Draft jadwal', 'value' => $stats['draftTimetableCount']],
                    ['label' => 'Ruang aktif', 'value' => $stats['roomCount']],
                    ['label' => 'Struktur aktif', 'value' => $stats['activeOrganizationCount']],
                ],
            ],
        ];
    }

    private function buildFocusBoard(array $stats): array
    {
        return [
            [
                'key' => 'ppdb',
                'title' => 'PPDB',
                'count' => $stats['ppdbUnderReviewCount'],
                'unit' => 'berkas perlu review',
                'summary' => 'Verifikasi dokumen calon siswa dan finalkan keputusan penerimaan.',
                'tone' => $stats['ppdbUnderReviewCount'] > 0 ? 'amber' : 'sky',
                'checkpoints' => [
                    ['label' => 'Aplikasi masuk', 'value' => $stats['ppdbSubmittedCount']],
                    ['label' => 'Diterima', 'value' => $stats['ppdbAcceptedCount']],
                    ['label' => 'Queue total', 'value' => $stats['urgentQueueCount']],
                ],
            ],
            [
                'key' => 'content',
                'title' => 'Publikasi',
                'count' => $stats['articleInReviewCount'] + $stats['portfolioSubmittedCount'],
                'unit' => 'konten menunggu keputusan',
                'summary' => 'Rapikan artikel, karya, dan tampilan publik sekolah sebelum tayang.',
                'tone' => $stats['articleInReviewCount'] + $stats['portfolioSubmittedCount'] > 0 ? 'rose' : 'sky',
                'checkpoints' => [
                    ['label' => 'Artikel review', 'value' => $stats['articleInReviewCount']],
                    ['label' => 'Karya masuk', 'value' => $stats['portfolioSubmittedCount']],
                    ['label' => 'Konten live', 'value' => $stats['liveContentCount']],
                ],
            ],
            [
                'key' => 'academic',
                'title' => 'Akademik',
                'count' => $stats['draftTimetableCount'],
                'unit' => 'draft perlu dibereskan',
                'summary' => 'Pastikan jadwal, ruang, guru, dan struktur sekolah siap dipakai harian.',
                'tone' => $stats['draftTimetableCount'] > 0 ? 'sky' : 'violet',
                'checkpoints' => [
                    ['label' => 'Guru', 'value' => $stats['teacherCount']],
                    ['label' => 'Ruang aktif', 'value' => $stats['roomCount']],
                    ['label' => 'Struktur current', 'value' => $stats['currentOrganizationCount']],
                ],
            ],
            [
                'key' => 'access',
                'title' => 'Akses Pengguna',
                'count' => $stats['pendingUserCount'],
                'unit' => 'akun menunggu tindak lanjut',
                'summary' => 'Jaga akses guru dan siswa tetap aktif, aman, dan tervalidasi.',
                'tone' => $stats['pendingUserCount'] > 0 ? 'amber' : 'violet',
                'checkpoints' => [
                    ['label' => 'Akun aktif', 'value' => $stats['activeUserCount']],
                    ['label' => 'Terverifikasi', 'value' => $stats['verifiedUserCount']],
                    ['label' => '2FA aktif', 'value' => $stats['twoFactorEnabledCount']],
                ],
            ],
        ];
    }

    private function buildPriorityLanes(array $stats): array
    {
        return [
            [
                'key' => 'community',
                'title' => 'Moderasi komunitas',
                'queueCount' => $stats['pendingModerationCount'],
                'queueLabel' => 'post menunggu review',
                'description' => 'Antrean yang paling cepat memengaruhi reputasi portal publik dan kualitas diskusi.',
                'recommendation' => $stats['pendingModerationCount'] > 0
                    ? 'Mulai dari posting yang dilaporkan atau punya komentar tertinggi.'
                    : 'Tidak ada antrean moderasi mendesak saat ini.',
                'tone' => $stats['reportedPostCount'] > 0 || $stats['pendingModerationCount'] > 0 ? 'danger' : 'positive',
                'metrics' => [
                    ['label' => 'Posting dilaporkan', 'value' => $stats['reportedPostCount']],
                    ['label' => 'Komentar publik', 'value' => $stats['forumCommentCount']],
                    ['label' => 'Posting approved', 'value' => $stats['approvedForumPostCount']],
                ],
            ],
            [
                'key' => 'content',
                'title' => 'Publikasi konten',
                'queueCount' => $stats['articleInReviewCount'] + $stats['portfolioSubmittedCount'],
                'queueLabel' => 'item menunggu keputusan',
                'description' => 'Mengatur kecepatan publikasi artikel dan karya agar permukaan portal tetap hidup.',
                'recommendation' => $stats['articleInReviewCount'] + $stats['portfolioSubmittedCount'] > 0
                    ? 'Selesaikan item review lebih dulu untuk membuka backlog konten berikutnya.'
                    : 'Pipeline publikasi sedang sehat dan tidak menumpuk.',
                'tone' => $stats['articleInReviewCount'] + $stats['portfolioSubmittedCount'] > 0 ? 'warning' : 'positive',
                'metrics' => [
                    ['label' => 'Artikel live', 'value' => $stats['publishedArticleCount']],
                    ['label' => 'Karya live', 'value' => $stats['portfolioPublishedCount']],
                    ['label' => 'Artikel draft', 'value' => $stats['draftArticleCount']],
                ],
            ],
            [
                'key' => 'admissions',
                'title' => 'PPDB & verifikasi',
                'queueCount' => $stats['ppdbUnderReviewCount'],
                'queueLabel' => 'berkas under review',
                'description' => 'Menjaga SLA verifikasi tetap tajam sebelum gelombang aplikasi berikutnya naik.',
                'recommendation' => $stats['ppdbUnderReviewCount'] > 0
                    ? 'Prioritaskan aplikasi yang sudah submitted tetapi belum diputuskan.'
                    : 'Tidak ada antrean verifikasi kritis saat ini.',
                'tone' => $stats['ppdbUnderReviewCount'] > 0 ? 'warning' : 'info',
                'metrics' => [
                    ['label' => 'Aplikasi masuk', 'value' => $stats['ppdbSubmittedCount']],
                    ['label' => 'Accepted', 'value' => $stats['ppdbAcceptedCount']],
                    ['label' => 'Queue total', 'value' => $stats['urgentQueueCount']],
                ],
            ],
            [
                'key' => 'academic',
                'title' => 'Jadwal & struktur',
                'queueCount' => $stats['draftTimetableCount'],
                'queueLabel' => 'draft jadwal',
                'description' => 'Konsistensi struktur organisasi dan jadwal menentukan kesiapan operasional harian.',
                'recommendation' => $stats['draftTimetableCount'] > 0
                    ? 'Pastikan versi jadwal berikutnya dipublish sebelum semester berjalan padat.'
                    : 'Operasi akademik relatif stabil pada snapshot saat ini.',
                'tone' => $stats['draftTimetableCount'] > 0 ? 'warning' : 'info',
                'metrics' => [
                    ['label' => 'Jadwal tayang', 'value' => $stats['publishedTimetableCount']],
                    ['label' => 'Penugasan aktif', 'value' => $stats['activeOrganizationCount']],
                    ['label' => 'Posisi current', 'value' => $stats['currentOrganizationCount']],
                ],
            ],
        ];
    }

    public function guru(): Response
    {
        $user = Auth::user();

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
            ->count();

        return Inertia::render('internal/guru-dashboard', [
            'stats' => [
                'kelasDiampu' => $kelasDiampu,
                'jadwalHariIni' => $jadwalHariIni,
                'portfolioReview' => $portfolioReview,
            ],
            'upcomingClasses' => [],
            'pendingReviews' => [],
        ]);
    }

    public function siswa(): Response
    {
        $user = Auth::user();

        $jadwalHariIni = 0;

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

        $profilAnak = 0;
        $jadwalAnak = 0;

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
