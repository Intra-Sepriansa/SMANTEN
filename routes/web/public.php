<?php

use App\Http\Controllers\PublicSiteController;
use App\Http\Middleware\TrackPublicPageVisit;
use Illuminate\Support\Facades\Route;

Route::middleware(TrackPublicPageVisit::class)->controller(PublicSiteController::class)->group(function (): void {
    Route::get('/sitemap.xml', 'sitemap')->name('sitemap');
    Route::get('/', 'home')->name('home');
    Route::get('/profil', 'profile')->name('profile');
    Route::get('/akademik', 'akademik')->name('akademik');
    Route::get('/kesiswaan', 'kesiswaan')->name('kesiswaan');
    Route::get('/ppdb', 'ppdb')->name('ppdb');
    Route::get('/media', 'media')->name('media');
    Route::get('/layanan', 'layanan')->name('layanan');
    Route::get('/dokumen', 'documents')->name('documents');
    Route::get('/berita', 'beritaIndex')->name('berita.index');
    Route::get('/berita/{slug}', 'beritaShow')->name('berita.show');
    Route::get('/organisasi', 'organization')->name('organization');
    Route::get('/guru', 'guru')->name('guru');
    Route::get('/ekstrakurikuler', 'extracurricular')->name('extracurricular');
    Route::get('/alumni', 'alumni')->name('alumni');
    Route::get('/alumni/tulis-cerita', 'alumniWriteStory')->name('alumni.write-story');
    Route::get('/alumni/cerita/{slug}', 'alumniStoryShow')->name('alumni.story.show');
    Route::get('/alumni/profil/{slug}', 'alumniProfileShow')->name('alumni.profile.show');
    Route::get('/virtual-tour', 'virtualTour')->name('virtual-tour');
});
