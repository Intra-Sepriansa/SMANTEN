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
    FileAudio,
    FlaskConical,
    GraduationCap,
    Heart,
    Landmark,
    LayoutDashboard,
    Library,
    Lightbulb,
    Microscope,
    Palette,
    Presentation,
    School2,
    ShieldCheck,
    Sparkles,
    Target,
    Trophy,
    Users,
} from 'lucide-react';
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
    const curriculumFeatures = [
        {
            icon: BrainCircuit,
            title: 'Pembelajaran Diferensiasi',
            description: 'Mengakui bahwa setiap siswa memiliki kecepatan dan gaya belajar berbeda. Materi disesuaikan untuk memaksimalkan potensi masing-masing.',
            accent: '#0F766E',
            tags: ['Personal', 'Adaptif', 'Inklusif']
        },
        {
            icon: Target,
            title: 'Asesmen Formatif',
            description: 'Fokus pada proses belajar, bukan sekadar angka akhir. Evaluasi dilakukan terus-menerus untuk perbaikan langsung.',
            accent: '#0369A1',
            tags: ['Evaluasi', 'Proses', 'Feedback']
        },
        {
            icon: CalendarDays,
            title: 'Moving Class Terintegrasi',
            description: `Siswa berpindah ruang sesuai mata pelajaran, mengoptimalkan ${school.physicalClassroomCount} ruang kelas untuk ${school.teachingGroupCount} rombel.`,
            accent: '#7C3AED',
            tags: ['Dinamis', 'Efisien', 'Terjadwal']
        },
        {
            icon: Microscope,
            title: 'Pembelajaran Praktikum',
            description: 'Ilmu sains dan teknologi dipraktikkan langsung di laboratorium untuk memperkuat pemahaman konseptual.',
            accent: '#D97706',
            tags: ['Sains', 'Eksperimen', 'Praktik']
        },
    ];

    const eskulList = [
        {
            name: 'Paskibra',
            image: '/images/eskul/paskibra.png',
            description: 'Pasukan Pengibar Bendera yang melatih disiplin, kepemimpinan, dan keterampilan tingkat tinggi.',
            accent: '#DC2626',
            icon: ShieldCheck,
            metric: 'Juara',
            metricSub: 'Prov.',
            focus: ['Disiplin', 'Pemimpin'],
        },
        {
            name: 'Futsal',
            image: '/images/eskul/futsal.png',
            description: 'Olahraga futsal aktif yang membentuk sportivitas dan semangat kompetisi yang sehat.',
            accent: '#16A34A',
            icon: Trophy,
            metric: 'Olahraga',
            metricSub: 'Rutin',
            focus: ['Fisik', 'Tim'],
        },
        {
            name: 'Rohis',
            image: '/images/eskul/rohis.png',
            description: 'Rohani Islam — memperkuat iman, karakter Islami, dan kegiatan dakwah di lingkungan sekolah.',
            accent: '#0F766E',
            icon: Heart,
            metric: 'Rutin',
            metricSub: 'Kajian',
            focus: ['Agama', 'Karakter'],
        },
        {
            name: 'PMR',
            image: '/images/eskul/pmr.png',
            description: 'Palang Merah Remaja — fokus pada kesehatan, pertolongan pertama, dan tanggap bencana.',
            accent: '#E11D48',
            icon: Activity,
            metric: 'P3K',
            metricSub: 'Siaga',
            focus: ['Kesehatan', 'Sosial'],
        },
        {
            name: 'Pramuka',
            image: '/images/eskul/pramuka.png',
            description: 'Menanamkan jiwa mandiri, disiplin, dan peduli lingkungan melalui kepanduan.',
            accent: '#A16207',
            icon: Compass,
            metric: 'Ambalan',
            metricSub: 'Resmi',
            focus: ['Mandiri', 'Alam'],
        },
        {
            name: 'Pencak Silat',
            image: '/images/eskul/silat.png',
            description: 'Seni bela diri tradisional yang mengasah ketangkasan fisik dan mental.',
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
                <meta property="og:title" content={`Akademik — ${school.name}`} />
                <meta property="og:description" content="Kurikulum Merdeka, Projek P5, Ekstrakurikuler, dan Tenaga Pendidik SMAN 1 Tenjo." />
            </Head>

            <div className="space-y-14">
                {/* ═══════════ HERO BANNER ═══════════ */}
                <motion.section
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    id="hero"
                    className="relative -mt-8 overflow-hidden rounded-[2.4rem] md:-mt-10"
                >
                    {/* Background Image */}
                    <div className="relative h-[360px] w-full md:h-[480px]">
                        <img
                            src="/images/akademik/hero.png"
                            alt="Suasana Akademik SMAN 1 Tenjo"
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(4,47,46,0.95)] via-[rgba(4,47,46,0.55)] to-transparent" />
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                        {/* Ambient orb */}
                        <div className="pointer-events-none absolute -right-20 top-20 size-96 rounded-full bg-[var(--school-gold)]/[0.08] blur-[100px]" />

                        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-4 py-1.5 backdrop-blur-sm">
                            <BookOpen className="size-3.5 text-[var(--school-gold)]" />
                            <span className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[var(--school-gold)]">
                                Akademik & Pembelajaran
                            </span>
                        </div>

                        <h1 className="mt-4 max-w-3xl font-heading text-3xl leading-tight text-white md:text-5xl">
                            Pembelajaran yang bergerak dari sekadar teori menuju karya nyata.
                        </h1>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65">
                            Melalui {school.curriculumName ?? 'Kurikulum Merdeka'}, SMAN 1 Tenjo merancang ekosistem belajar yang membebaskan potensi siswa, didukung infrastruktur laboratorium dan pendidik profesional.
                        </p>

                        {/* Quick Stats Row */}
                        <div className="mt-6 flex flex-wrap gap-4">
                            {[
                                { label: 'Siswa Aktif', value: numberFormatter.format(school.studentCount) },
                                { label: 'Rombel', value: numberFormatter.format(school.teachingGroupCount) },
                                { label: 'Pendidik', value: numberFormatter.format(school.staffCount) },
                            ].map((s) => (
                                <div
                                    key={s.label}
                                    className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 backdrop-blur-sm"
                                >
                                    <div className="text-lg font-extrabold text-white">{s.value}</div>
                                    <div className="mt-0.5 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/50">
                                        {s.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* ═══════════ KURIKULUM MERDEKA ═══════════ */}
                <section id="kurikulum" className="space-y-8 scroll-mt-24">
                    <SectionHeading
                        eyebrow="Kurikulum Merdeka"
                        title="Fokus pada esensi, bukan sekadar durasi."
                        description="Kurikulum diadaptasi agar relevan dengan kebutuhan masa depan. Pembelajaran lebih interaktif, fleksibel, dan berpihak pada siswa."
                    />

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={motionViewport}
                        className="grid gap-5 md:grid-cols-2"
                    >
                        {curriculumFeatures.map((f) => (
                            <motion.div key={f.title} variants={fadeUp} whileHover={{ y: -6 }} className="group">
                                <BorderGlow
                                    borderRadius={28}
                                    colors={[f.accent, '#F59E0B', '#0E9EE4']}
                                    className="relative overflow-hidden rounded-[1.8rem] border border-white/70 bg-white p-7 shadow-[0_24px_70px_-40px_rgba(15,118,110,0.3)] transition-all hover:shadow-[0_30px_80px_-40px_rgba(15,118,110,0.45)]"
                                >
                                    <div className="flex items-start gap-5">
                                        <div
                                            className="flex size-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg"
                                            style={{ background: `linear-gradient(135deg, ${f.accent}, ${f.accent}cc)` }}
                                        >
                                            <f.icon className="size-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-[var(--school-ink)]">{f.title}</h3>
                                            <p className="mt-2 text-sm leading-relaxed text-[var(--school-muted)]">{f.description}</p>
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {f.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="rounded-full px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.18em]"
                                                        style={{ backgroundColor: `${f.accent}0D`, color: f.accent, border: `1px solid ${f.accent}20` }}
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </BorderGlow>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* ═══════════ PROJEK P5 ═══════════ */}
                <section id="p5" className="space-y-8 scroll-mt-24">
                    <SectionHeading
                        eyebrow="Projek P5"
                        title="Penguatan Profil Pelajar Pancasila melalui karya."
                        description="Bukan tambahan teori, melainkan ruang bagi siswa untuk memecahkan masalah lokal dan menciptakan produk bernilai tambah."
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
                            className="overflow-hidden rounded-[1.9rem] border border-white/70 bg-white shadow-[0_28px_80px_-50px_rgba(15,118,110,0.4)]"
                        >
                            <div className="grid lg:grid-cols-[1fr_400px]">
                                <div className="p-8 md:p-10">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--school-green-200)] bg-[var(--school-green-50)] px-4 py-1.5">
                                        <Lightbulb className="size-3.5 text-[var(--school-green-700)]" />
                                        <span className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[var(--school-green-700)]">Projek Lintas Disiplin</span>
                                    </div>
                                    <h3 className="mt-5 font-heading text-2xl text-[var(--school-ink)] md:text-3xl">
                                        Tema Nasional, Eksekusi Kontekstual
                                    </h3>
                                    <p className="mt-4 text-sm leading-7 text-[var(--school-muted)]">
                                        Melalui P5, siswa SMAN 1 Tenjo tidak hanya menghafal nilai-nilai Pancasila, tetapi mempraktikkannya. Setiap semester, proyek dipamerkan dalam ajang <b>Panen Karya</b> yang mengundang orang tua dan masyarakat. Dari pengelolaan limbah hingga rekayasa teknologi sederhana, semua merupakan hasil kolaborasi tim.
                                    </p>

                                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                                        {[
                                            { title: 'Gaya Hidup Berkelanjutan', icon: FlaskConical, accent: '#15803D' },
                                            { title: 'Kearifan Lokal', icon: LayoutDashboard, accent: '#D97706' },
                                            { title: 'Bhinneka Tunggal Ika', icon: Users, accent: '#0369A1' },
                                            { title: 'Bangunlah Jiwa Raganya', icon: Heart, accent: '#E11D48' },
                                            { title: 'Suara Demokrasi', icon: Presentation, accent: '#7C3AED' },
                                            { title: 'Kewirausahaan', icon: Landmark, accent: '#0F766E' },
                                        ].map((t) => (
                                            <div key={t.title} className="flex items-center gap-3 rounded-xl border border-black/[0.04] bg-[var(--school-green-50)]/50 px-4 py-3">
                                                <t.icon className="size-4 shrink-0" style={{ color: t.accent }} />
                                                <span className="text-xs font-bold text-[var(--school-ink)]">{t.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* P5 Image */}
                                <div className="relative hidden overflow-hidden lg:block">
                                    <img src="/images/akademik/p5.png" alt="Proyek P5" className="h-full w-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent" />
                                </div>
                            </div>
                        </BorderGlow>
                    </motion.div>
                </section>

                {/* ═══════════ EKSTRAKURIKULER ═══════════ */}
                <section id="eskul" className="space-y-8 scroll-mt-24">
                    <SectionHeading
                        eyebrow="Ekstrakurikuler"
                        title="Panggung pengembangan minat dan bakat siswa."
                        description="Ekstrakurikuler bukan sekadar pengisi waktu, melainkan sarana meraih prestasi, membangun kedisiplinan, dan mengeksplorasi potensi diri di luar kelas."
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
                                    colors={[eskul.accent, '#0E9EE4', '#F59E0B']}
                                    className="relative h-full overflow-hidden rounded-[1.9rem] border border-white/70 bg-white shadow-[0_24px_70px_-40px_rgba(15,118,110,0.3)] transition-shadow duration-300 hover:shadow-[0_30px_80px_-40px_rgba(15,118,110,0.45)]"
                                >
                                    {/* Sub-Banner Image */}
                                    <div className="relative h-44 w-full overflow-hidden">
                                        <img
                                            src={eskul.image}
                                            alt={eskul.name}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />
                                        {/* Floating Badge */}
                                        <div className="absolute bottom-4 left-5 flex items-center gap-2">
                                            <div
                                                className="flex size-9 items-center justify-center rounded-xl border bg-white/90 shadow-lg backdrop-blur-sm"
                                                style={{ borderColor: `${eskul.accent}30`, color: eskul.accent }}
                                            >
                                                <eskul.icon className="size-4" />
                                            </div>
                                            <div className="rounded-xl bg-white/90 px-3 py-1.5 shadow-lg backdrop-blur-sm">
                                                <span className="block text-[0.65rem] font-black uppercase tracking-wider text-[var(--school-ink)] leading-none">
                                                    {eskul.metric}
                                                </span>
                                                <span className="block text-[0.55rem] font-bold uppercase tracking-widest text-[var(--school-muted)] mt-0.5 leading-none">
                                                    {eskul.metricSub}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-[var(--school-ink)]">{eskul.name}</h3>
                                        <p className="mt-2 text-sm leading-relaxed text-[var(--school-muted)]">
                                            {eskul.description}
                                        </p>
                                        <div className="mt-5 flex flex-wrap gap-2">
                                            {eskul.focus.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="rounded-full px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-[var(--school-ink)]"
                                                    style={{ backgroundColor: `${eskul.accent}12` }}
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
                <section id="guru" className="space-y-8 scroll-mt-24">
                    <SectionHeading
                        eyebrow="Pendidik & Infrastruktur"
                        title="Ekosistem pendukung pembelajaran."
                        description="Dedikasi para guru didukung oleh kelengkapan fasilitas untuk memastikan Kurikulum Merdeka berjalan optimal."
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
                                colors={['#D97706', '#0F766E']}
                                className="h-full rounded-[1.9rem] border border-white/70 bg-white p-8 shadow-[0_28px_80px_-50px_rgba(15,118,110,0.4)]"
                            >
                                <div className="flex size-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--school-green-700),rgba(15,118,110,0.8))] text-white shadow-lg">
                                    <Users className="size-6" />
                                </div>
                                <h3 className="mt-5 font-heading text-2xl text-[var(--school-ink)]">Tenaga Pendidik</h3>
                                <p className="mt-3 text-sm leading-7 text-[var(--school-muted)]">
                                    Mendidik bukan sekadar mentransfer ilmu, tetapi juga menjadi fasilitator dan mentor. Kami didukung oleh profesional yang berikhtiar terus meningkatkan kapasitas diri.
                                </p>
                                <div className="mt-6 rounded-2xl border border-[var(--school-green-100)] bg-[var(--school-green-50)]/50 p-5">
                                    <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--school-green-700)]">
                                        Total PTK (Pendidik & Tenaga Kependidikan)
                                    </div>
                                    <div className="mt-1 text-4xl font-extrabold text-[var(--school-ink)]">
                                        <AnimatedCounter value={school.staffCount} />
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
                                colors={['#0369A1', '#7C3AED']}
                                className="h-full rounded-[1.9rem] border border-white/70 bg-white p-8 shadow-[0_28px_80px_-50px_rgba(15,118,110,0.4)]"
                            >
                                <div className="flex size-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0369A1,#0284C7)] text-white shadow-lg">
                                    <Building className="size-6" />
                                </div>
                                <h3 className="mt-5 font-heading text-2xl text-[var(--school-ink)]">Ruang Pembelajaran</h3>
                                <p className="mt-3 text-sm leading-7 text-[var(--school-muted)]">
                                    Lebih dari sekadar lahan seluas {numberFormatter.format(school.landAreaSquareMeters)} m², setiap sudut sekolah dirancang agar dapat difungsikan sebagai ruang interaksi dan observasi.
                                </p>

                                <div className="mt-6 grid gap-4 grid-cols-2 md:grid-cols-3">
                                    {[
                                        { label: 'Ruang Kelas', value: school.physicalClassroomCount, icon: Landmark },
                                        { label: 'Laboratorium', value: school.laboratoryCount, icon: FlaskConical },
                                        { label: 'Perpustakaan', value: school.libraryCount, icon: Library },
                                    ].map((s) => (
                                        <div key={s.label} className="rounded-xl border border-black/[0.04] bg-[var(--school-green-50)]/30 p-4">
                                            <s.icon className="size-5 text-[var(--school-green-700)]" />
                                            <div className="mt-3 text-2xl font-bold text-[var(--school-ink)]">
                                                <AnimatedCounter value={s.value} />
                                            </div>
                                            <div className="mt-0.5 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[var(--school-muted)]">
                                                {s.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </BorderGlow>
                        </motion.div>
                    </div>
                </section>
            </div>
        </>
    );
}
