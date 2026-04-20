import { Head } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Award,
    BookMarked,
    BookOpen,
    Brain,
    GraduationCap,
    Heart,
    Lightbulb,
    Sprout,
    Users,
    UsersRound,
} from 'lucide-react';
import { useRef, useMemo } from 'react';
import { GuruDistributionChart } from '@/components/charts/school-charts';
import ProfileCard from '@/components/ProfileCard';
import { BorderGlow } from '@/components/public/border-glow';
import { SectionHeading } from '@/components/public/section-heading';
import { fadeUp, motionViewport, staggerContainer } from '@/lib/motion';
import type { OrganizationNode, SchoolProfilePayload } from '@/types';

type GuruPageProps = {
    school: SchoolProfilePayload;
    leadership: OrganizationNode[];
};

const guruHighlights = [
    {
        icon: BookOpen,
        stat: '50+',
        label: 'Tenaga Pendidik',
        description:
            'Guru yang mendedikasikan ilmu dan waktu untuk membina siswa SMAN 1 Tenjo.',
        gradient: 'from-emerald-500 to-emerald-700',
    },
    {
        icon: GraduationCap,
        stat: 'S1-S2',
        label: 'Kualifikasi',
        description:
            'Guru memiliki kualifikasi akademik yang mendukung bidang pengajaran.',
        gradient: 'from-sky-500 to-sky-700',
    },
    {
        icon: Award,
        stat: '30+',
        label: 'Tahun Pengabdian',
        description:
            'Pengalaman pendidik senior memperkuat mutu layanan pembelajaran.',
        gradient: 'from-violet-500 to-violet-700',
    },
    {
        icon: Heart,
        stat: '100%',
        label: 'Komitmen',
        description:
            'Komitmen pada karakter, inovasi, dan kualitas pembelajaran.',
        gradient: 'from-rose-500 to-rose-700',
    },
];

const genericTeacherLabels = new Set([
    'guru',
    'guru mata pelajaran',
    'tenaga pendidik',
    'pendidik',
]);

function normalizeTeacherName(name: string | null | undefined): string {
    return (name ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '');
}

function normalizeTeacherLabel(value: string | null | undefined): string {
    return (value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
}

function resolveTeacherDisplayTitle(
    position: string | null | undefined,
    unit: string | null | undefined,
): string | undefined {
    const candidates = [position, unit];

    for (const candidate of candidates) {
        const normalizedCandidate = normalizeTeacherLabel(candidate);

        if (
            candidate &&
            normalizedCandidate &&
            !genericTeacherLabels.has(normalizedCandidate)
        ) {
            return candidate.trim();
        }
    }

    return undefined;
}

function resolveTeacherAvatarUrl(
    name: string | null | undefined,
): string | undefined {
    const normalizedName = normalizeTeacherName(name);

    if (
        normalizedName === 'koprasetyossimpd' ||
        (normalizedName.includes('prasetyo') &&
            normalizedName.includes('ssi') &&
            normalizedName.includes('mpd'))
    ) {
        return '/images/contoh.jpeg';
    }

    return undefined;
}

export default function GuruPage({ school, leadership }: GuruPageProps) {
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    // Filter only school_management scope as "guru"
    const guruNodes = leadership.filter(
        (node) => node.scope === 'school_management',
    );
    const guruProfiles = useMemo(
        () =>
            guruNodes.map((node) => {
                const displayName = node.name ?? 'Belum dipublikasikan';
                const title = resolveTeacherDisplayTitle(
                    node.position,
                    node.unit,
                );

                return {
                    ...node,
                    displayName,
                    title,
                    avatarUrl: resolveTeacherAvatarUrl(node.name),
                };
            }),
        [guruNodes],
    );

    return (
        <>
            <Head title="Tenaga Pendidik">
                <meta
                    name="description"
                    content={`Profil guru dan tenaga pendidik ${school.name}.`}
                />
            </Head>

            <div className="space-y-10 pb-16 lg:space-y-14">
                {/* ═══════════════════ HERO ═══════════════════ */}
                <motion.section
                    ref={heroRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative right-1/2 left-1/2 -mt-8 -mr-[50vw] -ml-[50vw] h-[75vh] w-[100vw] overflow-hidden bg-slate-900 md:-mt-10 lg:h-[80dvh]"
                >
                    <motion.div
                        className="absolute inset-0 z-0"
                        style={{ y: heroY }}
                    >
                        <div className="absolute inset-0">
                            <img
                                src="/images/sekolah/guru_mengajar.jpg"
                                alt="Guru SMAN 1 Tenjo"
                                className="h-full w-full object-cover object-center opacity-35 mix-blend-luminosity"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent" />
                        </div>
                        <div className="absolute top-1/4 -left-20 size-[400px] rounded-full bg-sky-500/10 blur-[120px]" />
                        <div className="absolute right-0 bottom-1/4 size-[350px] rounded-full bg-emerald-500/10 blur-[100px]" />
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04] mix-blend-overlay" />
                    </motion.div>

                    <motion.div
                        className="relative z-10 flex h-full items-end pb-20 lg:pb-28"
                        style={{ opacity: heroOpacity }}
                    >
                        <div className="mx-auto w-full max-w-7xl px-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="mb-6 flex flex-wrap items-center gap-3"
                            >
                                <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 backdrop-blur-md">
                                    <Users className="size-4 text-sky-400" />
                                    <span className="text-[0.65rem] font-bold tracking-[0.2em] text-sky-300 uppercase">
                                        Tenaga Pendidik
                                    </span>
                                </div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 backdrop-blur-md">
                                    <Lightbulb className="size-4 text-emerald-400" />
                                    <span className="text-[0.65rem] font-bold tracking-[0.2em] text-emerald-300 uppercase">
                                        {school.staffCount}+ Penanggung Jawab
                                    </span>
                                </div>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="max-w-4xl font-heading text-4xl leading-tight text-white md:text-5xl lg:text-6xl"
                            >
                                Guru & Tenaga{' '}
                                <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
                                    Pendidik.
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300"
                            >
                                Profil dan dedikasi para guru yang menjadi pilar
                                pembelajaran di {school.name}.
                            </motion.p>
                        </div>
                    </motion.div>
                </motion.section>

                {/* ═══════════════════ HIGHLIGHT STATS ═══════════════════ */}
                <div className="relative z-20 mx-auto -mt-20 max-w-7xl px-4 sm:px-6 lg:-mt-32">
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                        {guruHighlights.map((item, i) => {
                            const Icon = item.icon;

                            return (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: 0.5 + i * 0.1,
                                        duration: 0.5,
                                    }}
                                    whileHover={{ y: -5 }}
                                    className="group rounded-2xl border border-white/70 bg-white/90 p-6 shadow-lg backdrop-blur-xl transition-shadow hover:shadow-xl"
                                >
                                    <div
                                        className={`flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
                                    >
                                        <Icon className="size-5" />
                                    </div>
                                    <div className="mt-4 text-3xl font-bold text-[var(--school-ink)]">
                                        {item.stat}
                                    </div>
                                    <div className="text-sm font-semibold text-slate-500">
                                        {item.label}
                                    </div>
                                    <p className="mt-2 text-xs leading-relaxed text-[var(--school-muted)]">
                                        {item.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* ═══════════════════ GURU GRID ═══════════════════ */}
                <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6">
                    <SectionHeading
                        eyebrow="Struktur Pendidik"
                        title="Guru dan staf yang membentuk fondasi pendidikan sekolah."
                        description="Daftar guru aktif SMAN 1 Tenjo."
                    />

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={motionViewport}
                        className="grid items-start gap-8 md:grid-cols-2 xl:grid-cols-3"
                    >
                        {guruProfiles.length > 0 ? (
                            guruProfiles.map((node) => (
                                <motion.div
                                    key={node.id}
                                    variants={fadeUp}
                                    className="flex justify-center"
                                >
                                    <ProfileCard
                                        name={node.displayName}
                                        title={node.title}
                                        avatarUrl={node.avatarUrl}
                                        showUserInfo={false}
                                        className="mx-auto w-full max-w-[19rem]"
                                    />
                                </motion.div>
                            ))
                        ) : (
                            <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white/70 p-10 text-center lg:col-span-3">
                                <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
                                    <Users className="size-7" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-500">
                                    Data Guru Belum Tersedia
                                </h3>
                                <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[var(--school-muted)]">
                                    Profil tenaga pendidik akan muncul secara
                                    otomatis ketika data organisasi dimasukkan
                                    ke dalam sistem manajemen sekolah.
                                </p>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* ═══════════════════ GURU ANALYTICS ═══════════════════ */}
                {guruNodes.length > 0 && (
                    <div className="mx-auto max-w-7xl px-4 sm:px-6">
                        <GuruDistributionChart
                            data={Object.entries(
                                guruNodes.reduce<Record<string, number>>(
                                    (acc, node) => {
                                        const unit = node.unit ?? 'Umum';
                                        acc[unit] = (acc[unit] ?? 0) + 1;

                                        return acc;
                                    },
                                    {},
                                ),
                            )
                                .map(([unit, count]) => ({ unit, count }))
                                .sort((a, b) => b.count - a.count)}
                        />
                    </div>
                )}

                {/* ═══════════════════ FILOSOFI PENGAJARAN ═══════════════════ */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <BorderGlow
                        borderRadius={32}
                        colors={['#0EA5E9', '#8B5CF6', '#10B981']}
                        className="rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-[0_32px_90px_-50px_rgba(15,118,110,0.3)] backdrop-blur-xl md:p-12"
                    >
                        <div className="grid items-center gap-10 lg:grid-cols-2">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-[0.65rem] font-bold tracking-[0.2em] text-slate-500 uppercase">
                                    <Lightbulb className="size-4" />
                                    Filosofi Pengajaran
                                </div>
                                <h2 className="font-heading text-3xl leading-tight text-[var(--school-ink)] md:text-4xl">
                                    Pengajaran berfokus pada ilmu,{' '}
                                    <span className="text-slate-400">
                                        karakter, dan pendampingan siswa.
                                    </span>
                                </h2>
                                <p className="text-base leading-8 text-[var(--school-muted)]">
                                    Guru di {school.name} mengajar mata
                                    pelajaran, membina karakter, dan membantu
                                    siswa mengembangkan potensi belajar.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    {
                                        icon: BookMarked,
                                        title: 'Kurikulum Merdeka',
                                        desc: 'Mengajar dengan pendekatan diferensiasi',
                                        gradient:
                                            'from-emerald-500 to-emerald-700',
                                    },
                                    {
                                        icon: Brain,
                                        title: 'Berpikir Kritis',
                                        desc: 'Melatih kreativitas dan pemecahan masalah',
                                        gradient:
                                            'from-violet-500 to-violet-700',
                                    },
                                    {
                                        icon: UsersRound,
                                        title: 'Kolaboratif',
                                        desc: 'Bekerja sama lintas bidang studi',
                                        gradient: 'from-sky-500 to-sky-700',
                                    },
                                    {
                                        icon: Sprout,
                                        title: 'Berkelanjutan',
                                        desc: 'Pelatihan dan pengembangan diri terus-menerus',
                                        gradient: 'from-amber-500 to-amber-700',
                                    },
                                ].map((item) => {
                                    const ItemIcon = item.icon;

                                    return (
                                        <motion.div
                                            key={item.title}
                                            whileHover={{ y: -3 }}
                                            className="group rounded-2xl border border-slate-100 bg-white/80 p-5 text-center shadow-sm transition-shadow hover:shadow-md"
                                        >
                                            <div
                                                className={`mx-auto flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} mb-3 text-white shadow-md transition-transform duration-300 group-hover:scale-110`}
                                            >
                                                <ItemIcon className="size-4" />
                                            </div>
                                            <div className="text-sm font-semibold text-[var(--school-ink)]">
                                                {item.title}
                                            </div>
                                            <div className="mt-1 text-xs text-[var(--school-muted)]">
                                                {item.desc}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </BorderGlow>
                </div>
            </div>
        </>
    );
}
