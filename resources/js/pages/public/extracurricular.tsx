import { Head, Link } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Activity,
    ArrowRight,
    BadgeCheck,
    CalendarDays,
    Compass,
    Heart,
    Megaphone,
    PlayCircle,
    ShieldCheck,
    Sparkles,
    Trophy,
    Users,
} from 'lucide-react';
import { startTransition, useDeferredValue, useRef, useState } from 'react';
import {
    beritaIndex,
    beritaShow,
} from '@/actions/App/Http/Controllers/PublicSiteController';
import { BorderGlow } from '@/components/public/border-glow';
import { SectionHeading } from '@/components/public/section-heading';
import { VideoGrid } from '@/components/public/video-grid';
import { Button } from '@/components/ui/button';
import { fadeUp, motionViewport, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/utils';
import type { FeaturedArticle, SchoolProfilePayload } from '@/types';

type ExtracurricularPageProps = {
    school: SchoolProfilePayload;
    featuredArticles: FeaturedArticle[];
};

const extracurricularCategories = [
    'Semua',
    'Kepemimpinan',
    'Olahraga',
    'Karakter',
    'Pengabdian',
    'Media',
    'Seni',
] as const;

const sectionMenu = [
    { id: 'unggulan', label: 'Unit Unggulan' },
    { id: 'jalur', label: 'Jalur Pembinaan' },
    { id: 'video', label: 'Video Showcase' },
    { id: 'publikasi', label: 'Publikasi' },
] as const;

const extracurricularPrograms = [
    {
        name: 'Paskibra',
        category: 'Kepemimpinan',
        image: '/images/eskul/paskibra.png',
        accent: '#DC2626',
        icon: ShieldCheck,
        summary:
            'Korps disiplin dan kepemimpinan yang menyiapkan siswa tampil presisi di upacara, event besar, dan kompetisi baris-berbaris.',
        cadence: 'Latihan rutin 2-3 kali per minggu',
        metric: 'Disiplin',
        metricSub: 'Tingkat tinggi',
        focus: ['Baris-berbaris', 'Komando', 'Kepemimpinan'],
        highlights: ['Upacara', 'Latihan formasi', 'Mental juang'],
    },
    {
        name: 'Futsal',
        category: 'Olahraga',
        image: '/images/eskul/futsal.png',
        accent: '#16A34A',
        icon: Trophy,
        summary:
            'Ruang pembinaan fisik, strategi permainan, dan kekompakan tim bagi siswa yang aktif di kompetisi olahraga sekolah.',
        cadence: 'Sparring dan latihan pekanan',
        metric: 'Tim',
        metricSub: 'Kompetitif',
        focus: ['Teknik dasar', 'Game sense', 'Kerja tim'],
        highlights: ['Friendly match', 'Seleksi tim', 'Turnamen sekolah'],
    },
    {
        name: 'Rohis',
        category: 'Karakter',
        image: '/images/eskul/rohis.png',
        accent: '#0F766E',
        icon: Heart,
        summary:
            'Pembinaan akhlak, kepemimpinan spiritual, dan program keagamaan yang menjaga ritme karakter siswa tetap kuat.',
        cadence: 'Kajian, mentoring, dan agenda sosial',
        metric: 'Karakter',
        metricSub: 'Konsisten',
        focus: ['Pembinaan', 'Kajian', 'Kepedulian'],
        highlights: ['Mentoring', 'Peringatan hari besar', 'Program sosial'],
    },
    {
        name: 'PMR',
        category: 'Pengabdian',
        image: '/images/eskul/pmr.png',
        accent: '#E11D48',
        icon: Activity,
        summary:
            'Unit kesiapsiagaan siswa yang berfokus pada pertolongan pertama, kesehatan remaja, dan respon cepat saat kegiatan sekolah.',
        cadence: 'Simulasi, pelatihan, dan siaga acara',
        metric: 'Siaga',
        metricSub: 'P3K',
        focus: ['Kesehatan', 'Pertolongan pertama', 'Empati'],
        highlights: ['P3K acara', 'Simulasi tanggap', 'Edukasi kesehatan'],
    },
    {
        name: 'Pramuka',
        category: 'Kepemimpinan',
        image: '/images/eskul/pramuka.png',
        accent: '#A16207',
        icon: Compass,
        summary:
            'Wadah pembentukan siswa yang mandiri, tangguh, dan mampu bekerja dalam tim.',
        cadence: 'Latihan ambalan dan agenda lapangan',
        metric: 'Ambalan',
        metricSub: 'Aktif',
        focus: ['Kemandirian', 'Tim', 'Ketahanan'],
        highlights: ['Perkemahan', 'Navigasi', 'Project teamwork'],
    },
    {
        name: 'Pencak Silat',
        category: 'Olahraga',
        image: '/images/eskul/silat.png',
        accent: '#7C3AED',
        icon: Sparkles,
        summary:
            'Latihan bela diri tradisional yang menggabungkan ketahanan fisik, fokus mental, dan estetika gerak.',
        cadence: 'Latihan teknik dan demonstrasi',
        metric: 'Teknik',
        metricSub: 'Presisi',
        focus: ['Bela diri', 'Fokus', 'Kontrol tubuh'],
        highlights: ['Demo budaya', 'Latihan teknik', 'Kesiapan tanding'],
    },
    {
        name: 'Jurnalistik',
        category: 'Media',
        image: '/images/sekolah/kegiatan_siswa.jpg',
        accent: '#0284C7',
        icon: Megaphone,
        summary:
            'Tim liputan yang mengolah berita, dokumentasi visual, dan publikasi kegiatan sekolah untuk kanal digital resmi.',
        cadence: 'Liputan event dan produksi konten',
        metric: 'Konten',
        metricSub: 'Aktif',
        focus: ['Menulis', 'Foto video', 'Redaksi'],
        highlights: ['Berita sekolah', 'Liputan event', 'Konten sosial media'],
    },
    {
        name: 'Tari Tradisional',
        category: 'Seni',
        image: '/images/eskul/collage.png',
        accent: '#F59E0B',
        icon: Sparkles,
        summary:
            'Wadah seni untuk mengasah ekspresi, koreografi, dan keberanian tampil.',
        cadence: 'Latihan koreografi dan penampilan',
        metric: 'Seni',
        metricSub: 'Budaya',
        focus: ['Ekspresi', 'Gerak', 'Kepercayaan diri'],
        highlights: ['Pentas seni', 'Tamu sekolah', 'Hari besar budaya'],
    },
] as const;

const developmentLanes = [
    {
        title: 'Kepemimpinan & Disiplin',
        description:
            'Jalur untuk siswa yang ingin tumbuh dalam tanggung jawab, komando, kerja tim, dan ketahanan mental.',
        items: ['Paskibra', 'Pramuka'],
        outcome: 'Tampil siap memimpin kegiatan sekolah.',
    },
    {
        title: 'Olahraga & Daya Juang',
        description:
            'Pembinaan fisik dan mental kompetitif agar siswa terbiasa berlatih, disiplin, dan menjaga performa.',
        items: ['Futsal', 'Pencak Silat'],
        outcome: 'Siap bertanding sekaligus menjaga sportivitas.',
    },
    {
        title: 'Karakter & Pengabdian',
        description:
            'Penguatan empati, kepedulian sosial, dan kebiasaan positif yang berdampak ke kultur sekolah.',
        items: ['Rohis', 'PMR'],
        outcome: 'Terbiasa hadir dan berguna untuk lingkungan sekitar.',
    },
    {
        title: 'Media & Seni',
        description:
            'Jalur publikasi dan ekspresi untuk karya, liputan, dan penampilan siswa.',
        items: ['Jurnalistik', 'Tari Tradisional'],
        outcome: 'Membentuk portofolio publik yang siap ditampilkan.',
    },
] as const;

const extracurricularWorkflow = [
    {
        step: '01',
        title: 'Pilih Jalur',
        description:
            'Siswa masuk ke unit yang paling sesuai dengan minat, energi, dan target pengembangan diri.',
    },
    {
        step: '02',
        title: 'Masuk Latihan',
        description:
            'Ritme pembinaan dibangun lewat latihan rutin, disiplin kehadiran, dan evaluasi progres.',
    },
    {
        step: '03',
        title: 'Tampil & Bertugas',
        description:
            'Setiap unit diarahkan untuk punya momen tampil, bertugas, atau berkontribusi di event nyata.',
    },
    {
        step: '04',
        title: 'Masuk Portofolio',
        description:
            'Dokumentasi video, publikasi berita, dan capaian kegiatan dicatat di kanal sekolah.',
    },
] as const;

export default function ExtracurricularPage({
    school,
    featuredArticles,
}: ExtracurricularPageProps) {
    const heroRef = useRef<HTMLDivElement>(null);
    const [activeCategory, setActiveCategory] =
        useState<(typeof extracurricularCategories)[number]>('Semua');
    const deferredCategory = useDeferredValue(activeCategory);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 140]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

    const filteredPrograms =
        deferredCategory === 'Semua'
            ? extracurricularPrograms
            : extracurricularPrograms.filter(
                  (program) => program.category === deferredCategory,
              );

    const articleShowcase = featuredArticles.slice(0, 4);

    return (
        <>
            <Head title="Ekstrakurikuler">
                <meta
                    name="description"
                    content={`Ekstrakurikuler ${school.name}: unit kegiatan, jalur pembinaan, video, dan publikasi aktivitas siswa.`}
                />
            </Head>

            <div className="space-y-16 pb-20 lg:space-y-24">
                <motion.section
                    ref={heroRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative right-1/2 left-1/2 -mt-8 -mr-[50vw] -ml-[50vw] h-[78vh] w-screen overflow-hidden bg-slate-950 md:-mt-10 lg:h-[88dvh]"
                >
                    <motion.div
                        className="absolute inset-0 z-0"
                        style={{ y: heroY }}
                    >
                        <div className="absolute inset-0">
                            <img
                                src="/images/eskul/collage.png"
                                alt="Ekstrakurikuler SMAN 1 Tenjo"
                                className="h-full w-full object-cover object-center opacity-35 mix-blend-luminosity"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/78 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/55 to-transparent" />
                        </div>
                        <div className="absolute top-1/4 -left-24 size-[26rem] rounded-full bg-emerald-500/10 blur-[120px]" />
                        <div className="absolute right-0 bottom-1/4 size-[30rem] rounded-full bg-sky-500/10 blur-[130px]" />
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04] mix-blend-overlay" />
                    </motion.div>

                    <motion.div
                        className="absolute inset-0 z-10 flex flex-col justify-center px-6 md:px-12 xl:px-24"
                        style={{ opacity: heroOpacity }}
                    >
                        <div className="mx-auto w-full max-w-7xl pt-24">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.92 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.45, delay: 0.2 }}
                                className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 backdrop-blur-md"
                            >
                                <BadgeCheck className="size-4 text-emerald-300" />
                                <span className="text-[0.68rem] font-bold tracking-[0.25em] text-emerald-200 uppercase">
                                    Ekstrakurikuler {school.name}
                                </span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 28 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="max-w-5xl font-heading text-5xl leading-[1.05] text-white md:text-7xl lg:text-[5.6rem]"
                            >
                                Minat, Latihan, dan{' '}
                                <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
                                    Prestasi Siswa.
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 28 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg lg:text-xl"
                            >
                                Informasi unit ekstrakurikuler, jalur pembinaan,
                                video kegiatan, dan publikasi siswa.
                            </motion.p>
                        </div>
                    </motion.div>
                </motion.section>

                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6">
                    <div className="flex flex-wrap gap-3">
                        {sectionMenu.map((item) => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                className="rounded-full border border-white/70 bg-white/88 px-5 py-2.5 text-sm font-semibold text-[var(--school-ink)] shadow-[0_18px_45px_-32px_rgba(15,118,110,0.45)] transition hover:-translate-y-0.5 hover:border-[var(--school-green-200)] hover:text-[var(--school-green-700)]"
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {[
                            {
                                label: 'Ekskul Aktif',
                                value: '18',
                                detail: 'Jalur pengembangan siswa',
                                icon: Users,
                                accent: 'text-sky-600',
                            },
                            {
                                label: 'Unit Unggulan',
                                value: '8',
                                detail: 'Diorientasikan untuk tampil',
                                icon: BadgeCheck,
                                accent: 'text-emerald-600',
                            },
                            {
                                label: 'Jalur Pembinaan',
                                value: '4',
                                detail: 'Disiplin, olahraga, media, karakter',
                                icon: Compass,
                                accent: 'text-amber-600',
                            },
                            {
                                label: 'Publikasi Kegiatan',
                                value: `${featuredArticles.length}+`,
                                detail: 'Siap ditautkan ke berita sekolah',
                                icon: Megaphone,
                                accent: 'text-violet-600',
                            },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="rounded-[1.8rem] border border-white/70 bg-white/88 p-5 shadow-[0_24px_70px_-44px_rgba(15,118,110,0.2)] backdrop-blur-xl"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="text-[0.68rem] font-bold tracking-[0.22em] text-[var(--school-muted)] uppercase">
                                            {item.label}
                                        </div>
                                        <div className="mt-3 text-4xl font-extrabold tracking-tight text-[var(--school-ink)]">
                                            {item.value}
                                        </div>
                                        <p className="mt-2 text-sm leading-6 text-[var(--school-muted)]">
                                            {item.detail}
                                        </p>
                                    </div>
                                    <div
                                        className={cn(
                                            'flex size-12 items-center justify-center rounded-2xl bg-slate-50',
                                            item.accent,
                                        )}
                                    >
                                        <item.icon className="size-5" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div
                    id="unggulan"
                    className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6"
                >
                    <SectionHeading
                        eyebrow="Katalog Unggulan"
                        title="Unit ekstrakurikuler aktif."
                        description="Pilih kategori untuk melihat fokus latihan, ritme pembinaan, dan kegiatan tiap unit."
                    />

                    <div className="flex flex-wrap gap-2 rounded-[1.8rem] border border-white/70 bg-white/80 p-2 shadow-[0_18px_45px_-34px_rgba(15,118,110,0.35)] backdrop-blur-xl">
                        {extracurricularCategories.map((category) => {
                            const isActive = category === activeCategory;

                            return (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => {
                                        startTransition(() =>
                                            setActiveCategory(category),
                                        );
                                    }}
                                    className={cn(
                                        'rounded-full px-4 py-2.5 text-sm font-semibold transition',
                                        isActive
                                            ? 'bg-[var(--school-green-700)] text-white shadow-md'
                                            : 'text-[var(--school-muted)] hover:bg-white hover:text-[var(--school-ink)]',
                                    )}
                                >
                                    {category}
                                </button>
                            );
                        })}
                    </div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={motionViewport}
                        className="grid gap-6 lg:grid-cols-2"
                    >
                        {filteredPrograms.map((program) => (
                            <motion.article
                                key={program.name}
                                variants={fadeUp}
                                className="group h-full"
                            >
                                <BorderGlow
                                    borderRadius={34}
                                    colors={[
                                        program.accent,
                                        '#0E9EE4',
                                        '#FFFFFF',
                                    ]}
                                    className="relative h-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/88 shadow-[0_28px_75px_-48px_rgba(15,118,110,0.42)] backdrop-blur-xl"
                                >
                                    <div className="grid gap-0 md:grid-cols-[0.92fr_1.08fr]">
                                        <div className="relative min-h-[18rem] overflow-hidden">
                                            <img
                                                src={program.image}
                                                alt={program.name}
                                                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                            />
                                            <div
                                                className="absolute inset-0 opacity-55 mix-blend-multiply"
                                                style={{
                                                    backgroundColor:
                                                        program.accent,
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
                                            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                                                <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[0.65rem] font-bold tracking-[0.2em] uppercase backdrop-blur">
                                                    {program.category}
                                                </div>
                                                <div className="mt-4 flex items-center gap-3">
                                                    <div className="flex size-12 items-center justify-center rounded-2xl bg-white/15 shadow-[0_20px_50px_-36px_rgba(255,255,255,0.95)] backdrop-blur">
                                                        <program.icon className="size-5" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-heading text-3xl leading-tight">
                                                            {program.name}
                                                        </h3>
                                                        <p className="mt-1 text-sm text-white/80">
                                                            {program.metric} •{' '}
                                                            {program.metricSub}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-5 p-6 md:p-7">
                                            <p className="text-sm leading-7 text-[var(--school-muted)]">
                                                {program.summary}
                                            </p>

                                            <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50/80 p-4">
                                                <div className="flex items-center gap-2 text-[0.68rem] font-bold tracking-[0.22em] text-[var(--school-green-700)] uppercase">
                                                    <CalendarDays className="size-4" />
                                                    Ritme Pembinaan
                                                </div>
                                                <p className="mt-2 text-sm leading-6 text-[var(--school-ink)]">
                                                    {program.cadence}
                                                </p>
                                            </div>

                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div>
                                                    <div className="text-[0.68rem] font-bold tracking-[0.22em] text-slate-400 uppercase">
                                                        Fokus
                                                    </div>
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {program.focus.map(
                                                            (item) => (
                                                                <span
                                                                    key={item}
                                                                    className="rounded-full border px-3 py-1 text-xs font-semibold"
                                                                    style={{
                                                                        borderColor: `${program.accent}28`,
                                                                        backgroundColor: `${program.accent}10`,
                                                                        color: program.accent,
                                                                    }}
                                                                >
                                                                    {item}
                                                                </span>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="text-[0.68rem] font-bold tracking-[0.22em] text-slate-400 uppercase">
                                                        Bentuk Tampil
                                                    </div>
                                                    <div className="mt-3 space-y-2">
                                                        {program.highlights.map(
                                                            (item) => (
                                                                <div
                                                                    key={item}
                                                                    className="flex items-center gap-2 text-sm text-[var(--school-ink)]"
                                                                >
                                                                    <div
                                                                        className="size-2 rounded-full"
                                                                        style={{
                                                                            backgroundColor:
                                                                                program.accent,
                                                                        }}
                                                                    />
                                                                    {item}
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </BorderGlow>
                            </motion.article>
                        ))}
                    </motion.div>
                </div>

                <div
                    id="jalur"
                    className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6"
                >
                    <SectionHeading
                        eyebrow="Jalur Pembinaan"
                        title="Jalur pembinaan ekstrakurikuler."
                        description="Setiap unit dikelompokkan agar siswa memahami arah latihan dan pengembangan diri."
                    />

                    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                        <div className="grid gap-5 md:grid-cols-2">
                            {developmentLanes.map((lane) => (
                                <div
                                    key={lane.title}
                                    className="rounded-[1.9rem] border border-white/70 bg-white/88 p-6 shadow-[0_24px_70px_-44px_rgba(15,118,110,0.2)] backdrop-blur-xl"
                                >
                                    <div className="text-[0.68rem] font-bold tracking-[0.22em] text-[var(--school-green-700)] uppercase">
                                        Jalur
                                    </div>
                                    <h3 className="mt-3 font-heading text-2xl text-[var(--school-ink)]">
                                        {lane.title}
                                    </h3>
                                    <p className="mt-3 text-sm leading-7 text-[var(--school-muted)]">
                                        {lane.description}
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {lane.items.map((item) => (
                                            <span
                                                key={item}
                                                className="rounded-full border border-[var(--school-green-200)] bg-[var(--school-green-50)] px-3 py-1 text-xs font-semibold text-[var(--school-green-700)]"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="mt-5 rounded-[1.3rem] border border-slate-200 bg-slate-50/70 p-4 text-sm font-semibold text-[var(--school-ink)]">
                                        Output: {lane.outcome}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <BorderGlow
                            borderRadius={34}
                            colors={['#0E9EE4', '#10B981', '#F59E0B']}
                            className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/88 shadow-[0_28px_75px_-50px_rgba(15,118,110,0.28)]"
                        >
                            <div className="space-y-5 p-6 md:p-7">
                                <div>
                                    <div className="text-[0.68rem] font-bold tracking-[0.22em] text-[var(--school-green-700)] uppercase">
                                        Workflow Kegiatan
                                    </div>
                                    <h3 className="mt-3 font-heading text-3xl text-[var(--school-ink)]">
                                        Dari minat ke kegiatan terarah.
                                    </h3>
                                    <p className="mt-3 text-sm leading-7 text-[var(--school-muted)]">
                                        Siswa memilih unit, mengikuti latihan,
                                        bertugas dalam kegiatan, lalu
                                        dokumentasinya dicatat oleh sekolah.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {extracurricularWorkflow.map((item) => (
                                        <div
                                            key={item.step}
                                            className="rounded-[1.4rem] border border-slate-200 bg-slate-50/80 p-4"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--school-green-700)] text-sm font-extrabold text-white">
                                                    {item.step}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-[var(--school-ink)]">
                                                        {item.title}
                                                    </div>
                                                    <p className="mt-1 text-sm leading-6 text-[var(--school-muted)]">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </BorderGlow>
                    </div>
                </div>

                <div
                    id="video"
                    className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6"
                >
                    <SectionHeading
                        eyebrow="Video Showcase"
                        title="Galeri video kegiatan ekstrakurikuler."
                        description="Video dapat difilter agar pengunjung cepat menemukan kegiatan yang relevan."
                    />
                    <VideoGrid />
                </div>

                <div
                    id="publikasi"
                    className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6"
                >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <SectionHeading
                            eyebrow="Publikasi Kegiatan"
                            title="Berita dan dokumentasi kegiatan ekskul."
                            description="Publikasi kegiatan akan diperbarui melalui kanal berita sekolah."
                        />

                        <Button
                            asChild
                            className="rounded-full bg-[var(--school-green-700)] px-6 text-white hover:bg-[var(--school-green-600)]"
                        >
                            <Link href={beritaIndex()}>
                                Lihat Semua Berita
                                <ArrowRight className="ml-2 size-4" />
                            </Link>
                        </Button>
                    </div>

                    {articleShowcase.length > 0 ? (
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="show"
                            viewport={motionViewport}
                            className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4"
                        >
                            {articleShowcase.map((article) => (
                                <motion.article
                                    key={article.id}
                                    variants={fadeUp}
                                    whileHover={{ y: -6 }}
                                    className="group overflow-hidden rounded-[2rem] border border-white/70 bg-white/88 shadow-[0_24px_70px_-44px_rgba(15,118,110,0.24)] backdrop-blur-xl"
                                >
                                    <div className="relative h-56 overflow-hidden bg-slate-100">
                                        {article.imageUrl ? (
                                            <img
                                                src={article.imageUrl}
                                                alt={article.title}
                                                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-[var(--school-green-700)]" />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                                        <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[0.65rem] font-bold tracking-[0.18em] text-white uppercase backdrop-blur">
                                            {article.category ?? 'Kegiatan'}
                                        </div>
                                        <div className="absolute right-4 bottom-4 flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur">
                                            <PlayCircle className="size-5" />
                                        </div>
                                    </div>

                                    <div className="space-y-4 p-6">
                                        <div className="flex items-center gap-2 text-[0.68rem] font-bold tracking-[0.18em] text-slate-400 uppercase">
                                            <CalendarDays className="size-4" />
                                            {article.publishedAt
                                                ? new Intl.DateTimeFormat(
                                                      'id-ID',
                                                      {
                                                          dateStyle: 'medium',
                                                      },
                                                  ).format(
                                                      new Date(
                                                          article.publishedAt,
                                                      ),
                                                  )
                                                : 'Publikasi sekolah'}
                                        </div>

                                        <h3 className="font-heading text-2xl leading-tight text-[var(--school-ink)]">
                                            {article.title}
                                        </h3>

                                        <p className="text-sm leading-7 text-[var(--school-muted)]">
                                            {article.excerpt ??
                                                'Dokumentasi kegiatan siswa siap diperbarui melalui publikasi sekolah.'}
                                        </p>

                                        <Link
                                            href={
                                                article.slug
                                                    ? beritaShow({
                                                          slug: article.slug,
                                                      })
                                                    : beritaIndex()
                                            }
                                            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--school-green-700)] transition hover:text-[var(--school-green-600)]"
                                        >
                                            Buka Publikasi
                                            <ArrowRight className="size-4" />
                                        </Link>
                                    </div>
                                </motion.article>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="rounded-[2rem] border border-dashed border-[var(--school-green-200)] bg-white/80 p-8 text-sm leading-7 text-[var(--school-muted)]">
                            Publikasi ekskul belum masuk ke feed berita.
                            Dokumentasi kegiatan berikutnya akan muncul setelah
                            diterbitkan.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
