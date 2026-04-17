import { Head, Link } from '@inertiajs/react';
import {
    BookOpen,
    ClipboardList,
    FileText,
    Flag,
    GraduationCap,
    Landmark,
    LayoutDashboard,
    MessageCircle,
    Radar,
    Settings,
    ShieldAlert,
    Sparkles,
    TrendingUp,
    Users,
} from 'lucide-react';
import { DashboardStatCard } from '@/components/internal/dashboard-stat-card';
import { ActivityFeed } from '@/components/internal/activity-feed';
import {
    AdminOverviewChart,
    DistributionBarChart,
    InsightPieChart,
} from '@/components/charts/school-charts';

type AdminDashboardProps = {
    stats: {
        studentCount: number;
        teacherCount: number;
        articleCount: number;
        roomCount: number;
        publicAlumniCount: number;
        tracerSubmittedCount: number;
        tracerDisplayableCount: number;
        forumPostCount: number;
        forumCommentCount: number;
        pendingModerationCount: number;
        reportedPostCount: number;
    };
    tracer: {
        topCities: { unit: string; count: number }[];
        topInstitutions: { unit: string; count: number }[];
        activityMix: { name: string; value: number; color: string }[];
        forumHealth: { name: string; value: number; color: string }[];
        recentForumPosts: {
            id: number;
            title: string;
            authorName: string;
            url: string | null;
            moderationStatus: string;
            likesCount: number;
            commentsCount: number;
            reportsCount: number;
            createdAt: string | null;
        }[];
        recentActivity: {
            id: number;
            title: string;
            description: string;
            time: string;
        }[];
    };
};

export default function AdminDashboard({ stats, tracer }: AdminDashboardProps) {
    const dashboardStats = [
        {
            label: 'Siswa Aktif',
            value: new Intl.NumberFormat('id-ID').format(stats.studentCount),
            icon: <Users className="size-5" />,
            trend: 'Siswa & Jurnalis',
        },
        {
            label: 'Rombel',
            value: new Intl.NumberFormat('id-ID').format(stats.roomCount),
            icon: <GraduationCap className="size-5" />,
        },
        {
            label: 'PTK',
            value: new Intl.NumberFormat('id-ID').format(stats.teacherCount),
            icon: <Landmark className="size-5" />,
            trend: 'Guru aktif',
        },
        {
            label: 'Artikel Publik',
            value: new Intl.NumberFormat('id-ID').format(stats.articleCount),
            icon: <FileText className="size-5" />,
            trend: 'Total dipublish',
        },
    ];

    const alumniStats = [
        {
            label: 'Alumni Publik',
            value: new Intl.NumberFormat('id-ID').format(
                stats.publicAlumniCount,
            ),
            icon: <Sparkles className="size-5" />,
            trend: 'Profil alumni terbuka',
        },
        {
            label: 'Tracer Masuk',
            value: new Intl.NumberFormat('id-ID').format(
                stats.tracerSubmittedCount,
            ),
            icon: <Radar className="size-5" />,
            trend: `${stats.tracerDisplayableCount} public displayable`,
        },
        {
            label: 'Forum Posts',
            value: new Intl.NumberFormat('id-ID').format(stats.forumPostCount),
            icon: <BookOpen className="size-5" />,
            trend: `${stats.forumCommentCount} komentar`,
        },
        {
            label: 'Review Queue',
            value: new Intl.NumberFormat('id-ID').format(
                stats.pendingModerationCount,
            ),
            icon: <ShieldAlert className="size-5" />,
            trend: `${stats.reportedPostCount} post reported`,
        },
    ];

    const quickActions = [
        {
            label: 'Kelola PPDB',
            href: '/internal-api/ppdb',
            icon: ClipboardList,
        },
        {
            label: 'Artikel & Berita',
            href: '/internal-api/articles',
            icon: BookOpen,
        },
        {
            label: 'Organisasi',
            href: '/internal-api/organization',
            icon: Users,
        },
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

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {alumniStats.map((stat) => (
                        <DashboardStatCard key={stat.label} {...stat} />
                    ))}
                </div>

                <AdminOverviewChart
                    studentCount={stats.studentCount}
                    teacherCount={stats.teacherCount}
                    articleCount={stats.articleCount}
                    roomCount={stats.roomCount}
                />

                <div className="grid gap-6 xl:grid-cols-2">
                    <DistributionBarChart
                        title="Sebaran Kota Alumni"
                        subtitle="Domisili tracer study yang dipublikasikan"
                        data={tracer.topCities.map((item) => ({
                            label: item.unit,
                            count: item.count,
                        }))}
                    />
                    <DistributionBarChart
                        title="Institusi Tujuan"
                        subtitle="Kampus atau perusahaan yang paling sering muncul"
                        data={tracer.topInstitutions.map((item) => ({
                            label: item.unit,
                            count: item.count,
                        }))}
                    />
                    <InsightPieChart
                        title="Komposisi Aktivitas Alumni"
                        subtitle="Aktivitas utama berdasarkan tracer study"
                        data={tracer.activityMix}
                    />
                    <InsightPieChart
                        title="Kesehatan Forum Alumni"
                        subtitle="Ringkasan moderasi, komentar, dan laporan komunitas"
                        data={tracer.forumHealth}
                    />
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                            Forum Alumni Watchlist
                        </h2>
                        <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
                            <div className="space-y-3">
                                {tracer.recentForumPosts.map((post) => (
                                    <div
                                        key={post.id}
                                        className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="space-y-2">
                                                {post.url ? (
                                                    <Link
                                                        href={post.url}
                                                        className="text-sm font-semibold text-neutral-900 transition hover:text-(--school-green-700) dark:text-white"
                                                    >
                                                        {post.title}
                                                    </Link>
                                                ) : (
                                                    <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                                                        {post.title}
                                                    </div>
                                                )}
                                                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                                    {post.authorName}
                                                </div>
                                            </div>
                                            <div
                                                className={`rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.18em] uppercase ${post.moderationStatus === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}
                                            >
                                                {post.moderationStatus}
                                            </div>
                                        </div>
                                        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                                            <span className="inline-flex items-center gap-1">
                                                <TrendingUp className="size-3.5" />{' '}
                                                {post.likesCount} likes
                                            </span>
                                            <span className="inline-flex items-center gap-1">
                                                <MessageCircle className="size-3.5" />{' '}
                                                {post.commentsCount} komentar
                                            </span>
                                            <span className="inline-flex items-center gap-1">
                                                <Flag className="size-3.5" />{' '}
                                                {post.reportsCount} report
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                            Aksi Cepat
                        </h2>
                        <div className="grid gap-3 md:grid-cols-2">
                            {quickActions.map((action) => (
                                <Link
                                    key={action.label}
                                    href={action.href}
                                    className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4 transition hover:border-(--school-green-200) hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900"
                                >
                                    <action.icon className="size-5 text-(--school-green-700)" />
                                    <span className="text-sm font-medium text-neutral-900 dark:text-white">
                                        {action.label}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                            Aktivitas Forum Terbaru
                        </h2>
                        <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
                            <ActivityFeed
                                items={tracer.recentActivity.map((item) => ({
                                    id: item.id,
                                    icon: <Sparkles className="size-4" />,
                                    title: item.title,
                                    description: item.description,
                                    time: item.time,
                                }))}
                                emptyMessage="Belum ada aktivitas forum alumni tercatat."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
