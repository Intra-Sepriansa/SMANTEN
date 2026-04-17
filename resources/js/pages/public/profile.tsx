import { Head } from '@inertiajs/react';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
    Award,
    BookOpen,
    Building,
    ChevronRight,
    Compass,
    Cpu,
    GraduationCap,
    Heart,
    Landmark,
    Library,
    Mail,
    MapPinned,
    Phone,
    School2,
    ShieldCheck,
    Sparkles,
    Star,
    Target,
    Trophy,
    Users,
} from 'lucide-react';
import { AnimatedCounter } from '@/components/public/animated-counter';
import { BorderGlow } from '@/components/public/border-glow';
import { SectionHeading } from '@/components/public/section-heading';
import { SocialLinks } from '@/components/public/social-links';
import { ProfilPilarRadar, FasilitasBarChart } from '@/components/charts/school-charts';
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

    const customMarkerIcon = useMemo(() => {
        if (typeof window === 'undefined') return null;
        return new L.DivIcon({
            className: 'custom-leaflet-marker border-0 bg-transparent cursor-pointer',
            html: `<div class="relative flex h-8 w-8 items-center justify-center">
             <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
             <span class="relative inline-flex h-4 w-4 rounded-full bg-emerald-600 shadow-[0_0_15px_#10B981]"></span>
           </div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
        });
    }, []);

    const timelineRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress: timelineScrollProgress } = useScroll({
        target: timelineRef,
        offset: ["start center", "end center"]
    });
    const timelineHeight = useTransform(timelineScrollProgress, [0, 1], ["0%", "100%"]);

    return (
        <>
            <Head title="Profil Sekolah">
                <meta
                    name="description"
                    content={`Profil resmi ${school.name}: NPSN ${school.npsn}, Akreditasi ${school.accreditation}, ${school.curriculumName ?? 'Kurikulum Merdeka'}, BATARA KRESNA.`}
                />
                <meta property="og:title" content={`Profil — ${school.name}`} />
                <meta property="og:description" content="Identitas, nilai inti, data operasional, dan kontak resmi sekolah." />
            </Head>

            <div className="space-y-14">
                {/* ═══════════ HERO BANNER FULL SCREEN ═══════════ */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    id="hero"
                    className="relative w-[100vw] h-[85vh] lg:h-[100dvh] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-8 md:-mt-10 overflow-hidden bg-neutral-900"
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
                            <div className="pointer-events-none absolute -right-32 top-1/4 size-96 rounded-full bg-[var(--school-gold)]/[0.08] blur-[120px]" />

                           

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
                                Sekolah rujukan unggulan di Kabupaten Bogor. Menjadi pusat pendidikan yang mengembangkan wawasan kebangsaan, kompetensi global, dan integritas moral. Berlokasi di {school.address}.
                            </motion.p>

                            {/* Quick Stats Row */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="mt-10 flex flex-wrap gap-4"
                            >
                                {[
                                    { label: 'NPSN', value: school.npsn },
                                    { label: 'Akreditasi', value: school.accreditation },
                                    { label: 'Kurikulum', value: school.curriculumName ?? 'Merdeka' },
                                    { label: 'Jadwal', value: school.studyScheduleType ?? 'Aktif' },
                                ].map((s) => (
                                    <div
                                        key={s.label}
                                        className="rounded-2xl border border-white/10 bg-white/[0.06] px-6 py-4 backdrop-blur-sm transition-all hover:bg-white/[0.1] hover:border-white/20"
                                    >
                                        <div className="text-xl font-extrabold text-white md:text-2xl">{s.value}</div>
                                        <div className="mt-1 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/60">
                                            {s.label}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </motion.section>

                {/* ═══════════ SEJARAH SINGKAT ═══════════ */}
                <section id="sejarah" className="space-y-8 scroll-mt-24">
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
                            className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white p-8 md:p-14 shadow-[0_32px_90px_-50px_rgba(15,118,110,0.35)]"
                        >
                            <div className="pointer-events-none absolute -right-40 -top-40 size-96 rounded-full bg-[var(--school-green-50)] blur-[100px]" />
                            <div className="pointer-events-none absolute -bottom-40 -left-40 size-96 rounded-full bg-blue-50/50 blur-[100px]" />

                            <div className="relative z-10 mx-auto mb-16 flex max-w-3xl flex-col items-center text-center">
                                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--school-green-200)] bg-white px-4 py-1.5 shadow-sm">
                                    <Landmark className="size-3.5 text-[var(--school-green-700)]" />
                                    <span className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[var(--school-green-700)]">Perjalanan Historis</span>
                                </div>
                                <h3 className="mt-6 font-heading text-3xl leading-[1.2] text-[var(--school-ink)] md:text-4xl">
                                    Berdiri Atas Kebutuhan Pendidikan Menengah di Tenjo
                                </h3>
                                <p className="mt-4 text-base leading-relaxed text-[var(--school-muted)]">
                                    SMA Negeri 1 Tenjo berevolusi dari sekadar wacana pendidikan menjadi ekosistem belajar yang utuh. Lahan fisiknya menampung ribuan nyawa pembelajar, ditempa dengan Kurikulum Merdeka dan karakter autentik Batara Kresna.
                                </p>
                            </div>

                            {/* TIMELINE */}
                            <div ref={timelineRef} className="relative mx-auto max-w-4xl px-2 md:px-0">
                                {/* Base Vertical Line Desktop */}
                                <div className="absolute left-[20px] top-6 h-[calc(100%-30px)] w-[2px] bg-slate-100 md:left-1/2 md:-ml-px" />
                                
                                {/* Animated Running Line Desktop */}
                                <motion.div 
                                    className="absolute left-[20px] top-6 w-[2px] origin-top bg-gradient-to-b from-[var(--school-green-400)] via-[#0E9EE4] to-[var(--school-green-700)] shadow-[0_0_20px_#0EA5E9] md:left-1/2 md:-ml-px z-0"
                                    style={{ height: 'calc(100% - 30px)', scaleY: timelineHeight }}
                                />

                                <div className="space-y-12 md:space-y-0">
                                    {[
                                        {
                                            year: '2004',
                                            title: 'Pendirian Institusi Terpadu',
                                            desc: 'Sekolah didirikan untuk menjawab kebutuhan mendesak warga lokal Kecamatan Tenjo akan akses sekolah menengah atas unggulan yang berkualitas tanpa harus menempuh jarak jauh.',
                                            icon: MapPinned,
                                            align: 'right' // box on right, meaning base line is to its left
                                        },
                                        {
                                            year: '2010',
                                            title: 'Infrastruktur Tumbuh & Relokasi',
                                            desc: `Perpindahan strategis ke lokasi permanen JL. Raya Tenjo - Parung Panjang KM 03. Pengadaan lahan diperluas mencapai ${numberFormatter.format(school.landAreaSquareMeters)} m² dengan penambahan ruang lab dan lapangan olahraga mandiri.`,
                                            icon: Building,
                                            align: 'left' // box on left
                                        },
                                        {
                                            year: '2015',
                                            title: `Pencapaian Akreditasi ${school.accreditation} Penuh`,
                                            desc: `Fokus bergeser dari pembangunan fisik ke mutu pendidikan. Meraih status akreditasi ${school.accreditation} setelah melewati penilaian komprehensif, ditunjang oleh ${numberFormatter.format(school.physicalClassroomCount)} ruang percontohan.`,
                                            icon: Award,
                                            align: 'right'
                                        },
                                        {
                                            year: '2023 - Kini',
                                            title: 'Era Digital & Kurikulum Merdeka',
                                            desc: 'Merespons tuntutan zaman, SMAN 1 Tenjo mengubah model ajar secara fundamental. Sistem pembelajaran kolaboratif dan berbasis pengerjaan produk (Projek P5) dirilis masif demi membekali siswa dengan kompentensi adaptif abad-21.',
                                            icon: BookOpen,
                                            align: 'left'
                                        }
                                    ].map((item, idx) => (
                                        <div key={item.year} className={`relative flex flex-col md:flex-row md:items-center ${item.align === 'left' ? 'md:flex-row-reverse' : ''} ${idx !== 0 ? 'md:mt-16' : ''}`}>
                                            <div className="hidden w-1/2 md:block" />
                                            {/* Advanced Animated Dot */}
                                            <motion.div 
                                                initial={{ scale: 0, opacity: 0 }}
                                                whileInView={{ scale: 1, opacity: 1 }}
                                                viewport={{ once: false, margin: '-20% 0px -20% 0px' }}
                                                transition={{ type: 'spring', stiffness: 250, damping: 15 }}
                                                className="absolute left-[11px] top-6 z-10 flex size-[22px] flex-shrink-0 -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-[0_0_0_4px_rgba(255,255,255,1),0_0_20px_var(--school-green-400),0_0_40px_#0EA5E9] border-[3px] border-[var(--school-green-500)] md:left-1/2 md:top-1/2 md:-translate-y-1/2"
                                            >
                                                <div className="absolute inset-0 rounded-full bg-[var(--school-green-400)] blur-sm" />
                                                <div className="relative size-2 rounded-full bg-[var(--school-green-700)]" />
                                            </motion.div>

                                            {/* Content Box */}
                                            <div className={`ml-12 md:w-1/2 md:px-12 ${item.align === 'left' ? 'md:ml-0 md:text-right' : 'md:ml-0'}`}>
                                                <motion.div
                                                    initial={{ opacity: 0, x: item.align === 'left' ? -80 : 80 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
                                                    transition={{ delay: 0.1, type: 'spring', stiffness: 100, damping: 14 }}
                                                    whileHover={{ scale: 1.02, y: -4 }}
                                                    className={`group flex flex-col rounded-2xl border border-black/[0.04] bg-white p-7 shadow-lg transition-all hover:bg-slate-50/50 hover:border-[var(--school-green-200)] hover:shadow-[0_25px_50px_-20px_rgba(14,158,228,0.4)] ${item.align === 'left' ? 'md:items-end' : ''}`}
                                                >
                                                    <div className={`inline-flex items-center gap-2 rounded-full bg-[var(--school-green-50)] px-3 py-1 shadow-inner border border-[var(--school-green-100)] ${item.align === 'left' ? 'md:flex-row-reverse' : ''}`}>
                                                        <div className="flex size-6 items-center justify-center rounded-full bg-white text-[var(--school-green-700)] shadow-sm">
                                                            <item.icon className="size-3.5" />
                                                        </div>
                                                        <span className="text-[0.68rem] font-black tracking-[0.1em] text-[var(--school-green-800)]">{item.year}</span>
                                                    </div>
                                                    <h4 className="mt-4 text-[1.3rem] font-bold leading-tight text-[var(--school-ink)]">{item.title}</h4>
                                                    <p className={`mt-3 text-sm leading-[1.8] text-[var(--school-muted)] ${item.align === 'left' ? 'md:text-right' : ''}`}>
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
                <section className="space-y-8 scroll-mt-24">
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
                <section id="visi-misi" className="space-y-8 scroll-mt-24">
                    <SectionHeading
                        eyebrow="Visi & Misi"
                        title="Arah dan nilai yang menjadi kompas sekolah."
                        description="Visi dan misi bukan slogan dinding — melainkan parameter operasional yang dikerjakan setiap hari."
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
                            <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-white/[0.04] blur-[80px]" />
                            <div className="p-8 text-white md:p-12">
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-4 py-1.5 backdrop-blur-sm">
                                    <Target className="size-3.5 text-[var(--school-gold)]" />
                                    <span className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[var(--school-gold)]">Visi Sekolah</span>
                                </div>

                                <h3 className="mt-5 max-w-3xl font-heading text-2xl leading-tight md:text-3xl">
                                    Terwujudnya peserta didik yang berprestasi, berkarakter, berbudaya lingkungan, menguasai IPTEK, serta mampu bersaing di era global.
                                </h3>

                                <div className="mt-8">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-4 py-1.5 backdrop-blur-sm">
                                        <Compass className="size-3.5 text-[var(--school-gold)]" />
                                        <span className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[var(--school-gold)]">Misi Sekolah</span>
                                    </div>

                                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                                        {[
                                            { text: 'Meningkatkan prestasi akademik dan non-akademik melalui pembelajaran yang inovatif dan kompetitif.', icon: Trophy },
                                            { text: 'Membentuk karakter peserta didik yang beriman, bertakwa, berakhlak mulia, dan berbudi luhur.', icon: Heart },
                                            { text: 'Menciptakan lingkungan sekolah yang bersih, asri, dan berbudaya lingkungan sesuai program Adiwiyata.', icon: Sparkles },
                                            { text: 'Menguasai ilmu pengetahuan dan teknologi sebagai bekal menghadapi tantangan era global.', icon: BookOpen },
                                            { text: 'Mengembangkan potensi dan bakat peserta didik melalui kegiatan ekstrakurikuler yang beragam.', icon: Star },
                                            { text: 'Membangun kerjasama yang harmonis antara sekolah, orang tua, dan masyarakat.', icon: Users },
                                        ].map((m) => (
                                            <div key={m.text} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm">
                                                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.1]">
                                                    <m.icon className="size-4 text-[var(--school-gold)]" />
                                                </div>
                                                <p className="text-sm leading-relaxed text-white/75">{m.text}</p>
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
                            description={batara.description ?? 'Pedoman moral autentik SMAN 1 Tenjo.'}
                        />
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="show"
                            viewport={motionViewport}
                            className="grid gap-5 md:grid-cols-2 lg:grid-cols-4"
                        >
                            {[
                                { title: 'Beriman', desc: 'Menanamkan keimanan sebagai pondasi utama karakter peserta didik.', accent: '#0F766E', icon: Heart, image: '/images/values/beriman.png' },
                                { title: 'Bertaqwa', desc: 'Ketaqwaan diwujudkan dalam amal ibadah dan perilaku sehari-hari.', accent: '#0369A1', icon: ShieldCheck, image: '/images/values/bertaqwa.png' },
                                { title: 'Berkarakter', desc: 'Karakter kuat dibentuk melalui pembiasaan positif di lingkungan sekolah.', accent: '#7C3AED', icon: Star, image: '/images/values/berkarakter.png' },
                                { title: 'Bebas Narkoba', desc: 'Komitmen penuh terhadap lingkungan sekolah yang bersih dari narkoba.', accent: '#DC2626', icon: ShieldCheck, image: '/images/values/bebas-narkoba.png' },
                            ].map((v) => (
                                <motion.div key={v.title} variants={fadeUp} whileHover={{ y: -6 }} className="group h-full">
                                    <BorderGlow
                                        borderRadius={27}
                                        colors={[v.accent, '#F59E0B', '#0E9EE4']}
                                        className="relative h-full overflow-hidden rounded-[1.7rem] border border-white/70 bg-white shadow-[0_22px_70px_-44px_rgba(15,118,110,0.35)] transition-shadow duration-300 hover:shadow-[0_30px_80px_-40px_rgba(15,118,110,0.5)]"
                                    >
                                        <div className="relative h-36 w-full overflow-hidden">
                                            <img src={v.image} alt={v.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />
                                            <div className="absolute bottom-3 left-4">
                                                <div
                                                    className="flex size-9 items-center justify-center rounded-xl border bg-white/90 shadow-lg backdrop-blur-sm"
                                                    style={{ borderColor: `${v.accent}30`, color: v.accent }}
                                                >
                                                    <v.icon className="size-4" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <h4 className="text-lg font-bold text-[var(--school-ink)]">{v.title}</h4>
                                            <p className="mt-2 text-sm leading-relaxed text-[var(--school-muted)]">{v.desc}</p>
                                        </div>
                                    </BorderGlow>
                                </motion.div>
                            ))}
                        </motion.div>
                    </section>
                ) : null}

                {/* ═══════════ STRUKTUR ORGANISASI ═══════════ */}
                <section id="struktur-organisasi" className="space-y-8 scroll-mt-24">
                    <SectionHeading
                        eyebrow="Struktur Organisasi"
                        title="Hierarki kepemimpinan yang menjalankan roda pendidikan."
                        description="Setiap posisi memiliki peran strategis dalam menjaga kualitas pembelajaran dan pengembangan siswa."
                    />

                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={motionViewport}
                    >
                        <BorderGlow
                            borderRadius={32}
                            colors={['#0F766E', '#0369A1', '#D97706']}
                            className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-slate-50/50 p-8 shadow-[0_32px_90px_-50px_rgba(15,118,110,0.35)] md:p-14"
                        >
                            {/* Ambient background meshes */}
                            <div className="pointer-events-none absolute left-1/2 top-0 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--school-green-100)] opacity-40 blur-[120px]" />

                            <div className="relative z-10 w-full">
                                {/* 1. Kepala Sekolah - Top Node */}
                                <div className="flex flex-col items-center justify-center">
                                    <motion.div 
                                        whileHover={{ y: -5, scale: 1.02 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        className="group relative flex w-full max-w-[320px] flex-col items-center justify-center rounded-3xl border border-white bg-white/80 p-8 shadow-[0_20px_50px_-20px_rgba(15,118,110,0.4)] backdrop-blur-xl transition-all hover:border-[var(--school-green-200)] hover:shadow-[0_25px_60px_-20px_rgba(15,118,110,0.5)]"
                                    >
                                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/60 to-transparent" />
                                        <div className="relative flex size-20 items-center justify-center rounded-3xl bg-[linear-gradient(135deg,var(--school-green-600),var(--school-green-800))] text-white shadow-[0_10px_30px_-10px_var(--school-green-600)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                                            <School2 className="size-8 drop-shadow-md" />
                                        </div>
                                        <div className="relative mt-6 text-center">
                                            <div className="inline-flex rounded-full bg-[var(--school-green-50)] px-3 py-1 border border-[var(--school-green-100)]">
                                                <span className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[var(--school-green-700)]">Kepala Sekolah</span>
                                            </div>
                                            <h4 className="mt-3 font-heading text-2xl text-[var(--school-ink)]">{school.principalName ?? 'Pejabat Aktif'}</h4>
                                            <p className="mt-1 text-xs text-[var(--school-muted)]">Simpul kepemimpinan & manajerial utama</p>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Vertical drop from Principal */}
                                <div className="mx-auto h-12 w-0.5 bg-gradient-to-b from-[var(--school-green-300)] to-[#0E9EE4] md:h-16" />

                                {/* Wakasek Row Container */}
                                <div className="relative">
                                    {/* Horizontal distribution line (Desktop only) */}
                                    <div className="absolute left-[12.5%] right-[12.5%] top-0 hidden h-[2px] bg-gradient-to-r from-[#0369A1] via-[#D97706] to-[#E11D48] md:block" />

                                    {/* Vertical continuous line (Mobile only) */}
                                    <div className="absolute bottom-0 left-1/2 top-0 -ml-px block w-0.5 bg-gradient-to-b from-[#0E9EE4] via-[#D97706] to-[#E11D48] md:hidden" />

                                    <div className="grid gap-6 md:grid-cols-4 lg:gap-8 relative z-10">
                                        {[
                                            { title: 'Wakil Bidang Kurikulum', person: 'Tim Akademik', desc: 'Desain akademik & ritme PBM.', icon: BookOpen, accent: '#0369A1', glow: 'rgba(3,105,161,0.2)' },
                                            { title: 'Wakil Bidang Kesiswaan', person: 'Tim Kesiswaan', desc: 'Ekosistem, eskul & karakter.', icon: Users, accent: '#7C3AED', glow: 'rgba(124,58,237,0.2)' },
                                            { title: 'Wakil Bidang Sarpras', person: 'Tim Infrastruktur', desc: 'Fasilitas & kesiapan operasional.', icon: Building, accent: '#D97706', glow: 'rgba(217,119,6,0.2)' },
                                            { title: 'Wakil Bidang Humas', person: 'Tim Komunikasi', desc: 'Hubungan eksternal & publikasi.', icon: Heart, accent: '#E11D48', glow: 'rgba(225,29,72,0.2)' },
                                        ].map((wk, i) => (
                                            <div key={wk.title} className="relative flex flex-col items-center">
                                                {/* Connecting stem from horizontal line (Desktop) */}
                                                <div className="hidden h-8 w-[2px] md:block" style={{ backgroundImage: `linear-gradient(to bottom, ${wk.accent}, transparent)` }} />
                                                
                                                {/* Connecting dot for mobile */}
                                                <div className="absolute top-1/2 z-0 -translate-y-1/2 size-3 rounded-full md:hidden" style={{ backgroundColor: wk.accent }} />

                                                <motion.div 
                                                    whileHover={{ y: -6, scale: 1.03 }}
                                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                                    className="group relative z-10 w-full rounded-[1.4rem] border border-white bg-white p-6 shadow-xl transition-all duration-300"
                                                    style={{ boxShadow: `0 15px 35px -15px ${wk.glow}` }}
                                                >
                                                    {/* Accent border top strip */}
                                                    <div className="absolute inset-x-0 top-0 h-1 rounded-t-[1.4rem] opacity-70 transition-opacity group-hover:opacity-100" style={{ backgroundColor: wk.accent }} />
                                                    
                                                    <div
                                                        className="flex size-12 items-center justify-center rounded-2xl text-white shadow-lg transition-transform duration-500 group-hover:rotate-6"
                                                        style={{ background: `linear-gradient(135deg, ${wk.accent}, ${wk.accent}ee)` }}
                                                    >
                                                        <wk.icon className="size-5" />
                                                    </div>
                                                    <h5 className="mt-5 text-[0.95rem] font-bold leading-tight text-[var(--school-ink)]">{wk.title}</h5>
                                                    <div className="mt-1 text-[0.65rem] font-bold uppercase tracking-[0.15em]" style={{ color: wk.accent }}>{wk.person}</div>
                                                    <p className="mt-3 text-[0.8rem] leading-relaxed text-[var(--school-muted)]">{wk.desc}</p>
                                                </motion.div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Vertical drop from Wakasek level */}
                                <div className="mx-auto mt-6 h-12 w-0.5 bg-gradient-to-b from-[#E11D48] to-[#0F766E]/30 md:h-16 md:mt-0" />

                                {/* Support Staff Row Base */}
                                <div className="mx-auto max-w-4xl">
                                    <div className="rounded-[1.6rem] border border-black/[0.04] bg-white/60 p-6 shadow-inner backdrop-blur-md md:p-8">
                                        <div className="mb-6 flex items-center justify-center gap-2">
                                            <ShieldCheck className="size-4 text-[var(--school-green-600)]" />
                                            <h6 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--school-green-700)]">Unsur Pelaksana Teknis & Pendukung</h6>
                                        </div>
                                        
                                        <div className="grid gap-4 md:grid-cols-3">
                                            {[
                                                { title: 'Bimbingan Konseling', subtitle: 'Pusat layanan psikologi', desc: 'Pendampingan aktif dan penguatan mental perkembangan siswa.', icon: Compass },
                                                { title: 'Wali Kelas', subtitle: 'Manajer Rombel', desc: 'Menyambungkan dan mengeksekusi kebijakan sekolah ke rombel harian.', icon: GraduationCap },
                                                { title: 'Operator & Tenaga Teknis', subtitle: 'Urat Nadi Data', desc: 'Menjaga akurasi ekosistem data administratif dan infrastruktur digital.', icon: Cpu },
                                            ].map((sup) => (
                                                <motion.div 
                                                    key={sup.title} 
                                                    whileHover={{ y: -3 }}
                                                    className="group flex flex-col rounded-xl border border-white bg-slate-50 p-5 shadow-sm transition hover:bg-white hover:shadow-md"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--school-green-100)] text-[var(--school-green-700)] transition-colors group-hover:bg-[var(--school-green-600)] group-hover:text-white">
                                                            <sup.icon className="size-4" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-[var(--school-ink)]">{sup.title}</div>
                                                            <div className="text-[0.6rem] font-bold uppercase tracking-[0.1em] text-[var(--school-green-600)]">{sup.subtitle}</div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 text-xs leading-relaxed text-[var(--school-muted)]">{sup.desc}</div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </BorderGlow>
                    </motion.div>
                </section>

                {/* ═══════════ STRUKTUR KURIKULUM ═══════════ */}
                <section id="kurikulum" className="space-y-8 scroll-mt-24">
                    <SectionHeading
                        eyebrow="Kurikulum"
                        title="Kurikulum Merdeka sebagai pondasi pembelajaran."
                        description="Pembelajaran dirancang untuk memunculkan kompetensi, bukan sekadar mengejar ketuntasan materi."
                    />

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={motionViewport}
                        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                    >
                        {/* 1. KURIKULUM MERDEKA (Giant Hero Tile) */}
                        <motion.div variants={fadeUp} whileHover={{ y: -6 }} className="group md:col-span-2 lg:row-span-2 h-full">
                            <BorderGlow
                                borderRadius={32}
                                colors={['#10B981', '#059669', '#047857']}
                                className="relative h-full w-full overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_30px_80px_-40px_rgba(15,118,110,0.5)] transition-shadow duration-300 hover:shadow-[0_40px_100px_-30px_rgba(5,150,105,0.6)] bg-[#064E3B]"
                            >
                                <div className="absolute inset-0 z-0" style={{ backgroundImage: 'radial-gradient(ellipse at top right, #10B981, transparent 80%), linear-gradient(to bottom right, #064E3B, #022C22)' }} />
                                {/* Ambient large icon */}
                                <BookOpen className="absolute -bottom-10 -right-10 size-[300px] text-white opacity-5 transition-transform duration-700 group-hover:-rotate-12 group-hover:scale-110" />
                                {/* Glowing mesh */}
                                <div className="absolute -left-20 -top-20 size-72 rounded-full bg-emerald-300 opacity-20 blur-[90px]" />

                                <div className="relative z-10 flex h-full flex-col justify-between p-8 md:p-12">
                                    <div className="flex size-16 items-center justify-center rounded-2xl bg-white/10 text-white shadow-xl backdrop-blur-md border border-white/20">
                                        <BookOpen className="size-8" />
                                    </div>
                                    <div className="mt-16 md:mt-24">
                                        <h4 className="font-heading text-3xl leading-tight text-white md:text-5xl">Kurikulum Merdeka</h4>
                                        <p className="mt-4 max-w-lg text-[0.95rem] leading-[1.8] text-emerald-100/90 font-medium tracking-wide">
                                            Bukan sekadar pedoman, melainkan filosofi fleksibilitas dalam merancang pengalaman belajar. SMAN 1 Tenjo telah beradaptasi penuh untuk memenuhi kebutuhan, fase, dan konteks unik setiap siswa.
                                        </p>
                                        <div className="mt-8 flex flex-wrap gap-3">
                                            {['Fleksibilitas Penuh', 'Diferensiasi Presisi', 'Pembelajaran Kontekstual'].map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="rounded-full bg-white/10 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-emerald-50 border border-white/20 backdrop-blur-md shadow-sm"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </BorderGlow>
                        </motion.div>

                        {/* 2. PROJEK P5 */}
                        <motion.div variants={fadeUp} whileHover={{ y: -6 }} className="group h-full">
                            <BorderGlow borderRadius={28} colors={['#0369A1', '#0EA5E9', '#0284C7']} className="relative overflow-hidden h-full rounded-[1.75rem] border border-white bg-white p-8 shadow-xl hover:shadow-2xl hover:shadow-sky-500/20 transition-all">
                                <div className="absolute inset-0 bg-gradient-to-br from-white to-sky-50/50" />
                                <div className="absolute -right-10 -top-10 size-40 rounded-full bg-sky-100 opacity-50 blur-3xl transition-transform duration-700 group-hover:scale-150" />
                                <div className="relative z-10">
                                    <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 text-white shadow-lg shadow-sky-500/30">
                                        <Target className="size-6" />
                                    </div>
                                    <h4 className="mt-6 text-xl font-bold text-[var(--school-ink)]">Projek P5</h4>
                                    <p className="mt-3 text-[0.85rem] leading-relaxed text-slate-600">
                                        Penguatan Profil Pelajar Pancasila lewat proyek karya nyata yang melepaskan dinding pemisah antar mata pelajaran.
                                    </p>
                                    <div className="mt-6 flex flex-wrap gap-2">
                                        {['7 Tema', '60+ Karya', 'Lintas Disiplin'].map((t) => (
                                            <span key={t} className="rounded-md bg-sky-50 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-sky-700 border border-sky-100 shadow-sm">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            </BorderGlow>
                        </motion.div>

                        {/* 3. MOVING CLASS */}
                        <motion.div variants={fadeUp} whileHover={{ y: -6 }} className="group h-full">
                            <BorderGlow borderRadius={28} colors={['#7C3AED', '#A78BFA', '#5B21B6']} className="relative overflow-hidden h-full rounded-[1.75rem] border border-white bg-white p-8 shadow-xl hover:shadow-2xl hover:shadow-violet-500/20 transition-all">
                                <div className="absolute inset-0 bg-gradient-to-br from-white to-violet-50/50" />
                                <div className="absolute -right-10 -top-10 size-40 rounded-full bg-violet-100 opacity-50 blur-3xl transition-transform duration-700 group-hover:scale-150" />
                                <div className="relative z-10">
                                    <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 text-white shadow-lg shadow-violet-500/30">
                                        <Compass className="size-6" />
                                    </div>
                                    <h4 className="mt-6 text-xl font-bold text-[var(--school-ink)]">Moving Class</h4>
                                    <p className="mt-3 text-[0.85rem] leading-relaxed text-slate-600">
                                        Adaptif terhadap ruang! Siswa secara mandiri berpindah menuju lab dan kelas tematik sesuai jadwal mapel berjalan.
                                    </p>
                                    <div className="mt-6 flex flex-wrap gap-2">
                                        {['30 Rombel', 'Dinamis', 'Mandiri'].map((t) => (
                                            <span key={t} className="rounded-md bg-violet-50 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-violet-700 border border-violet-100 shadow-sm">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            </BorderGlow>
                        </motion.div>

                        {/* 4. PENILAIAN AUTENTIK */}
                        <motion.div variants={fadeUp} whileHover={{ y: -6 }} className="group h-full">
                            <BorderGlow borderRadius={28} colors={['#D97706', '#FBBF24', '#B45309']} className="relative overflow-hidden h-full rounded-[1.75rem] border border-white bg-white p-8 shadow-xl hover:shadow-2xl hover:shadow-amber-500/20 transition-all">
                                <div className="absolute inset-0 bg-gradient-to-br from-white to-amber-50/50" />
                                <div className="absolute -right-10 -top-10 size-40 rounded-full bg-amber-100 opacity-50 blur-3xl transition-transform duration-700 group-hover:scale-150" />
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start">
                                        <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30">
                                            <Award className="size-5" />
                                        </div>
                                    </div>
                                    <h4 className="mt-5 text-xl font-bold text-[var(--school-ink)]">Penilaian Autentik</h4>
                                    <p className="mt-2 text-[0.85rem] leading-relaxed text-slate-600">
                                        Evaluasi holistik lewat portofolio dan presentasi, tak terbatas pada ujian kertas konvensional semata.
                                    </p>
                                </div>
                            </BorderGlow>
                        </motion.div>

                        {/* 5. ASESMEN DIAGNOSTIK */}
                        <motion.div variants={fadeUp} whileHover={{ y: -6 }} className="group h-full">
                            <BorderGlow borderRadius={28} colors={['#E11D48', '#FDA4AF', '#BE123C']} className="relative overflow-hidden h-full rounded-[1.75rem] border border-white bg-white p-8 shadow-xl hover:shadow-2xl hover:shadow-rose-500/20 transition-all">
                                <div className="absolute inset-0 bg-gradient-to-br from-white to-rose-50/50" />
                                <div className="absolute -right-10 -top-10 size-40 rounded-full bg-rose-100 opacity-50 blur-3xl transition-transform duration-700 group-hover:scale-150" />
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start">
                                        <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/30">
                                            <Sparkles className="size-5" />
                                        </div>
                                    </div>
                                    <h4 className="mt-5 text-xl font-bold text-[var(--school-ink)]">Asesmen Diagnostik</h4>
                                    <p className="mt-2 text-[0.85rem] leading-relaxed text-slate-600">
                                        Keputusan berbasis data—memetakan potensi, gaya belajar, dan tantangan siswa sedari awal semester.
                                    </p>
                                </div>
                            </BorderGlow>
                        </motion.div>

                        {/* 6. BATARA KRESNA */}
                        <motion.div variants={fadeUp} whileHover={{ y: -6 }} className="group h-full">
                            <BorderGlow borderRadius={28} colors={['#15803D', '#4ADE80', '#166534']} className="relative overflow-hidden h-full rounded-[1.75rem] border border-slate-200 bg-slate-900 p-8 shadow-xl hover:shadow-2xl hover:shadow-emerald-900/40 transition-all">
                                <div className="absolute inset-0 z-0 bg-slate-900" style={{ backgroundImage: 'linear-gradient(135deg, rgba(21,128,61,0.2), transparent)' }} />
                                <div className="absolute -right-10 -top-10 size-40 rounded-full bg-emerald-500 opacity-20 blur-3xl transition-transform duration-700 group-hover:scale-150" />
                                <div className="relative z-10 text-white">
                                    <div className="flex justify-between items-start">
                                        <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                            <ShieldCheck className="size-5" />
                                        </div>
                                        <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[0.55rem] font-bold tracking-widest text-emerald-300">CORE VALUE</span>
                                    </div>
                                    <h4 className="mt-5 text-xl font-bold tracking-wide text-white">BATARA KRESNA</h4>
                                    <p className="mt-2 text-[0.8rem] leading-relaxed text-emerald-100/70">
                                        Integrasi 100% Empat Pilar Nilai Inti Sekolah ke dalam silabus pengajaran setiap harinya.
                                    </p>
                                </div>
                            </BorderGlow>
                        </motion.div>
                    </motion.div>
                </section>

                {/* ═══════════ SARANA PRASARANA ═══════════ */}
                <section id="sarana-prasarana" className="space-y-8 scroll-mt-24">
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
                                    <img src="/images/profil/sarana.png" alt="Lab Komputer" className="h-full w-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-l from-white via-white/20 to-transparent" />
                                </div>
                                <div className="p-8 md:p-10">
                                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                        {[
                                            { label: 'Siswa Aktif', value: school.studentCount, icon: Users, suffix: '', accent: '#0F766E' },
                                            { label: 'Rombel', value: school.teachingGroupCount, icon: GraduationCap, suffix: '', accent: '#0369A1' },
                                            { label: 'Ruang Kelas', value: school.physicalClassroomCount, icon: Building, suffix: '', accent: '#7C3AED' },
                                            { label: 'PTK', value: school.staffCount, icon: Users, suffix: '', accent: '#D97706' },
                                            { label: 'Laboratorium', value: school.laboratoryCount, icon: BookOpen, suffix: '', accent: '#E11D48' },
                                            { label: 'Perpustakaan', value: school.libraryCount, icon: Library, suffix: '', accent: '#15803D' },
                                            { label: 'Lahan', value: school.landAreaSquareMeters, icon: MapPinned, suffix: ' m²', accent: '#A16207' },
                                            { label: 'Kepala Sekolah', value: 0, icon: School2, suffix: '', accent: '#0F766E', text: school.principalName ?? '-' },
                                        ].map((stat) => (
                                            <motion.div
                                                key={stat.label}
                                                whileHover={{ y: -4 }}
                                                className="rounded-2xl border border-black/[0.04] bg-[var(--school-green-50)]/50 p-5 transition-all hover:bg-white hover:shadow-md"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[0.6rem] font-bold uppercase tracking-[0.22em] text-[var(--school-muted)]">{stat.label}</span>
                                                    <stat.icon className="size-4" style={{ color: stat.accent }} />
                                                </div>
                                                <div className="mt-3 text-2xl font-extrabold text-[var(--school-ink)]">
                                                    {'text' in stat && stat.text ? (
                                                        <span className="text-base font-bold">{stat.text}</span>
                                                    ) : (
                                                        <>
                                                            <AnimatedCounter value={stat.value} />
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
                <section id="prestasi" className="space-y-8 scroll-mt-24">
                    <SectionHeading
                        eyebrow="Prestasi"
                        title="Capaian akademik dan non-akademik yang membanggakan."
                        description="Setiap prestasi adalah bukti nyata bahwa proses pembelajaran di SMAN 1 Tenjo menghasilkan dampak."
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
                                        <span className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-amber-700">Daftar Prestasi</span>
                                    </div>

                                    <div className="mt-6 space-y-3">
                                        {[
                                            { title: 'Piala Gubernur Pelajar Juara 2022', category: 'Multi-Lomba', desc: 'Paskibra, Modern Dance, Tari Tradisional, News Anchor, Creative Make-up', accent: '#DC2626' },
                                            { title: 'Lomba OSIS Juara', category: 'Organisasi', desc: 'Piala Gubernur Pelajar Juara 2022 – Kategori OSIS terbaik', accent: '#0369A1' },
                                            { title: 'Sekolah Adiwiyata', category: 'Lingkungan', desc: 'Penghargaan sekolah berbudaya lingkungan dan kader ramah lingkungan', accent: '#15803D' },
                                            { title: 'P5 Panen Karya', category: 'Akademik', desc: 'Dokumentasi karya proyek P5 dalam Gebyar Pemilos', accent: '#7C3AED' },
                                            { title: 'Freestyle Bola', category: 'Olahraga', desc: 'Piala Gubernur Pelajar Juara 2022 – Kategori Freestyle Bola', accent: '#D97706' },
                                        ].map((p, i) => (
                                            <motion.div
                                                key={p.title}
                                                whileHover={{ x: 4 }}
                                                className="group flex items-start gap-4 rounded-2xl border border-black/[0.04] bg-white/60 p-5 transition-all hover:bg-white hover:shadow-md"
                                            >
                                                <div
                                                    className="flex size-10 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
                                                    style={{ background: `linear-gradient(135deg, ${p.accent}, ${p.accent}cc)` }}
                                                >
                                                    <Trophy className="size-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h5 className="text-sm font-bold text-[var(--school-ink)]">{p.title}</h5>
                                                        <span
                                                            className="rounded-full px-2.5 py-0.5 text-[0.55rem] font-bold uppercase tracking-[0.15em] text-white"
                                                            style={{ backgroundColor: p.accent }}
                                                        >
                                                            {p.category}
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 text-xs leading-relaxed text-[var(--school-muted)]">{p.desc}</p>
                                                </div>
                                                <ChevronRight className="mt-1 size-4 shrink-0 text-[var(--school-muted)] opacity-0 transition group-hover:opacity-100" />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Side image */}
                                <div className="relative hidden overflow-hidden lg:block">
                                    <img src="/images/profil/prestasi.png" alt="Lemari Piala" className="h-full w-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent" />
                                </div>
                            </div>
                        </BorderGlow>
                    </motion.div>
                </section>

                {/* ═══════════ KOMITE SEKOLAH ═══════════ */}
                <section id="komite" className="space-y-8 scroll-mt-24">
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
                                        { title: 'Pengawasan', desc: 'Mengawasi pelaksanaan kebijakan dan program pendidikan.', icon: ShieldCheck, accent: '#0F766E' },
                                        { title: 'Penasehat', desc: 'Memberi masukan strategis untuk peningkatan mutu sekolah.', icon: BookOpen, accent: '#0369A1' },
                                        { title: 'Mediasi', desc: 'Menjembatani komunikasi antara sekolah dan orang tua siswa.', icon: Users, accent: '#7C3AED' },
                                        { title: 'Dukungan', desc: 'Mendukung pembiayaan, sarana, dan kegiatan sekolah.', icon: Heart, accent: '#D97706' },
                                    ].map((role) => (
                                        <motion.div
                                            key={role.title}
                                            whileHover={{ y: -4 }}
                                            className="group rounded-2xl border border-black/[0.04] bg-[var(--school-green-50)]/50 p-6 text-center transition-all hover:bg-white hover:shadow-md"
                                        >
                                            <div
                                                className="mx-auto flex size-14 items-center justify-center rounded-2xl text-white shadow-lg"
                                                style={{ background: `linear-gradient(135deg, ${role.accent}, ${role.accent}cc)` }}
                                            >
                                                <role.icon className="size-6" />
                                            </div>
                                            <h5 className="mt-4 text-base font-bold text-[var(--school-ink)]">{role.title}</h5>
                                            <p className="mt-2 text-sm leading-relaxed text-[var(--school-muted)]">{role.desc}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </BorderGlow>
                    </motion.div>
                </section>

                {/* ═══════════ LOKASI & KONTAK ═══════════ */}
                <section className="space-y-8">
                    <SectionHeading
                        eyebrow="Lokasi & Kontak"
                        title="Simpul koordinat kampus utama SMAN 1 Tenjo."
                        description="Temukan kami secara presisi melalui peta interaktif atau gunakan saluran resmi di bawah ini untuk layanan administratif dan pusat informasi publik."
                    />

                    <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={motionViewport}>
                        <BorderGlow
                            borderRadius={36}
                            colors={['#0F766E', '#10B981', '#064E3B']}
                            className="relative w-full overflow-hidden rounded-[2.25rem] border border-white/40 shadow-2xl bg-slate-900"
                        >
                            <div className="relative flex h-[650px] w-full flex-col lg:flex-row">
                                {/* The Leaflet Map spanning full background */}
                                <div className="absolute inset-0 z-0">
                                    <MapContainer
                                        center={[school.location.latitude, school.location.longitude]}
                                        zoom={15}
                                        scrollWheelZoom={false}
                                        zoomControl={false}
                                        className="h-full w-full"
                                        style={{ background: '#f8fafc' }}
                                    >
                                        <TileLayer // Premium CartoDB Light theme
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                                        />
                                        <ZoomControl position="bottomleft" />
                                        {customMarkerIcon && (
                                            <Marker  
                                                position={[school.location.latitude, school.location.longitude]}
                                                icon={customMarkerIcon}
                                                eventHandlers={{
                                                    click: () => {
                                                        window.open(`https://www.google.com/maps?q=${school.location.latitude},${school.location.longitude}`, '_blank');
                                                    }
                                                }}
                                            />
                                        )}
                                    </MapContainer>
                                </div>
                                
                                {/* Overlay Gradient for text readability on right & bottom (toned down for map visibility) */}
                                <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-slate-900/60" />

                                {/* The Floating Contact Card */}
                                <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-end p-5 md:p-10 lg:flex-row lg:items-center lg:justify-end">
                                    <div className="pointer-events-auto w-full max-w-[420px] rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-transform hover:scale-[1.01] hover:border-white/20">
                                        <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                                            <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-600/30">
                                                <MapPinned className="size-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-heading tracking-wide text-white">Hubungi Kami</h3>
                                                <p className="mt-0.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-emerald-300">Siap Melayani</p>
                                            </div>
                                        </div>

                                        <div className="mt-6 space-y-3">
                                            <div className="group rounded-2xl border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/10">
                                                <div className="flex items-center gap-2">
                                                    <Compass className="size-3.5 text-emerald-400" />
                                                    <div className="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-emerald-200/70">Alamat Kampus Utama</div>
                                                </div>
                                                <p className="mt-2 text-[0.85rem] leading-relaxed text-slate-200">{school.address}</p>
                                            </div>
                                            {(school.email || school.phone) && (
                                                <div className="grid grid-cols-2 gap-3">
                                                    {school.email && (
                                                        <div className="group rounded-2xl border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/10">
                                                            <div className="flex items-center gap-2">
                                                                <Mail className="size-3.5 text-emerald-400" />
                                                                <div className="text-[0.6rem] font-bold uppercase tracking-[0.1em] text-emerald-200/70">Surat Elektronik</div>
                                                            </div>
                                                            <p className="mt-2 truncate text-[0.7rem] font-medium text-slate-200">{school.email}</p>
                                                        </div>
                                                    )}
                                                    {school.phone && (
                                                        <div className="group rounded-2xl border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/10">
                                                            <div className="flex items-center gap-2">
                                                                <Phone className="size-3.5 text-emerald-400" />
                                                                <div className="text-[0.6rem] font-bold uppercase tracking-[0.1em] text-emerald-200/70">Saluran Telepon</div>
                                                            </div>
                                                            <p className="mt-2 text-sm font-bold tracking-wider text-slate-200">{school.phone}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="mt-8">
                                            <div className="mb-4 text-center text-[0.6rem] font-bold uppercase tracking-[0.2em] text-slate-400">Jejaring Sosial</div>
                                            <div className="flex justify-center bg-white/5 rounded-2xl p-3 border border-white/5 mx-auto text-white">
                                                <div className="brightness-200 contrast-200">
                                                    <SocialLinks />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </BorderGlow>
                    </motion.div>
                </section>
            </div>
        </>
    );
}
