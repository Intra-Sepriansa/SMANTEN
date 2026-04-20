<?php

namespace App\Services;

use App\Enums\ArticleStatus;
use App\Enums\RoleName;
use App\Models\AlumniForumPost;
use App\Models\AlumniProfile;
use App\Models\Article;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class PublicGlobalSearchService
{
    /**
     * @return array<int, array{title: string, description: string, href: string, group: string, badge: string}>
     */
    public function search(string $query, ?User $user = null, int $limit = 18): array
    {
        $normalizedQuery = Str::of($query)->squish()->lower()->toString();

        if ($normalizedQuery === '') {
            return $this->defaultItems($user)->take($limit)->values()->all();
        }

        return collect()
            ->merge($this->searchArticles($normalizedQuery))
            ->merge($this->searchTeachers($normalizedQuery))
            ->merge($this->searchAlumni($normalizedQuery))
            ->merge($this->searchStaticItems($normalizedQuery, $user))
            ->take($limit)
            ->values()
            ->all();
    }

    private function defaultItems(?User $user): Collection
    {
        return collect($this->staticItems($user))
            ->filter(fn (array $item): bool => in_array($item['group'], ['Navigasi', 'Dashboard', 'Layanan'], true))
            ->values();
    }

    private function searchArticles(string $query): Collection
    {
        return Article::query()
            ->where('status', ArticleStatus::Published)
            ->where(function (Builder $builder) use ($query): void {
                $builder
                    ->where('title', 'like', "%{$query}%")
                    ->orWhere('excerpt', 'like', "%{$query}%");
            })
            ->latest('published_at')
            ->limit(6)
            ->get(['title', 'slug', 'excerpt', 'published_at'])
            ->map(fn (Article $article): array => [
                'title' => $article->title,
                'description' => $article->excerpt ?? 'Berita dan pengumuman sekolah.',
                'href' => route('berita.show', $article->slug, false),
                'group' => 'Berita',
                'badge' => 'Artikel',
            ]);
    }

    private function searchTeachers(string $query): Collection
    {
        return Employee::query()
            ->where('is_active', true)
            ->where(function (Builder $builder) use ($query): void {
                $builder
                    ->where('full_name', 'like', "%{$query}%")
                    ->orWhere('employee_number', 'like', "%{$query}%")
                    ->orWhere('email', 'like', "%{$query}%");
            })
            ->orderBy('full_name')
            ->limit(5)
            ->get(['full_name', 'employee_type', 'email'])
            ->map(fn (Employee $employee): array => [
                'title' => $employee->full_name,
                'description' => collect([$employee->employee_type?->value, $employee->email])->filter()->join(' • '),
                'href' => route('guru', absolute: false),
                'group' => 'Guru',
                'badge' => 'PTK',
            ]);
    }

    private function searchAlumni(string $query): Collection
    {
        $profiles = AlumniProfile::query()
            ->where('is_public_profile', true)
            ->where(function (Builder $builder) use ($query): void {
                $builder
                    ->where('full_name', 'like', "%{$query}%")
                    ->orWhere('institution_name', 'like', "%{$query}%")
                    ->orWhere('occupation_title', 'like', "%{$query}%")
                    ->orWhere('city', 'like', "%{$query}%");
            })
            ->orderByDesc('updated_at')
            ->limit(4)
            ->get(['full_name', 'slug', 'graduation_year', 'institution_name', 'occupation_title'])
            ->map(fn (AlumniProfile $profile): array => [
                'title' => $profile->full_name,
                'description' => collect([
                    $profile->graduation_year ? "Angkatan {$profile->graduation_year}" : null,
                    $profile->occupation_title,
                    $profile->institution_name,
                ])->filter()->join(' • '),
                'href' => $profile->slug
                    ? route('alumni.profile.show', $profile->slug, false)
                    : route('alumni', absolute: false),
                'group' => 'Alumni',
                'badge' => 'Profil',
            ]);

        $stories = AlumniForumPost::query()
            ->where('is_approved', true)
            ->where('moderation_status', 'approved')
            ->where(function (Builder $builder) use ($query): void {
                $builder
                    ->where('title', 'like', "%{$query}%")
                    ->orWhere('author_name', 'like', "%{$query}%")
                    ->orWhere('institution_name', 'like', "%{$query}%")
                    ->orWhere('occupation_title', 'like', "%{$query}%");
            })
            ->latest('last_interaction_at')
            ->latest('created_at')
            ->limit(4)
            ->get(['title', 'slug', 'author_name', 'graduation_year'])
            ->map(fn (AlumniForumPost $post): array => [
                'title' => $post->title,
                'description' => "{$post->author_name} • Angkatan {$post->graduation_year}",
                'href' => $post->slug
                    ? route('alumni.story.show', $post->slug, false)
                    : route('alumni', absolute: false),
                'group' => 'Alumni',
                'badge' => 'Cerita',
            ]);

        return $profiles->merge($stories);
    }

    private function searchStaticItems(string $query, ?User $user): Collection
    {
        return collect($this->staticItems($user))
            ->filter(function (array $item) use ($query): bool {
                return Str::of("{$item['title']} {$item['description']} {$item['group']} {$item['badge']}")
                    ->lower()
                    ->contains($query);
            })
            ->values();
    }

    /**
     * @return array<int, array{title: string, description: string, href: string, group: string, badge: string}>
     */
    private function staticItems(?User $user): array
    {
        $items = [
            ['title' => 'Beranda', 'description' => 'Ringkasan portal sekolah.', 'href' => route('home', absolute: false), 'group' => 'Navigasi', 'badge' => 'Home'],
            ['title' => 'PPDB Digital', 'description' => 'Cek zonasi, alur, dan pendaftaran.', 'href' => route('ppdb', absolute: false), 'group' => 'Layanan', 'badge' => 'PPDB'],
            ['title' => 'Dokumen Sekolah', 'description' => 'Unduhan, formulir, dan panduan.', 'href' => route('documents', absolute: false), 'group' => 'Dokumen', 'badge' => 'File'],
            ['title' => 'Guru dan Tenaga Pendidik', 'description' => 'Profil tenaga pendidik sekolah.', 'href' => route('guru', absolute: false), 'group' => 'Guru', 'badge' => 'PTK'],
            ['title' => 'Forum Alumni', 'description' => 'Cerita, jejaring, dan profil alumni.', 'href' => route('alumni', absolute: false), 'group' => 'Alumni', 'badge' => 'Forum'],
            ['title' => 'Tulis Cerita Alumni', 'description' => 'Bagikan perjalanan kampus atau karier.', 'href' => route('alumni.write-story', absolute: false), 'group' => 'Alumni', 'badge' => 'Story'],
            ['title' => 'Ekstrakurikuler', 'description' => 'Katalog unit minat dan bakat siswa.', 'href' => route('extracurricular', absolute: false), 'group' => 'Ekstrakurikuler', 'badge' => 'Unit'],
            ['title' => 'PMR', 'description' => 'Unit kesehatan, kesiapsiagaan, dan pelayanan.', 'href' => route('extracurricular.show', 'pmr', false), 'group' => 'Ekstrakurikuler', 'badge' => 'Unit'],
            ['title' => 'Paskibra', 'description' => 'Disiplin, formasi, dan kepemimpinan.', 'href' => route('extracurricular.show', 'paskibra', false), 'group' => 'Ekstrakurikuler', 'badge' => 'Unit'],
            ['title' => 'Pramuka', 'description' => 'Kepanduan, lapangan, dan karakter.', 'href' => route('extracurricular.show', 'pramuka', false), 'group' => 'Ekstrakurikuler', 'badge' => 'Unit'],
            ['title' => 'Layanan Sekolah', 'description' => 'FAQ, kontak, dan jalur konsultasi.', 'href' => route('layanan', absolute: false), 'group' => 'Layanan', 'badge' => 'Help'],
            ['title' => 'Virtual Tour', 'description' => 'Jelajahi ruang dan fasilitas sekolah.', 'href' => route('virtual-tour', absolute: false), 'group' => 'Media', 'badge' => 'Tour'],
        ];

        if ($user) {
            $items[] = ['title' => 'Dashboard', 'description' => 'Pusat kerja internal sesuai peran.', 'href' => route('dashboard', absolute: false), 'group' => 'Dashboard', 'badge' => 'Portal'];

            if ($user->hasAnyRole([RoleName::SuperAdmin->value, RoleName::OperatorSekolah->value])) {
                array_push(
                    $items,
                    ['title' => 'Dashboard Admin', 'description' => 'Snapshot operasional sekolah.', 'href' => route('dashboard.admin', absolute: false), 'group' => 'Dashboard', 'badge' => 'Admin'],
                    ['title' => 'Admin PPDB', 'description' => 'Verifikasi, ekspor, dan keputusan PPDB.', 'href' => route('dashboard.admin.ppdb', absolute: false), 'group' => 'Dashboard', 'badge' => 'PPDB'],
                    ['title' => 'Website CMS', 'description' => 'Hero, menu, revisi, dan media website.', 'href' => route('dashboard.admin.website', absolute: false), 'group' => 'Dashboard', 'badge' => 'CMS'],
                    ['title' => 'Audit Log', 'description' => 'Timeline aktivitas dan ekspor log.', 'href' => route('dashboard.admin', absolute: false).'#audit-log', 'group' => 'Dashboard', 'badge' => 'Audit'],
                );
            }
        }

        return $items;
    }
}
