import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { lazy, Suspense } from 'react';
import {
    ArrowLeftRight,
    ArrowRight,
    Award,
    BookOpen,
    CalendarDays,
    ChefHat,
    Compass,
    Cpu,
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
import { AnimatedCounter } from '@/components/public/animated-counter';
import { BorderGlow } from '@/components/public/border-glow';
import { HeroCarousel } from '@/components/public/hero-carousel';
import { SectionHeading } from '@/components/public/section-heading';

import { VisiPillarShowcase } from '@/components/public/visi-pillar-showcase';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    schoolHighlights,
    signaturePrograms,
    virtualTourScenes,
} from '@/lib/public-content';
import { fadeUp, motionViewport, staggerContainer } from '@/lib/motion';
import type {
    AlumniSpotlight,
    FeaturedArticle,
    FeaturedWork,
    OrganizationNode,
    PpdbPayload,
    SchoolProfilePayload,
} from '@/types';



type HomePageProps = {
    school: SchoolProfilePayload;
    ppdb: PpdbPayload;
    featuredWorks: FeaturedWork[];
    featuredArticles: FeaturedArticle[];
    leadershipPreview: OrganizationNode[];
    alumniSpotlight: AlumniSpotlight[];
};

const numberFormatter = new Intl.NumberFormat('id-ID');
const dateFormatter = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' });

export default function HomePage({
    school,
    ppdb,
    featuredWorks,
    featuredArticles,
    leadershipPreview,
    alumniSpotlight,
}: HomePageProps) {
    const batara = school.valueStatements.find(
        (statement) => statement.key === 'batara_kresna',
    );

    const bataraParts = (batara?.valueText ?? '')
        .split(',')
        .map((part) => part.replace(/^dan\s+/i, '').trim())
        .filter(Boolean);

    return (
        <>
            <Head title="SMAN 1 Tenjo — Portal Digital Sekolah">
                <meta
                    name="description"
                    content="Portal publik SMAN 1 Tenjo Kabupaten Bogor. Akreditasi A, NPSN 20231338, Kurikulum Merdeka, P5, PPDB zonasi interaktif, virtual tour 360°, dan galeri karya siswa."
                />
                <meta property="og:title" content="SMAN 1 Tenjo — Portal Digital Sekolah" />
                <meta property="og:description" content="Sekolah negeri yang hidup, adaptif, dan siap tampil digital. Simulasi zonasi PPDB, virtual tour, dan galeri karya P5." />
                <meta property="og:type" content="website" />
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=plus-jakarta-sans:400,500,700,800|space-grotesk:500,700"
                    rel="stylesheet"
                />
            </Head>

            <div className="space-y-8 md:space-y-10">
                <HeroCarousel />

                <motion.section
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={motionViewport}
                    className="grid gap-5 md:grid-cols-4"
                >
                    {[
                        {
                            label: 'Siswa Aktif',
                            value: school.studentCount,
                            icon: Users,
                            delay: 0.1,
                        },
                        {
                            label: 'Rombel',
                            value: school.teachingGroupCount,
                            icon: GraduationCap,
                            delay: 0.2,
                        },
                        {
                            label: 'Ruang Fisik',
                            value: school.physicalClassroomCount,
                            icon: Landmark,
                            delay: 0.3,
                        },
                        {
                            label: 'PTK',
                            value: school.staffCount,
                            icon: ShieldCheck,
                            delay: 0.4,
                        },
                    ].map((stat) => (
                        <motion.div
                            key={stat.label}
                            variants={fadeUp}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="h-full"
                        >
                            <BorderGlow
                                borderRadius={32}
                                className="group relative overflow-hidden rounded-[2rem] border border-white/60 bg-[rgba(255,255,255,0.7)] p-6 shadow-[0_20px_40px_-20px_rgba(4,47,46,0.15)] backdrop-blur-xl transition-all duration-300 hover:border-white/90 hover:bg-white hover:shadow-[0_30px_60px_-24px_rgba(15,118,110,0.3)] h-full"
                            >
                                <div className="absolute -right-4 -top-4 size-24 rounded-full bg-[var(--school-green-100)] opacity-40 blur-2xl transition duration-500 group-hover:bg-[#0E9EE4] group-hover:opacity-30" />
                                <div className="relative flex items-center justify-between">
                                    <div className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-[var(--school-muted)] group-hover:text-[var(--school-ink)] transition-colors">
                                        {stat.label}
                                    </div>
                                    <div className="rounded-full bg-[var(--school-green-50)] p-2.5 text-[var(--school-green-700)] transition-colors group-hover:bg-[var(--school-green-100)]">
                                        <stat.icon className="size-5" />
                                    </div>
                                </div>
                                <div className="relative mt-5 text-4xl font-extrabold tracking-tight text-[var(--school-ink)] lg:text-5xl">
                                    <AnimatedCounter value={stat.value} delay={stat.delay} />
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
                            className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_32px_90px_-50px_rgba(15,118,110,0.35)]"
                        >
                            <div className="grid lg:grid-cols-[340px_1fr]">
                                {/* Portrait Side */}
                                <div className="relative hidden lg:block">
                                    <img
                                        src="/images/principal-portrait.png"
                                        alt={`${school.principalName ?? 'Kepala Sekolah'} — Kepala SMA Negeri 1 Tenjo`}
                                        className="h-full w-full object-cover object-top"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/30" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(4,47,46,0.6)] via-transparent to-transparent" />
                                    {/* Name overlay on image */}
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <div className="rounded-2xl border border-white/15 bg-black/30 px-5 py-4 backdrop-blur-md">
                                            <div className="text-[0.62rem] font-bold uppercase tracking-[0.3em] text-[var(--school-gold)]">
                                                Kepala Sekolah
                                            </div>
                                            <div className="mt-1 text-lg font-bold text-white">
                                                {school.principalName ?? 'Titin Sriwartini'}
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
                                    <Quote className="absolute right-8 top-8 size-20 text-[var(--school-green-100)] opacity-40 lg:right-10 lg:top-10" />

                                    {/* Mobile portrait */}
                                    <div className="mb-6 flex items-center gap-4 lg:hidden">
                                        <img
                                            src="/images/principal-portrait.png"
                                            alt={school.principalName ?? 'Kepala Sekolah'}
                                            className="size-20 rounded-2xl object-cover object-top shadow-lg"
                                        />
                                        <div>
                                            <div className="text-[0.62rem] font-bold uppercase tracking-[0.28em] text-[var(--school-green-700)]">
                                                Kepala Sekolah
                                            </div>
                                            <div className="text-lg font-bold text-[var(--school-ink)]">
                                                {school.principalName ?? 'Titin Sriwartini'}
                                            </div>
                                            <div className="text-xs text-[var(--school-muted)]">
                                                SMA Negeri 1 Tenjo
                                            </div>
                                        </div>
                                    </div>

                                    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--school-green-100)] bg-[var(--school-green-50)] px-4 py-1.5">
                                        <Sparkles className="size-3.5 text-[var(--school-green-700)]" />
                                        <span className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[var(--school-green-700)]">Sambutan Kepala Sekolah</span>
                                    </div>

                                    <div className="relative mt-6 space-y-4">
                                        <p className="text-sm font-semibold italic leading-7 text-[var(--school-ink)]">
                                            Assalamu'alaikum warahmatullahi wabarakatuh,
                                        </p>
                                        <p className="text-sm leading-7 text-[var(--school-muted)]">
                                            Puji syukur kita panjatkan ke hadirat Allah SWT, karena atas rahmat dan karunia-Nya kita semua masih diberikan kesehatan dan kesempatan untuk terus berkarya dan berprestasi.
                                        </p>
                                        <p className="text-sm leading-7 text-[var(--school-muted)]">
                                            Selamat datang di website resmi <strong className="text-[var(--school-ink)]">SMA Negeri 1 Tenjo</strong>. Website ini kami hadirkan sebagai sarana informasi, komunikasi, dan publikasi berbagai kegiatan serta prestasi sekolah kepada seluruh masyarakat.
                                        </p>
                                        <p className="text-sm leading-7 text-[var(--school-muted)]">
                                            Sebagai lembaga pendidikan, kami berkomitmen untuk menciptakan lingkungan belajar yang kondusif, inovatif, dan berkarakter. Kami terus berupaya meningkatkan kualitas pendidikan, baik dalam bidang akademik maupun non-akademik, agar peserta didik mampu bersaing di era global tanpa meninggalkan nilai-nilai akhlak dan budaya bangsa.
                                        </p>
                                        <p className="text-sm leading-7 text-[var(--school-muted)]">
                                            Kami juga mengajak seluruh warga sekolah, orang tua, dan masyarakat untuk bersama-sama mendukung program-program sekolah demi tercapainya generasi yang unggul, berintegritas, dan berwawasan luas.
                                        </p>
                                        <p className="text-sm leading-7 text-[var(--school-muted)]">
                                            Akhir kata, kami mengucapkan terima kasih atas kepercayaan dan dukungan yang telah diberikan kepada SMA Negeri 1 Tenjo. Semoga sekolah ini terus berkembang dan memberikan manfaat bagi dunia pendidikan.
                                        </p>
                                        <p className="text-sm font-semibold italic leading-7 text-[var(--school-ink)]">
                                            Wassalamu'alaikum warahmatullahi wabarakatuh.
                                        </p>
                                    </div>

                                    {/* Signature area - desktop */}
                                    <div className="mt-8 hidden items-center gap-4 border-t border-black/[0.04] pt-6 lg:flex">
                                        <div className="flex size-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--school-green-600),var(--school-green-700))] text-white shadow-[0_8px_20px_-6px_rgba(15,118,110,0.4)]">
                                            <GraduationCap className="size-5" />
                                        </div>
                                        <div>
                                            <div className="text-base font-bold text-[var(--school-ink)]">
                                                {school.principalName ?? 'Titin Sriwartini'}
                                            </div>
                                            <div className="text-xs text-[var(--school-muted)]">
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
                        title="Sekolah yang bergerak dari nilai ke karya nyata."
                        description="Wajah sekolah ini dibangun dari pijakan autentik: karakter, karya, dan komunitas. Setiap pilar bukan dekorasi — melainkan sistem yang hidup."
                    />

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:auto-rows-[minmax(13rem,auto)]">
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
                                className="relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(160deg,rgba(4,47,46,0.97),rgba(15,118,110,0.93)_42%,rgba(13,158,228,0.88))] p-8 md:p-10 text-white shadow-[0_38px_90px_-50px_rgba(4,47,46,0.8)]"
                            >
                                {/* Ambient light orbs */}
                                <div className="pointer-events-none absolute -right-20 -top-20 size-[28rem] rounded-full bg-white/[0.04] blur-[100px] transition-transform duration-[1.2s] group-hover:-translate-x-16 group-hover:translate-y-8" />
                                <div className="pointer-events-none absolute -bottom-32 -left-20 size-72 rounded-full bg-[var(--school-gold)]/10 blur-[80px] transition-all duration-[1.4s] group-hover:opacity-30" />
                                {/* Subtle grid pattern overlay */}
                                <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-60" />

                                {/* Header */}
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 backdrop-blur-sm">
                                            <Heart className="size-5 text-[var(--school-gold)]" />
                                        </div>
                                        <div className="inline-flex rounded-full border border-white/20 bg-white/[0.08] px-4 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.28em] text-[var(--school-gold)] backdrop-blur-sm">
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
                                            description: 'Menanamkan keyakinan kepada Tuhan Yang Maha Esa sebagai fondasi utama dalam setiap sikap, keputusan, dan aktivitas belajar.',
                                        },
                                        {
                                            name: 'Bertaqwa',
                                            image: '/images/values/bertaqwa.png',
                                            description: 'Mengamalkan nilai-nilai ibadah dan ketaatan dalam kehidupan sehari-hari, baik di lingkungan sekolah maupun masyarakat.',
                                        },
                                        {
                                            name: 'Berkarakter',
                                            image: '/images/values/berkarakter.png',
                                            description: 'Membentuk pribadi yang berintegritas, bertanggung jawab, dan memiliki akhlak mulia sebagai bekal kehidupan.',
                                        },
                                        {
                                            name: 'Bebas Narkoba',
                                            image: '/images/values/bebas-narkoba.png',
                                            description: 'Komitmen penuh terhadap lingkungan sekolah yang bersih dari pengaruh narkoba dan zat berbahaya.',
                                        },
                                    ].map((value, i) => (
                                        <motion.div
                                            key={value.name}
                                            initial={{ opacity: 0, y: 16, scale: 0.96 }}
                                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{
                                                delay: 0.25 + i * 0.12,
                                                duration: 0.6,
                                                ease: [0.22, 1, 0.36, 1],
                                            }}
                                            className="group/card relative overflow-hidden rounded-2xl border border-white/[0.12] bg-white/[0.06] backdrop-blur-md transition-all duration-300 hover:border-white/25 hover:bg-white/[0.12] hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.3)]"
                                        >
                                            {/* Image */}
                                            <div className="relative mx-auto flex items-center justify-center overflow-hidden pt-3 md:pt-4">
                                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/[0.04]" />
                                                <img
                                                    src={value.image}
                                                    alt={value.name}
                                                    className="size-20 object-contain drop-shadow-[0_4px_20px_rgba(245,158,11,0.25)] transition-transform duration-500 group-hover/card:scale-110 md:size-24"
                                                    loading="lazy"
                                                />
                                            </div>

                                            {/* Text */}
                                            <div className="relative z-10 px-3 pb-3 pt-2 md:px-4 md:pb-4 md:pt-3">
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
                                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                            </BorderGlow>
                        </motion.div>

                        {/* ═══════ PROGRAM TILES ═══════ */}
                        {signaturePrograms.map((program, index) => {
                            const iconMap: Record<string, typeof ShieldCheck> = {
                                'shield-check': ShieldCheck,
                                'book-open': BookOpen,
                                'chef-hat': ChefHat,
                                'users': Users,
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
                                        colors={[program.accentColor, '#F59E0B', '#0E9EE4']}
                                        className="relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/60 bg-[rgba(255,255,255,0.72)] p-6 shadow-[0_20px_60px_-20px_rgba(4,47,46,0.1)] backdrop-blur-xl transition-all duration-300 hover:border-white/90 hover:bg-white/95 hover:shadow-[0_32px_80px_-24px_rgba(4,47,46,0.18)]"
                                    >
                                        {/* Accent orb */}
                                        <div
                                            className="pointer-events-none absolute -bottom-12 -right-12 size-44 rounded-full opacity-[0.08] blur-[60px] transition-all duration-700 group-hover:opacity-[0.18] group-hover:scale-125"
                                            style={{ backgroundColor: program.accentColor }}
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
                                                className="text-[0.68rem] font-bold uppercase tracking-[0.28em] transition-colors duration-300"
                                                style={{ color: program.accentColor }}
                                            >
                                                {program.eyebrow}
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h3 className="relative z-10 mt-4 text-xl font-semibold leading-tight text-[var(--school-ink)] md:text-2xl">
                                            {program.title}
                                        </h3>

                                        {/* Description — shows longDescription on wider tiles */}
                                        <p className="relative z-10 mt-3 flex-1 text-[0.84rem] leading-7 text-[var(--school-muted)] transition-colors group-hover:text-[var(--school-ink)]/80">
                                            {index >= 2 ? program.longDescription : program.description}
                                        </p>

                                        {/* Stats row */}
                                        <div className="relative z-10 mt-5 flex gap-6 border-t border-black/[0.04] pt-4">
                                            {program.stats.map((stat) => (
                                                <div key={stat.label}>
                                                    <div className="text-xl font-bold tracking-tight text-[var(--school-ink)]">
                                                        {stat.value}
                                                    </div>
                                                    <div className="mt-0.5 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[var(--school-muted)]">
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
                                                    className="rounded-full px-2.5 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-300"
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
                        description="Visi menjadi kompas, misi menjadi peta jalan. Keduanya membentuk identitas SMAN 1 Tenjo yang bergerak, bukan sekadar bertahan."
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
                                className="relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(165deg,rgba(4,47,46,0.97),rgba(15,118,110,0.92)_50%,rgba(13,158,228,0.85))] text-white shadow-[0_38px_90px_-50px_rgba(4,47,46,0.75)]"
                            >
                                {/* Hero Image */}
                                <div className="relative h-52 w-full shrink-0 overflow-hidden md:h-64">
                                    <img
                                        src="/images/values/visi-hero.png"
                                        alt="Visi SMAN 1 Tenjo"
                                        className="h-full w-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-b from-[rgba(4,47,46,0.4)] via-transparent to-[rgba(4,47,46,0.95)]" />
                                    {/* Floating VISI badge */}
                                    <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-4 py-1.5 backdrop-blur-md">
                                        <Trophy className="size-3.5 text-[var(--school-gold)]" />
                                        <span className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[var(--school-gold)]">Visi Sekolah</span>
                                    </div>
                                </div>

                                {/* Visi Content */}
                                <div className="relative z-10 flex flex-1 flex-col justify-between p-8 md:p-10">
                                    {/* Ambient glow */}
                                    <div className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-[var(--school-gold)]/8 blur-[100px]" />

                                    <div>
                                        <blockquote className="relative">
                                            <div className="absolute -left-3 -top-2 font-heading text-5xl leading-none text-white/15">"</div>
                                            <p className="relative z-10 font-heading text-xl leading-[1.5] md:text-2xl lg:text-[1.7rem]">
                                                Terwujudnya sekolah yang unggul dalam prestasi, berkarakter, berbudaya lingkungan, menguasai IPTEK, dan berdaya saing.
                                            </p>
                                            <div className="absolute -bottom-4 right-0 font-heading text-5xl leading-none text-white/15">"</div>
                                        </blockquote>
                                    </div>

                                {/* Interactive Pillar Showcase */}
                                <div className="mt-6">
                                    <VisiPillarShowcase />
                                </div>

                                    {/* Bottom line */}
                                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
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
                                <div className="flex size-9 items-center justify-center rounded-xl border border-[var(--school-green-200)] bg-[var(--school-green-50)] text-[var(--school-green-700)]">
                                    <Compass className="size-4" />
                                </div>
                                <div>
                                    <div className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[var(--school-green-700)]">Misi Sekolah</div>
                                    <div className="text-xs text-[var(--school-muted)]">5 langkah strategis</div>
                                </div>
                            </div>

                            {[
                                {
                                    num: '01',
                                    title: 'Pembelajaran Efektif',
                                    description: 'Melaksanakan pembelajaran yang efektif dengan menggunakan kurikulum nasional.',
                                    icon: BookOpen,
                                    accent: '#0F766E',
                                },
                                {
                                    num: '02',
                                    title: 'Administrasi Pembelajaran',
                                    description: 'Memfasilitasi pendidikan dalam meningkatkan instrumen-instrumen administrasi pembelajaran.',
                                    icon: GraduationCap,
                                    accent: '#0369A1',
                                },
                                {
                                    num: '03',
                                    title: 'Sekolah Bersih & Sehat',
                                    description: 'Menciptakan sekolah yang bersih dan sehat sebagai fondasi lingkungan belajar yang kondusif.',
                                    icon: Leaf,
                                    accent: '#15803D',
                                },
                                {
                                    num: '04',
                                    title: 'Ekstrakurikuler Unggulan',
                                    description: 'Meningkatkan kegiatan ekstrakurikuler sebagai wadah pengembangan bakat dan karakter siswa.',
                                    icon: Award,
                                    accent: '#7C3AED',
                                },
                                {
                                    num: '05',
                                    title: 'Sarana Prasarana',
                                    description: 'Melengkapi sarana prasarana yang menunjang sistem pembelajaran agar lebih optimal dan modern.',
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
                                        colors={[misi.accent, '#F59E0B', '#0E9EE4']}
                                        className="relative flex items-start gap-4 overflow-hidden rounded-3xl border border-white/60 bg-[rgba(255,255,255,0.72)] p-5 shadow-[0_16px_48px_-20px_rgba(4,47,46,0.1)] backdrop-blur-xl transition-all duration-300 hover:border-white/90 hover:bg-white/95 hover:shadow-[0_24px_64px_-20px_rgba(4,47,46,0.16)]"
                                    >
                                        {/* Accent orb */}
                                        <div
                                            className="pointer-events-none absolute -bottom-8 -right-8 size-32 rounded-full opacity-[0.06] blur-[50px] transition-all duration-700 group-hover/misi:opacity-[0.15] group-hover/misi:scale-150"
                                            style={{ backgroundColor: misi.accent }}
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
                                                className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-md text-[0.58rem] font-extrabold text-white"
                                                style={{ backgroundColor: misi.accent }}
                                            >
                                                {misi.num}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="relative z-10 min-w-0 flex-1">
                                            <h4 className="text-base font-semibold text-[var(--school-ink)] md:text-lg">
                                                {misi.title}
                                            </h4>
                                            <p className="mt-1.5 text-[0.82rem] leading-relaxed text-[var(--school-muted)] transition-colors group-hover/misi:text-[var(--school-ink)]/75">
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
                        title="Skala sekolah, fasilitas, dan tantangan logistik ditampilkan apa adanya."
                        description="Bukan profil generik. Data operasional sekolah justru dipakai sebagai dasar desain produk digital dan narasi institusional."
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
                                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />
                                    {/* Floating metric */}
                                    <div className="absolute bottom-4 left-5 flex items-center gap-2">
                                        <div className="flex size-9 items-center justify-center rounded-xl border border-[var(--school-green-200)] bg-white/90 text-[var(--school-green-700)] shadow-lg backdrop-blur-sm">
                                            <Map className="size-4" />
                                        </div>
                                        <div className="rounded-xl bg-white/90 px-3 py-1 shadow-lg backdrop-blur-sm">
                                            <span className="text-lg font-extrabold text-[var(--school-green-700)]">
                                                <AnimatedCounter value={11396} />
                                            </span>
                                            <span className="ml-1 text-xs font-semibold text-[var(--school-muted)]">m²</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 pt-4">
                                    <h3 className="text-xl font-bold text-[var(--school-ink)]">
                                        Lahan Sekolah 11.396 m²
                                    </h3>
                                    <p className="mt-2.5 text-sm leading-7 text-[var(--school-muted)]">
                                        Skala lahan yang luas memberi ruang untuk pembelajaran, eksplorasi proyek, dan aktivitas organisasi yang lebih hidup.
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-1.5">
                                        {['Lapangan', 'Taman', 'Gedung', 'Parkir'].map(tag => (
                                            <span key={tag} className="rounded-full border border-[var(--school-green-100)] bg-[var(--school-green-50)] px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--school-green-700)]">
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
                                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />
                                    {/* Floating metric */}
                                    <div className="absolute bottom-4 left-5 flex items-center gap-2">
                                        <div className="flex size-9 items-center justify-center rounded-xl border border-sky-200 bg-white/90 text-sky-700 shadow-lg backdrop-blur-sm">
                                            <ArrowLeftRight className="size-4" />
                                        </div>
                                        <div className="rounded-xl bg-white/90 px-3 py-1 shadow-lg backdrop-blur-sm">
                                            <span className="text-lg font-extrabold text-sky-700">
                                                <AnimatedCounter value={30} />
                                            </span>
                                            <span className="mx-1 text-xs font-bold text-[var(--school-muted)]">:</span>
                                            <span className="text-lg font-extrabold text-sky-700">
                                                <AnimatedCounter value={21} />
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 pt-4">
                                    <h3 className="text-xl font-bold text-[var(--school-ink)]">
                                        Moving Class Nyata
                                    </h3>
                                    <p className="mt-2.5 text-sm leading-7 text-[var(--school-muted)]">
                                        30 rombel dihadapkan pada 21 ruang kelas fisik, sehingga sistem belajar harus adaptif, tertata, dan antarbentrok.
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-1.5">
                                        {['Adaptif', 'Rotasi', 'Terjadwal'].map(tag => (
                                            <span key={tag} className="rounded-full border border-sky-100 bg-sky-50 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-sky-700">
                                                {tag}
                                            </span>
                                        ))}
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
                                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />
                                    {/* Floating metric */}
                                    <div className="absolute bottom-4 left-5 flex items-center gap-2">
                                        <div className="flex size-9 items-center justify-center rounded-xl border border-violet-200 bg-white/90 text-violet-700 shadow-lg backdrop-blur-sm">
                                            <FlaskConical className="size-4" />
                                        </div>
                                        <div className="rounded-xl bg-white/90 px-3 py-1 shadow-lg backdrop-blur-sm">
                                            <span className="text-lg font-extrabold text-violet-700">3 Lab</span>
                                            <span className="mx-1 text-xs font-bold text-[var(--school-muted)]">+</span>
                                            <span className="text-lg font-extrabold text-violet-700">2 Perpus</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 pt-4">
                                    <h3 className="text-xl font-bold text-[var(--school-ink)]">
                                        Fasilitas Akademik Kunci
                                    </h3>
                                    <p className="mt-2.5 text-sm leading-7 text-[var(--school-muted)]">
                                        Laboratorium dan perpustakaan menjadi simpul penting untuk pembelajaran Kurikulum Merdeka dan eksplorasi P5.
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-1.5">
                                        {['Lab IPA', 'Komputer', 'Perpustakaan'].map(tag => (
                                            <span key={tag} className="rounded-full border border-violet-100 bg-violet-50 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-violet-700">
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
                            title="P5, Panen Karya, dan MUSTIKARASA tampil sebagai galeri hidup."
                            description="Setiap karya dirancang untuk bisa menjadi halaman publik, artefak pembelajaran, dan dokumentasi reputasi sekolah."
                        />
                        <Button
                            asChild
                            variant="outline"
                            className="group/btn flex items-center gap-2 rounded-full border-[var(--school-green-200)] bg-white/80 px-6 transition-all hover:border-[var(--school-green-400)] hover:bg-[var(--school-green-50)] hover:shadow-lg"
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
                        {featuredWorks.map((work, index) => {
                            const fallbackImages: Record<string, string> = {
                                gastronomy: '/images/karya/fallback-gastronomi.png',
                                p5_project: '/images/karya/fallback-p5.png',
                                panen_karya: '/images/karya/fallback-panen-karya.png',
                            };
                            const fallbackSrc = fallbackImages[work.itemType] ?? '/images/karya/fallback-p5.png';
                            const imgSrc = work.imageUrl ?? fallbackSrc;

                            const typeColors: Record<string, { bg: string; text: string; border: string; accent: string }> = {
                                gastronomy: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', accent: '#D97706' },
                                p5_project: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', accent: '#0369A1' },
                                panen_karya: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', accent: '#0F766E' },
                            };
                            const tc = typeColors[work.itemType] ?? typeColors.panen_karya;

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
                                        colors={[tc.accent, '#F59E0B', '#0E9EE4']}
                                        className="relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_28px_80px_-48px_rgba(15,118,110,0.35)] transition-all duration-300 hover:shadow-[0_36px_100px_-44px_rgba(15,118,110,0.5)]"
                                    >
                                        {/* Hero Image */}
                                        <div className="relative h-56 w-full shrink-0 overflow-hidden">
                                            <img
                                                src={imgSrc}
                                                alt={work.title}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                loading="lazy"
                                                onError={(e) => {
                                                    const target = e.currentTarget;
                                                    if (target.src !== fallbackSrc) {
                                                        target.src = fallbackSrc;
                                                    }
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                                            {/* Type Badge floating */}
                                            <div className={cn(
                                                'absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.2em] backdrop-blur-md',
                                                tc.bg + '/90', tc.text, tc.border,
                                            )}>
                                                <Compass className="size-3" />
                                                {typeLabels[work.itemType] ?? work.itemType}
                                            </div>

                                            {/* Price badge if exists */}
                                            {work.priceEstimate && (
                                                <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[0.72rem] font-bold text-[var(--school-ink)] shadow-lg backdrop-blur-md">
                                                    {typeof work.priceEstimate === 'number'
                                                        ? `Rp ${numberFormatter.format(work.priceEstimate)}`
                                                        : work.priceEstimate}
                                                </div>
                                            )}

                                            {/* Bottom gradient text overlay */}
                                            <div className="absolute bottom-4 left-5 right-5">
                                                <h3 className="text-xl font-bold leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] md:text-2xl">
                                                    {work.title}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex flex-1 flex-col justify-between p-6">
                                            <div>
                                                <p className="text-sm leading-7 text-[var(--school-muted)]">
                                                    {work.summary ?? 'Karya siswa SMAN 1 Tenjo dalam program pembelajaran berbasis proyek.'}
                                                </p>
                                            </div>

                                            {/* Metadata */}
                                            <div className="mt-5 space-y-2.5 border-t border-black/[0.04] pt-4">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex size-6 items-center justify-center rounded-md bg-[var(--school-green-50)] text-[var(--school-green-700)]">
                                                        <Landmark className="size-3" />
                                                    </div>
                                                    <span className="text-[0.78rem] text-[var(--school-muted)]">
                                                        {work.projectTitle ?? 'Showcase karya siswa'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex size-6 items-center justify-center rounded-md bg-violet-50 text-violet-600">
                                                        <Sparkles className="size-3" />
                                                    </div>
                                                    <span className="text-[0.78rem] text-[var(--school-muted)]">
                                                        {work.themeName ?? 'Karya unggulan'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex size-6 items-center justify-center rounded-md bg-amber-50 text-amber-600">
                                                        <Users className="size-3" />
                                                    </div>
                                                    <span className="text-[0.78rem] text-[var(--school-muted)]">
                                                        {work.creatorName ?? 'Tim siswa'}
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

                <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
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
                            className="relative h-full overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_28px_80px_-50px_rgba(15,118,110,0.4)]"
                        >
                            {/* Header gradient */}
                            <div className="relative overflow-hidden bg-[linear-gradient(135deg,rgba(4,47,46,0.97),rgba(15,118,110,0.9)_60%,rgba(13,158,228,0.82))] px-8 pb-10 pt-8">
                                <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-white/[0.05] blur-[60px]" />
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-4 py-1.5 backdrop-blur-md">
                                    <Radar className="size-3.5 text-[var(--school-gold)]" />
                                    <span className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[var(--school-gold)]">Admissions Pulse</span>
                                </div>
                                <h2 className="mt-5 max-w-lg font-heading text-3xl leading-tight text-white md:text-4xl">
                                    PPDB zonasi dibuat transparan dan terasa langsung.
                                </h2>
                                <p className="mt-3 max-w-lg text-sm leading-7 text-white/60">
                                    Pengguna bisa memasukkan koordinat rumah, melihat garis jarak ke sekolah, dan membaca status zona secara visual.
                                </p>
                            </div>

                            {/* Quota grid */}
                            {ppdb ? (
                                <div className="px-6 pb-6 pt-6">
                                    <motion.div
                                        variants={staggerContainer}
                                        initial="hidden"
                                        whileInView="show"
                                        viewport={motionViewport}
                                        className="grid grid-cols-2 gap-3"
                                    >
                                        {ppdb.trackQuotas.map((quota, i) => {
                                            const accents = ['#0F766E', '#0369A1', '#D97706', '#7C3AED'];
                                            const icons = [MapPinned, ArrowLeftRight, Trophy, Award];
                                            const accent = accents[i % accents.length];
                                            const QuotaIcon = icons[i % icons.length];

                                            return (
                                                <motion.div
                                                    key={quota.trackType}
                                                    variants={fadeUp}
                                                    whileHover={{ y: -4, scale: 1.02 }}
                                                    className="group/q relative overflow-hidden rounded-2xl border border-white/80 bg-white p-5 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.08)] transition-all hover:shadow-[0_20px_52px_-16px_rgba(0,0,0,0.14)]"
                                                >
                                                    {/* Accent strip */}
                                                    <div
                                                        className="absolute left-0 top-0 h-full w-1 rounded-l-2xl"
                                                        style={{ backgroundColor: accent }}
                                                    />
                                                    {/* Ambient glow */}
                                                    <div
                                                        className="pointer-events-none absolute -bottom-6 -right-6 size-20 rounded-full opacity-[0.06] blur-[30px] transition-opacity group-hover/q:opacity-[0.15]"
                                                        style={{ backgroundColor: accent }}
                                                    />

                                                    <div className="relative z-10 flex items-start justify-between">
                                                        <div>
                                                            <div className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[var(--school-muted)]">
                                                                {quota.trackType}
                                                            </div>
                                                            <div className="mt-2 text-3xl font-extrabold" style={{ color: accent }}>
                                                                <AnimatedCounter value={quota.quotaSeats} />
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="flex size-9 items-center justify-center rounded-xl border"
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
                                                    <div className="relative z-10 mt-3">
                                                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/[0.04]">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                whileInView={{ width: `${quota.quotaPercentage}%` }}
                                                                viewport={{ once: true }}
                                                                transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                                                className="h-full rounded-full"
                                                                style={{ backgroundColor: accent }}
                                                            />
                                                        </div>
                                                        <div className="mt-1 text-[0.65rem] font-semibold text-[var(--school-muted)]">
                                                            {quota.quotaPercentage}% kuota
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
                                            className="group/cta w-full rounded-2xl bg-[linear-gradient(135deg,var(--school-gold-500),var(--school-gold-400))] px-6 text-[var(--school-ink)] shadow-[0_8px_24px_-8px_rgba(245,158,11,0.4)] transition-shadow hover:shadow-[0_12px_32px_-8px_rgba(245,158,11,0.55)]"
                                        >
                                            <Link href="/ppdb">
                                                Mulai Simulasi Zona
                                                <ArrowRight className="ml-2 size-4 transition-transform group-hover/cta:translate-x-1" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            ) : null}
                        </BorderGlow>
                    </motion.div>

                    {/* ═══ VIRTUAL TOUR SHELL ═══ */}
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={motionViewport}
                        className="group h-full"
                    >
                        <BorderGlow
                            borderRadius={32}
                            colors={['#F59E0B', '#D97706', '#FBBF24']}
                            className="relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(255,247,237,0.88))] shadow-[0_28px_80px_-50px_rgba(245,158,11,0.3)]"
                        >
                            {/* Header */}
                            <div className="p-8 pb-4">
                                <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5">
                                    <MapPinned className="size-3.5 text-amber-700" />
                                    <span className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-amber-700">Virtual Tour Shell</span>
                                </div>
                                <h2 className="mt-5 font-heading text-3xl leading-tight text-[var(--school-ink)] md:text-4xl">
                                    Lahan, laboratorium, dan perpustakaan disusun sebagai pengalaman jelajah.
                                </h2>
                            </div>

                            {/* Scene cards */}
                            <motion.div
                                variants={staggerContainer}
                                initial="hidden"
                                whileInView="show"
                                viewport={motionViewport}
                                className="flex-1 space-y-3 px-6"
                            >
                                {virtualTourScenes.map((scene, i) => (
                                    <motion.div
                                        key={scene.id}
                                        variants={fadeUp}
                                        whileHover={{ x: 6 }}
                                        className="group/scene relative overflow-hidden rounded-2xl border border-white/80 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-[0_12px_36px_-12px_rgba(0,0,0,0.1)]"
                                    >
                                        <div
                                            className="absolute left-0 top-0 h-full w-1 rounded-l-2xl transition-all duration-300 group-hover/scene:w-1.5"
                                            style={{ backgroundColor: scene.accentColor }}
                                        />
                                        <div className="flex items-start gap-4 p-4 pl-5">
                                            {/* Number badge */}
                                            <div
                                                className="flex size-9 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold text-white"
                                                style={{ backgroundColor: scene.accentColor }}
                                            >
                                                {String(i + 1).padStart(2, '0')}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div
                                                    className="text-[0.62rem] font-bold uppercase tracking-[0.24em]"
                                                    style={{ color: scene.accentColor }}
                                                >
                                                    {scene.eyebrow}
                                                </div>
                                                <div className="mt-1 text-base font-bold text-[var(--school-ink)]">
                                                    {scene.title}
                                                </div>
                                                <p className="mt-1 text-[0.78rem] leading-relaxed text-[var(--school-muted)] transition-colors group-hover/scene:text-[var(--school-ink)]/70">
                                                    {scene.description}
                                                </p>
                                            </div>
                                            {/* Arrow hint */}
                                            <ArrowRight
                                                className="mt-1 size-4 shrink-0 text-[var(--school-muted)] opacity-0 transition-all group-hover/scene:translate-x-1 group-hover/scene:opacity-100"
                                                style={{ color: scene.accentColor }}
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* CTA */}
                            <div className="p-6 pt-4">
                                <Button
                                    asChild
                                    className="group/vt w-full rounded-2xl border-2 border-amber-300 bg-[linear-gradient(135deg,rgba(245,158,11,0.1),rgba(217,119,6,0.08))] px-6 text-amber-800 shadow-none transition-all hover:bg-[linear-gradient(135deg,rgba(245,158,11,0.2),rgba(217,119,6,0.15))] hover:shadow-[0_8px_24px_-8px_rgba(245,158,11,0.3)]"
                                >
                                    <Link href="/virtual-tour">
                                        <MapPinned className="mr-2 size-4" />
                                        Buka Virtual Tour
                                        <ArrowRight className="ml-2 size-4 transition-transform group-hover/vt:translate-x-1" />
                                    </Link>
                                </Button>
                            </div>
                        </BorderGlow>
                    </motion.div>
                </section>

                {/* ═══════════ KEPEMIMPINAN DAN MEDIA ═══════════ */}
                <section className="space-y-8">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <SectionHeading
                            eyebrow="Kepemimpinan dan Media"
                            title="Struktur organisasi dan sorotan aktivitas bisa dibuka tanpa pindah halaman."
                            description="Data kepemimpinan aktif, teaser artikel, dan fondasi org chart interaktif untuk iterasi berikutnya."
                        />
                        <Button
                            asChild
                            variant="outline"
                            className="group/org flex items-center gap-2 rounded-full border-[var(--school-green-200)] bg-white/80 px-6 transition-all hover:border-[var(--school-green-400)] hover:bg-[var(--school-green-50)] hover:shadow-lg"
                        >
                            <Link href="/organisasi">
                                Buka Organisasi
                                <ArrowRight className="size-4 transition-transform group-hover/org:translate-x-1" />
                            </Link>
                        </Button>
                    </div>

                    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                        {/* Leadership Cards */}
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="show"
                            viewport={motionViewport}
                            className="grid gap-4"
                        >
                            {leadershipPreview.map((leader, i) => {
                                const leaderAccents = ['#0F766E', '#0369A1', '#7C3AED', '#D97706'];
                                const leaderIcons = [GraduationCap, ShieldCheck, Users, Award];
                                const la = leaderAccents[i % leaderAccents.length];
                                const LeaderIcon = leaderIcons[i % leaderIcons.length];

                                return (
                                    <motion.article
                                        key={leader.id}
                                        variants={fadeUp}
                                        whileHover={{ x: 6 }}
                                        className="group"
                                    >
                                        <BorderGlow
                                            borderRadius={27}
                                            colors={[la, '#0E9EE4', '#F59E0B']}
                                            className="relative overflow-hidden rounded-[1.7rem] border border-white/70 bg-white shadow-[0_20px_60px_-42px_rgba(15,118,110,0.35)] transition-all duration-300 hover:shadow-[0_28px_72px_-40px_rgba(15,118,110,0.45)]"
                                        >
                                            <div
                                                className="absolute left-0 top-0 h-full w-1 rounded-l-[1.7rem]"
                                                style={{ backgroundColor: la }}
                                            />
                                            <div className="flex items-center gap-4 p-5 pl-6">
                                                <div
                                                    className="flex size-11 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
                                                    style={{ background: `linear-gradient(135deg, ${la}, ${la}dd)` }}
                                                >
                                                    <LeaderIcon className="size-5" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[var(--school-muted)]">
                                                        {leader.unit}
                                                    </div>
                                                    <div className="mt-1 text-lg font-bold text-[var(--school-ink)]">
                                                        {leader.position}
                                                    </div>
                                                    <div className="mt-0.5 text-sm text-[var(--school-muted)]">
                                                        {leader.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </BorderGlow>
                                    </motion.article>
                                );
                            })}
                        </motion.div>

                        {/* Article Cards */}
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="show"
                            viewport={motionViewport}
                            className="grid gap-4"
                        >
                            {featuredArticles.map((article) => (
                                <Link key={article.id} href={article.slug ? `/berita/${article.slug}` : '/berita'}>
                                    <motion.article
                                        variants={fadeUp}
                                        whileHover={{ y: -4 }}
                                        className="group h-full"
                                    >
                                        <BorderGlow
                                            borderRadius={27}
                                            colors={['#F59E0B', '#D97706', '#FBBF24']}
                                            className="relative h-full overflow-hidden rounded-[1.7rem] border border-white/70 bg-white shadow-[0_20px_60px_-42px_rgba(245,158,11,0.3)] transition-all duration-300 hover:shadow-[0_28px_72px_-40px_rgba(245,158,11,0.4)]"
                                        >
                                            <div className="p-6">
                                                <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-amber-700">
                                                    <Newspaper className="size-3" />
                                                    {article.category ?? 'Aktivitas Sekolah'}
                                                </div>
                                                <h3 className="mt-3 text-xl font-bold text-[var(--school-ink)] transition-colors group-hover:text-[var(--school-green-700)]">
                                                    {article.title}
                                                </h3>
                                                <p className="mt-2.5 text-sm leading-7 text-[var(--school-muted)]">
                                                    {article.excerpt}
                                                </p>
                                                <div className="mt-4 flex items-center gap-3 border-t border-black/[0.04] pt-4">
                                                    <div className="flex size-7 items-center justify-center rounded-lg bg-[var(--school-green-50)] text-[var(--school-green-700)]">
                                                        <Users className="size-3" />
                                                    </div>
                                                    <span className="text-[0.72rem] font-semibold text-[var(--school-muted)]">
                                                        {article.authorName}
                                                    </span>
                                                    <span className="text-[var(--school-muted)]/30">•</span>
                                                    <div className="flex items-center gap-1.5 text-[0.72rem] text-[var(--school-muted)]">
                                                        <CalendarDays className="size-3" />
                                                        {article.publishedAt
                                                            ? dateFormatter.format(new Date(article.publishedAt))
                                                            : 'Publikasi terjadwal'}
                                                    </div>
                                                    <ArrowRight className="ml-auto size-4 text-[var(--school-muted)] opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                                                </div>
                                            </div>
                                        </BorderGlow>
                                    </motion.article>
                                </Link>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* ═══════════ EKSTRAKURIKULER DAN VIDEO ═══════════ */}
                <section className="space-y-8">
                    <SectionHeading
                        eyebrow="Ekstrakurikuler dan Video"
                        title="Ruang karakter, bakat, dan prestasi di luar kelas."
                        description="6 eskul resmi terdokumentasi membentuk identitas siswa SMAN 1 Tenjo — dari disiplin baris-berbaris hingga kepekaan sosial."
                    />

                    {/* ─── Eskul Cards Grid (Fakta-Style) ─── */}
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={motionViewport}
                        className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
                    >
                        {[
                            {
                                name: 'Paskibra',
                                image: '/images/eskul/paskibra.png',
                                description: 'Pasukan Pengibar Bendera yang melatih disiplin, kepemimpinan, dan keterampilan baris-berbaris tingkat tinggi.',
                                accent: '#DC2626',
                                icon: ShieldCheck,
                                metric: 'Juara',
                                metricSub: 'Prov.',
                                focus: ['Disiplin', 'Kepemimpinan', 'Baris-berbaris'],
                            },
                            {
                                name: 'Futsal',
                                image: '/images/eskul/futsal.png',
                                description: 'Olahraga futsal yang aktif diikuti siswa, membentuk sportivitas dan semangat kompetisi.',
                                accent: '#16A34A',
                                icon: Trophy,
                                metric: 'Aktif',
                                metricSub: 'Rutin',
                                focus: ['Olahraga', 'Kerjasama Tim', 'Sportivitas'],
                            },
                            {
                                name: 'Rohis',
                                image: '/images/eskul/rohis.png',
                                description: 'Rohani Islam — memperkuat iman, karakter Islami, dan kegiatan dakwah di lingkungan sekolah.',
                                accent: '#0F766E',
                                icon: Heart,
                                metric: 'Rutin',
                                metricSub: 'Mingguan',
                                focus: ['Keagamaan', 'Karakter', 'Dakwah'],
                            },
                            {
                                name: 'PMR',
                                image: '/images/eskul/pmr.png',
                                description: 'Palang Merah Remaja — fokus pada kesehatan, pertolongan pertama, dan kepedulian sosial.',
                                accent: '#E11D48',
                                icon: Heart,
                                metric: 'P3K',
                                metricSub: 'Terlatih',
                                focus: ['Kesehatan', 'P3K', 'Sosial'],
                            },
                            {
                                name: 'Pramuka',
                                image: '/images/eskul/pramuka.png',
                                description: 'Menanamkan jiwa mandiri, disiplin, dan peduli lingkungan melalui kegiatan kepanduan resmi.',
                                accent: '#A16207',
                                icon: Compass,
                                metric: 'Ambalan',
                                metricSub: 'Resmi',
                                focus: ['Kemandirian', 'Alam', 'Kepanduan'],
                            },
                            {
                                name: 'Pencak Silat',
                                image: '/images/eskul/silat.png',
                                description: 'Seni bela diri tradisional yang aktif ditunjukkan dalam demo dan lomba ekstrakurikuler.',
                                accent: '#7C3AED',
                                icon: Sparkles,
                                metric: 'Demo',
                                metricSub: 'Eskul',
                                focus: ['Bela Diri', 'Budaya', 'Ketangkasan'],
                            },
                        ].map((eskul) => (
                            <motion.article
                                key={eskul.name}
                                variants={fadeUp}
                                whileHover={{ y: -8 }}
                                className="group h-full"
                            >
                                <BorderGlow
                                    borderRadius={30}
                                    colors={[eskul.accent, '#0E9EE4', '#F59E0B']}
                                    className="relative h-full overflow-hidden rounded-[1.9rem] border border-white/70 bg-white shadow-[0_24px_74px_-44px_rgba(15,118,110,0.3)] transition-shadow duration-300 hover:shadow-[0_32px_90px_-40px_rgba(15,118,110,0.45)]"
                                >
                                    {/* Image */}
                                    <div className="relative h-44 w-full overflow-hidden">
                                        <img
                                            src={eskul.image}
                                            alt={eskul.name}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />
                                        {/* Floating metric */}
                                        <div className="absolute bottom-4 left-5 flex items-center gap-2">
                                            <div
                                                className="flex size-9 items-center justify-center rounded-xl border bg-white/90 shadow-lg backdrop-blur-sm"
                                                style={{ borderColor: `${eskul.accent}30`, color: eskul.accent }}
                                            >
                                                <eskul.icon className="size-4" />
                                            </div>
                                            <div className="rounded-xl bg-white/90 px-3 py-1 shadow-lg backdrop-blur-sm">
                                                <span
                                                    className="text-lg font-extrabold"
                                                    style={{ color: eskul.accent }}
                                                >
                                                    {eskul.metric}
                                                </span>
                                                <span className="ml-1 text-xs font-semibold text-[var(--school-muted)]">{eskul.metricSub}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 pt-4">
                                        <h3 className="text-xl font-bold text-[var(--school-ink)]">
                                            {eskul.name}
                                        </h3>
                                        <p className="mt-2 text-sm leading-7 text-[var(--school-muted)]">
                                            {eskul.description}
                                        </p>

                                        {/* Tags */}
                                        <div className="mt-4 flex flex-wrap gap-2.5">
                                            {eskul.focus.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="rounded-full px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.15em]"
                                                    style={{
                                                        backgroundColor: `${eskul.accent}0D`,
                                                        color: eskul.accent,
                                                        border: `1px solid ${eskul.accent}20`,
                                                    }}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </BorderGlow>
                            </motion.article>
                        ))}
                    </motion.div>

                    {/* ─── YouTube Video Section ─── */}
                    <div className="mt-4 space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="size-5"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[var(--school-ink)]">Video dari Channel Resmi</h3>
                                <p className="text-xs text-[var(--school-muted)]">SMAN 1 Tenjo Official — YouTube</p>
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
                            className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
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
                            ].map((video, i) => (
                                <motion.div
                                    key={video.id}
                                    variants={fadeUp}
                                    whileHover={{ y: -6 }}
                                    className="group"
                                >
                                    <BorderGlow
                                        borderRadius={27}
                                        colors={[video.accent, '#F59E0B', '#0E9EE4']}
                                        className="overflow-hidden rounded-[1.7rem] border border-white/70 bg-white shadow-[0_20px_60px_-42px_rgba(15,118,110,0.3)] transition-all duration-300 hover:shadow-[0_28px_72px_-40px_rgba(15,118,110,0.45)]"
                                    >
                                        {/* Thumbnail with play overlay */}
                                        <div className="relative aspect-video w-full overflow-hidden">
                                            <img
                                                src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                                                alt={video.title}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                                            {/* Play button */}
                                            <a
                                                href={`https://www.youtube.com/watch?v=${video.id}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="absolute inset-0 flex items-center justify-center"
                                            >
                                                <div className="flex size-14 items-center justify-center rounded-full bg-red-600 text-white shadow-[0_8px_30px_-6px_rgba(220,38,38,0.6)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_12px_40px_-6px_rgba(220,38,38,0.7)]">
                                                    <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 size-6"><path d="M8 5v14l11-7z" /></svg>
                                                </div>
                                            </a>

                                            {/* Category badge */}
                                            <div
                                                className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md"
                                                style={{ backgroundColor: `${video.accent}90` }}
                                            >
                                                {video.category}
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="p-5">
                                            <h4 className="line-clamp-2 text-sm font-bold leading-snug text-[var(--school-ink)] transition-colors group-hover:text-[var(--school-green-700)]">
                                                {video.title}
                                            </h4>
                                            <div className="mt-3 flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-[0.65rem] font-semibold text-[var(--school-muted)]">
                                                    <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5 text-red-500"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                                                    SMAN 1 Tenjo Official
                                                </div>
                                                <a
                                                    href={`https://www.youtube.com/watch?v=${video.id}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center gap-1 text-[0.65rem] font-bold text-[var(--school-green-700)] transition-colors hover:text-[var(--school-green-600)]"
                                                >
                                                    Tonton
                                                    <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                                                </a>
                                            </div>
                                        </div>
                                    </BorderGlow>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* ═══════════ ALUMNI SPOTLIGHT ═══════════ */}
                <section className="space-y-8">
                    <SectionHeading
                        eyebrow="Alumni Spotlight"
                        title="Jejak lulusan SMAN 1 Tenjo di berbagai penjuru."
                        description="Tracer study memastikan koneksi dengan alumni tetap terjaga — setiap profil yang tampil sudah mendapat persetujuan."
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
                            className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(160deg,rgba(4,47,46,0.97),rgba(15,118,110,0.92)_50%,rgba(13,158,228,0.85))] shadow-[0_38px_90px_-50px_rgba(4,47,46,0.75)]"
                        >
                            <div className="grid lg:grid-cols-[1fr_320px]">
                                <div className="relative z-10 p-8 text-white lg:p-10">
                                    {/* Ambient orb */}
                                    <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-white/[0.04] blur-[80px]" />

                                    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-4 py-1.5 backdrop-blur-sm">
                                        <GraduationCap className="size-3.5 text-[var(--school-gold)]" />
                                        <span className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[var(--school-gold)]">Alumni Network</span>
                                    </div>

                                    <h3 className="mt-5 font-heading text-2xl leading-tight md:text-3xl">
                                        Dari SMAN 1 Tenjo ke Seluruh Indonesia
                                    </h3>
                                    <p className="mt-3 max-w-lg text-sm leading-7 text-white/65">
                                        Lulusan kami tersebar di berbagai perguruan tinggi dan dunia kerja. Setiap jejak alumni menjadi inspirasi bagi generasi berikutnya.
                                    </p>

                                    {/* Stats Row */}
                                    <div className="mt-6 flex flex-wrap gap-6">
                                        {[
                                            { label: 'Total Alumni', value: alumniSpotlight.length > 0 ? alumniSpotlight.length : 1, suffix: '+' },
                                            { label: 'Angkatan', value: alumniSpotlight.length > 0 ? [...new Set(alumniSpotlight.map(a => a.graduationYear))].length : 1, suffix: '' },
                                        ].map((s) => (
                                            <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 backdrop-blur-sm">
                                                <div className="text-2xl font-extrabold text-white">
                                                    <AnimatedCounter value={s.value} />{s.suffix}
                                                </div>
                                                <div className="mt-0.5 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-white/50">{s.label}</div>
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
                                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[rgba(4,47,46,0.4)]" />
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
                                const avatarColors = ['#0F766E', '#7C3AED', '#D97706', '#0369A1', '#DC2626', '#E11D48'];
                                const ac = avatarColors[i % avatarColors.length];
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
                                                style={{ background: `linear-gradient(90deg, ${ac}, ${ac}80, transparent)` }}
                                            />

                                            <div className="p-6">
                                                {/* Header */}
                                                <div className="flex items-start gap-4">
                                                    <div
                                                        className="flex size-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-lg"
                                                        style={{ background: `linear-gradient(135deg, ${ac}, ${ac}cc)` }}
                                                    >
                                                        {initials}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h4 className="truncate text-lg font-bold text-[var(--school-ink)]">{alumnus.fullName}</h4>
                                                        <div className="mt-1 flex flex-wrap items-center gap-2">
                                                            <span
                                                                className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-white"
                                                                style={{ backgroundColor: ac }}
                                                            >
                                                                <GraduationCap className="size-3" />
                                                                {alumnus.graduationYear}
                                                            </span>
                                                            {alumnus.occupationTitle && (
                                                                <span className="rounded-full border border-black/[0.06] bg-[var(--school-green-50)] px-2.5 py-0.5 text-[0.6rem] font-semibold text-[var(--school-green-700)]">
                                                                    {alumnus.occupationTitle}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Institution */}
                                                {alumnus.institutionName && (
                                                    <div className="mt-4 flex items-center gap-2 rounded-xl border border-black/[0.04] bg-[var(--school-green-50)]/50 px-4 py-2.5">
                                                        <Landmark className="size-4 shrink-0 text-[var(--school-green-700)]" />
                                                        <span className="text-sm font-semibold text-[var(--school-ink)]">{alumnus.institutionName}</span>
                                                    </div>
                                                )}

                                                {/* Bio */}
                                                {alumnus.bio && (
                                                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[var(--school-muted)]">{alumnus.bio}</p>
                                                )}

                                                {/* Location */}
                                                {(alumnus.city || alumnus.province) && (
                                                    <div className="mt-4 flex items-center gap-1.5 border-t border-black/[0.04] pt-4 text-[0.72rem] text-[var(--school-muted)]">
                                                        <MapPinned className="size-3.5" />
                                                        <span>{[alumnus.city, alumnus.province].filter(Boolean).join(', ')}</span>
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
                                className="overflow-hidden rounded-[1.7rem] border border-dashed border-[var(--school-green-200)] bg-white/70 shadow-[0_16px_50px_-30px_rgba(15,118,110,0.2)]"
                            >
                                <div className="flex flex-col items-center justify-center p-10 text-center md:p-14">
                                    <div className="flex size-16 items-center justify-center rounded-2xl bg-[var(--school-green-50)] text-[var(--school-green-700)]">
                                        <GraduationCap className="size-7" />
                                    </div>
                                    <h4 className="mt-5 text-xl font-bold text-[var(--school-ink)]">Profil Alumni Segera Hadir</h4>
                                    <p className="mt-2 max-w-md text-sm leading-7 text-[var(--school-muted)]">
                                        Struktur tracer study sudah siap. Highlight alumni akan ditampilkan di sini setelah data dikonfirmasi dan persetujuan diperoleh.
                                    </p>
                                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                                        {['Universitas', 'Dunia Kerja', 'Wirausaha', 'Luar Negeri'].map((tag) => (
                                            <span key={tag} className="rounded-full border border-[var(--school-green-200)] bg-[var(--school-green-50)] px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--school-green-700)]">
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
