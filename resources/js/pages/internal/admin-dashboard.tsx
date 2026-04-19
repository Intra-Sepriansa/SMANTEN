import { Head, Link, router } from '@inertiajs/react';
import type { InertiaLinkProps } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Activity,
    ArrowUpRight,
    CalendarDays,
    ClipboardList,
    Clock3,
    FileText,
    Flag,
    GraduationCap,
    LayoutDashboard,
    MessageCircle,
    RefreshCw,
    ShieldCheck,
    Sparkles,
    Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { ActivityFeed } from '@/components/internal/activity-feed';
import { formatAdminDate } from '@/lib/admin-format';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { admin as adminDashboard } from '@/routes/dashboard';
import {
    articles,
    organization,
    portfolio,
    ppdb,
    schedule,
    studentPortfolio,
    studentSchedule,
    students,
    teachers,
    website,
} from '@/routes/dashboard/admin';

type FocusTone = 'amber' | 'rose' | 'sky' | 'violet';

type FocusBoardCard = {
    key: 'ppdb' | 'content' | 'academic' | 'access';
    title: string;
    count: number;
    unit: string;
    summary: string;
    tone: FocusTone;
    checkpoints: { label: string; value: number | string }[];
};

type ForumWatchItem = {
    id: number;
    title: string;
    authorName: string;
    url: string | null;
    moderationStatus: string;
    likesCount: number;
    commentsCount: number;
    reportsCount: number;
    createdAt: string | null;
};

type ActivityItem = {
    id: number;
    title: string;
    description: string;
    time: string;
};

type AdminDashboardStats = {
    activeUserCount: number;
    pendingUserCount: number;
    teacherCount: number;
    studentCount: number;
    liveContentCount: number;
    urgentQueueCount: number;
    ppdbSubmittedCount: number;
    ppdbUnderReviewCount: number;
    ppdbAcceptedCount: number;
    publishedArticleCount: number;
    articleInReviewCount: number;
    portfolioSubmittedCount: number;
    portfolioPublishedCount: number;
    publishedTimetableCount: number;
    draftTimetableCount: number;
    currentOrganizationCount: number;
    verifiedUserCount: number;
    twoFactorEnabledCount: number;
    roomCount: number;
};

type AdminDashboardProps = {
    stats: AdminDashboardStats;
    filters: {
        from: string;
        until: string;
    };
    publicVisitors: {
        totalVisitors: number;
        totalPageViews: number;
        series: Array<{
            date: string;
            label: string;
            visitors: number;
            pageViews: number;
        }>;
    };
    focusBoard: FocusBoardCard[];
    forumWatchlist: ForumWatchItem[];
    activityFeed: ActivityItem[];
};

type DashboardAction = {
    label: string;
    href: NonNullable<InertiaLinkProps['href']>;
};

type DashboardToneStyle = {
    gradient: string;
    glow: string;
    icon: string;
    soft: string;
    badge: string;
    shadow: string;
};

const moderationStatusLabels: Record<string, string> = {
    approved: 'Approved',
    pending_review: 'Pending Review',
    rejected: 'Rejected',
};

const toneStyles: Record<FocusTone, DashboardToneStyle> = {
    amber: {
        gradient:
            'from-amber-500/10 to-orange-500/5 dark:from-amber-500/16 dark:to-orange-500/8',
        glow: 'bg-amber-500/35',
        icon: 'from-amber-400 to-orange-600',
        soft: 'bg-amber-50/80 text-amber-700 dark:bg-amber-500/10 dark:text-amber-200',
        badge: 'border-amber-200/60 bg-amber-100/80 text-amber-700 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200',
        shadow: 'hover:shadow-amber-500/10',
    },
    rose: {
        gradient:
            'from-rose-500/10 to-pink-500/5 dark:from-rose-500/16 dark:to-pink-500/8',
        glow: 'bg-rose-500/35',
        icon: 'from-rose-400 to-pink-600',
        soft: 'bg-rose-50/80 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200',
        badge: 'border-rose-200/60 bg-rose-100/80 text-rose-700 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200',
        shadow: 'hover:shadow-rose-500/10',
    },
    sky: {
        gradient:
            'from-sky-500/10 to-indigo-500/5 dark:from-sky-500/16 dark:to-indigo-500/8',
        glow: 'bg-sky-500/35',
        icon: 'from-sky-400 to-indigo-600',
        soft: 'bg-sky-50/80 text-sky-700 dark:bg-sky-500/10 dark:text-sky-200',
        badge: 'border-sky-200/60 bg-sky-100/80 text-sky-700 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-200',
        shadow: 'hover:shadow-sky-500/10',
    },
    violet: {
        gradient:
            'from-violet-500/10 to-fuchsia-500/5 dark:from-violet-500/16 dark:to-fuchsia-500/8',
        glow: 'bg-violet-500/35',
        icon: 'from-violet-400 to-fuchsia-600',
        soft: 'bg-violet-50/80 text-violet-700 dark:bg-violet-500/10 dark:text-violet-200',
        badge: 'border-violet-200/60 bg-violet-100/80 text-violet-700 dark:border-violet-400/20 dark:bg-violet-500/10 dark:text-violet-200',
        shadow: 'hover:shadow-violet-500/10',
    },
};

const focusIcons: Record<FocusBoardCard['key'], LucideIcon> = {
    ppdb: ClipboardList,
    content: FileText,
    academic: CalendarDays,
    access: ShieldCheck,
};

const focusActions: Record<FocusBoardCard['key'], DashboardAction[]> = {
    ppdb: [{ label: 'Buka PPDB', href: ppdb() }],
    content: [
        { label: 'Artikel', href: articles() },
        { label: 'Karya', href: portfolio() },
        { label: 'Website', href: website() },
    ],
    academic: [
        { label: 'Jadwal', href: schedule() },
        { label: 'Organisasi', href: organization() },
        { label: 'Guru', href: teachers() },
    ],
    access: [
        { label: 'Akses Siswa', href: students() },
        { label: 'Jadwal Siswa', href: studentSchedule() },
        { label: 'Portofolio Siswa', href: studentPortfolio() },
    ],
};

const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.06,
            delayChildren: 0.08,
        },
    },
} as const;

const itemVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 220,
            damping: 22,
        },
    },
} as const;

function SectionHeading({
    eyebrow,
    title,
    description,
}: {
    eyebrow: string;
    title: string;
    description?: string;
}) {
    return (
        <div className="space-y-2">
            <div className="text-[0.68rem] font-semibold tracking-[0.2em] text-neutral-500 uppercase dark:text-neutral-400">
                {eyebrow}
            </div>
            <h2 className="text-xl font-semibold text-neutral-950 dark:text-white">
                {title}
            </h2>
            {description && (
                <p className="max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                    {description}
                </p>
            )}
        </div>
    );
}

function VisitorTooltip({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: Array<{ name?: string; value?: number; color?: string }>;
    label?: string;
}) {
    if (!active || !payload?.length) {
        return null;
    }

    return (
        <div className="rounded-2xl border border-white/70 bg-white/95 p-3 shadow-xl backdrop-blur dark:border-white/10 dark:bg-neutral-950/90">
            <div className="text-sm font-semibold text-neutral-950 dark:text-white">
                {label}
            </div>
            <div className="mt-2 space-y-1.5 text-xs text-neutral-600 dark:text-neutral-300">
                {payload.map((entry) => (
                    <div
                        key={`${entry.name}-${entry.color}`}
                        className="flex items-center justify-between gap-3"
                    >
                        <div className="flex items-center gap-2">
                            <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span>{entry.name}</span>
                        </div>
                        <span className="font-semibold text-neutral-950 dark:text-white">
                            {entry.value ?? 0}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function AdminDashboard({
    stats,
    filters,
    publicVisitors,
    focusBoard,
    forumWatchlist,
    activityFeed,
}: AdminDashboardProps) {
    const [currentTime, setCurrentTime] = useState(() => new Date());
    const [visitorFilters, setVisitorFilters] = useState(filters);
    const numberFormatter = new Intl.NumberFormat('id-ID');

    useEffect(() => {
        const timer = window.setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => window.clearInterval(timer);
    }, []);

    useEffect(() => {
        setVisitorFilters(filters);
    }, [filters]);

    const heroStats = [
        {
            title: 'Antrian Aktif',
            value: stats.urgentQueueCount,
            icon: ClipboardList,
            tone: 'amber' as const,
        },
        {
            title: 'Akun Aktif',
            value: stats.activeUserCount,
            icon: Users,
            tone: 'sky' as const,
        },
        {
            title: 'Konten Live',
            value: stats.liveContentCount,
            icon: Sparkles,
            tone: 'rose' as const,
        },
        {
            title: 'Jadwal Tayang',
            value: stats.publishedTimetableCount,
            icon: CalendarDays,
            tone: 'violet' as const,
        },
    ];

    const applyVisitorFilters = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        router.visit(
            adminDashboard.url({
                query: {
                    from: visitorFilters.from,
                    until: visitorFilters.until,
                },
            }),
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    const hasVisitorData = publicVisitors.series.some(
        (item) => item.visitors > 0 || item.pageViews > 0,
    );

    return (
        <>
            <Head title="Dashboard Admin" />

            <motion.div
                className="relative isolate space-y-6 p-4 sm:p-6 lg:p-8"
                variants={pageVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-136 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.18),transparent_36%),radial-gradient(circle_at_top_right,rgba(236,72,153,0.14),transparent_34%),linear-gradient(180deg,rgba(248,250,252,0.98),rgba(255,255,255,0))] dark:bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.22),transparent_36%),radial-gradient(circle_at_top_right,rgba(236,72,153,0.18),transparent_34%),linear-gradient(180deg,rgba(10,15,30,0.95),rgba(10,15,30,0))]" />

                <motion.section
                    variants={itemVariants}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.6,
                        type: 'spring',
                        stiffness: 100,
                    }}
                    className="relative overflow-hidden rounded-3xl p-6 text-white shadow-2xl sm:p-8"
                >
                    <motion.div
                        className="absolute inset-0 bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500"
                        animate={{
                            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                        }}
                        transition={{
                            duration: 15,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                        style={{ backgroundSize: '200% 200%' }}
                    />

                    <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-30" />
                    <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

                    <div className="relative">
                        <div className="flex flex-wrap items-start justify-between gap-6">
                            <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:gap-6 sm:text-left">
                                <motion.div
                                    className="relative flex h-20 w-20 shrink-0 items-center justify-center sm:h-24 sm:w-24"
                                    initial={{
                                        opacity: 0,
                                        scale: 0.5,
                                        rotate: -10,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        rotate: 0,
                                    }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 300,
                                        delay: 0.2,
                                    }}
                                    whileHover={{ scale: 1.05, rotate: 5 }}
                                >
                                    <div className="absolute inset-0 rounded-4xl bg-white/15 shadow-[0_20px_45px_rgba(0,0,0,0.28)] backdrop-blur-xl" />
                                    <div className="absolute inset-2 rounded-[1.65rem] bg-linear-to-br from-white/25 to-white/5" />
                                    <LayoutDashboard className="relative size-10 text-white drop-shadow-[0_14px_20px_rgba(0,0,0,0.45)] sm:size-12" />
                                </motion.div>

                                <div className="mt-1 flex-1 sm:mt-0">
                                    <motion.p
                                        className="text-sm font-medium tracking-wide text-indigo-100"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        Admin
                                    </motion.p>
                                    <motion.h1
                                        className="mt-1 text-2xl font-bold text-white sm:text-3xl"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        Dashboard Admin
                                    </motion.h1>
                                    <motion.p
                                        className="mt-2 max-w-xl text-sm leading-6 text-indigo-100/90"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.48 }}
                                    >
                                        Menu utama untuk memantau tugas admin,
                                        data penting, dan trafik web publik.
                                    </motion.p>
                                </div>
                            </div>

                            <div className="mt-4 flex w-full flex-col items-center gap-2 sm:mt-0 sm:w-auto sm:items-end">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        delay: 0.6,
                                        type: 'spring',
                                    }}
                                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/20 px-4 py-2 shadow-lg backdrop-blur-xl sm:px-6 sm:py-3"
                                >
                                    <Clock3 className="size-4 text-white/80" />
                                    <div className="text-center sm:text-right">
                                        <p className="text-2xl font-bold tabular-nums sm:text-3xl">
                                            {currentTime.toLocaleTimeString(
                                                'id-ID',
                                                {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                },
                                            )}
                                        </p>
                                        <p className="text-[10px] text-indigo-200 sm:text-xs">
                                            {currentTime.toLocaleDateString(
                                                'id-ID',
                                                {
                                                    weekday: 'long',
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                },
                                            )}
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.05,
                                        delayChildren: 0.2,
                                    },
                                },
                            }}
                            className="mt-6 flex w-full flex-nowrap gap-2 overflow-x-auto border-t border-white/10 pt-6 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:mt-8 sm:gap-3 [&::-webkit-scrollbar]:hidden"
                        >
                            {[
                                {
                                    label: 'PPDB',
                                    href: ppdb(),
                                    icon: ClipboardList,
                                    primary: true,
                                },
                                {
                                    label: 'Jadwal',
                                    href: schedule(),
                                    icon: CalendarDays,
                                },
                                {
                                    label: 'Artikel',
                                    href: articles(),
                                    icon: FileText,
                                },
                                {
                                    label: 'Guru',
                                    href: teachers(),
                                    icon: GraduationCap,
                                },
                            ].map((action) => (
                                <motion.div
                                    key={action.label}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Link
                                        href={action.href}
                                        prefetch
                                        className={cn(
                                            'inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold shadow-lg transition',
                                            action.primary
                                                ? 'bg-white text-indigo-600 hover:-translate-y-0.5 hover:shadow-xl'
                                                : 'border border-white/20 bg-white/20 text-white backdrop-blur-md hover:bg-white/30',
                                        )}
                                    >
                                        <action.icon className="size-4" />
                                        {action.label}
                                    </Link>
                                </motion.div>
                            ))}

                            <motion.button
                                variants={itemVariants}
                                whileHover={{
                                    scale: 1.02,
                                    backgroundColor:
                                        'rgba(255, 255, 255, 0.25)',
                                }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => router.reload()}
                                className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/20 bg-white/20 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-md transition"
                            >
                                <RefreshCw className="size-4" />
                                Refresh
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.section>

                <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4"
                >
                    {heroStats.map((stat) => {
                        const style = toneStyles[stat.tone];

                        return (
                            <motion.div
                                key={stat.title}
                                variants={itemVariants}
                                whileHover={{
                                    scale: 1.04,
                                    y: -4,
                                    transition: {
                                        type: 'spring',
                                        stiffness: 400,
                                        damping: 15,
                                    },
                                }}
                                className={cn(
                                    'group relative overflow-hidden rounded-2xl border border-white/20 bg-white/40 p-4 shadow-xl backdrop-blur-xl transition-all sm:rounded-3xl sm:p-6 dark:border-white/5 dark:bg-neutral-900/40',
                                    style.shadow,
                                )}
                            >
                                <div
                                    className={cn(
                                        'absolute inset-0 bg-linear-to-br',
                                        style.gradient,
                                    )}
                                />
                                <div
                                    className={cn(
                                        'absolute -top-10 -right-10 h-32 w-32 rounded-full blur-3xl',
                                        style.glow,
                                    )}
                                />

                                <div className="relative flex flex-col items-center gap-3 text-center sm:flex-row sm:items-start sm:text-left">
                                    <div
                                        className={cn(
                                            'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-lg',
                                            style.icon,
                                        )}
                                    >
                                        <stat.icon className="size-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-neutral-500 sm:text-sm dark:text-neutral-400">
                                            {stat.title}
                                        </p>
                                        <div className="mt-1">
                                            <span className="text-xl font-bold text-neutral-900 sm:text-3xl dark:text-white">
                                                {numberFormatter.format(
                                                    stat.value,
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                <motion.section variants={itemVariants} className="space-y-4">
                    <SectionHeading
                        eyebrow="Monitoring"
                        title="Pengunjung Web Publik"
                    />

                    <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/40 p-5 shadow-xl backdrop-blur-xl sm:p-6 dark:border-white/5 dark:bg-neutral-900/40">
                        <div className="absolute inset-0 bg-linear-to-br from-indigo-500/8 via-sky-500/6 to-emerald-500/6 dark:from-indigo-500/10 dark:via-sky-500/8 dark:to-emerald-500/8" />

                        <div className="relative space-y-5">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                                <div className="flex flex-wrap items-start gap-3">
                                    <div className="rounded-2xl border border-sky-200/70 bg-white/70 px-4 py-3 backdrop-blur dark:border-sky-400/20 dark:bg-neutral-950/45">
                                        <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                            Total Pengunjung
                                        </div>
                                        <div className="mt-1 text-3xl font-bold text-neutral-950 dark:text-white">
                                            {numberFormatter.format(
                                                publicVisitors.totalVisitors,
                                            )}
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-emerald-200/70 bg-white/70 px-4 py-3 backdrop-blur dark:border-emerald-400/20 dark:bg-neutral-950/45">
                                        <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                            Total Kunjungan
                                        </div>
                                        <div className="mt-1 text-3xl font-bold text-neutral-950 dark:text-white">
                                            {numberFormatter.format(
                                                publicVisitors.totalPageViews,
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <form
                                    onSubmit={applyVisitorFilters}
                                    className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
                                >
                                    <label className="space-y-1">
                                        <span className="text-xs font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                            Dari
                                        </span>
                                        <input
                                            type="date"
                                            value={visitorFilters.from}
                                            onChange={(event) =>
                                                setVisitorFilters(
                                                    (current) => ({
                                                        ...current,
                                                        from: event.target
                                                            .value,
                                                    }),
                                                )
                                            }
                                            className="h-11 w-full rounded-2xl border border-white/70 bg-white/80 px-4 text-sm font-medium text-neutral-950 transition outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-200 dark:border-white/10 dark:bg-neutral-950/60 dark:text-white dark:focus:border-sky-400/40 dark:focus:ring-sky-500/20"
                                        />
                                    </label>

                                    <label className="space-y-1">
                                        <span className="text-xs font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                            Sampai
                                        </span>
                                        <input
                                            type="date"
                                            value={visitorFilters.until}
                                            onChange={(event) =>
                                                setVisitorFilters(
                                                    (current) => ({
                                                        ...current,
                                                        until: event.target
                                                            .value,
                                                    }),
                                                )
                                            }
                                            className="h-11 w-full rounded-2xl border border-white/70 bg-white/80 px-4 text-sm font-medium text-neutral-950 transition outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-200 dark:border-white/10 dark:bg-neutral-950/60 dark:text-white dark:focus:border-sky-400/40 dark:focus:ring-sky-500/20"
                                        />
                                    </label>

                                    <button
                                        type="submit"
                                        className="h-11 rounded-2xl bg-linear-to-r from-indigo-600 to-sky-500 px-5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:brightness-105 sm:self-end"
                                    >
                                        Terapkan
                                    </button>
                                </form>
                            </div>

                            <div className="h-80 rounded-3xl border border-white/60 bg-white/70 p-3 backdrop-blur dark:border-white/10 dark:bg-neutral-950/45">
                                {hasVisitorData ? (
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <AreaChart
                                            data={publicVisitors.series}
                                            margin={{
                                                top: 18,
                                                right: 12,
                                                left: 0,
                                                bottom: 0,
                                            }}
                                        >
                                            <defs>
                                                <linearGradient
                                                    id="visitorsGradient"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="5%"
                                                        stopColor="#0ea5e9"
                                                        stopOpacity={0.35}
                                                    />
                                                    <stop
                                                        offset="95%"
                                                        stopColor="#0ea5e9"
                                                        stopOpacity={0.02}
                                                    />
                                                </linearGradient>
                                                <linearGradient
                                                    id="pageViewsGradient"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="5%"
                                                        stopColor="#8b5cf6"
                                                        stopOpacity={0.25}
                                                    />
                                                    <stop
                                                        offset="95%"
                                                        stopColor="#8b5cf6"
                                                        stopOpacity={0.02}
                                                    />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid
                                                vertical={false}
                                                strokeDasharray="3 3"
                                                stroke="rgba(148, 163, 184, 0.2)"
                                            />
                                            <XAxis
                                                dataKey="label"
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={12}
                                                fontSize={12}
                                                stroke="#94a3b8"
                                            />
                                            <YAxis
                                                tickLine={false}
                                                axisLine={false}
                                                width={42}
                                                fontSize={12}
                                                stroke="#94a3b8"
                                                allowDecimals={false}
                                            />
                                            <Tooltip
                                                content={<VisitorTooltip />}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="pageViews"
                                                name="Kunjungan"
                                                stroke="#8b5cf6"
                                                fill="url(#pageViewsGradient)"
                                                strokeWidth={2}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="visitors"
                                                name="Pengunjung"
                                                stroke="#0ea5e9"
                                                fill="url(#visitorsGradient)"
                                                strokeWidth={3}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-neutral-300 text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
                                        Belum ada data pengunjung pada rentang
                                        ini.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.section>

                <motion.section variants={itemVariants} className="space-y-4">
                    <SectionHeading
                        eyebrow="Menu Utama"
                        title="Prioritas Admin"
                    />

                    <div className="grid gap-6 xl:grid-cols-2">
                        {focusBoard.map((card) => {
                            const style = toneStyles[card.tone];
                            const Icon = focusIcons[card.key];

                            return (
                                <motion.div
                                    key={card.key}
                                    variants={itemVariants}
                                    whileHover={{ y: -4, scale: 1.01 }}
                                    className={cn(
                                        'group relative overflow-hidden rounded-3xl border border-white/20 bg-white/40 p-6 shadow-xl backdrop-blur-xl transition-all dark:border-white/5 dark:bg-neutral-900/40',
                                        style.shadow,
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'absolute inset-0 bg-linear-to-br',
                                            style.gradient,
                                        )}
                                    />
                                    <div
                                        className={cn(
                                            'absolute -top-16 -right-12 h-40 w-40 rounded-full blur-3xl',
                                            style.glow,
                                        )}
                                    />

                                    <div className="relative space-y-5">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div
                                                    className={cn(
                                                        'inline-flex rounded-full border px-3 py-1 text-[0.68rem] font-semibold tracking-[0.18em] uppercase',
                                                        style.badge,
                                                    )}
                                                >
                                                    {card.title}
                                                </div>
                                                <div className="mt-3 flex items-baseline gap-2">
                                                    <span className="text-3xl font-bold text-neutral-950 dark:text-white">
                                                        {numberFormatter.format(
                                                            card.count,
                                                        )}
                                                    </span>
                                                    <span className="text-sm text-neutral-500 dark:text-neutral-400">
                                                        {card.unit}
                                                    </span>
                                                </div>
                                            </div>

                                            <div
                                                className={cn(
                                                    'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-lg',
                                                    style.icon,
                                                )}
                                            >
                                                <Icon className="size-5" />
                                            </div>
                                        </div>
                                        <div className="grid gap-3 sm:grid-cols-3">
                                            {card.checkpoints.map(
                                                (checkpoint) => (
                                                    <div
                                                        key={`${card.key}-${checkpoint.label}`}
                                                        className="rounded-2xl bg-white/70 px-4 py-3 backdrop-blur dark:bg-neutral-950/45"
                                                    >
                                                        <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                                            {checkpoint.label}
                                                        </div>
                                                        <div className="mt-1 text-lg font-semibold text-neutral-950 dark:text-white">
                                                            {checkpoint.value}
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {focusActions[card.key].map(
                                                (action) => (
                                                    <Link
                                                        key={`${card.key}-${action.label}`}
                                                        href={action.href}
                                                        prefetch
                                                        className={cn(
                                                            'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition',
                                                            style.soft,
                                                        )}
                                                    >
                                                        {action.label}
                                                        <ArrowUpRight className="size-4" />
                                                    </Link>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.section>

                <motion.section variants={itemVariants} className="space-y-4">
                    <SectionHeading
                        eyebrow="Pantauan"
                        title="Watchlist & Aktivitas"
                    />

                    <div className="grid gap-6 xl:grid-cols-2">
                        <motion.div
                            variants={itemVariants}
                            className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/40 p-6 shadow-xl backdrop-blur-xl dark:border-white/5 dark:bg-neutral-900/40"
                        >
                            <div className="absolute inset-0 bg-linear-to-br from-amber-500/8 to-rose-500/6 dark:from-amber-500/10 dark:to-rose-500/8" />

                            <div className="relative">
                                <div className="mb-5 flex items-start justify-between gap-4">
                                    <div>
                                        <div className="text-[0.68rem] font-semibold tracking-[0.18em] text-neutral-500 uppercase dark:text-neutral-400">
                                            Public Watchlist
                                        </div>
                                        <h3 className="mt-2 text-xl font-semibold text-neutral-950 dark:text-white">
                                            Forum Publik
                                        </h3>
                                    </div>

                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-amber-400 to-rose-600 text-white shadow-lg shadow-amber-500/30">
                                        <Flag className="size-5" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {forumWatchlist.length === 0 ? (
                                        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white/70 p-8 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-950/50 dark:text-neutral-400">
                                            Belum ada item watchlist.
                                        </div>
                                    ) : (
                                        forumWatchlist.map((post) => {
                                            const isRisky =
                                                post.reportsCount > 0 ||
                                                post.moderationStatus ===
                                                    'pending_review';

                                            return (
                                                <div
                                                    key={post.id}
                                                    className={cn(
                                                        'rounded-3xl border p-4 transition',
                                                        isRisky
                                                            ? 'border-amber-200/70 bg-amber-50/70 dark:border-amber-400/20 dark:bg-amber-500/10'
                                                            : 'border-white/60 bg-white/70 dark:border-white/10 dark:bg-neutral-950/45',
                                                    )}
                                                >
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="space-y-2">
                                                            {post.url ? (
                                                                <Link
                                                                    href={
                                                                        post.url
                                                                    }
                                                                    className="text-sm font-semibold text-neutral-950 transition hover:text-indigo-600 dark:text-white dark:hover:text-indigo-300"
                                                                >
                                                                    {post.title}
                                                                </Link>
                                                            ) : (
                                                                <div className="text-sm font-semibold text-neutral-950 dark:text-white">
                                                                    {post.title}
                                                                </div>
                                                            )}

                                                            <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                                                {
                                                                    post.authorName
                                                                }
                                                                {post.createdAt
                                                                    ? ` • ${formatAdminDate(post.createdAt)}`
                                                                    : ''}
                                                            </div>
                                                        </div>

                                                        <div
                                                            className={cn(
                                                                'rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.18em] uppercase',
                                                                isRisky
                                                                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-200'
                                                                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200',
                                                            )}
                                                        >
                                                            {moderationStatusLabels[
                                                                post
                                                                    .moderationStatus
                                                            ] ??
                                                                post.moderationStatus}
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                                                        <span className="inline-flex items-center gap-1">
                                                            <Sparkles className="size-3.5" />
                                                            {post.likesCount}{' '}
                                                            likes
                                                        </span>
                                                        <span className="inline-flex items-center gap-1">
                                                            <MessageCircle className="size-3.5" />
                                                            {post.commentsCount}{' '}
                                                            komentar
                                                        </span>
                                                        <span className="inline-flex items-center gap-1">
                                                            <Flag className="size-3.5" />
                                                            {post.reportsCount}{' '}
                                                            report
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/40 p-6 shadow-xl backdrop-blur-xl dark:border-white/5 dark:bg-neutral-900/40"
                        >
                            <div className="absolute inset-0 bg-linear-to-br from-sky-500/8 to-violet-500/6 dark:from-sky-500/10 dark:to-violet-500/8" />

                            <div className="relative">
                                <div className="mb-5 flex items-start justify-between gap-4">
                                    <div>
                                        <div className="text-[0.68rem] font-semibold tracking-[0.18em] text-neutral-500 uppercase dark:text-neutral-400">
                                            Audit Trail
                                        </div>
                                        <h3 className="mt-2 text-xl font-semibold text-neutral-950 dark:text-white">
                                            Aktivitas terbaru
                                        </h3>
                                    </div>

                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-sky-400 to-violet-600 text-white shadow-lg shadow-sky-500/30">
                                        <Activity className="size-5" />
                                    </div>
                                </div>

                                <div className="rounded-3xl bg-white/70 p-2 backdrop-blur dark:bg-neutral-950/45">
                                    <ActivityFeed
                                        items={activityFeed.map((item) => ({
                                            id: item.id,
                                            icon: (
                                                <Sparkles className="size-4" />
                                            ),
                                            title: item.title,
                                            description: item.description,
                                            time: item.time,
                                        }))}
                                        emptyMessage="Belum ada aktivitas terbaru."
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.section>
            </motion.div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Dashboard Admin',
            href: adminDashboard(),
        },
    ],
};
