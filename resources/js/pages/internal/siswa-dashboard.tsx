import { Head } from '@inertiajs/react';
import { CalendarDays, Compass, LayoutDashboard, Megaphone } from 'lucide-react';
import { DashboardStatCard } from '@/components/internal/dashboard-stat-card';

type SiswaDashboardProps = {
    stats: {
        jadwalHariIni: number;
        karyaSaya: number;
        pengumuman: number;
    };
};

export default function SiswaDashboard({ stats }: SiswaDashboardProps) {
    return (
        <>
            <Head title="Dashboard Siswa" />

            <div className="space-y-8 p-6">
                <div>
                    <div className="flex items-center gap-3 text-sm text-neutral-500">
                        <LayoutDashboard className="size-4" />
                        Dashboard Siswa
                    </div>
                    <h1 className="mt-2 text-3xl font-bold text-neutral-900 dark:text-white">
                        Selamat datang, Siswa
                    </h1>
                    <p className="mt-1 text-sm text-neutral-500">
                        Jadwal, karya, dan pengumuman untukmu.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <DashboardStatCard
                        label="Jadwal Hari Ini"
                        value={stats.jadwalHariIni.toLocaleString('id-ID')}
                        icon={<CalendarDays className="size-5" />}
                        trend="Berdasarkan rombel-mu"
                    />
                    <DashboardStatCard
                        label="Karya Saya"
                        value={stats.karyaSaya.toLocaleString('id-ID')}
                        icon={<Compass className="size-5" />}
                        trend="Portfolio terkirim"
                    />
                    <DashboardStatCard
                        label="Pengumuman"
                        value={stats.pengumuman.toLocaleString('id-ID')}
                        icon={<Megaphone className="size-5" />}
                        trend="Terbaru"
                    />
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                            Jadwal Belajar Hari Ini
                        </h2>
                        <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900">
                            Jadwal belajar harian akan tampil otomatis saat data timetable terhubung ke rombel-mu.
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                            Portfolio Karya Saya
                        </h2>
                        <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900">
                            Karya portfolio yang kamu submit akan tampil di sini. Mulai buat karya pertamamu!
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
