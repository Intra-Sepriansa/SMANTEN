<?php

use App\Enums\AcademicTermType;
use App\Enums\ArticleStatus;
use App\Enums\OrganizationAssignmentStatus;
use App\Enums\OrganizationScope;
use App\Enums\PortfolioItemStatus;
use App\Enums\PpdbApplicationStatus;
use App\Enums\PpdbDocumentStatus;
use App\Enums\PpdbTrackType;
use App\Enums\TimetableVersionStatus;
use App\Enums\UserStatus;
use App\Models\AcademicTerm;
use App\Models\AcademicYear;
use App\Models\ActivityLog;
use App\Models\AlumniForumComment;
use App\Models\AlumniForumPost;
use App\Models\AlumniProfile;
use App\Models\Article;
use App\Models\OrganizationAssignment;
use App\Models\OrganizationPosition;
use App\Models\OrganizationUnit;
use App\Models\PortfolioItem;
use App\Models\PortfolioProject;
use App\Models\PpdbApplication;
use App\Models\PpdbApplicationDocument;
use App\Models\PpdbApplicationReview;
use App\Models\PpdbCycle;
use App\Models\PpdbDistanceAudit;
use App\Models\Role;
use App\Models\Room;
use App\Models\TimetableVersion;
use App\Models\TracerStudyResponse;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;

function seedAdminWorkspace(): User
{
    $user = User::factory()->withTwoFactor()->createOne([
        'name' => 'Super Admin Utama',
        'status' => UserStatus::Active,
        'last_seen_at' => now(),
    ]);

    $superAdminRole = Role::query()->create([
        'name' => 'Super Admin',
        'slug' => 'super_admin',
    ]);

    $guruRole = Role::query()->create([
        'name' => 'Guru',
        'slug' => 'guru',
    ]);

    $siswaRole = Role::query()->create([
        'name' => 'Siswa',
        'slug' => 'siswa',
    ]);

    $user->roles()->attach($superAdminRole->id, ['assigned_at' => now()]);

    $teacher = User::factory()->createOne([
        'status' => UserStatus::Active,
        'last_seen_at' => now()->subHour(),
        'email_verified_at' => now(),
    ]);
    $teacher->roles()->attach($guruRole->id, ['assigned_at' => now()]);

    $student = User::factory()->createOne([
        'status' => UserStatus::Active,
        'last_seen_at' => now()->subMinutes(30),
        'email_verified_at' => now(),
    ]);
    $student->roles()->attach($siswaRole->id, ['assigned_at' => now()]);

    User::factory()->unverified()->createOne([
        'status' => UserStatus::Pending,
        'last_seen_at' => now()->subDays(3),
        'last_login_at' => null,
    ]);

    User::factory()->createOne([
        'status' => UserStatus::Suspended,
        'last_seen_at' => now()->subDays(2),
    ]);

    $profile = AlumniProfile::query()->create([
        'full_name' => 'Admin Dashboard Alumni',
        'graduation_year' => 2018,
        'institution_name' => 'Institut Teknologi Masa Depan',
        'city' => 'Bandung',
        'province' => 'Jawa Barat',
        'is_public_profile' => true,
    ]);

    TracerStudyResponse::query()->create([
        'alumni_profile_id' => $profile->id,
        'status' => 'submitted',
        'current_activity' => 'bekerja',
        'institution_name' => 'Institut Teknologi Masa Depan',
        'location_city' => 'Bandung',
        'location_province' => 'Jawa Barat',
        'is_publicly_displayable' => true,
        'submitted_at' => now(),
    ]);

    $approvedPost = AlumniForumPost::query()->create([
        'alumni_profile_id' => $profile->id,
        'author_name' => $profile->full_name,
        'graduation_year' => 2018,
        'category' => 'karir',
        'title' => 'Analitik data di dunia kerja',
        'body' => 'Cerita ini menjelaskan perjalanan karier dan insight praktis untuk adik kelas yang sedang menyiapkan portofolio profesional.',
        'is_approved' => true,
        'moderation_status' => 'approved',
        'approved_at' => now(),
    ]);

    AlumniForumPost::query()->create([
        'alumni_profile_id' => $profile->id,
        'author_name' => 'Antrian Moderasi',
        'graduation_year' => 2019,
        'category' => 'inspirasi',
        'title' => 'Cerita yang menunggu moderasi',
        'body' => 'Posting ini sengaja dibuat untuk mengisi antrean watchlist dan memverifikasi prioritas moderasi komunitas.',
        'moderation_status' => 'pending_review',
        'reports_count' => 1,
        'comments_count' => 2,
    ]);

    AlumniForumComment::query()->create([
        'alumni_forum_post_id' => $approvedPost->id,
        'author_name' => 'Pengunjung',
        'body' => 'Insight-nya sangat berguna.',
        'moderation_status' => 'approved',
    ]);

    Article::query()->create([
        'author_user_id' => $user->id,
        'title' => 'Artikel live sekolah',
        'slug' => 'artikel-live-sekolah',
        'status' => ArticleStatus::Published,
        'published_at' => now(),
        'updated_at' => now(),
    ]);

    Article::query()->create([
        'author_user_id' => $teacher->id,
        'title' => 'Artikel menunggu review',
        'slug' => 'artikel-menunggu-review',
        'status' => ArticleStatus::InReview,
        'updated_at' => now()->subMinute(),
    ]);

    $portfolioProject = PortfolioProject::query()->create([
        'title' => 'Festival Inovasi Digital',
        'slug' => 'festival-inovasi-digital',
    ]);

    PortfolioItem::query()->create([
        'portfolio_project_id' => $portfolioProject->id,
        'creator_user_id' => $student->id,
        'title' => 'Karya siap review',
        'slug' => 'karya-siap-review',
        'status' => PortfolioItemStatus::Submitted,
        'updated_at' => now(),
    ]);

    PortfolioItem::query()->create([
        'portfolio_project_id' => $portfolioProject->id,
        'creator_user_id' => $student->id,
        'title' => 'Karya live',
        'slug' => 'karya-live',
        'status' => PortfolioItemStatus::Published,
        'published_at' => now(),
        'updated_at' => now()->subMinute(),
    ]);

    $academicYear = AcademicYear::query()->create([
        'name' => '2026/2027',
        'starts_on' => now()->startOfYear()->toDateString(),
        'ends_on' => now()->endOfYear()->toDateString(),
        'is_active' => true,
    ]);

    $academicTerm = AcademicTerm::query()->create([
        'academic_year_id' => $academicYear->id,
        'name' => 'Semester Ganjil',
        'term_type' => AcademicTermType::Odd,
        'starts_on' => now()->startOfMonth()->toDateString(),
        'ends_on' => now()->addMonths(5)->toDateString(),
        'is_active' => true,
    ]);

    TimetableVersion::query()->create([
        'academic_term_id' => $academicTerm->id,
        'name' => 'Versi Aktif',
        'status' => TimetableVersionStatus::Published,
        'published_by_user_id' => $user->id,
        'published_at' => now(),
    ]);

    TimetableVersion::query()->create([
        'academic_term_id' => $academicTerm->id,
        'name' => 'Versi Draft',
        'status' => TimetableVersionStatus::Draft,
    ]);

    Room::query()->create([
        'code' => 'R-101',
        'name' => 'Ruang 101',
        'room_type' => 'classroom',
        'is_active' => true,
        'is_schedulable' => true,
        'supports_moving_class' => true,
    ]);

    $unit = OrganizationUnit::query()->create([
        'scope' => OrganizationScope::SchoolManagement,
        'name' => 'Manajemen Sekolah',
        'slug' => 'manajemen-sekolah',
        'sort_order' => 1,
        'is_active' => true,
    ]);

    $position = OrganizationPosition::query()->create([
        'organization_unit_id' => $unit->id,
        'scope' => OrganizationScope::SchoolManagement,
        'title' => 'Kepala Sekolah',
        'slug' => 'kepala-sekolah',
        'hierarchy_level' => 1,
        'is_unique_holder' => true,
    ]);

    OrganizationAssignment::query()->create([
        'organization_unit_id' => $unit->id,
        'organization_position_id' => $position->id,
        'full_name_snapshot' => 'Titin Sriwartini',
        'status' => OrganizationAssignmentStatus::Active,
        'is_current' => true,
        'starts_at' => now()->subMonth(),
    ]);

    $ppdbCycle = PpdbCycle::query()->create([
        'academic_year_id' => $academicYear->id,
        'name' => 'PPDB 2026',
        'status' => 'active',
    ]);

    $ppdbApplication = PpdbApplication::query()->create([
        'ppdb_cycle_id' => $ppdbCycle->id,
        'registration_number' => 'PPDB-2026-001',
        'track_type' => PpdbTrackType::Zonasi,
        'full_name' => 'Calon Siswa Review',
        'phone' => '081234567890',
        'email' => 'ppdb-review@example.test',
        'previous_school_name' => 'SMP Harapan Bangsa',
        'address_line' => 'Kampung Sukamaju 12',
        'district' => 'Tenjo',
        'city' => 'Bogor',
        'province' => 'Jawa Barat',
        'postal_code' => '16370',
        'distance_meters' => 3500,
        'decision_notes' => 'Menunggu verifikasi berkas akhir.',
        'status' => PpdbApplicationStatus::UnderReview,
        'submitted_at' => now()->subMinutes(30),
    ]);

    PpdbApplication::query()->create([
        'ppdb_cycle_id' => $ppdbCycle->id,
        'registration_number' => 'PPDB-2026-002',
        'full_name' => 'Calon Siswa Accepted',
        'status' => PpdbApplicationStatus::Accepted,
        'submitted_at' => now()->subHour(),
    ]);

    PpdbApplicationDocument::query()->create([
        'ppdb_application_id' => $ppdbApplication->id,
        'verified_by_user_id' => $user->id,
        'document_type' => 'family_card',
        'original_name' => 'kk.pdf',
        'path' => 'ppdb/kk.pdf',
        'mime_type' => 'application/pdf',
        'size_bytes' => 153600,
        'status' => PpdbDocumentStatus::Verified,
        'verified_at' => now()->subMinutes(15),
    ]);

    PpdbApplicationDocument::query()->create([
        'ppdb_application_id' => $ppdbApplication->id,
        'document_type' => 'report_card',
        'original_name' => 'rapor.pdf',
        'path' => 'ppdb/rapor.pdf',
        'mime_type' => 'application/pdf',
        'size_bytes' => 256000,
        'status' => PpdbDocumentStatus::Rejected,
        'rejection_reason' => 'Halaman semester 5 belum lengkap.',
    ]);

    PpdbApplicationReview::query()->create([
        'ppdb_application_id' => $ppdbApplication->id,
        'reviewer_user_id' => $user->id,
        'review_type' => 'manual_status_update',
        'status' => PpdbApplicationStatus::UnderReview->value,
        'notes' => 'Berkas rapor perlu dilengkapi sebelum keputusan akhir.',
    ]);

    PpdbDistanceAudit::query()->create([
        'ppdb_application_id' => $ppdbApplication->id,
        'calculated_by_user_id' => $user->id,
        'origin_latitude' => -6.3200000,
        'origin_longitude' => 106.4300000,
        'school_latitude' => -6.3270000,
        'school_longitude' => 106.4380000,
        'distance_meters' => 3500,
        'formula_version' => 'haversine:v1',
        'calculated_at' => now()->subMinutes(10),
        'metadata' => ['source' => 'test'],
    ]);

    ActivityLog::query()->create([
        'user_id' => $user->id,
        'event' => 'admin.dashboard.reviewed',
        'description' => 'Super admin reviewed the command center.',
        'created_at' => now(),
    ]);

    ActivityLog::query()->create([
        'event' => 'public.page.visited',
        'description' => 'Pengunjung membuka halaman publik.',
        'properties' => [
            'routeName' => 'home',
            'path' => '/',
            'visitorTokenHash' => 'visitor-a',
        ],
        'created_at' => now()->subDays(2)->setTime(9, 0),
    ]);

    ActivityLog::query()->create([
        'event' => 'public.page.visited',
        'description' => 'Pengunjung membuka halaman publik.',
        'properties' => [
            'routeName' => 'home',
            'path' => '/',
            'visitorTokenHash' => 'visitor-a',
        ],
        'created_at' => now()->subDay()->setTime(8, 0),
    ]);

    ActivityLog::query()->create([
        'event' => 'public.page.visited',
        'description' => 'Pengunjung membuka halaman publik.',
        'properties' => [
            'routeName' => 'profile',
            'path' => '/profil',
            'visitorTokenHash' => 'visitor-a',
        ],
        'created_at' => now()->subDay()->setTime(10, 0),
    ]);

    ActivityLog::query()->create([
        'event' => 'public.page.visited',
        'description' => 'Pengunjung membuka halaman publik.',
        'properties' => [
            'routeName' => 'ppdb',
            'path' => '/ppdb',
            'visitorTokenHash' => 'visitor-b',
        ],
        'created_at' => now()->subDay()->setTime(14, 0),
    ]);

    ActivityLog::query()->create([
        'event' => 'public.page.visited',
        'description' => 'Pengunjung membuka halaman publik.',
        'properties' => [
            'routeName' => 'berita.index',
            'path' => '/berita',
            'visitorTokenHash' => 'visitor-c',
        ],
        'created_at' => now()->subDays(20)->setTime(11, 0),
    ]);

    return $user;
}

it('renders admin dashboard as a focused summary page', function () {
    $user = seedAdminWorkspace();
    $from = now()->subDays(2)->toDateString();
    $until = now()->subDay()->toDateString();

    actingAs($user);

    get(route('dashboard.admin', ['from' => $from, 'until' => $until]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('internal/admin-dashboard')
            ->where('filters.from', $from)
            ->where('filters.until', $until)
            ->where('stats.activeUserCount', 3)
            ->where('stats.twoFactorEnabledCount', 1)
            ->where('stats.teacherCount', 1)
            ->where('stats.studentCount', 1)
            ->where('stats.liveContentCount', 2)
            ->where('stats.publishedArticleCount', 1)
            ->where('stats.portfolioSubmittedCount', 1)
            ->where('stats.ppdbUnderReviewCount', 1)
            ->where('stats.currentOrganizationCount', 1)
            ->where('stats.urgentQueueCount', 5)
            ->where('focusBoard.0.key', 'ppdb')
            ->where('focusBoard.0.count', 1)
            ->where('focusBoard.1.key', 'content')
            ->where('focusBoard.1.count', 2)
            ->where('focusBoard.2.key', 'academic')
            ->where('focusBoard.2.count', 1)
            ->where('focusBoard.3.key', 'access')
            ->where('focusBoard.3.count', 1)
            ->where('systemPulse.0.key', 'identity')
            ->where('systemPulse.0.value', 3)
            ->where('publicVisitors.totalVisitors', 2)
            ->where('publicVisitors.totalPageViews', 4)
            ->where('publicVisitors.series.0.visitors', 1)
            ->where('publicVisitors.series.1.visitors', 2)
            ->where('priorityLanes.0.key', 'community')
            ->where('priorityLanes.1.queueCount', 2)
            ->where('forumWatchlist.0.reportsCount', 1)
            ->where('activityFeed.0.title', 'Admin Dashboard Reviewed'),
        );
});

it('renders each admin menu on its own page', function () {
    $user = seedAdminWorkspace();
    $ppdbApplication = PpdbApplication::query()
        ->where('registration_number', 'PPDB-2026-001')
        ->firstOrFail();

    actingAs($user);

    get(route('dashboard.admin.ppdb'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('internal/admin-ppdb')
            ->where('ppdbDesk.applications.0.registrationNumber', 'PPDB-2026-001')
            ->where('ppdbDesk.applications.0.trackLabel', 'Zonasi')
            ->where('ppdbDesk.applications.0.documentsSummary.verified', 1)
            ->where('ppdbDesk.applications.0.latestDistanceAudit.distanceKm', 3.5)
            ->where('priorityLanes.2.key', 'admissions'),
        );

    get(route('dashboard.admin.ppdb.show', $ppdbApplication))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('internal/admin-ppdb-detail')
            ->where('application.registrationNumber', 'PPDB-2026-001')
            ->where('application.statusLabel', 'Under Review')
            ->where('application.documentsSummary.rejected', 1)
            ->where('application.latestReview.notes', 'Berkas rapor perlu dilengkapi sebelum keputusan akhir.')
            ->where('decisionOptions.3.value', PpdbApplicationStatus::Accepted->value),
        );

    get(route('dashboard.admin.organization'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('internal/admin-organization')
            ->where('organizationDesk.recentAssignments.0.person', 'Titin Sriwartini')
            ->where('organizationDesk.scopeMix.0.label', 'School Management'),
        );

    get(route('dashboard.admin.articles'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('internal/admin-articles')
            ->where('articleDesk.recentArticles.0.title', 'Artikel menunggu review')
            ->where('articleDesk.topAuthors.0.count', 1),
        );

    get(route('dashboard.admin.portfolio'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('internal/admin-portfolio')
            ->where('portfolioDesk.recentItems.0.title', 'Karya live')
            ->where('portfolioDesk.topCreators.0.count', 2),
        );

    get(route('dashboard.admin.teachers'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('internal/admin-teachers')
            ->where('teacherDesk.teachers.0.articleCount', 1),
        );

    get(route('dashboard.admin.schedule'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('internal/admin-schedule')
            ->where('scheduleDesk.rooms.0.code', 'R-101'),
        );

    get(route('dashboard.admin.students'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('internal/admin-students')
            ->where('studentDesk.students.0.portfolioCount', 2),
        );

    get(route('dashboard.admin.student-schedule'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('internal/admin-student-schedule')
            ->where('stats.publishedTimetableCount', 1)
            ->where('studentDesk.verifiedCount', 1),
        );

    get(route('dashboard.admin.student-portfolio'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('internal/admin-student-portfolio')
            ->where('studentDesk.portfolioLeaders.0.portfolioCount', 2)
            ->where('portfolioDesk.recentItems.0.creator', fn (?string $value) => $value !== null),
        );

    get(route('dashboard.admin.website'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('internal/admin-website')
            ->where('activityFeed.0.title', 'Admin Dashboard Reviewed'),
        );
});
