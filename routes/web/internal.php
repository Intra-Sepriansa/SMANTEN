<?php

use App\Http\Controllers\Api\Internal\Admin\ArticleController;
use App\Http\Controllers\Api\Internal\Admin\OrganizationAssignmentController;
use App\Http\Controllers\Api\Internal\Admin\PortfolioItemController;
use App\Http\Controllers\Api\Internal\Admin\PpdbReviewController;
use App\Http\Controllers\Api\Internal\Admin\PublicPortalSettingController;
use App\Http\Controllers\Api\Internal\Admin\RoleAssignmentController;
use App\Http\Controllers\Api\Internal\Admin\RoomController;
use App\Http\Controllers\Api\Internal\Admin\TimetableEntryController;
use App\Http\Controllers\Api\Internal\Admin\TimetableVersionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InternalDashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function (): void {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::get('dashboard/admin', [InternalDashboardController::class, 'admin'])->name('dashboard.admin');
    Route::get('dashboard/admin/ppdb', [InternalDashboardController::class, 'adminPpdb'])->name('dashboard.admin.ppdb');
    Route::get('dashboard/admin/ppdb/{ppdbApplication}', [InternalDashboardController::class, 'adminPpdbShow'])->name('dashboard.admin.ppdb.show');
    Route::get('dashboard/admin/organization', [InternalDashboardController::class, 'adminOrganization'])->name('dashboard.admin.organization');
    Route::get('dashboard/admin/articles', [InternalDashboardController::class, 'adminArticles'])->name('dashboard.admin.articles');
    Route::get('dashboard/admin/portfolio', [InternalDashboardController::class, 'adminPortfolio'])->name('dashboard.admin.portfolio');
    Route::get('dashboard/admin/teachers', [InternalDashboardController::class, 'adminTeachers'])->name('dashboard.admin.teachers');
    Route::get('dashboard/admin/schedule', [InternalDashboardController::class, 'adminSchedule'])->name('dashboard.admin.schedule');
    Route::get('dashboard/admin/students', [InternalDashboardController::class, 'adminStudents'])->name('dashboard.admin.students');
    Route::get('dashboard/admin/student-schedule', [InternalDashboardController::class, 'adminStudentSchedule'])->name('dashboard.admin.student-schedule');
    Route::get('dashboard/admin/student-portfolio', [InternalDashboardController::class, 'adminStudentPortfolio'])->name('dashboard.admin.student-portfolio');
    Route::get('dashboard/admin/website', [InternalDashboardController::class, 'adminWebsite'])->name('dashboard.admin.website');
    Route::get('dashboard/guru', [InternalDashboardController::class, 'guru'])->name('dashboard.guru');
    Route::get('dashboard/siswa', [InternalDashboardController::class, 'siswa'])->name('dashboard.siswa');
    Route::get('dashboard/wali', [InternalDashboardController::class, 'wali'])->name('dashboard.wali');

    Route::prefix('internal-api')->name('internal-api.')->group(function (): void {
        Route::middleware('role:super_admin,operator_sekolah')->group(function (): void {
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
            Route::patch('site-settings/public-portal', [PublicPortalSettingController::class, 'update'])->name('site-settings.public-portal.update');

            Route::get('organization-assignments', [OrganizationAssignmentController::class, 'index'])->name('organization-assignments.index');
            Route::post('organization-assignments', [OrganizationAssignmentController::class, 'store'])->name('organization-assignments.store');
            Route::match(['put', 'patch'], 'organization-assignments/{organizationAssignment}', [OrganizationAssignmentController::class, 'update'])->name('organization-assignments.update');
            Route::post('organization-assignments/{organizationAssignment}/activate', [OrganizationAssignmentController::class, 'activate'])->name('organization-assignments.activate');
        });

        Route::middleware('role:super_admin,operator_sekolah,guru,jurnalis_siswa,siswa')->group(function (): void {
            Route::get('portfolio-items', [PortfolioItemController::class, 'index'])->name('portfolio-items.index');
            Route::post('portfolio-items', [PortfolioItemController::class, 'store'])->name('portfolio-items.store');
            Route::match(['put', 'patch'], 'portfolio-items/{portfolioItem}', [PortfolioItemController::class, 'update'])->name('portfolio-items.update');
        });

        Route::middleware('role:super_admin,operator_sekolah,guru')->post(
            'portfolio-items/{portfolioItem}/moderate',
            [PortfolioItemController::class, 'moderate'],
        )->name('portfolio-items.moderate');

        Route::middleware('role:super_admin,operator_sekolah,guru,jurnalis_siswa')->group(function (): void {
            Route::get('articles', [ArticleController::class, 'index'])->name('articles.index');
            Route::post('articles', [ArticleController::class, 'store'])->name('articles.store');
            Route::match(['put', 'patch'], 'articles/{article}', [ArticleController::class, 'update'])->name('articles.update');
        });

        Route::middleware('role:super_admin,operator_sekolah,guru')->post('articles/{article}/publish', [ArticleController::class, 'publish'])
            ->name('articles.publish');
    });
});
