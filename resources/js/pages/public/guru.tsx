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
    Network,
    Sprout,
    Users,
    UsersRound,
} from 'lucide-react';
import { useRef, useMemo } from 'react';
import { BorderGlow } from '@/components/public/border-glow';
import { SectionHeading } from '@/components/public/section-heading';
import { GuruDistributionChart } from '@/components/charts/school-charts';
import { fadeUp, motionViewport, staggerContainer } from '@/lib/motion';
import type { OrganizationNode, SchoolProfilePayload } from '@/types';

type GuruPageProps = {
    school: SchoolProfilePayload;
    leadership: OrganizationNode[];
};

function getInitials(name: string | null | undefined): string {
    if (!name) return '??';
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();
}

const guruHighlights = [
    {
        icon: BookOpen,
        stat: '50+',
        label: 'Tenaga Pendidik',
        description: 'Guru yang mendedikasikan ilmu dan waktu untuk membina siswa SMAN 1 Tenjo.',
        gradient: 'from-emerald-500 to-emerald-700',
    },
    {
        icon: GraduationCap,
        stat: 'S1-S2',
        label: 'Kualifikasi',
        description: 'Mayoritas guru berkualifikasi Sarjana hingga Magister dari universitas ternama.',
        gradient: 'from-sky-500 to-sky-700',
    },
    {
        icon: Award,
        stat: '30+',
        label: 'Tahun Pengabdian',
        description: 'Dedikasi para senior yang mengawal reputasi sekolah selama berpuluh tahun.',
        gradient: 'from-violet-500 to-violet-700',
    },
    {
        icon: Heart,
        stat: '100%',
        label: 'Komitmen',
        description: 'Komitmen terhadap karakter, inovasi, dan kualitas pembelajaran kelas atas.',
        gradient: 'from-rose-500 to-rose-700',
    },
];

export default function GuruPage({ school, leadership }: GuruPageProps) {
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    // Filter only school_management scope as "guru"
    const guruNodes = leadership.filter((node) => node.scope === 'school_management');

    return (
        <>
            <Head title="Tenaga Pendidik">
                <meta
                    name="description"
                    content={`Profil guru dan tenaga pendidik ${school.name}. Dedikasi, kompetensi, dan semangat mendidik generasi terbaik.`}
                />
            </Head>

            <div className="space-y-16 lg:space-y-24 pb-20">
                {/* ═══════════════════ HERO ═══════════════════ */}
                <motion.section
                    ref={heroRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative w-[100vw] h-[75vh] lg:h-[80dvh] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-8 md:-mt-10 overflow-hidden bg-slate-900"
                >
                    <motion.div className="absolute inset-0 z-0" style={{ y: heroY }}>
                        <div className="absolute inset-0">
                            <img
                                src="/images/sekolah/guru_mengajar.jpg"
                                alt="Guru SMAN 1 Tenjo"
                                className="h-full w-full object-cover object-center opacity-35 mix-blend-luminosity"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent" />
                        </div>
                        <div className="absolute -left-20 top-1/4 size-[400px] rounded-full bg-sky-500/10 blur-[120px]" />
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
                                className="flex flex-wrap items-center gap-3 mb-6"
                            >
                                <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 backdrop-blur-md">
                                    <Users className="size-4 text-sky-400" />
                                    <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-sky-300">
                                        Tenaga Pendidik
                                    </span>
                                </div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 backdrop-blur-md">
                                    <Lightbulb className="size-4 text-emerald-400" />
                                    <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-emerald-300">
                                        {school.staffCount}+ Penanggung Jawab
                                    </span>
                                </div>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="font-heading text-4xl leading-tight text-white md:text-5xl lg:text-6xl max-w-4xl"
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
                                Profil dan dedikasi para guru yang menjadi pilar utama kualitas
                                pembelajaran di {school.name}.
                            </motion.p>
                        </div>
                    </motion.div>
                </motion.section>

                {/* ═══════════════════ HIGHLIGHT STATS ═══════════════════ */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-20 -mt-20 lg:-mt-32">
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                        {guruHighlights.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                                    whileHover={{ y: -5 }}
                                    className="group rounded-2xl border border-white/70 bg-white/90 p-6 shadow-lg backdrop-blur-xl transition-shadow hover:shadow-xl"
                                >
                                    <div className={`flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
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
                <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-10">
                    <SectionHeading
                        eyebrow="Struktur Pendidik"
                        title="Guru dan staf yang membentuk fondasi pendidikan sekolah."
                        description="Data ditampilkan berdasarkan posisi aktif dalam sistem organisasi. Setiap guru memiliki peran strategis dalam membimbing siswa."
                    />

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={motionViewport}
                        className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
                    >
                        {guruNodes.length > 0 ? (
                            guruNodes.map((node) => (
                                <motion.div
                                    key={node.id}
                                    variants={fadeUp}
                                    whileHover={{ y: -5 }}
                                    className="group relative rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_-30px_rgba(15,118,110,0.2)] transition-all hover:shadow-[0_28px_70px_-30px_rgba(15,118,110,0.35)]"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Avatar */}
                                        <div className="relative flex-shrink-0 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
                                            <span className="font-heading text-lg font-bold">
                                                {getInitials(node.name)}
                                            </span>
                                            <div className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full border-2 border-white bg-emerald-500" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-heading text-lg font-semibold text-[var(--school-ink)] leading-tight">
                                                {node.name ?? 'Belum dipublikasikan'}
                                            </h3>
                                            <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-100 px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-sky-700">
                                                <Network className="size-3" />
                                                {node.position ?? 'Posisi'}
                                            </div>
                                        </div>
                                    </div>

                                    <p className="mt-4 text-sm leading-relaxed text-[var(--school-muted)] line-clamp-3">
                                        {node.biography ?? 'Informasi biografi guru belum tersedia dalam sistem. Halaman ini akan terus diperkaya seiring berjalannya input data.'}
                                    </p>

                                    {node.unit && (
                                        <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
                                            <div className="size-2 rounded-full bg-emerald-500" />
                                            <span className="text-xs font-semibold text-slate-400">
                                                {node.unit}
                                            </span>
                                        </div>
                                    )}
                                </motion.div>
                            ))
                        ) : (
                            <div className="lg:col-span-3 rounded-[2rem] border border-dashed border-slate-200 bg-white/70 p-10 text-center">
                                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-300 mb-5">
                                    <Users className="size-7" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-500">
                                    Data Guru Belum Tersedia
                                </h3>
                                <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[var(--school-muted)]">
                                    Profil tenaga pendidik akan muncul secara otomatis ketika data
                                    organisasi dimasukkan ke dalam sistem manajemen sekolah.
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
                                guruNodes.reduce<Record<string, number>>((acc, node) => {
                                    const unit = node.unit ?? 'Umum';
                                    acc[unit] = (acc[unit] ?? 0) + 1;
                                    return acc;
                                }, {})
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
                        className="rounded-[2rem] border border-white/80 bg-white/90 p-8 md:p-12 shadow-[0_32px_90px_-50px_rgba(15,118,110,0.3)] backdrop-blur-xl"
                    >
                        <div className="grid gap-10 lg:grid-cols-2 items-center">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-slate-500">
                                    <Lightbulb className="size-4" />
                                    Filosofi Pengajaran
                                </div>
                                <h2 className="font-heading text-3xl leading-tight text-[var(--school-ink)] md:text-4xl">
                                    Mendidik bukan hanya soal nilai rapor,{' '}
                                    <span className="text-slate-400">
                                        tetapi membentuk karakter yang siap menghadapi dunia.
                                    </span>
                                </h2>
                                <p className="text-base leading-8 text-[var(--school-muted)]">
                                    Para guru di {school.name} tidak hanya mengajar mata pelajaran akademik.
                                    Mereka adalah pembentuk karakter, pendengar, dan motivator yang mendorong
                                    siswa mencapai potensi terbaiknya — baik secara intelektual maupun emosional.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { icon: BookMarked, title: 'Kurikulum Merdeka', desc: 'Mengajar dengan pendekatan diferensiasi', gradient: 'from-emerald-500 to-emerald-700' },
                                    { icon: Brain, title: 'Berpikir Kritis', desc: 'Melatih kreativitas dan pemecahan masalah', gradient: 'from-violet-500 to-violet-700' },
                                    { icon: UsersRound, title: 'Kolaboratif', desc: 'Bekerja sama lintas bidang studi', gradient: 'from-sky-500 to-sky-700' },
                                    { icon: Sprout, title: 'Berkelanjutan', desc: 'Pelatihan dan pengembangan diri terus-menerus', gradient: 'from-amber-500 to-amber-700' },
                                ].map((item) => {
                                    const ItemIcon = item.icon;
                                    return (
                                    <motion.div
                                        key={item.title}
                                        whileHover={{ y: -3 }}
                                        className="group rounded-2xl border border-slate-100 bg-white/80 p-5 text-center shadow-sm transition-shadow hover:shadow-md"
                                    >
                                        <div className={`mx-auto flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} text-white shadow-md mb-3 transition-transform duration-300 group-hover:scale-110`}>
                                            <ItemIcon className="size-4" />
                                        </div>
                                        <div className="text-sm font-semibold text-[var(--school-ink)]">{item.title}</div>
                                        <div className="mt-1 text-xs text-[var(--school-muted)]">{item.desc}</div>
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
