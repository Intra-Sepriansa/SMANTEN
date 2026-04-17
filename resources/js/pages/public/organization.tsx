import { Head } from '@inertiajs/react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
    Building2,
    ChevronDown,
    Crown,
    Eye,
    GraduationCap,
    History,
    Network,
    RefreshCcw,
    Scale,
    Shield,
    Sparkles,
    Users,
    UsersRound,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { InteractiveOrgChart } from '@/components/org/interactive-org-chart';
import { BorderGlow } from '@/components/public/border-glow';
import { SectionHeading } from '@/components/public/section-heading';
import { Skeleton } from '@/components/ui/skeleton';
import { useHistoricalOrganizationQuery } from '@/lib/query/public-site';
import { fadeUp, motionViewport, staggerContainer } from '@/lib/motion';
import { useSiteUiStore } from '@/stores/site-ui-store';
import type { OrganizationNode, SchoolProfilePayload } from '@/types';

type OrganizationPageProps = {
    school: SchoolProfilePayload;
    leadership: OrganizationNode[];
};

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
    month: 'short',
    year: 'numeric',
});

const scopeConfig = {
    school_management: {
        label: 'Manajemen Sekolah',
        shortLabel: 'Sekolah',
        icon: Building2,
        heroGradient: 'from-slate-900 via-emerald-950 to-slate-900',
        accentFrom: 'from-emerald-500/20',
        accentTo: 'to-sky-500/20',
        pillBg: 'bg-emerald-500/10',
        pillBorder: 'border-emerald-500/30',
        pillText: 'text-emerald-300',
        activeTabBg: 'bg-[var(--school-green-700)]',
        activeTabText: 'text-white',
        description:
            'Rangkaian kepemimpinan guru dan tenaga kependidikan yang menjaga laju pendidikan.',
    },
    student_organization: {
        label: 'Organisasi Siswa',
        shortLabel: 'OSIS',
        icon: Users,
        heroGradient: 'from-slate-900 via-amber-950 to-slate-900',
        accentFrom: 'from-amber-500/20',
        accentTo: 'to-orange-500/20',
        pillBg: 'bg-amber-500/10',
        pillBorder: 'border-amber-500/30',
        pillText: 'text-amber-300',
        activeTabBg: 'bg-[var(--school-gold-500)]',
        activeTabText: 'text-[var(--school-ink)]',
        description:
            'Struktur kepengurusan siswa yang memimpin kreativitas, aspirasi, dan aktivitas siswa.',
    },
} as const;

export default function OrganizationPage({
    school,
    leadership,
}: OrganizationPageProps) {
    const scope = useSiteUiStore((state) => state.organizationScope);
    const setScope = useSiteUiStore((state) => state.setOrganizationScope);

    const items = leadership.filter((item) => item.scope === scope);
    const activeCount = items.filter((item) => item.isCurrent).length;
    const { data: historicalArchive, isLoading: isArchiveLoading } =
        useHistoricalOrganizationQuery(scope);

    const config = scopeConfig[scope];
    const ScopeIcon = config.icon;

    // Hero parallax
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    // Archive expand/collapse
    const [isArchiveExpanded, setIsArchiveExpanded] = useState(false);

    return (
        <>
            <Head title="Organisasi">
                <meta
                    name="description"
                    content={`Struktur Organisasi ${school.name} — Kepemimpinan aktif manajemen sekolah dan kepengurusan OSIS.`}
                />
            </Head>

            <div className="space-y-16 lg:space-y-24 pb-20">
                {/* ═══════════════════ HERO SECTION ═══════════════════ */}
                <motion.section
                    ref={heroRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative w-[100vw] h-[75vh] lg:h-[80dvh] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-8 md:-mt-10 overflow-hidden bg-slate-900"
                >
                    <motion.div
                        className="absolute inset-0 z-0"
                        style={{ y: heroY }}
                    >
                        <div className="absolute inset-0">
                            <img
                                src="/images/sekolah/guru_mengajar.jpg"
                                alt="Guru SMAN 1 Tenjo"
                                className="h-full w-full object-cover object-center opacity-30 mix-blend-luminosity"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/50 to-transparent" />
                        </div>

                        {/* Ambient glow */}
                        <div className="absolute -left-20 top-1/4 size-[400px] rounded-full bg-emerald-500/10 blur-[120px]" />
                        <div className="absolute right-0 top-1/3 size-[350px] rounded-full bg-sky-500/8 blur-[100px]" />
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04] mix-blend-overlay" />
                    </motion.div>

                    {/* Hero Content */}
                    <motion.div
                        className="relative z-10 flex h-full items-end pb-20 lg:pb-28"
                        style={{ opacity: heroOpacity }}
                    >
                        <div className="mx-auto w-full max-w-7xl px-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="flex flex-wrap items-center gap-3 mb-6"
                            >
                                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 backdrop-blur-md">
                                    <Network className="size-4 text-emerald-400" />
                                    <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-emerald-300">
                                        Struktur Organisasi
                                    </span>
                                </div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 backdrop-blur-md">
                                    <Crown className="size-4 text-sky-400" />
                                    <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-sky-300">
                                        {activeCount} Node Aktif
                                    </span>
                                </div>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="font-heading text-4xl leading-tight text-white md:text-5xl lg:text-6xl max-w-4xl"
                            >
                                Kepemimpinan &{' '}
                                <span className="bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
                                    Struktur.
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300"
                            >
                                Menampilkan arsitektur kepemimpinan dan kepengurusan aktif{' '}
                                {school.name}. Data dipisahkan secara tegas antara struktur
                                berjalan dengan arsip historis.
                            </motion.p>
                        </div>
                    </motion.div>
                </motion.section>

                {/* ═══════════════════ SCOPE TABS + STATS ═══════════════════ */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-20 -mt-20 lg:-mt-32 space-y-10">
                    {/* Scope Tabs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="flex flex-wrap gap-3 justify-center"
                    >
                        {(
                            Object.keys(scopeConfig) as Array<
                                keyof typeof scopeConfig
                            >
                        ).map((key) => {
                            const cfg = scopeConfig[key];
                            const Icon = cfg.icon;
                            const isActive = scope === key;
                            return (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setScope(key)}
                                    className={`group flex items-center gap-3 rounded-full px-6 py-3.5 text-sm font-semibold transition-all duration-300 shadow-lg ${
                                        isActive
                                            ? `${cfg.activeTabBg} ${cfg.activeTabText} shadow-xl scale-105`
                                            : 'border border-white/60 bg-white/80 text-[var(--school-muted)] hover:bg-white hover:shadow-xl backdrop-blur-xl'
                                    }`}
                                >
                                    <Icon
                                        className={`size-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                                    />
                                    {cfg.label}
                                </button>
                            );
                        })}
                    </motion.div>

                    {/* Animated Scope Summary */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={scope}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.3 }}
                        >
                            <BorderGlow
                                borderRadius={32}
                                colors={
                                    scope === 'school_management'
                                        ? ['#10B981', '#0EA5E9', '#6366F1']
                                        : ['#F59E0B', '#EF4444', '#EC4899']
                                }
                                className="rounded-[2rem] border border-white/80 bg-white/90 p-8 md:p-12 shadow-[0_32px_90px_-50px_rgba(15,118,110,0.3)] backdrop-blur-xl"
                            >
                                <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
                                    <div className="space-y-5">
                                        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-slate-500">
                                            <ScopeIcon className="size-4" />
                                            {config.label}
                                        </div>
                                        <h2 className="font-heading text-3xl leading-tight text-[var(--school-ink)] md:text-4xl">
                                            {scope === 'school_management'
                                                ? 'Arsitektur kepemimpinan sekolah dibangun sebagai sistem posisi,'
                                                : 'Kepengurusan siswa disusun agar aspirasi terwadahi dengan jelas,'}
                                            <span className="text-slate-400">
                                                {' '}
                                                bukan daftar nama lepas.
                                            </span>
                                        </h2>
                                        <p className="max-w-2xl text-base leading-8 text-[var(--school-muted)]">
                                            {config.description} Setiap node
                                            yang belum terisi tetap ditampilkan
                                            sebagai slot adaptif agar bagan
                                            menjaga bentuknya sambil memberi
                                            ruang untuk pembaruan data.
                                        </p>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-3 gap-4 lg:grid-cols-1">
                                        <div className="rounded-2xl border border-white/70 bg-white/60 p-5 text-center lg:text-left shadow-sm">
                                            <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-slate-400">
                                                Node Aktif
                                            </div>
                                            <div className="mt-2 text-3xl font-bold text-[var(--school-ink)]">
                                                {activeCount}
                                            </div>
                                        </div>
                                        <div className="rounded-2xl border border-white/70 bg-white/60 p-5 text-center lg:text-left shadow-sm">
                                            <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-slate-400">
                                                Slot Adaptif
                                            </div>
                                            <div className="mt-2 text-3xl font-bold text-slate-300">
                                                {items.length > 0
                                                    ? Math.max(
                                                          0,
                                                          8 - activeCount,
                                                      )
                                                    : 8}
                                            </div>
                                        </div>
                                        <div className="rounded-2xl border border-white/70 bg-white/60 p-5 text-center lg:text-left shadow-sm">
                                            <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-slate-400">
                                                Scope
                                            </div>
                                            <div className="mt-2 text-3xl font-bold text-[var(--school-ink)]">
                                                {config.shortLabel}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </BorderGlow>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* ═══════════════════ VISUALISASI HIERARKI INTRO ═══════════════════ */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={motionViewport}
                        transition={{ duration: 0.6 }}
                        className="mb-12"
                    >
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4">
                                    <Network className="size-4" />
                                    Visualisasi Hierarki
                                </div>
                                <h2 className="font-heading text-3xl leading-tight text-[var(--school-ink)] md:text-4xl max-w-2xl">
                                    Setiap posisi memiliki peran, setiap tier menunjukan{' '}
                                    <span className="text-slate-400">
                                        jenjang tanggung jawab.
                                    </span>
                                </h2>
                            </div>
                        </div>

                        {/* 3-Step Flow Indicators */}
                        <div className="grid gap-4 md:grid-cols-3">
                            {[
                                {
                                    step: '01',
                                    title: 'Pimpinan Tertinggi',
                                    desc: 'Titik keputusan strategis yang memegang kendali arah institusi.',
                                    color: 'from-emerald-500 to-emerald-700',
                                    icon: Crown,
                                },
                                {
                                    step: '02',
                                    title: 'Wakil & Koordinator',
                                    desc: 'Lapisan koordinasi yang menjembatani kebijakan dengan pelaksanaan.',
                                    color: 'from-sky-500 to-sky-700',
                                    icon: Shield,
                                },
                                {
                                    step: '03',
                                    title: 'Pelaksana Fungsional',
                                    desc: 'Ujung tombak operasional yang menyentuh langsung proses harian.',
                                    color: 'from-violet-500 to-violet-700',
                                    icon: Sparkles,
                                },
                            ].map((item, i) => {
                                const Icon = item.icon;
                                return (
                                    <motion.div
                                        key={item.step}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={motionViewport}
                                        transition={{ delay: i * 0.1, duration: 0.5 }}
                                        className="group relative rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm hover:shadow-lg transition-shadow"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                                                <Icon className="size-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-slate-400">
                                                    Tier {item.step}
                                                </div>
                                                <h3 className="text-lg font-heading font-semibold text-[var(--school-ink)]">
                                                    {item.title}
                                                </h3>
                                                <p className="mt-1 text-sm leading-relaxed text-[var(--school-muted)]">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>

                {/* ═══════════════════ LIVE BAGAN ═══════════════════ */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <InteractiveOrgChart nodes={items} scope={scope} />
                </div>

                {/* ═══════════════════ HISTORICAL ARCHIVE ═══════════════════ */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <section className="space-y-8">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                            <SectionHeading
                                eyebrow="Arsip Historis"
                                title={
                                    scope === 'school_management'
                                        ? 'Riwayat kepemimpinan sekolah dipisahkan dari struktur aktif.'
                                        : 'Riwayat kepengurusan OSIS dipisahkan dari struktur siswa yang sedang berjalan.'
                                }
                                description="Data arsip ditampilkan terpisah agar pembaca tidak salah mengira figur yang sedang menjabat."
                            />

                            {historicalArchive &&
                                historicalArchive.length > 3 && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsArchiveExpanded((prev) => !prev)
                                        }
                                        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-white hover:shadow-md"
                                    >
                                        <History className="size-4" />
                                        {isArchiveExpanded
                                            ? 'Ringkaskan'
                                            : 'Tampilkan Semua'}
                                        <ChevronDown
                                            className={`size-4 transition-transform duration-300 ${isArchiveExpanded ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                )}
                        </div>

                        {isArchiveLoading ? (
                            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="rounded-[2rem] border border-white/70 bg-white/85 p-6"
                                    >
                                        <Skeleton className="h-5 w-28" />
                                        <Skeleton className="mt-4 h-8 w-3/4" />
                                        <Skeleton className="mt-3 h-4 w-full" />
                                        <Skeleton className="mt-2 h-4 w-5/6" />
                                    </div>
                                ))}
                            </div>
                        ) : historicalArchive &&
                          historicalArchive.length > 0 ? (
                            <motion.div
                                variants={staggerContainer}
                                initial="hidden"
                                whileInView="show"
                                viewport={motionViewport}
                                className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
                            >
                                {(isArchiveExpanded
                                    ? historicalArchive
                                    : historicalArchive.slice(0, 3)
                                ).map((entry) => (
                                    <motion.article
                                        key={entry.id}
                                        variants={fadeUp}
                                        whileHover={{ y: -5 }}
                                        className="group rounded-[2rem] border border-white/70 bg-white/88 p-6 shadow-[0_22px_60px_-44px_rgba(15,118,110,0.3)] transition-shadow hover:shadow-[0_28px_70px_-40px_rgba(15,118,110,0.45)]"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex size-12 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-slate-400 transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-100">
                                                <GraduationCap className="size-5" />
                                            </div>
                                            <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-slate-400">
                                                <History className="size-3" />
                                                Arsip
                                            </div>
                                        </div>

                                        <div className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-emerald-600">
                                            {entry.periodLabel}
                                        </div>
                                        <h3 className="mt-2 font-heading text-xl font-semibold text-[var(--school-ink)]">
                                            {entry.position}
                                        </h3>
                                        <div className="mt-1 text-base font-medium text-slate-500">
                                            {entry.name}
                                        </div>
                                        <p className="mt-3 text-sm leading-7 text-[var(--school-muted)]">
                                            {entry.biography ??
                                                'Arsip ini menjaga memori kepemimpinan tanpa mengganggu pembacaan struktur aktif.'}
                                        </p>
                                        <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                                            <Shield className="size-4 text-slate-300" />
                                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                                {entry.startsAt
                                                    ? dateFormatter.format(
                                                          new Date(
                                                              entry.startsAt,
                                                          ),
                                                      )
                                                    : 'Awal —'}
                                                {' → '}
                                                {entry.endsAt
                                                    ? dateFormatter.format(
                                                          new Date(
                                                              entry.endsAt,
                                                          ),
                                                      )
                                                    : 'Sekarang'}
                                            </span>
                                        </div>
                                    </motion.article>
                                ))}
                            </motion.div>
                        ) : (
                            <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white/70 p-10 text-center">
                                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-300 mb-5">
                                    <History className="size-7" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-500">
                                    Arsip Belum Tersedia
                                </h3>
                                <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[var(--school-muted)]">
                                    Arsip historis untuk scope ini belum
                                    dipublikasikan. Kontrak backend sudah
                                    dibuka, sehingga catatan kepemimpinan atau
                                    kepengurusan lama dapat ditampilkan tanpa
                                    mengubah struktur aktif.
                                </p>
                            </div>
                        )}
                    </section>
                </div>

                {/* ═══════════════════ PRINSIP TATA KELOLA ═══════════════════ */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={motionViewport}
                        transition={{ duration: 0.6 }}
                        className="space-y-10"
                    >
                        <div className="text-center max-w-2xl mx-auto">
                            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4">
                                <Shield className="size-4" />
                                Prinsip Tata Kelola
                            </div>
                            <h2 className="font-heading text-3xl leading-tight text-[var(--school-ink)] md:text-4xl">
                                Fondasi yang membangun{' '}
                                <span className="text-slate-400">
                                    setiap keputusan organisasi.
                                </span>
                            </h2>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                            {[
                                {
                                    title: 'Transparansi',
                                    description: 'Setiap keputusan dibuat secara terbuka dan bisa dipertanggungjawabkan kepada seluruh warga sekolah.',
                                    icon: Eye,
                                    iconGradient: 'from-emerald-500 to-emerald-700',
                                    gradient: 'from-emerald-50 to-sky-50',
                                    border: 'border-emerald-100',
                                },
                                {
                                    title: 'Akuntabilitas',
                                    description: 'Setiap peran memiliki batas wewenang yang jelas dan jangkauan tanggung jawab yang terukur.',
                                    icon: Scale,
                                    iconGradient: 'from-sky-500 to-sky-700',
                                    gradient: 'from-sky-50 to-violet-50',
                                    border: 'border-sky-100',
                                },
                                {
                                    title: 'Partisipasi',
                                    description: 'Keputusan tidak terisolasi di satu titik. Aspirasi siswa, guru, dan masyarakat didengar dan dipertimbangkan.',
                                    icon: UsersRound,
                                    iconGradient: 'from-violet-500 to-violet-700',
                                    gradient: 'from-violet-50 to-pink-50',
                                    border: 'border-violet-100',
                                },
                                {
                                    title: 'Keberlanjutan',
                                    description: 'Struktur didesain agar estafet kepemimpinan berjalan mulus tanpa mengulang kesalahan dari masa lalu.',
                                    icon: RefreshCcw,
                                    iconGradient: 'from-amber-500 to-amber-700',
                                    gradient: 'from-amber-50 to-emerald-50',
                                    border: 'border-amber-100',
                                },
                            ].map((principle, i) => {
                                const PrincipleIcon = principle.icon;
                                return (
                                <motion.div
                                    key={principle.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={motionViewport}
                                    transition={{ delay: i * 0.08, duration: 0.5 }}
                                    whileHover={{ y: -5 }}
                                    className={`group rounded-2xl border ${principle.border} bg-gradient-to-br ${principle.gradient} p-6 shadow-sm transition-shadow hover:shadow-lg`}
                                >
                                    <div className={`flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br ${principle.iconGradient} text-white shadow-lg mb-4 transition-transform duration-300 group-hover:scale-110`}>
                                        <PrincipleIcon className="size-5" />
                                    </div>
                                    <h3 className="font-heading text-lg font-semibold text-[var(--school-ink)]">
                                        {principle.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-[var(--school-muted)]">
                                        {principle.description}
                                    </p>
                                </motion.div>
                                );
                            })}
                        </div>
                    </motion.section>
                </div>
            </div>
        </>
    );
}
