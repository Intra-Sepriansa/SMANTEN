<?php

use App\Models\AlumniForumComment;
use App\Models\AlumniForumPost;
use App\Models\AlumniProfile;
use App\Models\TracerStudyResponse;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

it('renders admin dashboard with tracer and forum analytics', function () {
    /** @var TestCase $this */
    /** @var User $user */
    $user = User::factory()->createOne();

    $profile = AlumniProfile::query()->create([
        'full_name' => 'Admin Dashboard Alumni',
        'graduation_year' => 2018,
        'institution_name' => 'Institut Teknologi Masa Depan',
        'city' => 'Bandung',
        'province' => 'Jawa Barat',
        'is_public_profile' => true,
    ]);

    TracerStudyResponse::query()->create([
        'alumni_profile_id' => $profile->id,
        'status' => 'submitted',
        'current_activity' => 'bekerja',
        'institution_name' => 'Institut Teknologi Masa Depan',
        'location_city' => 'Bandung',
        'location_province' => 'Jawa Barat',
        'is_publicly_displayable' => true,
        'submitted_at' => now(),
    ]);

    $post = AlumniForumPost::query()->create([
        'alumni_profile_id' => $profile->id,
        'author_name' => $profile->full_name,
        'graduation_year' => 2018,
        'category' => 'karir',
        'title' => 'Analitik data di dunia kerja',
        'body' => 'Cerita ini menjelaskan perjalanan karier dan insight praktis untuk adik kelas yang sedang menyiapkan portofolio profesional.',
        'is_approved' => true,
        'moderation_status' => 'approved',
        'approved_at' => now(),
    ]);

    AlumniForumComment::query()->create([
        'alumni_forum_post_id' => $post->id,
        'author_name' => 'Pengunjung',
        'body' => 'Insight-nya sangat berguna.',
        'moderation_status' => 'approved',
    ]);

    $this->actingAs($user)
        ->get(route('dashboard.admin'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('internal/admin-dashboard')
            ->where('stats.publicAlumniCount', 1)
            ->where('stats.tracerSubmittedCount', 1)
            ->where('stats.forumPostCount', 1)
            ->where('tracer.topCities.0.unit', 'Bandung'),
        );
});
