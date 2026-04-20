<?php

use App\Enums\ArticleStatus;
use App\Models\AlumniProfile;
use App\Models\Article;
use App\Models\Employee;

use function Pest\Laravel\getJson;

it('searches public content and static destinations from one endpoint', function () {
    Article::query()->create([
        'title' => 'Prestasi Laboratorium Sains',
        'slug' => 'prestasi-laboratorium-sains',
        'excerpt' => 'Kabar terbaru dari fasilitas laboratorium.',
        'status' => ArticleStatus::Published,
        'published_at' => now(),
    ]);

    Employee::query()->create([
        'full_name' => 'Siti Rahma',
        'employee_number' => 'G-001',
        'email' => 'siti@example.test',
        'is_active' => true,
    ]);

    AlumniProfile::query()->create([
        'full_name' => 'Rizki Alumni',
        'graduation_year' => 2020,
        'institution_name' => 'Universitas Pamulang',
        'is_public_profile' => true,
    ]);

    getJson(route('api.public.search', ['query' => 'laboratorium']))
        ->assertOk()
        ->assertJsonPath('data.0.title', 'Prestasi Laboratorium Sains')
        ->assertJsonPath('data.0.group', 'Berita');

    getJson(route('api.public.search', ['query' => 'dokumen']))
        ->assertOk()
        ->assertJsonFragment([
            'title' => 'Dokumen Sekolah',
            'group' => 'Dokumen',
        ]);
});
