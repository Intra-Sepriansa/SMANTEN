import { Head, Link } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Award,
    BookOpen,
    Building,
    ChevronRight,
    Compass,
    GraduationCap,
    Heart,
    Landmark,
    Library,
    MapPinned,
    School2,
    ShieldCheck,
    Sparkles,
    Star,
    Target,
    Trophy,
    Users,
} from 'lucide-react';
import { useRef } from 'react';
import {
    akademik,
    layanan,
    organization,
} from '@/actions/App/Http/Controllers/PublicSiteController';
import {
    FasilitasBarChart,
    ProfilPilarRadar,
} from '@/components/charts/school-charts';
import { AnimatedCounter } from '@/components/public/animated-counter';
import { BorderGlow } from '@/components/public/border-glow';
import { SectionHeading } from '@/components/public/section-heading';
import { fadeUp, motionViewport, staggerContainer } from '@/lib/motion';
import type { SchoolProfilePayload } from '@/types';

type ProfilePageProps = {
    school: SchoolProfilePayload;
};

const numberFormatter = new Intl.NumberFormat('id-ID');

export default function ProfilePage({ school }: ProfilePageProps) {
    const batara = school.valueStatements.find(
        (statement) => statement.key === 'batara_kresna',
    );

    const timelineRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress: timelineScrollProgress } = useScroll({
        target: timelineRef,
        offset: ['start center', 'end center'],
    });
    const timelineHeight = useTransform(
        timelineScrollProgress,
        [0, 1],
        ['0%', '100%'],
    );
    const profileShortcuts = [
        {
            title: 'Struktur Organisasi',
            description:
                'Buka halaman organisasi untuk melihat peran pimpinan, pembagian bidang, dan pola koordinasi sekolah secara penuh.',
            href: organization(),
            icon: Users,
            accent: '#0F766E',
        },
        {
            title: 'Akademik & Kurikulum',
            description:
                'Masuk ke halaman akademik untuk detail kurikulum, projek P5, dan ritme belajar.',
            href: akademik(),
            icon: BookOpen,
            accent: '#0369A1',
        },
        {
            title: 'Layanan & Kontak',
            description:
                'Alamat kampus, email resmi, telepon, dan jalur bantuan administratif sekarang dipusatkan di halaman layanan.',
            href: layanan(),
            icon: MapPinned,
            accent: '#D97706',
        },
    ] as const;

    return (
        <>
            <Head title="Profil Sekolah">
                <meta
                    name="description"
                    content={`Profil resmi ${school.name}: NPSN ${school.npsn}, Akreditasi ${school.accreditation}, ${school.curriculumName ?? 'Kurikulum Merdeka'}, BATARA KRESNA.`}
                />
                <meta property="og:title" content={`Profil — ${school.name}`} />
                <meta
                    property="og:description"
                    content="Identitas, sejarah, nilai inti, data operasional, dan prestasi sekolah."
                />
            </Head>

            <div className="space-y-14">
                {/* ═══════════ HERO BANNER FULL SCREEN ═══════════ */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    id="hero"
                    className="relative right-1/2 left-1/2 -mt-8 -mr-[50vw] -ml-[50vw] h-[85vh] w-[100vw] overflow-hidden bg-neutral-900 md:-mt-10 lg:h-[100dvh]"
                >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <img
                            src="/images/profil/hero-banner.png"
                            alt="Kampus SMAN 1 Tenjo"
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(4,47,46,0.95)] via-[rgba(4,47,46,0.4)] to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute inset-0 z-10 flex flex-col justify-end">
                        <div className="mx-auto w-full max-w-[84rem] p-5 pb-16 md:p-8 md:pb-24">
                            {/* Ambient orb */}
                            <div className="pointer-events-none absolute top-1/4 -right-32 size-96 rounded-full bg-[var(--school-gold)]/[0.08] blur-[120px]" />

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="mt-5 max-w-3xl font-heading text-4xl leading-[1.15] text-white md:text-6xl"
                            >
                                {school.name}
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg"
                            >
                                Profil resmi {school.name}: identitas sekolah,
                                nilai utama, data operasional, dan alamat di{' '}
                                {school.address}.
                            </motion.p>

                        </div>
                    </div>
                </motion.section>

                {/* ═══════════ SEJARAH SINGKAT ═══════════ */}
                <section id="sejarah" className="scroll-mt-24 space-y-8">
                    <SectionHeading
                        eyebrow="Sejarah"
                        title="Dari berdiri hingga kini, SMAN 1 Tenjo terus tumbuh."
                        description="Perjalanan sekolah dimulai dari visi sederhana untuk menyediakan pendidikan menengah berkualitas bagi masyarakat Tenjo dan sekitarnya."
                    />

                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={motionViewport}
                    >
                        <BorderGlow
                            borderRadius={32}
                            colors={['#0F766E', '#0E9EE4', '#D97706']}
                            className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white p-8 shadow-[0_32px_90px_-50px_rgba(15,118,110,0.35)] md:p-14"
                        >
                            <div className="pointer-events-none absolute -top-40 -right-40 size-96 rounded-full bg-[var(--school-green-50)] blur-[100px]" />
                            <div className="pointer-events-none absolute -bottom-40 -left-40 size-96 rounded-full bg-blue-50/50 blur-[100px]" />

                            <div className="relative z-10 mx-auto mb-16 flex max-w-3xl flex-col items-center text-center">
                                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--school-green-200)] bg-white px-4 py-1.5 shadow-sm">
                                    <Landmark className="size-3.5 text-[var(--school-green-700)]" />
                                    <span className="text-[0.65rem] font-bold tracking-[0.22em] text-[var(--school-green-700)] uppercase">
                                        Perjalanan Historis
                                    </span>
                                </div>
                                <h3 className="mt-6 font-heading text-3xl leading-[1.2] text-[var(--school-ink)] md:text-4xl">
                                    Berdiri Atas Kebutuhan Pendidikan Menengah
                                    di Tenjo
                                </h3>
                                <p className="mt-4 text-base leading-relaxed text-[var(--school-muted)]">
                                    SMA Negeri 1 Tenjo hadir untuk memperluas
                                    akses pendidikan menengah di Tenjo. Sekolah
                                    terus mengembangkan layanan belajar,
                                    karakter, dan fasilitas pendukung.
                                </p>
                            </div>

                            {/* TIMELINE */}
                            <div
                                ref={timelineRef}
                                className="relative mx-auto max-w-4xl px-2 md:px-0"
                            >
                                {/* Base Vertical Line Desktop */}
                                <div className="absolute top-6 left-[20px] h-[calc(100%-30px)] w-[2px] bg-slate-100 md:left-1/2 md:-ml-px" />

                                {/* Animated Running Line Desktop */}
                                <motion.div
                                    className="absolute top-6 left-[20px] z-0 w-[2px] origin-top bg-gradient-to-b from-[var(--school-green-400)] via-[#0E9EE4] to-[var(--school-green-700)] shadow-[0_0_20px_#0EA5E9] md:left-1/2 md:-ml-px"
                                    style={{
                                        height: 'calc(100% - 30px)',
                                        scaleY: timelineHeight,
                                    }}
                                />

                                <div className="space-y-12 md:space-y-0">
                                    {[
                                        {
                                            year: '2004',
                                            title: 'Pendirian Institusi Terpadu',
                                            desc: 'Sekolah didirikan untuk memenuhi kebutuhan pendidikan menengah atas di Kecamatan Tenjo dan sekitarnya.',
                                            icon: MapPinned,
                                            align: 'right', // box on right, meaning base line is to its left
                                        },
                                        {
                                            year: '2010',
                                            title: 'Infrastruktur Tumbuh & Relokasi',
                                            desc: `Sekolah menempati lokasi permanen di JL. Raya Tenjo - Parung Panjang KM 03 dengan lahan ${numberFormatter.format(school.landAreaSquareMeters)} m².`,
                                            icon: Building,
                                            align: 'left', // box on left
                                        },
                                        {
                                            year: '2015',
                                            title: `Pencapaian Akreditasi ${school.accreditation} Penuh`,
                                            desc: `Sekolah meraih akreditasi ${school.accreditation} sebagai bagian dari peningkatan mutu layanan pendidikan.`,
                                            icon: Award,
                                            align: 'right',
                                        },
                                        {
                                            year: '2023 - Kini',
                                            title: 'Era Digital & Kurikulum Merdeka',
                                            desc: 'Pembelajaran dikembangkan melalui Kurikulum Merdeka, projek siswa, dan pemanfaatan layanan digital sekolah.',
                                            icon: BookOpen,
                                            align: 'left',
                                        },
                                    ].map((item, idx) => (
                                        <div
                                            key={item.year}
                                            className={`relative flex flex-col md:flex-row md:items-center ${item.align === 'left' ? 'md:flex-row-reverse' : ''} ${idx !== 0 ? 'md:mt-16' : ''}`}
                                        >
                                            <div className="hidden w-1/2 md:block" />
                                            {/* Advanced Animated Dot */}
                                            <motion.div
                                                initial={{
                                                    scale: 0,
                                                    opacity: 0,
                                                }}
                                                whileInView={{
                                                    scale: 1,
                                                    opacity: 1,
                                                }}
                                                viewport={{
                                                    once: false,
                                                    margin: '-20% 0px -20% 0px',
                                                }}
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 250,
                                                    damping: 15,
                                                }}
                                                className="absolute top-6 left-[11px] z-10 flex size-[22px] flex-shrink-0 -translate-x-1/2 items-center justify-center rounded-full border-[3px] border-[var(--school-green-500)] bg-white shadow-[0_0_0_4px_rgba(255,255,255,1),0_0_20px_var(--school-green-400),0_0_40px_#0EA5E9] md:top-1/2 md:left-1/2 md:-translate-y-1/2"
                                            >
                                                <div className="absolute inset-0 rounded-full bg-[var(--school-green-400)] blur-sm" />
                                                <div className="relative size-2 rounded-full bg-[var(--school-green-700)]" />
                                            </motion.div>

                                            {/* Content Box */}
                                            <div
                                                className={`ml-12 md:w-1/2 md:px-12 ${item.align === 'left' ? 'md:ml-0 md:text-right' : 'md:ml-0'}`}
                                            >
                                                <motion.div
                                                    initial={{
                                                        opacity: 0,
                                                        x:
                                                            item.align ===
                                                            'left'
                                                                ? -80
                                                                : 80,
                                                    }}
                                                    whileInView={{
                                                        opacity: 1,
                                                        x: 0,
                                                    }}
                                                    viewport={{
                                                        once: true,
                                                        margin: '-10% 0px -10% 0px',
                                                    }}
                                                    transition={{
                                                        delay: 0.1,
                                                        type: 'spring',
                                                        stiffness: 100,
                                                        damping: 14,
                                                    }}
                                                    whileHover={{
                                                        scale: 1.02,
                                                        y: -4,
                                                    }}
                                                    className={`group flex flex-col rounded-2xl border border-black/[0.04] bg-white p-7 shadow-lg transition-all hover:border-[var(--school-green-200)] hover:bg-slate-50/50 hover:shadow-[0_25px_50px_-20px_rgba(14,158,228,0.4)] ${item.align === 'left' ? 'md:items-end' : ''}`}
                                                >
                                                    <div
                                                        className={`inline-flex items-center gap-2 rounded-full border border-[var(--school-green-100)] bg-[var(--school-green-50)] px-3 py-1 shadow-inner ${item.align === 'left' ? 'md:flex-row-reverse' : ''}`}
                                                    >
                                                        <div className="flex size-6 items-center justify-center rounded-full bg-white text-[var(--school-green-700)] shadow-sm">
                                                            <item.icon className="size-3.5" />
                                                        </div>
                                                        <span className="text-[0.68rem] font-black tracking-[0.1em] text-[var(--school-green-800)]">
                                                            {item.year}
                                                        </span>
                                                    </div>
                                                    <h4 className="mt-4 text-[1.3rem] leading-tight font-bold text-[var(--school-ink)]">
                                                        {item.title}
                                                    </h4>
                                                    <p
                                                        className={`mt-3 text-sm leading-[1.8] text-[var(--school-muted)] ${item.align === 'left' ? 'md:text-right' : ''}`}
                                                    >
                                                        {item.desc}
                                                    </p>
                                                </motion.div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </BorderGlow>
                    </motion.div>
                </section>

                {/* ═══════════ DATA ANALYTICS ═══════════ */}
                <section className="scroll-mt-24 space-y-8">
                    <SectionHeading
                        eyebrow="Data & Analitik"
                        title="Profil sekolah dalam data terukur."
                        description="Indeks pilar pendidikan dan kapasitas infrastruktur yang diambil langsung dari sistem manajemen sekolah."
                    />
                    <div className="grid gap-6 lg:grid-cols-2">
                        <ProfilPilarRadar />
                        <FasilitasBarChart
                            classrooms={school.physicalClassroomCount}
                            labs={school.laboratoryCount}
                            library={school.libraryCount}
                            rombel={school.teachingGroupCount}
                        />
                    </div>
                </section>

                {/* ═══════════ VISI & MISI ═══════════ */}
                <section id="visi-misi" className="scroll-mt-24 space-y-8">
                    <SectionHeading
                        eyebrow="Visi & Misi"
                        title="Arah dan nilai yang menjadi kompas sekolah."
                        description="Visi dan misi menjadi acuan pembelajaran, budaya sekolah, dan pengembangan siswa."
                    />

                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={motionViewport}
                    >
                        <BorderGlow
                            borderRadius={32}
                            colors={['#0F766E', '#7C3AED', '#D97706']}
                            className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(160deg,rgba(4,47,46,0.97),rgba(15,118,110,0.92)_50%,rgba(13,158,228,0.85))] shadow-[0_38px_90px_-50px_rgba(4,47,46,0.75)]"
                        >
                            <div className="pointer-events-none absolute -top-20 -right-20 size-72 rounded-full bg-white/[0.04] blur-[80px]" />
                            <div className="p-8 text-white md:p-12">
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-4 py-1.5 backdrop-blur-sm">
                                    <Target className="size-3.5 text-[var(--school-gold)]" />
                                    <span className="text-[0.68rem] font-bold tracking-[0.28em] text-[var(--school-gold)] uppercase">
                                        Visi Sekolah
                                    </span>
                                </div>

                                <h3 className="mt-5 max-w-3xl font-heading text-2xl leading-tight md:text-3xl">
                                    Terwujudnya peserta didik yang berprestasi,
                                    berkarakter, berbudaya lingkungan, menguasai
                                    IPTEK, serta mampu bersaing di era global.
                                </h3>

                                <div className="mt-8">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-4 py-1.5 backdrop-blur-sm">
                                        <Compass className="size-3.5 text-[var(--school-gold)]" />
                                        <span className="text-[0.68rem] font-bold tracking-[0.28em] text-[var(--school-gold)] uppercase">
                                            Misi Sekolah
                                        </span>
                                    </div>

                                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                                        {[
                                            {
                                                text: 'Meningkatkan prestasi akademik dan non-akademik melalui pembelajaran yang inovatif dan kompetitif.',
                                                icon: Trophy,
                                            },
                                            {
                                                text: 'Membentuk karakter peserta didik yang beriman, bertakwa, berakhlak mulia, dan berbudi luhur.',
                                                icon: Heart,
                                            },
                                            {
                                                text: 'Menciptakan lingkungan sekolah yang bersih, asri, dan berbudaya lingkungan sesuai program Adiwiyata.',
                                                icon: Sparkles,
                                            },
                                            {
                                                text: 'Menguasai ilmu pengetahuan dan teknologi sebagai bekal menghadapi tantangan era global.',
                                                icon: BookOpen,
                                            },
                                            {
                                                text: 'Mengembangkan potensi dan bakat peserta didik melalui kegiatan ekstrakurikuler yang beragam.',
                                                icon: Star,
                                            },
                                            {
                                                text: 'Membangun kerjasama yang harmonis antara sekolah, orang tua, dan masyarakat.',
                                                icon: Users,
                                            },
                                        ].map((m) => (
                                            <div
                                                key={m.text}
                                                className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm"
                                            >
                                                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.1]">
                                                    <m.icon className="size-4 text-[var(--school-gold)]" />
                                                </div>
                                                <p className="text-sm leading-relaxed text-white/75">
                                                    {m.text}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </BorderGlow>
                    </motion.div>
                </section>

                {/* ═══════════ NILAI INTI (BATARA KRESNA) ═══════════ */}
                {batara ? (
                    <section className="space-y-8">
                        <SectionHeading
                            eyebrow="Nilai Inti"
                            title={batara.label}
                            description={
                                batara.description ??
                                'Pedoman nilai dan karakter SMAN 1 Tenjo.'
                            }
                        />
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="show"
                            viewport={motionViewport}
                            className="grid gap-5 md:grid-cols-2 lg:grid-cols-4"
                        >
                            {[
                                {
                                    title: 'Beriman',
                                    desc: 'Menanamkan keimanan sebagai pondasi utama karakter peserta didik.',
                                    accent: '#0F766E',
                                    icon: Heart,
                                    image: '/images/values/beriman.png',
                                },
                                {
                                    title: 'Bertaqwa',
                                    desc: 'Ketaqwaan diwujudkan dalam amal ibadah dan perilaku sehari-hari.',
                                    accent: '#0369A1',
                                    icon: ShieldCheck,
                                    image: '/images/values/bertaqwa.png',
                                },
                                {
                                    title: 'Berkarakter',
                                    desc: 'Karakter kuat dibentuk melalui pembiasaan positif di lingkungan sekolah.',
                                    accent: '#7C3AED',
                                    icon: Star,
                                    image: '/images/values/berkarakter.png',
                                },
                                {
                                    title: 'Bebas Narkoba',
                                    desc: 'Komitmen penuh terhadap lingkungan sekolah yang bersih dari narkoba.',
                                    accent: '#DC2626',
                                    icon: ShieldCheck,
                                    image: '/images/values/bebas-narkoba.png',
                                },
                            ].map((v) => (
                                <motion.div
                                    key={v.title}
                                    variants={fadeUp}
                                    whileHover={{ y: -6 }}
                                    className="group h-full"
                                >
                                    <BorderGlow
                                        borderRadius={27}
                                        colors={[
                                            v.accent,
                                            '#F59E0B',
                                            '#0E9EE4',
                                        ]}
                                        className="relative h-full overflow-hidden rounded-[1.7rem] border border-white/70 bg-white shadow-[0_22px_70px_-44px_rgba(15,118,110,0.35)] transition-shadow duration-300 hover:shadow-[0_30px_80px_-40px_rgba(15,118,110,0.5)]"
                                    >
                                        <div className="relative h-36 w-full overflow-hidden">
                                            <img
                                                src={v.image}
                                                alt={v.title}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />
                                            <div className="absolute bottom-3 left-4">
                                                <div
                                                    className="flex size-9 items-center justify-center rounded-xl border bg-white/90 shadow-lg backdrop-blur-sm"
                                                    style={{
                                                        borderColor: `${v.accent}30`,
                                                        color: v.accent,
                                                    }}
                                                >
                                                    <v.icon className="size-4" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <h4 className="text-lg font-bold text-[var(--school-ink)]">
                                                {v.title}
                                            </h4>
                                            <p className="mt-2 text-sm leading-relaxed text-[var(--school-muted)]">
                                                {v.desc}
                                            </p>
                                        </div>
                                    </BorderGlow>
                                </motion.div>
                            ))}
                        </motion.div>
                    </section>
                ) : null}

                <section
                    id="halaman-pendukung"
                    className="scroll-mt-24 space-y-8"
                >
                    <SectionHeading
                        eyebrow="Halaman Pendukung"
                        title="Informasi lanjutan tersedia di halaman khusus."
                        description="Halaman profil difokuskan pada sejarah, nilai, fasilitas, prestasi, dan komite sekolah."
                    />

                    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                        <BorderGlow
                            borderRadius={34}
                            colors={['#0F766E', '#0369A1', '#F59E0B']}
                            className="overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_28px_80px_-48px_rgba(15,118,110,0.28)]"
                        >
                            <div className="space-y-6 p-6 md:p-8">
                                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--school-green-200)] bg-[var(--school-green-50)] px-4 py-1.5 text-[0.68rem] font-bold tracking-[0.24em] text-[var(--school-green-700)] uppercase">
                                    <ShieldCheck className="size-4" />
                                    Fokus Profil
                                </div>

                                <div>
                                    <h3 className="max-w-2xl font-heading text-3xl leading-tight text-[var(--school-ink)] md:text-4xl">
                                        Profil sekolah disusun ringkas dan
                                        langsung ke informasi utama.
                                    </h3>
                                    <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--school-muted)] md:text-base">
                                        Detail organisasi, akademik, dan layanan
                                        diarahkan ke halaman masing-masing agar
                                        profil tetap mudah dibaca.
                                    </p>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    {[
                                        'Sejarah dan visi sekolah',
                                        'Nilai BATARA KRESNA',
                                        'Fasilitas dan data utama',
                                        'Prestasi dan komite sekolah',
                                    ].map((item) => (
                                        <div
                                            key={item}
                                            className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 px-4 py-4 text-sm font-semibold text-[var(--school-ink)]"
                                        >
                                            {item}
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
                            {profileShortcuts.map((shortcut) => (
                                <motion.div
                                    key={shortcut.title}
                                    variants={fadeUp}
                                    whileHover={{ y: -4 }}
                                    className="group"
                                >
                                    <Link
                                        href={shortcut.href}
                                        prefetch
                                        className="block rounded-[2rem] border border-white/70 bg-white p-6 shadow-[0_24px_70px_-44px_rgba(15,118,110,0.24)] transition hover:shadow-[0_30px_80px_-44px_rgba(15,118,110,0.34)]"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div
                                                className="flex size-14 items-center justify-center rounded-3xl text-white"
                                                style={{
                                                    background: `linear-gradient(135deg, ${shortcut.accent}, rgba(15,23,42,0.84))`,
                                                }}
                                            >
                                                <shortcut.icon className="size-5" />
                                            </div>
                                            <ChevronRight className="mt-1 size-5 text-[var(--school-muted)] transition group-hover:translate-x-1" />
                                        </div>

                                        <h3 className="mt-5 font-heading text-2xl text-[var(--school-ink)]">
                                            {shortcut.title}
                                        </h3>
                                        <p className="mt-3 text-sm leading-7 text-[var(--school-muted)]">
                                            {shortcut.description}
                                        </p>
                                        <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--school-green-700)]">
                                            Buka halaman
                                            <ChevronRight className="size-4 transition group-hover:translate-x-1" />
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* ═══════════ SARANA PRASARANA ═══════════ */}
                <section
                    id="sarana-prasarana"
                    className="scroll-mt-24 space-y-8"
                >
                    <SectionHeading
                        eyebrow="Sarana Prasarana"
                        title="Fasilitas yang mendukung pembelajaran optimal."
                        description="Data diambil dari profil resmi sekolah dan diperbarui sesuai tahun ajaran aktif."
                    />

                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={motionViewport}
                    >
                        <BorderGlow
                            borderRadius={30}
                            colors={['#0369A1', '#0F766E', '#D97706']}
                            className="overflow-hidden rounded-[1.9rem] border border-white/70 bg-white shadow-[0_28px_80px_-50px_rgba(15,118,110,0.4)]"
                        >
                            <div className="grid lg:grid-cols-[340px_1fr]">
                                <div className="relative hidden overflow-hidden lg:block">
                                    <img
                                        src="/images/profil/sarana.png"
                                        alt="Lab Komputer"
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-l from-white via-white/20 to-transparent" />
                                </div>
                                <div className="p-8 md:p-10">
                                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                        {[
                                            {
                                                label: 'Siswa Aktif',
                                                value: school.studentCount,
                                                icon: Users,
                                                suffix: '',
                                                accent: '#0F766E',
                                            },
                                            {
                                                label: 'Rombel',
                                                value: school.teachingGroupCount,
                                                icon: GraduationCap,
                                                suffix: '',
                                                accent: '#0369A1',
                                            },
                                            {
                                                label: 'Ruang Kelas',
                                                value: school.physicalClassroomCount,
                                                icon: Building,
                                                suffix: '',
                                                accent: '#7C3AED',
                                            },
                                            {
                                                label: 'PTK',
                                                value: school.staffCount,
                                                icon: Users,
                                                suffix: '',
                                                accent: '#D97706',
                                            },
                                            {
                                                label: 'Laboratorium',
                                                value: school.laboratoryCount,
                                                icon: BookOpen,
                                                suffix: '',
                                                accent: '#E11D48',
                                            },
                                            {
                                                label: 'Perpustakaan',
                                                value: school.libraryCount,
                                                icon: Library,
                                                suffix: '',
                                                accent: '#15803D',
                                            },
                                            {
                                                label: 'Lahan',
                                                value: school.landAreaSquareMeters,
                                                icon: MapPinned,
                                                suffix: ' m²',
                                                accent: '#A16207',
                                            },
                                            {
                                                label: 'Kepala Sekolah',
                                                value: 0,
                                                icon: School2,
                                                suffix: '',
                                                accent: '#0F766E',
                                                text:
                                                    school.principalName ?? '-',
                                            },
                                        ].map((stat) => (
                                            <motion.div
                                                key={stat.label}
                                                whileHover={{ y: -4 }}
                                                className="rounded-2xl border border-black/[0.04] bg-[var(--school-green-50)]/50 p-5 transition-all hover:bg-white hover:shadow-md"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[0.6rem] font-bold tracking-[0.22em] text-[var(--school-muted)] uppercase">
                                                        {stat.label}
                                                    </span>
                                                    <stat.icon
                                                        className="size-4"
                                                        style={{
                                                            color: stat.accent,
                                                        }}
                                                    />
                                                </div>
                                                <div className="mt-3 text-2xl font-extrabold text-[var(--school-ink)]">
                                                    {'text' in stat &&
                                                    stat.text ? (
                                                        <span className="text-base font-bold">
                                                            {stat.text}
                                                        </span>
                                                    ) : (
                                                        <>
                                                            <AnimatedCounter
                                                                value={
                                                                    stat.value
                                                                }
                                                            />
                                                            {stat.suffix}
                                                        </>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </BorderGlow>
                    </motion.div>
                </section>

                {/* ═══════════ PRESTASI SEKOLAH ═══════════ */}
                <section id="prestasi" className="scroll-mt-24 space-y-8">
                    <SectionHeading
                        eyebrow="Prestasi"
                        title="Capaian akademik dan non-akademik yang membanggakan."
                        description="Prestasi sekolah dirangkum sebagai catatan capaian akademik dan non-akademik."
                    />

                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={motionViewport}
                    >
                        <BorderGlow
                            borderRadius={30}
                            colors={['#D97706', '#DC2626', '#7C3AED']}
                            className="overflow-hidden rounded-[1.9rem] border border-white/70 bg-white shadow-[0_28px_80px_-50px_rgba(15,118,110,0.4)]"
                        >
                            <div className="grid lg:grid-cols-[1fr_340px]">
                                <div className="p-8 md:p-10">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5">
                                        <Trophy className="size-3.5 text-amber-700" />
                                        <span className="text-[0.65rem] font-bold tracking-[0.22em] text-amber-700 uppercase">
                                            Daftar Prestasi
                                        </span>
                                    </div>

                                    <div className="mt-6 space-y-3">
                                        {[
                                            {
                                                title: 'Piala Gubernur Pelajar Juara 2022',
                                                category: 'Multi-Lomba',
                                                desc: 'Paskibra, Modern Dance, Tari Tradisional, News Anchor, Creative Make-up',
                                                accent: '#DC2626',
                                            },
                                            {
                                                title: 'Lomba OSIS Juara',
                                                category: 'Organisasi',
                                                desc: 'Piala Gubernur Pelajar Juara 2022 – Kategori OSIS terbaik',
                                                accent: '#0369A1',
                                            },
                                            {
                                                title: 'Sekolah Adiwiyata',
                                                category: 'Lingkungan',
                                                desc: 'Penghargaan sekolah berbudaya lingkungan dan kader ramah lingkungan',
                                                accent: '#15803D',
                                            },
                                            {
                                                title: 'P5 Panen Karya',
                                                category: 'Akademik',
                                                desc: 'Dokumentasi karya proyek P5 dalam Gebyar Pemilos',
                                                accent: '#7C3AED',
                                            },
                                            {
                                                title: 'Freestyle Bola',
                                                category: 'Olahraga',
                                                desc: 'Piala Gubernur Pelajar Juara 2022 – Kategori Freestyle Bola',
                                                accent: '#D97706',
                                            },
                                        ].map((p) => (
                                            <motion.div
                                                key={p.title}
                                                whileHover={{ x: 4 }}
                                                className="group flex items-start gap-4 rounded-2xl border border-black/[0.04] bg-white/60 p-5 transition-all hover:bg-white hover:shadow-md"
                                            >
                                                <div
                                                    className="flex size-10 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
                                                    style={{
                                                        background: `linear-gradient(135deg, ${p.accent}, ${p.accent}cc)`,
                                                    }}
                                                >
                                                    <Trophy className="size-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h5 className="text-sm font-bold text-[var(--school-ink)]">
                                                            {p.title}
                                                        </h5>
                                                        <span
                                                            className="rounded-full px-2.5 py-0.5 text-[0.55rem] font-bold tracking-[0.15em] text-white uppercase"
                                                            style={{
                                                                backgroundColor:
                                                                    p.accent,
                                                            }}
                                                        >
                                                            {p.category}
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 text-xs leading-relaxed text-[var(--school-muted)]">
                                                        {p.desc}
                                                    </p>
                                                </div>
                                                <ChevronRight className="mt-1 size-4 shrink-0 text-[var(--school-muted)] opacity-0 transition group-hover:opacity-100" />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Side image */}
                                <div className="relative hidden overflow-hidden lg:block">
                                    <img
                                        src="/images/profil/prestasi.png"
                                        alt="Lemari Piala"
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent" />
                                </div>
                            </div>
                        </BorderGlow>
                    </motion.div>
                </section>

                {/* ═══════════ KOMITE SEKOLAH ═══════════ */}
                <section id="komite" className="scroll-mt-24 space-y-8">
                    <SectionHeading
                        eyebrow="Komite Sekolah"
                        title="Peran masyarakat dalam mendukung pendidikan."
                        description="Komite sekolah menjadi jembatan antara sekolah, orang tua, dan komunitas untuk peningkatan mutu berkelanjutan."
                    />

                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={motionViewport}
                    >
                        <BorderGlow
                            borderRadius={30}
                            colors={['#0F766E', '#D97706', '#7C3AED']}
                            className="overflow-hidden rounded-[1.9rem] border border-white/70 bg-white shadow-[0_28px_80px_-50px_rgba(15,118,110,0.4)]"
                        >
                            <div className="p-8 md:p-10">
                                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                                    {[
                                        {
                                            title: 'Pengawasan',
                                            desc: 'Mengawasi pelaksanaan kebijakan dan program pendidikan.',
                                            icon: ShieldCheck,
                                            accent: '#0F766E',
                                        },
                                        {
                                            title: 'Penasehat',
                                            desc: 'Memberi masukan strategis untuk peningkatan mutu sekolah.',
                                            icon: BookOpen,
                                            accent: '#0369A1',
                                        },
                                        {
                                            title: 'Mediasi',
                                            desc: 'Menjembatani komunikasi antara sekolah dan orang tua siswa.',
                                            icon: Users,
                                            accent: '#7C3AED',
                                        },
                                        {
                                            title: 'Dukungan',
                                            desc: 'Mendukung pembiayaan, sarana, dan kegiatan sekolah.',
                                            icon: Heart,
                                            accent: '#D97706',
                                        },
                                    ].map((role) => (
                                        <motion.div
                                            key={role.title}
                                            whileHover={{ y: -4 }}
                                            className="group rounded-2xl border border-black/[0.04] bg-[var(--school-green-50)]/50 p-6 text-center transition-all hover:bg-white hover:shadow-md"
                                        >
                                            <div
                                                className="mx-auto flex size-14 items-center justify-center rounded-2xl text-white shadow-lg"
                                                style={{
                                                    background: `linear-gradient(135deg, ${role.accent}, ${role.accent}cc)`,
                                                }}
                                            >
                                                <role.icon className="size-6" />
                                            </div>
                                            <h5 className="mt-4 text-base font-bold text-[var(--school-ink)]">
                                                {role.title}
                                            </h5>
                                            <p className="mt-2 text-sm leading-relaxed text-[var(--school-muted)]">
                                                {role.desc}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </BorderGlow>
                    </motion.div>
                </section>

                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <BorderGlow
                        borderRadius={36}
                        colors={['#0F766E', '#0369A1', '#F59E0B']}
                        className="overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_28px_84px_-52px_rgba(15,118,110,0.28)]"
                    >
                        <div className="grid gap-6 p-6 md:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--school-green-200)] bg-[var(--school-green-50)] px-4 py-1.5 text-[0.68rem] font-bold tracking-[0.24em] text-[var(--school-green-700)] uppercase">
                                    <MapPinned className="size-4" />
                                    Kontak & Layanan
                                </div>
                                <h2 className="mt-4 max-w-3xl font-heading text-3xl text-[var(--school-ink)] md:text-4xl">
                                    Kontak resmi tersedia di halaman layanan.
                                </h2>
                                <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--school-muted)] md:text-base">
                                    Alamat, email, telepon, dan bantuan
                                    administratif dipusatkan agar mudah
                                    ditemukan.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href={layanan()}
                                    prefetch
                                    className="inline-flex items-center justify-center rounded-full bg-[var(--school-green-700)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--school-green-600)]"
                                >
                                    Buka Layanan
                                </Link>
                                <Link
                                    href={organization()}
                                    prefetch
                                    className="inline-flex items-center justify-center rounded-full border border-[var(--school-green-200)] px-6 py-3 text-sm font-semibold text-[var(--school-green-700)] transition hover:bg-[var(--school-green-50)]"
                                >
                                    Lihat Struktur
                                </Link>
                            </div>
                        </div>
                    </BorderGlow>
                </div>
            </div>
        </>
    );
}
