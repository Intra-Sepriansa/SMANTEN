<?php

namespace App\Http\Controllers;

use App\Enums\ArticleStatus;
use App\Enums\OrganizationScope;
use App\Enums\PortfolioItemStatus;
use App\Enums\PortfolioVisibility;
use App\Models\AlumniProfile;
use App\Models\Article;
use App\Models\OrganizationAssignment;
use App\Models\PortfolioItem;
use App\Models\PpdbCycle;
use App\Models\SchoolProfile;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PublicSiteController extends Controller
{
    public function home(): Response
    {
        return Inertia::render('public/home', [
            'school' => $this->schoolPayload(),
            'ppdb' => $this->ppdbPayload(),
            'featuredWorks' => $this->featuredWorksPayload(limit: 3),
            'featuredArticles' => $this->featuredArticlesPayload(limit: 3),
            'leadershipPreview' => $this->organizationPayload(limit: 6),
            'alumniSpotlight' => $this->alumniPayload(limit: 3),
        ]);
    }

    public function profile(): Response
    {
        return Inertia::render('public/profile', [
            'school' => $this->schoolPayload(),
        ]);
    }

    public function ppdb(): Response
    {
        return Inertia::render('public/ppdb', [
            'school' => $this->schoolPayload(),
            'ppdb' => $this->ppdbPayload(),
        ]);
    }

    public function works(): Response
    {
        return Inertia::render('public/works', [
            'school' => $this->schoolPayload(),
            'featuredWorks' => $this->featuredWorksPayload(limit: 12),
        ]);
    }

    public function organization(): Response
    {
        return Inertia::render('public/organization', [
            'school' => $this->schoolPayload(),
            'leadership' => $this->organizationPayload(limit: 24),
        ]);
    }

    public function extracurricular(): Response
    {
        return Inertia::render('public/extracurricular', [
            'school' => $this->schoolPayload(),
            'featuredArticles' => $this->featuredArticlesPayload(limit: 6),
        ]);
    }

    public function alumni(): Response
    {
        return Inertia::render('public/alumni', [
            'school' => $this->schoolPayload(),
            'alumniSpotlight' => $this->alumniPayload(limit: 9),
        ]);
    }

    public function virtualTour(): Response
    {
        return Inertia::render('public/virtual-tour', [
            'school' => $this->schoolPayload(),
        ]);
    }

    public function akademik(): Response
    {
        return Inertia::render('public/akademik', [
            'school' => $this->schoolPayload(),
        ]);
    }

    public function beritaIndex(): Response
    {
        return Inertia::render('public/berita/index', [
            'school' => $this->schoolPayload(),
            'articles' => $this->featuredArticlesPayload(limit: 24),
        ]);
    }

    public function beritaShow(string $slug): Response
    {
        $article = Article::query()
            ->with(['category', 'author'])
            ->where('status', ArticleStatus::Published->value)
            ->where('slug', $slug)
            ->firstOrFail();

        $related = Article::query()
            ->with('category')
            ->where('status', ArticleStatus::Published->value)
            ->where('id', '!=', $article->id)
            ->when($article->article_category_id, fn ($q) => $q->where('article_category_id', $article->article_category_id))
            ->limit(3)
            ->get()
            ->map(fn (Article $a) => [
                'id' => $a->id,
                'title' => $a->title,
                'slug' => $a->slug,
                'category' => $a->category?->name,
            ])
            ->values()
            ->all();

        return Inertia::render('public/berita/show', [
            'article' => [
                'id' => $article->id,
                'title' => $article->title,
                'slug' => $article->slug,
                'body' => $article->body,
                'excerpt' => $article->excerpt,
                'category' => $article->category?->name,
                'authorName' => $article->author?->name,
                'publishedAt' => optional($article->published_at)?->toIso8601String(),
            ],
            'relatedArticles' => $related,
        ]);
    }

    public function karyaShow(string $slug): Response
    {
        $item = PortfolioItem::query()
            ->with(['portfolioProject.p5Theme', 'mediaAssets', 'creator'])
            ->where('status', PortfolioItemStatus::Published->value)
            ->where('slug', $slug)
            ->firstOrFail();

        $gallery = $item->mediaAssets
            ->map(fn ($asset) => [
                'url' => $this->storageUrl($asset->disk, $asset->path),
                'alt' => $asset->original_name ?? $item->title,
            ])
            ->values()
            ->all();

        $related = PortfolioItem::query()
            ->where('status', PortfolioItemStatus::Published->value)
            ->where('visibility', PortfolioVisibility::Public->value)
            ->where('id', '!=', $item->id)
            ->limit(4)
            ->get()
            ->map(fn (PortfolioItem $pi) => [
                'id' => $pi->id,
                'title' => $pi->title,
                'slug' => $pi->slug,
                'itemType' => $pi->item_type,
                'imageUrl' => $pi->mediaAssets->first()
                    ? $this->storageUrl($pi->mediaAssets->first()->disk, $pi->mediaAssets->first()->path)
                    : null,
            ])
            ->values()
            ->all();

        $primaryImage = $item->mediaAssets->first();

        return Inertia::render('public/karya/show', [
            'work' => [
                'id' => $item->id,
                'title' => $item->title,
                'slug' => $item->slug,
                'itemType' => $item->item_type,
                'summary' => $item->summary,
                'body' => $item->summary,
                'priceEstimate' => $item->price_estimate,
                'publishedAt' => optional($item->published_at)?->toIso8601String(),
                'projectTitle' => $item->portfolioProject?->title,
                'themeName' => $item->portfolioProject?->p5Theme?->name,
                'creatorName' => $item->creator?->name,
                'imageUrl' => $primaryImage ? $this->storageUrl($primaryImage->disk, $primaryImage->path) : null,
                'gallery' => $gallery,
            ],
            'relatedWorks' => $related,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    protected function schoolPayload(): array
    {
        $school = SchoolProfile::query()
            ->with([
                'valueStatements' => fn ($query) => $query->where('is_active', true)->orderBy('sort_order'),
            ])
            ->where('is_active', true)
            ->first();

        if (! $school) {
            return [
                'name' => 'SMAN 1 Tenjo',
                'officialName' => 'SMAN 1 TENJO',
                'npsn' => '20231338',
                'accreditation' => 'A',
                'curriculumName' => 'Kurikulum Merdeka',
                'studyScheduleType' => 'Sehari Penuh (5 Hari Kerja)',
                'principalName' => 'Titin Sriwartini',
                'operatorName' => 'Ahmadi Busro',
                'email' => 'smantenjo@yahoo.com',
                'phone' => '02159761066',
                'websiteUrl' => 'http://www.smantenjo.sch.id',
                'address' => 'JL. Raya Tenjo - Parung Panjang KM. 03, Babakan, Tenjo, Kabupaten Bogor, Jawa Barat',
                'location' => [
                    'latitude' => -6.3483,
                    'longitude' => 106.4638,
                ],
                'landAreaSquareMeters' => 11396,
                'studentCount' => 1073,
                'teachingGroupCount' => 30,
                'physicalClassroomCount' => 21,
                'laboratoryCount' => 3,
                'libraryCount' => 2,
                'staffCount' => 50,
                'valueStatements' => [[
                    'key' => 'batara_kresna',
                    'label' => 'BATARA KRESNA',
                    'valueText' => 'Beriman, Bertaqwa, Berkarakter, dan Bebas Narkoba',
                    'description' => 'Pedoman moral autentik SMAN 1 Tenjo.',
                ]],
            ];
        }

        $metadata = $school->metadata ?? [];

        return [
            'name' => $school->name,
            'officialName' => $school->official_name,
            'npsn' => $school->npsn,
            'accreditation' => $school->accreditation,
            'curriculumName' => $school->curriculum_name,
            'studyScheduleType' => $school->study_schedule_type,
            'principalName' => $school->principal_name,
            'operatorName' => $school->operator_name,
            'email' => $school->email,
            'phone' => $school->phone,
            'websiteUrl' => $school->website_url,
            'address' => trim(implode(', ', array_filter([
                $school->street_address,
                $school->hamlet,
                $school->village,
                $school->district,
                $school->city,
                $school->province,
            ]))),
            'location' => [
                'latitude' => (float) $school->latitude,
                'longitude' => (float) $school->longitude,
            ],
            'landAreaSquareMeters' => (float) $school->land_area_square_meters,
            'studentCount' => (int) ($metadata['student_count'] ?? 1073),
            'teachingGroupCount' => (int) ($metadata['teaching_group_count'] ?? 30),
            'physicalClassroomCount' => (int) ($metadata['physical_classroom_count'] ?? 21),
            'laboratoryCount' => (int) ($metadata['laboratory_count'] ?? 3),
            'libraryCount' => (int) ($metadata['library_count'] ?? 2),
            'staffCount' => (int) ($metadata['staff_count'] ?? 50),
            'valueStatements' => $school->valueStatements->map(fn ($statement) => [
                'key' => $statement->key,
                'label' => $statement->label,
                'valueText' => $statement->value_text,
                'description' => $statement->description,
            ])->values(),
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    protected function ppdbPayload(): ?array
    {
        $cycle = PpdbCycle::query()
            ->with('trackQuotas')
            ->latest('application_opens_at')
            ->first();

        if (! $cycle) {
            return null;
        }

        return [
            'id' => $cycle->id,
            'name' => $cycle->name,
            'status' => $cycle->status,
            'capacity' => $cycle->capacity,
            'schoolLatitude' => (float) $cycle->school_latitude,
            'schoolLongitude' => (float) $cycle->school_longitude,
            'zoneRadiusKm' => (float) $cycle->default_zone_radius_km,
            'applicationOpensAt' => optional($cycle->application_opens_at)?->toIso8601String(),
            'applicationClosesAt' => optional($cycle->application_closes_at)?->toIso8601String(),
            'announcementAt' => optional($cycle->announcement_at)?->toIso8601String(),
            'rulesSnapshot' => $cycle->rules_snapshot ?? [],
            'trackQuotas' => $cycle->trackQuotas
                ->sortBy('quota_seats')
                ->values()
                ->map(fn ($quota) => [
                    'trackType' => $quota->track_type?->value ?? $quota->track_type,
                    'quotaPercentage' => (float) $quota->quota_percentage,
                    'quotaSeats' => $quota->quota_seats,
                ]),
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function featuredWorksPayload(int $limit): array
    {
        return PortfolioItem::query()
            ->with(['portfolioProject.p5Theme', 'mediaAssets', 'creator'])
            ->where('status', PortfolioItemStatus::Published->value)
            ->where('visibility', PortfolioVisibility::Public->value)
            ->orderByDesc('is_featured')
            ->orderByDesc('published_at')
            ->limit($limit)
            ->get()
            ->map(function (PortfolioItem $item): array {
                $image = $item->mediaAssets->first();

                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'slug' => $item->slug,
                    'itemType' => $item->item_type,
                    'summary' => $item->summary,
                    'priceEstimate' => $item->price_estimate,
                    'publishedAt' => optional($item->published_at)?->toIso8601String(),
                    'projectTitle' => $item->portfolioProject?->title,
                    'themeName' => $item->portfolioProject?->p5Theme?->name,
                    'creatorName' => $item->creator?->name,
                    'imageUrl' => $image ? $this->storageUrl($image->disk, $image->path) : null,
                ];
            })
            ->values()
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function featuredArticlesPayload(int $limit): array
    {
        return Article::query()
            ->with(['category', 'author'])
            ->where('status', ArticleStatus::Published->value)
            ->where('visibility', PortfolioVisibility::Public->value)
            ->orderByDesc('is_featured')
            ->orderByDesc('published_at')
            ->limit($limit)
            ->get()
            ->map(fn (Article $article) => [
                'id' => $article->id,
                'title' => $article->title,
                'slug' => $article->slug,
                'excerpt' => $article->excerpt,
                'category' => $article->category?->name,
                'authorName' => $article->author?->name,
                'publishedAt' => optional($article->published_at)?->toIso8601String(),
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function organizationPayload(int $limit): array
    {
        return OrganizationAssignment::query()
            ->with(['organizationUnit', 'organizationPosition'])
            ->where('is_current', true)
            ->limit($limit)
            ->get()
            ->sortBy([
                fn (OrganizationAssignment $assignment) => $assignment->organizationPosition?->hierarchy_level ?? 99,
                fn (OrganizationAssignment $assignment) => $assignment->sort_order ?? 99,
                fn (OrganizationAssignment $assignment) => $assignment->organizationPosition?->title ?? '',
            ])
            ->map(fn (OrganizationAssignment $assignment) => [
                'id' => $assignment->id,
                'unit' => $assignment->organizationUnit?->name,
                'unitSlug' => $assignment->organizationUnit?->slug,
                'scope' => $assignment->organizationUnit?->scope?->value ?? OrganizationScope::SchoolManagement->value,
                'position' => $assignment->organizationPosition?->title,
                'positionSlug' => $assignment->organizationPosition?->slug,
                'hierarchyLevel' => $assignment->organizationPosition?->hierarchy_level,
                'name' => $assignment->full_name_snapshot,
                'biography' => $assignment->biography,
                'startsAt' => optional($assignment->starts_at)?->toIso8601String(),
                'isCurrent' => $assignment->is_current,
                'sortOrder' => $assignment->sort_order,
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function alumniPayload(int $limit): array
    {
        return AlumniProfile::query()
            ->where('is_public_profile', true)
            ->orderByDesc('graduation_year')
            ->limit($limit)
            ->get()
            ->map(fn (AlumniProfile $alumnus) => [
                'id' => $alumnus->id,
                'fullName' => $alumnus->full_name,
                'graduationYear' => $alumnus->graduation_year,
                'institutionName' => $alumnus->institution_name,
                'occupationTitle' => $alumnus->occupation_title,
                'city' => $alumnus->city,
                'province' => $alumnus->province,
                'bio' => $alumnus->bio,
            ])
            ->values()
            ->all();
    }

    /**
     * Generate a URL for a file on the given storage disk.
     */
    protected function storageUrl(string $disk, string $path): string
    {
        /** @var FilesystemAdapter $adapter */
        $adapter = Storage::disk($disk);

        return $adapter->url($path);
    }
}
