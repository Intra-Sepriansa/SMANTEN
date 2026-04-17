<?php

use App\Http\Controllers\Api\Public\AlumniForumController;
use App\Http\Controllers\Api\Public\PpdbApplicationController;
use App\Http\Controllers\Api\Public\PublicDiscoveryController;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('public')->name('api.public.')->group(function () {
    Route::get('geocode/search', [PublicDiscoveryController::class, 'geocode'])->name('geocode.search');
    Route::get('geocode/reverse', [PublicDiscoveryController::class, 'reverse'])->name('geocode.reverse');
    Route::get('organization/archive', [PublicDiscoveryController::class, 'organizationArchive'])->name('organization.archive');
    Route::get('videos/extracurricular', [PublicDiscoveryController::class, 'extracurricularVideos'])->name('videos.extracurricular');

    Route::get('alumni-forum', [AlumniForumController::class, 'index'])->name('alumni-forum.index');
    Route::post('alumni-forum', [AlumniForumController::class, 'store'])
        ->middleware('throttle:alumni-forum-store')
        ->name('alumni-forum.store');
    Route::post('alumni-forum/{post}/comments', [AlumniForumController::class, 'storeComment'])
        ->middleware('throttle:alumni-forum-comment')
        ->name('alumni-forum.comments.store');
    Route::post('alumni-forum/{post}/reactions', [AlumniForumController::class, 'react'])
        ->middleware('throttle:alumni-forum-react')
        ->name('alumni-forum.reactions.store');
});

Route::prefix('ppdb')->name('api.ppdb.')->group(function () {
    Route::post('applications', [PpdbApplicationController::class, 'store'])->name('applications.store');
});

Route::middleware('auth:sanctum')->get('auth/user', function (Request $request) {
    return UserResource::make($request->user()->loadMissing('roles'));
})->name('api.auth.user');
