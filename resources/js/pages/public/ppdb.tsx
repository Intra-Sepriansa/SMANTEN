import { Head } from '@inertiajs/react';
import {
    motion,
    useInView,
    useScroll,
    useTransform,
    AnimatePresence,
} from 'framer-motion';
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
import {
    lazy,
    startTransition,
    Suspense,
    useDeferredValue,
    useEffect,
    useRef,
    useState,
} from 'react';
import CardSwap, { Card } from '@/components/CardSwap';
import { PpdbQuotaChart } from '@/components/charts/school-charts';
import Cubes from '@/components/Cubes';
import { AdvancedMenuStage } from '@/components/public/advanced-menu-stage';
import { BorderGlow } from '@/components/public/border-glow';
import { SectionHeading } from '@/components/public/section-heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { calculateHaversineKm } from '@/lib/geo';
import { fadeUp, motionViewport, staggerContainer } from '@/lib/motion';
import { ppdbFaqs } from '@/lib/public-content';
import { store as storePpdbApplication } from '@/routes/api/ppdb/applications';
import { search as searchGeocode } from '@/routes/api/public/geocode';
import type {
    GeocodeCandidate,
    PpdbPayload,
    SchoolProfilePayload,
} from '@/types';

const PpdbDistanceMap = lazy(
    () => import('@/components/maps/ppdb-distance-map'),
);

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
        if (!inView) {
            return;
        }

        let frame: number;
        const duration = 1200;
        const start = performance.now();
        function tick(now: number) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * value));

            if (progress < 1) {
                frame = requestAnimationFrame(tick);
            }
        }
        frame = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(frame);
    }, [inView, value]);

    return (
        <span ref={ref}>{new Intl.NumberFormat('id-ID').format(display)}</span>
    );
}

/* ─── Formatters ─── */
const numberFormatter = new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
});

/* ─── Track Type Config ─── */
const trackConfig: Record<
    string,
    {
        icon: typeof Shield;
        accent: string;
        gradient: string;
        description: string;
    }
> = {
    zonasi: {
        icon: MapPin,
        accent: '#10B981',
        gradient: 'from-emerald-500/20 to-emerald-600/5',
        description: 'Berdasarkan jarak domisili ke sekolah',
    },
    afirmasi: {
        icon: Shield,
        accent: '#38BDF8',
        gradient: 'from-sky-500/20 to-sky-600/5',
        description: 'Untuk calon siswa dari keluarga ekonomi tidak mampu',
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
function FaqItem({
    question,
    answer,
    index,
}: {
    question: string;
    answer: string;
    index: number;
}) {
    const [open, setOpen] = useState(false);

    return (
        <motion.div variants={fadeUp} className="group">
            <BorderGlow
                borderRadius={24}
                colors={['#0F766E', '#0EA5E9', '#A855F7']}
                className="overflow-hidden rounded-3xl border border-white/70 bg-white/88 shadow-[0_24px_50px_-20px_rgba(15,118,110,0.15)] backdrop-blur-md transition-all hover:shadow-[0_24px_70px_-20px_rgba(15,118,110,0.3)]"
            >
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="flex w-full items-center gap-4 p-6 text-left transition-colors hover:bg-[rgba(240,253,244,0.4)]"
                >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-white font-heading text-sm text-(--school-green-700) shadow-sm">
                        {String(index + 1).padStart(2, '0')}
                    </div>
                    <h3 className="flex-1 font-heading text-base text-(--school-ink) md:text-lg">
                        {question}
                    </h3>
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
                            <div className="bg-linear-to-b from-transparent to-white/30 px-6 pb-6 pl-20">
                                <p className="text-sm leading-relaxed text-(--school-muted)">
                                    {answer}
                                </p>
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
    const [trackType, setTrackType] = useState(
        ppdb?.trackQuotas[0]?.trackType ?? 'zonasi',
    );
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
    const [submissionResult, setSubmissionResult] =
        useState<SubmissionResult | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [geocodeResults, setGeocodeResults] = useState<GeocodeCandidate[]>(
        [],
    );

    const deferredLatitude = useDeferredValue(latitude);
    const deferredLongitude = useDeferredValue(longitude);

    const schoolLatitude = ppdb?.schoolLatitude ?? school.location.latitude;
    const schoolLongitude = ppdb?.schoolLongitude ?? school.location.longitude;
    const schoolPosition: [number, number] = [schoolLatitude, schoolLongitude];
    const selectedQuota =
        ppdb?.trackQuotas.find((quota) => quota.trackType === trackType) ??
        null;

    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });
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

    const quotaPreviewRows =
        ppdb && ppdb.trackQuotas.length > 0
            ? ppdb.trackQuotas.slice(0, 3).map((quota) => ({
                  label: quota.trackType,
                  value: `${numberFormatter.format(quota.quotaSeats)} kursi`,
              }))
            : [
                  {
                      label: 'Jalur',
                      value: 'Menunggu konfigurasi',
                  },
              ];

    const heroSwapCards = [
        {
            eyebrow: 'Jadwal',
            title: 'Mulai Siapkan Berkas',
            icon: Calendar,
            accentColor: '#10B981',
            stat: ppdb?.applicationOpensAt
                ? dateFormatter.format(new Date(ppdb.applicationOpensAt))
                : 'Segera diumumkan',
            caption: 'pendaftaran dibuka',
            meter: '82%',
            rows: [
                {
                    label: 'Tutup',
                    value: ppdb?.applicationClosesAt
                        ? dateFormatter.format(
                              new Date(ppdb.applicationClosesAt),
                          )
                        : 'Menunggu jadwal',
                },
                {
                    label: 'Hasil',
                    value: ppdb?.announcementAt
                        ? dateFormatter.format(new Date(ppdb.announcementAt))
                        : 'Mengikuti panitia',
                },
            ],
        },
        {
            eyebrow: 'Kuota',
            title: 'Kursi Penerimaan',
            icon: Users,
            accentColor: '#0EA5E9',
            stat: ppdb ? numberFormatter.format(ppdb.capacity) : 'Belum ada',
            caption: 'total kapasitas',
            meter: '68%',
            rows: quotaPreviewRows,
        },
        {
            eyebrow: 'Zonasi',
            title: 'Cek Jarak Domisili',
            icon: MapPin,
            accentColor: '#F59E0B',
            stat: ppdb
                ? `${numberFormatter.format(ppdb.zoneRadiusKm)} km`
                : 'Belum ada',
            caption: 'radius sekolah',
            meter: '74%',
            rows: [
                {
                    label: 'Titik sekolah',
                    value: school.name,
                },
                {
                    label: 'Simulasi',
                    value: 'Klik peta atau pakai GPS',
                },
            ],
        },
        {
            eyebrow: 'Dokumen',
            title: 'Berkas Inti',
            icon: FileText,
            accentColor: '#EC4899',
            stat: '4 Berkas',
            caption: 'siapkan sebelum daftar',
            meter: '58%',
            rows: [
                {
                    label: 'Identitas',
                    value: 'KK dan akta lahir',
                },
                {
                    label: 'Sekolah asal',
                    value: 'Rapor atau surat lulus',
                },
            ],
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
                searchGeocode.url({
                    query: { q: addressLine, limit: 5 },
                }),
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

            const results = (payload?.data?.results ??
                []) as GeocodeCandidate[];
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
            const response = await fetch(storePpdbApplication.url(), {
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
                        preview_zone_status: preview.insideZone
                            ? 'inside'
                            : 'outside',
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
    const zonasiVisualizationAccent = preview
        ? preview.insideZone
            ? '#10B981'
            : '#F59E0B'
        : currentTrackConfig.accent;
    const zonasiVisualizationCubeBorder = preview
        ? preview.insideZone
            ? 'rgba(15, 118, 110, 0.52)'
            : 'rgba(180, 83, 9, 0.52)'
        : 'rgba(51, 65, 85, 0.42)';
    const zonasiVisualizationFaceColor = preview
        ? preview.insideZone
            ? 'rgba(15, 118, 110, 0.04)'
            : 'rgba(180, 83, 9, 0.04)'
        : 'rgba(15, 23, 42, 0.025)';
    const zonasiVisualizationShadow = preview
        ? preview.insideZone
            ? '0 10px 28px rgba(15, 118, 110, 0.1)'
            : '0 10px 28px rgba(180, 83, 9, 0.1)'
        : '0 10px 28px rgba(15, 23, 42, 0.08)';
    const zonasiVisualizationRipple = preview
        ? preview.insideZone
            ? '#0F766E'
            : '#B45309'
        : '#334155';
    const zonasiMatrixCards = [
        {
            label: 'Jalur Aktif',
            value: trackType,
            helper: selectedQuota
                ? `${numberFormatter.format(selectedQuota.quotaSeats)} kursi • ${numberFormatter.format(selectedQuota.quotaPercentage)}%`
                : 'Mengikuti konfigurasi panitia',
            icon: currentTrackConfig.icon,
        },
        {
            label: 'Radius Aktif',
            value: `${numberFormatter.format(ppdb?.zoneRadiusKm ?? 5)} km`,
            helper: `Pusat radius ${school.name}`,
            icon: MapPin,
        },
        {
            label: 'Status Simulasi',
            value: preview
                ? preview.insideZone
                    ? 'Dalam Radius'
                    : 'Luar Radius'
                : 'Menunggu Titik Rumah',
            helper: preview
                ? `${numberFormatter.format(preview.distanceKm)} km dari sekolah`
                : 'Klik peta atau gunakan GPS',
            icon: preview
                ? preview.insideZone
                    ? CheckCircle2
                    : AlertCircle
                : Crosshair,
        },
        {
            label: 'Koordinat Rumah',
            value: preview
                ? `${preview.homePosition[0].toFixed(3)}, ${preview.homePosition[1].toFixed(3)}`
                : 'Belum Dipilih',
            helper: preview
                ? 'Gunakan untuk validasi awal domisili'
                : 'Lengkapi sebelum kirim formulir',
            icon: Crosshair,
        },
    ];
    const zonasiMatrixChips = preview
        ? [
              preview.insideZone
                  ? 'Prioritas zonasi terbuka'
                  : 'Siapkan jalur cadangan',
              `${numberFormatter.format(preview.distanceKm)} km dari sekolah`,
              `${numberFormatter.format(ppdb?.zoneRadiusKm ?? 5)} km radius aktif`,
          ]
        : [
              `Jalur ${trackType}`,
              `${numberFormatter.format(ppdb?.zoneRadiusKm ?? 5)} km radius aktif`,
              'Klik grid untuk baca pola sebaran',
          ];
    const totalQuotaSeats = ppdb
        ? ppdb.trackQuotas.reduce((total, quota) => total + quota.quotaSeats, 0)
        : 0;

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
                    className="relative right-1/2 left-1/2 -mt-8 -mr-[50vw] -ml-[50vw] h-[85vh] w-screen overflow-hidden bg-neutral-900 md:-mt-10 lg:h-dvh"
                >
                    {/* Background Image with Parallax */}
                    <motion.div
                        className="absolute inset-0 z-0"
                        style={{ y: heroY }}
                    >
                        <img
                            src="/images/profil/hero-banner.png"
                            alt="Kampus SMAN 1 Tenjo"
                            className="h-[120%] w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-[rgba(2,6,23,0.97)] via-[rgba(2,6,23,0.55)] to-[rgba(2,6,23,0.2)]" />
                        <div className="absolute inset-0 bg-linear-to-r from-[rgba(2,6,23,0.7)] via-transparent to-transparent" />
                    </motion.div>

                    {/* Ambient Effects */}
                    <div className="pointer-events-none absolute inset-0 z-1">
                        <div className="absolute top-1/3 -left-40 size-125 rounded-full bg-emerald-500/7 blur-[150px]" />
                        <div className="absolute -right-32 bottom-1/4 size-100 rounded-full bg-violet-500/6 blur-[130px]" />
                    </div>

                    {/* Content Overlay */}
                    <motion.div
                        className="absolute inset-0 z-10 flex flex-col justify-end"
                        style={{ opacity: heroOpacity }}
                    >
                        <div className="mx-auto grid w-full max-w-336 items-end gap-10 p-5 pb-14 md:p-8 md:pb-20 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.8fr)]">
                            <div className="relative z-10 max-w-4xl">
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
                                    <span className="text-[0.68rem] font-bold tracking-[0.28em] text-emerald-300 uppercase">
                                        PPDB{' '}
                                        {ppdb?.name ?? new Date().getFullYear()}
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
                                    Informasi jadwal, kuota jalur, simulasi
                                    jarak domisili, dan formulir pendaftaran.
                                </motion.p>

                                {/* Hero Stats Row */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.55 }}
                                    className="mt-10 flex flex-wrap items-center gap-4"
                                >
                                    {[
                                        {
                                            label: 'Kapasitas',
                                            value: ppdb
                                                ? numberFormatter.format(
                                                      ppdb.capacity,
                                                  )
                                                : '—',
                                            icon: Users,
                                            accentColor: '#10B981',
                                        },
                                        {
                                            label: 'Radius Zona',
                                            value: ppdb
                                                ? `${numberFormatter.format(ppdb.zoneRadiusKm)} km`
                                                : '—',
                                            icon: MapPin,
                                            accentColor: '#38BDF8',
                                        },
                                        {
                                            label: 'Jalur',
                                            value: ppdb
                                                ? `${ppdb.trackQuotas.length} Jalur`
                                                : '—',
                                            icon: FileText,
                                            accentColor: '#C084FC',
                                        },
                                    ].map((s) => (
                                        <motion.div
                                            key={s.label}
                                            whileHover={{ y: -4, scale: 1.03 }}
                                            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/4 px-6 py-4 shadow-2xl backdrop-blur-lg transition-all hover:border-white/20 hover:bg-white/8"
                                        >
                                            <div
                                                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                                style={{
                                                    background: `radial-gradient(circle at center, ${s.accentColor}08, transparent 70%)`,
                                                }}
                                            />
                                            <div className="relative flex items-center gap-3.5">
                                                <div
                                                    className="group-hover:border-opacity-30 flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/6 shadow-inner transition-all"
                                                    style={{
                                                        borderColor: `${s.accentColor}20`,
                                                    }}
                                                >
                                                    <s.icon
                                                        className="size-4 transition-colors"
                                                        style={{
                                                            color: s.accentColor,
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-heading text-xl text-white">
                                                        {s.value}
                                                    </div>
                                                    <div className="mt-0.5 text-[0.6rem] font-bold tracking-[0.2em] text-slate-400 uppercase group-hover:text-slate-300">
                                                        {s.label}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, x: 36, rotate: 1 }}
                                animate={{ opacity: 1, x: 0, rotate: 0 }}
                                transition={{ duration: 0.7, delay: 0.7 }}
                                className="relative hidden h-115 lg:block"
                                aria-hidden="true"
                            >
                                <CardSwap
                                    width={420}
                                    height={285}
                                    cardDistance={46}
                                    verticalDistance={58}
                                    delay={4600}
                                    pauseOnHover
                                    skewAmount={4}
                                >
                                    {heroSwapCards.map((card) => {
                                        const HeroCardIcon = card.icon;

                                        return (
                                            <Card
                                                key={card.title}
                                                customClass="overflow-hidden border-white/80 bg-white/92 p-6 text-(--school-ink) shadow-[0_30px_90px_-35px_rgba(15,23,42,0.55)] backdrop-blur-xl"
                                            >
                                                <div className="flex h-full flex-col justify-between">
                                                    <div>
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="min-w-0">
                                                                <div
                                                                    className="text-[0.64rem] font-bold tracking-[0.24em] uppercase"
                                                                    style={{
                                                                        color: card.accentColor,
                                                                    }}
                                                                >
                                                                    {
                                                                        card.eyebrow
                                                                    }
                                                                </div>
                                                                <h2 className="mt-2 truncate font-heading text-2xl text-(--school-ink)">
                                                                    {card.title}
                                                                </h2>
                                                            </div>
                                                            <div
                                                                className="flex size-12 shrink-0 items-center justify-center rounded-lg border bg-white shadow-sm"
                                                                style={{
                                                                    borderColor: `${card.accentColor}30`,
                                                                    color: card.accentColor,
                                                                }}
                                                            >
                                                                <HeroCardIcon className="size-5" />
                                                            </div>
                                                        </div>

                                                        <div className="mt-7">
                                                            <div className="font-heading text-4xl leading-none text-(--school-ink)">
                                                                {card.stat}
                                                            </div>
                                                            <div className="mt-2 text-[0.68rem] font-bold tracking-[0.2em] text-slate-500 uppercase">
                                                                {card.caption}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                                                            <div
                                                                className="h-full rounded-full"
                                                                style={{
                                                                    width: card.meter,
                                                                    backgroundColor:
                                                                        card.accentColor,
                                                                }}
                                                            />
                                                        </div>

                                                        <div className="space-y-2.5">
                                                            {card.rows.map(
                                                                (row) => (
                                                                    <div
                                                                        key={`${card.title}-${row.label}`}
                                                                        className="flex min-w-0 items-center justify-between gap-4 border-t border-slate-200/70 pt-2.5 first:border-t-0 first:pt-0"
                                                                    >
                                                                        <span className="shrink-0 text-[0.65rem] font-bold tracking-[0.18em] text-slate-500 uppercase">
                                                                            {
                                                                                row.label
                                                                            }
                                                                        </span>
                                                                        <span className="min-w-0 truncate text-right text-sm font-semibold text-slate-700">
                                                                            {
                                                                                row.value
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        );
                                    })}
                                </CardSwap>
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
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            className="flex flex-col items-center gap-2"
                        >
                            <span className="text-[0.55rem] font-bold tracking-[0.3em] text-white/40 uppercase">
                                Scroll
                            </span>
                            <div className="h-8 w-[1.5px] bg-linear-to-b from-white/40 to-transparent" />
                        </motion.div>
                    </motion.div>
                </motion.section>

                <AdvancedMenuStage
                    tone="emerald"
                    eyebrow="PPDB advanced control"
                    title="Panel penerimaan dibuat seperti ruang operasi seleksi."
                    description="Calon siswa langsung melihat jadwal, kuota, radius zonasi, simulasi jarak, dan kesiapan formulir dalam satu alur visual yang lebih cepat dipahami."
                    metrics={[
                        {
                            label: 'Kapasitas',
                            value: ppdb
                                ? numberFormatter.format(ppdb.capacity)
                                : 'Belum ada',
                            helper: 'Total daya tampung siklus aktif.',
                            icon: Users,
                        },
                        {
                            label: 'Kursi Jalur',
                            value: ppdb
                                ? numberFormatter.format(totalQuotaSeats)
                                : 'Belum ada',
                            helper: 'Akumulasi kuota per jalur PPDB.',
                            icon: Shield,
                        },
                        {
                            label: 'Radius',
                            value: `${numberFormatter.format(ppdb?.zoneRadiusKm ?? 5)} km`,
                            helper: 'Dipakai untuk simulasi zonasi rumah.',
                            icon: Crosshair,
                        },
                        {
                            label: 'Status Simulasi',
                            value: preview
                                ? preview.insideZone
                                    ? 'Dalam Radius'
                                    : 'Luar Radius'
                                : 'Menunggu Titik',
                            helper: preview
                                ? `${numberFormatter.format(preview.distanceKm)} km dari sekolah`
                                : 'Isi koordinat untuk membaca jarak.',
                            icon: Zap,
                        },
                    ]}
                    steps={[
                        {
                            label: '01',
                            title: 'Baca Jadwal',
                            description:
                                'Tanggal buka, tutup, dan pengumuman ditampilkan sebagai checkpoint utama.',
                            icon: Calendar,
                        },
                        {
                            label: '02',
                            title: 'Pilih Jalur',
                            description:
                                'Jalur zonasi, afirmasi, perpindahan, dan prestasi dibuat mudah dibandingkan.',
                            icon: Award,
                        },
                        {
                            label: '03',
                            title: 'Cek Radius',
                            description:
                                'Alamat bisa diterjemahkan ke koordinat untuk membaca estimasi jarak.',
                            icon: MapPin,
                        },
                        {
                            label: '04',
                            title: 'Kirim Formulir',
                            description:
                                'Data pendaftaran dikirim ke endpoint PPDB dan menghasilkan nomor registrasi.',
                            icon: CheckCircle2,
                        },
                    ]}
                    signals={[
                        {
                            label: 'Siklus',
                            value: ppdb?.name ?? 'Menunggu',
                        },
                        {
                            label: 'Jalur',
                            value: `${ppdb?.trackQuotas.length ?? 0}`,
                        },
                        {
                            label: 'Zona',
                            value: `${numberFormatter.format(ppdb?.zoneRadiusKm ?? 5)} km`,
                        },
                        {
                            label: 'Form',
                            value: submissionResult ? 'Terkirim' : 'Siap',
                        },
                        {
                            label: 'Validasi',
                            value: preview ? 'Aktif' : 'Belum',
                        },
                    ]}
                />

                {/* ═══════════ TIMELINE JADWAL ═══════════ */}
                <section id="timeline" className="scroll-mt-24 space-y-10">
                    <SectionHeading
                        eyebrow="Jadwal PPDB"
                        title="Tanggal penting penerimaan siswa baru."
                        description="Perhatikan jadwal buka pendaftaran, tutup pendaftaran, dan pengumuman hasil."
                    />

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={motionViewport}
                        className="grid gap-5 md:grid-cols-3"
                    >
                        {ppdbTimeline.map((item, i) => (
                            <motion.div
                                key={item.label}
                                variants={fadeUp}
                                whileHover={{ y: -6 }}
                            >
                                <BorderGlow
                                    borderRadius={28}
                                    colors={[item.accent, '#6366F1', '#0EA5E9']}
                                    className="relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/88 shadow-[0_24px_50px_-20px_rgba(15,118,110,0.15)] transition-all hover:shadow-[0_28px_80px_-20px_rgba(15,118,110,0.3)]"
                                >
                                    <div
                                        className="pointer-events-none absolute inset-0"
                                        style={{
                                            background: `radial-gradient(circle at top left, ${item.accent}08, transparent 60%)`,
                                        }}
                                    />
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
                                            <div className="text-[0.6rem] font-bold tracking-[0.25em] text-slate-500 uppercase">
                                                Tahap{' '}
                                                {String(i + 1).padStart(2, '0')}
                                            </div>
                                        </div>
                                        <h3 className="mt-5 font-heading text-xl text-(--school-ink)">
                                            {item.label}
                                        </h3>
                                        <div className="mt-3 font-heading text-2xl text-(--school-ink)">
                                            {item.value}
                                        </div>
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
                                    track:
                                        q.trackType.charAt(0).toUpperCase() +
                                        q.trackType.slice(1),
                                    percentage: q.quotaPercentage,
                                    seats: q.quotaSeats,
                                }))}
                                totalCapacity={ppdb.capacity}
                            />
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={motionViewport}
                                className="flex flex-col justify-center rounded-4xl border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_-30px_rgba(15,118,110,0.15)] backdrop-blur-xl md:p-8"
                            >
                                <div className="space-y-5">
                                    <h3 className="font-heading text-lg font-semibold text-(--school-ink)">
                                        Ringkasan Kapasitas
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {ppdb.trackQuotas.map((q) => (
                                            <div
                                                key={q.trackType}
                                                className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4"
                                            >
                                                <div className="text-2xl font-bold text-(--school-ink)">
                                                    {q.quotaSeats}
                                                </div>
                                                <div className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                                    {q.trackType}
                                                </div>
                                                <div className="text-xs text-(--school-muted)">
                                                    {q.quotaPercentage}%
                                                    kapasitas
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="rounded-2xl border border-emerald-100 bg-linear-to-br from-emerald-50 to-teal-50 p-4">
                                        <div className="text-3xl font-bold text-emerald-700">
                                            {ppdb.capacity}
                                        </div>
                                        <div className="text-xs font-semibold tracking-wider text-emerald-600 uppercase">
                                            Total Kapasitas
                                        </div>
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
                        title="Alokasi kursi per jalur penerimaan."
                        description="Pilih jalur untuk melihat jumlah kursi dan persentase kuota."
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
                            const config =
                                trackConfig[quota.trackType] ??
                                trackConfig.zonasi;
                            const TrackIcon = config.icon;

                            return (
                                <motion.button
                                    key={quota.trackType}
                                    variants={fadeUp}
                                    whileHover={{ y: -6, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    onClick={() =>
                                        setTrackType(quota.trackType)
                                    }
                                    className="text-left"
                                >
                                    <BorderGlow
                                        borderRadius={28}
                                        colors={
                                            active
                                                ? [
                                                      config.accent,
                                                      '#10B981',
                                                      config.accent,
                                                  ]
                                                : ['#CBD5E1', '#E2E8F0']
                                        }
                                        className={`relative overflow-hidden rounded-[1.75rem] border transition-all duration-300 ${
                                            active
                                                ? 'border-white/90 bg-white shadow-[0_28px_80px_-40px_rgba(15,118,110,0.35)]'
                                                : 'border-white/50 bg-white/50 shadow-sm hover:border-white/80 hover:bg-white/80 hover:shadow-[0_24px_50px_-20px_rgba(15,118,110,0.15)]'
                                        }`}
                                    >
                                        {active && (
                                            <div
                                                className="pointer-events-none absolute inset-0"
                                                style={{
                                                    background: `radial-gradient(circle at top right, ${config.accent}08, transparent 60%)`,
                                                }}
                                            />
                                        )}
                                        <div className="relative z-10 p-6">
                                            <div
                                                className="flex size-12 items-center justify-center rounded-xl border shadow-sm backdrop-blur-md transition-all"
                                                style={{
                                                    backgroundColor: active
                                                        ? 'white'
                                                        : 'rgba(255,255,255,0.7)',
                                                    borderColor: active
                                                        ? `${config.accent}40`
                                                        : 'rgba(0,0,0,0.05)',
                                                    color: active
                                                        ? config.accent
                                                        : '#64748B',
                                                }}
                                            >
                                                <TrackIcon className="size-5" />
                                            </div>
                                            <div
                                                className="mt-4 text-[0.68rem] font-bold tracking-[0.24em] uppercase"
                                                style={{
                                                    color: active
                                                        ? config.accent
                                                        : '#64748B',
                                                }}
                                            >
                                                {quota.trackType}
                                            </div>
                                            <div className="mt-2 font-heading text-3xl text-(--school-ink)">
                                                <AnimatedCounter
                                                    value={quota.quotaSeats}
                                                />
                                            </div>
                                            <div className="mt-1 text-xs text-slate-500">
                                                {numberFormatter.format(
                                                    quota.quotaPercentage,
                                                )}
                                                % dari kapasitas
                                            </div>
                                            {active && (
                                                <motion.div
                                                    initial={{
                                                        opacity: 0,
                                                        height: 0,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        height: 'auto',
                                                    }}
                                                    className="mt-4 rounded-xl border border-emerald-50 bg-[rgba(240,253,244,0.6)] px-3 py-2.5"
                                                >
                                                    <p className="text-[0.72rem] leading-relaxed text-(--school-muted)">
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
                        description="Klik peta, masukkan alamat, atau gunakan GPS untuk menghitung jarak domisili ke sekolah."
                    />

                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={motionViewport}
                    >
                        <BorderGlow
                            borderRadius={32}
                            colors={[
                                zonasiVisualizationAccent,
                                '#0EA5E9',
                                '#8B5CF6',
                            ]}
                            className="relative overflow-hidden rounded-4xl border border-white/70 bg-white/88 shadow-[0_28px_80px_-40px_rgba(15,23,42,0.22)] backdrop-blur-xl"
                        >
                            <div
                                className="pointer-events-none absolute inset-0"
                                style={{
                                    background: `radial-gradient(circle at top left, ${zonasiVisualizationAccent}12, transparent 32%), radial-gradient(circle at bottom right, rgba(14,165,233,0.1), transparent 28%)`,
                                }}
                            />

                            <div className="relative z-10 grid gap-8 p-6 md:p-8 xl:grid-cols-[minmax(0,0.8fr)_minmax(320px,1fr)] xl:items-center">
                                <div className="space-y-6">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <div
                                            className="flex size-11 items-center justify-center rounded-2xl border bg-white shadow-sm"
                                            style={{
                                                borderColor: `${zonasiVisualizationAccent}35`,
                                                color: zonasiVisualizationAccent,
                                            }}
                                        >
                                            <Sparkles className="size-5" />
                                        </div>
                                        <div className="space-y-1">
                                            <div
                                                className="text-[0.68rem] font-bold tracking-[0.24em] uppercase"
                                                style={{
                                                    color: zonasiVisualizationAccent,
                                                }}
                                            >
                                                Matrix Zonasi
                                            </div>
                                            <div className="font-heading text-2xl text-(--school-ink) md:text-3xl">
                                                Baca sebaran radius sebelum
                                                kirim formulir.
                                            </div>
                                        </div>
                                    </div>

                                    <p className="max-w-2xl text-sm leading-relaxed text-(--school-muted) md:text-base">
                                        Pusat sekolah tetap menjadi acuan
                                        pembacaan radius. Gunakan jalur aktif,
                                        status simulasi, dan titik rumah untuk
                                        menilai peluang awal sebelum melanjutkan
                                        pengiriman data.
                                    </p>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {zonasiMatrixCards.map((item) => {
                                            const ItemIcon = item.icon;

                                            return (
                                                <div
                                                    key={item.label}
                                                    className="rounded-[1.35rem] border border-white/80 bg-white/82 p-4 shadow-sm"
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0">
                                                            <div className="text-[0.62rem] font-bold tracking-[0.2em] text-slate-500 uppercase">
                                                                {item.label}
                                                            </div>
                                                            <div className="mt-2 min-w-0 truncate font-heading text-xl text-(--school-ink) sm:text-2xl">
                                                                {item.value}
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="flex size-10 shrink-0 items-center justify-center rounded-xl border bg-white"
                                                            style={{
                                                                borderColor: `${zonasiVisualizationAccent}25`,
                                                                color: zonasiVisualizationAccent,
                                                            }}
                                                        >
                                                            <ItemIcon className="size-4" />
                                                        </div>
                                                    </div>
                                                    <p className="mt-2 text-xs leading-relaxed text-(--school-muted)">
                                                        {item.helper}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="relative min-h-80 overflow-hidden rounded-[1.7rem] border border-slate-200/80 px-5 py-6 sm:px-6">
                                    <div className="relative z-10 flex h-full flex-col gap-5">
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <div className="space-y-1">
                                                <div className="text-[0.62rem] font-bold tracking-[0.2em] text-slate-500 uppercase">
                                                    Zona Reaktif
                                                </div>
                                                <div className="font-heading text-xl text-(--school-ink) md:text-2xl">
                                                    {preview
                                                        ? preview.insideZone
                                                            ? 'Area Masih Dalam Jangkauan'
                                                            : 'Pertimbangkan Jalur Tambahan'
                                                        : 'Tunggu Titik Rumah Dipilih'}
                                                </div>
                                            </div>
                                            <div
                                                className="rounded-full border px-4 py-2 text-[0.62rem] font-bold tracking-[0.2em] uppercase"
                                                style={{
                                                    borderColor: `${zonasiVisualizationAccent}50`,
                                                    backgroundColor: `${zonasiVisualizationAccent}18`,
                                                    color: zonasiVisualizationAccent,
                                                }}
                                            >
                                                {preview
                                                    ? preview.insideZone
                                                        ? 'Zona Aman'
                                                        : 'Zona Terluar'
                                                    : 'Siap Dibaca'}
                                            </div>
                                        </div>

                                        <div className="flex flex-1 items-center justify-center">
                                            <Cubes
                                                className="mx-auto max-w-[24rem] cursor-pointer"
                                                gridSize={8}
                                                maxAngle={
                                                    preview
                                                        ? preview.insideZone
                                                            ? 50
                                                            : 36
                                                        : 42
                                                }
                                                radius={
                                                    preview
                                                        ? preview.insideZone
                                                            ? 2.6
                                                            : 3.1
                                                        : 2.8
                                                }
                                                cellGap={{ row: 10, col: 10 }}
                                                borderStyle={`1.5px dashed ${zonasiVisualizationCubeBorder}`}
                                                faceColor={
                                                    zonasiVisualizationFaceColor
                                                }
                                                rippleColor={
                                                    zonasiVisualizationRipple
                                                }
                                                rippleSpeed={
                                                    preview
                                                        ? preview.insideZone
                                                            ? 1.8
                                                            : 1.35
                                                        : 1.55
                                                }
                                                shadow={
                                                    zonasiVisualizationShadow
                                                }
                                                autoAnimate={false}
                                                rippleOnClick
                                            />
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {zonasiMatrixChips.map((chip) => (
                                                <span
                                                    key={chip}
                                                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[0.64rem] font-semibold tracking-[0.16em] text-slate-600 uppercase"
                                                >
                                                    {chip}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </BorderGlow>
                    </motion.div>

                    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
                        {/* ── FORM PANEL ── */}
                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="show"
                            viewport={motionViewport}
                        >
                            <form onSubmit={handleSubmit}>
                                <BorderGlow
                                    borderRadius={30}
                                    colors={['#10B981', '#0EA5E9', '#8B5CF6']}
                                    className="relative overflow-hidden rounded-[1.9rem] border border-white/70 bg-white/88 shadow-[0_28px_80px_-50px_rgba(15,118,110,0.45)]"
                                >
                                    <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-emerald-500/2 via-transparent to-violet-500/2" />
                                    <div className="relative z-10 space-y-5 p-7 md:p-8">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-10 items-center justify-center rounded-xl border border-emerald-100 bg-[rgba(236,253,245,0.7)] text-emerald-600 shadow-sm">
                                                <FileText className="size-4" />
                                            </div>
                                            <div>
                                                <h3 className="font-heading text-lg text-(--school-ink)">
                                                    Formulir Pendaftaran
                                                </h3>
                                                <p className="text-[0.65rem] tracking-[0.2em] text-slate-500 uppercase">
                                                    Simulasi & Submit
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            {[
                                                {
                                                    val: fullName,
                                                    set: setFullName,
                                                    ph: 'Nama lengkap calon siswa',
                                                    icon: Users,
                                                },
                                                {
                                                    val: phone,
                                                    set: setPhone,
                                                    ph: 'Nomor telepon',
                                                    icon: Zap,
                                                },
                                                {
                                                    val: email,
                                                    set: setEmail,
                                                    ph: 'Email',
                                                    icon: Sparkles,
                                                    type: 'email',
                                                },
                                                {
                                                    val: previousSchoolName,
                                                    set: setPreviousSchoolName,
                                                    ph: 'Sekolah asal',
                                                    icon: BookOpen,
                                                },
                                            ].map((field) => (
                                                <div
                                                    key={field.ph}
                                                    className="group relative"
                                                >
                                                    <field.icon className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-500" />
                                                    <Input
                                                        value={field.val}
                                                        onChange={(e) =>
                                                            field.set(
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder={field.ph}
                                                        type={
                                                            field.type ?? 'text'
                                                        }
                                                        className="h-12 rounded-xl border-slate-200 bg-white/60 pl-11 text-sm text-(--school-ink) shadow-sm transition-all placeholder:text-slate-400 focus:border-emerald-500/40 focus:ring-emerald-500/20"
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Track Select */}
                                        <div className="group relative">
                                            <Shield className="absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-500" />
                                            <select
                                                value={trackType}
                                                onChange={(event) =>
                                                    setTrackType(
                                                        event.target.value,
                                                    )
                                                }
                                                className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white/60 pr-4 pl-11 text-sm text-(--school-ink) shadow-sm transition-all outline-none focus:border-emerald-500/40"
                                            >
                                                {(ppdb?.trackQuotas ?? []).map(
                                                    (quota) => (
                                                        <option
                                                            key={
                                                                quota.trackType
                                                            }
                                                            value={
                                                                quota.trackType
                                                            }
                                                            className="bg-white"
                                                        >
                                                            Jalur{' '}
                                                            {quota.trackType}
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                        </div>

                                        {/* Address + Geocode */}
                                        <div className="space-y-3">
                                            <div className="group relative">
                                                <MapPin className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-500" />
                                                <Input
                                                    value={addressLine}
                                                    onChange={(e) => {
                                                        setAddressLine(
                                                            e.target.value,
                                                        );
                                                        setGeocodeResults([]);
                                                    }}
                                                    placeholder="Alamat lengkap rumah"
                                                    className="h-12 rounded-xl border-slate-200 bg-white/60 pl-11 text-sm text-(--school-ink) shadow-sm transition-all placeholder:text-slate-400 focus:border-emerald-500/40"
                                                />
                                            </div>

                                            <div className="grid gap-3 md:grid-cols-2">
                                                <Input
                                                    value={latitude}
                                                    onChange={(event) =>
                                                        setLatitude(
                                                            event.target.value,
                                                        )
                                                    }
                                                    placeholder="Latitude"
                                                    className="h-12 rounded-xl border-slate-200 bg-white/60 text-sm text-(--school-ink) shadow-sm transition-all placeholder:text-slate-400 focus:border-emerald-500/40"
                                                />
                                                <Input
                                                    value={longitude}
                                                    onChange={(event) =>
                                                        setLongitude(
                                                            event.target.value,
                                                        )
                                                    }
                                                    placeholder="Longitude"
                                                    className="h-12 rounded-xl border-slate-200 bg-white/60 text-sm text-(--school-ink) shadow-sm transition-all placeholder:text-slate-400 focus:border-emerald-500/40"
                                                />
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-wrap gap-2.5">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="rounded-full border-(--school-green-200) bg-white/80 text-xs text-(--school-green-700) hover:bg-(--school-green-50) hover:text-(--school-green-800)"
                                                onClick={
                                                    handleUseCurrentLocation
                                                }
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
                                                className="rounded-full border-sky-200 bg-white/80 text-xs text-sky-700 hover:bg-sky-50 hover:text-sky-800"
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
                                                className="rounded-full border-amber-200 bg-white/80 text-xs text-amber-700 hover:bg-amber-50 hover:text-amber-800"
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
                                                {geocodeResults.map(
                                                    (result) => (
                                                        <button
                                                            key={`${result.latitude}-${result.longitude}`}
                                                            type="button"
                                                            onClick={() => {
                                                                setAddressLine(
                                                                    result.displayName,
                                                                );
                                                                applyHomePosition(
                                                                    result.latitude,
                                                                    result.longitude,
                                                                );
                                                                setGeocodeResults(
                                                                    [],
                                                                );
                                                            }}
                                                            className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-left transition-all hover:border-emerald-200 hover:bg-emerald-50"
                                                        >
                                                            <div className="text-sm font-medium text-(--school-ink)">
                                                                {
                                                                    result.displayName
                                                                }
                                                            </div>
                                                            <div className="mt-1.5 font-mono text-xs text-emerald-600">
                                                                {result.latitude.toFixed(
                                                                    5,
                                                                )}
                                                                ,{' '}
                                                                {result.longitude.toFixed(
                                                                    5,
                                                                )}
                                                            </div>
                                                        </button>
                                                    ),
                                                )}
                                            </div>
                                        )}

                                        {/* Achievements */}
                                        <textarea
                                            value={achievementsSummary}
                                            onChange={(event) =>
                                                setAchievementsSummary(
                                                    event.target.value,
                                                )
                                            }
                                            rows={3}
                                            placeholder="Ringkasan prestasi (opsional)"
                                            className="w-full resize-none rounded-xl border border-slate-200 bg-white/60 px-4 py-3 text-sm text-(--school-ink) shadow-sm transition-all outline-none placeholder:text-slate-400 focus:border-emerald-500/40"
                                        />

                                        {/* Checkbox Flags */}
                                        <div className="grid gap-3 md:grid-cols-2">
                                            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white/60 px-4 py-3.5 text-sm text-(--school-muted) shadow-sm transition-all hover:bg-white/90">
                                                <input
                                                    type="checkbox"
                                                    checked={ketmFlag}
                                                    onChange={(event) =>
                                                        setKetmFlag(
                                                            event.target
                                                                .checked,
                                                        )
                                                    }
                                                    className="size-4 rounded border-slate-300 accent-[#0F766E]"
                                                />
                                                Afirmasi KETM
                                            </label>
                                            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white/60 px-4 py-3.5 text-sm text-(--school-muted) shadow-sm transition-all hover:bg-white/90">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        specialConditionFlag
                                                    }
                                                    onChange={(event) =>
                                                        setSpecialConditionFlag(
                                                            event.target
                                                                .checked,
                                                        )
                                                    }
                                                    className="size-4 rounded border-slate-300 accent-[#0F766E]"
                                                />
                                                Kondisi Khusus
                                            </label>
                                        </div>

                                        {/* Zone Status Preview */}
                                        <div className="rounded-2xl border border-emerald-100 bg-[rgba(240,253,244,0.6)] p-5 backdrop-blur-sm">
                                            <div className="flex items-center justify-between gap-4">
                                                <div>
                                                    <div className="text-[0.65rem] font-bold tracking-[0.2em] text-(--school-green-700) uppercase">
                                                        Status Zona
                                                    </div>
                                                    <div className="mt-2 font-heading text-2xl text-(--school-ink)">
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
                                                            <span className="text-slate-400">
                                                                Menunggu
                                                                koordinat
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                {preview && (
                                                    <div className="text-right">
                                                        <div className="font-heading text-3xl text-(--school-ink)">
                                                            {numberFormatter.format(
                                                                preview.distanceKm,
                                                            )}
                                                        </div>
                                                        <div className="text-[0.6rem] font-bold tracking-[0.2em] text-slate-500 uppercase">
                                                            Kilometer
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Error / Success Messages */}
                                        {errorMessage && (
                                            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                                                {errorMessage}
                                            </div>
                                        )}

                                        {submissionResult && (
                                            <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                                                <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                                                <div>
                                                    Formulir terkirim. Nomor
                                                    pendaftaran:{' '}
                                                    <strong className="text-emerald-900">
                                                        {
                                                            submissionResult.registrationNumber
                                                        }
                                                    </strong>
                                                </div>
                                            </div>
                                        )}

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="relative w-full overflow-hidden rounded-2xl border border-(--school-green-600) bg-(--school-green-700) px-8 py-4 font-heading text-base text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-(--school-green-600) hover:shadow-xl hover:shadow-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 hover:translate-x-full" />
                                            {isSubmitting ? (
                                                <span className="relative flex items-center justify-center gap-2">
                                                    <LoaderCircle className="size-5 animate-spin" />
                                                    Mengirim pendaftaran...
                                                </span>
                                            ) : (
                                                <span className="relative">
                                                    Kirim Simulasi PPDB
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </BorderGlow>
                            </form>
                        </motion.div>

                        {/* ── MAP PANEL ── */}
                        <div className="space-y-5">
                            <motion.div
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="show"
                                viewport={motionViewport}
                            >
                                <BorderGlow
                                    borderRadius={30}
                                    colors={['#0EA5E9', '#10B981', '#8B5CF6']}
                                    className="overflow-hidden rounded-[1.9rem] border border-white/70 bg-white/88 shadow-[0_28px_80px_-50px_rgba(15,118,110,0.45)]"
                                >
                                    <div className="p-3">
                                        <Suspense
                                            fallback={
                                                <div className="flex h-120 items-center justify-center rounded-[1.6rem] border border-slate-100 bg-slate-50 text-slate-400">
                                                    <LoaderCircle className="size-8 animate-spin" />
                                                </div>
                                            }
                                        >
                                            <PpdbDistanceMap
                                                schoolPosition={schoolPosition}
                                                homePosition={
                                                    preview?.homePosition ??
                                                    null
                                                }
                                                zoneRadiusKm={
                                                    ppdb?.zoneRadiusKm ?? 5
                                                }
                                                onSelectPosition={(
                                                    position,
                                                ) => {
                                                    applyHomePosition(
                                                        position[0],
                                                        position[1],
                                                    );
                                                }}
                                            />
                                        </Suspense>
                                    </div>

                                    {/* Map Stats Row */}
                                    <div className="grid grid-cols-3 border-t border-slate-100">
                                        {[
                                            {
                                                label: 'Sekolah',
                                                value: `${schoolLatitude.toFixed(4)}, ${schoolLongitude.toFixed(4)}`,
                                            },
                                            {
                                                label: 'Rumah',
                                                value: preview
                                                    ? `${preview.homePosition[0].toFixed(4)}, ${preview.homePosition[1].toFixed(4)}`
                                                    : 'Klik peta',
                                            },
                                            {
                                                label: 'Radius',
                                                value: `${numberFormatter.format(ppdb?.zoneRadiusKm ?? 5)} km`,
                                            },
                                        ].map((stat) => (
                                            <div
                                                key={stat.label}
                                                className="border-r border-slate-100 bg-white/50 p-4 text-center last:border-r-0"
                                            >
                                                <div className="text-[0.55rem] font-bold tracking-[0.25em] text-(--school-green-700) uppercase">
                                                    {stat.label}
                                                </div>
                                                <div className="mt-1.5 truncate font-mono text-xs text-slate-600">
                                                    {stat.value}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </BorderGlow>
                            </motion.div>

                            {/* Simulation Result Card */}
                            <motion.div
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="show"
                                viewport={motionViewport}
                            >
                                <BorderGlow
                                    borderRadius={28}
                                    colors={
                                        preview?.insideZone
                                            ? ['#10B981', '#34D399', '#059669']
                                            : ['#F59E0B', '#FBBF24', '#D97706']
                                    }
                                    className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/88 shadow-[0_28px_80px_-50px_rgba(15,118,110,0.45)]"
                                >
                                    <div className="p-7">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="text-[0.65rem] font-bold tracking-[0.2em] text-(--school-green-700) uppercase">
                                                    Panel Hasil Simulasi
                                                </div>
                                                <div className="mt-3 font-heading text-4xl text-(--school-ink)">
                                                    {preview
                                                        ? `${numberFormatter.format(preview.distanceKm)} km`
                                                        : 'Belum ada data'}
                                                </div>
                                            </div>
                                            <div
                                                className={`rounded-full border px-5 py-2.5 text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-md ${
                                                    preview?.insideZone
                                                        ? 'border-emerald-200 bg-[rgba(220,252,231,0.68)] text-(--school-green-800)'
                                                        : 'border-amber-200 bg-[rgba(255,251,235,0.94)] text-(--school-gold-700)'
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
                                                <div className="text-[0.6rem] font-bold tracking-[0.2em] text-slate-500 uppercase">
                                                    Jalur Aktif
                                                </div>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <currentTrackConfig.icon
                                                        className="size-4"
                                                        style={{
                                                            color: currentTrackConfig.accent,
                                                        }}
                                                    />
                                                    <span className="font-heading text-lg text-(--school-ink) capitalize">
                                                        {trackType}
                                                    </span>
                                                </div>
                                                <p className="mt-1.5 text-xs text-(--school-muted)">
                                                    {selectedQuota
                                                        ? `${numberFormatter.format(selectedQuota.quotaSeats)} kursi • ${numberFormatter.format(selectedQuota.quotaPercentage)}%`
                                                        : 'Mengikuti konfigurasi panitia.'}
                                                </p>
                                            </div>
                                            <div className="rounded-xl border border-slate-200 bg-white/60 p-4 shadow-sm">
                                                <div className="text-[0.6rem] font-bold tracking-[0.2em] text-slate-500 uppercase">
                                                    Langkah Berikutnya
                                                </div>
                                                <div className="mt-2 font-heading text-lg text-(--school-ink)">
                                                    {submissionResult
                                                        ? submissionResult.registrationNumber
                                                        : 'Lengkapi formulir'}
                                                </div>
                                                <p className="mt-1.5 text-xs text-(--school-muted)">
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
                        description="Jawaban singkat untuk pertanyaan umum calon siswa dan orang tua."
                    />

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={motionViewport}
                        className="grid gap-4 md:grid-cols-1 lg:max-w-3xl"
                    >
                        {ppdbFaqs.map((faq, i) => (
                            <FaqItem
                                key={faq.question}
                                question={faq.question}
                                answer={faq.answer}
                                index={i}
                            />
                        ))}
                    </motion.div>
                </section>
            </div>
        </>
    );
}
