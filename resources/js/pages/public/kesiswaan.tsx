import { Head, Link } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    ArrowRight,
    Award,
    BadgeCheck,
    BookHeart,
    BookOpenCheck,
    CalendarDays,
    Compass,
    GraduationCap,
    HandHeart,
    Megaphone,
    ShieldCheck,
    Sparkles,
    Target,
    Trophy,
    Users,
} from 'lucide-react';
import { useRef } from 'react';
import {
    extracurricular,
    guru,
    organization,
} from '@/actions/App/Http/Controllers/PublicSiteController';
import { BorderGlow } from '@/components/public/border-glow';
import { SectionHeading } from '@/components/public/section-heading';
import { Button } from '@/components/ui/button';
import { fadeUp, motionViewport, staggerContainer } from '@/lib/motion';
import {
    beasiswa,
    bimbinganKonseling,
    osisMpk,
    prestasiSiswa,
} from '@/routes/kesiswaan';
import type { SchoolProfilePayload } from '@/types';

type StudentAffairsPageProps = {
    school: SchoolProfilePayload;
};

const numberFormatter = new Intl.NumberFormat('id-ID');

const sectionMenu = [
    { id: 'snapshot-kesiswaan', label: 'Snapshot' },
    { id: 'layanan-khusus', label: 'Halaman Khusus' },
    { id: 'jalur-pembinaan', label: 'Ritme Pembinaan' },
    { id: 'menu-terkait', label: 'Menu Terkait' },
    { id: 'arah-berikutnya', label: 'Arah Berikutnya' },
] as const;

const serviceCards = [
    {
        id: 'osis-mpk',
        eyebrow: 'Kepemimpinan Siswa',
        title: 'OSIS & MPK',
        icon: Megaphone,
        accent: '#0F766E',
        href: osisMpk(),
        summary:
            'Ruang aspirasi, koordinasi acara, dan regenerasi kepemimpinan siswa.',
        chips: ['Forum aspirasi', 'Agenda siswa', 'Regenerasi'],
    },
    {
        id: 'prestasi-siswa',
        eyebrow: 'Reputasi Siswa',
        title: 'Prestasi Siswa',
        icon: Award,
        accent: '#D97706',
        href: prestasiSiswa(),
        summary:
            'Capaian akademik dan non-akademik ditampilkan di halaman prestasi khusus.',
        chips: ['Lomba', 'Portofolio', 'Apresiasi'],
    },
    {
        id: 'beasiswa',
        eyebrow: 'Akses Dukungan',
        title: 'Beasiswa',
        icon: GraduationCap,
        accent: '#7C3AED',
        href: beasiswa(),
        summary:
            'Informasi bantuan pendidikan, syarat, jadwal, dan pendampingan administrasi.',
        chips: ['Info peluang', 'Jadwal penting', 'Pendampingan'],
    },
    {
        id: 'bimbingan-konseling',
        eyebrow: 'Pendampingan Holistik',
        title: 'Bimbingan Konseling',
        icon: BookOpenCheck,
        accent: '#DC2626',
        href: bimbinganKonseling(),
        summary:
            'Pendampingan belajar, sosial emosi, relasi, dan arah masa depan siswa.',
        chips: ['Akademik', 'Sosial emosi', 'Karier'],
    },
] as const;

const operationBoards = [
    {
        title: 'Agenda & Representasi',
        description:
            'Arah umum pembinaan siswa dibaca dari kebutuhan kegiatan, representasi, dan dukungan sekolah.',
        metric: 'Agenda',
        value: 'Tertata',
        icon: CalendarDays,
    },
    {
        title: 'Support Desk',
        description:
            'Setiap layanan siswa diarahkan ke halaman khusus agar tindak lanjut lebih jelas.',
        metric: 'Support',
        value: 'Responsif',
        icon: HandHeart,
    },
    {
        title: 'Apresiasi & Jejak',
        description:
            'Jejak pembinaan dan capaian siswa diarahkan ke halaman yang sesuai dengan fungsinya.',
        metric: 'Output',
        value: 'Terlihat',
        icon: Trophy,
    },
] as const;

const studentJourney = [
    {
        step: '01',
        title: 'Terpetakan Sejak Awal',
        description:
            'Minat, kebutuhan pembinaan, dan potensi siswa dibaca sebagai arah layanan.',
    },
    {
        step: '02',
        title: 'Pilih Halaman Khusus',
        description:
            'Siswa diarahkan ke halaman OSIS, prestasi, beasiswa, atau BK sesuai kebutuhan.',
    },
    {
        step: '03',
        title: 'Dapatkan Konteks',
        description:
            'Setiap halaman memuat alur kerja dan informasi sesuai fungsi menu itu saja.',
    },
    {
        step: '04',
        title: 'Tindak Lanjut',
        description:
            'Pengunjung dapat melanjutkan ke menu pendukung tanpa mencampur fungsi layanan.',
    },
] as const;

export default function StudentAffairsPage({
    school,
}: StudentAffairsPageProps) {
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 140]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.82], [1, 0]);

    const heroStats = [
        {
            label: 'Siswa Aktif',
            value: numberFormatter.format(school.studentCount),
            detail: 'dalam ritme pembinaan sekolah',
            icon: Users,
        },
        {
            label: 'Rombel',
            value: numberFormatter.format(school.teachingGroupCount),
            detail: 'koordinasi lintas kelas setiap pekan',
            icon: CalendarDays,
        },
        {
            label: 'Fokus Inti',
            value: '4',
            detail: 'halaman khusus untuk setiap layanan',
            icon: ShieldCheck,
        },
        {
            label: 'Menu Terkait',
            value: '3',
            detail: 'Ekskul, organisasi, dan guru',
            icon: Compass,
        },
    ] as const;

    const relatedMenus = [
        {
            title: 'Ekstrakurikuler',
            eyebrow: 'Minat & Bakat',
            description:
                'Masuk ke halaman khusus unit unggulan, video kegiatan, dan jalur pembinaan siswa.',
            image: '/images/eskul/collage.png',
            href: extracurricular(),
            icon: ShieldCheck,
        },
        {
            title: 'Organisasi Sekolah',
            eyebrow: 'Struktur & Koordinasi',
            description:
                'Lihat struktur sekolah dan organisasi siswa tanpa mengulang detail yang sama di halaman ini.',
            image: '/images/sekolah/guru_mengajar.jpg',
            href: organization(),
            icon: Users,
        },
        {
            title: 'Guru & Pembina',
            eyebrow: 'Pendamping',
            description:
                'Temui guru dan tenaga pendidik yang menjadi pembina serta pengarah keseharian siswa.',
            image: '/images/sekolah/murid_belajar.jpg',
            href: guru(),
            icon: Sparkles,
        },
    ] as const;

    return (
        <>
            <Head title="Kesiswaan">
                <meta
                    name="description"
                    content={`Kesiswaan ${school.name}: OSIS/MPK, prestasi siswa, beasiswa, dan bimbingan konseling.`}
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
                                alt="Kegiatan kesiswaan SMAN 1 Tenjo"
                                className="h-full w-full object-cover object-center opacity-32 mix-blend-luminosity"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/84 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/56 to-transparent" />
                        </div>
                        <div className="absolute top-1/4 -left-24 size-[26rem] rounded-full bg-emerald-500/12 blur-[120px]" />
                        <div className="absolute right-0 bottom-1/4 size-[28rem] rounded-full bg-amber-500/12 blur-[130px]" />
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
                                    <span className="text-[0.68rem] font-bold tracking-[0.25em] text-emerald-200 uppercase">
                                        Kesiswaan {school.name}
                                    </span>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.92 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.45, delay: 0.28 }}
                                    className="inline-flex items-center gap-2.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-5 py-2 backdrop-blur-md"
                                >
                                    <Sparkles className="size-4 text-amber-300" />
                                    <span className="text-[0.68rem] font-bold tracking-[0.25em] text-amber-100 uppercase">
                                        Pembinaan siswa
                                    </span>
                                </motion.div>
                            </div>

                            <motion.h1
                                initial={{ opacity: 0, y: 28 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.32 }}
                                className="max-w-5xl font-heading text-5xl leading-[1.02] text-white md:text-7xl lg:text-[5.5rem]"
                            >
                                Pembinaan siswa yang tertata,{' '}
                                <span className="bg-gradient-to-r from-amber-300 to-emerald-300 bg-clip-text text-transparent">
                                    terarah, dan mudah diakses.
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 28 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.42 }}
                                className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg lg:text-xl"
                            >
                                Informasi utama mencakup kepemimpinan siswa,
                                prestasi, beasiswa, dan layanan bimbingan
                                konseling.
                            </motion.p>
                        </div>
                    </motion.div>
                </motion.section>

                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6">
                    <div className="grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
                        <BorderGlow
                            borderRadius={36}
                            colors={['#10B981', '#F59E0B', '#0EA5E9']}
                            className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/88 shadow-[0_28px_80px_-48px_rgba(15,118,110,0.38)] backdrop-blur-xl"
                        >
                            <div
                                id="snapshot-kesiswaan"
                                className="grid h-full gap-6 p-6 md:grid-cols-[1fr_auto] md:p-7"
                            >
                                <div className="space-y-5">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--school-green-200)] bg-[var(--school-green-50)] px-4 py-1.5 text-[0.68rem] font-bold tracking-[0.24em] text-[var(--school-green-700)] uppercase">
                                        <Target className="size-4" />
                                        Snapshot Kesiswaan
                                    </div>
                                    <div>
                                        <h2 className="max-w-2xl font-heading text-3xl leading-tight text-[var(--school-ink)] md:text-4xl">
                                            Kesiswaan berfokus pada pembinaan
                                            dan layanan utama siswa.
                                        </h2>
                                        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--school-muted)] md:text-base">
                                            Detail ekstrakurikuler, organisasi,
                                            dan guru tetap tersedia di halaman
                                            khusus agar informasi tidak
                                            berulang.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-3 self-end">
                                    {[
                                        'Kepemimpinan siswa',
                                        'Prestasi yang terpetakan',
                                        'Akses beasiswa',
                                        'Pendampingan BK',
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

                        <div className="grid gap-4 sm:grid-cols-2">
                            {heroStats.map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-[1.8rem] border border-white/70 bg-white/88 p-5 shadow-[0_22px_64px_-44px_rgba(15,118,110,0.25)] backdrop-blur-xl"
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
                                        <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-50 text-[var(--school-green-700)]">
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
                                className="rounded-full border border-white/70 bg-white/88 px-5 py-2.5 text-sm font-semibold text-[var(--school-ink)] shadow-[0_18px_45px_-32px_rgba(15,118,110,0.45)] transition hover:-translate-y-0.5 hover:border-[var(--school-green-200)] hover:text-[var(--school-green-700)]"
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>
                </div>

                <section
                    id="layanan-khusus"
                    className="mx-auto max-w-7xl scroll-mt-28 space-y-8 px-4 sm:px-6"
                >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <SectionHeading
                            eyebrow="Halaman Khusus"
                            title="Setiap layanan punya halaman sendiri."
                            description="Dipisah per fungsi."
                        />

                        <Button
                            asChild
                            className="rounded-full bg-[var(--school-green-700)] px-6 text-white hover:bg-[var(--school-green-600)]"
                        >
                            <a href="#menu-terkait">
                                Lihat Menu Terkait
                                <ArrowRight className="ml-2 size-4" />
                            </a>
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
                                key={service.id}
                                variants={fadeUp}
                                whileHover={{ y: -6 }}
                                className="group"
                            >
                                <Link
                                    href={service.href}
                                    prefetch
                                    className="block h-full"
                                >
                                    <BorderGlow
                                        borderRadius={34}
                                        colors={[
                                            service.accent,
                                            '#0EA5E9',
                                            '#FFFFFF',
                                        ]}
                                        className="h-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/88 shadow-[0_28px_75px_-50px_rgba(15,118,110,0.34)] backdrop-blur-xl"
                                    >
                                        <div className="space-y-6 p-6 md:p-7">
                                            <div className="flex items-start justify-between gap-5">
                                                <div>
                                                    <div className="inline-flex rounded-full border border-white/80 bg-white/82 px-4 py-1 text-[0.68rem] font-bold tracking-[0.24em] text-[var(--school-green-700)] uppercase">
                                                        {service.eyebrow}
                                                    </div>
                                                    <h3 className="mt-4 font-heading text-3xl text-[var(--school-ink)]">
                                                        {service.title}
                                                    </h3>
                                                </div>
                                                <div
                                                    className="flex size-14 items-center justify-center rounded-3xl text-white shadow-[0_24px_60px_-30px_rgba(4,47,46,0.42)] transition group-hover:scale-105"
                                                    style={{
                                                        background: `linear-gradient(135deg, ${service.accent}, rgba(15,23,42,0.82))`,
                                                    }}
                                                >
                                                    <service.icon className="size-5" />
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {service.chips.map((chip) => (
                                                    <span
                                                        key={chip}
                                                        className="rounded-full border px-3 py-1 text-xs font-semibold"
                                                        style={{
                                                            borderColor: `${service.accent}26`,
                                                            backgroundColor: `${service.accent}12`,
                                                            color: service.accent,
                                                        }}
                                                    >
                                                        {chip}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="flex items-center justify-between gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4">
                                                <div className="text-sm font-bold text-[var(--school-ink)]">
                                                    Buka halaman khusus
                                                </div>
                                                <ArrowRight
                                                    className="size-4 shrink-0 transition group-hover:translate-x-1"
                                                    style={{
                                                        color: service.accent,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </BorderGlow>
                                </Link>
                            </motion.article>
                        ))}
                    </motion.div>
                </section>

                <section
                    id="jalur-pembinaan"
                    className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6"
                >
                    <SectionHeading
                        eyebrow="Ritme Pembinaan"
                        title="Alur pembinaan siswa."
                        description="Tahap pembinaan disusun dari pemetaan kebutuhan, pendampingan, hingga pengembangan potensi siswa."
                    />

                    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                        <BorderGlow
                            borderRadius={36}
                            colors={['#0F766E', '#F59E0B', '#FFFFFF']}
                            className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/88 shadow-[0_28px_80px_-48px_rgba(15,118,110,0.3)] backdrop-blur-xl"
                        >
                            <div className="space-y-5 p-6 md:p-7">
                                <div>
                                    <div className="text-[0.68rem] font-bold tracking-[0.22em] text-[var(--school-green-700)] uppercase">
                                        Journey Siswa
                                    </div>
                                    <h3 className="mt-3 font-heading text-3xl text-[var(--school-ink)]">
                                        Dari pemetaan awal sampai pengembangan
                                        potensi.
                                    </h3>
                                </div>

                                <div className="space-y-4">
                                    {studentJourney.map((item) => (
                                        <div
                                            key={item.step}
                                            className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4"
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

                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="show"
                            viewport={motionViewport}
                            className="grid gap-5"
                        >
                            {operationBoards.map((board) => (
                                <motion.article
                                    key={board.title}
                                    variants={fadeUp}
                                    className="rounded-[1.9rem] border border-white/70 bg-white/88 p-6 shadow-[0_24px_72px_-48px_rgba(15,118,110,0.24)] backdrop-blur-xl"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="text-[0.68rem] font-bold tracking-[0.22em] text-[var(--school-muted)] uppercase">
                                                {board.metric}
                                            </div>
                                            <div className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--school-ink)]">
                                                {board.value}
                                            </div>
                                        </div>
                                        <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--school-green-50)] text-[var(--school-green-700)]">
                                            <board.icon className="size-5" />
                                        </div>
                                    </div>
                                    <h3 className="mt-5 font-heading text-2xl text-[var(--school-ink)]">
                                        {board.title}
                                    </h3>
                                    <p className="mt-3 text-sm leading-7 text-[var(--school-muted)]">
                                        {board.description}
                                    </p>
                                </motion.article>
                            ))}
                        </motion.div>
                    </div>
                </section>

                <section
                    id="menu-terkait"
                    className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6"
                >
                    <SectionHeading
                        eyebrow="Menu Terkait"
                        title="Informasi lanjutan tersedia di halaman khusus."
                        description="Pengunjung dapat membuka halaman terkait untuk detail ekstrakurikuler, organisasi, dan guru."
                    />

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={motionViewport}
                        className="grid gap-6 xl:grid-cols-3"
                    >
                        {relatedMenus.map((item) => (
                            <motion.article
                                key={item.title}
                                variants={fadeUp}
                                whileHover={{ y: -6 }}
                                className="group"
                            >
                                <Link
                                    href={item.href}
                                    prefetch
                                    className="block h-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/88 shadow-[0_28px_80px_-50px_rgba(15,118,110,0.3)]"
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
                            </motion.article>
                        ))}
                    </motion.div>
                </section>

                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <BorderGlow
                        borderRadius={36}
                        colors={['#10B981', '#0EA5E9', '#F59E0B']}
                        className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/88 shadow-[0_28px_84px_-52px_rgba(15,118,110,0.34)] backdrop-blur-xl"
                    >
                        <div className="grid gap-6 p-6 md:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--school-green-200)] bg-[var(--school-green-50)] px-4 py-1.5 text-[0.68rem] font-bold tracking-[0.24em] text-[var(--school-green-700)] uppercase">
                                    <BookHeart className="size-4" />
                                    Arah Berikutnya
                                </div>
                                <h2 className="mt-4 max-w-3xl font-heading text-3xl text-[var(--school-ink)] md:text-4xl">
                                    Kesiswaan diringkas untuk kebutuhan utama
                                    siswa.
                                </h2>
                                <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--school-muted)] md:text-base">
                                    Halaman ini menjaga fokus pada layanan inti
                                    dan memberi akses cepat ke menu pendukung.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Button
                                    asChild
                                    className="rounded-full bg-[var(--school-green-700)] px-6 text-white hover:bg-[var(--school-green-600)]"
                                >
                                    <Link href={organization()} prefetch>
                                        Lihat Organisasi
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="rounded-full border-[var(--school-green-200)] px-6 text-[var(--school-green-700)] hover:bg-[var(--school-green-50)]"
                                >
                                    <a href="#snapshot-kesiswaan">
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
