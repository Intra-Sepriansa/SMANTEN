import { Head } from '@inertiajs/react';
import { CalendarDays, GraduationCap, LayoutDashboard, Megaphone } from 'lucide-react';
import { DashboardStatCard } from '@/components/internal/dashboard-stat-card';

type WaliDashboardProps = {
    stats: {
        profilAnak: number;
        jadwalAnak: number;
        pengumuman: number;
    };
};

export default function WaliDashboard({ stats }: WaliDashboardProps) {
    return (
        <>
            <Head title="Dashboard Wali Murid" />

            <div className="space-y-8 p-6">
                <div>
                    <div className="flex items-center gap-3 text-sm text-neutral-500">
                        <LayoutDashboard className="size-4" />
                        Dashboard Wali Murid
                    </div>
                    <h1 className="mt-2 text-3xl font-bold text-neutral-900 dark:text-white">
                        Selamat datang, Wali Murid
                    </h1>
                    <p className="mt-1 text-sm text-neutral-500">
                        Pantau perkembangan anak Anda di SMAN 1 Tenjo.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <DashboardStatCard
                        label="Profil Anak"
                        value={stats.profilAnak.toLocaleString('id-ID')}
                        icon={<GraduationCap className="size-5" />}
                        trend="Rombel aktif"
                    />
                    <DashboardStatCard
                        label="Jadwal Anak"
                        value={stats.jadwalAnak.toLocaleString('id-ID')}
                        icon={<CalendarDays className="size-5" />}
                        trend="Hari ini"
                    />
                    <DashboardStatCard
                        label="Pengumuman"
                        value={stats.pengumuman.toLocaleString('id-ID')}
                        icon={<Megaphone className="size-5" />}
                        trend="Dari sekolah"
                    />
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                            Informasi Anak
                        </h2>
                        <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900">
                            Data profil anak akan tampil saat akun wali murid terhubung dengan profil siswa. Hubungi operator sekolah untuk verifikasi.
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                            Perkembangan Portfolio
                        </h2>
                        <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900">
                            Portfolio karya anak Anda akan tampil di sini setelah karya dipublikasikan.
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                        Pengumuman Sekolah
                    </h2>
                    <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900">
                        Pengumuman resmi dari sekolah yang ditujukan kepada wali murid akan ditampilkan di sini.
                    </div>
                </div>
            </div>
        </>
    );
}
