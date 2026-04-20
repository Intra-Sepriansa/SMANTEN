import { Head, Link } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    ArrowRight,
    BadgeCheck,
    Camera,
    Clapperboard,
    ExternalLink,
    PlayCircle,
    Radio,
    Sparkles,
} from 'lucide-react';
import { useRef } from 'react';
import {
    extracurricular,
    virtualTour,
} from '@/actions/App/Http/Controllers/PublicSiteController';
import { BorderGlow } from '@/components/public/border-glow';
import CircularGallery from '@/components/public/circular-gallery';
import type { CircularGalleryItem } from '@/components/public/circular-gallery';
import { SectionHeading } from '@/components/public/section-heading';
import { Button } from '@/components/ui/button';
import { fadeUp, motionViewport, staggerContainer } from '@/lib/motion';
import { schoolSocials } from '@/lib/public-content';
import type { SchoolProfilePayload } from '@/types';

type MediaPageProps = {
    school: SchoolProfilePayload;
};

const sectionMenu = [
    { id: 'ringkasan-dokumentasi', label: 'Ringkasan' },
    { id: 'galeri-foto', label: 'Galeri Foto' },
    { id: 'video-sekolah', label: 'Video Sekolah' },
] as const;

const videoSignals = [
    {
        title: 'Video Resmi',
        description:
            'Kanal audiovisual untuk profil sekolah, dokumentasi event, dan tayangan unggulan.',
        metric: 'Video',
        value: 'Siap Tayang',
        icon: Clapperboard,
    },
    {
        title: 'Aktivitas Siswa',
        description:
            'Ekskul dan acara sekolah didokumentasikan sebagai bahan tayang.',
        metric: 'Liputan',
        value: 'Terjadwal',
        icon: PlayCircle,
    },
    {
        title: 'Kanal Pendukung',
        description:
            'Instagram dan kanal resmi sekolah menjaga dokumentasi tetap mudah diakses.',
        metric: 'Distribusi',
        value: 'Terhubung',
        icon: Radio,
    },
] as const;

const galleryPlaceholderItems: CircularGalleryItem[] = [
    {
        image: '/images/sekolah/guru_mengajar.jpg',
        text: 'Kelas Inspiratif',
    },
    {
        image: '/images/sekolah/murid_belajar.jpg',
        text: 'Belajar Kolaboratif',
    },
    {
        image: '/images/sekolah/kegiatan_siswa.jpg',
        text: 'Aktivitas Siswa',
    },
    {
        image: '/images/sekolah/fasilitas_lab.jpg',
        text: 'Laboratorium',
    },
    {
        image: '/images/akademik/hero.png',
        text: 'Ruang Akademik',
    },
    {
        image: '/images/akademik/p5.png',
        text: 'Aktivitas Kelas',
    },
    {
        image: '/images/profil/sarana.png',
        text: 'Sarana Belajar',
    },
    {
        image: '/images/eskul/collage.png',
        text: 'Kegiatan Sekolah',
    },
] as const;

const photoGalleryCards = galleryPlaceholderItems.slice(0, 3).map((item) => ({
    title: item.text,
    description: 'Dokumentasi visual kegiatan sekolah.',
    image: item.image,
}));

export default function MediaPage({ school }: MediaPageProps) {
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 140]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.82], [1, 0]);

    const videoChannels = [
        {
            title: 'YouTube Sekolah',
            eyebrow: 'Kanal Video',
            description:
                'Kanal video resmi untuk profil sekolah dan dokumentasi event.',
            href: schoolSocials.youtube.url,
            image: '/images/sekolah/guru_mengajar.jpg',
            icon: Clapperboard,
            external: true,
        },
        {
            title: 'Ekstrakurikuler',
            eyebrow: 'Video & Aktivitas',
            description:
                'Masuk ke halaman khusus ekskul untuk melihat unit unggulan dan ritme tampil siswa.',
            href: extracurricular(),
            image: '/images/eskul/collage.png',
            icon: PlayCircle,
            external: false,
        },
        {
            title: 'Virtual Tour',
            eyebrow: 'Tur Virtual',
            description:
                'Jelajahi area sekolah melalui tampilan panorama interaktif.',
            href: virtualTour(),
            image: '/images/profil/hero-banner.png',
            icon: Camera,
            external: false,
        },
    ] as const;

    const supportingMediaChannels = [
        {
            title: 'Instagram Sekolah',
            eyebrow: 'Media Sosial',
            description: 'Highlight visual cepat untuk momen harian sekolah.',
            href: schoolSocials.instagram.url,
            image: '/images/sekolah/murid_belajar.jpg',
            icon: ExternalLink,
            external: true,
        },
        {
            title: 'Virtual Tour',
            eyebrow: 'Tur Virtual',
            description:
                'Dokumentasi ruang sekolah dalam format jelajah interaktif.',
            href: virtualTour(),
            image: '/images/profil/hero-banner.png',
            icon: Sparkles,
            external: false,
        },
    ] as const;

    return (
        <>
            <Head title="Dokumentasi Sekolah">
                <meta
                    name="description"
                    content={`Dokumentasi ${school.name}: galeri foto dan video sekolah yang ringkas.`}
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
                                src="/images/sekolah/kegiatan_siswa.jpg"
                                alt="Dokumentasi sekolah SMAN 1 Tenjo"
                                className="h-full w-full object-cover object-center opacity-34 mix-blend-luminosity"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/84 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/56 to-transparent" />
                        </div>
                        <div className="absolute top-1/4 -left-24 size-[26rem] rounded-full bg-sky-500/12 blur-[120px]" />
                        <div className="absolute right-0 bottom-1/4 size-[28rem] rounded-full bg-emerald-500/12 blur-[130px]" />
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04] mix-blend-overlay" />
                    </motion.div>

                    <motion.div
                        className="absolute inset-0 z-10 flex flex-col justify-center px-6 md:px-12 xl:px-24"
                        style={{ opacity: heroOpacity }}
                    >
                        <div className="mx-auto w-full max-w-7xl pt-24">
                            <div className="mb-6 flex flex-wrap items-center gap-3">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.92 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.45, delay: 0.2 }}
                                    className="inline-flex items-center gap-2.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-5 py-2 backdrop-blur-md"
                                >
                                    <BadgeCheck className="size-4 text-sky-300" />
                                    <span className="text-[0.68rem] font-bold tracking-[0.25em] text-sky-100 uppercase">
                                        Dokumentasi {school.name}
                                    </span>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.92 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.45, delay: 0.28 }}
                                    className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 backdrop-blur-md"
                                >
                                    <Sparkles className="size-4 text-emerald-300" />
                                    <span className="text-[0.68rem] font-bold tracking-[0.25em] text-emerald-100 uppercase">
                                        Galeri visual sekolah
                                    </span>
                                </motion.div>
                            </div>

                            <motion.h1
                                initial={{ opacity: 0, y: 28 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.32 }}
                                className="max-w-5xl font-heading text-5xl leading-[1.02] text-white md:text-7xl lg:text-[5.4rem]"
                            >
                                Galeri foto dan video sekolah dalam satu{' '}
                                <span className="bg-gradient-to-r from-sky-300 to-emerald-300 bg-clip-text text-transparent">
                                    dokumentasi.
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 28 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.42 }}
                                className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg lg:text-xl"
                            >
                                Halaman ini fokus menampilkan foto dan video
                                kegiatan sekolah secara singkat, rapi, dan mudah
                                dibuka.
                            </motion.p>
                        </div>
                    </motion.div>
                </motion.section>

                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6">
                    <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
                        <BorderGlow
                            borderRadius={36}
                            colors={['#0EA5E9', '#10B981', '#FFFFFF']}
                            className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/88 shadow-[0_28px_80px_-48px_rgba(14,165,233,0.28)] backdrop-blur-xl"
                        >
                            <div
                                id="ringkasan-dokumentasi"
                                className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:p-7"
                            >
                                <div className="space-y-5">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-4 py-1.5 text-[0.68rem] font-bold tracking-[0.24em] text-sky-700 uppercase">
                                        <Camera className="size-4" />
                                        Snapshot Dokumentasi
                                    </div>
                                    <div>
                                        <h2 className="max-w-2xl font-heading text-3xl leading-tight text-[var(--school-ink)] md:text-4xl">
                                            Dokumentasi sekolah dibuat ringkas:
                                            foto, video, dan kanal visual.
                                        </h2>
                                        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--school-muted)] md:text-base">
                                            Tidak perlu terlalu banyak teks.
                                            Pengunjung cukup melihat galeri dan
                                            langsung menuju kanal visual yang
                                            tersedia.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-3 self-end">
                                    {[
                                        'Galeri foto',
                                        'Video sekolah',
                                        'Kanal visual',
                                    ].map((item) => (
                                        <div
                                            key={item}
                                            className="rounded-[1.35rem] border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-semibold text-[var(--school-ink)]"
                                        >
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </BorderGlow>

                        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-3">
                            {[
                                {
                                    label: 'Galeri',
                                    value: `${galleryPlaceholderItems.length}`,
                                    detail: 'frame visual',
                                    icon: Camera,
                                },
                                {
                                    label: 'Video',
                                    value: '3',
                                    detail: 'jalur kanal',
                                    icon: Clapperboard,
                                },
                                {
                                    label: 'Kanal',
                                    value: '2',
                                    detail: 'pendukung visual',
                                    icon: Radio,
                                },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-[1.8rem] border border-white/70 bg-white/88 p-5 shadow-[0_22px_64px_-44px_rgba(14,165,233,0.24)] backdrop-blur-xl"
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
                                        <div className="flex size-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                                            <item.icon className="size-5" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {sectionMenu.map((item) => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                className="rounded-full border border-white/70 bg-white/88 px-5 py-2.5 text-sm font-semibold text-[var(--school-ink)] shadow-[0_18px_45px_-32px_rgba(14,165,233,0.25)] transition hover:-translate-y-0.5 hover:border-sky-200 hover:text-sky-700"
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>
                </div>

                <section
                    id="galeri-foto"
                    className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6"
                >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <SectionHeading
                            eyebrow="Galeri Foto"
                            title="Galeri foto kegiatan sekolah."
                            description="Foto disusun ringkas agar pengunjung langsung menangkap suasana sekolah."
                        />

                        <div className="grid gap-3 sm:grid-cols-3">
                            {[
                                {
                                    label: 'Frame Aktif',
                                    value: `${galleryPlaceholderItems.length}`,
                                    detail: 'frame galeri',
                                },
                                {
                                    label: 'Kurasi',
                                    value: 'Visual',
                                    detail: 'foto pilihan',
                                },
                                {
                                    label: 'Akses',
                                    value: 'Interaktif',
                                    detail: 'drag atau scroll',
                                },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-[1.5rem] border border-white/70 bg-white/88 p-4 shadow-[0_18px_45px_-34px_rgba(14,165,233,0.2)] backdrop-blur-xl"
                                >
                                    <div className="text-[0.68rem] font-bold tracking-[0.22em] text-[var(--school-muted)] uppercase">
                                        {item.label}
                                    </div>
                                    <div className="mt-3 text-2xl font-extrabold text-[var(--school-ink)]">
                                        {item.value}
                                    </div>
                                    <p className="mt-2 text-sm leading-6 text-[var(--school-muted)]">
                                        {item.detail}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={motionViewport}
                        className="space-y-6"
                    >
                        <motion.div variants={fadeUp}>
                            <BorderGlow
                                borderRadius={38}
                                colors={['#E2E8F0', '#CBD5E1', '#94A3B8']}
                                className="overflow-hidden rounded-[2.35rem] border border-slate-200 bg-white p-3 shadow-[0_32px_90px_-54px_rgba(15,23,42,0.12)]"
                            >
                                <div className="rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.08),transparent_38%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-4 md:p-6">
                                    <div className="relative h-[520px] md:h-[600px] lg:h-[640px]">
                                        <CircularGallery
                                            items={galleryPlaceholderItems}
                                            bend={3}
                                            textColor="#0f172a"
                                            borderRadius={0.05}
                                            scrollSpeed={2}
                                            scrollEase={0.05}
                                        />
                                    </div>
                                </div>
                            </BorderGlow>
                        </motion.div>

                        <motion.div
                            variants={fadeUp}
                            className="grid gap-5 lg:grid-cols-3"
                        >
                            {photoGalleryCards.map((item, index) => (
                                <motion.article
                                    key={`${item.title}-${index}`}
                                    whileHover={{ y: -6 }}
                                    className="group"
                                >
                                    <a
                                        href="#galeri-foto"
                                        className="block h-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/88 shadow-[0_24px_70px_-44px_rgba(14,165,233,0.18)] backdrop-blur-xl"
                                    >
                                        <div className="relative h-72 overflow-hidden bg-slate-100">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/82 via-slate-950/26 to-transparent" />
                                            <div className="absolute top-4 left-4 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[0.65rem] font-bold tracking-[0.18em] text-white uppercase backdrop-blur">
                                                Dokumentasi
                                            </div>
                                        </div>

                                        <div className="space-y-3 p-5">
                                            <h3 className="line-clamp-2 text-xl font-semibold text-[var(--school-ink)]">
                                                {item.title}
                                            </h3>
                                            <p className="line-clamp-2 text-sm leading-7 text-[var(--school-muted)]">
                                                {item.description}
                                            </p>
                                            <div className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700">
                                                Lihat galeri
                                                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    </a>
                                </motion.article>
                            ))}
                        </motion.div>
                    </motion.div>
                </section>

                <section
                    id="video-sekolah"
                    className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6"
                >
                    <SectionHeading
                        eyebrow="Video Sekolah"
                        title="Video resmi dan kanal audiovisual sekolah."
                        description="Kanal video utama dan jalur pendukung disusun agar dokumentasi mudah ditemukan."
                    />

                    <div className="grid gap-5 lg:grid-cols-3">
                        {videoSignals.map((item) => (
                            <div
                                key={item.title}
                                className="rounded-[1.8rem] border border-white/70 bg-white/88 p-5 shadow-[0_22px_64px_-44px_rgba(14,165,233,0.16)] backdrop-blur-xl"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="text-[0.68rem] font-bold tracking-[0.22em] text-[var(--school-muted)] uppercase">
                                            {item.metric}
                                        </div>
                                        <div className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--school-ink)]">
                                            {item.value}
                                        </div>
                                    </div>
                                    <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                                        <item.icon className="size-5" />
                                    </div>
                                </div>
                                <h3 className="mt-5 font-heading text-2xl text-[var(--school-ink)]">
                                    {item.title}
                                </h3>
                                <p className="mt-3 text-sm leading-7 text-[var(--school-muted)]">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={motionViewport}
                        className="grid gap-6 xl:grid-cols-3"
                    >
                        {videoChannels.map((item) => (
                            <motion.article
                                key={item.title}
                                variants={fadeUp}
                                whileHover={{ y: -6 }}
                                className="group"
                            >
                                {item.external ? (
                                    <a
                                        href={item.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block h-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/88 shadow-[0_28px_80px_-50px_rgba(15,118,110,0.24)]"
                                    >
                                        <div className="relative h-72 overflow-hidden bg-slate-950">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/48 to-transparent" />
                                            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/18 to-transparent" />

                                            <div className="absolute inset-x-0 bottom-0 space-y-4 p-6 text-white">
                                                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[0.68rem] font-bold tracking-[0.2em] uppercase backdrop-blur">
                                                    <item.icon className="size-4" />
                                                    {item.eyebrow}
                                                </div>
                                                <div>
                                                    <h3 className="font-heading text-3xl">
                                                        {item.title}
                                                    </h3>
                                                    <p className="mt-3 text-sm leading-7 text-white/78">
                                                        {item.description}
                                                    </p>
                                                </div>
                                                <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-200">
                                                    Buka kanal
                                                    <ExternalLink className="size-4 transition-transform group-hover:translate-x-1" />
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                ) : (
                                    <Link
                                        href={item.href}
                                        prefetch
                                        className="block h-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/88 shadow-[0_28px_80px_-50px_rgba(15,118,110,0.24)]"
                                    >
                                        <div className="relative h-72 overflow-hidden bg-slate-950">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/48 to-transparent" />
                                            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/18 to-transparent" />

                                            <div className="absolute inset-x-0 bottom-0 space-y-4 p-6 text-white">
                                                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[0.68rem] font-bold tracking-[0.2em] uppercase backdrop-blur">
                                                    <item.icon className="size-4" />
                                                    {item.eyebrow}
                                                </div>
                                                <div>
                                                    <h3 className="font-heading text-3xl">
                                                        {item.title}
                                                    </h3>
                                                    <p className="mt-3 text-sm leading-7 text-white/78">
                                                        {item.description}
                                                    </p>
                                                </div>
                                                <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-200">
                                                    Buka halaman
                                                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )}
                            </motion.article>
                        ))}
                    </motion.div>

                    <div className="space-y-5">
                        <SectionHeading
                            eyebrow="Kanal Pendukung"
                            title="Kanal visual pendukung."
                            description="Instagram dan tur virtual cukup sebagai jalur tambahan dokumentasi."
                        />

                        <div className="grid gap-5 lg:grid-cols-3">
                            {supportingMediaChannels.map((item) => (
                                <motion.article
                                    key={item.title}
                                    variants={fadeUp}
                                    whileHover={{ y: -6 }}
                                    className="group"
                                >
                                    {item.external ? (
                                        <a
                                            href={item.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block h-full rounded-[1.9rem] border border-white/70 bg-white/88 p-5 shadow-[0_24px_70px_-44px_rgba(15,118,110,0.16)]"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[0.65rem] font-bold tracking-[0.18em] text-emerald-700 uppercase">
                                                        <item.icon className="size-3.5" />
                                                        {item.eyebrow}
                                                    </div>
                                                    <h3 className="mt-4 text-2xl font-semibold text-[var(--school-ink)]">
                                                        {item.title}
                                                    </h3>
                                                </div>
                                                <ExternalLink className="size-4 text-emerald-600" />
                                            </div>
                                            <p className="mt-4 text-sm leading-7 text-[var(--school-muted)]">
                                                {item.description}
                                            </p>
                                        </a>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            prefetch
                                            className="block h-full rounded-[1.9rem] border border-white/70 bg-white/88 p-5 shadow-[0_24px_70px_-44px_rgba(15,118,110,0.16)]"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[0.65rem] font-bold tracking-[0.18em] text-emerald-700 uppercase">
                                                        <item.icon className="size-3.5" />
                                                        {item.eyebrow}
                                                    </div>
                                                    <h3 className="mt-4 text-2xl font-semibold text-[var(--school-ink)]">
                                                        {item.title}
                                                    </h3>
                                                </div>
                                                <ArrowRight className="size-4 text-emerald-600" />
                                            </div>
                                            <p className="mt-4 text-sm leading-7 text-[var(--school-muted)]">
                                                {item.description}
                                            </p>
                                        </Link>
                                    )}
                                </motion.article>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <BorderGlow
                        borderRadius={36}
                        colors={['#0EA5E9', '#10B981', '#FFFFFF']}
                        className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/88 shadow-[0_28px_84px_-52px_rgba(14,165,233,0.2)] backdrop-blur-xl"
                    >
                        <div className="grid gap-6 p-6 md:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-4 py-1.5 text-[0.68rem] font-bold tracking-[0.24em] text-sky-700 uppercase">
                                    <Sparkles className="size-4" />
                                    Arah Dokumentasi
                                </div>
                                <h2 className="mt-4 max-w-3xl font-heading text-3xl text-[var(--school-ink)] md:text-4xl">
                                    Dokumentasi dibuat sederhana agar fokus ke
                                    galeri foto dan video sekolah.
                                </h2>
                                <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--school-muted)] md:text-base">
                                    Halaman ini hanya memuat dokumentasi visual
                                    agar berbeda dari berita, layanan, dan
                                    dokumen sekolah.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Button
                                    asChild
                                    className="rounded-full bg-sky-700 px-6 text-white hover:bg-sky-600"
                                >
                                    <a href="#galeri-foto">Lihat Galeri</a>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="rounded-full border-sky-200 px-6 text-sky-700 hover:bg-sky-50"
                                >
                                    <a href="#ringkasan-dokumentasi">
                                        Kembali ke Atas
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </BorderGlow>
                </div>
            </div>
        </>
    );
}
