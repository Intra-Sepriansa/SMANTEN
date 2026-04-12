<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use App\Models\Article;
use App\Models\PpdbApplication;
use App\Models\User;
use App\Models\Role;
use App\Models\PortfolioItem;
use App\Models\TimetableEntry;

class InternalDashboardController extends Controller
{
    public function admin(): Response
    {
        // Calculate basic stats for the admin dashboard
        $studentCount = User::whereHas('roles', function ($query) {
            $query->whereIn('slug', ['siswa', 'jurnalis_siswa']);
        })->count();
        
        $teacherCount = User::whereHas('roles', function ($query) {
            $query->where('slug', 'guru');
        })->count();
        
        $articleCount = Article::count();
        
        // This is a placeholder for actual 'rombel' (kelas) count if a Class/Room model exists.
        // Assuming we just say 30 for now or count rooms.
        $roomCount = \App\Models\Room::count() ?? 30;

        return Inertia::render('internal/admin-dashboard', [
            'stats' => [
                'studentCount' => $studentCount,
                'teacherCount' => $teacherCount,
                'articleCount' => $articleCount,
                'roomCount' => $roomCount,
            ]
        ]);
    }

    public function guru(): Response
    {
        $user = Auth::user();
        
        // Approximate counts for Guru dashboard
        $kelasDiampu = TimetableEntry::query()
            ->whereHas('employee', fn($q) => $q->where('user_id', $user?->id))
            ->distinct('teaching_group_id')
            ->count('teaching_group_id');

        $jadwalHariIni = TimetableEntry::query()
            ->whereHas('employee', fn($q) => $q->where('user_id', $user?->id))
            ->where('day_of_week', now()->dayOfWeekIso)
            ->count();

        $portfolioReview = PortfolioItem::query()
            ->where('status', 'submitted')
            ->count(); // in reality, filtered by guru's subjects or classes

        return Inertia::render('internal/guru-dashboard', [
            'stats' => [
                'kelasDiampu' => $kelasDiampu,
                'jadwalHariIni' => $jadwalHariIni,
                'portfolioReview' => $portfolioReview,
            ],
            'upcomingClasses' => [], // placeholder for actual schedule
            'pendingReviews' => [], // placeholder for requested reviews
        ]);
    }

    public function siswa(): Response
    {
        $user = Auth::user();

        $jadwalHariIni = 0; // Requires linking User -> StudentProfile -> StudentEnrollment -> TeachingGroup
        
        $karyaSaya = PortfolioItem::query()
            ->where('creator_user_id', $user?->id)
            ->count();

        $pengumuman = Article::query()
            ->whereHas('category', fn($q) => $q->where('slug', 'pengumuman'))
            ->where('status', 'published')
            ->count();

        return Inertia::render('internal/siswa-dashboard', [
            'stats' => [
                'jadwalHariIni' => $jadwalHariIni,
                'karyaSaya' => $karyaSaya,
                'pengumuman' => $pengumuman,
            ]
        ]);
    }

    public function wali(): Response
    {
        $user = Auth::user();
        
        // Typical Wali checks guardian -> students
        $profilAnak = 0; // Number of linked children profiles
        $jadwalAnak = 0; // Scheduled classes for the day

        $pengumuman = Article::query()
            ->whereHas('category', fn($q) => $q->where('slug', 'pengumuman'))
            ->where('status', 'published')
            ->count();

        return Inertia::render('internal/wali-dashboard', [
            'stats' => [
                'profilAnak' => $profilAnak,
                'jadwalAnak' => $jadwalAnak,
                'pengumuman' => $pengumuman,
            ]
        ]);
    }
}
