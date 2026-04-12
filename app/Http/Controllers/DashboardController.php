<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): Response|SymfonyResponse
    {
        $user = $request->user();

        if ($user) {
            if ($user->hasAnyRole(['super_admin', 'operator_sekolah'])) {
                return redirect()->route('dashboard.admin');
            }

            if ($user->hasRole('guru')) {
                return redirect()->route('dashboard.guru');
            }

            if ($user->hasAnyRole(['siswa', 'jurnalis_siswa'])) {
                return redirect()->route('dashboard.siswa');
            }

            if ($user->hasRole('wali_murid')) {
                return redirect()->route('dashboard.wali');
            }
        }

        // Fallback to the dashboard hub if no specific role matched or feature disabled
        return Inertia::render('dashboard');
    }
}
