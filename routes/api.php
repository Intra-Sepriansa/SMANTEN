<?php

use App\Http\Controllers\Api\Public\PublicDiscoveryController;
use App\Http\Controllers\Api\Public\PpdbApplicationController;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('public')->name('api.public.')->group(function () {
    Route::get('geocode/search', [PublicDiscoveryController::class, 'geocode'])->name('geocode.search');
    Route::get('organization/archive', [PublicDiscoveryController::class, 'organizationArchive'])->name('organization.archive');
    Route::get('videos/extracurricular', [PublicDiscoveryController::class, 'extracurricularVideos'])->name('videos.extracurricular');
});

Route::prefix('ppdb')->name('api.ppdb.')->group(function () {
    Route::post('applications', [PpdbApplicationController::class, 'store'])->name('applications.store');
});

Route::middleware('auth:sanctum')->get('auth/user', function (Request $request) {
    return UserResource::make($request->user()->loadMissing('roles'));
})->name('api.auth.user');
