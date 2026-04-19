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
        ->toContain('Virtual Tour')
        ->toContain('Kurikulum Merdeka')
        ->toContain('Projek P5')
        ->toContain('Ekstrakurikuler')
        ->toContain('Kesiswaan')
        ->toContain('OSIS & MPK')
        ->toContain('Prestasi Siswa')
        ->toContain('Beasiswa')
        ->toContain('Bimbingan Konseling')
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

it('moves portal access to the upper quick links and removes the ppdb cta button', function (): void {
    $this->get(route('home'))
        ->assertOk()
        ->assertSeeText('Masuk Portal')
        ->assertDontSeeText('Cek Zona PPDB');
});

it('renders the strategic partner logo loop below the home hero', function (): void {
    $homePage = file_get_contents(resource_path('js/pages/public/home.tsx'));
    $partnerSection = file_get_contents(resource_path('js/components/public/partner-logo-loop-section.tsx'));

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
    $this->get(route('profile'))
        ->assertOk()
        ->assertDontSee('id="struktur-organisasi"', false)
        ->assertDontSee('id="kurikulum"', false)
        ->assertDontSeeText('Lokasi & Kontak')
        ->assertSee('id="halaman-pendukung"', false)
        ->assertSeeText('Halaman Pendukung')
        ->assertSeeText('Informasi lanjutan tersedia di halaman khusus.');
});

it('keeps the kesiswaan page focused on internal student affairs sections', function (): void {
    $this->get(route('kesiswaan'))
        ->assertOk()
        ->assertSee('id="osis-mpk"', false)
        ->assertSee('id="prestasi-siswa"', false)
        ->assertSee('id="beasiswa"', false)
        ->assertSee('id="bimbingan-konseling"', false)
        ->assertDontSeeText('Publikasi Kesiswaan')
        ->assertDontSee('/kesiswaan#ekstrakurikuler', false);
});

it('renders the refreshed kesiswaan page structure', function (): void {
    $this->get(route('kesiswaan'))
        ->assertOk()
        ->assertSeeText('Pembinaan siswa yang tertata,')
        ->assertSeeText('terarah, dan mudah diakses.')
        ->assertSeeText('Menu Terkait')
        ->assertSeeText('Informasi lanjutan tersedia di halaman khusus.');
});

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
        'resources/js/pages/public/layanan.tsx',
        'resources/js/pages/public/media.tsx',
        'resources/js/pages/public/berita/index.tsx',
        'resources/js/pages/public/guru.tsx',
        'resources/js/pages/public/organization.tsx',
        'resources/js/pages/public/ppdb.tsx',
        'resources/js/pages/public/extracurricular.tsx',
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
