<?php

namespace App\Http\Controllers;

use App\Enums\ArticleStatus;
use App\Enums\OrganizationScope;
use App\Enums\PortfolioItemStatus;
use App\Enums\PortfolioVisibility;
use App\Models\AlumniForumPost;
use App\Models\AlumniProfile;
use App\Models\Article;
use App\Models\OrganizationAssignment;
use App\Models\PortfolioItem;
use App\Models\PpdbCycle;
use App\Models\SchoolProfile;
use App\Services\AlumniForumPostPresenter;
use App\Services\AlumniProfilePresenter;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PublicSiteController extends Controller
{
    private const EXTRACURRICULAR_SLUGS = [
        'paskibra',
        'futsal',
        'rohis',
        'pmr',
        'pramuka',
        'pencak-silat',
        'jurnalistik',
        'tari-tradisional',
    ];

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

    public function media(): Response
    {
        return Inertia::render('public/media', [
            'school' => $this->schoolPayload(),
            'featuredArticles' => $this->featuredArticlesPayload(limit: 8),
            'featuredWorks' => $this->featuredWorksPayload(limit: 6),
        ]);
    }

    public function layanan(): Response
    {
        return Inertia::render('public/layanan', [
            'school' => $this->schoolPayload(),
            'ppdb' => $this->ppdbPayload(),
            'featuredArticles' => $this->featuredArticlesPayload(limit: 3),
        ]);
    }

    public function documents(): Response
    {
        return Inertia::render('public/documents', [
            'school' => $this->schoolPayload(),
        ]);
    }

    public function organization(): Response
    {
        return Inertia::render('public/organization', [
            'school' => $this->schoolPayload(),
            'leadership' => $this->organizationPayload(limit: 24),
        ]);
    }

    public function guru(): Response
    {
        return Inertia::render('public/guru', [
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

    public function extracurricularShow(string $slug): Response
    {
        abort_unless(in_array($slug, self::EXTRACURRICULAR_SLUGS, true), 404);

        return Inertia::render('public/extracurricular-show', [
            'school' => $this->schoolPayload(),
            'slug' => $slug,
        ]);
    }

    public function kesiswaan(): Response
    {
        return Inertia::render('public/kesiswaan', [
            'school' => $this->schoolPayload(),
            'featuredArticles' => $this->featuredArticlesPayload(limit: 4),
        ]);
    }

    public function osisMpk(): Response
    {
        return Inertia::render('public/kesiswaan/osis-mpk', [
            'school' => $this->schoolPayload(),
        ]);
    }

    public function prestasiSiswa(): Response
    {
        return Inertia::render('public/kesiswaan/prestasi-siswa', [
            'school' => $this->schoolPayload(),
        ]);
    }

    public function beasiswa(): Response
    {
        return Inertia::render('public/kesiswaan/beasiswa', [
            'school' => $this->schoolPayload(),
        ]);
    }

    public function bimbinganKonseling(): Response
    {
        return Inertia::render('public/kesiswaan/bimbingan-konseling', [
            'school' => $this->schoolPayload(),
        ]);
    }

    public function sitemap(): HttpResponse
    {
        $schoolUpdatedAt = SchoolProfile::query()
            ->latest('updated_at')
            ->first(['updated_at'])
            ?->updated_at ?? now();

        $staticUrls = collect([
            ['route' => 'home', 'priority' => '1.0', 'changefreq' => 'weekly'],
            ['route' => 'profile', 'priority' => '0.8', 'changefreq' => 'monthly'],
            ['route' => 'akademik', 'priority' => '0.8', 'changefreq' => 'monthly'],
            ['route' => 'kesiswaan', 'priority' => '0.8', 'changefreq' => 'weekly'],
            ['route' => 'kesiswaan.osis-mpk', 'priority' => '0.7', 'changefreq' => 'weekly'],
            ['route' => 'kesiswaan.prestasi-siswa', 'priority' => '0.7', 'changefreq' => 'weekly'],
            ['route' => 'kesiswaan.beasiswa', 'priority' => '0.7', 'changefreq' => 'weekly'],
            ['route' => 'kesiswaan.bimbingan-konseling', 'priority' => '0.7', 'changefreq' => 'weekly'],
            ['route' => 'ppdb', 'priority' => '0.9', 'changefreq' => 'weekly'],
            ['route' => 'media', 'priority' => '0.8', 'changefreq' => 'daily'],
            ['route' => 'layanan', 'priority' => '0.7', 'changefreq' => 'weekly'],
            ['route' => 'documents', 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['route' => 'berita.index', 'priority' => '0.8', 'changefreq' => 'daily'],
            ['route' => 'organization', 'priority' => '0.7', 'changefreq' => 'weekly'],
            ['route' => 'guru', 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['route' => 'extracurricular', 'priority' => '0.7', 'changefreq' => 'weekly'],
            ['route' => 'alumni', 'priority' => '0.9', 'changefreq' => 'daily'],
            ['route' => 'virtual-tour', 'priority' => '0.6', 'changefreq' => 'monthly'],
        ])->map(fn (array $page): array => [
            'loc' => route($page['route']),
            'lastmod' => $schoolUpdatedAt->toAtomString(),
            'changefreq' => $page['changefreq'],
            'priority' => $page['priority'],
        ]);

        $storyUrls = AlumniForumPost::query()
            ->where('moderation_status', 'approved')
            ->where('is_approved', true)
            ->whereNotNull('slug')
            ->latest('updated_at')
            ->get(['slug', 'updated_at'])
            ->map(fn (AlumniForumPost $post): array => [
                'loc' => route('alumni.story.show', $post->slug),
                'lastmod' => ($post->updated_at ?? now())->toAtomString(),
                'changefreq' => 'weekly',
                'priority' => '0.7',
            ]);

        $profileUrls = AlumniProfile::query()
            ->where('is_public_profile', true)
            ->whereNotNull('slug')
            ->latest('updated_at')
            ->get(['slug', 'updated_at'])
            ->map(fn (AlumniProfile $profile): array => [
                'loc' => route('alumni.profile.show', $profile->slug),
                'lastmod' => ($profile->updated_at ?? now())->toAtomString(),
                'changefreq' => 'weekly',
                'priority' => '0.6',
            ]);

        $extracurricularUrls = collect(self::EXTRACURRICULAR_SLUGS)
            ->map(fn (string $slug): array => [
                'loc' => route('extracurricular.show', $slug),
                'lastmod' => $schoolUpdatedAt->toAtomString(),
                'changefreq' => 'weekly',
                'priority' => '0.6',
            ]);

        $urls = $staticUrls
            ->concat($extracurricularUrls)
            ->concat($storyUrls)
            ->concat($profileUrls)
            ->map(function (array $url): string {
                $loc = htmlspecialchars($url['loc'], ENT_XML1);
                $lastmod = htmlspecialchars($url['lastmod'], ENT_XML1);

                return <<<XML
    <url>
        <loc>{$loc}</loc>
        <lastmod>{$lastmod}</lastmod>
        <changefreq>{$url['changefreq']}</changefreq>
        <priority>{$url['priority']}</priority>
    </url>
XML;
            })
            ->implode("\n");

        $xml = <<<XML
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{$urls}
</urlset>
XML;

        return response($xml, 200, ['Content-Type' => 'application/xml; charset=UTF-8']);
    }

    public function alumni(AlumniForumPostPresenter $presenter): Response
    {
        $forumPosts = $presenter->presentMany(
            AlumniForumPost::query()
                ->with([
                    'alumniProfile.forumPosts',
                    'comments' => fn ($query) => $query->where('moderation_status', 'approved')->latest()->limit(3),
                    'reactions',
                ])
                ->where('moderation_status', 'approved')
                ->where('is_approved', true)
                ->orderByDesc('is_featured')
                ->orderByDesc('last_interaction_at')
                ->orderByDesc('created_at')
                ->limit(30)
                ->get()
        );

        return Inertia::render('public/alumni', [
            'school' => $this->schoolPayload(),
            'alumniSpotlight' => $this->alumniPayload(limit: 9),
            'forumPosts' => $forumPosts,
        ]);
    }

    public function alumniWriteStory(): Response
    {
        return Inertia::render('public/alumni-write-story', [
            'school' => $this->schoolPayload(),
        ]);
    }

    public function alumniStoryShow(string $slug, AlumniForumPostPresenter $presenter): Response
    {
        $post = AlumniForumPost::query()
            ->with([
                'alumniProfile.forumPosts',
                'alumniProfile.tracerStudyResponses',
                'comments' => fn ($query) => $query->where('moderation_status', 'approved')->latest()->limit(20),
                'reactions',
            ])
            ->where('slug', $slug)
            ->where('moderation_status', 'approved')
            ->where('is_approved', true)
            ->firstOrFail();

        $post->increment('views_count');
        $post->forceFill(['last_interaction_at' => now()])->saveQuietly();

        $relatedPosts = $presenter->presentMany(
            AlumniForumPost::query()
                ->with([
                    'alumniProfile.forumPosts',
                    'comments' => fn ($query) => $query->where('moderation_status', 'approved')->latest()->limit(3),
                    'reactions',
                ])
                ->where('moderation_status', 'approved')
                ->where('is_approved', true)
                ->whereKeyNot($post->id)
                ->where(function ($query) use ($post): void {
                    $query->where('category', $post->category)
                        ->orWhere('graduation_year', $post->graduation_year)
                        ->orWhere('city', $post->city);
                })
                ->orderByDesc('is_featured')
                ->orderByDesc('last_interaction_at')
                ->limit(4)
                ->get()
        );

        return Inertia::render('public/alumni-story', [
            'school' => $this->schoolPayload(),
            'post' => $presenter->present($post->fresh([
                'alumniProfile.forumPosts',
                'alumniProfile.tracerStudyResponses',
                'comments' => fn ($query) => $query->where('moderation_status', 'approved')->latest()->limit(20),
                'reactions',
            ]), detailed: true),
            'relatedPosts' => $relatedPosts,
        ]);
    }

    public function alumniProfileShow(string $slug, AlumniProfilePresenter $profilePresenter, AlumniForumPostPresenter $postPresenter): Response
    {
        $profile = AlumniProfile::query()
            ->with([
                'forumPosts' => fn ($query) => $query
                    ->with([
                        'alumniProfile.forumPosts',
                        'comments' => fn ($commentQuery) => $commentQuery
                            ->where('moderation_status', 'approved')
                            ->latest()
                            ->limit(3),
                        'reactions',
                    ])
                    ->where('moderation_status', 'approved')
                    ->where('is_approved', true)
                    ->latest(),
                'tracerStudyResponses' => fn ($query) => $query
                    ->where('is_publicly_displayable', true)
                    ->latest('submitted_at'),
            ])
            ->where('slug', $slug)
            ->where('is_public_profile', true)
            ->firstOrFail();

        $latestTracer = $profile->tracerStudyResponses->first();

        return Inertia::render('public/alumni-profile', [
            'school' => $this->schoolPayload(),
            'profile' => [
                ...$profilePresenter->presentSummary($profile),
                'careerCluster' => $profile->career_cluster,
                'contactEmail' => $profile->contact_email,
                'bio' => $profile->bio,
                'stories' => $postPresenter->presentMany($profile->forumPosts),
                'latestTracer' => $latestTracer ? [
                    'status' => $latestTracer->status?->value ?? $latestTracer->status,
                    'currentActivity' => $latestTracer->current_activity,
                    'institutionName' => $latestTracer->institution_name,
                    'major' => $latestTracer->major,
                    'occupationTitle' => $latestTracer->occupation_title,
                    'industry' => $latestTracer->industry,
                    'locationCity' => $latestTracer->location_city,
                    'locationProvince' => $latestTracer->location_province,
                    'startedAt' => optional($latestTracer->started_at)?->toDateString(),
                    'monthlyIncomeRange' => $latestTracer->monthly_income_range,
                    'reflections' => $latestTracer->reflections,
                    'submittedAt' => optional($latestTracer->submitted_at)?->toIso8601String(),
                ] : null,
            ],
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
                'authorName' => $article->metadata['journalist'] ?? $article->author?->name,
                'source' => $article->metadata['source'] ?? null,
                'imageUrl' => $article->metadata['image_url'] ?? null,
                'publishedAt' => optional($article->published_at)?->toIso8601String(),
            ],
            'relatedArticles' => $related,
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
                'authorName' => $article->metadata['journalist'] ?? $article->author?->name,
                'source' => $article->metadata['source'] ?? null,
                'imageUrl' => $article->metadata['image_url'] ?? null,
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
        /** @var AlumniProfilePresenter $presenter */
        $presenter = app(AlumniProfilePresenter::class);

        return $presenter->presentMany(
            AlumniProfile::query()
                ->with('forumPosts')
                ->where('is_public_profile', true)
                ->orderByDesc('graduation_year')
                ->limit($limit)
                ->get()
        );
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
