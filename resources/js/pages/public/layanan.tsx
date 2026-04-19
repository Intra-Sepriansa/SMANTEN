import { Head, Link } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    ArrowRight,
    BadgeCheck,
    CalendarClock,
    ChevronDown,
    CircleHelp,
    ClipboardList,
    FileCheck,
    GraduationCap,
    HandHelping,
    Mail,
    MapPin,
    MessageSquareMore,
    Phone,
    ShieldCheck,
    Sparkles,
    UsersRound,
} from 'lucide-react';
import { useRef, useState } from 'react';
import {
    kesiswaan,
    media,
    ppdb as ppdbRoute,
} from '@/actions/App/Http/Controllers/PublicSiteController';
import { BorderGlow } from '@/components/public/border-glow';
import { SectionHeading } from '@/components/public/section-heading';
import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { fadeUp, motionViewport, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/utils';
import type { PpdbPayload, SchoolProfilePayload } from '@/types';

type LayananPageProps = {
    school: SchoolProfilePayload;
    ppdb: PpdbPayload;
};

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
});

const sectionMenu = [
    { id: 'pusat-layanan', label: 'Pusat Layanan' },
    { id: 'desk-konsultasi', label: 'Desk Konsultasi' },
    { id: 'faq-layanan', label: 'FAQ' },
    { id: 'kontak-layanan', label: 'Kontak' },
] as const;

const serviceCards = [
    {
        title: 'PPDB Digital',
        eyebrow: 'Admission Service',
        icon: GraduationCap,
        accent: '#0F766E',
        summary:
            'Gerbang cepat untuk informasi zonasi, jadwal seleksi, dan alur pendaftaran sekolah.',
        points: [
            'Status pendaftaran',
            'Timeline penting',
            'Akses halaman PPDB',
        ],
    },
    {
        title: 'Desk Konsultasi',
        eyebrow: 'Support Desk',
        icon: UsersRound,
        accent: '#0EA5E9',
        summary:
            'Jalur bantuan untuk kebutuhan siswa, orang tua, dan pertanyaan layanan akademik dasar.',
        points: ['Konsultasi umum', 'Arah layanan', 'Tindak lanjut cepat'],
    },
    {
        title: 'Layanan BK & Pendampingan',
        eyebrow: 'Student Support',
        icon: HandHelping,
        accent: '#DC2626',
        summary:
            'Pintu masuk ke pendampingan belajar, sosial-emosi, dan kebutuhan dukungan siswa.',
        points: ['Akses ke BK', 'Rujukan layanan', 'Pendampingan siswa'],
    },
    {
        title: 'Pusat Informasi & FAQ',
        eyebrow: 'Help Center',
        icon: CircleHelp,
        accent: '#7C3AED',
        summary:
            'Ringkasan pertanyaan umum, kanal resmi, dan informasi layanan sekolah.',
        points: ['FAQ terpilih', 'Kontak resmi', 'Panduan kanal digital'],
    },
] as const;

const workflow = [
    {
        step: '01',
        title: 'Pilih jenis layanan',
        description:
            'Mulai dari PPDB, informasi umum, konsultasi siswa, atau kebutuhan tindak lanjut orang tua.',
    },
    {
        step: '02',
        title: 'Siapkan data singkat',
        description:
            'Nama, kelas atau status pendaftar, serta kebutuhan utama agar respons lebih tepat dan cepat.',
    },
    {
        step: '03',
        title: 'Masuk ke kanal yang sesuai',
        description:
            'Arahkan pertanyaan ke halaman, kontak, atau desk yang paling relevan agar tidak berputar-putar.',
    },
    {
        step: '04',
        title: 'Tindak lanjut terjadwal',
        description:
            'Sekolah dapat menindaklanjuti sesuai jenis kebutuhan, dari informasi cepat sampai pendampingan lanjutan.',
    },
] as const;

const faqItems = [
    {
        id: 'faq-1',
        question: 'Kalau ingin tanya PPDB, sebaiknya mulai dari mana?',
        answer: 'Mulai dari halaman PPDB untuk melihat status pendaftaran, kuota, dan timeline. Setelah itu, jika masih ada hal yang belum jelas, lanjutkan ke desk konsultasi sekolah.',
    },
    {
        id: 'faq-2',
        question: 'Apakah layanan ini hanya untuk calon siswa?',
        answer: 'Tidak. Halaman ini juga dapat digunakan orang tua, siswa aktif, alumni, dan masyarakat yang membutuhkan informasi sekolah.',
    },
    {
        id: 'faq-3',
        question:
            'Bagaimana kalau kebutuhan saya terkait BK atau pendampingan siswa?',
        answer: 'Gunakan jalur kesiswaan dan BK. Informasi pendampingan siswa tersedia melalui menu kesiswaan.',
    },
    {
        id: 'faq-4',
        question: 'Apakah semua informasi layanan akan selalu ada di sini?',
        answer: 'Halaman ini menjadi pintu masuk layanan. Detail tertentu tetap diarahkan ke halaman PPDB, dokumentasi, atau kesiswaan.',
    },
] as const;

function formatDateLabel(value: string | null | undefined): string {
    if (!value) {
        return 'Akan diumumkan';
    }

    return dateFormatter.format(new Date(value));
}

export default function LayananPage({ school, ppdb }: LayananPageProps) {
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 140]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.82], [1, 0]);

    const [openFaq, setOpenFaq] = useState<string | null>(faqItems[0].id);

    const emailHref = school.email ? `mailto:${school.email}` : null;
    const phoneHref = school.phone
        ? `tel:${school.phone.replace(/[^\d+]/g, '')}`
        : null;

    return (
        <>
            <Head title="Layanan Sekolah">
                <meta
                    name="description"
                    content={`Layanan ${school.name}: PPDB, FAQ, kontak sekolah, dan jalur konsultasi.`}
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
                                src="/images/sekolah/murid_belajar.jpg"
                                alt="Layanan sekolah SMAN 1 Tenjo"
                                className="h-full w-full object-cover object-center opacity-32 mix-blend-luminosity"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/84 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/56 to-transparent" />
                        </div>
                        <div className="absolute top-1/4 -left-24 size-[26rem] rounded-full bg-emerald-500/12 blur-[120px]" />
                        <div className="absolute right-0 bottom-1/4 size-[28rem] rounded-full bg-violet-500/12 blur-[130px]" />
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
                                    className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 backdrop-blur-md"
                                >
                                    <BadgeCheck className="size-4 text-emerald-300" />
                                    <span className="text-[0.68rem] font-bold tracking-[0.25em] text-emerald-100 uppercase">
                                        Layanan {school.name}
                                    </span>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.92 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.45, delay: 0.28 }}
                                    className="inline-flex items-center gap-2.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2 backdrop-blur-md"
                                >
                                    <Sparkles className="size-4 text-violet-300" />
                                    <span className="text-[0.68rem] font-bold tracking-[0.25em] text-violet-100 uppercase">
                                        Pusat bantuan sekolah
                                    </span>
                                </motion.div>
                            </div>

                            <motion.h1
                                initial={{ opacity: 0, y: 28 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.32 }}
                                className="max-w-5xl font-heading text-5xl leading-[1.02] text-white md:text-7xl lg:text-[5.3rem]"
                            >
                                Satu gerbang untuk kebutuhan siswa, orang tua,
                                dan{' '}
                                <span className="bg-gradient-to-r from-emerald-300 to-violet-300 bg-clip-text text-transparent">
                                    layanan sekolah.
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 28 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.42 }}
                                className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg lg:text-xl"
                            >
                                Pusat informasi untuk PPDB, konsultasi, FAQ,
                                kontak resmi, dan kebutuhan layanan sekolah.
                            </motion.p>
                        </div>
                    </motion.div>
                </motion.section>

                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6">
                    <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
                        <BorderGlow
                            borderRadius={36}
                            colors={['#10B981', '#7C3AED', '#FFFFFF']}
                            className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/88 shadow-[0_28px_80px_-48px_rgba(15,118,110,0.24)] backdrop-blur-xl"
                        >
                            <div
                                id="pusat-layanan"
                                className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:p-7"
                            >
                                <div className="space-y-5">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-1.5 text-[0.68rem] font-bold tracking-[0.24em] text-emerald-700 uppercase">
                                        <ShieldCheck className="size-4" />
                                        Snapshot Layanan
                                    </div>
                                    <div>
                                        <h2 className="max-w-2xl font-heading text-3xl leading-tight text-[var(--school-ink)] md:text-4xl">
                                            Layanan sekolah dipusatkan agar
                                            kebutuhan utama mudah ditemukan.
                                        </h2>
                                        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--school-muted)] md:text-base">
                                            PPDB, konsultasi, FAQ, dan kontak
                                            resmi disajikan sebagai jalur
                                            layanan utama.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-3 self-end">
                                    {[
                                        'PPDB digital',
                                        'Kontak resmi',
                                        'FAQ terarah',
                                        'Desk konsultasi',
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

                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                            {[
                                {
                                    label: 'PPDB',
                                    value: ppdb?.status ?? 'Siap',
                                    detail: 'status jalur masuk sekolah',
                                    icon: GraduationCap,
                                },
                                {
                                    label: 'Respons',
                                    value: 'Cepat',
                                    detail: 'jalur layanan dibuat lebih ringkas',
                                    icon: MessageSquareMore,
                                },
                                {
                                    label: 'Kontak',
                                    value: '2 Kanal',
                                    detail: 'telepon dan email resmi sekolah',
                                    icon: Phone,
                                },
                                {
                                    label: 'FAQ',
                                    value: `${faqItems.length}`,
                                    detail: 'jawaban inti yang paling dibutuhkan',
                                    icon: CircleHelp,
                                },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-[1.8rem] border border-white/70 bg-white/88 p-5 shadow-[0_22px_64px_-44px_rgba(15,118,110,0.18)] backdrop-blur-xl"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="text-[0.68rem] font-bold tracking-[0.22em] text-[var(--school-muted)] uppercase">
                                                {item.label}
                                            </div>
                                            <div className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--school-ink)]">
                                                {item.value}
                                            </div>
                                            <p className="mt-2 text-sm leading-6 text-[var(--school-muted)]">
                                                {item.detail}
                                            </p>
                                        </div>
                                        <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
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
                                className="rounded-full border border-white/70 bg-white/88 px-5 py-2.5 text-sm font-semibold text-[var(--school-ink)] shadow-[0_18px_45px_-32px_rgba(15,118,110,0.22)] transition hover:-translate-y-0.5 hover:border-emerald-200 hover:text-emerald-700"
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>
                </div>

                <section className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <SectionHeading
                            eyebrow="Pusat Layanan"
                            title="Empat kelompok layanan ini dibuat supaya kebutuhan utama tidak lagi berputar di banyak halaman."
                            description="Setiap kartu mengarahkan pengunjung ke jalur layanan yang sesuai."
                        />

                        <Button
                            asChild
                            className="rounded-full bg-emerald-700 px-6 text-white hover:bg-emerald-600"
                        >
                            <Link href={ppdbRoute()} prefetch>
                                Buka PPDB
                                <ArrowRight className="ml-2 size-4" />
                            </Link>
                        </Button>
                    </div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={motionViewport}
                        className="grid gap-6 lg:grid-cols-2"
                    >
                        {serviceCards.map((service) => (
                            <motion.article
                                key={service.title}
                                variants={fadeUp}
                                className="group"
                            >
                                <BorderGlow
                                    borderRadius={34}
                                    colors={[
                                        service.accent,
                                        '#0EA5E9',
                                        '#FFFFFF',
                                    ]}
                                    className="h-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/88 shadow-[0_28px_75px_-50px_rgba(15,118,110,0.24)] backdrop-blur-xl"
                                >
                                    <div className="space-y-6 p-6 md:p-7">
                                        <div className="flex items-start justify-between gap-5">
                                            <div>
                                                <div className="inline-flex rounded-full border border-white/80 bg-white/82 px-4 py-1 text-[0.68rem] font-bold tracking-[0.24em] text-emerald-700 uppercase">
                                                    {service.eyebrow}
                                                </div>
                                                <h3 className="mt-4 font-heading text-3xl text-[var(--school-ink)]">
                                                    {service.title}
                                                </h3>
                                            </div>
                                            <div
                                                className="flex size-14 items-center justify-center rounded-3xl text-white shadow-[0_24px_60px_-30px_rgba(4,47,46,0.42)]"
                                                style={{
                                                    background: `linear-gradient(135deg, ${service.accent}, rgba(15,23,42,0.82))`,
                                                }}
                                            >
                                                <service.icon className="size-5" />
                                            </div>
                                        </div>

                                        <p className="text-sm leading-7 text-[var(--school-muted)] md:text-base">
                                            {service.summary}
                                        </p>

                                        <div className="grid gap-3 md:grid-cols-3">
                                            {service.points.map((point) => (
                                                <div
                                                    key={point}
                                                    className="rounded-[1.35rem] border border-slate-200 bg-slate-50/80 px-4 py-4 text-sm font-medium text-[var(--school-ink)]"
                                                >
                                                    {point}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </BorderGlow>
                            </motion.article>
                        ))}
                    </motion.div>
                </section>

                <section
                    id="desk-konsultasi"
                    className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6"
                >
                    <SectionHeading
                        eyebrow="Desk Konsultasi"
                        title="Alur bantuan dibuat sesingkat mungkin agar pengunjung cepat sampai ke jawaban."
                        description="Urutan layanan membantu pengunjung memilih kanal, menyiapkan data, dan melakukan tindak lanjut."
                    />

                    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                        <BorderGlow
                            borderRadius={36}
                            colors={['#10B981', '#7C3AED', '#FFFFFF']}
                            className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/88 shadow-[0_28px_80px_-48px_rgba(15,118,110,0.2)] backdrop-blur-xl"
                        >
                            <div className="space-y-5 p-6 md:p-7">
                                <div>
                                    <div className="text-[0.68rem] font-bold tracking-[0.22em] text-emerald-700 uppercase">
                                        Workflow Layanan
                                    </div>
                                    <h3 className="mt-3 font-heading text-3xl text-[var(--school-ink)]">
                                        Dari kebutuhan awal sampai tindak lanjut
                                        layanan.
                                    </h3>
                                </div>

                                <div className="space-y-4">
                                    {workflow.map((item) => (
                                        <div
                                            key={item.step}
                                            className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-sm font-extrabold text-white">
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

                        <div className="grid gap-5">
                            <div className="rounded-[1.9rem] border border-white/70 bg-white/88 p-6 shadow-[0_24px_72px_-48px_rgba(15,118,110,0.18)] backdrop-blur-xl">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                                        <CalendarClock className="size-5" />
                                    </div>
                                    <div>
                                        <div className="text-[0.68rem] font-bold tracking-[0.22em] text-[var(--school-muted)] uppercase">
                                            PPDB Update
                                        </div>
                                        <h3 className="mt-1 font-heading text-2xl text-[var(--school-ink)]">
                                            {ppdb?.name ??
                                                'Siklus PPDB terbaru'}
                                        </h3>
                                    </div>
                                </div>

                                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                                    <div className="rounded-[1.3rem] border border-slate-200 bg-slate-50/80 p-4">
                                        <div className="text-[0.68rem] font-bold tracking-[0.22em] text-[var(--school-muted)] uppercase">
                                            Buka
                                        </div>
                                        <div className="mt-2 text-sm font-semibold text-[var(--school-ink)]">
                                            {formatDateLabel(
                                                ppdb?.applicationOpensAt,
                                            )}
                                        </div>
                                    </div>
                                    <div className="rounded-[1.3rem] border border-slate-200 bg-slate-50/80 p-4">
                                        <div className="text-[0.68rem] font-bold tracking-[0.22em] text-[var(--school-muted)] uppercase">
                                            Tutup
                                        </div>
                                        <div className="mt-2 text-sm font-semibold text-[var(--school-ink)]">
                                            {formatDateLabel(
                                                ppdb?.applicationClosesAt,
                                            )}
                                        </div>
                                    </div>
                                    <div className="rounded-[1.3rem] border border-slate-200 bg-slate-50/80 p-4">
                                        <div className="text-[0.68rem] font-bold tracking-[0.22em] text-[var(--school-muted)] uppercase">
                                            Pengumuman
                                        </div>
                                        <div className="mt-2 text-sm font-semibold text-[var(--school-ink)]">
                                            {formatDateLabel(
                                                ppdb?.announcementAt,
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[1.9rem] border border-white/70 bg-white/88 p-6 shadow-[0_24px_72px_-48px_rgba(15,118,110,0.18)] backdrop-blur-xl">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                                        <ClipboardList className="size-5" />
                                    </div>
                                    <div>
                                        <div className="text-[0.68rem] font-bold tracking-[0.22em] text-[var(--school-muted)] uppercase">
                                            Standar Respons
                                        </div>
                                        <h3 className="mt-1 font-heading text-2xl text-[var(--school-ink)]">
                                            Panduan singkat sebelum lanjut ke
                                            kanal detail
                                        </h3>
                                    </div>
                                </div>

                                <div className="mt-5 grid gap-3">
                                    {[
                                        'Mulai dari FAQ jika pertanyaannya umum dan tidak butuh tindak lanjut langsung.',
                                        'Gunakan kontak resmi ketika butuh konfirmasi data, jadwal, atau dokumen.',
                                        'Lanjut ke halaman khusus hanya saat memang butuh detail PPDB, BK, atau media sekolah.',
                                    ].map((item) => (
                                        <div
                                            key={item}
                                            className="rounded-[1.35rem] border border-slate-200 bg-slate-50/80 px-4 py-4 text-sm leading-7 text-[var(--school-muted)]"
                                        >
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    id="faq-layanan"
                    className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6"
                >
                    <SectionHeading
                        eyebrow="FAQ Layanan"
                        title="Pertanyaan umum layanan sekolah."
                        description="Jawaban singkat disediakan agar informasi dasar dapat dibaca tanpa membuka halaman lain."
                    />

                    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                        <div className="space-y-4">
                            {faqItems.map((item) => {
                                const isOpen = openFaq === item.id;

                                return (
                                    <Collapsible
                                        key={item.id}
                                        open={isOpen}
                                        onOpenChange={(open) =>
                                            setOpenFaq(open ? item.id : null)
                                        }
                                        className="rounded-[1.8rem] border border-white/70 bg-white/88 shadow-[0_22px_64px_-44px_rgba(15,118,110,0.15)] backdrop-blur-xl"
                                    >
                                        <CollapsibleTrigger className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left">
                                            <div>
                                                <div className="text-[0.68rem] font-bold tracking-[0.22em] text-emerald-700 uppercase">
                                                    FAQ
                                                </div>
                                                <div className="mt-2 text-lg font-semibold text-[var(--school-ink)]">
                                                    {item.question}
                                                </div>
                                            </div>
                                            <ChevronDown
                                                className={cn(
                                                    'size-5 shrink-0 text-[var(--school-muted)] transition-transform',
                                                    isOpen && 'rotate-180',
                                                )}
                                            />
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="px-5 pb-5">
                                            <div className="rounded-[1.35rem] border border-slate-200 bg-slate-50/80 p-4 text-sm leading-7 text-[var(--school-muted)]">
                                                {item.answer}
                                            </div>
                                        </CollapsibleContent>
                                    </Collapsible>
                                );
                            })}
                        </div>

                        <BorderGlow
                            borderRadius={36}
                            colors={['#10B981', '#7C3AED', '#FFFFFF']}
                            className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/88 shadow-[0_28px_80px_-48px_rgba(15,118,110,0.18)] backdrop-blur-xl"
                        >
                            <div className="space-y-5 p-6 md:p-7">
                                <div>
                                    <div className="text-[0.68rem] font-bold tracking-[0.22em] text-emerald-700 uppercase">
                                        Jalur Lanjutan
                                    </div>
                                    <h3 className="mt-3 font-heading text-3xl text-[var(--school-ink)]">
                                        Detail layanan tersedia di halaman
                                        terkait.
                                    </h3>
                                    <p className="mt-3 text-sm leading-7 text-[var(--school-muted)]">
                                        PPDB, pendampingan siswa, dan
                                        dokumentasi sekolah diarahkan ke halaman
                                        masing-masing agar informasi tetap
                                        ringkas.
                                    </p>
                                </div>

                                <div className="grid gap-4">
                                    <Link
                                        href={ppdbRoute()}
                                        prefetch
                                        className="block rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4 transition hover:-translate-y-0.5 hover:border-emerald-200"
                                    >
                                        <div className="text-[0.68rem] font-bold tracking-[0.22em] text-emerald-700 uppercase">
                                            PPDB Digital
                                        </div>
                                        <h4 className="mt-2 text-lg font-semibold text-[var(--school-ink)]">
                                            Jalur masuk dan timeline pendaftaran
                                        </h4>
                                        <p className="mt-2 text-sm leading-7 text-[var(--school-muted)]">
                                            Buka halaman PPDB untuk melihat
                                            jadwal, kuota, dan alur seleksi
                                            secara penuh.
                                        </p>
                                    </Link>

                                    <Link
                                        href={`${kesiswaan.url()}#bimbingan-konseling`}
                                        prefetch
                                        className="block rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4 transition hover:-translate-y-0.5 hover:border-emerald-200"
                                    >
                                        <div className="text-[0.68rem] font-bold tracking-[0.22em] text-violet-700 uppercase">
                                            BK & Kesiswaan
                                        </div>
                                        <h4 className="mt-2 text-lg font-semibold text-[var(--school-ink)]">
                                            Jalur pendampingan siswa
                                        </h4>
                                        <p className="mt-2 text-sm leading-7 text-[var(--school-muted)]">
                                            Gunakan halaman kesiswaan untuk
                                            pembinaan, beasiswa, dan dukungan BK
                                            secara lebih lengkap.
                                        </p>
                                    </Link>

                                    <Link
                                        href={media()}
                                        prefetch
                                        className="block rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4 transition hover:-translate-y-0.5 hover:border-emerald-200"
                                    >
                                        <div className="text-[0.68rem] font-bold tracking-[0.22em] text-sky-700 uppercase">
                                            Media Sekolah
                                        </div>
                                        <h4 className="mt-2 text-lg font-semibold text-[var(--school-ink)]">
                                            Foto, video, dan publikasi resmi
                                        </h4>
                                        <p className="mt-2 text-sm leading-7 text-[var(--school-muted)]">
                                            Masuk ke halaman media jika yang
                                            dicari adalah cerita visual dan
                                            update sekolah.
                                        </p>
                                    </Link>
                                </div>
                            </div>
                        </BorderGlow>
                    </div>
                </section>

                <section
                    id="kontak-layanan"
                    className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6"
                >
                    <SectionHeading
                        eyebrow="Kontak Layanan"
                        title="Kontak resmi sekolah."
                        description="Gunakan email atau telepon sekolah untuk kebutuhan informasi dan administrasi."
                    />

                    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                        <BorderGlow
                            borderRadius={36}
                            colors={['#10B981', '#0EA5E9', '#FFFFFF']}
                            className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/88 shadow-[0_28px_80px_-48px_rgba(15,118,110,0.18)] backdrop-blur-xl"
                        >
                            <div className="grid gap-4 p-6 md:grid-cols-3 md:p-7">
                                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5">
                                    <Mail className="size-5 text-emerald-700" />
                                    <div className="mt-4 text-[0.68rem] font-bold tracking-[0.22em] text-[var(--school-muted)] uppercase">
                                        Email
                                    </div>
                                    <div className="mt-2 text-sm font-semibold text-[var(--school-ink)]">
                                        {school.email ?? 'smantenjo@yahoo.com'}
                                    </div>
                                    {emailHref ? (
                                        <a
                                            href={emailHref}
                                            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700"
                                        >
                                            Kirim email
                                            <ArrowRight className="size-4" />
                                        </a>
                                    ) : null}
                                </div>

                                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5">
                                    <Phone className="size-5 text-sky-700" />
                                    <div className="mt-4 text-[0.68rem] font-bold tracking-[0.22em] text-[var(--school-muted)] uppercase">
                                        Telepon
                                    </div>
                                    <div className="mt-2 text-sm font-semibold text-[var(--school-ink)]">
                                        {school.phone ?? '021-5976-1066'}
                                    </div>
                                    {phoneHref ? (
                                        <a
                                            href={phoneHref}
                                            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-700"
                                        >
                                            Hubungi sekarang
                                            <ArrowRight className="size-4" />
                                        </a>
                                    ) : null}
                                </div>

                                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5">
                                    <MapPin className="size-5 text-violet-700" />
                                    <div className="mt-4 text-[0.68rem] font-bold tracking-[0.22em] text-[var(--school-muted)] uppercase">
                                        Alamat
                                    </div>
                                    <div className="mt-2 text-sm font-semibold text-[var(--school-ink)]">
                                        {school.address}
                                    </div>
                                </div>
                            </div>
                        </BorderGlow>

                        <div className="space-y-4">
                            <div className="rounded-[1.8rem] border border-white/70 bg-white/88 p-5 shadow-[0_22px_64px_-44px_rgba(15,118,110,0.15)]">
                                <div className="text-[0.68rem] font-bold tracking-[0.22em] text-emerald-700 uppercase">
                                    Arahan Akhir
                                </div>
                                <h3 className="mt-2 text-xl font-semibold text-[var(--school-ink)]">
                                    Gunakan kontak resmi untuk tindak lanjut.
                                </h3>
                                <p className="mt-2 text-sm leading-7 text-[var(--school-muted)]">
                                    Email cocok untuk kebutuhan administratif
                                    dan dokumen. Telepon lebih tepat untuk
                                    konfirmasi cepat atau tindak lanjut yang
                                    perlu respons langsung.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-[1.8rem] border border-white/70 bg-white/88 p-5 shadow-[0_22px_64px_-44px_rgba(15,118,110,0.15)]">
                                    <div className="text-[0.68rem] font-bold tracking-[0.22em] text-sky-700 uppercase">
                                        Email
                                    </div>
                                    <p className="mt-2 text-sm leading-7 text-[var(--school-muted)]">
                                        Gunakan untuk permintaan informasi
                                        formal, lampiran berkas, dan kebutuhan
                                        administrasi yang perlu jejak tertulis.
                                    </p>
                                </div>

                                <div className="rounded-[1.8rem] border border-white/70 bg-white/88 p-5 shadow-[0_22px_64px_-44px_rgba(15,118,110,0.15)]">
                                    <div className="text-[0.68rem] font-bold tracking-[0.22em] text-violet-700 uppercase">
                                        Telepon
                                    </div>
                                    <p className="mt-2 text-sm leading-7 text-[var(--school-muted)]">
                                        Gunakan untuk validasi cepat, konfirmasi
                                        jadwal, atau ketika butuh arahan layanan
                                        segera.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <BorderGlow
                        borderRadius={36}
                        colors={['#10B981', '#7C3AED', '#FFFFFF']}
                        className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/88 shadow-[0_28px_84px_-52px_rgba(15,118,110,0.2)] backdrop-blur-xl"
                    >
                        <div className="grid gap-6 p-6 md:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-1.5 text-[0.68rem] font-bold tracking-[0.24em] text-emerald-700 uppercase">
                                    <FileCheck className="size-4" />
                                    Arah Layanan
                                </div>
                                <h2 className="mt-4 max-w-3xl font-heading text-3xl text-[var(--school-ink)] md:text-4xl">
                                    Layanan sekolah memiliki satu pusat
                                    informasi.
                                </h2>
                                <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--school-muted)] md:text-base">
                                    Pengunjung dapat memilih PPDB, konsultasi,
                                    FAQ, atau kontak resmi tanpa membaca
                                    informasi berulang.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Button
                                    asChild
                                    className="rounded-full bg-emerald-700 px-6 text-white hover:bg-emerald-600"
                                >
                                    <Link href={ppdbRoute()} prefetch>
                                        Cek PPDB
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="rounded-full border-emerald-200 px-6 text-emerald-700 hover:bg-emerald-50"
                                >
                                    <a href="#pusat-layanan">Kembali ke Atas</a>
                                </Button>
                            </div>
                        </div>
                    </BorderGlow>
                </div>
            </div>
        </>
    );
}
