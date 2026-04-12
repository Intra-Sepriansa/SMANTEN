import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
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
import { AnimatedCounter } from '@/components/public/animated-counter';
import { BorderGlow } from '@/components/public/border-glow';
import { SectionHeading } from '@/components/public/section-heading';
import { SocialLinks } from '@/components/public/social-links';
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
                            <div className="relative mx-auto max-w-4xl px-2 md:px-0">
                                {/* Vertical Line Desktop */}
                                <div className="absolute left-[20px] top-6 h-[calc(100%-30px)] w-[2px] bg-gradient-to-b from-[var(--school-green-200)] via-blue-200 to-transparent md:left-1/2 md:-ml-px" />

                                <div className="space-y-12 md:space-y-0">
                                    {[
                                        {
                                            year: 'Fase Awal',
                                            title: 'Pendirian Institusi',
                                            desc: 'Sekolah didirikan untuk menjawab kebutuhan mendesak masyarakat Kecamatan Tenjo akan akses sekolah menengah atas berkualitas yang dekat secara geografis.',
                                            icon: MapPinned,
                                            align: 'right' // box on right, meaning line is to its left (default left-aligned for mobile)
                                        },
                                        {
                                            year: 'Pengembangan',
                                            title: 'Infrastruktur Tumbuh',
                                            desc: `Relokasi ke lokasi permanen di JL. Raya Tenjo - Parung Panjang KM 03. Pengadaan lahan seluas ${numberFormatter.format(school.landAreaSquareMeters)} m² untuk gedung, lapangan, dan lab.`,
                                            icon: Building,
                                            align: 'left' // box on left
                                        },
                                        {
                                            year: 'Peningkatan Mutu',
                                            title: `Akreditasi ${school.accreditation} Penuh`,
                                            desc: `Perhatian beralih pada kualitas. Meraih Akreditasi ${school.accreditation} dengan ${numberFormatter.format(school.physicalClassroomCount)} ruang belajar representatif serta standar penilaian nasional.`,
                                            icon: Award,
                                            align: 'right'
                                        },
                                        {
                                            year: 'Era Baru',
                                            title: 'Kurikulum Merdeka & P5',
                                            desc: 'Merespons tantangan zaman, metode diubah menjadi lebih kolaboratif dan berbasis pengerjaan produk (Projek P5) demi menyiapkan generasi abad 21.',
                                            icon: BookOpen,
                                            align: 'left'
                                        }
                                    ].map((item, idx) => (
                                        <div key={item.year} className={`relative flex flex-col md:flex-row md:items-center ${item.align === 'left' ? 'md:flex-row-reverse' : ''} ${idx !== 0 ? 'md:mt-16' : ''}`}>
                                            <div className="hidden w-1/2 md:block" />
                                            {/* Dot */}
                                            <div className="absolute left-[11px] top-5 z-10 flex size-5 flex-shrink-0 -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-[0_0_0_4px_var(--school-green-100)] md:left-1/2 md:top-1/2 md:-translate-y-1/2">
                                                <div className="size-2 rounded-full bg-[var(--school-green-700)]" />
                                            </div>
                                            {/* Content Box */}
                                            <div className={`ml-12 md:w-1/2 md:px-12 ${item.align === 'left' ? 'md:ml-0 md:text-right' : 'md:ml-0'}`}>
                                                <motion.div
                                                    whileHover={{ y: -4 }}
                                                    className={`group flex flex-col rounded-2xl border border-black/[0.04] bg-slate-50/70 p-6 transition-all hover:bg-white hover:shadow-xl ${item.align === 'left' ? 'md:items-end' : ''}`}
                                                >
                                                    <div className={`inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm border border-slate-100 ${item.align === 'left' ? 'md:flex-row-reverse' : ''}`}>
                                                        <div className="flex size-5 items-center justify-center rounded-full bg-[var(--school-green-50)] text-[var(--school-green-700)]">
                                                            <item.icon className="size-3" />
                                                        </div>
                                                        <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[var(--school-green-700)]">{item.year}</span>
                                                    </div>
                                                    <h4 className="mt-4 text-xl font-bold text-[var(--school-ink)]">{item.title}</h4>
                                                    <p className={`mt-2 text-sm leading-relaxed text-[var(--school-muted)] ${item.align === 'left' ? 'md:text-right' : ''}`}>
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
                            borderRadius={30}
                            colors={['#0F766E', '#0369A1', '#D97706']}
                            className="overflow-hidden rounded-[1.9rem] border border-white/70 bg-white shadow-[0_28px_80px_-50px_rgba(15,118,110,0.4)]"
                        >
                            <div className="p-8 md:p-10">
                                {/* Kepala Sekolah - Top */}
                                <div className="mx-auto max-w-md text-center">
                                    <div className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-[linear-gradient(135deg,var(--school-green-700),rgba(15,118,110,0.8))] text-white shadow-lg">
                                        <School2 className="size-8" />
                                    </div>
                                    <h4 className="mt-4 text-xl font-bold text-[var(--school-ink)]">Kepala Sekolah</h4>
                                    <p className="mt-1 text-base font-semibold text-[var(--school-green-700)]">{school.principalName ?? 'Pejabat Aktif'}</p>
                                    <p className="mt-1 text-xs text-[var(--school-muted)]">Simpul kepemimpinan utama</p>
                                </div>

                                {/* Connector line */}
                                <div className="mx-auto my-4 h-10 w-px bg-gradient-to-b from-[var(--school-green-200)] to-[var(--school-green-100)]" />

                                {/* Wakasek Row */}
                                <div className="grid gap-4 md:grid-cols-4">
                                    {[
                                        { title: 'Wakasek Kurikulum', desc: 'Mengawal desain akademik dan ritme pembelajaran.', icon: BookOpen, accent: '#0369A1' },
                                        { title: 'Wakasek Kesiswaan', desc: 'Menjaga ekosistem siswa dan pembinaan karakter.', icon: Users, accent: '#7C3AED' },
                                        { title: 'Wakasek Sarpras', desc: 'Menata ruang, fasilitas, dan kesiapan operasional.', icon: Building, accent: '#D97706' },
                                        { title: 'Wakasek Humas', desc: 'Mengarahkan hubungan eksternal dan komunikasi publik.', icon: Heart, accent: '#E11D48' },
                                    ].map((wk) => (
                                        <motion.div key={wk.title} whileHover={{ y: -4 }} className="group">
                                            <div className="h-full rounded-2xl border border-black/[0.04] bg-[var(--school-green-50)]/50 p-5 transition-all hover:bg-white hover:shadow-md">
                                                <div
                                                    className="flex size-10 items-center justify-center rounded-xl text-white shadow-md"
                                                    style={{ background: `linear-gradient(135deg, ${wk.accent}, ${wk.accent}cc)` }}
                                                >
                                                    <wk.icon className="size-4" />
                                                </div>
                                                <h5 className="mt-3 text-sm font-bold text-[var(--school-ink)]">{wk.title}</h5>
                                                <p className="mt-1 text-xs leading-relaxed text-[var(--school-muted)]">{wk.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Connector line */}
                                <div className="mx-auto my-4 h-10 w-px bg-gradient-to-b from-[var(--school-green-200)] to-[var(--school-green-100)]" />

                                {/* Support Staff Row */}
                                <div className="grid gap-3 md:grid-cols-3">
                                    {[
                                        { title: 'Bimbingan Konseling', desc: 'Pendampingan dan penguatan perkembangan siswa.', icon: Heart },
                                        { title: 'Wali Kelas', desc: 'Menyambungkan kebijakan sekolah ke rombel harian.', icon: GraduationCap },
                                        { title: 'Operator Sekolah', desc: 'Menjaga akurasi data dan administrasi digital inti.', icon: Landmark },
                                    ].map((sup) => (
                                        <div key={sup.title} className="flex items-start gap-3 rounded-xl border border-black/[0.03] bg-white/60 p-4 transition hover:bg-white hover:shadow-sm">
                                            <sup.icon className="mt-0.5 size-4 shrink-0 text-[var(--school-green-700)]" />
                                            <div>
                                                <div className="text-sm font-semibold text-[var(--school-ink)]">{sup.title}</div>
                                                <div className="mt-0.5 text-xs text-[var(--school-muted)]">{sup.desc}</div>
                                            </div>
                                        </div>
                                    ))}
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
                        className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
                    >
                        {[
                            {
                                title: 'Kurikulum Merdeka',
                                desc: 'Fleksibilitas dalam merancang pembelajaran sesuai kebutuhan dan konteks siswa.',
                                icon: BookOpen,
                                accent: '#0F766E',
                                tags: ['Fleksibel', 'Kontekstual', 'Diferensiasi'],
                            },
                            {
                                title: 'Projek P5',
                                desc: 'Penguatan Profil Pelajar Pancasila melalui proyek berbasis tema lintas disiplin.',
                                icon: Target,
                                accent: '#0369A1',
                                tags: ['7 Tema', '60+ Karya', 'Lintas Mapel'],
                            },
                            {
                                title: 'Moving Class',
                                desc: '30 rombel dihadapkan 21 ruang kelas — siswa berpindah ke ruang mapel, bukan sebaliknya.',
                                icon: Compass,
                                accent: '#7C3AED',
                                tags: ['Adaptif', '30:21 Rasio', 'Tertata'],
                            },
                            {
                                title: 'Penilaian Autentik',
                                desc: 'Evaluasi kompetensi melalui portofolio, proyek, dan presentasi, bukan hanya ujian tertulis.',
                                icon: Award,
                                accent: '#D97706',
                                tags: ['Portofolio', 'Proyek', 'Presentasi'],
                            },
                            {
                                title: 'Asesmen Diagnostik',
                                desc: 'Memahami potensi dan tantangan belajar siswa sejak awal untuk diferensiasi yang tepat.',
                                icon: Sparkles,
                                accent: '#E11D48',
                                tags: ['Data-Driven', 'Personal', 'Diagnostik'],
                            },
                            {
                                title: 'BATARA KRESNA',
                                desc: 'Beriman, Bertaqwa, Berkarakter, Bebas Narkoba — terintegrasi ke seluruh mata pelajaran.',
                                icon: ShieldCheck,
                                accent: '#15803D',
                                tags: ['4 Pilar', 'Integrasi 100%', 'Akhlak'],
                            },
                        ].map((k) => (
                            <motion.div key={k.title} variants={fadeUp} whileHover={{ y: -6 }} className="group h-full">
                                <BorderGlow
                                    borderRadius={27}
                                    colors={[k.accent, '#0E9EE4', '#F59E0B']}
                                    className="relative h-full overflow-hidden rounded-[1.7rem] border border-white/70 bg-white shadow-[0_22px_70px_-44px_rgba(15,118,110,0.35)] transition-shadow duration-300 hover:shadow-[0_30px_80px_-40px_rgba(15,118,110,0.5)]"
                                >
                                    <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${k.accent}, ${k.accent}80, transparent)` }} />
                                    <div className="p-6">
                                        <div
                                            className="flex size-12 items-center justify-center rounded-2xl text-white shadow-lg"
                                            style={{ background: `linear-gradient(135deg, ${k.accent}, ${k.accent}cc)` }}
                                        >
                                            <k.icon className="size-5" />
                                        </div>
                                        <h4 className="mt-4 text-lg font-bold text-[var(--school-ink)]">{k.title}</h4>
                                        <p className="mt-2 text-sm leading-relaxed text-[var(--school-muted)]">{k.desc}</p>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {k.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="rounded-full px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.15em]"
                                                    style={{ backgroundColor: `${k.accent}0D`, color: k.accent, border: `1px solid ${k.accent}20` }}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </BorderGlow>
                            </motion.div>
                        ))}
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
                        eyebrow="Lokasi"
                        title="Posisi sekolah di peta dan kontak publik."
                        description={school.address}
                    />
                    <div className="grid gap-6 md:grid-cols-2">
                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="show"
                            viewport={motionViewport}
                        >
                            <BorderGlow
                                borderRadius={30}
                                className="overflow-hidden rounded-[1.9rem] border border-white/70 shadow-[0_28px_80px_-50px_rgba(15,118,110,0.45)]"
                            >
                                <iframe
                                    title="Lokasi SMAN 1 Tenjo"
                                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${school.location.longitude - 0.005}%2C${school.location.latitude - 0.004}%2C${school.location.longitude + 0.005}%2C${school.location.latitude + 0.004}&layer=mapnik&marker=${school.location.latitude}%2C${school.location.longitude}`}
                                    className="h-72 w-full border-0 md:h-80"
                                    loading="lazy"
                                />
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
                                className="h-full rounded-[1.9rem] border border-white/70 bg-white shadow-[0_28px_80px_-50px_rgba(15,118,110,0.45)]"
                            >
                                <div className="space-y-6 p-8">
                                    <h3 className="text-lg font-bold text-[var(--school-ink)]">Kontak & Media Sosial</h3>
                                    <div className="space-y-4">
                                        {[
                                            { icon: MapPinned, label: 'Alamat', value: school.address },
                                            ...(school.email ? [{ icon: BookOpen, label: 'Email', value: school.email }] : []),
                                            ...(school.phone ? [{ icon: School2, label: 'Telepon', value: school.phone }] : []),
                                        ].map((c) => (
                                            <div key={c.label} className="flex items-start gap-3 rounded-xl border border-black/[0.03] bg-[var(--school-green-50)]/50 p-4">
                                                <c.icon className="mt-0.5 size-4 shrink-0 text-[var(--school-green-700)]" />
                                                <div>
                                                    <div className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[var(--school-muted)]">{c.label}</div>
                                                    <div className="mt-1 text-sm text-[var(--school-ink)]">{c.value}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <SocialLinks />
                                </div>
                            </BorderGlow>
                        </motion.div>
                    </div>
                </section>
            </div>
        </>
    );
}
