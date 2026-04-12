<?php

namespace Database\Seeders;

use App\Enums\OrganizationAssignmentStatus;
use App\Enums\OrganizationScope;
use App\Enums\PpdbTrackType;
use App\Enums\MediaType;
use App\Enums\PortfolioItemStatus;
use App\Enums\PortfolioVisibility;
use App\Enums\RoleName;
use App\Enums\RoomType;
use App\Enums\TimetableVersionStatus;
use App\Models\AcademicTerm;
use App\Models\AcademicYear;
use App\Models\Article;
use App\Models\ArticleCategory;
use App\Models\Employee;
use App\Models\GradeLevel;
use App\Models\MediaAsset;
use App\Models\OrganizationAssignment;
use App\Models\OrganizationPosition;
use App\Models\OrganizationUnit;
use App\Models\P5Theme;
use App\Models\PortfolioItem;
use App\Models\PortfolioProject;
use App\Models\PpdbApplication;
use App\Models\PpdbCycle;
use App\Models\Role;
use App\Models\Room;
use App\Models\StudentEnrollment;
use App\Models\StudentProfile;
use App\Models\Tag;
use App\Models\TeachingGroup;
use App\Models\TimetablePeriod;
use App\Models\TimetableVersion;
use App\Models\User;
use Illuminate\Database\Seeder;

class OperationsShowcaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $academicYear = AcademicYear::query()->where('is_active', true)->firstOrFail();
        $oddTerm = AcademicTerm::query()->where('academic_year_id', $academicYear->id)->where('term_type', 'odd')->firstOrFail();
        $teacher = Employee::query()->where('employee_type', 'teacher')->firstOrFail();
        $student = StudentProfile::query()->firstOrFail();
        $studentUser = $student->user;
        $journalist = User::query()->where('username', 'jurnalis.smanten')->firstOrFail();

        foreach (range(1, 21) as $index) {
            Room::query()->updateOrCreate(
                ['code' => 'KLS-'.str_pad((string) $index, 2, '0', STR_PAD_LEFT)],
                [
                    'name' => 'Ruang Kelas '.$index,
                    'room_type' => RoomType::Classroom,
                    'capacity' => 36,
                    'is_schedulable' => true,
                    'supports_moving_class' => true,
                    'is_active' => true,
                ],
            );
        }

        foreach (range(1, 3) as $index) {
            Room::query()->updateOrCreate(
                ['code' => 'LAB-'.str_pad((string) $index, 2, '0', STR_PAD_LEFT)],
                [
                    'name' => 'Laboratorium '.$index,
                    'room_type' => RoomType::Laboratory,
                    'capacity' => 32,
                    'is_schedulable' => true,
                    'supports_moving_class' => true,
                    'is_active' => true,
                ],
            );
        }

        foreach (range(1, 2) as $index) {
            Room::query()->updateOrCreate(
                ['code' => 'LIB-'.str_pad((string) $index, 2, '0', STR_PAD_LEFT)],
                [
                    'name' => 'Perpustakaan '.$index,
                    'room_type' => RoomType::Library,
                    'capacity' => 40,
                    'is_schedulable' => true,
                    'supports_moving_class' => true,
                    'is_active' => true,
                ],
            );
        }

        $supportRooms = [
            ['code' => 'OSIS-01', 'name' => 'Ruang OSIS', 'room_type' => RoomType::Osis],
            ['code' => 'UKS-01', 'name' => 'Ruang UKS', 'room_type' => RoomType::Health],
            ['code' => 'BK-01', 'name' => 'Ruang BK', 'room_type' => RoomType::Counseling],
            ['code' => 'IBD-01', 'name' => 'Ruang Ibadah', 'room_type' => RoomType::Worship],
        ];

        foreach ($supportRooms as $roomData) {
            Room::query()->updateOrCreate(
                ['code' => $roomData['code']],
                [
                    ...$roomData,
                    'is_schedulable' => false,
                    'supports_moving_class' => false,
                    'is_active' => true,
                ],
            );
        }

        $gradeLevels = GradeLevel::query()->orderBy('grade_number')->get()->values();

        $groupCounter = 1;
        foreach ($gradeLevels as $gradeLevel) {
            foreach (range(1, 10) as $section) {
                $teachingGroup = TeachingGroup::query()->updateOrCreate(
                    ['academic_year_id' => $academicYear->id, 'code' => 'RMBL-'.$groupCounter],
                    [
                        'grade_level_id' => $gradeLevel->id,
                        'homeroom_employee_id' => $teacher->id,
                        'name' => 'Kelas '.$gradeLevel->grade_number.'-'.$section,
                        'capacity' => 36,
                        'is_active' => true,
                    ],
                );

                if ($groupCounter === 1) {
                    StudentEnrollment::query()->updateOrCreate(
                        ['student_profile_id' => $student->id, 'academic_year_id' => $academicYear->id],
                        [
                            'academic_term_id' => $oddTerm->id,
                            'teaching_group_id' => $teachingGroup->id,
                            'roll_number' => 1,
                            'status' => 'active',
                        ],
                    );
                }

                $groupCounter++;
            }
        }

        foreach (range(1, 8) as $sequence) {
            TimetablePeriod::query()->updateOrCreate(
                [
                    'academic_year_id' => $academicYear->id,
                    'day_of_week' => 1,
                    'sequence' => $sequence,
                ],
                [
                    'name' => 'Jam Ke-'.$sequence,
                    'starts_at' => now()->setTime(7 + $sequence, 0, 0)->format('H:i:s'),
                    'ends_at' => now()->setTime(7 + $sequence, 45, 0)->format('H:i:s'),
                    'is_break' => false,
                ],
            );
        }

        TimetableVersion::query()->updateOrCreate(
            ['academic_term_id' => $oddTerm->id, 'name' => 'Draft Moving Class 2026'],
            [
                'status' => TimetableVersionStatus::Draft,
                'effective_from' => $oddTerm->starts_on,
                'effective_until' => $oddTerm->ends_on,
            ],
        );

        $ppdbCycle = PpdbCycle::query()->updateOrCreate(
            ['name' => 'PPDB 2026/2027'],
            [
                'academic_year_id' => $academicYear->id,
                'status' => 'active',
                'capacity' => 188,
                'school_latitude' => -6.3483,
                'school_longitude' => 106.4638,
                'default_zone_radius_km' => 5,
                'application_opens_at' => now()->subDays(5),
                'application_closes_at' => now()->addDays(10),
                'announcement_at' => now()->addDays(20),
                'rules_snapshot' => [
                    'affirmation_quota' => 20,
                    'ketm_quota' => 15,
                    'special_condition_quota' => 5,
                ],
            ],
        );

        foreach ([
            [PpdbTrackType::Zonasi, 50, 94],
            [PpdbTrackType::Afirmasi, 20, 38],
            [PpdbTrackType::Prestasi, 25, 47],
            [PpdbTrackType::Perpindahan, 5, 9],
        ] as [$track, $percentage, $seats]) {
            $ppdbCycle->trackQuotas()->updateOrCreate(
                ['track_type' => $track->value],
                [
                    'quota_percentage' => $percentage,
                    'quota_seats' => $seats,
                    'is_active' => true,
                ],
            );
        }

        PpdbApplication::query()->updateOrCreate(
            ['registration_number' => 'PPDB-DEMO-001'],
            [
                'ppdb_cycle_id' => $ppdbCycle->id,
                'user_id' => null,
                'track_type' => PpdbTrackType::Zonasi,
                'status' => 'submitted',
                'full_name' => 'Calon Siswa Zonasi',
                'phone' => '081234567890',
                'previous_school_name' => 'SMPN Contoh',
                'latitude' => -6.3512,
                'longitude' => 106.4702,
                'submitted_at' => now(),
            ],
        );

        $theme = P5Theme::query()->updateOrCreate(
            ['slug' => 'berkebhinekaan-global'],
            [
                'name' => 'Berkebhinekaan Global',
                'description' => 'Tema P5 unggulan untuk pameran Panen Karya.',
                'is_active' => true,
            ],
        );

        $project = PortfolioProject::query()->updateOrCreate(
            ['slug' => 'panen-karya-2026'],
            [
                'academic_year_id' => $academicYear->id,
                'p5_theme_id' => $theme->id,
                'mentor_employee_id' => $teacher->id,
                'title' => 'Panen Karya 2026',
                'category' => 'P5',
                'exhibition_name' => 'Panen Karya Project P5',
                'event_date' => now()->toDateString(),
                'description' => 'Showcase P5 dan produk kreatif siswa SMAN 1 Tenjo.',
                'visibility' => PortfolioVisibility::Public,
                'is_featured' => true,
            ],
        );

        $project->members()->updateOrCreate(
            ['student_profile_id' => $student->id],
            ['member_role' => 'ketua', 'is_lead' => true],
        );

        $portfolioItem = PortfolioItem::query()->updateOrCreate(
            ['slug' => 'mustikarasa-es-buah'],
            [
                'portfolio_project_id' => $project->id,
                'creator_user_id' => $studentUser?->id,
                'title' => 'Mustikarasa Es Buah',
                'item_type' => 'gastronomy',
                'summary' => 'Produk gastronomi siswa dalam showcase Mustikarasa.',
                'content' => 'Es Buah sebagai contoh produk kewirausahaan kuliner siswa.',
                'status' => PortfolioItemStatus::Published,
                'visibility' => PortfolioVisibility::Public,
                'is_featured' => true,
                'price_estimate' => 15000,
                'published_at' => now(),
            ],
        );

        MediaAsset::query()->updateOrCreate(
            ['attachable_type' => $portfolioItem->getMorphClass(), 'attachable_id' => $portfolioItem->id, 'provider_media_id' => 'mustikarasa-demo'],
            [
                'uploader_user_id' => $studentUser?->id,
                'media_type' => 'image',
                'disk' => 'public',
                'path' => 'portfolio/mustikarasa-es-buah.jpg',
                'original_name' => 'mustikarasa-es-buah.jpg',
                'visibility' => PortfolioVisibility::Public,
            ],
        );

        $managementUnit = OrganizationUnit::query()->updateOrCreate(
            ['slug' => 'manajemen-sekolah'],
            [
                'scope' => OrganizationScope::SchoolManagement,
                'name' => 'Manajemen Sekolah',
                'sort_order' => 1,
                'is_active' => true,
            ],
        );

        $osisUnit = OrganizationUnit::query()->updateOrCreate(
            ['slug' => 'osis'],
            [
                'scope' => OrganizationScope::StudentOrganization,
                'name' => 'OSIS',
                'sort_order' => 2,
                'is_active' => true,
            ],
        );

        $principalPosition = OrganizationPosition::query()->updateOrCreate(
            ['slug' => 'kepala-sekolah'],
            [
                'organization_unit_id' => $managementUnit->id,
                'scope' => OrganizationScope::SchoolManagement,
                'title' => 'Kepala Sekolah',
                'hierarchy_level' => 1,
                'is_unique_holder' => true,
            ],
        );

        $chairPosition = OrganizationPosition::query()->updateOrCreate(
            ['slug' => 'ketua-osis'],
            [
                'organization_unit_id' => $osisUnit->id,
                'scope' => OrganizationScope::StudentOrganization,
                'title' => 'Ketua OSIS',
                'hierarchy_level' => 1,
                'is_unique_holder' => true,
            ],
        );

        $superAdmin = User::query()->whereHas('roles', fn ($query) => $query->where('slug', RoleName::SuperAdmin->value))->first();

        OrganizationAssignment::query()->updateOrCreate(
            [
                'organization_position_id' => $principalPosition->id,
                'full_name_snapshot' => 'Titin Sriwartini',
            ],
            [
                'organization_unit_id' => $managementUnit->id,
                'user_id' => $superAdmin?->id,
                'full_name_snapshot' => 'Titin Sriwartini',
                'status' => OrganizationAssignmentStatus::Active,
                'is_current' => true,
                'starts_at' => now()->subYear(),
            ],
        );

        OrganizationAssignment::query()->updateOrCreate(
            [
                'organization_position_id' => $chairPosition->id,
                'full_name_snapshot' => 'Dedi Tri Setiawan',
            ],
            [
                'organization_unit_id' => $osisUnit->id,
                'student_profile_id' => $student->id,
                'user_id' => $studentUser?->id,
                'full_name_snapshot' => 'Dedi Tri Setiawan',
                'status' => OrganizationAssignmentStatus::Active,
                'is_current' => true,
                'starts_at' => now()->subMonths(6),
            ],
        );

        OrganizationAssignment::query()->updateOrCreate(
            [
                'organization_position_id' => $principalPosition->id,
                'full_name_snapshot' => 'Drs. Ahmad Maulana',
            ],
            [
                'organization_unit_id' => $managementUnit->id,
                'status' => OrganizationAssignmentStatus::Archived,
                'is_current' => false,
                'starts_at' => now()->subYears(5),
                'ends_at' => now()->subYears(2),
                'biography' => 'Arsip kepemimpinan sebelumnya yang dipertahankan sebagai catatan historis sekolah.',
            ],
        );

        OrganizationAssignment::query()->updateOrCreate(
            [
                'organization_position_id' => $chairPosition->id,
                'full_name_snapshot' => 'Rina Maharani',
            ],
            [
                'organization_unit_id' => $osisUnit->id,
                'status' => OrganizationAssignmentStatus::Completed,
                'is_current' => false,
                'starts_at' => now()->subYears(2),
                'ends_at' => now()->subYear(),
                'biography' => 'Arsip kepengurusan OSIS periode sebelumnya untuk kebutuhan riwayat organisasi siswa.',
            ],
        );

        $newsCategory = ArticleCategory::query()->updateOrCreate(
            ['slug' => 'jurnalistik'],
            ['name' => 'Jurnalistik', 'description' => 'Liputan kegiatan sekolah.', 'is_active' => true],
        );

        $tag = Tag::query()->updateOrCreate(
            ['slug' => 'jurnalistiksmanten'],
            ['name' => 'JURNALISTIKSMANTEN'],
        );

        $article = Article::query()->updateOrCreate(
            ['slug' => 'panen-karya-project-p5-2026'],
            [
                'article_category_id' => $newsCategory->id,
                'author_user_id' => $journalist->id,
                'title' => 'Panen Karya Project P5 2026',
                'excerpt' => 'Liputan kegiatan Panen Karya dan showcase kreativitas siswa.',
                'body' => 'Dokumentasi Panen Karya, P5, dan etos BATARA KRESNA.',
                'status' => 'published',
                'visibility' => 'public',
                'published_at' => now(),
            ],
        );

        $article->tags()->syncWithoutDetaching([$tag->id]);

        foreach ([
            [
                'provider_media_id' => 'yt-tari-tradisional',
                'title' => 'Tari Tradisional SMAN 1 Tenjo',
                'category' => 'Budaya',
                'description' => 'Sorotan penampilan tari tradisional siswa pada agenda sekolah dan panggung budaya.',
                'published_at' => now()->subDays(12)->toIso8601String(),
                'sort_order' => 1,
            ],
            [
                'provider_media_id' => 'yt-paskibra',
                'title' => 'Latihan Paskibra SMAN 1 Tenjo',
                'category' => 'Kepemimpinan',
                'description' => 'Dokumentasi ritme latihan, disiplin baris-berbaris, dan pembinaan kepemimpinan siswa.',
                'published_at' => now()->subDays(9)->toIso8601String(),
                'sort_order' => 2,
            ],
            [
                'provider_media_id' => 'yt-jurnalistik',
                'title' => 'Jurnalistik SMANTEN Meliput Kegiatan Sekolah',
                'category' => 'Media',
                'description' => 'Konten peliputan kegiatan sekolah yang disiapkan untuk alur feed video publik.',
                'published_at' => now()->subDays(6)->toIso8601String(),
                'sort_order' => 3,
            ],
            [
                'provider_media_id' => 'yt-adiwiyata',
                'title' => 'Gerakan Adiwiyata SMAN 1 Tenjo',
                'category' => 'Lingkungan',
                'description' => 'Cerita pembiasaan lingkungan dan gerakan sekolah hijau yang berjalan secara kolektif.',
                'published_at' => now()->subDays(4)->toIso8601String(),
                'sort_order' => 4,
            ],
        ] as $video) {
            MediaAsset::query()->updateOrCreate(
                ['provider_media_id' => $video['provider_media_id']],
                [
                    'uploader_user_id' => $journalist->id,
                    'media_type' => MediaType::ExternalVideo,
                    'visibility' => PortfolioVisibility::Public,
                    'provider' => 'youtube',
                    'external_url' => null,
                    'sort_order' => $video['sort_order'],
                    'metadata' => [
                        'title' => $video['title'],
                        'category' => $video['category'],
                        'description' => $video['description'],
                        'published_at' => $video['published_at'],
                        'thumbnail_url' => null,
                    ],
                ],
            );
        }
    }
}
