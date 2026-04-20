import { Head, Link } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    ArrowRight,
    BadgeCheck,
    CalendarDays,
    Compass,
    Megaphone,
    Search,
    Sparkles,
    Users,
} from 'lucide-react';
import {
    startTransition,
    useDeferredValue,
    useMemo,
    useRef,
    useState,
} from 'react';
import { extracurricularShow } from '@/actions/App/Http/Controllers/PublicSiteController';
import DomeGallery from '@/components/DomeGallery';
import { BorderGlow } from '@/components/public/border-glow';
import { SectionHeading } from '@/components/public/section-heading';
import { Button } from '@/components/ui/button';
import {
    extracurricularCategories,
    extracurricularPrograms,
} from '@/lib/extracurricular-content';
import { fadeUp, motionViewport, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/utils';
import type { SchoolProfilePayload } from '@/types';

type ExtracurricularPageProps = {
    school: SchoolProfilePayload;
};

const sectionMenu = [
    { id: 'unggulan', label: 'Unit Unggulan' },
    { id: 'jalur', label: 'Jalur Pembinaan' },
    { id: 'galeri', label: 'Galeri Eskul' },
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
        title: 'Pilih Unit',
        description:
            'Siswa membuka unit yang paling nyambung dengan ritme, minat, dan target pengembangan dirinya.',
    },
    {
        step: '02',
        title: 'Masuk Latihan',
        description:
            'Latihan dibentuk teratur agar siswa cepat membaca fokus dan ekspektasi unit.',
    },
    {
        step: '03',
        title: 'Tampil Nyata',
        description:
            'Setiap unit diarahkan punya momen tampil, bertugas, bertanding, atau berkarya.',
    },
    {
        step: '04',
        title: 'Masuk Portofolio',
        description:
            'Dokumentasi kegiatan mengalir ke kanal sekolah agar jejak unit tetap terlihat.',
    },
] as const;

export default function ExtracurricularPage({
    school,
}: ExtracurricularPageProps) {
    const heroRef = useRef<HTMLDivElement>(null);
    const [activeCategory, setActiveCategory] =
        useState<(typeof extracurricularCategories)[number]>('Semua');
    const [searchQuery, setSearchQuery] = useState('');
    const [spotlightSlug, setSpotlightSlug] = useState<string | null>(
        extracurricularPrograms[0]?.slug ?? null,
    );
    const deferredCategory = useDeferredValue(activeCategory);
    const deferredSearch = useDeferredValue(searchQuery);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 140]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

    const filteredPrograms = useMemo(() => {
        const normalizedSearch = deferredSearch.trim().toLowerCase();

        return extracurricularPrograms.filter((program) => {
            const matchesCategory =
                deferredCategory === 'Semua' ||
                program.category === deferredCategory;
            const matchesSearch =
                normalizedSearch.length === 0 ||
                program.name.toLowerCase().includes(normalizedSearch) ||
                program.focus.some((item) =>
                    item.toLowerCase().includes(normalizedSearch),
                ) ||
                program.highlights.some((item) =>
                    item.toLowerCase().includes(normalizedSearch),
                );

            return matchesCategory && matchesSearch;
        });
    }, [deferredCategory, deferredSearch]);

    const activeSpotlightSlug =
        spotlightSlug &&
        filteredPrograms.some((program) => program.slug === spotlightSlug)
            ? spotlightSlug
            : (filteredPrograms[0]?.slug ?? null);

    const spotlightProgram =
        filteredPrograms.find(
            (program) => program.slug === activeSpotlightSlug,
        ) ??
        filteredPrograms[0] ??
        extracurricularPrograms[0];

    const extracurricularGalleryImages = useMemo(
        () =>
            extracurricularPrograms
                .filter(
                    (program) =>
                        program.image.startsWith('/images/eskul/') &&
                        program.image !== '/images/eskul/collage.png',
                )
                .map((program) => ({
                    src: program.image,
                    alt: `${program.name} ${school.name}`,
                })),
        [school.name],
    );

    return (
        <>
            <Head title="Ekstrakurikuler">
                <meta
                    name="description"
                    content={`Ekstrakurikuler ${school.name}: unit kegiatan, jalur pembinaan, video, dan publikasi aktivitas siswa.`}
                />
            </Head>

            <div className="space-y-10 pb-16 lg:space-y-14">
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
                                    Arah Unit.
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 28 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg lg:text-xl"
                            >
                                Buka unit yang paling cocok, baca ritmenya, lalu
                                masuk ke halaman detail tanpa harus
                                menebak-nebak arah latihannya.
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
                                label: 'Ekskul Tersusun',
                                value: `${extracurricularPrograms.length}`,
                                detail: 'Unit sudah dibagi per jalur pembinaan',
                                icon: Users,
                                accent: 'text-sky-600',
                            },
                            {
                                label: 'Halaman Detail',
                                value: `${extracurricularPrograms.length}`,
                                detail: 'Setiap unit bisa dibuka secara khusus',
                                icon: Sparkles,
                                accent: 'text-emerald-600',
                            },
                            {
                                label: 'Jalur Pembinaan',
                                value: `${developmentLanes.length}`,
                                detail: 'Mudah dibaca dari disiplin sampai seni',
                                icon: Compass,
                                accent: 'text-amber-600',
                            },
                            {
                                label: 'Dokumentasi Aktif',
                                value: `${extracurricularGalleryImages.length}`,
                                detail: 'Frame visual dari unit yang aktif di halaman ini',
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
                        eyebrow="Katalog Interaktif"
                        title="Ekskul siap dibuka per unit."
                        description="Filter, cari, lalu buka halaman setiap unit untuk membaca ritme, fokus, dan bentuk tampilnya."
                    />

                    <div className="space-y-4 rounded-[2rem] border border-white/70 bg-white/82 p-4 shadow-[0_18px_45px_-34px_rgba(15,118,110,0.35)] backdrop-blur-xl">
                        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                            <div className="flex flex-wrap gap-2">
                                {extracurricularCategories.map((category) => {
                                    const isActive =
                                        category === activeCategory;

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

                            <label className="relative block w-full max-w-sm">
                                <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(event) =>
                                        setSearchQuery(event.target.value)
                                    }
                                    placeholder="Cari unit, fokus, atau bentuk tampil"
                                    className="h-12 w-full rounded-full border border-slate-200 bg-slate-50 pr-4 pl-11 text-sm text-[var(--school-ink)] transition outline-none placeholder:text-slate-400 focus:border-[var(--school-green-200)] focus:bg-white"
                                />
                            </label>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-1">
                            <div className="text-sm text-[var(--school-muted)]">
                                Menampilkan{' '}
                                <span className="font-semibold text-[var(--school-ink)]">
                                    {filteredPrograms.length}
                                </span>{' '}
                                unit.
                            </div>
                            <div className="text-sm text-[var(--school-muted)]">
                                Hover kartu untuk mengganti spotlight.
                            </div>
                        </div>
                    </div>

                    {filteredPrograms.length > 0 && spotlightProgram ? (
                        <BorderGlow
                            borderRadius={36}
                            colors={[
                                spotlightProgram.accent,
                                '#0E9EE4',
                                '#10B981',
                            ]}
                            className="overflow-hidden rounded-[2.2rem] border border-white/70 bg-white/88 shadow-[0_28px_75px_-48px_rgba(15,118,110,0.35)] backdrop-blur-xl"
                        >
                            <div className="grid gap-0 xl:grid-cols-[1.02fr_0.98fr]">
                                <div className="relative min-h-[22rem] overflow-hidden">
                                    <img
                                        src={spotlightProgram.image}
                                        alt={spotlightProgram.name}
                                        className="absolute inset-0 h-full w-full object-cover"
                                        style={{
                                            objectPosition:
                                                spotlightProgram.objectPosition ??
                                                'center',
                                        }}
                                    />
                                    <div
                                        className="absolute inset-0 opacity-52 mix-blend-multiply"
                                        style={{
                                            backgroundColor:
                                                spotlightProgram.accent,
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/22 to-transparent" />
                                    <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
                                        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[0.65rem] font-bold tracking-[0.2em] uppercase backdrop-blur">
                                            Spotlight Unit
                                        </div>
                                        <div className="mt-5 flex items-center gap-4">
                                            <div className="flex size-14 items-center justify-center rounded-[1.35rem] bg-white/14 shadow-[0_20px_45px_-28px_rgba(255,255,255,0.65)] backdrop-blur">
                                                <spotlightProgram.icon className="size-6" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold tracking-[0.18em] text-white/70 uppercase">
                                                    {spotlightProgram.category}
                                                </div>
                                                <h3 className="mt-1 font-heading text-4xl leading-tight">
                                                    {spotlightProgram.name}
                                                </h3>
                                            </div>
                                        </div>
                                        <p className="mt-5 max-w-xl text-sm leading-7 text-white/82">
                                            {spotlightProgram.headline}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6 p-6 md:p-8">
                                    <div>
                                        <div className="text-[0.68rem] font-bold tracking-[0.22em] text-[var(--school-green-700)] uppercase">
                                            Snapshot Unit
                                        </div>
                                        <p className="mt-3 text-sm leading-7 text-[var(--school-muted)]">
                                            {spotlightProgram.summary}
                                        </p>
                                    </div>

                                    <div className="grid gap-3 md:grid-cols-3">
                                        {spotlightProgram.stats.map((item) => (
                                            <div
                                                key={item.label}
                                                className="rounded-[1.35rem] border border-slate-200 bg-slate-50/80 p-4"
                                            >
                                                <div className="text-[0.66rem] font-bold tracking-[0.2em] text-slate-400 uppercase">
                                                    {item.label}
                                                </div>
                                                <div className="mt-2 text-sm font-semibold text-[var(--school-ink)]">
                                                    {item.value}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-[0.92fr_1.08fr]">
                                        <div>
                                            <div className="text-[0.68rem] font-bold tracking-[0.22em] text-slate-400 uppercase">
                                                Fokus Utama
                                            </div>
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {spotlightProgram.focus.map(
                                                    (item) => (
                                                        <span
                                                            key={item}
                                                            className="rounded-full border px-3 py-1 text-xs font-semibold"
                                                            style={{
                                                                borderColor: `${spotlightProgram.accent}24`,
                                                                backgroundColor: `${spotlightProgram.accent}10`,
                                                                color: spotlightProgram.accent,
                                                            }}
                                                        >
                                                            {item}
                                                        </span>
                                                    ),
                                                )}
                                            </div>
                                        </div>

                                        <div className="rounded-[1.45rem] border border-slate-200 bg-slate-50/80 p-4">
                                            <div className="flex items-center gap-2 text-[0.68rem] font-bold tracking-[0.22em] text-[var(--school-green-700)] uppercase">
                                                <CalendarDays className="size-4" />
                                                Ritme Pembinaan
                                            </div>
                                            <div className="mt-2 text-sm leading-6 text-[var(--school-ink)]">
                                                {spotlightProgram.cadence}
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        asChild
                                        className="rounded-full bg-[var(--school-green-700)] px-6 text-white hover:bg-[var(--school-green-600)]"
                                    >
                                        <Link
                                            href={extracurricularShow({
                                                slug: spotlightProgram.slug,
                                            })}
                                        >
                                            Buka halaman {spotlightProgram.name}
                                            <ArrowRight className="ml-2 size-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </BorderGlow>
                    ) : (
                        <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white/78 p-8 text-center shadow-[0_18px_45px_-34px_rgba(15,118,110,0.18)] backdrop-blur-xl">
                            <div className="text-lg font-semibold text-[var(--school-ink)]">
                                Belum ada unit yang cocok dengan filter ini.
                            </div>
                            <p className="mt-2 text-sm leading-7 text-[var(--school-muted)]">
                                Coba ganti kategori atau kata kunci supaya unit
                                yang relevan muncul lagi.
                            </p>
                        </div>
                    )}

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={motionViewport}
                        className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
                    >
                        {filteredPrograms.map((program) => (
                            <motion.article
                                key={program.slug}
                                variants={fadeUp}
                                whileHover={{ y: -6 }}
                                className="group"
                            >
                                <Link
                                    href={extracurricularShow({
                                        slug: program.slug,
                                    })}
                                    className="block h-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/88 shadow-[0_24px_70px_-44px_rgba(15,118,110,0.24)] backdrop-blur-xl transition"
                                    onMouseEnter={() =>
                                        setSpotlightSlug(program.slug)
                                    }
                                    onFocus={() =>
                                        setSpotlightSlug(program.slug)
                                    }
                                >
                                    <div className="relative h-68 overflow-hidden">
                                        <img
                                            src={program.image}
                                            alt={program.name}
                                            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                            style={{
                                                objectPosition:
                                                    program.objectPosition ??
                                                    'center',
                                            }}
                                        />
                                        <div
                                            className="absolute inset-0 opacity-52 mix-blend-multiply"
                                            style={{
                                                backgroundColor: program.accent,
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                                        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                                            <div className="inline-flex items-center gap-2 rounded-full border border-white/22 bg-white/10 px-3 py-1 text-[0.64rem] font-bold tracking-[0.18em] uppercase backdrop-blur">
                                                {program.category}
                                            </div>
                                            <div className="mt-4 flex items-center gap-3">
                                                <div className="flex size-11 items-center justify-center rounded-2xl bg-white/12 backdrop-blur">
                                                    <program.icon className="size-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-heading text-3xl leading-tight">
                                                        {program.name}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-white/78">
                                                        {program.metric} •{' '}
                                                        {program.metricSub}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 p-5">
                                        <p className="text-sm leading-7 text-[var(--school-muted)]">
                                            {program.headline}
                                        </p>

                                        <div className="flex flex-wrap gap-2">
                                            {program.focus
                                                .slice(0, 3)
                                                .map((item) => (
                                                    <span
                                                        key={item}
                                                        className="rounded-full border px-3 py-1 text-xs font-semibold"
                                                        style={{
                                                            borderColor: `${program.accent}24`,
                                                            backgroundColor: `${program.accent}10`,
                                                            color: program.accent,
                                                        }}
                                                    >
                                                        {item}
                                                    </span>
                                                ))}
                                        </div>

                                        <div className="flex items-center justify-between gap-4 rounded-[1.35rem] border border-slate-200 bg-slate-50/80 px-4 py-3">
                                            <div>
                                                <div className="text-[0.66rem] font-bold tracking-[0.2em] text-slate-400 uppercase">
                                                    Ritme
                                                </div>
                                                <div className="mt-1 text-sm font-semibold text-[var(--school-ink)]">
                                                    {program.cadence}
                                                </div>
                                            </div>
                                            <ArrowRight className="size-4 text-[var(--school-green-700)] transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </Link>
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
                        title="Arah unit dibuat lebih mudah dibaca."
                        description="Unit dikelompokkan agar siswa bisa cepat memahami jalur latihan yang paling pas."
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
                                        Pengunjung tinggal pilih unit, baca
                                        ritmenya, lalu buka detail yang paling
                                        relevan.
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

                <div id="galeri" className="space-y-8">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6">
                        <SectionHeading
                            eyebrow="Galeri Eskul"
                            title="Satu bentang visual untuk seluruh unit."
                            description="Geser galeri untuk membaca energi kegiatan siswa dari kepemimpinan, olahraga, karakter, sampai seni dalam satu lintasan penuh."
                        />
                    </div>

                    <div className="relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] w-screen overflow-hidden bg-transparent">
                        <div className="h-[22rem] w-full sm:h-[28rem] lg:h-[34rem] xl:h-[38rem]">
                            <DomeGallery
                                images={extracurricularGalleryImages}
                                fit={0.82}
                                fitBasis="width"
                                minRadius={760}
                                maxVerticalRotationDeg={0}
                                segments={34}
                                dragDampening={2}
                                padFactor={0.12}
                                overlayBlurColor="transparent"
                                openedImageWidth="min(78vw, 540px)"
                                openedImageHeight="min(78vw, 540px)"
                                imageBorderRadius="24px"
                                openedImageBorderRadius="30px"
                                grayscale
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
