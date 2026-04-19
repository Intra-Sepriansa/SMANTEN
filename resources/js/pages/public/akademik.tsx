import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Activity,
    Award,
    BookOpen,
    BrainCircuit,
    Building,
    CalendarDays,
    Compass,
    FlaskConical,
    Heart,
    Landmark,
    LayoutDashboard,
    Library,
    Lightbulb,
    Microscope,
    Presentation,
    ShieldCheck,
    Sparkles,
    Target,
    Trophy,
    Users,
} from 'lucide-react';
import {
    FasilitasBarChart,
    KurikulumRadarChart,
} from '@/components/charts/school-charts';
import { AnimatedCounter } from '@/components/public/animated-counter';
import { BorderGlow } from '@/components/public/border-glow';
import { SectionHeading } from '@/components/public/section-heading';
import { fadeUp, motionViewport, staggerContainer } from '@/lib/motion';
import type { SchoolProfilePayload } from '@/types';

type AkademikPageProps = {
    school: SchoolProfilePayload;
};

const numberFormatter = new Intl.NumberFormat('id-ID');

export default function AkademikPage({ school }: AkademikPageProps) {
    const eskulList = [
        {
            name: 'Paskibra',
            image: '/images/eskul/paskibra.png',
            description:
                'Pasukan Pengibar Bendera yang melatih disiplin, kepemimpinan, dan keterampilan tingkat tinggi.',
            accent: '#DC2626',
            icon: ShieldCheck,
            metric: 'Juara',
            metricSub: 'Prov.',
            focus: ['Disiplin', 'Pemimpin'],
        },
        {
            name: 'Futsal',
            image: '/images/eskul/futsal.png',
            description:
                'Olahraga futsal aktif yang membentuk sportivitas dan semangat kompetisi yang sehat.',
            accent: '#16A34A',
            icon: Trophy,
            metric: 'Olahraga',
            metricSub: 'Rutin',
            focus: ['Fisik', 'Tim'],
        },
        {
            name: 'Rohis',
            image: '/images/eskul/rohis.png',
            description:
                'Rohani Islam — memperkuat iman, karakter Islami, dan kegiatan dakwah di lingkungan sekolah.',
            accent: '#0F766E',
            icon: Heart,
            metric: 'Rutin',
            metricSub: 'Kajian',
            focus: ['Agama', 'Karakter'],
        },
        {
            name: 'PMR',
            image: '/images/eskul/pmr.png',
            description:
                'Palang Merah Remaja — fokus pada kesehatan, pertolongan pertama, dan tanggap bencana.',
            accent: '#E11D48',
            icon: Activity,
            metric: 'P3K',
            metricSub: 'Siaga',
            focus: ['Kesehatan', 'Sosial'],
        },
        {
            name: 'Pramuka',
            image: '/images/eskul/pramuka.png',
            description:
                'Menanamkan jiwa mandiri, disiplin, dan peduli lingkungan melalui kepanduan.',
            accent: '#A16207',
            icon: Compass,
            metric: 'Ambalan',
            metricSub: 'Resmi',
            focus: ['Mandiri', 'Alam'],
        },
        {
            name: 'Pencak Silat',
            image: '/images/eskul/silat.png',
            description:
                'Seni bela diri tradisional yang mengasah ketangkasan fisik dan mental.',
            accent: '#7C3AED',
            icon: Sparkles,
            metric: 'Demo',
            metricSub: 'Seni',
            focus: ['Bela Diri', 'Fokus'],
        },
    ];

    return (
        <>
            <Head title="Akademik & Kurikulum">
                <meta
                    name="description"
                    content={`Akademik ${school.name}: ${school.curriculumName ?? 'Kurikulum Merdeka'}, P5, moving class, ${school.physicalClassroomCount} ruang kelas, ${school.laboratoryCount} laboratorium.`}
                />
                <meta
                    property="og:title"
                    content={`Akademik — ${school.name}`}
                />
                <meta
                    property="og:description"
                    content="Kurikulum Merdeka, Projek P5, Ekstrakurikuler, dan Tenaga Pendidik SMAN 1 Tenjo."
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
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/images/akademik/hero.png"
                            alt="Suasana Akademik SMAN 1 Tenjo"
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(4,47,46,0.95)] via-[rgba(4,47,46,0.55)] to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute inset-0 z-10 flex flex-col justify-end">
                        <div className="mx-auto w-full max-w-[84rem] p-5 pb-16 md:p-8 md:pb-24">
                            {/* Ambient orb */}
                            <div className="pointer-events-none absolute top-20 -right-20 size-96 rounded-full bg-[var(--school-gold)]/[0.08] blur-[100px]" />

                            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-4 py-1.5 backdrop-blur-sm">
                                <BookOpen className="size-3.5 text-[var(--school-gold)]" />
                                <span className="text-[0.68rem] font-bold tracking-[0.28em] text-[var(--school-gold)] uppercase">
                                    Akademik & Pembelajaran
                                </span>
                            </div>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="mt-4 max-w-3xl font-heading text-4xl leading-tight text-white md:text-5xl lg:text-6xl"
                            >
                                Pembelajaran yang menghubungkan teori dan
                                praktik.
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg"
                            >
                                Melalui{' '}
                                {school.curriculumName ?? 'Kurikulum Merdeka'},
                                SMAN 1 Tenjo menata pembelajaran, projek siswa,
                                laboratorium, dan pendampingan guru.
                            </motion.p>

                            {/* Quick Stats Row */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="mt-8 flex flex-wrap items-center gap-3 md:gap-5"
                            >
                                {[
                                    {
                                        label: 'Siswa Aktif',
                                        value: numberFormatter.format(
                                            school.studentCount,
                                        ),
                                        icon: Users,
                                        delay: 0,
                                    },
                                    {
                                        label: 'Rombel',
                                        value: numberFormatter.format(
                                            school.teachingGroupCount,
                                        ),
                                        icon: BookOpen,
                                        delay: 0.1,
                                    },
                                    {
                                        label: 'Pendidik',
                                        value: numberFormatter.format(
                                            school.staffCount,
                                        ),
                                        icon: Award,
                                        delay: 0.2,
                                    },
                                ].map((s) => (
                                    <motion.div
                                        key={s.label}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: s.delay + 0.3,
                                        }}
                                        whileHover={{ y: -4, scale: 1.02 }}
                                        className="group relative overflow-hidden rounded-[1.25rem] border border-white/10 bg-black/20 px-5 py-3.5 shadow-2xl backdrop-blur-md transition-colors hover:border-emerald-400/30 hover:bg-black/40"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 via-transparent to-emerald-400/0 transition-all duration-500 group-hover:from-emerald-400/[0.03] group-hover:to-emerald-400/[0.08]" />
                                        <div className="relative flex items-center gap-3">
                                            <div className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/10 shadow-inner transition-all group-hover:border-emerald-400/30 group-hover:bg-emerald-500/20">
                                                <s.icon className="size-4 text-[var(--school-gold)] transition-colors group-hover:text-emerald-300" />
                                            </div>
                                            <div>
                                                <div className="font-heading text-xl text-white">
                                                    {s.value}
                                                </div>
                                                <div className="mt-0.5 text-[0.6rem] font-bold tracking-[0.2em] text-emerald-200/60 uppercase group-hover:text-emerald-200">
                                                    {s.label}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </motion.section>

                {/* ═══════════ KURIKULUM MERDEKA ═══════════ */}
                <section id="kurikulum" className="scroll-mt-24 space-y-8">
                    <SectionHeading
                        eyebrow="Kurikulum Merdeka"
                        title="Kurikulum yang berfokus pada kompetensi siswa."
                        description="Pembelajaran disusun agar relevan, fleksibel, dan mendukung kebutuhan belajar siswa."
                    />

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={motionViewport}
                        className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
                    >
                        {/* 1. PEMBELAJARAN DIFERENSIASI (Giant Tile) */}
                        <motion.div
                            variants={fadeUp}
                            whileHover={{ y: -6 }}
                            className="group h-full md:col-span-2 lg:row-span-2"
                        >
                            <BorderGlow
                                borderRadius={32}
                                colors={['#10B981', '#059669', '#047857']}
                                className="relative h-full w-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#064E3B] shadow-[0_30px_80px_-40px_rgba(15,118,110,0.5)] transition-shadow duration-300 hover:shadow-[0_40px_100px_-30px_rgba(5,150,105,0.6)]"
                            >
                                <div
                                    className="absolute inset-0 z-0"
                                    style={{
                                        backgroundImage:
                                            'radial-gradient(ellipse at top right, #10B981, transparent 80%), linear-gradient(to bottom right, #064E3B, #022C22)',
                                    }}
                                />
                                {/* Ambient large icon */}
                                <BrainCircuit className="absolute -right-10 -bottom-10 size-[300px] text-white opacity-[0.03] transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-12" />
                                {/* Glowing mesh */}
                                <div className="absolute -top-20 -left-20 size-72 rounded-full bg-emerald-300 opacity-20 blur-[90px]" />

                                <div className="relative z-10 flex h-full flex-col justify-between p-8 md:p-12">
                                    <div className="flex size-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white shadow-xl backdrop-blur-md">
                                        <BrainCircuit className="size-8" />
                                    </div>
                                    <div className="mt-16 md:mt-24">
                                        <h4 className="font-heading text-3xl leading-tight text-white md:text-5xl">
                                            Pembelajaran Diferensiasi
                                        </h4>
                                        <p className="mt-4 max-w-lg text-[0.95rem] leading-[1.8] font-medium tracking-wide text-emerald-100/90">
                                            Materi dan metode belajar
                                            disesuaikan dengan kebutuhan siswa
                                            agar proses belajar lebih tepat
                                            sasaran.
                                        </p>
                                        <div className="mt-8 flex flex-wrap gap-3">
                                            {[
                                                'Personal',
                                                'Adaptif',
                                                'Inklusif',
                                            ].map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[0.65rem] font-bold tracking-[0.15em] text-emerald-50 uppercase shadow-sm backdrop-blur-md"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </BorderGlow>
                        </motion.div>

                        {/* 2. ASESMEN FORMATIF */}
                        <motion.div
                            variants={fadeUp}
                            whileHover={{ y: -6 }}
                            className="group h-full"
                        >
                            <BorderGlow
                                borderRadius={28}
                                colors={['#0369A1', '#0EA5E9', '#0284C7']}
                                className="relative h-full overflow-hidden rounded-[1.75rem] border border-white bg-white p-8 shadow-xl transition-all hover:shadow-2xl hover:shadow-sky-500/20"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white to-sky-50/50" />
                                <div className="absolute -top-10 -right-10 size-40 rounded-full bg-sky-100 opacity-50 blur-3xl transition-transform duration-700 group-hover:scale-150" />
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between">
                                        <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 text-white shadow-lg shadow-sky-500/30">
                                            <Target className="size-6" />
                                        </div>
                                    </div>
                                    <h4 className="mt-6 text-xl font-bold text-[var(--school-ink)]">
                                        Asesmen Formatif
                                    </h4>
                                    <p className="mt-3 text-[0.85rem] leading-relaxed text-slate-600">
                                        Evaluasi dilakukan berkala untuk
                                        membantu guru dan siswa memperbaiki
                                        proses belajar.
                                    </p>
                                    <div className="mt-6 flex flex-wrap gap-2">
                                        {['Evaluasi', 'Proses', 'Feedback'].map(
                                            (t) => (
                                                <span
                                                    key={t}
                                                    className="rounded-md border border-sky-100 bg-sky-50 px-2.5 py-1 text-[0.65rem] font-bold tracking-widest text-sky-700 uppercase shadow-sm"
                                                >
                                                    {t}
                                                </span>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </BorderGlow>
                        </motion.div>

                        {/* 3. MOVING CLASS */}
                        <motion.div
                            variants={fadeUp}
                            whileHover={{ y: -6 }}
                            className="group h-full"
                        >
                            <BorderGlow
                                borderRadius={28}
                                colors={['#7C3AED', '#A78BFA', '#5B21B6']}
                                className="relative h-full overflow-hidden rounded-[1.75rem] border border-white bg-white p-8 shadow-xl transition-all hover:shadow-2xl hover:shadow-violet-500/20"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white to-violet-50/50" />
                                <div className="absolute -top-10 -right-10 size-40 rounded-full bg-violet-100 opacity-50 blur-3xl transition-transform duration-700 group-hover:scale-150" />
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between">
                                        <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 text-white shadow-lg shadow-violet-500/30">
                                            <CalendarDays className="size-6" />
                                        </div>
                                    </div>
                                    <h4 className="mt-6 text-xl font-bold text-[var(--school-ink)]">
                                        Moving Class Terintegrasi
                                    </h4>
                                    <p className="mt-3 text-[0.85rem] leading-relaxed text-slate-600">
                                        Siswa secara mandiri berpindah menuju
                                        lab dan kelas tematik sesuai jadwal
                                        mapel, membiasakan ritme layaknya
                                        perguruan tinggi.
                                    </p>
                                    <div className="mt-6 flex flex-wrap gap-2">
                                        {[
                                            'Dinamis',
                                            'Efisien',
                                            'Terjadwal',
                                        ].map((t) => (
                                            <span
                                                key={t}
                                                className="rounded-md border border-violet-100 bg-violet-50 px-2.5 py-1 text-[0.65rem] font-bold tracking-widest text-violet-700 uppercase shadow-sm"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </BorderGlow>
                        </motion.div>

                        {/* 4. PEMBELAJARAN PRAKTIKUM (Wide Bottom Banner) */}
                        <motion.div
                            variants={fadeUp}
                            whileHover={{ y: -6 }}
                            className="group h-full md:col-span-2 lg:col-span-3"
                        >
                            <BorderGlow
                                borderRadius={28}
                                colors={['#D97706', '#FBBF24', '#B45309']}
                                className="relative h-full overflow-hidden rounded-[1.75rem] border border-white bg-white p-8 shadow-xl transition-all hover:shadow-2xl hover:shadow-amber-500/20"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white to-amber-50/50" />
                                <div className="absolute top-1/2 -right-20 size-72 -translate-y-1/2 rounded-full bg-amber-100 opacity-50 blur-[80px] transition-transform duration-700 group-hover:scale-150" />

                                <div className="relative z-10 flex flex-col items-start gap-6 md:flex-row md:items-center md:gap-10">
                                    <div className="flex size-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30">
                                        <Microscope className="size-7" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xl font-bold text-[var(--school-ink)]">
                                            Pembelajaran Praktikum Ekstensif
                                        </h4>
                                        <p className="mt-2 max-w-3xl text-[0.85rem] leading-relaxed text-slate-600">
                                            Siswa menggunakan{' '}
                                            {school.laboratoryCount}{' '}
                                            laboratorium untuk praktik,
                                            eksperimen, dan penguatan konsep.
                                        </p>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {[
                                                'Sains Terapan',
                                                'Eksperimen Mutakhir',
                                                'Laboratorium Tersertifikasi',
                                            ].map((t) => (
                                                <span
                                                    key={t}
                                                    className="rounded-md border border-amber-100 bg-amber-50 px-2.5 py-1 text-[0.65rem] font-bold tracking-widest text-amber-700 uppercase shadow-sm"
                                                >
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </BorderGlow>
                        </motion.div>
                    </motion.div>
                </section>

                {/* ═══════════ DATA ANALYTICS ═══════════ */}
                <section id="analytics" className="scroll-mt-24 space-y-8">
                    <SectionHeading
                        eyebrow="Data & Analitik"
                        title="Kapasitas infrastruktur dan profil kurikulum dalam angka."
                        description="Data operasional sekolah ditampilkan untuk memberi gambaran kapasitas belajar."
                    />
                    <div className="grid gap-6 lg:grid-cols-2">
                        <FasilitasBarChart
                            classrooms={school.physicalClassroomCount}
                            labs={school.laboratoryCount}
                            library={school.libraryCount}
                            rombel={school.teachingGroupCount}
                        />
                        <KurikulumRadarChart />
                    </div>
                </section>

                {/* ═══════════ PROJEK P5 ═══════════ */}
                <section id="p5" className="scroll-mt-24 space-y-8">
                    <SectionHeading
                        eyebrow="Projek P5"
                        title="Penguatan Profil Pelajar Pancasila melalui karya."
                        description="Projek P5 memberi ruang bagi siswa untuk memecahkan masalah dan menghasilkan karya."
                    />

                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={motionViewport}
                    >
                        <BorderGlow
                            borderRadius={30}
                            colors={['#0369A1', '#0F766E', '#7C3AED']}
                            className="relative overflow-hidden rounded-[1.9rem] border border-white/20 bg-slate-900 shadow-2xl"
                        >
                            <div className="relative flex min-h-[500px] w-full flex-col justify-center">
                                {/* Full Bleed Cinematic Background */}
                                <div className="absolute inset-0 z-0">
                                    <img
                                        src="/images/akademik/p5.png"
                                        alt="Proyek P5"
                                        className="h-full w-full object-cover opacity-40 mix-blend-luminosity"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-900/30 lg:from-slate-900/95" />
                                    {/* Ambient mesh glow */}
                                    <div className="absolute top-0 -left-32 size-96 rounded-full bg-emerald-500/20 blur-[120px]" />
                                </div>

                                <div className="relative z-10 p-8 md:p-12 lg:w-[70%]">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 backdrop-blur-md">
                                        <Lightbulb className="size-3.5 text-emerald-400" />
                                        <span className="text-[0.65rem] font-bold tracking-[0.22em] text-emerald-300 uppercase">
                                            Projek Lintas Disiplin
                                        </span>
                                    </div>
                                    <h3 className="mt-5 font-heading text-3xl leading-tight text-white md:text-5xl">
                                        Tema Nasional, Eksekusi Kontekstual
                                    </h3>
                                    <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                                        Melalui P5, siswa mempraktikkan nilai
                                        Pancasila dalam projek kolaboratif.
                                        Hasilnya dapat berupa produk,
                                        presentasi, atau dokumentasi belajar.
                                    </p>

                                    {/* Interactive Pill Network */}
                                    <div className="mt-10 flex flex-wrap gap-3 md:gap-4 lg:pr-10">
                                        {[
                                            {
                                                title: 'Gaya Hidup Berkelanjutan',
                                                icon: FlaskConical,
                                                accent: '#10B981',
                                                glow: 'shadow-emerald-500/30',
                                            },
                                            {
                                                title: 'Kearifan Lokal',
                                                icon: LayoutDashboard,
                                                accent: '#F59E0B',
                                                glow: 'shadow-amber-500/30',
                                            },
                                            {
                                                title: 'Bhinneka Tunggal Ika',
                                                icon: Users,
                                                accent: '#38BDF8',
                                                glow: 'shadow-sky-500/30',
                                            },
                                            {
                                                title: 'Bangunlah Jiwa Raganya',
                                                icon: Heart,
                                                accent: '#FB7185',
                                                glow: 'shadow-rose-500/30',
                                            },
                                            {
                                                title: 'Suara Demokrasi',
                                                icon: Presentation,
                                                accent: '#C084FC',
                                                glow: 'shadow-purple-500/30',
                                            },
                                            {
                                                title: 'Kewirausahaan',
                                                icon: Landmark,
                                                accent: '#2DD4BF',
                                                glow: 'shadow-teal-500/30',
                                            },
                                        ].map((t) => (
                                            <motion.div
                                                whileHover={{
                                                    y: -4,
                                                    scale: 1.05,
                                                }}
                                                key={t.title}
                                                className={`group flex cursor-pointer items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:${t.glow}`}
                                            >
                                                <t.icon
                                                    className="size-4 shrink-0 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12"
                                                    style={{ color: t.accent }}
                                                />
                                                <span className="text-xs font-bold tracking-wide text-white/90 group-hover:text-white">
                                                    {t.title}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </BorderGlow>
                    </motion.div>
                </section>

                {/* ═══════════ EKSTRAKURIKULER ═══════════ */}
                <section id="eskul" className="scroll-mt-24 space-y-8">
                    <SectionHeading
                        eyebrow="Ekstrakurikuler"
                        title="Pengembangan minat dan bakat siswa."
                        description="Ekstrakurikuler mendukung prestasi, kedisiplinan, dan potensi siswa di luar kelas."
                    />

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={motionViewport}
                        className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
                    >
                        {eskulList.map((eskul) => (
                            <motion.article
                                key={eskul.name}
                                variants={fadeUp}
                                whileHover={{ y: -8 }}
                                className="group h-full"
                            >
                                <BorderGlow
                                    borderRadius={30}
                                    colors={[
                                        eskul.accent,
                                        '#A8A29E',
                                        '#FFFFFF',
                                    ]}
                                    className="relative h-full min-h-[380px] overflow-hidden rounded-[1.9rem] border border-white/20 bg-slate-900 shadow-xl transition-shadow duration-300 hover:shadow-2xl"
                                >
                                    {/* Full Card Image */}
                                    <div className="absolute inset-0">
                                        <img
                                            src={eskul.image}
                                            alt={eskul.name}
                                            className="h-full w-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-110 group-hover:opacity-100"
                                            loading="lazy"
                                        />
                                        {/* Scrim Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                                    </div>

                                    {/* Content Overlay */}
                                    <div className="relative z-10 flex h-full flex-col justify-end p-7">
                                        <div className="flex items-center gap-3">
                                            <div className="relative flex size-11 items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-white/10 text-white shadow-lg backdrop-blur-md">
                                                <div
                                                    className="absolute inset-0 opacity-40 mix-blend-color"
                                                    style={{
                                                        backgroundColor:
                                                            eskul.accent,
                                                    }}
                                                />
                                                <eskul.icon className="relative z-10 size-5 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                                            </div>
                                            <div>
                                                <h3 className="font-heading text-2xl text-white">
                                                    {eskul.name}
                                                </h3>
                                                <div className="text-[0.65rem] font-bold tracking-widest text-[var(--school-gold)] uppercase opacity-90">
                                                    {eskul.metric} •{' '}
                                                    {eskul.metricSub}
                                                </div>
                                            </div>
                                        </div>

                                        <p className="mt-4 text-sm leading-relaxed text-slate-300">
                                            {eskul.description}
                                        </p>

                                        <div className="mt-5 flex flex-wrap gap-2">
                                            {eskul.focus.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[0.6rem] font-bold tracking-[0.15em] text-white uppercase backdrop-blur-md"
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
                </section>

                {/* ═══════════ TENAGA PENDIDIK & INFRASTRUKTUR ═══════════ */}
                <section id="guru" className="scroll-mt-24 space-y-8">
                    <SectionHeading
                        eyebrow="Pendidik & Infrastruktur"
                        title="Ekosistem pendukung pembelajaran."
                        description="Guru dan fasilitas sekolah mendukung pelaksanaan pembelajaran."
                    />

                    <div className="grid gap-6 md:grid-cols-[1fr_1.5fr]">
                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="show"
                            viewport={motionViewport}
                        >
                            <BorderGlow
                                borderRadius={30}
                                colors={['#34D399', '#10B981', '#059669']}
                                className="relative h-full overflow-hidden rounded-[1.9rem] border border-white/20 bg-[#064E3B] shadow-2xl"
                            >
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#022C22] to-transparent" />
                                <div className="relative z-10 flex h-full flex-col p-8 md:p-10">
                                    <div className="flex size-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-emerald-300 shadow-lg backdrop-blur-md">
                                        <Users className="size-6" />
                                    </div>
                                    <h3 className="mt-6 font-heading text-3xl text-white">
                                        Tenaga Pendidik
                                    </h3>
                                    <p className="mt-4 text-sm leading-7 text-emerald-100/80">
                                        Guru mendampingi proses belajar,
                                        pembinaan karakter, dan pengembangan
                                        potensi siswa.
                                    </p>
                                    <div className="mt-8 mt-auto mb-0 rounded-2xl border border-emerald-500/30 bg-emerald-900/40 p-6 backdrop-blur-md">
                                        <div className="text-[0.65rem] font-bold tracking-[0.2em] text-emerald-400 uppercase">
                                            Total PTK (Pendidik & Tenaga
                                            Kependidikan)
                                        </div>
                                        <div className="mt-2 text-5xl font-extrabold text-white">
                                            <AnimatedCounter
                                                value={school.staffCount}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </BorderGlow>
                        </motion.div>

                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="show"
                            viewport={motionViewport}
                        >
                            <BorderGlow
                                borderRadius={30}
                                colors={['#38BDF8', '#8B5CF6', '#4F46E5']}
                                className="relative h-full overflow-hidden rounded-[1.9rem] border border-white/20 bg-slate-900 shadow-2xl"
                            >
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tl from-slate-950 via-slate-900 to-indigo-900/40" />
                                <div className="pointer-events-none absolute -top-20 -right-20 size-72 rounded-full bg-violet-600/20 blur-[100px]" />
                                <div className="relative z-10 flex h-full flex-col p-8 md:p-10">
                                    <div className="flex size-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-sky-300 shadow-lg backdrop-blur-md">
                                        <Building className="size-6" />
                                    </div>
                                    <h3 className="mt-6 font-heading text-3xl text-white">
                                        Ruang Pembelajaran
                                    </h3>
                                    <p className="mt-4 text-sm leading-7 text-slate-300">
                                        Lahan seluas{' '}
                                        {numberFormatter.format(
                                            school.landAreaSquareMeters,
                                        )}{' '}
                                        m² mendukung ruang kelas, laboratorium,
                                        perpustakaan, dan kegiatan siswa.
                                    </p>

                                    <div className="mt-8 mt-auto mb-0 grid grid-cols-2 gap-4 md:grid-cols-3">
                                        {[
                                            {
                                                label: 'Ruang Kelas',
                                                value: school.physicalClassroomCount,
                                                icon: Landmark,
                                                accent: 'text-sky-400',
                                                bg: 'bg-sky-500/10',
                                            },
                                            {
                                                label: 'Laboratorium',
                                                value: school.laboratoryCount,
                                                icon: FlaskConical,
                                                accent: 'text-violet-400',
                                                bg: 'bg-violet-500/10',
                                            },
                                            {
                                                label: 'Perpustakaan',
                                                value: school.libraryCount,
                                                icon: Library,
                                                accent: 'text-indigo-400',
                                                bg: 'bg-indigo-500/10',
                                            },
                                        ].map((s) => (
                                            <div
                                                key={s.label}
                                                className={`rounded-2xl border border-white/10 ${s.bg} p-4 backdrop-blur-sm`}
                                            >
                                                <s.icon
                                                    className={`size-5 ${s.accent}`}
                                                />
                                                <div className="mt-4 text-3xl font-bold text-white">
                                                    <AnimatedCounter
                                                        value={s.value}
                                                    />
                                                </div>
                                                <div className="mt-1 text-[0.6rem] font-bold tracking-[0.18em] text-slate-400 uppercase">
                                                    {s.label}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </BorderGlow>
                        </motion.div>
                    </div>
                </section>
            </div>
        </>
    );
}
