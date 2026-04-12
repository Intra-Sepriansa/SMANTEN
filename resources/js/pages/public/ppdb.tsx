import { Head } from '@inertiajs/react';
import { lazy, startTransition, Suspense, useDeferredValue, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Crosshair, LoaderCircle, MapPin, RotateCcw } from 'lucide-react';
import { PageIntro } from '@/components/public/page-intro';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fadeUp, motionViewport } from '@/lib/motion';
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

const numberFormatter = new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
});

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
    const [submissionResult, setSubmissionResult] =
        useState<SubmissionResult | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [geocodeResults, setGeocodeResults] = useState<GeocodeCandidate[]>([]);

    const deferredLatitude = useDeferredValue(latitude);
    const deferredLongitude = useDeferredValue(longitude);

    const schoolLatitude = ppdb?.schoolLatitude ?? school.location.latitude;
    const schoolLongitude = ppdb?.schoolLongitude ?? school.location.longitude;
    const schoolPosition: [number, number] = [schoolLatitude, schoolLongitude];
    const selectedQuota =
        ppdb?.trackQuotas.find((quota) => quota.trackType === trackType) ?? null;
    const ppdbTimeline = [
        {
            label: 'Buka Pendaftaran',
            value: ppdb?.applicationOpensAt
                ? dateFormatter.format(new Date(ppdb.applicationOpensAt))
                : 'Segera diumumkan',
        },
        {
            label: 'Tutup Pendaftaran',
            value: ppdb?.applicationClosesAt
                ? dateFormatter.format(new Date(ppdb.applicationClosesAt))
                : 'Menunggu jadwal resmi',
        },
        {
            label: 'Pengumuman',
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
                {
                    headers: {
                        Accept: 'application/json',
                    },
                },
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

    return (
        <>
            <Head title="PPDB" />

            <div className="space-y-8">
                <PageIntro
                    eyebrow="PPDB Zonasi"
                    title="Halaman penerimaan dibuat sebagai pengalaman peta, bukan form kaku."
                    description="Calon peserta bisa mengisi titik koordinat rumah, membaca simulasi jarak ke sekolah, dan memperoleh indikasi zona sebelum mengirim pendaftaran."
                    stats={
                        ppdb
                            ? [
                                  {
                                      label: 'Siklus',
                                      value: ppdb.name,
                                  },
                                  {
                                      label: 'Radius Zona',
                                      value: `${numberFormatter.format(ppdb.zoneRadiusKm)} km`,
                                  },
                                  {
                                      label: 'Kapasitas',
                                      value: `${numberFormatter.format(ppdb.capacity)} kursi`,
                                  },
                              ]
                            : []
                    }
                />

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={motionViewport}
                    className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]"
                >
                    <div className="rounded-[1.9rem] border border-white/70 bg-white/88 p-6 shadow-[0_24px_70px_-46px_rgba(15,118,110,0.42)]">
                        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--school-green-700)]">
                            Kuota Jalur
                        </div>
                        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            {(ppdb?.trackQuotas ?? []).map((quota) => {
                                const active = quota.trackType === trackType;

                                return (
                                    <button
                                        key={quota.trackType}
                                        type="button"
                                        onClick={() => setTrackType(quota.trackType)}
                                        className={`rounded-[1.5rem] border p-4 text-left transition ${
                                            active
                                                ? 'border-[var(--school-green-200)] bg-[rgba(220,252,231,0.46)] shadow-[0_16px_40px_-28px_rgba(15,118,110,0.48)]'
                                                : 'border-white/70 bg-white/86 hover:-translate-y-0.5'
                                        }`}
                                    >
                                        <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--school-green-700)]">
                                            {quota.trackType}
                                        </div>
                                        <div className="mt-3 text-2xl font-semibold text-[var(--school-ink)]">
                                            {numberFormatter.format(quota.quotaSeats)}
                                        </div>
                                        <div className="mt-1 text-sm text-[var(--school-muted)]">
                                            {numberFormatter.format(quota.quotaPercentage)}% dari total kursi
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="rounded-[1.9rem] border border-white/70 bg-white/88 p-6 shadow-[0_24px_70px_-46px_rgba(15,118,110,0.42)]">
                        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--school-green-700)]">
                            Ritme PPDB
                        </div>
                        <div className="mt-5 space-y-4">
                            {ppdbTimeline.map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-[1.35rem] border border-[var(--school-green-100)] bg-[rgba(248,252,251,0.82)] p-4"
                                >
                                    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--school-muted)]">
                                        {item.label}
                                    </div>
                                    <div className="mt-2 text-base font-semibold text-[var(--school-ink)]">
                                        {item.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5 rounded-[2rem] border border-white/70 bg-white/88 p-7 shadow-[0_28px_80px_-50px_rgba(15,118,110,0.45)]"
                    >
                        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--school-green-700)]">
                            Simulasi dan Submit
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <Input
                                value={fullName}
                                onChange={(event) => setFullName(event.target.value)}
                                placeholder="Nama lengkap calon siswa"
                            />
                            <select
                                value={trackType}
                                onChange={(event) => setTrackType(event.target.value)}
                                className="h-11 rounded-xl border border-input bg-background px-4 text-sm shadow-xs outline-none"
                            >
                                {(ppdb?.trackQuotas ?? []).map((quota) => (
                                    <option key={quota.trackType} value={quota.trackType}>
                                        {quota.trackType}
                                    </option>
                                ))}
                            </select>
                            <Input
                                value={phone}
                                onChange={(event) => setPhone(event.target.value)}
                                placeholder="Nomor telepon"
                            />
                            <Input
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="Email"
                                type="email"
                            />
                            <Input
                                value={previousSchoolName}
                                onChange={(event) =>
                                    setPreviousSchoolName(event.target.value)
                                }
                                placeholder="Sekolah asal"
                            />
                            <Input
                                value={addressLine}
                                onChange={(event) => {
                                    setAddressLine(event.target.value);
                                    setGeocodeResults([]);
                                }}
                                placeholder="Alamat ringkas"
                            />
                            <Input
                                value={latitude}
                                onChange={(event) => setLatitude(event.target.value)}
                                placeholder="Latitude rumah"
                            />
                            <Input
                                value={longitude}
                                onChange={(event) => setLongitude(event.target.value)}
                                placeholder="Longitude rumah"
                            />
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="rounded-full border-[var(--school-green-200)] bg-white/80"
                                onClick={handleUseCurrentLocation}
                                disabled={isLocating}
                            >
                                {isLocating ? (
                                    <>
                                        <LoaderCircle className="size-4 animate-spin" />
                                        Membaca lokasi
                                    </>
                                ) : (
                                    <>
                                        <Crosshair className="size-4" />
                                        Gunakan lokasi saya
                                    </>
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="rounded-full border-[var(--school-green-200)] bg-[rgba(248,252,251,0.82)]"
                                onClick={handleGeocodeAddress}
                                disabled={isGeocoding}
                            >
                                {isGeocoding ? (
                                    <>
                                        <LoaderCircle className="size-4 animate-spin" />
                                        Mencari alamat
                                    </>
                                ) : (
                                    'Terjemahkan alamat'
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="rounded-full border-[rgba(245,158,11,0.28)] bg-[rgba(255,251,235,0.88)]"
                                onClick={() => {
                                    setLatitude('');
                                    setLongitude('');
                                    setPreview(null);
                                    setGeocodeResults([]);
                                }}
                            >
                                <RotateCcw className="size-4" />
                                Reset titik
                            </Button>
                        </div>

                        {geocodeResults.length > 0 ? (
                            <div className="grid gap-3">
                                {geocodeResults.map((result) => (
                                    <button
                                        key={`${result.latitude}-${result.longitude}`}
                                        type="button"
                                        onClick={() => {
                                            setAddressLine(result.displayName);
                                            applyHomePosition(
                                                result.latitude,
                                                result.longitude,
                                            );
                                            setGeocodeResults([]);
                                        }}
                                        className="rounded-[1.35rem] border border-[var(--school-green-100)] bg-[rgba(248,252,251,0.82)] p-4 text-left transition hover:-translate-y-0.5"
                                    >
                                        <div className="text-sm font-semibold text-[var(--school-ink)]">
                                            {result.displayName}
                                        </div>
                                        <div className="mt-2 text-xs uppercase tracking-[0.24em] text-[var(--school-green-700)]">
                                            {result.latitude.toFixed(5)}, {result.longitude.toFixed(5)}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : null}

                        <textarea
                            value={achievementsSummary}
                            onChange={(event) =>
                                setAchievementsSummary(event.target.value)
                            }
                            rows={4}
                            placeholder="Ringkasan prestasi bila ada"
                            className="w-full rounded-[1.4rem] border border-input bg-background px-4 py-3 text-sm shadow-xs outline-none"
                        />

                        <div className="grid gap-3 md:grid-cols-2">
                            <label className="flex items-center gap-3 rounded-[1.4rem] border border-[var(--school-green-100)] bg-[rgba(248,252,251,0.82)] px-4 py-3 text-sm text-[var(--school-muted)]">
                                <input
                                    type="checkbox"
                                    checked={ketmFlag}
                                    onChange={(event) => setKetmFlag(event.target.checked)}
                                />
                                Afirmasi KETM
                            </label>
                            <label className="flex items-center gap-3 rounded-[1.4rem] border border-[var(--school-green-100)] bg-[rgba(248,252,251,0.82)] px-4 py-3 text-sm text-[var(--school-muted)]">
                                <input
                                    type="checkbox"
                                    checked={specialConditionFlag}
                                    onChange={(event) =>
                                        setSpecialConditionFlag(event.target.checked)
                                    }
                                />
                                Kondisi khusus
                            </label>
                        </div>

                        <div className="rounded-[1.5rem] border border-[var(--school-green-100)] bg-[rgba(248,252,251,0.82)] p-5">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <div className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--school-green-700)]">
                                        Status Zona
                                    </div>
                                    <div className="mt-2 text-2xl font-semibold text-[var(--school-ink)]">
                                        {preview ? (
                                            preview.insideZone ? (
                                                <span className="inline-flex items-center gap-2 text-[var(--school-green-700)]">
                                                    <CheckCircle2 className="size-5" />
                                                    Masuk Zona
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-2 text-[var(--school-gold-700)]">
                                                    <AlertCircle className="size-5" />
                                                    Luar Zona
                                                </span>
                                            )
                                        ) : (
                                            'Menunggu koordinat'
                                        )}
                                    </div>
                                </div>
                                <div className="text-right text-sm leading-7 text-[var(--school-muted)]">
                                    {preview
                                        ? `${numberFormatter.format(preview.distanceKm)} km dari sekolah`
                                        : 'Masukkan koordinat untuk melihat garis jarak'}
                                </div>
                            </div>
                        </div>

                        {errorMessage ? (
                            <div className="rounded-[1.4rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {errorMessage}
                            </div>
                        ) : null}

                        {submissionResult ? (
                            <div className="rounded-[1.4rem] border border-[var(--school-green-200)] bg-[rgba(220,252,231,0.56)] px-4 py-3 text-sm text-[var(--school-green-800)]">
                                Formulir terkirim. Nomor pendaftaran:{' '}
                                <strong>{submissionResult.registrationNumber}</strong>
                            </div>
                        ) : null}

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-full bg-[var(--school-green-700)] text-white hover:bg-[var(--school-green-600)]"
                        >
                            {isSubmitting ? (
                                <>
                                    <LoaderCircle className="size-4 animate-spin" />
                                    Mengirim pendaftaran
                                </>
                            ) : (
                                'Kirim Simulasi PPDB'
                            )}
                        </Button>
                    </form>

                    <div className="space-y-5">
                        <div className="rounded-[2rem] border border-white/70 bg-white/88 p-4 shadow-[0_28px_80px_-50px_rgba(15,118,110,0.45)]">
                            <Suspense
                                fallback={
                                    <div className="flex h-[420px] items-center justify-center rounded-[1.8rem] bg-[linear-gradient(135deg,rgba(4,47,46,0.92),rgba(15,118,110,0.84),rgba(245,158,11,0.7))] text-white">
                                        Memuat peta interaktif...
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

                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="show"
                            viewport={motionViewport}
                            className="grid gap-4 md:grid-cols-3"
                        >
                            <div className="rounded-[1.6rem] border border-white/70 bg-white/88 p-5 shadow-[0_20px_60px_-44px_rgba(15,118,110,0.42)]">
                                <div className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--school-green-700)]">
                                    Koordinat Sekolah
                                </div>
                                <div className="mt-3 text-sm leading-7 text-[var(--school-muted)]">
                                    {schoolLatitude.toFixed(4)}, {schoolLongitude.toFixed(4)}
                                </div>
                            </div>
                            <div className="rounded-[1.6rem] border border-white/70 bg-white/88 p-5 shadow-[0_20px_60px_-44px_rgba(15,118,110,0.42)]">
                                <div className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--school-green-700)]">
                                    Titik Rumah
                                </div>
                                <div className="mt-3 text-sm leading-7 text-[var(--school-muted)]">
                                    {preview
                                        ? `${preview.homePosition[0].toFixed(4)}, ${preview.homePosition[1].toFixed(4)}`
                                        : 'Klik peta atau gunakan lokasi saya'}
                                </div>
                            </div>
                            <div className="rounded-[1.6rem] border border-white/70 bg-white/88 p-5 shadow-[0_20px_60px_-44px_rgba(15,118,110,0.42)]">
                                <div className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--school-green-700)]">
                                    Simulasi
                                </div>
                                <div className="mt-3 text-sm leading-7 text-[var(--school-muted)]">
                                    Radius aktif {numberFormatter.format(ppdb?.zoneRadiusKm ?? 5)} km.
                                    Status visual akan berubah otomatis setelah titik rumah valid.
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="show"
                            viewport={motionViewport}
                            className="rounded-[1.85rem] border border-white/70 bg-white/88 p-6 shadow-[0_22px_60px_-44px_rgba(15,118,110,0.42)]"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <div className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--school-green-700)]">
                                        Panel Hasil Simulasi
                                    </div>
                                    <div className="mt-3 text-2xl font-semibold text-[var(--school-ink)]">
                                        {preview
                                            ? `${numberFormatter.format(preview.distanceKm)} km`
                                            : 'Belum ada titik rumah'}
                                    </div>
                                </div>
                                <div
                                    className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] ${
                                        preview?.insideZone
                                            ? 'bg-[rgba(220,252,231,0.68)] text-[var(--school-green-800)]'
                                            : 'bg-[rgba(255,251,235,0.94)] text-[var(--school-gold-700)]'
                                    }`}
                                >
                                    {preview
                                        ? preview.insideZone
                                            ? 'Masuk Zona'
                                            : 'Luar Zona'
                                        : 'Menunggu Titik'}
                                </div>
                            </div>

                            <div className="mt-5 grid gap-4 md:grid-cols-2">
                                <div className="rounded-[1.35rem] border border-[var(--school-green-100)] bg-[rgba(248,252,251,0.82)] p-4">
                                    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--school-muted)]">
                                        Jalur aktif
                                    </div>
                                    <div className="mt-2 text-lg font-semibold text-[var(--school-ink)]">
                                        {trackType}
                                    </div>
                                    <p className="mt-2 text-sm leading-7 text-[var(--school-muted)]">
                                        {selectedQuota
                                            ? `${numberFormatter.format(selectedQuota.quotaSeats)} kursi • ${numberFormatter.format(selectedQuota.quotaPercentage)}%`
                                            : 'Kuota jalur akan mengikuti konfigurasi panitia.'}
                                    </p>
                                </div>
                                <div className="rounded-[1.35rem] border border-[var(--school-green-100)] bg-[rgba(248,252,251,0.82)] p-4">
                                    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--school-muted)]">
                                        Tindakan berikutnya
                                    </div>
                                    <div className="mt-2 text-lg font-semibold text-[var(--school-ink)]">
                                        {submissionResult
                                            ? submissionResult.registrationNumber
                                            : 'Lengkapi koordinat dan kirim formulir'}
                                    </div>
                                    <p className="mt-2 text-sm leading-7 text-[var(--school-muted)]">
                                        {submissionResult
                                            ? 'Simpan nomor pendaftaran untuk proses verifikasi berikutnya.'
                                            : 'Setelah titik rumah valid, sistem menyiapkan payload zonasi ke endpoint PPDB.'}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <div className="grid gap-4 md:grid-cols-3">
                            {ppdbFaqs.map((faq) => (
                                <article
                                    key={faq.question}
                                    className="rounded-[1.6rem] border border-white/70 bg-white/88 p-5 shadow-[0_20px_60px_-44px_rgba(15,118,110,0.42)]"
                                >
                                    <div className="inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--school-green-700)]">
                                        <MapPin className="size-4" />
                                        FAQ
                                    </div>
                                    <h2 className="mt-4 text-lg font-semibold text-[var(--school-ink)]">
                                        {faq.question}
                                    </h2>
                                    <p className="mt-3 text-sm leading-7 text-[var(--school-muted)]">
                                        {faq.answer}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
