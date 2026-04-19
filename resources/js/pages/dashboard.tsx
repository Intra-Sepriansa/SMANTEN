import { Head, Link, router } from '@inertiajs/react';
import type { InertiaLinkProps } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    BookOpen,
    CalendarCheck,
    FileBarChart,
    GraduationCap,
    RefreshCw,
    Settings,
    ShieldCheck,
    Sparkles,
    Users,
    Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { dashboard } from '@/routes';
import {
    admin as adminDashboard,
    guru as guruDashboard,
    siswa as siswaDashboard,
    wali as waliDashboard,
} from '@/routes/dashboard';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.08,
        },
    },
} as const;

const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.92 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: 'spring', stiffness: 300, damping: 22 },
    },
} as const;

const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
    hover: {
        scale: 1.04,
        y: -4,
        transition: { type: 'spring', stiffness: 400, damping: 15 },
    },
} as const;

type DashboardAccess = {
    label: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon: LucideIcon;
    description: string;
    metric: string;
    cta: string;
    from: string;
    to: string;
    bg: string;
    shadow: string;
    hoverShadow: string;
    gradientBg: string;
    tint: string;
};

const roleLinks: DashboardAccess[] = [
    {
        label: 'Admin',
        href: adminDashboard(),
        icon: ShieldCheck,
        description:
            'Kelola portal, data sekolah, konten publik, dan akses internal.',
        metric: 'Command Center',
        cta: 'Masuk Admin',
        from: 'from-indigo-500',
        to: 'to-purple-600',
        bg: 'bg-indigo-500',
        shadow: 'shadow-indigo-500/30',
        hoverShadow: 'hover:shadow-indigo-500/10',
        gradientBg:
            'from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10',
        tint: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200',
    },
    {
        label: 'Guru',
        href: guruDashboard(),
        icon: GraduationCap,
        description:
            'Pantau jadwal, materi, publikasi kelas, dan aktivitas mengajar.',
        metric: 'Teaching Ops',
        cta: 'Masuk Guru',
        from: 'from-sky-400',
        to: 'to-indigo-600',
        bg: 'bg-sky-500',
        shadow: 'shadow-sky-500/30',
        hoverShadow: 'hover:shadow-sky-500/10',
        gradientBg:
            'from-sky-500/5 to-indigo-500/5 dark:from-sky-500/10 dark:to-indigo-500/10',
        tint: 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-200',
    },
    {
        label: 'Siswa',
        href: siswaDashboard(),
        icon: BookOpen,
        description:
            'Akses informasi belajar, karya, pengumuman, dan agenda sekolah.',
        metric: 'Student Space',
        cta: 'Masuk Siswa',
        from: 'from-rose-400',
        to: 'to-pink-600',
        bg: 'bg-rose-500',
        shadow: 'shadow-rose-500/30',
        hoverShadow: 'hover:shadow-rose-500/10',
        gradientBg:
            'from-rose-500/5 to-pink-500/5 dark:from-rose-500/10 dark:to-pink-500/10',
        tint: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200',
    },
    {
        label: 'Wali Murid',
        href: waliDashboard(),
        icon: Users,
        description:
            'Ikuti kabar sekolah, perkembangan anak, dan informasi keluarga.',
        metric: 'Family View',
        cta: 'Masuk Wali',
        from: 'from-amber-400',
        to: 'to-orange-600',
        bg: 'bg-amber-500',
        shadow: 'shadow-amber-500/30',
        hoverShadow: 'hover:shadow-amber-500/10',
        gradientBg:
            'from-amber-500/5 to-orange-500/5 dark:from-amber-500/10 dark:to-orange-500/10',
        tint: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-200',
    },
];

const quickActions = [
    {
        label: 'Admin',
        href: adminDashboard(),
        icon: ShieldCheck,
        primary: true,
    },
    {
        label: 'Guru',
        href: guruDashboard(),
        icon: GraduationCap,
        primary: false,
    },
    {
        label: 'Siswa',
        href: siswaDashboard(),
        icon: BookOpen,
        primary: false,
    },
    {
        label: 'Wali Murid',
        href: waliDashboard(),
        icon: Users,
        primary: false,
    },
] satisfies Array<{
    label: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon: LucideIcon;
    primary: boolean;
}>;

const systemHighlights = [
    {
        label: 'Portal',
        value: 'Aktif',
        icon: Zap,
        tone: 'text-emerald-600',
        bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    },
    {
        label: 'Kalender',
        value: 'Sinkron',
        icon: CalendarCheck,
        tone: 'text-sky-600',
        bg: 'bg-sky-100 dark:bg-sky-900/30',
    },
    {
        label: 'Laporan',
        value: 'Siap',
        icon: FileBarChart,
        tone: 'text-violet-600',
        bg: 'bg-violet-100 dark:bg-violet-900/30',
    },
    {
        label: 'Kontrol',
        value: 'Terjaga',
        icon: Settings,
        tone: 'text-amber-600',
        bg: 'bg-amber-100 dark:bg-amber-900/30',
    },
];

export default function Dashboard() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    useEffect(() => {
        const timer = window.setInterval(
            () => setCurrentTime(new Date()),
            1000,
        );

        return () => window.clearInterval(timer);
    }, []);

    return (
        <>
            <Head title="Dashboard" />

            <motion.div
                className="relative flex h-full flex-1 flex-col gap-6 overflow-hidden p-4 sm:p-6 lg:p-8"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.12),transparent_34%)]" />

                <motion.section
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
                        className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500"
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
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-30" />
                    <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

                    <div className="relative">
                        <div className="flex flex-wrap items-start justify-between gap-6">
                            <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:gap-6 sm:text-left">
                                <motion.div
                                    className="relative flex h-20 w-20 shrink-0 sm:h-24 sm:w-24"
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
                                    <img
                                        src="/images/logo_clean.png"
                                        alt="SMAN 1 Tenjo"
                                        className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]"
                                    />
                                </motion.div>

                                <div className="mt-1 flex-1 sm:mt-0">
                                    <motion.p
                                        className="text-sm font-medium tracking-wide text-indigo-100"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        Selamat datang di
                                    </motion.p>
                                    <motion.h1
                                        className="mt-1 text-2xl font-bold text-white sm:text-3xl"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        Dashboard SMANTEN
                                    </motion.h1>
                                    <motion.p
                                        className="mt-2 max-w-lg text-sm leading-relaxed text-indigo-100 sm:text-base"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        Pantau ruang kerja sekolah secara cepat
                                        untuk admin, guru, siswa, dan wali murid
                                        dalam satu portal internal.
                                    </motion.p>
                                </div>
                            </div>

                            <div className="mt-4 flex w-full flex-col items-center gap-2 sm:mt-0 sm:w-auto sm:items-end">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.6, type: 'spring' }}
                                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/20 px-4 py-2 shadow-lg backdrop-blur-xl sm:px-6 sm:py-3"
                                >
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
                            {quickActions.map((action) => {
                                const Icon = action.icon;

                                return (
                                    <motion.div
                                        key={action.label}
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Link
                                            href={action.href}
                                            className={
                                                action.primary
                                                    ? 'inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-[11px] font-semibold text-indigo-600 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl sm:gap-2 sm:px-4 sm:py-2 sm:text-xs'
                                                    : 'inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white/20 bg-white/20 px-3 py-1.5 text-[11px] font-semibold text-white shadow-lg backdrop-blur-md transition hover:bg-white/30 sm:gap-2 sm:px-4 sm:py-2 sm:text-xs'
                                            }
                                        >
                                            <Icon className="h-3.5 w-3.5" />
                                            {action.label}
                                        </Link>
                                    </motion.div>
                                );
                            })}

                            <motion.button
                                type="button"
                                onClick={() => router.reload()}
                                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white/20 bg-white/20 px-3 py-1.5 text-[11px] font-semibold text-white shadow-lg backdrop-blur-md transition hover:bg-white/30 sm:gap-2 sm:px-4 sm:py-2 sm:text-xs"
                                variants={itemVariants}
                                whileHover={{
                                    scale: 1.02,
                                    backgroundColor:
                                        'rgba(255, 255, 255, 0.25)',
                                }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <RefreshCw className="h-3.5 w-3.5" />
                                Refresh
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.section>

                <motion.div
                    className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4"
                    variants={containerVariants}
                >
                    {roleLinks.map((link) => {
                        const Icon = link.icon;
                        const cardKey = `access-${link.label}`;

                        return (
                            <motion.div
                                key={link.label}
                                className={`group relative overflow-hidden rounded-2xl border border-white/20 bg-white/40 p-3 shadow-xl backdrop-blur-xl transition-all sm:rounded-3xl sm:p-6 dark:bg-neutral-900/40 ${link.hoverShadow} dark:border-white/5`}
                                variants={cardVariants}
                                whileHover="hover"
                                onHoverStart={() => setHoveredCard(cardKey)}
                                onHoverEnd={() => setHoveredCard(null)}
                            >
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${link.gradientBg}`}
                                />
                                <motion.div
                                    initial={false}
                                    animate={{
                                        scale:
                                            hoveredCard === cardKey ? 1.5 : 1,
                                        opacity:
                                            hoveredCard === cardKey ? 0.4 : 0.2,
                                    }}
                                    transition={{ duration: 0.5 }}
                                    className={`absolute -top-10 -right-10 h-32 w-32 rounded-full ${link.bg} blur-3xl transition-all duration-500`}
                                />

                                <Link
                                    href={link.href}
                                    className="relative flex h-full flex-col items-center gap-2 text-center sm:flex-row sm:items-start sm:gap-4 sm:text-left"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 10 }}
                                        className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${link.from} ${link.to} text-white shadow-lg sm:h-14 sm:w-14 ${link.shadow}`}
                                    >
                                        <Icon className="h-5 w-5 sm:h-7 sm:w-7" />
                                    </motion.div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-col items-center justify-between gap-2 sm:flex-row sm:items-start">
                                            <div>
                                                <p className="text-[10px] font-medium tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
                                                    {link.metric}
                                                </p>
                                                <h2 className="mt-1 text-lg font-bold text-neutral-900 sm:text-xl dark:text-white">
                                                    {link.label}
                                                </h2>
                                            </div>
                                            <span
                                                className={`hidden rounded-full px-2.5 py-1 text-[10px] font-semibold sm:inline-flex ${link.tint}`}
                                            >
                                                {link.cta}
                                            </span>
                                        </div>
                                        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-neutral-600 sm:text-sm dark:text-neutral-400">
                                            {link.description}
                                        </p>
                                        <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                                            Buka dashboard
                                            <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>

                <motion.div
                    className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.95fr)]"
                    variants={containerVariants}
                >
                    <motion.section
                        className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/55 p-5 shadow-xl backdrop-blur-xl sm:p-6 dark:border-white/5 dark:bg-neutral-900/45"
                        variants={itemVariants}
                    >
                        <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-indigo-500/10 blur-3xl" />
                        <div className="relative flex flex-col gap-5">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-xs font-semibold tracking-[0.2em] text-indigo-500 uppercase dark:text-indigo-300">
                                        Akses Cepat
                                    </p>
                                    <h2 className="mt-1 text-xl font-bold text-neutral-950 dark:text-white">
                                        Pilih ruang kerja internal
                                    </h2>
                                </div>
                                <div className="inline-flex w-fit items-center gap-2 rounded-2xl border border-indigo-200/70 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 dark:border-indigo-400/20 dark:bg-indigo-500/10 dark:text-indigo-200">
                                    <Sparkles className="h-3.5 w-3.5" />
                                    Portal SMANTEN
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                {roleLinks.map((link) => {
                                    const Icon = link.icon;

                                    return (
                                        <Link
                                            key={link.cta}
                                            href={link.href}
                                            className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/5"
                                        >
                                            <div
                                                className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${link.from} ${link.to}`}
                                            />
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${link.from} ${link.to} text-white shadow-lg ${link.shadow}`}
                                                >
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-semibold text-neutral-950 dark:text-white">
                                                        {link.cta}
                                                    </p>
                                                    <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                                                        {link.metric}
                                                    </p>
                                                </div>
                                                <ArrowRight className="h-4 w-4 text-neutral-400 transition group-hover:translate-x-1 group-hover:text-indigo-600 dark:text-neutral-500 dark:group-hover:text-indigo-300" />
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.section>

                    <motion.section
                        className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/55 p-5 shadow-xl backdrop-blur-xl sm:p-6 dark:border-white/5 dark:bg-neutral-900/45"
                        variants={itemVariants}
                    >
                        <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-pink-500/10 blur-3xl" />
                        <div className="relative">
                            <div>
                                <p className="text-xs font-semibold tracking-[0.2em] text-pink-500 uppercase dark:text-pink-300">
                                    Status Portal
                                </p>
                                <h2 className="mt-1 text-xl font-bold text-neutral-950 dark:text-white">
                                    Sistem siap digunakan
                                </h2>
                            </div>

                            <div className="mt-5 grid gap-3">
                                {systemHighlights.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <div
                                            key={item.label}
                                            className="flex items-center justify-between gap-3 rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-white/5"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${item.bg} ${item.tone}`}
                                                >
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-neutral-950 dark:text-white">
                                                        {item.label}
                                                    </p>
                                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                        {item.value}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.9)]" />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.section>
                </motion.div>
            </motion.div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
