<?php

use Inertia\Testing\AssertableInertia as Assert;

it('renders the public website routes for guests', function (string $routeName, string $component): void {
    $this->get(route($routeName))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component($component));
})->with([
    ['home', 'public/home'],
    ['profile', 'public/profile'],
    ['akademik', 'public/akademik'],
    ['ppdb', 'public/ppdb'],
    ['documents', 'public/documents'],
    ['organization', 'public/organization'],
    ['guru', 'public/guru'],
    ['extracurricular', 'public/extracurricular'],
    ['alumni', 'public/alumni'],
    ['alumni.write-story', 'public/alumni-write-story'],
    ['virtual-tour', 'public/virtual-tour'],
]);

it('renders desktop menu triggers for sections with submenu', function (): void {
    $this->get(route('home'))
        ->assertOk()
        ->assertSee('aria-haspopup="menu"', false)
        ->assertSeeText('Profil')
        ->assertSeeText('Akademik')
        ->assertSeeText('Dokumen')
        ->assertSeeText('Sekolah');
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
        ->toContain('downloadItems');

    expect($folderComponent)
        ->toContain('darkenColor')
        ->toContain('handlePaperMouseMove')
        ->toContain('group-hover:[transform:skew(15deg)_scaleY(0.6)]');
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
        ->not->toContain('Mitra Strategis')
        ->not->toContain('Jejaring yang ikut menguatkan ekosistem SMAN 1 Tenjo.')
        ->not->toContain('Logo dapat diganti menjadi aset resmi kapan saja');
});
