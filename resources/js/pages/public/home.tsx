import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowLeftRight,
    ArrowRight,
    Award,
    BookOpen,
    CalendarDays,
    ChefHat,
    Compass,
    FlaskConical,
    GraduationCap,
    Heart,
    Landmark,
    Leaf,
    Map,
    MapPinned,
    Newspaper,
    Quote,
    Radar,
    ShieldCheck,
    Sparkles,
    Trophy,
    Users,
    Wrench,
} from 'lucide-react';
import { ppdb as ppdbRoute } from '@/actions/App/Http/Controllers/PublicSiteController';
import { SparklineChart } from '@/components/charts/school-charts';
import { AnimatedCounter } from '@/components/public/animated-counter';
import { BorderGlow } from '@/components/public/border-glow';
import { HeroCarousel } from '@/components/public/hero-carousel';
import { PartnerLogoLoopSection } from '@/components/public/partner-logo-loop-section';
import { SectionHeading } from '@/components/public/section-heading';
import { VisiPillarShowcase } from '@/components/public/visi-pillar-showcase';
import { Button } from '@/components/ui/button';
import { fadeUp, motionViewport, staggerContainer } from '@/lib/motion';
import { signaturePrograms } from '@/lib/public-content';
import { cn } from '@/lib/utils';
import type {
    AlumniSpotlight,
    FeaturedArticle,
    FeaturedWork,
    PpdbPayload,
    SchoolProfilePayload,
} from '@/types';

type HomePageProps = {
    school: SchoolProfilePayload;
    ppdb: PpdbPayload;
    featuredWorks: FeaturedWork[];
    featuredArticles: FeaturedArticle[];
    alumniSpotlight: AlumniSpotlight[];
};

const numberFormatter = new Intl.NumberFormat('id-ID');
const dateFormatter = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' });

export default function HomePage({
    school,
    ppdb,
    featuredWorks,
    featuredArticles,
    alumniSpotlight,
}: HomePageProps) {
    const batara = school.valueStatements.find(
        (statement) => statement.key === 'batara_kresna',
    );

    return (
        <>
            <Head title="SMAN 1 Tenjo — Portal Digital Sekolah">
                <meta
                    name="description"
                    content="Website resmi SMAN 1 Tenjo Kabupaten Bogor. Informasi profil sekolah, akademik, PPDB, dokumentasi, dan layanan publik."
                />
                <meta
                    property="og:title"
                    content="SMAN 1 Tenjo — Portal Digital Sekolah"
                />
                <meta
                    property="og:description"
                    content="Informasi resmi SMAN 1 Tenjo: profil sekolah, PPDB, akademik, dokumentasi, dan layanan."
                />
                <meta property="og:type" content="website" />
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=plus-jakarta-sans:400,500,700,800|space-grotesk:500,700"
                    rel="stylesheet"
                />
            </Head>

            <div className="space-y-8 md:space-y-10">
                <HeroCarousel />
                <PartnerLogoLoopSection />

                <motion.section
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={motionViewport}
                    className="flex snap-x snap-mandatory overflow-x-auto gap-5 pb-4 md:grid md:grid-cols-4 md:overflow-visible"
                >
                    {[
                        {
                            label: 'Siswa Aktif',
                            value: school.studentCount,
                            icon: Users,
                            delay: 0.1,
                            sparkData: [
                                380,
                                420,
                                460,
                                510,
                                540,
                                580,
                                school.studentCount,
                            ],
                            sparkColor: '#0d9488',
                        },
                        {
                            label: 'Rombel',
                            value: school.teachingGroupCount,
                            icon: GraduationCap,
                            delay: 0.2,
                            sparkData: [
                                14,
                                16,
                                18,
                                20,
                                22,
                                24,
                                school.teachingGroupCount,
                            ],
                            sparkColor: '#8b5cf6',
                        },
                        {
                            label: 'Ruang Fisik',
                            value: school.physicalClassroomCount,
                            icon: Landmark,
                            delay: 0.3,
                            sparkData: [
                                8,
                                10,
                                12,
                                14,
                                16,
                                18,
                                school.physicalClassroomCount,
                            ],
                            sparkColor: '#0ea5e9',
                        },
                        {
                            label: 'PTK',
                            value: school.staffCount,
                            icon: ShieldCheck,
                            delay: 0.4,
                            sparkData: [
                                28,
                                32,
                                36,
                                40,
                                44,
                                48,
                                school.staffCount,
                            ],
                            sparkColor: '#f59e0b',
                        },
                    ].map((stat) => (
                        <motion.div
                            key={stat.label}
                            variants={fadeUp}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="h-full w-[85vw] shrink-0 snap-center md:w-auto"
                        >
                            <BorderGlow
                                borderRadius={32}
                                className="group relative h-full overflow-hidden rounded-4xl border border-white/60 bg-[rgba(255,255,255,0.7)] p-6 shadow-[0_20px_40px_-20px_rgba(4,47,46,0.15)] backdrop-blur-xl transition-all duration-300 hover:border-white/90 hover:bg-white hover:shadow-[0_30px_60px_-24px_rgba(15,118,110,0.3)]"
                            >
                                <div className="absolute -top-4 -right-4 size-24 rounded-full bg-(--school-green-100) opacity-40 blur-2xl transition duration-500 group-hover:bg-[#0E9EE4] group-hover:opacity-30" />
                                <div className="relative flex items-center justify-between">
                                    <div className="text-[0.7rem] font-bold tracking-[0.25em] text-(--school-muted) uppercase transition-colors group-hover:text-(--school-ink)">
                                        {stat.label}
                                    </div>
                                    <div className="rounded-full bg-(--school-green-50) p-2.5 text-(--school-green-700) transition-colors group-hover:bg-(--school-green-100)">
                                        <stat.icon className="size-5" />
                                    </div>
                                </div>
                                <div className="relative mt-5 text-4xl font-extrabold tracking-tight text-(--school-ink) lg:text-5xl">
                                    <AnimatedCounter
                                        value={stat.value}
                                        delay={stat.delay}
                                    />
                                </div>
                                <div className="mt-3">
                                    <SparklineChart
                                        data={stat.sparkData}
                                        color={stat.sparkColor}
                                        height={36}
                                    />
                                </div>
                            </BorderGlow>
                        </motion.div>
                    ))}
                </motion.section>

                {/* ═══════════ SAMBUTAN KEPALA SEKOLAH ═══════════ */}
                <section>
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={motionViewport}
                    >
                        <BorderGlow
                            borderRadius={32}
                            colors={['#0F766E', '#D97706', '#0E9EE4']}
                            className="relative overflow-hidden rounded-4xl border border-white/70 bg-white shadow-[0_32px_90px_-50px_rgba(15,118,110,0.35)]"
                        >
                            <div className="grid lg:grid-cols-[340px_1fr]">
                                {/* Portrait Side */}
                                <div className="relative hidden lg:block">
                                    <img
                                        src="/images/principal-portrait.png"
                                        alt={`${school.principalName ?? 'Kepala Sekolah'} — Kepala SMA Negeri 1 Tenjo`}
                                        className="h-full w-full object-cover object-top"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-r from-[rgba(4,47,46,0.18)] via-transparent to-white/16" />
                                    <div className="absolute inset-0 bg-linear-to-t from-[rgba(4,47,46,0.92)] via-[rgba(4,47,46,0.16)] to-transparent" />
                                    {/* Name overlay on image */}
                                    <div className="absolute right-6 bottom-6 left-6">
                                        <div className="rounded-2xl border border-white/18 bg-[linear-gradient(180deg,rgba(4,47,46,0.82),rgba(4,47,46,0.68))] px-5 py-4 shadow-[0_22px_44px_-26px_rgba(4,47,46,0.85)] backdrop-blur-md">
                                            <div className="text-[0.62rem] font-bold tracking-[0.3em] text-(--school-gold-400) uppercase">
                                                Kepala Sekolah
                                            </div>
                                            <div className="mt-1 text-lg font-bold text-white">
                                                {school.principalName ??
                                                    'Titin Sriwartini'}
                                            </div>
                                            <div className="mt-0.5 text-[0.72rem] text-white/60">
                                                SMA Negeri 1 Tenjo
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Side */}
                                <div className="relative p-8 lg:p-10">
                                    {/* Decorative quote */}
                                    <Quote className="absolute top-8 right-8 size-20 text-(--school-green-100) opacity-40 lg:top-10 lg:right-10" />

                                    {/* Mobile portrait */}
                                    <div className="mb-6 flex items-center gap-4 rounded-[1.6rem] border border-(--school-green-100) bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(239,248,246,0.92))] p-3.5 shadow-[0_20px_46px_-30px_rgba(15,118,110,0.32)] lg:hidden">
                                        <img
                                            src="/images/principal-portrait.png"
                                            alt={
                                                school.principalName ??
                                                'Kepala Sekolah'
                                            }
                                            className="size-20 rounded-[1.25rem] border border-white/70 object-cover object-top shadow-[0_16px_28px_-18px_rgba(4,47,46,0.35)]"
                                        />
                                        <div>
                                            <div className="text-[0.62rem] font-bold tracking-[0.28em] text-(--school-green-700) uppercase">
                                                Kepala Sekolah
                                            </div>
                                            <div className="text-lg font-bold text-(--school-ink)">
                                                {school.principalName ??
                                                    'Titin Sriwartini'}
                                            </div>
                                            <div className="text-xs text-(--school-muted)">
                                                SMA Negeri 1 Tenjo
                                            </div>
                                        </div>
                                    </div>

                                    <div className="inline-flex items-center gap-2 rounded-full border border-(--school-green-100) bg-(--school-green-50) px-4 py-1.5">
                                        <Sparkles className="size-3.5 text-(--school-green-700)" />
                                        <span className="text-[0.68rem] font-bold tracking-[0.28em] text-(--school-green-700) uppercase">
                                            Sambutan Kepala Sekolah
                                        </span>
                                    </div>

                                    <div className="relative mt-6 space-y-4">
                                        <p className="text-sm leading-7 font-semibold text-(--school-ink) italic">
                                            Assalamu'alaikum warahmatullahi
                                            wabarakatuh,
                                        </p>
                                        <p className="text-sm leading-7 text-(--school-muted)">
                                            Selamat datang di website resmi{' '}
                                            <strong className="text-(--school-ink)">
                                                SMA Negeri 1 Tenjo
                                            </strong>
                                            . Website ini kami hadirkan sebagai
                                            sarana informasi, komunikasi, dan
                                            publikasi berbagai kegiatan serta
                                            prestasi sekolah kepada seluruh
                                            masyarakat.
                                        </p>
                                        <p className="text-sm leading-7 text-(--school-muted)">
                                            Sebagai lembaga pendidikan, kami
                                            berkomitmen untuk menciptakan
                                            lingkungan belajar yang kondusif,
                                            inovatif, dan berkarakter. Kami
                                            terus berupaya meningkatkan kualitas
                                            pendidikan, baik dalam bidang
                                            akademik maupun non-akademik, agar
                                            peserta didik mampu bersaing di era
                                            global tanpa meninggalkan
                                            nilai-nilai akhlak dan budaya
                                            bangsa.
                                        </p>
                                        <p className="text-sm leading-7 text-(--school-muted)">
                                            Terima kasih atas kepercayaan dan
                                            dukungan yang diberikan kepada SMA
                                            Negeri 1 Tenjo. Semoga layanan
                                            informasi ini bermanfaat bagi siswa,
                                            orang tua, alumni, dan masyarakat.
                                        </p>
                                        <p className="text-sm leading-7 font-semibold text-(--school-ink) italic">
                                            Wassalamu'alaikum warahmatullahi
                                            wabarakatuh.
                                        </p>
                                    </div>

                                    {/* Signature area - desktop */}
                                    <div className="mt-8 hidden items-center gap-4 border-t border-black/4 pt-6 lg:flex">
                                        <div className="flex size-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--school-green-600),var(--school-green-700))] text-white shadow-[0_8px_20px_-6px_rgba(15,118,110,0.4)]">
                                            <GraduationCap className="size-5" />
                                        </div>
                                        <div>
                                            <div className="text-base font-bold text-(--school-ink)">
                                                {school.principalName ??
                                                    'Titin Sriwartini'}
                                            </div>
                                            <div className="text-xs text-(--school-muted)">
                                                Kepala SMA Negeri 1 Tenjo
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </BorderGlow>
                    </motion.div>
                </section>

                <section className="space-y-8">
                    <SectionHeading
                        eyebrow="Arah & Nilai"
                        title="Nilai sekolah menjadi dasar program dan kegiatan."
                        description="Karakter, karya, dan komunitas disusun sebagai arah pembinaan siswa."
                    />

                    <div className="grid grid-cols-1 gap-5 md:auto-rows-[minmax(13rem,auto)] md:grid-cols-12">
                        {/* ═══════ HERO TILE: Nilai Inti ═══════ */}
                        <motion.div
                            initial="hidden"
                            whileInView="show"
                            viewport={motionViewport}
                            variants={fadeUp}
                            className="group col-span-1 md:col-span-7 md:row-span-2"
                        >
                            <BorderGlow
                                borderRadius={32}
                                className="relative flex h-full flex-col overflow-hidden rounded-4xl border border-white/70 bg-[linear-gradient(160deg,rgba(4,47,46,0.97),rgba(15,118,110,0.93)_42%,rgba(13,158,228,0.88))] p-8 text-white shadow-[0_38px_90px_-50px_rgba(4,47,46,0.8)] md:p-10"
                            >
                                {/* Ambient light orbs */}
                                <div className="pointer-events-none absolute -top-20 -right-20 size-112 rounded-full bg-white/4 blur-[100px] transition-transform duration-[1.2s] group-hover:-translate-x-16 group-hover:translate-y-8" />
                                <div className="pointer-events-none absolute -bottom-32 -left-20 size-72 rounded-full bg-[rgba(243,168,29,0.12)] blur-[80px] transition-all duration-[1.4s] group-hover:opacity-30" />
                                {/* Subtle grid pattern overlay */}
                                <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-60" />

                                {/* Header */}
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 backdrop-blur-sm">
                                            <Heart className="size-5 text-(--school-gold-400)" />
                                        </div>
                                        <div className="inline-flex rounded-full border border-white/20 bg-white/8 px-4 py-1.5 text-[0.72rem] font-bold tracking-[0.28em] text-(--school-gold-400) uppercase backdrop-blur-sm">
                                            Nilai Inti
                                        </div>
                                    </div>
                                    <h2 className="mt-5 font-heading text-3xl leading-[1.1] md:text-4xl lg:text-5xl">
                                        {batara?.label}
                                    </h2>
                                    <p className="mt-3 max-w-xl text-sm leading-7 text-white/65 md:text-base">
                                        {batara?.description ??
                                            'Nilai ini menjadi jangkar sikap, karakter, dan orientasi publik SMAN 1 Tenjo.'}
                                    </p>
                                </div>

                                {/* ═══ Value Cards Grid ═══ */}
                                <div className="relative z-10 mt-7 grid grid-cols-2 gap-3 md:gap-4">
                                    {[
                                        {
                                            name: 'Beriman',
                                            image: '/images/values/beriman.png',
                                            description:
                                                'Menanamkan keyakinan kepada Tuhan Yang Maha Esa sebagai fondasi utama dalam setiap sikap, keputusan, dan aktivitas belajar.',
                                        },
                                        {
                                            name: 'Bertaqwa',
                                            image: '/images/values/bertaqwa.png',
                                            description:
                                                'Mengamalkan nilai-nilai ibadah dan ketaatan dalam kehidupan sehari-hari, baik di lingkungan sekolah maupun masyarakat.',
                                        },
                                        {
                                            name: 'Berkarakter',
                                            image: '/images/values/berkarakter.png',
                                            description:
                                                'Membentuk pribadi yang berintegritas, bertanggung jawab, dan memiliki akhlak mulia sebagai bekal kehidupan.',
                                        },
                                        {
                                            name: 'Bebas Narkoba',
                                            image: '/images/values/bebas-narkoba.png',
                                            description:
                                                'Komitmen penuh terhadap lingkungan sekolah yang bersih dari pengaruh narkoba dan zat berbahaya.',
                                        },
                                    ].map((value, i) => (
                                        <motion.div
                                            key={value.name}
                                            initial={{
                                                opacity: 0,
                                                y: 16,
                                                scale: 0.96,
                                            }}
                                            whileInView={{
                                                opacity: 1,
                                                y: 0,
                                                scale: 1,
                                            }}
                                            viewport={{ once: true }}
                                            transition={{
                                                delay: 0.25 + i * 0.12,
                                                duration: 0.6,
                                                ease: [0.22, 1, 0.36, 1],
                                            }}
                                            className="group/card relative overflow-hidden rounded-2xl border border-white/12 bg-white/6 backdrop-blur-md transition-all duration-300 hover:border-white/25 hover:bg-white/12 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.3)]"
                                        >
                                            {/* Image */}
                                            <div className="relative mx-auto flex items-center justify-center overflow-hidden pt-3 md:pt-4">
                                                <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-transparent to-white/4" />
                                                <img
                                                    src={value.image}
                                                    alt={value.name}
                                                    className="size-20 object-contain drop-shadow-[0_4px_20px_rgba(245,158,11,0.25)] transition-transform duration-500 group-hover/card:scale-110 md:size-24"
                                                    loading="lazy"
                                                />
                                            </div>

                                            {/* Text */}
                                            <div className="relative z-10 px-3 pt-2 pb-3 md:px-4 md:pt-3 md:pb-4">
                                                <h4 className="text-sm font-bold tracking-wide text-white md:text-base">
                                                    {value.name}
                                                </h4>
                                                <p className="mt-1 text-[0.7rem] leading-[1.6] text-white/55 transition-colors group-hover/card:text-white/75 md:text-xs md:leading-relaxed">
                                                    {value.description}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Bottom decorative line */}
                                <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
                            </BorderGlow>
                        </motion.div>

                        {/* ═══════ PROGRAM TILES ═══════ */}
                        {signaturePrograms.map((program, index) => {
                            const iconMap: Record<string, typeof ShieldCheck> =
                                {
                                    'shield-check': ShieldCheck,
                                    'book-open': BookOpen,
                                    'chef-hat': ChefHat,
                                    users: Users,
                                };
                            const Icon = iconMap[program.icon] ?? Sparkles;

                            const spanClasses = cn(
                                'col-span-1',
                                index < 2 ? 'md:col-span-5' : 'md:col-span-6',
                            );

                            return (
                                <motion.article
                                    key={program.title}
                                    variants={fadeUp}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={motionViewport}
                                    whileHover={{ y: -6 }}
                                    className={cn('group', spanClasses)}
                                >
                                    <BorderGlow
                                        borderRadius={32}
                                        colors={[
                                            program.accentColor,
                                            '#F59E0B',
                                            '#0E9EE4',
                                        ]}
                                        className="relative flex h-full flex-col overflow-hidden rounded-4xl border border-white/60 bg-[rgba(255,255,255,0.72)] p-6 shadow-[0_20px_60px_-20px_rgba(4,47,46,0.1)] backdrop-blur-xl transition-all duration-300 hover:border-white/90 hover:bg-white/95 hover:shadow-[0_32px_80px_-24px_rgba(4,47,46,0.18)]"
                                    >
                                        {/* Accent orb */}
                                        <div
                                            className="pointer-events-none absolute -right-12 -bottom-12 size-44 rounded-full opacity-[0.08] blur-[60px] transition-all duration-700 group-hover:scale-125 group-hover:opacity-[0.18]"
                                            style={{
                                                backgroundColor:
                                                    program.accentColor,
                                            }}
                                        />

                                        {/* Header: Icon + Eyebrow */}
                                        <div className="relative z-10 flex items-center gap-3">
                                            <div
                                                className="flex size-9 items-center justify-center rounded-xl border transition-colors duration-300"
                                                style={{
                                                    borderColor: `${program.accentColor}25`,
                                                    backgroundColor: `${program.accentColor}0A`,
                                                    color: program.accentColor,
                                                }}
                                            >
                                                <Icon className="size-[1.1rem]" />
                                            </div>
                                            <div
                                                className="text-[0.68rem] font-bold tracking-[0.28em] uppercase transition-colors duration-300"
                                                style={{
                                                    color: program.accentColor,
                                                }}
                                            >
                                                {program.eyebrow}
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h3 className="relative z-10 mt-4 text-xl leading-tight font-semibold text-(--school-ink) md:text-2xl">
                                            {program.title}
                                        </h3>

                                        {/* Description — shows longDescription on wider tiles */}
                                        <p className="relative z-10 mt-3 flex-1 text-[0.84rem] leading-7 text-(--school-muted) transition-colors group-hover:text-(--school-ink)/80">
                                            {index >= 2
                                                ? program.longDescription
                                                : program.description}
                                        </p>

                                        {/* Stats row */}
                                        <div className="relative z-10 mt-5 flex gap-6 border-t border-black/4 pt-4">
                                            {program.stats.map((stat) => (
                                                <div key={stat.label}>
                                                    <div className="text-xl font-bold tracking-tight text-(--school-ink)">
                                                        {stat.value}
                                                    </div>
                                                    <div className="mt-0.5 text-[0.68rem] font-medium tracking-[0.18em] text-(--school-muted) uppercase">
                                                        {stat.label}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Tags */}
                                        <div className="relative z-10 mt-4 flex flex-wrap gap-1.5">
                                            {program.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="rounded-full px-2.5 py-1 text-[0.64rem] font-semibold tracking-[0.14em] uppercase transition-colors duration-300"
                                                    style={{
                                                        backgroundColor: `${program.accentColor}0C`,
                                                        color: `${program.accentColor}CC`,
                                                        border: `1px solid ${program.accentColor}18`,
                                                    }}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </BorderGlow>
                                </motion.article>
                            );
                        })}
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════════
                    VISI & MISI SECTION
                ═══════════════════════════════════════════════════════════════ */}
                <section className="space-y-8">
                    <SectionHeading
                        eyebrow="Visi & Misi"
                        title="Arah besar dan langkah konkret menuju sekolah unggul."
                        description="Visi dan misi menjadi acuan kerja sekolah dalam pembelajaran, karakter, lingkungan, dan pengembangan siswa."
                    />

                    <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
                        {/* ═══ VISI CARD ═══ */}
                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="show"
                            viewport={motionViewport}
                            className="group h-full"
                        >
                            <BorderGlow
                                borderRadius={32}
                                className="relative flex h-full flex-col overflow-hidden rounded-4xl border border-white/70 bg-[linear-gradient(165deg,rgba(4,47,46,0.97),rgba(15,118,110,0.92)_50%,rgba(13,158,228,0.85))] text-white shadow-[0_38px_90px_-50px_rgba(4,47,46,0.75)]"
                            >
                                {/* Hero Image */}
                                <div className="relative h-52 w-full shrink-0 overflow-hidden md:h-64">
                                    <img
                                        src="/images/values/visi-hero.png"
                                        alt="Visi SMAN 1 Tenjo"
                                        className="h-full w-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-b from-[rgba(4,47,46,0.4)] via-transparent to-[rgba(4,47,46,0.95)]" />
                                    {/* Floating VISI badge */}
                                    <div className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full border border-white/22 bg-black/20 px-4 py-2 shadow-[0_12px_28px_-18px_rgba(4,47,46,0.6)] backdrop-blur-md sm:top-6 sm:left-6">
                                        <Trophy className="size-3.5 text-(--school-gold-400)" />
                                        <span className="text-[0.68rem] font-bold tracking-[0.28em] text-white/92 uppercase">
                                            Visi Sekolah
                                        </span>
                                    </div>
                                </div>

                                {/* Visi Content */}
                                <div className="relative z-10 flex flex-1 flex-col justify-between p-8 md:p-10">
                                    {/* Ambient glow */}
                                    <div className="pointer-events-none absolute -top-16 -right-16 size-72 rounded-full bg-[rgba(243,168,29,0.1)] blur-[100px]" />

                                    <div>
                                        <blockquote className="relative">
                                            <div className="absolute -top-2 -left-3 font-heading text-5xl leading-none text-white/15">
                                                "
                                            </div>
                                            <p className="relative z-10 font-heading text-xl leading-normal md:text-2xl lg:text-[1.7rem]">
                                                Terwujudnya sekolah yang unggul
                                                dalam prestasi, berkarakter,
                                                berbudaya lingkungan, menguasai
                                                IPTEK, dan berdaya saing.
                                            </p>
                                            <div className="absolute right-0 -bottom-4 font-heading text-5xl leading-none text-white/15">
                                                "
                                            </div>
                                        </blockquote>
                                    </div>

                                    {/* Interactive Pillar Showcase */}
                                    <div className="mt-6">
                                        <VisiPillarShowcase />
                                    </div>

                                    {/* Bottom line */}
                                    <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />
                                </div>
                            </BorderGlow>
                        </motion.div>

                        {/* ═══ MISI CARDS ═══ */}
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="show"
                            viewport={motionViewport}
                            className="flex flex-col gap-4"
                        >
                            {/* Misi header */}
                            <div className="flex items-center gap-3 px-1">
                                <div className="flex size-9 items-center justify-center rounded-xl border border-(--school-green-200) bg-(--school-green-50) text-(--school-green-700)">
                                    <Compass className="size-4" />
                                </div>
                                <div>
                                    <div className="text-[0.68rem] font-bold tracking-[0.28em] text-(--school-green-700) uppercase">
                                        Misi Sekolah
                                    </div>
                                    <div className="text-xs text-(--school-muted)">
                                        5 langkah strategis
                                    </div>
                                </div>
                            </div>

                            {[
                                {
                                    num: '01',
                                    title: 'Pembelajaran Efektif',
                                    description:
                                        'Melaksanakan pembelajaran yang efektif dengan menggunakan kurikulum nasional.',
                                    icon: BookOpen,
                                    accent: '#0F766E',
                                },
                                {
                                    num: '02',
                                    title: 'Administrasi Pembelajaran',
                                    description:
                                        'Memfasilitasi pendidikan dalam meningkatkan instrumen-instrumen administrasi pembelajaran.',
                                    icon: GraduationCap,
                                    accent: '#0369A1',
                                },
                                {
                                    num: '03',
                                    title: 'Sekolah Bersih & Sehat',
                                    description:
                                        'Menciptakan sekolah yang bersih dan sehat sebagai fondasi lingkungan belajar yang kondusif.',
                                    icon: Leaf,
                                    accent: '#15803D',
                                },
                                {
                                    num: '04',
                                    title: 'Ekstrakurikuler Unggulan',
                                    description:
                                        'Meningkatkan kegiatan ekstrakurikuler sebagai wadah pengembangan bakat dan karakter siswa.',
                                    icon: Award,
                                    accent: '#7C3AED',
                                },
                                {
                                    num: '05',
                                    title: 'Sarana Prasarana',
                                    description:
                                        'Melengkapi sarana prasarana yang menunjang sistem pembelajaran agar lebih optimal dan modern.',
                                    icon: Wrench,
                                    accent: '#D97706',
                                },
                            ].map((misi) => (
                                <motion.div
                                    key={misi.num}
                                    variants={fadeUp}
                                    whileHover={{ x: 6 }}
                                    className="group/misi"
                                >
                                    <BorderGlow
                                        borderRadius={24}
                                        colors={[
                                            misi.accent,
                                            '#F59E0B',
                                            '#0E9EE4',
                                        ]}
                                        className="relative flex items-start gap-4 overflow-hidden rounded-3xl border border-white/60 bg-[rgba(255,255,255,0.72)] p-5 shadow-[0_16px_48px_-20px_rgba(4,47,46,0.1)] backdrop-blur-xl transition-all duration-300 hover:border-white/90 hover:bg-white/95 hover:shadow-[0_24px_64px_-20px_rgba(4,47,46,0.16)]"
                                    >
                                        {/* Accent orb */}
                                        <div
                                            className="pointer-events-none absolute -right-8 -bottom-8 size-32 rounded-full opacity-[0.06] blur-[50px] transition-all duration-700 group-hover/misi:scale-150 group-hover/misi:opacity-[0.15]"
                                            style={{
                                                backgroundColor: misi.accent,
                                            }}
                                        />

                                        {/* Number + Icon */}
                                        <div className="relative shrink-0">
                                            <div
                                                className="flex size-12 items-center justify-center rounded-2xl border transition-all duration-300 group-hover/misi:shadow-lg"
                                                style={{
                                                    borderColor: `${misi.accent}20`,
                                                    backgroundColor: `${misi.accent}08`,
                                                    color: misi.accent,
                                                }}
                                            >
                                                <misi.icon className="size-5" />
                                            </div>
                                            <div
                                                className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-md text-[0.58rem] font-extrabold text-white"
                                                style={{
                                                    backgroundColor:
                                                        misi.accent,
                                                }}
                                            >
                                                {misi.num}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="relative z-10 min-w-0 flex-1">
                                            <h4 className="text-base font-semibold text-(--school-ink) md:text-lg">
                                                {misi.title}
                                            </h4>
                                            <p className="mt-1.5 text-[0.82rem] leading-relaxed text-(--school-muted) transition-colors group-hover/misi:text-(--school-ink)/75">
                                                {misi.description}
                                            </p>
                                        </div>
                                    </BorderGlow>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                <section className="space-y-8">
                    <SectionHeading
                        eyebrow="Fakta Sekolah"
                        title="Data sekolah ditampilkan secara ringkas."
                        description="Informasi operasional utama membantu pengunjung memahami kapasitas dan fasilitas sekolah."
                    />

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={motionViewport}
                        className="grid gap-5 lg:grid-cols-3"
                    >
                        {/* ─── Card 1: Lahan Sekolah ─── */}
                        <motion.article
                            variants={fadeUp}
                            whileHover={{ y: -8 }}
                            className="group h-full"
                        >
                            <BorderGlow
                                borderRadius={30}
                                colors={['#0F766E', '#15803D', '#0E9EE4']}
                                className="relative h-full overflow-hidden rounded-[1.9rem] border border-white/70 bg-white shadow-[0_24px_74px_-44px_rgba(15,118,110,0.3)] transition-shadow duration-300 hover:shadow-[0_32px_90px_-40px_rgba(15,118,110,0.45)]"
                            >
                                {/* Image */}
                                <div className="relative h-44 w-full overflow-hidden">
                                    <img
                                        src="/images/fakta/lahan.png"
                                        alt="Lahan Sekolah"
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-white via-white/30 to-transparent" />
                                    {/* Floating metric */}
                                    <div className="absolute bottom-4 left-5 flex items-center gap-2">
                                        <div className="flex size-9 items-center justify-center rounded-xl border border-(--school-green-200) bg-white/90 text-(--school-green-700) shadow-lg backdrop-blur-sm">
                                            <Map className="size-4" />
                                        </div>
                                        <div className="rounded-xl bg-white/90 px-3 py-1 shadow-lg backdrop-blur-sm">
                                            <span className="text-lg font-extrabold text-(--school-green-700)">
                                                <AnimatedCounter
                                                    value={11396}
                                                />
                                            </span>
                                            <span className="ml-1 text-xs font-semibold text-(--school-muted)">
                                                m²
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 pt-4">
                                    <h3 className="text-xl font-bold text-(--school-ink)">
                                        Lahan Sekolah 11.396 m²
                                    </h3>
                                    <p className="mt-2.5 text-sm leading-7 text-(--school-muted)">
                                        Lahan sekolah mendukung ruang belajar,
                                        kegiatan siswa, dan aktivitas luar
                                        kelas.
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-1.5">
                                        {[
                                            'Lapangan',
                                            'Taman',
                                            'Gedung',
                                            'Parkir',
                                        ].map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-full border border-(--school-green-100) bg-(--school-green-50) px-2.5 py-0.5 text-[0.65rem] font-semibold tracking-wider text-(--school-green-700) uppercase"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </BorderGlow>
                        </motion.article>

                        {/* ─── Card 2: Moving Class ─── */}
                        <motion.article
                            variants={fadeUp}
                            whileHover={{ y: -8 }}
                            className="group h-full"
                        >
                            <BorderGlow
                                borderRadius={30}
                                colors={['#0369A1', '#F59E0B', '#0E9EE4']}
                                className="relative h-full overflow-hidden rounded-[1.9rem] border border-white/70 bg-white shadow-[0_24px_74px_-44px_rgba(3,105,161,0.3)] transition-shadow duration-300 hover:shadow-[0_32px_90px_-40px_rgba(3,105,161,0.45)]"
                            >
                                {/* Image */}
                                <div className="relative h-44 w-full overflow-hidden">
                                    <img
                                        src="/images/fakta/moving-class.png"
                                        alt="Moving Class"
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-white via-white/30 to-transparent" />
                                    {/* Floating metric */}
                                    <div className="absolute bottom-4 left-5 flex items-center gap-2">
                                        <div className="flex size-9 items-center justify-center rounded-xl border border-sky-200 bg-white/90 text-sky-700 shadow-lg backdrop-blur-sm">
                                            <ArrowLeftRight className="size-4" />
                                        </div>
                                        <div className="rounded-xl bg-white/90 px-3 py-1 shadow-lg backdrop-blur-sm">
                                            <span className="text-lg font-extrabold text-sky-700">
                                                <AnimatedCounter value={30} />
                                            </span>
                                            <span className="mx-1 text-xs font-bold text-(--school-muted)">
                                                :
                                            </span>
                                            <span className="text-lg font-extrabold text-sky-700">
                                                <AnimatedCounter value={21} />
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 pt-4">
                                    <h3 className="text-xl font-bold text-(--school-ink)">
                                        Moving Class Nyata
                                    </h3>
                                    <p className="mt-2.5 text-sm leading-7 text-(--school-muted)">
                                        30 rombel dan 21 ruang kelas dikelola
                                        melalui jadwal belajar yang tertata.
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-1.5">
                                        {['Adaptif', 'Rotasi', 'Terjadwal'].map(
                                            (tag) => (
                                                <span
                                                    key={tag}
                                                    className="rounded-full border border-sky-100 bg-sky-50 px-2.5 py-0.5 text-[0.65rem] font-semibold tracking-wider text-sky-700 uppercase"
                                                >
                                                    {tag}
                                                </span>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </BorderGlow>
                        </motion.article>

                        {/* ─── Card 3: Fasilitas Akademik ─── */}
                        <motion.article
                            variants={fadeUp}
                            whileHover={{ y: -8 }}
                            className="group h-full"
                        >
                            <BorderGlow
                                borderRadius={30}
                                colors={['#7C3AED', '#D97706', '#0E9EE4']}
                                className="relative h-full overflow-hidden rounded-[1.9rem] border border-white/70 bg-white shadow-[0_24px_74px_-44px_rgba(124,58,237,0.25)] transition-shadow duration-300 hover:shadow-[0_32px_90px_-40px_rgba(124,58,237,0.4)]"
                            >
                                {/* Image */}
                                <div className="relative h-44 w-full overflow-hidden">
                                    <img
                                        src="/images/fakta/laboratorium.png"
                                        alt="Laboratorium"
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-white via-white/30 to-transparent" />
                                    {/* Floating metric */}
                                    <div className="absolute bottom-4 left-5 flex items-center gap-2">
                                        <div className="flex size-9 items-center justify-center rounded-xl border border-violet-200 bg-white/90 text-violet-700 shadow-lg backdrop-blur-sm">
                                            <FlaskConical className="size-4" />
                                        </div>
                                        <div className="rounded-xl bg-white/90 px-3 py-1 shadow-lg backdrop-blur-sm">
                                            <span className="text-lg font-extrabold text-violet-700">
                                                3 Lab
                                            </span>
                                            <span className="mx-1 text-xs font-bold text-(--school-muted)">
                                                +
                                            </span>
                                            <span className="text-lg font-extrabold text-violet-700">
                                                2 Perpus
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 pt-4">
                                    <h3 className="text-xl font-bold text-(--school-ink)">
                                        Fasilitas Akademik Kunci
                                    </h3>
                                    <p className="mt-2.5 text-sm leading-7 text-(--school-muted)">
                                        Laboratorium dan perpustakaan mendukung
                                        pembelajaran, literasi, dan projek
                                        siswa.
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-1.5">
                                        {[
                                            'Lab IPA',
                                            'Komputer',
                                            'Perpustakaan',
                                        ].map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-full border border-violet-100 bg-violet-50 px-2.5 py-0.5 text-[0.65rem] font-semibold tracking-wider text-violet-700 uppercase"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </BorderGlow>
                        </motion.article>
                    </motion.div>
                </section>

                <section className="space-y-8">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <SectionHeading
                            eyebrow="Showcase Karya"
                            title="Karya siswa dan projek sekolah."
                            description="Dokumentasi karya ditampilkan sebagai contoh proses belajar berbasis proyek."
                        />
                        <Button
                            asChild
                            variant="outline"
                            className="group/btn flex items-center gap-2 rounded-full border-(--school-green-200) bg-white/80 px-6 transition-all hover:border-(--school-green-400) hover:bg-(--school-green-50) hover:shadow-lg"
                        >
                            <Link href="/karya">
                                Lihat Semua Karya
                                <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
                            </Link>
                        </Button>
                    </div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={motionViewport}
                        className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
                    >
                        {featuredWorks.map((work) => {
                            const fallbackImages: Record<string, string> = {
                                gastronomy:
                                    '/images/karya/fallback-gastronomi.png',
                                p5_project: '/images/karya/fallback-p5.png',
                                panen_karya:
                                    '/images/karya/fallback-panen-karya.png',
                            };
                            const fallbackSrc =
                                fallbackImages[work.itemType] ??
                                '/images/karya/fallback-p5.png';
                            const imgSrc = work.imageUrl ?? fallbackSrc;

                            const typeColors: Record<
                                string,
                                {
                                    bg: string;
                                    text: string;
                                    border: string;
                                    accent: string;
                                }
                            > = {
                                gastronomy: {
                                    bg: 'bg-amber-50',
                                    text: 'text-amber-700',
                                    border: 'border-amber-200',
                                    accent: '#D97706',
                                },
                                p5_project: {
                                    bg: 'bg-sky-50',
                                    text: 'text-sky-700',
                                    border: 'border-sky-200',
                                    accent: '#0369A1',
                                },
                                panen_karya: {
                                    bg: 'bg-emerald-50',
                                    text: 'text-emerald-700',
                                    border: 'border-emerald-200',
                                    accent: '#0F766E',
                                },
                            };
                            const tc =
                                typeColors[work.itemType] ??
                                typeColors.panen_karya;

                            const typeLabels: Record<string, string> = {
                                gastronomy: 'Gastronomi',
                                p5_project: 'Proyek P5',
                                panen_karya: 'Panen Karya',
                            };

                            return (
                                <motion.article
                                    key={work.id}
                                    variants={fadeUp}
                                    whileHover={{ y: -8 }}
                                    className="group flex h-full flex-col"
                                >
                                    <BorderGlow
                                        borderRadius={32}
                                        colors={[
                                            tc.accent,
                                            '#F59E0B',
                                            '#0E9EE4',
                                        ]}
                                        className="relative flex h-full flex-col overflow-hidden rounded-4xl border border-white/70 bg-white shadow-[0_28px_80px_-48px_rgba(15,118,110,0.35)] transition-all duration-300 hover:shadow-[0_36px_100px_-44px_rgba(15,118,110,0.5)]"
                                    >
                                        {/* Hero Image */}
                                        <div className="relative h-56 w-full shrink-0 overflow-hidden">
                                            <img
                                                src={imgSrc}
                                                alt={work.title}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                loading="lazy"
                                                onError={(e) => {
                                                    const target =
                                                        e.currentTarget;

                                                    if (
                                                        target.src !==
                                                        fallbackSrc
                                                    ) {
                                                        target.src =
                                                            fallbackSrc;
                                                    }
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />

                                            {/* Type Badge floating */}
                                            <div
                                                className={cn(
                                                    'absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.68rem] font-bold tracking-[0.2em] uppercase backdrop-blur-md',
                                                    tc.bg + '/90',
                                                    tc.text,
                                                    tc.border,
                                                )}
                                            >
                                                <Compass className="size-3" />
                                                {typeLabels[work.itemType] ??
                                                    work.itemType}
                                            </div>

                                            {/* Price badge if exists */}
                                            {work.priceEstimate && (
                                                <div className="absolute top-4 right-4 rounded-full bg-white/90 px-3 py-1 text-[0.72rem] font-bold text-(--school-ink) shadow-lg backdrop-blur-md">
                                                    {typeof work.priceEstimate ===
                                                    'number'
                                                        ? `Rp ${numberFormatter.format(work.priceEstimate)}`
                                                        : work.priceEstimate}
                                                </div>
                                            )}

                                            {/* Bottom gradient text overlay */}
                                            <div className="absolute right-5 bottom-4 left-5">
                                                <h3 className="text-xl leading-tight font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] md:text-2xl">
                                                    {work.title}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex flex-1 flex-col justify-between p-6">
                                            <div>
                                                <p className="text-sm leading-7 text-(--school-muted)">
                                                    {work.summary ??
                                                        'Karya siswa SMAN 1 Tenjo dalam program pembelajaran berbasis proyek.'}
                                                </p>
                                            </div>

                                            {/* Metadata */}
                                            <div className="mt-5 space-y-2.5 border-t border-black/4 pt-4">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex size-6 items-center justify-center rounded-md bg-(--school-green-50) text-(--school-green-700)">
                                                        <Landmark className="size-3" />
                                                    </div>
                                                    <span className="text-[0.78rem] text-(--school-muted)">
                                                        {work.projectTitle ??
                                                            'Karya siswa'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex size-6 items-center justify-center rounded-md bg-violet-50 text-violet-600">
                                                        <Sparkles className="size-3" />
                                                    </div>
                                                    <span className="text-[0.78rem] text-(--school-muted)">
                                                        {work.themeName ??
                                                            'Karya unggulan'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex size-6 items-center justify-center rounded-md bg-amber-50 text-amber-600">
                                                        <Users className="size-3" />
                                                    </div>
                                                    <span className="text-[0.78rem] text-(--school-muted)">
                                                        {work.creatorName ??
                                                            'Tim siswa'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </BorderGlow>
                                </motion.article>
                            );
                        })}
                    </motion.div>
                </section>

                <section className="mx-auto max-w-6xl">
                    {/* ═══ PPDB / ADMISSIONS PULSE ═══ */}
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={motionViewport}
                        className="group h-full"
                    >
                        <BorderGlow
                            borderRadius={32}
                            colors={['#0F766E', '#0E9EE4', '#F59E0B']}
                            className="relative h-full overflow-hidden rounded-4xl border border-white/70 bg-white shadow-[0_28px_80px_-50px_rgba(15,118,110,0.4)]"
                        >
                            {/* Header gradient */}
                            <div className="relative overflow-hidden bg-[linear-gradient(135deg,rgba(4,47,46,0.97),rgba(15,118,110,0.92)_58%,rgba(13,158,228,0.86))] px-5 pt-5 pb-6 sm:px-8 sm:pt-8 sm:pb-10">
                                <div className="pointer-events-none absolute -top-16 -right-16 size-56 rounded-full bg-white/5 blur-[60px]" />
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/22 bg-black/20 px-4 py-2 shadow-[0_12px_28px_-18px_rgba(4,47,46,0.6)] backdrop-blur-md">
                                    <Radar className="size-3.5 text-(--school-gold-400)" />
                                    <span className="text-[0.68rem] font-bold tracking-[0.28em] text-white/90 uppercase">
                                        Admissions Pulse
                                    </span>
                                </div>
                                <h2 className="mt-5 max-w-2xl font-heading text-3xl leading-[1.08] text-white sm:text-[2.45rem]">
                                    PPDB zonasi ditampilkan secara transparan.
                                </h2>
                                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/72 sm:text-base">
                                    Calon siswa dapat memeriksa jarak domisili,
                                    kuota, dan status zona melalui halaman PPDB.
                                </p>
                                <div className="mt-5 flex flex-wrap gap-2.5">
                                    {[
                                        'Jarak Domisili',
                                        'Kuota Terbuka',
                                        'Simulasi Zona',
                                    ].map((item) => (
                                        <span
                                            key={item}
                                            className="rounded-full border border-white/16 bg-white/10 px-3 py-1.5 text-[0.68rem] font-semibold tracking-[0.18em] text-white/80 uppercase backdrop-blur-sm"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Quota grid */}
                            {ppdb ? (
                                <div className="px-4 pt-4 pb-5 sm:px-6 sm:pt-6 sm:pb-6">
                                    <motion.div
                                        variants={staggerContainer}
                                        initial="hidden"
                                        whileInView="show"
                                        viewport={motionViewport}
                                        className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
                                    >
                                        {ppdb.trackQuotas.map((quota, i) => {
                                            const accents = [
                                                '#0F766E',
                                                '#0369A1',
                                                '#D97706',
                                                '#7C3AED',
                                            ];
                                            const icons = [
                                                MapPinned,
                                                ArrowLeftRight,
                                                Trophy,
                                                Award,
                                            ];
                                            const accent =
                                                accents[i % accents.length];
                                            const QuotaIcon =
                                                icons[i % icons.length];

                                            return (
                                                <motion.div
                                                    key={quota.trackType}
                                                    variants={fadeUp}
                                                    whileHover={{
                                                        y: -4,
                                                        scale: 1.02,
                                                    }}
                                                    className="group/q relative min-h-[10.5rem] overflow-hidden rounded-[1.6rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.94))] p-4 shadow-[0_18px_45px_-26px_rgba(15,23,42,0.12)] transition-all hover:shadow-[0_22px_56px_-24px_rgba(15,23,42,0.18)] sm:p-5"
                                                >
                                                    {/* Accent strip */}
                                                    <div
                                                        className="absolute inset-x-0 top-0 h-1.5 rounded-t-[1.6rem]"
                                                        style={{
                                                            backgroundColor:
                                                                accent,
                                                        }}
                                                    />
                                                    {/* Ambient glow */}
                                                    <div
                                                        className="pointer-events-none absolute -right-6 -bottom-6 size-20 rounded-full opacity-[0.06] blur-[30px] transition-opacity group-hover/q:opacity-[0.15]"
                                                        style={{
                                                            backgroundColor:
                                                                accent,
                                                        }}
                                                    />

                                                    <div className="relative z-10 flex items-start justify-between">
                                                        <div>
                                                            <div className="text-[0.68rem] font-bold tracking-[0.22em] text-(--school-muted) uppercase">
                                                                {
                                                                    quota.trackType
                                                                }
                                                            </div>
                                                            <div
                                                                className="mt-3 text-4xl font-extrabold sm:text-3xl xl:text-4xl"
                                                                style={{
                                                                    color: accent,
                                                                }}
                                                            >
                                                                <AnimatedCounter
                                                                    value={
                                                                        quota.quotaSeats
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="flex size-10 items-center justify-center rounded-2xl border shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]"
                                                            style={{
                                                                borderColor: `${accent}20`,
                                                                backgroundColor: `${accent}08`,
                                                                color: accent,
                                                            }}
                                                        >
                                                            <QuotaIcon className="size-4" />
                                                        </div>
                                                    </div>

                                                    {/* Progress bar */}
                                                    <div className="relative z-10 mt-4">
                                                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/4">
                                                            <motion.div
                                                                initial={{
                                                                    width: 0,
                                                                }}
                                                                whileInView={{
                                                                    width: `${quota.quotaPercentage}%`,
                                                                }}
                                                                viewport={{
                                                                    once: true,
                                                                }}
                                                                transition={{
                                                                    delay:
                                                                        0.3 +
                                                                        i * 0.1,
                                                                    duration: 0.8,
                                                                    ease: [
                                                                        0.22, 1,
                                                                        0.36, 1,
                                                                    ],
                                                                }}
                                                                className="h-full rounded-full"
                                                                style={{
                                                                    backgroundColor:
                                                                        accent,
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="mt-1 text-[0.65rem] font-semibold text-(--school-muted)">
                                                            {
                                                                quota.quotaPercentage
                                                            }
                                                            % kuota
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </motion.div>

                                    {/* CTA */}
                                    <div className="mt-5 flex flex-wrap gap-3">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="group/cta h-12 w-full rounded-[1.35rem] bg-[linear-gradient(135deg,var(--school-gold-500),var(--school-gold-400))] px-6 text-base font-semibold text-(--school-ink) shadow-[0_12px_30px_-12px_rgba(245,158,11,0.45)] transition-shadow hover:shadow-[0_16px_38px_-12px_rgba(245,158,11,0.58)] sm:w-auto"
                                        >
                                            <Link href={ppdbRoute()}>
                                                Mulai Simulasi Zona
                                                <ArrowRight className="ml-2 size-4 transition-transform group-hover/cta:translate-x-1" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            ) : null}
                        </BorderGlow>
                    </motion.div>
                </section>

                {/* ═══════════ PUBLIKASI MEDIA ═══════════ */}
                <section className="space-y-8">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <SectionHeading
                            eyebrow="Publikasi Media"
                            title="Kabar terbaru dan sorotan aktivitas SMAN 1 Tenjo."
                            description="Berita, pengumuman, dan dokumentasi kegiatan sekolah disusun dalam satu kanal."
                        />
                        <Button
                            asChild
                            variant="outline"
                            className="group/media flex items-center gap-2 rounded-full border-(--school-green-200) bg-white/80 px-6 transition-all hover:border-(--school-green-400) hover:bg-(--school-green-50) hover:shadow-lg"
                        >
                            <Link href="/berita">
                                Buka Semua Berita
                                <ArrowRight className="size-4 transition-transform group-hover/media:translate-x-1" />
                            </Link>
                        </Button>
                    </div>

                    {featuredArticles.length > 0 ? (
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="show"
                            viewport={motionViewport}
                            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                        >
                        {featuredArticles.map((article) => (
                            <Link
                                key={article.id}
                                href={
                                    article.slug
                                        ? `/berita/${article.slug}`
                                        : '/berita'
                                }
                            >
                                <motion.article
                                    variants={fadeUp}
                                    whileHover={{ y: -6, scale: 1.01 }}
                                    className="group h-full"
                                >
                                    <BorderGlow
                                        borderRadius={27}
                                        colors={[
                                            '#0EA5E9',
                                            'transparent',
                                            '#10B981',
                                        ]}
                                        className="relative h-full overflow-hidden rounded-[1.7rem] border border-white/60 bg-white/70 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.05)] backdrop-blur-xl transition-all duration-500 hover:border-white/90 hover:bg-white hover:shadow-[0_30px_60px_-20px_rgba(14,165,233,0.15)]"
                                    >
                                        <div className="pointer-events-none absolute top-0 right-0 size-64 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-sky-100/50 via-teal-50/10 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                                        <div className="relative p-7">
                                            <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200/50 bg-sky-50/80 px-3 py-1.5 text-[0.65rem] font-extrabold tracking-[0.22em] text-sky-700 uppercase backdrop-blur-md transition-colors group-hover:border-sky-300 group-hover:bg-sky-100">
                                                <Newspaper className="size-3" />
                                                {article.category ??
                                                    'Aktivitas Sekolah'}
                                            </div>
                                            <h3 className="mt-4 line-clamp-2 text-2xl leading-[1.3] font-black tracking-tight text-(--school-ink) transition-colors group-hover:bg-linear-to-r group-hover:from-sky-700 group-hover:to-teal-600 group-hover:bg-clip-text group-hover:text-transparent">
                                                {article.title}
                                            </h3>
                                            <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-slate-500">
                                                {article.excerpt}
                                            </p>
                                            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors group-hover:bg-sky-100 group-hover:text-sky-600">
                                                        <Users className="size-3.5" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[0.7rem] font-bold tracking-wider text-slate-400 uppercase">
                                                            Jurnalis
                                                        </span>
                                                        <span className="text-xs font-semibold text-slate-600">
                                                            {article.authorName}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500 transition-colors group-hover:bg-sky-50 group-hover:text-sky-700">
                                                    <CalendarDays className="size-3.5" />
                                                    {article.publishedAt
                                                        ? dateFormatter.format(
                                                              new Date(
                                                                  article.publishedAt,
                                                              ),
                                                          )
                                                        : 'Terjadwal'}
                                                </div>
                                            </div>
                                        </div>
                                    </BorderGlow>
                                </motion.article>
                            </Link>
                        ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="show"
                            viewport={motionViewport}
                        >
                            <BorderGlow
                                borderRadius={27}
                                className="overflow-hidden rounded-[1.7rem] border border-dashed border-sky-200 bg-white/70 shadow-[0_16px_50px_-30px_rgba(14,165,233,0.15)]"
                            >
                                <div className="flex flex-col items-center justify-center p-10 text-center md:p-14">
                                    <div className="flex size-16 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                                        <Newspaper className="size-7" />
                                    </div>
                                    <h4 className="mt-5 text-xl font-bold text-(--school-ink)">
                                        Belum Ada Publikasi
                                    </h4>
                                    <p className="mt-2 max-w-md text-sm leading-7 text-(--school-muted)">
                                        Kabar terbaru, pengumuman, dan sorotan aktivitas SMAN 1 Tenjo akan ditampilkan di sini.
                                    </p>
                                </div>
                            </BorderGlow>
                        </motion.div>
                    )}

                    {/* ─── Eskul Cards Infinite Marquee ─── */}
                    <div className="relative -mx-4 flex w-full overflow-hidden px-4 py-6">
                        {/* Gradient Masks for smooth fade out at edges */}
                        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-linear-to-r from-[#FAF7EE] to-transparent sm:w-24 lg:w-40" />
                        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-linear-to-l from-[#FAF7EE] to-transparent sm:w-24 lg:w-40" />

                        {(() => {
                            const eskulItems = [
                                {
                                    name: 'Paskibra',
                                    image: '/images/eskul/paskibra.png',
                                    description:
                                        'Pasukan Pengibar Bendera yang melatih disiplin, kepemimpinan, dan keterampilan baris-berbaris tingkat tinggi.',
                                    accent: '#DC2626',
                                    icon: ShieldCheck,
                                    metric: 'Juara',
                                    metricSub: 'Prov.',
                                    focus: [
                                        'Disiplin',
                                        'Kepemimpinan',
                                        'Baris-berbaris',
                                    ],
                                },
                                {
                                    name: 'Futsal',
                                    image: '/images/eskul/futsal.png',
                                    description:
                                        'Olahraga futsal yang aktif diikuti siswa, membentuk sportivitas dan semangat kompetisi.',
                                    accent: '#16A34A',
                                    icon: Trophy,
                                    metric: 'Aktif',
                                    metricSub: 'Rutin',
                                    focus: [
                                        'Olahraga',
                                        'Kerjasama Tim',
                                        'Sportivitas',
                                    ],
                                },
                                {
                                    name: 'Rohis',
                                    image: '/images/eskul/rohis.png',
                                    description:
                                        'Rohani Islam — memperkuat iman, karakter Islami, dan kegiatan dakwah di lingkungan sekolah.',
                                    accent: '#0F766E',
                                    icon: Heart,
                                    metric: 'Rutin',
                                    metricSub: 'Mingguan',
                                    focus: ['Keagamaan', 'Karakter', 'Dakwah'],
                                },
                                {
                                    name: 'PMR',
                                    image: '/images/eskul/pmr.png',
                                    description:
                                        'Palang Merah Remaja — fokus pada kesehatan, pertolongan pertama, dan kepedulian sosial.',
                                    accent: '#E11D48',
                                    icon: Heart,
                                    metric: 'P3K',
                                    metricSub: 'Terlatih',
                                    focus: ['Kesehatan', 'P3K', 'Sosial'],
                                },
                                {
                                    name: 'Pramuka',
                                    image: '/images/eskul/pramuka.png',
                                    description:
                                        'Menanamkan jiwa mandiri, disiplin, dan peduli lingkungan melalui kegiatan kepanduan resmi.',
                                    accent: '#A16207',
                                    icon: Compass,
                                    metric: 'Ambalan',
                                    metricSub: 'Resmi',
                                    focus: ['Kemandirian', 'Alam', 'Kepanduan'],
                                },
                                {
                                    name: 'Pencak Silat',
                                    image: '/images/eskul/silat.png',
                                    description:
                                        'Seni bela diri tradisional yang aktif ditunjukkan dalam demo dan lomba ekstrakurikuler.',
                                    accent: '#7C3AED',
                                    icon: Sparkles,
                                    metric: 'Demo',
                                    metricSub: 'Eskul',
                                    focus: [
                                        'Bela Diri',
                                        'Budaya',
                                        'Ketangkasan',
                                    ],
                                },
                            ];

                            return (
                                <motion.div
                                    animate={{ x: ['0%', '-50%'] }}
                                    transition={{
                                        ease: 'linear',
                                        duration: 45,
                                        repeat: Infinity,
                                    }}
                                    className="flex w-max gap-6"
                                    whileHover={{
                                        animationPlayState: 'paused',
                                    }}
                                >
                                    {[...eskulItems, ...eskulItems].map(
                                        (eskul, idx) => (
                                            <motion.article
                                                key={`${eskul.name}-${idx}`}
                                                className="group h-full w-90 shrink-0"
                                            >
                                                <BorderGlow
                                                    borderRadius={30}
                                                    colors={[
                                                        eskul.accent,
                                                        '#0E9EE4',
                                                        '#F59E0B',
                                                    ]}
                                                    className="relative h-full overflow-hidden rounded-[1.9rem] border border-white/70 bg-white shadow-[0_24px_74px_-44px_rgba(15,118,110,0.3)] transition-shadow duration-300 hover:shadow-[0_32px_90px_-40px_rgba(15,118,110,0.45)]"
                                                >
                                                    <div className="relative h-44 w-full overflow-hidden">
                                                        <img
                                                            src={eskul.image}
                                                            alt={eskul.name}
                                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                            loading="lazy"
                                                        />
                                                        <div className="absolute inset-0 bg-linear-to-t from-white via-white/30 to-transparent" />
                                                        <div className="absolute bottom-4 left-5 flex items-center gap-2">
                                                            <div
                                                                className="flex size-9 items-center justify-center rounded-xl border bg-white/90 shadow-lg backdrop-blur-sm"
                                                                style={{
                                                                    borderColor: `${eskul.accent}30`,
                                                                    color: eskul.accent,
                                                                }}
                                                            >
                                                                <eskul.icon className="size-4" />
                                                            </div>
                                                            <div className="rounded-xl bg-white/90 px-3 py-1 shadow-lg backdrop-blur-sm">
                                                                <span
                                                                    className="text-lg font-extrabold"
                                                                    style={{
                                                                        color: eskul.accent,
                                                                    }}
                                                                >
                                                                    {
                                                                        eskul.metric
                                                                    }
                                                                </span>
                                                                <span className="ml-1 text-xs font-semibold text-(--school-muted)">
                                                                    {
                                                                        eskul.metricSub
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="p-6 pt-4">
                                                        <h3 className="text-xl font-bold text-(--school-ink)">
                                                            {eskul.name}
                                                        </h3>
                                                        <p className="mt-2 text-sm leading-7 text-(--school-muted)">
                                                            {eskul.description}
                                                        </p>
                                                        <div className="mt-4 flex flex-wrap gap-2.5">
                                                            {eskul.focus.map(
                                                                (tag) => (
                                                                    <span
                                                                        key={
                                                                            tag
                                                                        }
                                                                        className="rounded-full px-3 py-1 text-[0.62rem] font-bold tracking-[0.15em] uppercase"
                                                                        style={{
                                                                            backgroundColor: `${eskul.accent}0D`,
                                                                            color: eskul.accent,
                                                                            border: `1px solid ${eskul.accent}20`,
                                                                        }}
                                                                    >
                                                                        {tag}
                                                                    </span>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                </BorderGlow>
                                            </motion.article>
                                        ),
                                    )}
                                </motion.div>
                            );
                        })()}
                    </div>

                    {/* ─── YouTube Video Section ─── */}
                    <div className="mt-4 space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="size-5"
                                >
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-(--school-ink)">
                                    Video dari Channel Resmi
                                </h3>
                                <p className="text-xs text-(--school-muted)">
                                    SMAN 1 Tenjo Official — YouTube
                                </p>
                            </div>
                            <a
                                href="https://www.youtube.com/@sman1tenjoofficial115"
                                target="_blank"
                                rel="noreferrer"
                                className="ml-auto inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-xs font-bold text-red-600 transition-all hover:bg-red-100 hover:shadow-md"
                            >
                                Kunjungi Channel
                                <ArrowRight className="size-3" />
                            </a>
                        </div>

                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="show"
                            viewport={motionViewport}
                            className="flex snap-x snap-mandatory overflow-x-auto gap-5 pb-4 md:grid md:grid-cols-2 xl:grid-cols-3 md:overflow-visible"
                        >
                            {[
                                {
                                    id: 'VJjoTTTUCgM',
                                    title: 'Panen Karya Project P5 dalam Gebyar Pemilos',
                                    category: 'P5 Project',
                                    accent: '#D97706',
                                },
                                {
                                    id: 'oe33AlxEROU',
                                    title: 'Panen Karya P5 — Tema Berkebhinekaan Global',
                                    category: 'P5 Project',
                                    accent: '#0369A1',
                                },
                                {
                                    id: '8-AGOFF9gEA',
                                    title: 'Demo Ekstrakurikuler Pencak Silat',
                                    category: 'Ekstrakurikuler',
                                    accent: '#7C3AED',
                                },
                                {
                                    id: '3O5iRsoMjus',
                                    title: 'Paskibra — Piala Gubernur Pelajar Juara 2022',
                                    category: 'Prestasi',
                                    accent: '#DC2626',
                                },
                                {
                                    id: 'B7Vhr9jsFLU',
                                    title: 'Modern Dance — Piala Gubernur Pelajar Juara 2022',
                                    category: 'Prestasi',
                                    accent: '#E11D48',
                                },
                                {
                                    id: '5i-TQeqF634',
                                    title: 'Kepala Sekolah SMA Negeri 1 Tenjo',
                                    category: 'Sekolah',
                                    accent: '#0F766E',
                                },
                            ].map((video) => (
                                <a
                                    key={video.id}
                                    href={`https://www.youtube.com/watch?v=${video.id}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block w-[85vw] shrink-0 snap-center rounded-[1.7rem] focus:outline-none focus-visible:ring-4 focus-visible:ring-(--school-green-400) md:w-auto"
                                >
                                    <motion.div
                                        variants={fadeUp}
                                        whileHover={{ y: -6, scale: 1.02 }}
                                        className="group h-full cursor-pointer"
                                    >
                                        <BorderGlow
                                            borderRadius={27}
                                            colors={[
                                                '#DC2626',
                                                'transparent',
                                                video.accent,
                                            ]}
                                            className="relative h-full overflow-hidden rounded-[1.7rem] border border-white/60 bg-white/70 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.05)] backdrop-blur-xl transition-all duration-500 hover:border-white/90 hover:bg-white hover:shadow-[0_30px_60px_-20px_rgba(220,38,38,0.2)]"
                                        >
                                            {/* Ambient Red Glow on hover */}
                                            <div className="pointer-events-none absolute top-1/2 right-0 size-48 translate-x-1/3 -translate-y-1/2 rounded-full bg-red-500/20 opacity-0 blur-[3rem] transition-opacity duration-700 group-hover:opacity-100" />

                                            {/* Thumbnail with play overlay */}
                                            <div className="relative aspect-video w-full overflow-hidden">
                                                {/* Mask image with subtle overlay on hover to pop up the play button */}
                                                <div className="pointer-events-none absolute inset-0 z-10 bg-black/10 transition-colors duration-500 group-hover:bg-black/30" />

                                                <img
                                                    src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                                                    alt={video.title}
                                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 z-10 bg-linear-to-t from-black/80 via-black/10 to-transparent opacity-80" />

                                                {/* Play button with YouTube Official Icon */}
                                                <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
                                                    <div className="relative flex items-center justify-center transition-all duration-500 group-hover:scale-110">
                                                        {/* White backdrop for the play triangle */}
                                                        <div className="absolute inset-0 m-auto h-5 w-8 rounded-sm bg-white" />
                                                        <svg
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            className="relative z-10 size-16 text-[#FF0000] drop-shadow-[0_8px_16px_rgba(255,0,0,0.6)] transition-all duration-500 group-hover:drop-shadow-[0_12px_24px_rgba(255,0,0,0.9)]"
                                                        >
                                                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                {/* Category badge - Glassmorphic */}
                                                <div
                                                    className="absolute top-4 left-4 z-20 flex items-center gap-1.5 rounded-full border border-white/30 px-3 py-1 text-[0.6rem] font-bold tracking-[0.2em] text-white uppercase shadow-lg backdrop-blur-md transition-colors duration-300 group-hover:bg-white group-hover:text-red-700"
                                                    style={{
                                                        backgroundColor: `${video.accent}80`,
                                                    }}
                                                >
                                                    {video.category}
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="relative p-6">
                                                <h4 className="line-clamp-2 text-[15px] leading-[1.4] font-black text-(--school-ink) transition-colors duration-300 group-hover:text-red-600">
                                                    {video.title}
                                                </h4>
                                                <div className="mt-4 flex items-center gap-2 border-t border-slate-100/80 pt-4 text-xs font-semibold text-slate-500">
                                                    <div className="flex size-6 items-center justify-center rounded-md bg-slate-100 text-red-500 transition-colors group-hover:bg-red-50">
                                                        <svg
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            className="size-3.5"
                                                        >
                                                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                                        </svg>
                                                    </div>
                                                    <span className="transition-colors group-hover:text-slate-700">
                                                        SMAN 1 Tenjo Official
                                                    </span>
                                                    <ArrowRight className="ml-auto size-4 text-slate-300 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-red-500 group-hover:opacity-100" />
                                                </div>
                                            </div>
                                        </BorderGlow>
                                    </motion.div>
                                </a>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* ═══════════ ALUMNI SPOTLIGHT ═══════════ */}
                <section className="space-y-8">
                    <SectionHeading
                        eyebrow="Alumni Spotlight"
                        title="Jejak lulusan SMAN 1 Tenjo di berbagai penjuru."
                        description="Profil alumni ditampilkan setelah data dikonfirmasi dan mendapat persetujuan."
                    />

                    {/* Hero Alumni Banner */}
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={motionViewport}
                    >
                        <BorderGlow
                            borderRadius={32}
                            colors={['#0F766E', '#D97706', '#7C3AED']}
                            className="relative overflow-hidden rounded-4xl border border-white/70 bg-[linear-gradient(160deg,rgba(4,47,46,0.97),rgba(15,118,110,0.92)_50%,rgba(13,158,228,0.85))] shadow-[0_38px_90px_-50px_rgba(4,47,46,0.75)]"
                        >
                            <div className="grid lg:grid-cols-[1fr_320px]">
                                <div className="relative z-10 p-6 text-white sm:p-8 lg:p-10">
                                    {/* Ambient orb */}
                                    <div className="pointer-events-none absolute -top-20 -right-20 size-72 rounded-full bg-white/4 blur-[80px]" />

                                    <div className="inline-flex items-center gap-2 rounded-full border border-white/22 bg-black/20 px-4 py-2 shadow-[0_12px_28px_-18px_rgba(4,47,46,0.6)] backdrop-blur-md">
                                        <GraduationCap className="size-3.5 text-(--school-gold-400)" />
                                        <span className="text-[0.68rem] font-bold tracking-[0.28em] text-white/90 uppercase">
                                            Alumni Network
                                        </span>
                                    </div>

                                    <h3 className="mt-5 font-heading text-2xl leading-tight sm:text-3xl">
                                        Dari SMAN 1 Tenjo ke Seluruh Indonesia
                                    </h3>
                                    <p className="mt-3 max-w-lg text-sm leading-7 text-white/72 sm:text-base">
                                        Lulusan kami tersebar di berbagai
                                        perguruan tinggi dan dunia kerja. Setiap
                                        jejak alumni menjadi inspirasi bagi
                                        generasi berikutnya.
                                    </p>

                                    {/* Stats Row */}
                                    <div className="mt-6 flex flex-wrap gap-6">
                                        {[
                                            {
                                                label: 'Total Alumni',
                                                value:
                                                    alumniSpotlight.length > 0
                                                        ? alumniSpotlight.length
                                                        : 1,
                                                suffix: '+',
                                            },
                                            {
                                                label: 'Angkatan',
                                                value:
                                                    alumniSpotlight.length > 0
                                                        ? [
                                                              ...new Set(
                                                                  alumniSpotlight.map(
                                                                      (a) =>
                                                                          a.graduationYear,
                                                                  ),
                                                              ),
                                                          ].length
                                                        : 1,
                                                suffix: '',
                                            },
                                        ].map((s) => (
                                            <div
                                                key={s.label}
                                                className="rounded-2xl border border-white/10 bg-white/6 px-5 py-3 backdrop-blur-sm"
                                            >
                                                <div className="text-2xl font-extrabold text-white">
                                                    <AnimatedCounter
                                                        value={s.value}
                                                    />
                                                    {s.suffix}
                                                </div>
                                                <div className="mt-0.5 text-[0.62rem] font-bold tracking-[0.2em] text-white/50 uppercase">
                                                    {s.label}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Hero image */}
                                <div className="relative hidden overflow-hidden lg:block">
                                    <img
                                        src="/images/alumni/hero.png"
                                        alt="Alumni SMAN 1 Tenjo"
                                        className="h-full w-full object-cover object-center"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-l from-transparent to-[rgba(4,47,46,0.4)]" />
                                </div>
                            </div>
                        </BorderGlow>
                    </motion.div>

                    {/* Alumni Cards */}
                    {alumniSpotlight.length > 0 ? (
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="show"
                            viewport={motionViewport}
                            className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
                        >
                            {alumniSpotlight.map((alumnus, i) => {
                                const avatarColors = [
                                    '#0F766E',
                                    '#7C3AED',
                                    '#D97706',
                                    '#0369A1',
                                    '#DC2626',
                                    '#E11D48',
                                ];
                                const ac =
                                    avatarColors[i % avatarColors.length];
                                const initials = alumnus.fullName
                                    .split(' ')
                                    .slice(0, 2)
                                    .map((n) => n[0])
                                    .join('')
                                    .toUpperCase();

                                return (
                                    <motion.div
                                        key={alumnus.id}
                                        variants={fadeUp}
                                        whileHover={{ y: -6 }}
                                        className="group h-full"
                                    >
                                        <BorderGlow
                                            borderRadius={27}
                                            colors={[ac, '#F59E0B', '#0E9EE4']}
                                            className="relative h-full overflow-hidden rounded-[1.7rem] border border-white/70 bg-white shadow-[0_22px_70px_-44px_rgba(15,118,110,0.35)] transition-all duration-300 hover:shadow-[0_30px_80px_-40px_rgba(15,118,110,0.5)]"
                                        >
                                            {/* Accent top */}
                                            <div
                                                className="h-1 w-full"
                                                style={{
                                                    background: `linear-gradient(90deg, ${ac}, ${ac}80, transparent)`,
                                                }}
                                            />

                                            <div className="p-6">
                                                {/* Header */}
                                                <div className="flex items-start gap-4">
                                                    <div
                                                        className="flex size-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-lg"
                                                        style={{
                                                            background: `linear-gradient(135deg, ${ac}, ${ac}cc)`,
                                                        }}
                                                    >
                                                        {initials}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h4 className="truncate text-lg font-bold text-(--school-ink)">
                                                            {alumnus.fullName}
                                                        </h4>
                                                        <div className="mt-1 flex flex-wrap items-center gap-2">
                                                            <span
                                                                className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.6rem] font-bold tracking-[0.15em] text-white uppercase"
                                                                style={{
                                                                    backgroundColor:
                                                                        ac,
                                                                }}
                                                            >
                                                                <GraduationCap className="size-3" />
                                                                {
                                                                    alumnus.graduationYear
                                                                }
                                                            </span>
                                                            {alumnus.occupationTitle && (
                                                                <span className="rounded-full border border-black/6 bg-(--school-green-50) px-2.5 py-0.5 text-[0.6rem] font-semibold text-(--school-green-700)">
                                                                    {
                                                                        alumnus.occupationTitle
                                                                    }
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Institution */}
                                                {alumnus.institutionName && (
                                                    <div className="mt-4 flex items-center gap-2 rounded-xl border border-black/4 bg-(--school-green-50)/50 px-4 py-2.5">
                                                        <Landmark className="size-4 shrink-0 text-(--school-green-700)" />
                                                        <span className="text-sm font-semibold text-(--school-ink)">
                                                            {
                                                                alumnus.institutionName
                                                            }
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Bio */}
                                                {alumnus.bio && (
                                                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-(--school-muted)">
                                                        {alumnus.bio}
                                                    </p>
                                                )}

                                                {/* Location */}
                                                {(alumnus.city ||
                                                    alumnus.province) && (
                                                    <div className="mt-4 flex items-center gap-1.5 border-t border-black/4 pt-4 text-[0.72rem] text-(--school-muted)">
                                                        <MapPinned className="size-3.5" />
                                                        <span>
                                                            {[
                                                                alumnus.city,
                                                                alumnus.province,
                                                            ]
                                                                .filter(Boolean)
                                                                .join(', ')}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </BorderGlow>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="show"
                            viewport={motionViewport}
                        >
                            <BorderGlow
                                borderRadius={27}
                                className="overflow-hidden rounded-[1.7rem] border border-dashed border-(--school-green-200) bg-white/70 shadow-[0_16px_50px_-30px_rgba(15,118,110,0.2)]"
                            >
                                <div className="flex flex-col items-center justify-center p-10 text-center md:p-14">
                                    <div className="flex size-16 items-center justify-center rounded-2xl bg-(--school-green-50) text-(--school-green-700)">
                                        <GraduationCap className="size-7" />
                                    </div>
                                    <h4 className="mt-5 text-xl font-bold text-(--school-ink)">
                                        Profil Alumni Segera Hadir
                                    </h4>
                                    <p className="mt-2 max-w-md text-sm leading-7 text-(--school-muted)">
                                        Profil alumni akan ditampilkan setelah
                                        data dikonfirmasi dan persetujuan
                                        diperoleh.
                                    </p>
                                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                                        {[
                                            'Universitas',
                                            'Dunia Kerja',
                                            'Wirausaha',
                                            'Luar Negeri',
                                        ].map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-full border border-(--school-green-200) bg-(--school-green-50) px-4 py-1.5 text-[0.65rem] font-bold tracking-[0.2em] text-(--school-green-700) uppercase"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </BorderGlow>
                        </motion.div>
                    )}
                </section>
            </div>
        </>
    );
}
