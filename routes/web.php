<?php

use App\Http\Controllers\Api\Internal\Admin\ArticleController;
use App\Http\Controllers\Api\Internal\Admin\OrganizationAssignmentController;
use App\Http\Controllers\Api\Internal\Admin\PortfolioItemController;
use App\Http\Controllers\Api\Internal\Admin\PpdbReviewController;
use App\Http\Controllers\Api\Internal\Admin\RoleAssignmentController;
use App\Http\Controllers\Api\Internal\Admin\RoomController;
use App\Http\Controllers\Api\Internal\Admin\TimetableEntryController;
use App\Http\Controllers\Api\Internal\Admin\TimetableVersionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InternalDashboardController;
use App\Http\Controllers\PublicSiteController;
use Illuminate\Support\Facades\Route;

Route::controller(PublicSiteController::class)->group(function () {
    Route::get('/sitemap.xml', 'sitemap')->name('sitemap');
    Route::get('/', 'home')->name('home');
    Route::get('/profil', 'profile')->name('profile');
    Route::get('/akademik', 'akademik')->name('akademik');
    Route::get('/ppdb', 'ppdb')->name('ppdb');
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

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::get('dashboard/admin', [InternalDashboardController::class, 'admin'])->name('dashboard.admin');
    Route::get('dashboard/guru', [InternalDashboardController::class, 'guru'])->name('dashboard.guru');
    Route::get('dashboard/siswa', [InternalDashboardController::class, 'siswa'])->name('dashboard.siswa');
    Route::get('dashboard/wali', [InternalDashboardController::class, 'wali'])->name('dashboard.wali');

    Route::prefix('internal-api')->name('internal-api.')->group(function () {
        Route::middleware('role:super_admin,operator_sekolah')->group(function () {
            Route::patch('users/{user}/roles', [RoleAssignmentController::class, 'update'])->name('users.roles.update');

            Route::get('rooms', [RoomController::class, 'index'])->name('rooms.index');
            Route::post('rooms', [RoomController::class, 'store'])->name('rooms.store');
            Route::match(['put', 'patch'], 'rooms/{room}', [RoomController::class, 'update'])->name('rooms.update');

            Route::get('timetable-versions', [TimetableVersionController::class, 'index'])->name('timetable-versions.index');
            Route::post('timetable-versions', [TimetableVersionController::class, 'store'])->name('timetable-versions.store');
            Route::post('timetable-versions/{timetableVersion}/publish', [TimetableVersionController::class, 'publish'])->name('timetable-versions.publish');

            Route::get('timetable-entries', [TimetableEntryController::class, 'index'])->name('timetable-entries.index');
            Route::post('timetable-entries', [TimetableEntryController::class, 'store'])->name('timetable-entries.store');
            Route::match(['put', 'patch'], 'timetable-entries/{timetableEntry}', [TimetableEntryController::class, 'update'])->name('timetable-entries.update');

            Route::post('ppdb-applications/{ppdbApplication}/evaluate', [PpdbReviewController::class, 'evaluate'])->name('ppdb-applications.evaluate');
            Route::patch('ppdb-applications/{ppdbApplication}/status', [PpdbReviewController::class, 'updateStatus'])->name('ppdb-applications.status.update');

            Route::get('organization-assignments', [OrganizationAssignmentController::class, 'index'])->name('organization-assignments.index');
            Route::post('organization-assignments', [OrganizationAssignmentController::class, 'store'])->name('organization-assignments.store');
            Route::match(['put', 'patch'], 'organization-assignments/{organizationAssignment}', [OrganizationAssignmentController::class, 'update'])->name('organization-assignments.update');
            Route::post('organization-assignments/{organizationAssignment}/activate', [OrganizationAssignmentController::class, 'activate'])->name('organization-assignments.activate');
        });

        Route::middleware('role:super_admin,operator_sekolah,guru,jurnalis_siswa,siswa')->group(function () {
            Route::get('portfolio-items', [PortfolioItemController::class, 'index'])->name('portfolio-items.index');
            Route::post('portfolio-items', [PortfolioItemController::class, 'store'])->name('portfolio-items.store');
            Route::match(['put', 'patch'], 'portfolio-items/{portfolioItem}', [PortfolioItemController::class, 'update'])->name('portfolio-items.update');
        });

        Route::middleware('role:super_admin,operator_sekolah,guru')->post(
            'portfolio-items/{portfolioItem}/moderate',
            [PortfolioItemController::class, 'moderate'],
        )->name('portfolio-items.moderate');

        Route::middleware('role:super_admin,operator_sekolah,guru,jurnalis_siswa')->group(function () {
            Route::get('articles', [ArticleController::class, 'index'])->name('articles.index');
            Route::post('articles', [ArticleController::class, 'store'])->name('articles.store');
            Route::match(['put', 'patch'], 'articles/{article}', [ArticleController::class, 'update'])->name('articles.update');
        });

        Route::middleware('role:super_admin,operator_sekolah,guru')->post('articles/{article}/publish', [ArticleController::class, 'publish'])
            ->name('articles.publish');
    });
});

require __DIR__.'/settings.php';
