import { Head } from '@inertiajs/react';
import { BookOpen, CalendarDays, ClipboardCheck, LayoutDashboard } from 'lucide-react';
import { DashboardStatCard } from '@/components/internal/dashboard-stat-card';
import { ActivityFeed } from '@/components/internal/activity-feed';

type GuruDashboardProps = {
    stats: {
        kelasDiampu: number;
        jadwalHariIni: number;
        portfolioReview: number;
    };
};

export default function GuruDashboard({ stats }: GuruDashboardProps) {
    return (
        <>
            <Head title="Dashboard Guru" />

            <div className="space-y-8 p-6">
                <div>
                    <div className="flex items-center gap-3 text-sm text-neutral-500">
                        <LayoutDashboard className="size-4" />
                        Dashboard Guru
                    </div>
                    <h1 className="mt-2 text-3xl font-bold text-neutral-900 dark:text-white">
                        Selamat datang, Guru
                    </h1>
                    <p className="mt-1 text-sm text-neutral-500">
                        Ringkasan pembelajaran dan tugas hari ini.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <DashboardStatCard
                        label="Kelas Diampu"
                        value={stats.kelasDiampu.toLocaleString('id-ID')}
                        icon={<BookOpen className="size-5" />}
                        trend="Semester aktif"
                    />
                    <DashboardStatCard
                        label="Jadwal Hari Ini"
                        value={stats.jadwalHariIni.toLocaleString('id-ID')}
                        icon={<CalendarDays className="size-5" />}
                        trend="Lihat timetable"
                    />
                    <DashboardStatCard
                        label="Review Portfolio"
                        value={stats.portfolioReview.toLocaleString('id-ID')}
                        icon={<ClipboardCheck className="size-5" />}
                        trend="Menunggu moderasi"
                    />
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                        Jadwal Mengajar Hari Ini
                    </h2>
                    <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900">
                        Jadwal mengajar akan tampil otomatis saat timetable entry terhubung ke akun guru ini.
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                        Karya Menunggu Review
                    </h2>
                    <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
                        <ActivityFeed
                            items={[]}
                            emptyMessage="Belum ada karya portfolio yang menunggu review dari Anda."
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
