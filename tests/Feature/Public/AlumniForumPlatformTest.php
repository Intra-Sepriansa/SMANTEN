<?php

use App\Models\AlumniForumPost;
use App\Models\AlumniProfile;
use Inertia\Testing\AssertableInertia as Assert;

it('stores an alumni forum post with smart location and public profile sync', function () {
    $response = $this->postJson('/api/public/alumni-forum', [
        'author_name' => 'Intra Sepriansa',
        'graduation_year' => 2020,
        'category' => 'karir',
        'title' => 'Membangun produk digital setelah lulus',
        'body' => 'Saya mulai dari freelance kecil, lalu berkembang menjadi full stack engineer yang banyak belajar dari proyek-proyek nyata dan komunitas.',
        'institution_name' => 'Studio Digital Nusantara',
        'occupation_title' => 'Full Stack Engineer',
        'city' => 'Bogor',
        'province' => 'Jawa Barat',
        'latitude' => -6.595038,
        'longitude' => 106.816635,
        'is_open_to_mentor' => true,
    ], [
        'X-Alumni-Visitor' => 'visitor-platform-test',
    ]);

    $response
        ->assertCreated()
        ->assertJsonPath('post.authorName', 'Intra Sepriansa')
        ->assertJsonPath('post.location.latitude', -6.595038)
        ->assertJsonPath('post.moderationStatus', 'approved')
        ->assertJsonPath('post.profile.fullName', 'Intra Sepriansa');

    $post = AlumniForumPost::query()->firstOrFail();

    expect($post->location_latitude)->toBe('-6.5950380')
        ->and($post->is_open_to_mentor)->toBeTrue()
        ->and($post->moderation_status)->toBe('approved')
        ->and($post->alumniProfile)->not->toBeNull();
});

it('stores alumni forum comments and updates counters', function () {
    $profile = AlumniProfile::query()->create([
        'full_name' => 'Alumni Forum',
        'graduation_year' => 2021,
        'is_public_profile' => true,
    ]);

    $post = AlumniForumPost::query()->create([
        'alumni_profile_id' => $profile->id,
        'author_name' => 'Alumni Forum',
        'graduation_year' => 2021,
        'category' => 'cerita',
        'title' => 'Pengalaman organisasi setelah lulus',
        'body' => 'Cerita ini cukup panjang untuk dianggap layak tayang dan memancing diskusi lanjutan dari alumni lainnya di forum.',
        'is_approved' => true,
        'moderation_status' => 'approved',
        'approved_at' => now(),
    ]);

    $this->postJson("/api/public/alumni-forum/{$post->id}/comments", [
        'author_name' => 'Siswa Aktif',
        'body' => 'Kak, insight tentang organisasi kampusnya sangat membantu.',
    ], [
        'X-Alumni-Visitor' => 'visitor-comment-test',
    ])
        ->assertCreated()
        ->assertJsonPath('post.commentsCount', 1)
        ->assertJsonPath('post.comments.0.authorName', 'Siswa Aktif');

    expect($post->fresh()->comments_count)->toBe(1);
});

it('toggles reactions and escalates repeated reports into moderation review', function () {
    $post = AlumniForumPost::query()->create([
        'author_name' => 'Reaction Test',
        'graduation_year' => 2022,
        'category' => 'inspirasi',
        'title' => 'Menguji interaksi forum alumni',
        'body' => 'Cerita ini dibuat untuk menguji interaksi like, share, dan report pada forum alumni publik secara end-to-end.',
        'is_approved' => true,
        'moderation_status' => 'approved',
        'approved_at' => now(),
    ]);

    $this->postJson("/api/public/alumni-forum/{$post->id}/reactions", [
        'reaction_type' => 'like',
    ], ['X-Alumni-Visitor' => 'visitor-like-1'])
        ->assertOk()
        ->assertJsonPath('active', true)
        ->assertJsonPath('post.likesCount', 1);

    $this->postJson("/api/public/alumni-forum/{$post->id}/reactions", [
        'reaction_type' => 'like',
    ], ['X-Alumni-Visitor' => 'visitor-like-1'])
        ->assertOk()
        ->assertJsonPath('active', false)
        ->assertJsonPath('post.likesCount', 0);

    $this->postJson("/api/public/alumni-forum/{$post->id}/reactions", [
        'reaction_type' => 'report',
        'reason' => 'Menguji laporan pertama.',
    ], ['X-Alumni-Visitor' => 'visitor-report-1'])->assertOk();

    $this->postJson("/api/public/alumni-forum/{$post->id}/reactions", [
        'reaction_type' => 'report',
        'reason' => 'Menguji laporan kedua.',
    ], ['X-Alumni-Visitor' => 'visitor-report-2'])->assertOk();

    $this->postJson("/api/public/alumni-forum/{$post->id}/reactions", [
        'reaction_type' => 'report',
        'reason' => 'Menguji laporan ketiga.',
    ], ['X-Alumni-Visitor' => 'visitor-report-3'])->assertOk();

    expect($post->fresh()->moderation_status)->toBe('pending_review')
        ->and($post->fresh()->is_approved)->toBeFalse();
});

it('renders alumni story and public alumni profile detail pages', function () {
    $profile = AlumniProfile::query()->create([
        'full_name' => 'Profil Alumni Publik',
        'graduation_year' => 2019,
        'institution_name' => 'Universitas Nusantara',
        'occupation_title' => 'Data Analyst',
        'city' => 'Jakarta',
        'province' => 'DKI Jakarta',
        'bio' => 'Aktif membangun karier di bidang analitik.',
        'is_public_profile' => true,
    ]);

    $post = AlumniForumPost::query()->create([
        'alumni_profile_id' => $profile->id,
        'author_name' => $profile->full_name,
        'graduation_year' => 2019,
        'category' => 'kampus',
        'title' => 'Perjalanan saya di Universitas Nusantara',
        'body' => 'Cerita ini membahas pengalaman belajar, organisasi, dan transisi menuju dunia kerja setelah lulus dari sekolah.',
        'city' => 'Jakarta',
        'province' => 'DKI Jakarta',
        'location_latitude' => -6.208763,
        'location_longitude' => 106.845599,
        'is_approved' => true,
        'moderation_status' => 'approved',
        'approved_at' => now(),
    ]);

    $this->get("/alumni/cerita/{$post->slug}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/alumni-story')
            ->where('post.title', 'Perjalanan saya di Universitas Nusantara')
            ->where('post.profile.fullName', 'Profil Alumni Publik')
            ->where(
                'post.locationMapUrl',
                'https://www.google.com/maps/search/?api=1&query=-6.208763%2C106.845599',
            ),
        );

    $this->get("/alumni/profil/{$profile->slug}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/alumni-profile')
            ->where('profile.fullName', 'Profil Alumni Publik')
            ->where('profile.stories.0.title', 'Perjalanan saya di Universitas Nusantara')
            ->where(
                'profile.locationMapUrl',
                'https://www.google.com/maps/search/?api=1&query=-6.208763%2C106.845599',
            ),
        );
});

it('renders the dedicated alumni story submission page', function () {
    $this->get('/alumni/tulis-cerita')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/alumni-write-story')
            ->has('school.name')
            ->has('school.location.latitude')
            ->has('school.location.longitude'),
        );
});

it('renders sitemap entries for alumni stories and public alumni profiles', function () {
    $profile = AlumniProfile::query()->create([
        'full_name' => 'Sitemap Alumni',
        'graduation_year' => 2018,
        'is_public_profile' => true,
    ]);

    $post = AlumniForumPost::query()->create([
        'alumni_profile_id' => $profile->id,
        'author_name' => 'Sitemap Alumni',
        'graduation_year' => 2018,
        'category' => 'cerita',
        'title' => 'Cerita untuk sitemap alumni',
        'body' => 'Cerita ini dipublikasikan untuk memastikan URL alumni masuk ke sitemap publik aplikasi.',
        'is_approved' => true,
        'moderation_status' => 'approved',
        'approved_at' => now(),
    ]);

    $this->get('/sitemap.xml')
        ->assertOk()
        ->assertHeader('Content-Type', 'application/xml; charset=UTF-8')
        ->assertSee(route('alumni.story.show', $post->slug), false)
        ->assertSee(route('alumni.profile.show', $profile->slug), false);
});
