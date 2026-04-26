<?php

use App\Enums\OrganizationAssignmentStatus;
use App\Enums\OrganizationScope;
use App\Models\OrganizationAssignment;
use App\Models\OrganizationPosition;
use App\Models\OrganizationUnit;
use Inertia\Testing\AssertableInertia as Assert;

it('renders the public website routes for guests', function (string $routeName, string $component): void {
    $this->get(route($routeName))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component($component));
})->with([
    ['home', 'public/home'],
    ['profile', 'public/profile'],
    ['akademik', 'public/akademik'],
    ['kesiswaan', 'public/kesiswaan'],
    ['kesiswaan.osis-mpk', 'public/kesiswaan/osis-mpk'],
    ['kesiswaan.prestasi-siswa', 'public/kesiswaan/prestasi-siswa'],
    ['kesiswaan.beasiswa', 'public/kesiswaan/beasiswa'],
    ['kesiswaan.bimbingan-konseling', 'public/kesiswaan/bimbingan-konseling'],
    ['ppdb', 'public/ppdb'],
    ['media', 'public/media'],
    ['layanan', 'public/layanan'],
    ['documents', 'public/documents'],
    ['organization', 'public/organization'],
    ['guru', 'public/guru'],
    ['extracurricular', 'public/extracurricular'],
    ['alumni', 'public/alumni'],
    ['alumni.write-story', 'public/alumni-write-story'],
    ['virtual-tour', 'public/virtual-tour'],
]);

it('renders the ppdb hero card swap highlights', function (): void {
    $ppdbPage = file_get_contents(resource_path('js/pages/public/ppdb.tsx'));
    $cardSwap = file_get_contents(resource_path('js/components/CardSwap.tsx'));

    expect($ppdbPage)
        ->toContain("import CardSwap, { Card } from '@/components/CardSwap';")
        ->toContain('const heroSwapCards = [')
        ->toContain('<CardSwap')
        ->toContain('Mulai Siapkan Berkas')
        ->toContain('Cek Jarak Domisili');

    expect($cardSwap)
        ->toContain('prefers-reduced-motion')
        ->toContain('pauseOnHover')
        ->toContain('tlRef.current?.kill()');
});

it('renders the ppdb zonasi cubes matrix', function (): void {
    $ppdbPage = file_get_contents(resource_path('js/pages/public/ppdb.tsx'));
    $cubes = file_get_contents(resource_path('js/components/Cubes.tsx'));

    expect($ppdbPage)
        ->toContain("import Cubes from '@/components/Cubes';")
        ->toContain('Matrix Zonasi')
        ->toContain('<Cubes')
        ->toContain('Zona Reaktif')
        ->toContain('Pusat sekolah tetap menjadi acuan');

    expect($cubes)
        ->toContain('prefersReducedMotion')
        ->toContain('triggerRipple')
        ->toContain('handlePointerMove');
});

it('keeps the hero carousel news cta in a lighter white card style', function (): void {
    $heroCarousel = file_get_contents(resource_path('js/components/public/hero-carousel.tsx'));

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('public/home'));

    expect($heroCarousel)
        ->toContain('w-full max-w-[22rem]')
        ->toContain('rounded-[1.75rem] border border-white/70 bg-white/92')
        ->toContain('shadow-[0_26px_70px_-32px_rgba(15,23,42,0.58)]')
        ->toContain('justify-between gap-3 px-4 py-4 sm:min-w-[23rem] sm:px-5')
        ->toContain('rounded-[1.1rem] border border-slate-200/90 bg-white text-(--school-gold-500)')
        ->toContain('font-bold tracking-[0.14em] text-(--school-ink) uppercase')
        ->toContain('rounded-[1rem] border border-slate-200/90 bg-slate-50 text-(--school-ink)')
        ->not->toContain('bg-[linear-gradient(135deg,rgba(22,121,111,0.96),rgba(15,91,85,0.98))]')
        ->not->toContain('bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.34)_50%,transparent_78%)]')
        ->not->toContain('const prefersReducedMotion = useReducedMotion();');
});

it('keeps home dark-surface labels readable and expands the ppdb spotlight for mobile', function (): void {
    $homePage = file_get_contents(resource_path('js/pages/public/home.tsx'));

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('public/home'));

    expect($homePage)
        ->toContain("import { ppdb as ppdbRoute } from '@/actions/App/Http/Controllers/PublicSiteController';")
        ->toContain('rounded-2xl border border-white/18 bg-[linear-gradient(180deg,rgba(4,47,46,0.82),rgba(4,47,46,0.68))]')
        ->toContain('text-(--school-gold-400)')
        ->toContain('rounded-full border border-white/22 bg-black/20 px-4 py-2')
        ->toContain('text-white/92 uppercase')
        ->toContain('text-white/90 uppercase')
        ->toContain('mx-auto max-w-6xl')
        ->toContain('sm:px-8 sm:pt-8 sm:pb-10')
        ->toContain('Jarak Domisili')
        ->toContain('Kuota Terbuka')
        ->toContain('Simulasi Zona')
        ->toContain('grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4')
        ->toContain('min-h-[10.5rem]')
        ->toContain('href={ppdbRoute()}')
        ->not->toContain('href="/ppdb"')
        ->not->toContain('text-(--school-gold)');
});

it('does not clip the desktop navbar dropdown container', function (): void {
    $layoutSource = file_get_contents(resource_path('js/layouts/public-layout.tsx'));
    $cssSource = file_get_contents(resource_path('css/app.css'));

    $this->get(route('organization'))->assertOk();

    expect($layoutSource)
        ->toContain('sticky top-0 z-50 border-b')
        ->not->toContain('sticky top-0 z-50 overflow-hidden border-b')
        ->toContain('const DESKTOP_DROPDOWN_WIDTH_CLASS =')
        ->toContain('function getDesktopDropdownPosition(')
        ->toContain("return 'left-0 translate-x-0';")
        ->toContain("return 'right-2 left-auto translate-x-0';")
        ->toContain('w-[min(46rem,calc(100vw-2.5rem))]')
        ->toContain('max-w-[calc(100vw-2.5rem)]')
        ->not->toContain('w-[min(52rem,calc(100vw-2rem))]')
        ->not->toContain('w-[min(56rem,84vw)]');

    expect($cssSource)
        ->toContain('.public-typography')
        ->toContain('text-rendering: optimizeLegibility')
        ->toContain('text-wrap: balance')
        ->toContain('text-wrap: pretty');
});

it('keeps the desktop navbar centered with balanced side slots', function (): void {
    $layoutSource = file_get_contents(resource_path('js/layouts/public-layout.tsx'));

    $this->get(route('home'))
        ->assertOk()
        ->assertDontSee('hidden lg:block lg:w-0 lg:shrink-0', false)
        ->assertSee(
            'hidden lg:flex lg:min-w-max lg:items-center lg:justify-end',
            false,
        );

    expect($layoutSource)
        ->not->toContain("compact={currentPath !== '/'}")
        ->toContain('<SchoolMark compact />');
});

it('renders desktop menu triggers for sections with submenu', function (): void {
    $navigationSource = file_get_contents(resource_path('js/lib/public-content.ts'));
    $layoutSource = file_get_contents(resource_path('js/layouts/public-layout.tsx'));
    $portalSettingsSource = file_get_contents(resource_path('js/lib/public-portal-settings.ts'));

    $this->get(route('home'))->assertOk();

    expect($navigationSource)
        ->toContain("label: 'Beranda'")
        ->toContain("label: 'Profil'")
        ->toContain("label: 'Komunitas'")
        ->not->toContain("label: 'Komunitas Sekolah'")
        ->toContain("label: 'Akademik'")
        ->toContain("label: 'Kesiswaan'")
        ->toContain("label: 'PPDB'")
        ->toContain("label: 'Informasi'")
        ->toContain('Struktur Organisasi')
        ->toContain('Tenaga Pendidik')
        ->toContain('Forum Alumni')
        ->toContain('Tulis Cerita')
        ->toContain('Kurikulum Merdeka')
        ->toContain('Projek P5')
        ->toContain('Ekstrakurikuler')
        ->toContain('Kesiswaan')
        ->toContain('OSIS & MPK')
        ->toContain("href: '/kesiswaan/osis-mpk'")
        ->toContain('Prestasi Siswa')
        ->toContain("href: '/kesiswaan/prestasi-siswa'")
        ->toContain('Beasiswa')
        ->toContain("href: '/kesiswaan/beasiswa'")
        ->toContain('Bimbingan Konseling')
        ->toContain("href: '/kesiswaan/bimbingan-konseling'")
        ->not->toContain('Layanan Siswa Terpadu')
        ->not->toContain("href: '/kesiswaan#layanan-siswa-terpadu'")
        ->toContain('Dokumentasi')
        ->toContain("description: 'Galeri foto dan video sekolah'")
        ->toContain('Layanan')
        ->toContain('Dokumen')
        ->not->toContain("href: '/media#karya-unggulan'")
        ->not->toContain("href: '/media#galeri-foto'")
        ->not->toContain("href: '/media#video-sekolah'")
        ->not->toContain("href: '/layanan#pusat-layanan'")
        ->not->toContain("href: '/layanan#desk-konsultasi'")
        ->not->toContain("href: '/layanan#faq-layanan'")
        ->not->toContain("href: '/layanan#kontak-layanan'")
        ->not->toContain("href: '/dokumen#unduhan'")
        ->not->toContain("href: '/dokumen#formulir'")
        ->not->toContain("href: '/dokumen#panduan'");

    expect(substr_count($navigationSource, 'children: ['))
        ->toBe(5);

    expect($layoutSource)
        ->toContain('function getNavigationSubmenuItems(')
        ->toContain("): NonNullable<NavItem['children']> {")
        ->toContain('function hasNavigationSubmenu(item: NavItem): boolean')
        ->toContain('return getNavigationSubmenuItems(item).length > 0;')
        ->toContain('function normalizeNavigationHref(href: string): string')
        ->toContain("const [hrefWithoutQuery] = href.split('?');")
        ->toContain('function getCurrentNavigationLocation(pageUrl: string): string')
        ->toContain('window.location.pathname')
        ->toContain('window.location.hash')
        ->not->toContain('chips:')
        ->not->toContain('presentation.chips')
        ->not->toContain('child.description &&')
        ->toContain('public-typography min-h-screen')
        ->toContain('Portal Sekolah')
        ->not->toContain('Portal Publik Terintegrasi')
        ->not->toContain('Quick Move')
        ->not->toContain('Explore')
        ->not->toContain('Masuk ke overview')
        ->toContain('const seenHrefs = new Set<string>();')
        ->toContain('const childHref = normalizeNavigationHref(child.href);')
        ->toContain('const isDuplicateParentEntry =')
        ->toContain('childHref === parentHref && child.label === item.label')
        ->toContain('if (isDuplicateParentEntry || seenHrefs.has(childHref))')
        ->toContain('seenHrefs.add(childHref);')
        ->toContain('const dropdownPositionClass =')
        ->toContain('getDesktopDropdownPosition(')
        ->toContain('const submenuItems =')
        ->toContain('{submenuItems.map(')
        ->toContain(
            'if (hasNavigationSubmenu(item)) {',
        )
        ->not->toContain('const seenPaths = new Set<string>();')
        ->not->toContain('const childPath = normalizeNavigationPath(child.href);')
        ->not->toContain('childPath === parentPath');

    expect($portalSettingsSource)
        ->toContain("href === '/organisasi' && label === 'Komunitas Sekolah'")
        ->toContain("return 'Komunitas';");
});

it('keeps mobile submenu navigation predictable on touch devices', function (): void {
    $layoutSource = file_get_contents(resource_path('js/layouts/public-layout.tsx'));

    $this->get(route('extracurricular.show', 'paskibra'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/extracurricular-show')
            ->where('slug', 'paskibra'));

    expect($layoutSource)
        ->toContain('function getMobileSubmenuId(href: string): string')
        ->toContain('const toggleMobileSection = useCallback((href: string) => {')
        ->toContain('setMobileExpanded((currentExpanded) =>')
        ->toContain('currentExpanded === href ? null : href')
        ->toContain('const resetNavigationState = window.setTimeout(() => {')
        ->toContain('closeMobileNavigation();')
        ->toContain('window.clearTimeout(resetNavigationState);')
        ->toContain('}, [closeMobileNavigation, currentPath]);')
        ->toContain('className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left touch-manipulation"')
        ->toContain('aria-controls={')
        ->toContain('id={submenuId}')
        ->toContain('touch-manipulation rounded-full border border-white/80 bg-white/82 px-3.5 py-2 text-sm font-semibold text-(--school-ink)')
        ->toContain('text-sm font-semibold text-(--school-green-700) touch-manipulation transition-all hover:bg-white')
        ->toContain('<ArrowUpRight className="size-4 shrink-0" />')
        ->not->toContain('className="flex min-w-0 flex-1 items-start justify-between gap-4 px-4 py-4"')
        ->not->toContain('className="grid w-14 shrink-0 place-items-center border-l border-black/5 text-(--school-muted) transition-colors hover:bg-(--school-green-50) hover:text-(--school-green-700)"');
});

it('boots the inertia client only after the app root is available', function (): void {
    $appSource = file_get_contents(resource_path('js/app.tsx'));
    $viteConfigSource = file_get_contents(base_path('vite.config.ts'));
    $appBladeSource = file_get_contents(resource_path('views/app.blade.php'));
    $ssrSource = file_get_contents(resource_path('js/ssr.tsx'));

    $this->get(route('documents'))
        ->assertOk()
        ->assertSee('id="app"', false)
        ->assertSee('<link rel="icon" href="/images/logo_clean.png" type="image/png">', false)
        ->assertSee('<link rel="apple-touch-icon" href="/images/logo_clean.png">', false)
        ->assertSee('Dokumen & Unduhan | SMAN 1 Tenjo', false)
        ->assertDontSee('- Laravel', false);

    expect($appSource)
        ->toContain("const appName = 'SMAN 1 Tenjo';")
        ->toContain('function formatAppTitle(title?: string): string {')
        ->toContain('return title.includes(appName) ? title : `${title} - ${appName}`;')
        ->toContain("const INERTIA_APP_ID = 'app';")
        ->toContain('const MAX_BOOTSTRAP_ATTEMPTS = 120;')
        ->toContain('__smantenInertiaBootstrapped?: boolean;')
        ->toContain('function startInertiaApp(): void {')
        ->toContain('if (window.__smantenInertiaBootstrapped) {')
        ->toContain('window.__smantenInertiaBootstrapped = true;')
        ->toContain('document.getElementById(INERTIA_APP_ID)')
        ->toContain('window.requestAnimationFrame(() => {')
        ->toContain('bootstrapInertiaApp(attempt + 1);')
        ->toContain('document.readyState === \'loading\'')
        ->toContain('document.addEventListener(\'DOMContentLoaded\', () => {')
        ->toContain('initializeTheme();')
        ->toContain('console.error(');

    expect($ssrSource)
        ->toContain("const appName = 'SMAN 1 Tenjo';")
        ->toContain('function formatAppTitle(title?: string): string {')
        ->toContain('return title.includes(appName) ? title : `${title} - ${appName}`;')
        ->not->toContain('import.meta.env.VITE_APP_NAME');

    expect($appBladeSource)
        ->toContain('<link rel="icon" href="/images/logo_clean.png" type="image/png">')
        ->toContain('<link rel="apple-touch-icon" href="/images/logo_clean.png">')
        ->toContain('<title>SMAN 1 Tenjo</title>')
        ->not->toContain('/favicon.ico')
        ->not->toContain('/favicon.svg')
        ->not->toContain('/apple-touch-icon.png');

    expect($viteConfigSource)
        ->toContain("const viteHost = '127.0.0.1';")
        ->toContain('const vitePort = 5173;')
        ->toContain('const viteAllowedOrigins = [')
        ->toContain('/^https?:\\/\\/smanten\\.test$/i,')
        ->toContain('/^https?:\\/\\/127\\.0\\.0\\.1(?::\\d+)?$/,')
        ->toContain('/^https?:\\/\\/localhost(?::\\d+)?$/,')
        ->toContain('server: {')
        ->toContain('host: viteHost,')
        ->toContain('port: vitePort,')
        ->toContain('strictPort: true,')
        ->toContain('origin: `http://${viteHost}:${vitePort}`,')
        ->toContain('cors: {')
        ->toContain('origin: viteAllowedOrigins,')
        ->toContain('hmr: {')
        ->toContain('protocol: \'ws\',');
});

it('renders flowing menu strips in the desktop navigation dropdown', function (): void {
    $layoutSource = file_get_contents(resource_path('js/layouts/public-layout.tsx'));
    $flowingMenuSource = file_get_contents(resource_path('js/components/FlowingMenu.tsx'));

    $this->get(route('organization'))->assertOk();

    expect($layoutSource)
        ->toContain("import FlowingMenu from '@/components/FlowingMenu';")
        ->toContain("import type { FlowingMenuItemData } from '@/components/FlowingMenu';")
        ->toContain('const DEFAULT_FLOWING_MENU_POSITIONS = [')
        ->toContain('function buildDesktopFlowingMenuItems(')
        ->toContain("heroImage: '/images/sekolah/guru_mengajar.jpg'")
        ->toContain("heroImage: '/images/profil/hero-banner.png'")
        ->toContain('flowingMenuItems =')
        ->toContain('<FlowingMenu')
        ->toContain('imagePosition:')
        ->toContain('menuImagePositions:')
        ->toContain('presentation.heroImagePosition');

    expect($flowingMenuSource)
        ->toContain('export interface FlowingMenuItemData')
        ->toContain('imagePosition?: string;')
        ->toContain('imageSize?: string;')
        ->toContain('ResizeObserver')
        ->toContain('prefersReducedMotion')
        ->toContain('backgroundPosition: imagePosition')
        ->toContain('prefetch');
});

it('renders the documents and downloads page with the folder animation', function (): void {
    $documentsPage = file_get_contents(resource_path('js/pages/public/documents.tsx'));
    $folderComponent = file_get_contents(resource_path('js/components/reactbits/folder.tsx'));

    $this->get(route('documents'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('public/documents'));

    expect($documentsPage)
        ->toContain('Unduhan sekolah.')
        ->toContain('id="unduhan"')
        ->toContain("from '@/components/reactbits/folder'")
        ->toContain('documentGroups')
        ->toContain('downloadItems')
        ->toContain('min-h-[320px] overflow-visible')
        ->toContain('top-[63%]');

    expect($folderComponent)
        ->toContain('darkenColor')
        ->toContain('handlePaperMouseMove')
        ->toContain('group-hover:[transform:skew(15deg)_scaleY(0.6)]')
        ->toContain('const isOpen = pinnedOpen || hovered;')
        ->toContain('const handleMouseEnter = () => {')
        ->toContain('const handleMouseLeave = () => {')
        ->toContain('translate(-130%, -92%) rotate(-17deg)');
});

it('renders the guru page using profile cards bound to teacher data', function (): void {
    $unit = OrganizationUnit::query()->create([
        'scope' => OrganizationScope::SchoolManagement,
        'name' => 'Tim Numerasi',
        'slug' => 'tim-numerasi',
        'description' => 'Koordinasi pengajaran numerasi.',
        'sort_order' => 1,
        'is_active' => true,
    ]);

    $position = OrganizationPosition::query()->create([
        'organization_unit_id' => $unit->id,
        'scope' => OrganizationScope::SchoolManagement,
        'title' => 'Guru Matematika',
        'slug' => 'guru-matematika',
        'hierarchy_level' => 2,
        'is_unique_holder' => false,
        'description' => 'Pengampu literasi numerasi.',
    ]);

    OrganizationAssignment::query()->create([
        'organization_unit_id' => $unit->id,
        'organization_position_id' => $position->id,
        'full_name_snapshot' => 'Siti Rahmawati',
        'status' => OrganizationAssignmentStatus::Active,
        'is_current' => true,
        'sort_order' => 1,
        'biography' => 'Pembimbing numerasi lintas kelas dan penggerak pembelajaran yang terstruktur.',
        'starts_at' => now()->subYear(),
        'metadata' => [],
    ]);

    $guruPage = file_get_contents(resource_path('js/pages/public/guru.tsx'));
    $profileCardComponent = file_get_contents(resource_path('js/components/ProfileCard.tsx'));

    $this->get(route('guru'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/guru')
            ->where('leadership.0.name', 'Siti Rahmawati')
            ->where('leadership.0.position', 'Guru Matematika')
            ->where('leadership.0.unit', 'Tim Numerasi'))
        ->assertSeeText('Siti Rahmawati')
        ->assertSeeText('Guru Matematika');

    expect($guruPage)
        ->toContain("from '@/components/ProfileCard'")
        ->toContain('<ProfileCard')
        ->toContain('const genericTeacherLabels = new Set([')
        ->toContain('resolveTeacherDisplayTitle(')
        ->toContain('resolveTeacherAvatarUrl(')
        ->toContain('/images/contoh.jpeg')
        ->toContain('showUserInfo={false}')
        ->toContain('className="mx-auto w-full max-w-[19rem]"')
        ->not->toContain('node.biography ??')
        ->not->toContain('Hubungi Guru')
        ->not->toContain('miniAvatarUrl={node.avatarUrl}')
        ->not->toContain('behindGlowEnabled');

    expect($profileCardComponent)
        ->toContain('function getNameFontSize(name: string): string')
        ->toContain("whiteSpace: 'nowrap'")
        ->toContain('const DEFAULT_INNER_GRADIENT =')
        ->toContain('const PLACEHOLDER_INNER_GRADIENT =')
        ->toContain('const hasAvatarImage = Boolean(')
        ->toContain('objectFit: \'cover\'')
        ->toContain('translateZ(0) rotateX(var(--rotate-y)) rotateY(var(--rotate-x))')
        ->toContain('fontSize: nameFontSize')
        ->toContain('fontSize: titleFontSize')
        ->not->toContain('node.biography ??');
});

it('renders advanced extracurricular catalog and detail pages', function (): void {
    $catalogSource = file_get_contents(resource_path('js/pages/public/extracurricular.tsx'));
    $detailSource = file_get_contents(resource_path('js/pages/public/extracurricular-show.tsx'));
    $contentSource = file_get_contents(resource_path('js/lib/extracurricular-content.ts'));
    $domeGallerySource = file_get_contents(resource_path('js/components/DomeGallery.tsx'));
    $controllerSource = file_get_contents(app_path('Http/Controllers/PublicSiteController.php'));
    $routeSource = file_get_contents(base_path('routes/web/public.php'));

    $this->get(route('extracurricular'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/extracurricular')
            ->has('school.name')
            ->has('featuredArticles'));

    $this->get(route('extracurricular.show', 'paskibra'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/extracurricular-show')
            ->where('slug', 'paskibra')
            ->has('school.name'));

    $this->get('/ekstrakurikuler/unit-tidak-ada')
        ->assertNotFound();

    expect($routeSource)
        ->toContain("Route::get('/ekstrakurikuler/{slug}', 'extracurricularShow')->name('extracurricular.show');");

    expect($controllerSource)
        ->toContain('private const EXTRACURRICULAR_SLUGS = [')
        ->toContain('public function extracurricularShow(string $slug): Response')
        ->toContain('abort_unless(in_array($slug, self::EXTRACURRICULAR_SLUGS, true), 404);')
        ->toContain("route('extracurricular.show', \$slug)");

    expect($contentSource)
        ->toContain("slug: 'paskibra'")
        ->toContain("slug: 'jurnalistik'")
        ->toContain('headline:')
        ->toContain('fit:')
        ->toContain('routine:')
        ->toContain('getRelatedExtracurricularPrograms');

    expect($catalogSource)
        ->toContain("const [searchQuery, setSearchQuery] = useState('');")
        ->toContain('const [spotlightSlug, setSpotlightSlug] = useState<string | null>(')
        ->toContain('Hover kartu untuk mengganti spotlight.')
        ->toContain('Spotlight Unit')
        ->toContain('DomeGallery')
        ->toContain('Galeri Eskul')
        ->toContain('Satu bentang visual untuk seluruh unit.')
        ->toContain('overlayBlurColor="transparent"')
        ->toContain("program.image.startsWith('/images/eskul/')")
        ->toContain("program.image !== '/images/eskul/collage.png'")
        ->toContain('Cari unit, fokus, atau bentuk tampil')
        ->toContain('href={extracurricularShow({')
        ->toContain('setSpotlightSlug(program.slug)')
        ->not->toContain('bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.92),_rgba(2,6,23,1))]')
        ->not->toContain('id="publikasi"')
        ->not->toContain('Publikasi Kegiatan')
        ->not->toContain('Berita dan dokumentasi kegiatan ekskul.')
        ->not->toContain('Lihat Semua Berita')
        ->not->toContain('Video Showcase')
        ->not->toContain('VideoGrid');

    expect($detailSource)
        ->toContain('getExtracurricularProgramBySlug')
        ->toContain('getRelatedExtracurricularPrograms')
        ->toContain('Kembali ke katalog')
        ->toContain('Fokus Utama')
        ->toContain('Ritme Pembinaan')
        ->toContain('Unit Terkait');

    expect($domeGallerySource)
        ->toContain("img.style.cssText = 'width:100%; height:100%; object-fit:cover; filter:none;';")
        ->toContain('filter: `var(--image-filter, ${grayscale ? \'grayscale(1)\' : \'none\'})`');
});

it('includes extracurricular detail pages in the public sitemap', function (): void {
    $this->get('/sitemap.xml')
        ->assertOk()
        ->assertSee(route('extracurricular.show', 'paskibra'), false)
        ->assertSee(route('extracurricular.show', 'futsal'), false)
        ->assertSee(route('extracurricular.show', 'tari-tradisional'), false);
});

it('moves portal access to the upper quick links and removes the ppdb cta button', function (): void {
    $this->get(route('home'))
        ->assertOk()
        ->assertSeeText('Masuk Portal')
        ->assertDontSeeText('Cek Zona PPDB');
});

it('renders the strategic partner logo loop below the home hero', function (): void {
    $homePage = file_get_contents(resource_path('js/pages/public/home.tsx'));
    $partnerSection = file_get_contents(resource_path('js/components/public/partner-logo-loop-section.tsx'));
    $heroCarouselSource = file_get_contents(resource_path('js/components/public/hero-carousel.tsx'));

    expect($homePage)
        ->toContain('PartnerLogoLoopSection')
        ->toContain('<HeroCarousel />')
        ->toContain('<PartnerLogoLoopSection />');

    expect($partnerSection)
        ->toContain('id="mitra-sekolah"')
        ->toContain('Logo kerja sama SMAN 1 Tenjo')
        ->toContain('/images/partners/provinsi-jawa-barat.svg')
        ->toContain('/images/logo_clean.png')
        ->toContain('/images/partners/kurikulum-merdeka.svg')
        ->toContain('/images/partners/merdeka-belajar.png')
        ->toContain('/images/partners/merdeka-mengajar.png')
        ->toContain('/images/partners/tut-wuri-handayani.svg')
        ->toContain('/images/partners/adiwiyata.png')
        ->toContain('Provinsi Jawa Barat')
        ->toContain('Adiwiyata')
        ->toContain('max-h-10 md:max-h-[4.9rem]')
        ->toContain('max-h-11 md:max-h-[4.8rem]')
        ->toContain('max-h-8 max-w-24 md:max-h-[3.6rem] md:max-w-[9.8rem]')
        ->toContain('max-h-9 max-w-24 md:max-h-[4.5rem] md:max-w-[9.8rem]')
        ->toContain('max-w-[11rem]')
        ->not->toContain('/images/partners/disdik-jabar.png')
        ->not->toContain('Dinas Pendidikan Jawa Barat')
        ->not->toContain('lucide-react')
        ->not->toContain('rounded-[2rem]')
        ->not->toContain('rounded-[1.5rem]')
        ->not->toContain('rounded-[1.4rem]')
        ->not->toContain('bg-white/82')
        ->not->toContain('backdrop-blur-xl')
        ->not->toContain('Mitra Strategis')
        ->not->toContain('Mitra strategis')
        ->not->toContain('Jejaring yang ikut menguatkan ekosistem SMAN 1 Tenjo.')
        ->not->toContain('Logo dapat diganti menjadi aset resmi kapan saja');

    expect($heroCarouselSource)
        ->toContain("import { index as beritaIndex } from '@/routes/berita';")
        ->toContain('href={beritaIndex()}')
        ->toContain('prefetch')
        ->toContain('group/cta relative mt-6')
        ->toContain('Lihat Berita')
        ->toContain('ArrowUpRight')
        ->not->toContain('bg-[#0E9EE4]')
        ->not->toContain('rounded-none')
        ->not->toContain('absolute right-4 size-5 translate-x-4 opacity-0');
});

it('renders a more compact footer with focused quick access blocks', function (): void {
    $this->get(route('home'))
        ->assertOk()
        ->assertSeeText('Jalur Cepat')
        ->assertSeeText('Kontak Resmi')
        ->assertSeeText('FAQ Layanan')
        ->assertDontSeeText('Kontak Informasi');
});

it('renders explicit photo and video sections inside the media page', function (): void {
    $mediaPage = file_get_contents(resource_path('js/pages/public/media.tsx'));

    $this->get(route('media'))->assertOk();

    expect($mediaPage)
        ->toContain('{ id: \'galeri-foto\', label: \'Galeri Foto\' }')
        ->toContain('{ id: \'video-sekolah\', label: \'Video Sekolah\' }')
        ->toContain('id="galeri-foto"')
        ->toContain('id="video-sekolah"')
        ->toContain('Dokumentasi Sekolah')
        ->toContain('Galeri foto dan video sekolah')
        ->not->toContain('{ id: \'karya-unggulan\'')
        ->not->toContain('id="karya-unggulan"')
        ->not->toContain('Berita & Artikel')
        ->not->toContain('Buka Berita')
        ->not->toContain('beritaIndex')
        ->not->toContain('beritaShow')
        ->not->toContain('Karya & P5')
        ->not->toContain('Projek P5')
        ->not->toContain('Karya siswa');
});

it('keeps the profile page focused on identity instead of duplicating other public pages', function (): void {
    $profileSource = file_get_contents(resource_path('js/pages/public/profile.tsx'));

    $this->get(route('profile'))->assertOk();

    expect($profileSource)
        ->toContain('id="halaman-pendukung"')
        ->toContain('Halaman Pendukung')
        ->toContain('Informasi lanjutan tersedia di halaman khusus.')
        ->not->toContain('id="struktur-organisasi"')
        ->not->toContain('id="kurikulum"')
        ->not->toContain('Lokasi & Kontak')
        ->not->toContain("{ label: 'NPSN', value: school.npsn }")
        ->not->toContain("label: 'Akreditasi'")
        ->not->toContain("label: 'Kurikulum'")
        ->not->toContain("label: 'Jadwal'")
        ->not->toContain('studyScheduleType ?? \'Aktif\'');
});

it('keeps the kesiswaan page focused on internal student affairs sections', function (): void {
    $this->get(route('kesiswaan'))
        ->assertOk()
        ->assertSee('/kesiswaan/osis-mpk', false)
        ->assertSee('/kesiswaan/prestasi-siswa', false)
        ->assertSee('/kesiswaan/beasiswa', false)
        ->assertSee('/kesiswaan/bimbingan-konseling', false)
        ->assertDontSee('id="osis-mpk"', false)
        ->assertDontSee('id="prestasi-siswa"', false)
        ->assertDontSee('id="beasiswa"', false)
        ->assertDontSee('id="bimbingan-konseling"', false)
        ->assertDontSeeText('Publikasi Kesiswaan')
        ->assertDontSee('/kesiswaan#ekstrakurikuler', false);
});

it('renders the refreshed kesiswaan page structure', function (): void {
    $this->get(route('kesiswaan'))
        ->assertOk()
        ->assertSeeText('Pembinaan siswa yang tertata,')
        ->assertSeeText('terarah, dan mudah diakses.')
        ->assertSeeText('Setiap layanan punya halaman sendiri.')
        ->assertSeeText('Menu Terkait')
        ->assertSeeText('Informasi lanjutan tersedia di halaman khusus.');
});

it('renders dedicated student affairs pages without combining their functions', function (
    string $routeName,
    string $heading,
    string $focusCopy,
): void {
    $this->get(route($routeName))
        ->assertOk()
        ->assertSeeText($heading)
        ->assertSeeText($focusCopy)
        ->assertSeeText('tanpa mencampur');
})->with([
    ['kesiswaan.osis-mpk', 'OSIS & MPK', 'Fokus halaman ini hanya organisasi siswa.'],
    ['kesiswaan.prestasi-siswa', 'Prestasi Siswa', 'Fokus halaman ini hanya prestasi siswa.'],
    ['kesiswaan.beasiswa', 'Beasiswa', 'Fokus halaman ini hanya beasiswa.'],
    ['kesiswaan.bimbingan-konseling', 'Bimbingan Konseling', 'Fokus halaman ini hanya Bimbingan Konseling.'],
]);

it('keeps the layanan page as a service hub without repeating the update feed', function (): void {
    $this->get(route('layanan'))
        ->assertOk()
        ->assertDontSeeText('Update Sekolah')
        ->assertDontSeeText('Lihat Semua Update')
        ->assertSeeText('Detail layanan tersedia di halaman terkait.')
        ->assertSeeText('Arahan Akhir')
        ->assertSeeText('Gunakan kontak resmi untuk tindak lanjut.');
});

it('keeps public page copy concise and removes old filler phrases', function (): void {
    $sources = [
        'resources/js/lib/public-content.ts',
        'resources/js/components/public/hero-carousel.tsx',
        'resources/js/components/public/video-grid.tsx',
        'resources/js/components/public/visi-pillar-showcase.tsx',
        'resources/js/pages/public/home.tsx',
        'resources/js/pages/public/profile.tsx',
        'resources/js/pages/public/akademik.tsx',
        'resources/js/pages/public/kesiswaan.tsx',
        'resources/js/pages/public/kesiswaan/osis-mpk.tsx',
        'resources/js/pages/public/kesiswaan/prestasi-siswa.tsx',
        'resources/js/pages/public/kesiswaan/beasiswa.tsx',
        'resources/js/pages/public/kesiswaan/bimbingan-konseling.tsx',
        'resources/js/pages/public/layanan.tsx',
        'resources/js/pages/public/media.tsx',
        'resources/js/pages/public/berita/index.tsx',
        'resources/js/pages/public/guru.tsx',
        'resources/js/pages/public/organization.tsx',
        'resources/js/pages/public/ppdb.tsx',
        'resources/js/pages/public/extracurricular.tsx',
        'resources/js/pages/public/extracurricular-show.tsx',
        'resources/js/pages/public/virtual-tour.tsx',
        'resources/js/pages/public/alumni-write-story.tsx',
    ];

    $combinedSource = collect($sources)
        ->map(fn (string $path): string => file_get_contents(base_path($path)))
        ->implode("\n");

    expect($combinedSource)
        ->not->toContain('bukan sekadar')
        ->not->toContain('terasa hidup')
        ->not->toContain('panggung reputasi')
        ->not->toContain('wajah publik')
        ->not->toContain('lebih usable')
        ->not->toContain('lebih advanced')
        ->not->toContain('project terasa')
        ->not->toContain('Node Aktif')
        ->not->toContain('Slot Adaptif')
        ->not->toContain('Quick Move')
        ->not->toContain('Explore')
        ->not->toContain('Masuk ke overview');
});
