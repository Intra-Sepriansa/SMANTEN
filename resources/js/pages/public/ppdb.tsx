import { Head } from '@inertiajs/react';
import { lazy, startTransition, Suspense, useDeferredValue, useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
    AlertCircle,
    Award,
    BookOpen,
    Calendar,
    CheckCircle2,
    ChevronDown,
    Clock,
    Crosshair,
    FileText,
    GraduationCap,
    HelpCircle,
    LoaderCircle,
    MapPin,
    Megaphone,
    RotateCcw,
    Search,
    Shield,
    Sparkles,
    Users,
    Zap,
} from 'lucide-react';
import { BorderGlow } from '@/components/public/border-glow';
import { SectionHeading } from '@/components/public/section-heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fadeUp, motionViewport, staggerContainer } from '@/lib/motion';
import { PpdbQuotaChart } from '@/components/charts/school-charts';
import { ppdbFaqs } from '@/lib/public-content';
import { calculateHaversineKm } from '@/lib/geo';
import type {
    GeocodeCandidate,
    PpdbPayload,
    SchoolProfilePayload,
} from '@/types';

const PpdbDistanceMap = lazy(() => import('@/components/maps/ppdb-distance-map'));

type PpdbPageProps = {
    school: SchoolProfilePayload;
    ppdb: PpdbPayload;
};

type DistancePreview = {
    homePosition: [number, number];
    distanceKm: number;
    insideZone: boolean;
};

type SubmissionResult = {
    registrationNumber: string;
    status: string | null;
};

/* ─── Animated Counter ─── */
function AnimatedCounter({ value }: { value: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (!inView) return;
        let frame: number;
        const duration = 1200;
        const start = performance.now();
        function tick(now: number) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * value));
            if (progress < 1) frame = requestAnimationFrame(tick);
        }
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [inView, value]);

    return <span ref={ref}>{new Intl.NumberFormat('id-ID').format(display)}</span>;
}

/* ─── Formatters ─── */
const numberFormatter = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 });

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
});

/* ─── Track Type Config ─── */
const trackConfig: Record<string, { icon: typeof Shield; accent: string; gradient: string; description: string }> = {
    zonasi: {
        icon: MapPin,
        accent: '#10B981',
        gradient: 'from-emerald-500/20 to-emerald-600/5',
        description: 'Penerimaan berdasarkan jarak domisili ke sekolah',
    },
    afirmasi: {
        icon: Shield,
        accent: '#38BDF8',
        gradient: 'from-sky-500/20 to-sky-600/5',
        description: 'Untuk siswa dari keluarga ekonomi tidak mampu',
    },
    perpindahan: {
        icon: Users,
        accent: '#C084FC',
        gradient: 'from-violet-500/20 to-violet-600/5',
        description: 'Untuk siswa yang mengikuti perpindahan orang tua',
    },
    prestasi: {
        icon: Award,
        accent: '#FBBF24',
        gradient: 'from-amber-500/20 to-amber-600/5',
        description: 'Berdasarkan prestasi akademik dan non-akademik',
    },
};

/* ─── FAQ Accordion Item ─── */
function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
    const [open, setOpen] = useState(false);
    return (
        <motion.div
            variants={fadeUp}
            className="group"
        >
            <BorderGlow
                borderRadius={24}
                colors={['#0F766E', '#0EA5E9', '#A855F7']}
                className="overflow-hidden rounded-3xl border border-white/70 bg-white/88 backdrop-blur-md shadow-[0_24px_50px_-20px_rgba(15,118,110,0.15)] hover:shadow-[0_24px_70px_-20px_rgba(15,118,110,0.3)] transition-all"
            >
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="flex w-full items-center gap-4 p-6 text-left transition-colors hover:bg-[rgba(240,253,244,0.4)]"
                >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white border border-emerald-100 text-[var(--school-green-700)] font-heading text-sm shadow-sm">
                        {String(index + 1).padStart(2, '0')}
                    </div>
                    <h3 className="flex-1 font-heading text-base text-[var(--school-ink)] md:text-lg">{question}</h3>
                    <motion.div
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="shrink-0 text-slate-400 group-hover:text-emerald-500"
                    >
                        <ChevronDown className="size-5" />
                    </motion.div>
                </button>
                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                        >
                            <div className="px-6 pb-6 pl-20 bg-gradient-to-b from-transparent to-white/30">
                                <p className="text-sm leading-relaxed text-[var(--school-muted)]">{answer}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </BorderGlow>
        </motion.div>
    );
}

export default function PpdbPage({ school, ppdb }: PpdbPageProps) {
    const [fullName, setFullName] = useState('');
    const [trackType, setTrackType] = useState(ppdb?.trackQuotas[0]?.trackType ?? 'zonasi');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [previousSchoolName, setPreviousSchoolName] = useState('');
    const [addressLine, setAddressLine] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [ketmFlag, setKetmFlag] = useState(false);
    const [specialConditionFlag, setSpecialConditionFlag] = useState(false);
    const [achievementsSummary, setAchievementsSummary] = useState('');
    const [preview, setPreview] = useState<DistancePreview | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [geocodeResults, setGeocodeResults] = useState<GeocodeCandidate[]>([]);

    const deferredLatitude = useDeferredValue(latitude);
    const deferredLongitude = useDeferredValue(longitude);

    const schoolLatitude = ppdb?.schoolLatitude ?? school.location.latitude;
    const schoolLongitude = ppdb?.schoolLongitude ?? school.location.longitude;
    const schoolPosition: [number, number] = [schoolLatitude, schoolLongitude];
    const selectedQuota = ppdb?.trackQuotas.find((quota) => quota.trackType === trackType) ?? null;

    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

    const ppdbTimeline = [
        {
            label: 'Buka Pendaftaran',
            icon: Calendar,
            accent: '#10B981',
            value: ppdb?.applicationOpensAt
                ? dateFormatter.format(new Date(ppdb.applicationOpensAt))
                : 'Segera diumumkan',
        },
        {
            label: 'Tutup Pendaftaran',
            icon: Clock,
            accent: '#F59E0B',
            value: ppdb?.applicationClosesAt
                ? dateFormatter.format(new Date(ppdb.applicationClosesAt))
                : 'Menunggu jadwal resmi',
        },
        {
            label: 'Pengumuman Hasil',
            icon: Megaphone,
            accent: '#8B5CF6',
            value: ppdb?.announcementAt
                ? dateFormatter.format(new Date(ppdb.announcementAt))
                : 'Mengikuti keputusan panitia',
        },
    ];

    function applyHomePosition(nextLatitude: number, nextLongitude: number) {
        setLatitude(nextLatitude.toFixed(6));
        setLongitude(nextLongitude.toFixed(6));
        setErrorMessage(null);
    }

    async function handleGeocodeAddress() {
        if (addressLine.trim().length < 5) {
            setErrorMessage(
                'Masukkan alamat rumah yang cukup spesifik sebelum menjalankan geocoding.',
            );
            return;
        }

        setIsGeocoding(true);
        setErrorMessage(null);

        try {
            const response = await fetch(
                `/api/public/geocode/search?q=${encodeURIComponent(addressLine)}&limit=5`,
                { headers: { Accept: 'application/json' } },
            );
            const payload = await response.json();

            if (!response.ok) {
                setErrorMessage(
                    payload?.message ??
                        'Alamat belum dapat diterjemahkan ke koordinat. Coba perjelas detail wilayah.',
                );
                return;
            }

            const results = (payload?.data?.results ?? []) as GeocodeCandidate[];
            setGeocodeResults(results);

            if (results.length === 0) {
                setErrorMessage(
                    'Alamat belum ditemukan. Tambahkan detail seperti desa, kecamatan, atau kabupaten.',
                );
            }
        } catch {
            setErrorMessage(
                'Layanan geocoding belum merespons. Anda tetap bisa memakai lokasi browser, klik peta, atau input manual.',
            );
        } finally {
            setIsGeocoding(false);
        }
    }

    useEffect(() => {
        const parsedLatitude = Number.parseFloat(deferredLatitude);
        const parsedLongitude = Number.parseFloat(deferredLongitude);

        if (
            Number.isNaN(parsedLatitude) ||
            Number.isNaN(parsedLongitude) ||
            !Number.isFinite(parsedLatitude) ||
            !Number.isFinite(parsedLongitude)
        ) {
            startTransition(() => setPreview(null));
            return;
        }

        const distanceKm = calculateHaversineKm(
            schoolLatitude,
            schoolLongitude,
            parsedLatitude,
            parsedLongitude,
        );

        startTransition(() =>
            setPreview({
                homePosition: [parsedLatitude, parsedLongitude],
                distanceKm,
                insideZone: distanceKm <= (ppdb?.zoneRadiusKm ?? 5),
            }),
        );
    }, [
        deferredLatitude,
        deferredLongitude,
        ppdb?.zoneRadiusKm,
        schoolLatitude,
        schoolLongitude,
    ]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!ppdb) {
            setErrorMessage('Siklus PPDB aktif belum tersedia.');
            return;
        }

        if (!preview) {
            setErrorMessage(
                'Masukkan latitude dan longitude rumah yang valid untuk memeriksa jarak.',
            );
            return;
        }

        setIsSubmitting(true);
        setErrorMessage(null);
        setSubmissionResult(null);

        try {
            const response = await fetch('/api/ppdb/applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    ppdb_cycle_id: ppdb.id,
                    track_type: trackType,
                    full_name: fullName,
                    phone,
                    email,
                    previous_school_name: previousSchoolName,
                    address_line: addressLine,
                    latitude: preview.homePosition[0],
                    longitude: preview.homePosition[1],
                    ketm_flag: ketmFlag,
                    special_condition_flag: specialConditionFlag,
                    achievements_summary: achievementsSummary,
                    submission_payload: {
                        preview_distance_km: preview.distanceKm,
                        preview_zone_status: preview.insideZone ? 'inside' : 'outside',
                    },
                }),
            });

            const payload = await response.json();

            if (!response.ok) {
                setErrorMessage(
                    payload?.message ??
                        'Pengiriman formulir gagal. Periksa kembali data yang diisi.',
                );
                return;
            }

            setSubmissionResult({
                registrationNumber: payload?.data?.registration_number,
                status: payload?.data?.status ?? null,
            });
        } catch {
            setErrorMessage(
                'Koneksi ke endpoint PPDB gagal. Coba lagi beberapa saat.',
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleUseCurrentLocation() {
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
            setErrorMessage(
                'Browser ini tidak mendukung geolocation. Gunakan klik peta atau input manual koordinat.',
            );
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                applyHomePosition(
                    position.coords.latitude,
                    position.coords.longitude,
                );
                setGeocodeResults([]);
                setIsLocating(false);
            },
            () => {
                setErrorMessage(
                    'Izin lokasi ditolak atau lokasi tidak dapat dibaca. Gunakan klik peta atau input manual.',
                );
                setIsLocating(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000,
            },
        );
    }

    const currentTrackConfig = trackConfig[trackType] ?? trackConfig.zonasi;

    return (
        <>
            <Head title="PPDB — Penerimaan Peserta Didik Baru">
                <meta
                    name="description"
                    content={`Informasi PPDB ${school.name}. Simulasi zonasi interaktif, kuota jalur, dan pendaftaran online.`}
                />
            </Head>

            <div className="space-y-20">
                {/* ═══════════ HERO BANNER FULL SCREEN ═══════════ */}
                <motion.section
                    ref={heroRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    id="hero"
                    className="relative w-[100vw] h-[85vh] lg:h-[100dvh] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-8 md:-mt-10 overflow-hidden bg-neutral-900"
                >
                    {/* Background Image with Parallax */}
                    <motion.div className="absolute inset-0 z-0" style={{ y: heroY }}>
                        <img
                            src="/images/profil/hero-banner.png"
                            alt="Kampus SMAN 1 Tenjo"
                            className="h-[120%] w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(2,6,23,0.97)] via-[rgba(2,6,23,0.55)] to-[rgba(2,6,23,0.2)]" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(2,6,23,0.7)] via-transparent to-transparent" />
                    </motion.div>

                    {/* Ambient Effects */}
                    <div className="absolute inset-0 z-[1] pointer-events-none">
                        <div className="absolute -left-40 top-1/3 size-[500px] rounded-full bg-emerald-500/[0.07] blur-[150px]" />
                        <div className="absolute -right-32 bottom-1/4 size-[400px] rounded-full bg-violet-500/[0.06] blur-[130px]" />
                    </div>

                    {/* Content Overlay */}
                    <motion.div className="absolute inset-0 z-10 flex flex-col justify-end" style={{ opacity: heroOpacity }}>
                        <div className="mx-auto w-full max-w-[84rem] p-5 pb-12 md:p-8 md:pb-20">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="inline-flex w-fit items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 backdrop-blur-md"
                            >
                                <div className="relative">
                                    <GraduationCap className="size-4 text-emerald-400" />
                                    <div className="absolute inset-0 animate-ping text-emerald-400 opacity-30">
                                        <GraduationCap className="size-4" />
                                    </div>
                                </div>
                                <span className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-emerald-300">
                                    PPDB {ppdb?.name ?? new Date().getFullYear()}
                                </span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.35 }}
                                className="mt-5 max-w-4xl font-heading text-4xl leading-[1.1] text-white md:text-5xl lg:text-7xl"
                            >
                                Penerimaan Peserta Didik Baru
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.45 }}
                                className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg"
                            >
                                Simulasi zonasi interaktif dengan peta, verifikasi jarak domisili otomatis, dan pendaftaran langsung. Semua dalam satu pengalaman.
                            </motion.p>

                            {/* Hero Stats Row */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.55 }}
                                className="mt-10 flex flex-wrap items-center gap-4"
                            >
                                {[
                                    { label: 'Kapasitas', value: ppdb ? numberFormatter.format(ppdb.capacity) : '—', icon: Users, accentColor: '#10B981' },
                                    { label: 'Radius Zona', value: ppdb ? `${numberFormatter.format(ppdb.zoneRadiusKm)} km` : '—', icon: MapPin, accentColor: '#38BDF8' },
                                    { label: 'Jalur', value: ppdb ? `${ppdb.trackQuotas.length} Jalur` : '—', icon: FileText, accentColor: '#C084FC' },
                                ].map((s) => (
                                    <motion.div
                                        key={s.label}
                                        whileHover={{ y: -4, scale: 1.03 }}
                                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 backdrop-blur-lg shadow-2xl transition-all hover:border-white/20 hover:bg-white/[0.08]"
                                    >
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle at center, ${s.accentColor}08, transparent 70%)` }} />
                                        <div className="relative flex items-center gap-3.5">
                                            <div
                                                className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] shadow-inner transition-all group-hover:border-opacity-30"
                                                style={{ borderColor: `${s.accentColor}20` }}
                                            >
                                                <s.icon className="size-4 transition-colors" style={{ color: s.accentColor }} />
                                            </div>
                                            <div>
                                                <div className="text-xl font-heading text-white">{s.value}</div>
                                                <div className="mt-0.5 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-300">
                                                    {s.label}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 0.8 }}
                        className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2"
                    >
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="flex flex-col items-center gap-2"
                        >
                            <span className="text-[0.55rem] font-bold uppercase tracking-[0.3em] text-white/40">Scroll</span>
                            <div className="h-8 w-[1.5px] bg-gradient-to-b from-white/40 to-transparent" />
                        </motion.div>
                    </motion.div>
                </motion.section>

                {/* ═══════════ TIMELINE JADWAL ═══════════ */}
                <section id="timeline" className="scroll-mt-24 space-y-10">
                    <SectionHeading
                        eyebrow="Jadwal PPDB"
                        title="Ritme penting yang tidak boleh terlewat."
                        description="Tiga titik waktu yang menentukan perjalanan Anda menjadi bagian dari keluarga besar SMAN 1 Tenjo."
                    />

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={motionViewport}
                        className="grid gap-5 md:grid-cols-3"
                    >
                        {ppdbTimeline.map((item, i) => (
                            <motion.div key={item.label} variants={fadeUp} whileHover={{ y: -6 }}>
                                <BorderGlow
                                    borderRadius={28}
                                    colors={[item.accent, '#6366F1', '#0EA5E9']}
                                    className="relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/88 shadow-[0_24px_50px_-20px_rgba(15,118,110,0.15)] hover:shadow-[0_28px_80px_-20px_rgba(15,118,110,0.3)] transition-all"
                                >
                                    <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at top left, ${item.accent}08, transparent 60%)` }} />
                                    <div className="relative z-10 p-7">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="flex size-14 items-center justify-center rounded-2xl border bg-white shadow-sm"
                                                style={{ 
                                                    borderColor: `${item.accent}30`,
                                                    color: item.accent,
                                                }}
                                            >
                                                <item.icon className="size-6" />
                                            </div>
                                            <div className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-slate-500">
                                                Tahap {String(i + 1).padStart(2, '0')}
                                            </div>
                                        </div>
                                        <h3 className="mt-5 font-heading text-xl text-[var(--school-ink)]">{item.label}</h3>
                                        <div className="mt-3 text-2xl font-heading text-[var(--school-ink)]">{item.value}</div>
                                    </div>
                                </BorderGlow>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* ═══════════ CHART VISUALISASI KUOTA ═══════════ */}
                {ppdb && ppdb.trackQuotas.length > 0 && (
                    <section className="scroll-mt-24">
                        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
                            <PpdbQuotaChart
                                data={ppdb.trackQuotas.map((q) => ({
                                    track: q.trackType.charAt(0).toUpperCase() + q.trackType.slice(1),
                                    percentage: q.quotaPercentage,
                                    seats: q.quotaSeats,
                                }))}
                                totalCapacity={ppdb.capacity}
                            />
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={motionViewport}
                                className="rounded-[2rem] border border-white/70 bg-white/90 p-6 md:p-8 shadow-[0_20px_60px_-30px_rgba(15,118,110,0.15)] backdrop-blur-xl flex flex-col justify-center"
                            >
                                <div className="space-y-5">
                                    <h3 className="font-heading text-lg font-semibold text-[var(--school-ink)]">Ringkasan Kapasitas</h3>
                                    <div className="grid gap-4 grid-cols-2">
                                        {ppdb.trackQuotas.map((q) => (
                                            <div key={q.trackType} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                                                <div className="text-2xl font-bold text-[var(--school-ink)]">{q.quotaSeats}</div>
                                                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{q.trackType}</div>
                                                <div className="text-xs text-[var(--school-muted)]">{q.quotaPercentage}% kapasitas</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-4">
                                        <div className="text-3xl font-bold text-emerald-700">{ppdb.capacity}</div>
                                        <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Total Kapasitas</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </section>
                )}

                {/* ═══════════ KUOTA JALUR ═══════════ */}
                <section id="kuota" className="scroll-mt-24 space-y-10">
                    <SectionHeading
                        eyebrow="Kuota Jalur"
                        title="Empat jalur, satu tujuan."
                        description="Informasi lengkap alokasi kursi per jalur penerimaan. Pilih jalur untuk melihat detail kuota."
                    />

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={motionViewport}
                        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
                    >
                        {(ppdb?.trackQuotas ?? []).map((quota) => {
                            const active = quota.trackType === trackType;
                            const config = trackConfig[quota.trackType] ?? trackConfig.zonasi;
                            const TrackIcon = config.icon;

                            return (
                                <motion.button
                                    key={quota.trackType}
                                    variants={fadeUp}
                                    whileHover={{ y: -6, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    onClick={() => setTrackType(quota.trackType)}
                                    className="text-left"
                                >
                                    <BorderGlow
                                        borderRadius={28}
                                        colors={active ? [config.accent, '#10B981', config.accent] : ['#CBD5E1', '#E2E8F0']}
                                        className={`relative overflow-hidden rounded-[1.75rem] border transition-all duration-300 ${
                                            active
                                                ? 'border-white/90 bg-white shadow-[0_28px_80px_-40px_rgba(15,118,110,0.35)]'
                                                : 'border-white/50 bg-white/50 hover:border-white/80 hover:bg-white/80 hover:shadow-[0_24px_50px_-20px_rgba(15,118,110,0.15)] shadow-sm'
                                        }`}
                                    >
                                        {active && (
                                            <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at top right, ${config.accent}08, transparent 60%)` }} />
                                        )}
                                        <div className="relative z-10 p-6">
                                            <div
                                                className="flex size-12 items-center justify-center rounded-xl border backdrop-blur-md shadow-sm transition-all"
                                                style={{
                                                    backgroundColor: active ? 'white' : 'rgba(255,255,255,0.7)',
                                                    borderColor: active ? `${config.accent}40` : 'rgba(0,0,0,0.05)',
                                                    color: active ? config.accent : '#64748B',
                                                }}
                                            >
                                                <TrackIcon className="size-5" />
                                            </div>
                                            <div className="mt-4 text-[0.68rem] font-bold uppercase tracking-[0.24em]" style={{ color: active ? config.accent : '#64748B' }}>
                                                {quota.trackType}
                                            </div>
                                            <div className="mt-2 text-3xl font-heading text-[var(--school-ink)]">
                                                <AnimatedCounter value={quota.quotaSeats} />
                                            </div>
                                            <div className="mt-1 text-xs text-slate-500">
                                                {numberFormatter.format(quota.quotaPercentage)}% dari kapasitas
                                            </div>
                                            {active && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="mt-4 rounded-xl border border-emerald-50 bg-[rgba(240,253,244,0.6)] px-3 py-2.5"
                                                >
                                                    <p className="text-[0.72rem] leading-relaxed text-[var(--school-muted)]">
                                                        {config.description}
                                                    </p>
                                                </motion.div>
                                            )}
                                        </div>
                                    </BorderGlow>
                                </motion.button>
                            );
                        })}
                    </motion.div>
                </section>

                {/* ═══════════ SIMULASI ZONASI ═══════════ */}
                <section id="simulasi" className="scroll-mt-24 space-y-10">
                    <SectionHeading
                        eyebrow="Simulasi Zonasi"
                        title="Peta interaktif untuk mengukur peluang."
                        description="Klik peta, masukkan adres, atau gunakan GPS untuk mengukur jarak domisili ke sekolah secara real-time."
                    />

                    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
                        {/* ── FORM PANEL ── */}
                        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={motionViewport}>
                            <form onSubmit={handleSubmit}>
                                <BorderGlow
                                    borderRadius={30}
                                    colors={['#10B981', '#0EA5E9', '#8B5CF6']}
                                    className="relative overflow-hidden rounded-[1.9rem] border border-white/70 bg-white/88 shadow-[0_28px_80px_-50px_rgba(15,118,110,0.45)]"
                                >
                                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-emerald-500/[0.02] via-transparent to-violet-500/[0.02]" />
                                    <div className="relative z-10 space-y-5 p-7 md:p-8">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-10 items-center justify-center rounded-xl bg-[rgba(236,253,245,0.7)] border border-emerald-100 text-emerald-600 shadow-sm">
                                                <FileText className="size-4" />
                                            </div>
                                            <div>
                                                <h3 className="font-heading text-lg text-[var(--school-ink)]">Formulir Pendaftaran</h3>
                                                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-slate-500">Simulasi & Submit</p>
                                            </div>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            {[
                                                { val: fullName, set: setFullName, ph: 'Nama lengkap calon siswa', icon: Users },
                                                { val: phone, set: setPhone, ph: 'Nomor telepon', icon: Zap },
                                                { val: email, set: setEmail, ph: 'Email', icon: Sparkles, type: 'email' },
                                                { val: previousSchoolName, set: setPreviousSchoolName, ph: 'Sekolah asal', icon: BookOpen },
                                            ].map((field) => (
                                                <div key={field.ph} className="relative group">
                                                    <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 transition-colors group-focus-within:text-emerald-500" />
                                                    <Input
                                                        value={field.val}
                                                        onChange={(e) => field.set(e.target.value)}
                                                        placeholder={field.ph}
                                                        type={field.type ?? 'text'}
                                                        className="h-12 rounded-xl border-slate-200 bg-white/60 pl-11 text-sm text-[var(--school-ink)] placeholder:text-slate-400 focus:border-emerald-500/40 focus:ring-emerald-500/20 shadow-sm transition-all"
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Track Select */}
                                        <div className="relative group">
                                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 transition-colors group-focus-within:text-emerald-500 z-10" />
                                            <select
                                                value={trackType}
                                                onChange={(event) => setTrackType(event.target.value)}
                                                className="h-12 w-full rounded-xl border border-slate-200 bg-white/60 pl-11 pr-4 text-sm text-[var(--school-ink)] outline-none focus:border-emerald-500/40 transition-all appearance-none shadow-sm"
                                            >
                                                {(ppdb?.trackQuotas ?? []).map((quota) => (
                                                    <option key={quota.trackType} value={quota.trackType} className="bg-white">
                                                        Jalur {quota.trackType}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Address + Geocode */}
                                        <div className="space-y-3">
                                            <div className="relative group">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 transition-colors group-focus-within:text-emerald-500" />
                                                <Input
                                                    value={addressLine}
                                                    onChange={(e) => {
                                                        setAddressLine(e.target.value);
                                                        setGeocodeResults([]);
                                                    }}
                                                    placeholder="Alamat lengkap rumah"
                                                    className="h-12 rounded-xl border-slate-200 bg-white/60 pl-11 text-sm text-[var(--school-ink)] placeholder:text-slate-400 focus:border-emerald-500/40 shadow-sm transition-all"
                                                />
                                            </div>

                                            <div className="grid gap-3 md:grid-cols-2">
                                                <Input
                                                    value={latitude}
                                                    onChange={(event) => setLatitude(event.target.value)}
                                                    placeholder="Latitude"
                                                    className="h-12 rounded-xl border-slate-200 bg-white/60 text-sm text-[var(--school-ink)] placeholder:text-slate-400 focus:border-emerald-500/40 shadow-sm transition-all"
                                                />
                                                <Input
                                                    value={longitude}
                                                    onChange={(event) => setLongitude(event.target.value)}
                                                    placeholder="Longitude"
                                                    className="h-12 rounded-xl border-slate-200 bg-white/60 text-sm text-[var(--school-ink)] placeholder:text-slate-400 focus:border-emerald-500/40 shadow-sm transition-all"
                                                />
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-wrap gap-2.5">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="rounded-full border-[var(--school-green-200)] bg-white/80 text-[var(--school-green-700)] hover:bg-[var(--school-green-50)] hover:text-[var(--school-green-800)] text-xs"
                                                onClick={handleUseCurrentLocation}
                                                disabled={isLocating}
                                            >
                                                {isLocating ? (
                                                    <>
                                                        <LoaderCircle className="size-3.5 animate-spin" />
                                                        Membaca lokasi
                                                    </>
                                                ) : (
                                                    <>
                                                        <Crosshair className="size-3.5" />
                                                        Lokasi saya
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="rounded-full border-sky-200 bg-white/80 text-sky-700 hover:bg-sky-50 hover:text-sky-800 text-xs"
                                                onClick={handleGeocodeAddress}
                                                disabled={isGeocoding}
                                            >
                                                {isGeocoding ? (
                                                    <>
                                                        <LoaderCircle className="size-3.5 animate-spin" />
                                                        Mencari
                                                    </>
                                                ) : (
                                                    <>
                                                        <Search className="size-3.5" />
                                                        Geocode alamat
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="rounded-full border-amber-200 bg-white/80 text-amber-700 hover:bg-amber-50 hover:text-amber-800 text-xs"
                                                onClick={() => {
                                                    setLatitude('');
                                                    setLongitude('');
                                                    setPreview(null);
                                                    setGeocodeResults([]);
                                                }}
                                            >
                                                <RotateCcw className="size-3.5" />
                                                Reset
                                            </Button>
                                        </div>

                                        {/* Geocode Results */}
                                        {geocodeResults.length > 0 && (
                                            <div className="grid gap-2">
                                                {geocodeResults.map((result) => (
                                                    <button
                                                        key={`${result.latitude}-${result.longitude}`}
                                                        type="button"
                                                        onClick={() => {
                                                            setAddressLine(result.displayName);
                                                            applyHomePosition(result.latitude, result.longitude);
                                                            setGeocodeResults([]);
                                                        }}
                                                        className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-left transition-all hover:bg-emerald-50 hover:border-emerald-200"
                                                    >
                                                        <div className="text-sm font-medium text-[var(--school-ink)]">{result.displayName}</div>
                                                        <div className="mt-1.5 text-xs text-emerald-600 font-mono">
                                                            {result.latitude.toFixed(5)}, {result.longitude.toFixed(5)}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {/* Achievements */}
                                        <textarea
                                            value={achievementsSummary}
                                            onChange={(event) => setAchievementsSummary(event.target.value)}
                                            rows={3}
                                            placeholder="Ringkasan prestasi (opsional)"
                                            className="w-full rounded-xl border border-slate-200 bg-white/60 px-4 py-3 text-sm text-[var(--school-ink)] placeholder:text-slate-400 outline-none focus:border-emerald-500/40 transition-all resize-none shadow-sm"
                                        />

                                        {/* Checkbox Flags */}
                                        <div className="grid gap-3 md:grid-cols-2">
                                            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/60 px-4 py-3.5 text-sm text-[var(--school-muted)] cursor-pointer hover:bg-white/90 transition-all shadow-sm">
                                                <input
                                                    type="checkbox"
                                                    checked={ketmFlag}
                                                    onChange={(event) => setKetmFlag(event.target.checked)}
                                                    className="size-4 rounded border-slate-300 accent-[#0F766E]"
                                                />
                                                Afirmasi KETM
                                            </label>
                                            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/60 px-4 py-3.5 text-sm text-[var(--school-muted)] cursor-pointer hover:bg-white/90 transition-all shadow-sm">
                                                <input
                                                    type="checkbox"
                                                    checked={specialConditionFlag}
                                                    onChange={(event) => setSpecialConditionFlag(event.target.checked)}
                                                    className="size-4 rounded border-slate-300 accent-[#0F766E]"
                                                />
                                                Kondisi Khusus
                                            </label>
                                        </div>

                                        {/* Zone Status Preview */}
                                        <div className="rounded-2xl border border-emerald-100 bg-[rgba(240,253,244,0.6)] p-5 backdrop-blur-sm">
                                            <div className="flex items-center justify-between gap-4">
                                                <div>
                                                    <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--school-green-700)]">
                                                        Status Zona
                                                    </div>
                                                    <div className="mt-2 text-2xl font-heading text-[var(--school-ink)]">
                                                        {preview ? (
                                                            preview.insideZone ? (
                                                                <span className="inline-flex items-center gap-2 text-emerald-600">
                                                                    <CheckCircle2 className="size-6" />
                                                                    Masuk Zona
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-2 text-amber-600">
                                                                    <AlertCircle className="size-6" />
                                                                    Luar Zona
                                                                </span>
                                                            )
                                                        ) : (
                                                            <span className="text-slate-400">Menunggu koordinat</span>
                                                        )}
                                                    </div>
                                                </div>
                                                {preview && (
                                                    <div className="text-right">
                                                        <div className="text-3xl font-heading text-[var(--school-ink)]">
                                                            {numberFormatter.format(preview.distanceKm)}
                                                        </div>
                                                        <div className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-slate-500">
                                                            Kilometer
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Error / Success Messages */}
                                        {errorMessage && (
                                            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                                <AlertCircle className="size-4 mt-0.5 shrink-0" />
                                                {errorMessage}
                                            </div>
                                        )}

                                        {submissionResult && (
                                            <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                                                <CheckCircle2 className="size-4 mt-0.5 shrink-0" />
                                                <div>
                                                    Formulir terkirim. Nomor pendaftaran:{' '}
                                                    <strong className="text-emerald-900">{submissionResult.registrationNumber}</strong>
                                                </div>
                                            </div>
                                        )}

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="relative w-full overflow-hidden rounded-2xl border border-[var(--school-green-600)] bg-[var(--school-green-700)] px-8 py-4 font-heading text-base text-white shadow-lg shadow-emerald-500/20 transition-all hover:shadow-xl hover:shadow-emerald-500/30 hover:bg-[var(--school-green-600)] disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full hover:translate-x-full transition-transform duration-700" />
                                            {isSubmitting ? (
                                                <span className="relative flex items-center justify-center gap-2">
                                                    <LoaderCircle className="size-5 animate-spin" />
                                                    Mengirim pendaftaran...
                                                </span>
                                            ) : (
                                                <span className="relative">Kirim Simulasi PPDB</span>
                                            )}
                                        </button>
                                    </div>
                                </BorderGlow>
                            </form>
                        </motion.div>

                        {/* ── MAP PANEL ── */}
                        <div className="space-y-5">
                            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={motionViewport}>
                                <BorderGlow
                                    borderRadius={30}
                                    colors={['#0EA5E9', '#10B981', '#8B5CF6']}
                                    className="overflow-hidden rounded-[1.9rem] border border-white/70 bg-white/88 shadow-[0_28px_80px_-50px_rgba(15,118,110,0.45)]"
                                >
                                    <div className="p-3">
                                        <Suspense
                                            fallback={
                                                <div className="flex h-[480px] items-center justify-center rounded-[1.6rem] bg-slate-50 text-slate-400 border border-slate-100">
                                                    <LoaderCircle className="size-8 animate-spin" />
                                                </div>
                                            }
                                        >
                                            <PpdbDistanceMap
                                                schoolPosition={schoolPosition}
                                                homePosition={preview?.homePosition ?? null}
                                                zoneRadiusKm={ppdb?.zoneRadiusKm ?? 5}
                                                onSelectPosition={(position) => {
                                                    applyHomePosition(position[0], position[1]);
                                                }}
                                            />
                                        </Suspense>
                                    </div>

                                    {/* Map Stats Row */}
                                    <div className="grid grid-cols-3 border-t border-slate-100">
                                        {[
                                            { label: 'Sekolah', value: `${schoolLatitude.toFixed(4)}, ${schoolLongitude.toFixed(4)}` },
                                            { label: 'Rumah', value: preview ? `${preview.homePosition[0].toFixed(4)}, ${preview.homePosition[1].toFixed(4)}` : 'Klik peta' },
                                            { label: 'Radius', value: `${numberFormatter.format(ppdb?.zoneRadiusKm ?? 5)} km` },
                                        ].map((stat) => (
                                            <div key={stat.label} className="p-4 text-center border-r border-slate-100 last:border-r-0 bg-white/50">
                                                <div className="text-[0.55rem] font-bold uppercase tracking-[0.25em] text-[var(--school-green-700)]">{stat.label}</div>
                                                <div className="mt-1.5 text-xs font-mono text-slate-600 truncate">{stat.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </BorderGlow>
                            </motion.div>

                            {/* Simulation Result Card */}
                            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={motionViewport}>
                                <BorderGlow
                                    borderRadius={28}
                                    colors={preview?.insideZone ? ['#10B981', '#34D399', '#059669'] : ['#F59E0B', '#FBBF24', '#D97706']}
                                    className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/88 shadow-[0_28px_80px_-50px_rgba(15,118,110,0.45)]"
                                >
                                    <div className="p-7">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--school-green-700)]">
                                                    Panel Hasil Simulasi
                                                </div>
                                                <div className="mt-3 text-4xl font-heading text-[var(--school-ink)]">
                                                    {preview
                                                        ? `${numberFormatter.format(preview.distanceKm)} km`
                                                        : 'Belum ada data'}
                                                </div>
                                            </div>
                                            <div
                                                className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] border backdrop-blur-md ${
                                                    preview?.insideZone
                                                        ? 'border-emerald-200 bg-[rgba(220,252,231,0.68)] text-[var(--school-green-800)]'
                                                        : 'border-amber-200 bg-[rgba(255,251,235,0.94)] text-[var(--school-gold-700)]'
                                                }`}
                                            >
                                                {preview
                                                    ? preview.insideZone
                                                        ? '✓ Masuk Zona'
                                                        : '! Luar Zona'
                                                    : 'Menunggu'}
                                            </div>
                                        </div>

                                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                                            <div className="rounded-xl border border-slate-200 bg-white/60 p-4 shadow-sm">
                                                <div className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-slate-500">Jalur Aktif</div>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <currentTrackConfig.icon className="size-4" style={{ color: currentTrackConfig.accent }} />
                                                    <span className="font-heading text-lg text-[var(--school-ink)] capitalize">{trackType}</span>
                                                </div>
                                                <p className="mt-1.5 text-xs text-[var(--school-muted)]">
                                                    {selectedQuota
                                                        ? `${numberFormatter.format(selectedQuota.quotaSeats)} kursi • ${numberFormatter.format(selectedQuota.quotaPercentage)}%`
                                                        : 'Mengikuti konfigurasi panitia.'}
                                                </p>
                                            </div>
                                            <div className="rounded-xl border border-slate-200 bg-white/60 p-4 shadow-sm">
                                                <div className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-slate-500">Langkah Berikutnya</div>
                                                <div className="mt-2 font-heading text-lg text-[var(--school-ink)]">
                                                    {submissionResult
                                                        ? submissionResult.registrationNumber
                                                        : 'Lengkapi formulir'}
                                                </div>
                                                <p className="mt-1.5 text-xs text-[var(--school-muted)]">
                                                    {submissionResult
                                                        ? 'Simpan nomor pendaftaran untuk verifikasi.'
                                                        : 'Input koordinat rumah, lalu kirim formulir.'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </BorderGlow>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ═══════════ FAQ ═══════════ */}
                <section id="faq" className="scroll-mt-24 space-y-10">
                    <SectionHeading
                        eyebrow="FAQ"
                        title="Pertanyaan yang sering diajukan."
                        description="Jawaban atas kekhawatiran umum calon peserta didik dan orang tua terkait PPDB SMAN 1 Tenjo."
                    />

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={motionViewport}
                        className="grid gap-4 md:grid-cols-1 lg:max-w-3xl"
                    >
                        {ppdbFaqs.map((faq, i) => (
                            <FaqItem key={faq.question} question={faq.question} answer={faq.answer} index={i} />
                        ))}
                    </motion.div>
                </section>
            </div>
        </>
    );
}
