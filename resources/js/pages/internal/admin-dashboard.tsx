import { Head, Link } from '@inertiajs/react';
import {
    BookOpen,
    ClipboardList,
    FileText,
    GraduationCap,
    Landmark,
    LayoutDashboard,
    Settings,
    Users,
} from 'lucide-react';
import { DashboardStatCard } from '@/components/internal/dashboard-stat-card';
import { ActivityFeed } from '@/components/internal/activity-feed';

type AdminDashboardProps = {
    stats: {
        studentCount: number;
        teacherCount: number;
        articleCount: number;
        roomCount: number;
    };
};

export default function AdminDashboard({ stats }: AdminDashboardProps) {
    const dashboardStats = [
        { label: 'Siswa Aktif', value: new Intl.NumberFormat('id-ID').format(stats.studentCount), icon: <Users className="size-5" />, trend: 'Siswa & Jurnalis' },
        { label: 'Rombel', value: new Intl.NumberFormat('id-ID').format(stats.roomCount), icon: <GraduationCap className="size-5" /> },
        { label: 'PTK', value: new Intl.NumberFormat('id-ID').format(stats.teacherCount), icon: <Landmark className="size-5" />, trend: 'Guru aktif' },
        { label: 'Artikel Publik', value: new Intl.NumberFormat('id-ID').format(stats.articleCount), icon: <FileText className="size-5" />, trend: 'Total dipublish' },
    ];

    const quickActions = [
        { label: 'Kelola PPDB', href: '/internal-api/ppdb', icon: ClipboardList },
        { label: 'Artikel & Berita', href: '/internal-api/articles', icon: BookOpen },
        { label: 'Organisasi', href: '/internal-api/organization', icon: Users },
        { label: 'Pengaturan', href: '/settings', icon: Settings },
    ];

    return (
        <>
            <Head title="Dashboard Admin" />

            <div className="space-y-8 p-6">
                <div>
                    <div className="flex items-center gap-3 text-sm text-neutral-500">
                        <LayoutDashboard className="size-4" />
                        Dashboard Admin
                    </div>
                    <h1 className="mt-2 text-3xl font-bold text-neutral-900 dark:text-white">
                        Selamat datang, Admin
                    </h1>
                    <p className="mt-1 text-sm text-neutral-500">
                        Ringkasan operasional SMAN 1 Tenjo.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {dashboardStats.map((stat) => (
                        <DashboardStatCard key={stat.label} {...stat} />
                    ))}
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                            Aksi Cepat
                        </h2>
                        <div className="grid gap-3 md:grid-cols-2">
                            {quickActions.map((action) => (
                                <Link
                                    key={action.label}
                                    href={action.href}
                                    className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4 transition hover:border-[var(--school-green-200)] hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900"
                                >
                                    <action.icon className="size-5 text-[var(--school-green-700)]" />
                                    <span className="text-sm font-medium text-neutral-900 dark:text-white">
                                        {action.label}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                            Aktivitas Terbaru
                        </h2>
                        <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
                            <ActivityFeed
                                items={[]}
                                emptyMessage="Belum ada aktivitas tercatat. Activity log akan otomatis tampil saat fitur operasional digunakan."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
