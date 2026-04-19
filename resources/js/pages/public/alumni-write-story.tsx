import { Head, Link } from '@inertiajs/react';
import {
    AnimatePresence,
    motion,
    useScroll,
    useTransform,
} from 'framer-motion';
import {
    ArrowLeft,
    BookOpen,
    Briefcase,
    Building2,
    Check,
    Compass,
    GraduationCap,
    Lightbulb,
    Mail,
    MapPin,
    PenLine,
    Send,
    Star,
    User,
    X,
} from 'lucide-react';
import {
    startTransition,
    useCallback,
    useDeferredValue,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import type { FormEvent } from 'react';
import { AlumniLocationPicker } from '@/components/public/alumni-location-picker';
import { BorderGlow } from '@/components/public/border-glow';
import { Button } from '@/components/ui/button';
import {
    ensureAlumniForumVisitorToken,
    initialAlumniStoryForm,
    persistAlumniForumVisitorToken,
} from '@/lib/alumni-story-form';
import type {
    AlumniStoryCategory,
    AlumniStoryFormData,
} from '@/lib/alumni-story-form';
import { motionViewport } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { alumni } from '@/routes';
import { store as storeAlumniForum } from '@/routes/api/public/alumni-forum';
import {
    reverse as reverseGeocode,
    search as searchGeocode,
} from '@/routes/api/public/geocode';
import type { GeocodeCandidate, SchoolProfilePayload } from '@/types';

type AlumniWriteStoryPageProps = {
    school: SchoolProfilePayload;
};

type SubmitResult = {
    success: boolean;
    message: string;
    detailUrl?: string | null;
    moderationStatus?: string | null;
};

const categoryCards: Array<{
    value: AlumniStoryCategory;
    label: string;
    shortLabel: string;
    description: string;
    accent: string;
    icon: typeof BookOpen;
}> = [
    {
        value: 'cerita',
        label: 'Cerita Alumni',
        shortLabel: 'Cerita',
        description:
            'Perjalanan personal, titik balik, dan refleksi setelah lulus.',
        accent: 'border-emerald-200 bg-emerald-50/80 text-emerald-700 shadow-[0_20px_50px_-32px_rgba(16,185,129,0.7)]',
        icon: BookOpen,
    },
    {
        value: 'karir',
        label: 'Karir & Profesi',
        shortLabel: 'Karir',
        description: 'Cerita kerja, magang, freelance, atau membangun usaha.',
        accent: 'border-sky-200 bg-sky-50/80 text-sky-700 shadow-[0_20px_50px_-32px_rgba(14,165,233,0.65)]',
        icon: Briefcase,
    },
    {
        value: 'kampus',
        label: 'Jejak Kampus',
        shortLabel: 'Kampus',
        description:
            'Adaptasi kuliah, organisasi, beasiswa, dan kehidupan setelah lulus.',
        accent: 'border-violet-200 bg-violet-50/80 text-violet-700 shadow-[0_20px_50px_-32px_rgba(139,92,246,0.7)]',
        icon: GraduationCap,
    },
    {
        value: 'inspirasi',
        label: 'Inspirasi',
        shortLabel: 'Inspirasi',
        description:
            'Pesan kuat, pelajaran penting, atau motivasi untuk adik kelas.',
        accent: 'border-amber-200 bg-amber-50/80 text-amber-700 shadow-[0_20px_50px_-32px_rgba(245,158,11,0.7)]',
        icon: Star,
    },
];

const storyBlueprints: Array<{
    title: string;
    description: string;
    category: AlumniStoryCategory;
    headline: string;
    starter: string;
}> = [
    {
        title: 'Momen Titik Balik',
        description:
            'Cocok untuk cerita tentang keputusan penting setelah lulus.',
        category: 'cerita',
        headline: 'Keputusan kecil yang mengubah arah saya setelah lulus',
        starter:
            'Awalnya saya mengira jalan saya akan lurus-lurus saja setelah lulus. Ternyata ada satu momen yang memaksa saya memilih ulang arah, dan dari situlah banyak hal mulai berubah...',
    },
    {
        title: 'Jejak Karir Nyata',
        description:
            'Bagikan proses masuk kerja, gagal wawancara, lalu menemukan ritme yang pas.',
        category: 'karir',
        headline: 'Dari bingung cari kerja sampai menemukan ritme profesional',
        starter:
            'Transisi dari sekolah ke dunia kerja membutuhkan adaptasi, ketekunan, dan kemampuan membaca peluang yang sesuai...',
    },
    {
        title: 'Adaptasi Kampus',
        description:
            'Untuk cerita kuliah, organisasi, beasiswa, atau pengalaman merantau.',
        category: 'kampus',
        headline: 'Hal yang paling saya pelajari saat beradaptasi di kampus',
        starter:
            'Masuk ke lingkungan kampus membuat saya sadar bahwa belajar tidak cuma terjadi di kelas. Ada proses adaptasi, benturan budaya, dan banyak keputusan baru yang akhirnya membentuk cara saya melihat masa depan...',
    },
];

function getInitials(name: string): string {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((segment) => segment[0])
        .join('')
        .toUpperCase();
}

export default function AlumniWriteStoryPage({
    school,
}: AlumniWriteStoryPageProps) {
    const heroRef = useRef<HTMLDivElement>(null);
    const visitorTokenRef = useRef('');
    const [formData, setFormData] = useState(initialAlumniStoryForm);
    const [formStep, setFormStep] = useState<1 | 2>(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
    const [locationResults, setLocationResults] = useState<GeocodeCandidate[]>(
        [],
    );
    const [isLocationLoading, setIsLocationLoading] = useState(false);
    const [isUsingCurrentLocation, setIsUsingCurrentLocation] = useState(false);
    const deferredLocationQuery = useDeferredValue(formData.location_query);
    const deferredPreviewTitle = useDeferredValue(formData.title);
    const deferredPreviewBody = useDeferredValue(formData.body);
    const suppressLocationSearchRef = useRef<string | null>(null);
    const reverseGeocodeControllerRef = useRef<AbortController | null>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 140]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    useEffect(() => {
        const token = ensureAlumniForumVisitorToken();
        persistAlumniForumVisitorToken(token);
        visitorTokenRef.current = token;
    }, []);

    useEffect(() => {
        return () => {
            reverseGeocodeControllerRef.current?.abort();
        };
    }, []);

    useEffect(() => {
        const query = deferredLocationQuery.trim();

        if (query.length < 4) {
            setLocationResults([]);
            setIsLocationLoading(false);

            return;
        }

        if (suppressLocationSearchRef.current === query) {
            suppressLocationSearchRef.current = null;
            setLocationResults([]);
            setIsLocationLoading(false);

            return;
        }

        const controller = new AbortController();

        setIsLocationLoading(true);

        fetch(searchGeocode.url({ query: { q: query, limit: 5 } }), {
            headers: {
                Accept: 'application/json',
            },
            signal: controller.signal,
        })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error('Gagal mencari lokasi.');
                }

                return response.json();
            })
            .then((data) => {
                setLocationResults(
                    (data.data?.results ?? []) as GeocodeCandidate[],
                );
            })
            .catch((error) => {
                if (
                    error instanceof DOMException &&
                    error.name === 'AbortError'
                ) {
                    return;
                }

                setLocationResults([]);
            })
            .finally(() => {
                setIsLocationLoading(false);
            });

        return () => controller.abort();
    }, [deferredLocationQuery]);

    const updateField = useCallback(
        (field: keyof AlumniStoryFormData, value: string | boolean) => {
            setFormData((previous) => ({ ...previous, [field]: value }));
        },
        [],
    );

    const applyLocationCandidate = useCallback(
        (candidate: GeocodeCandidate) => {
            suppressLocationSearchRef.current = candidate.displayName;
            setFormData((previous) => ({
                ...previous,
                location_query: candidate.displayName,
                city: candidate.address.city ?? previous.city,
                province: candidate.address.province ?? previous.province,
                latitude: String(candidate.latitude),
                longitude: String(candidate.longitude),
            }));
            setLocationResults([]);
        },
        [],
    );

    const applyCoordinateSelection = useCallback(
        (latitude: number | '', longitude: number | '') => {
            setFormData((previous) => ({
                ...previous,
                latitude:
                    latitude === ''
                        ? ''
                        : Number.isFinite(latitude)
                          ? latitude.toFixed(6)
                          : previous.latitude,
                longitude:
                    longitude === ''
                        ? ''
                        : Number.isFinite(longitude)
                          ? longitude.toFixed(6)
                          : previous.longitude,
            }));
        },
        [],
    );

    const resolveLocationFromCoordinates = useCallback(
        async (latitude: number, longitude: number, errorContext: string) => {
            reverseGeocodeControllerRef.current?.abort();

            const controller = new AbortController();

            reverseGeocodeControllerRef.current = controller;
            setIsUsingCurrentLocation(true);

            try {
                const response = await fetch(
                    reverseGeocode.url({
                        query: {
                            latitude: latitude.toFixed(6),
                            longitude: longitude.toFixed(6),
                        },
                    }),
                    {
                        headers: {
                            Accept: 'application/json',
                        },
                        signal: controller.signal,
                    },
                );

                if (!response.ok) {
                    throw new Error(errorContext);
                }

                const data = (await response.json()) as {
                    data?: {
                        result?: GeocodeCandidate;
                    };
                };
                const result = data.data?.result;

                if (!result) {
                    throw new Error(errorContext);
                }

                suppressLocationSearchRef.current = result.displayName;
                setFormData((previous) => ({
                    ...previous,
                    location_query: result.displayName,
                    city: result.address.city ?? previous.city,
                    province: result.address.province ?? previous.province,
                    latitude: latitude.toFixed(6),
                    longitude: longitude.toFixed(6),
                }));
                setLocationResults([]);
                setSubmitResult(null);
            } catch (error) {
                if (
                    error instanceof DOMException &&
                    error.name === 'AbortError'
                ) {
                    return;
                }

                setSubmitResult({
                    success: false,
                    message:
                        error instanceof Error ? error.message : errorContext,
                });
            } finally {
                if (reverseGeocodeControllerRef.current === controller) {
                    reverseGeocodeControllerRef.current = null;
                    setIsUsingCurrentLocation(false);
                }
            }
        },
        [],
    );

    const handleCoordinateCommit = useCallback(
        (latitude: number, longitude: number) => {
            applyCoordinateSelection(latitude, longitude);
            void resolveLocationFromCoordinates(
                latitude,
                longitude,
                'Koordinat berhasil dipilih, tetapi kota dan provinsi belum bisa dibaca otomatis.',
            );
        },
        [applyCoordinateSelection, resolveLocationFromCoordinates],
    );

    const handleUseCurrentLocation = useCallback(() => {
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
            setSubmitResult({
                success: false,
                message: 'Browser ini belum mendukung akses geolocation.',
            });

            return;
        }

        setIsUsingCurrentLocation(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                applyCoordinateSelection(latitude, longitude);
                void resolveLocationFromCoordinates(
                    latitude,
                    longitude,
                    'Titik berhasil dibaca, tetapi kota dan provinsi belum bisa diisi otomatis.',
                );
            },
            () => {
                setIsUsingCurrentLocation(false);
                setSubmitResult({
                    success: false,
                    message:
                        'Lokasi browser tidak bisa diambil. Pastikan izin lokasi sudah diberikan.',
                });
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0,
            },
        );
    }, [applyCoordinateSelection, resolveLocationFromCoordinates]);

    const applyBlueprint = useCallback(
        (blueprint: (typeof storyBlueprints)[number]) => {
            startTransition(() => {
                setFormData((previous) => ({
                    ...previous,
                    category: blueprint.category,
                    title:
                        previous.title.trim() === ''
                            ? blueprint.headline
                            : previous.title,
                    body:
                        previous.body.trim() === ''
                            ? blueprint.starter
                            : previous.body,
                }));
                setFormStep(2);
                setSubmitResult(null);
            });
        },
        [],
    );

    const isStep1Valid =
        formData.author_name.trim() !== '' &&
        formData.graduation_year.trim() !== '' &&
        Number(formData.graduation_year) >= 1990 &&
        Number(formData.graduation_year) <= new Date().getFullYear() + 1;

    const isStep2Valid =
        formData.title.trim() !== '' && formData.body.trim().length >= 48;

    const completionItems = useMemo(
        () => [
            { label: 'Nama alumni', done: formData.author_name.trim() !== '' },
            {
                label: 'Angkatan lulus',
                done: formData.graduation_year.trim() !== '',
            },
            {
                label: 'Kategori cerita',
                done: categoryCards.some(
                    (item) => item.value === formData.category,
                ),
            },
            { label: 'Judul kuat', done: formData.title.trim() !== '' },
            {
                label: 'Isi cerita minimal 48 karakter',
                done: formData.body.trim().length >= 48,
            },
            {
                label: 'Konteks profesi atau kampus',
                done:
                    formData.institution_name.trim() !== '' ||
                    formData.occupation_title.trim() !== '',
            },
        ],
        [formData],
    );

    const completionScore = Math.round(
        (completionItems.filter((item) => item.done).length /
            completionItems.length) *
            100,
    );

    const previewCategory =
        categoryCards.find((item) => item.value === formData.category) ??
        categoryCards[0];
    const PreviewIcon = previewCategory.icon;
    const previewBody =
        deferredPreviewBody.trim() === ''
            ? 'Cerita kamu akan tampil di sini sebagai pratinjau. Tulis pengalaman yang spesifik dan memiliki satu pesan utama.'
            : deferredPreviewBody;
    const previewExcerpt = previewBody.slice(0, 240);
    const previewReadMinutes = Math.max(
        1,
        Math.ceil(previewBody.split(/\s+/).filter(Boolean).length / 180),
    );

    const handleSubmit = useCallback(
        async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            if (!isStep1Valid) {
                setFormStep(1);
                setSubmitResult({
                    success: false,
                    message:
                        'Lengkapi identitas dasar terlebih dahulu sebelum mengirim cerita.',
                });

                return;
            }

            if (!isStep2Valid) {
                setFormStep(2);
                setSubmitResult({
                    success: false,
                    message:
                        'Judul dan isi cerita masih belum cukup lengkap untuk dipublikasikan.',
                });

                return;
            }

            setIsSubmitting(true);
            setSubmitResult(null);

            try {
                const response = await fetch(storeAlumniForum.url(), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-Alumni-Visitor': visitorTokenRef.current,
                    },
                    body: JSON.stringify({
                        ...formData,
                        graduation_year: Number.parseInt(
                            formData.graduation_year,
                            10,
                        ),
                        latitude: formData.latitude
                            ? Number(formData.latitude)
                            : null,
                        longitude: formData.longitude
                            ? Number(formData.longitude)
                            : null,
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    const errors = data.errors
                        ? Object.values(data.errors).flat().join(' ')
                        : (data.message ??
                          'Terjadi kesalahan saat mengirim cerita.');

                    throw new Error(errors as string);
                }

                if (data.visitorToken) {
                    visitorTokenRef.current = data.visitorToken;
                    persistAlumniForumVisitorToken(data.visitorToken);
                }

                startTransition(() => {
                    setFormData(initialAlumniStoryForm);
                    setFormStep(1);
                    setLocationResults([]);
                });

                setSubmitResult({
                    success: true,
                    message: data.message,
                    detailUrl: data.post?.detailUrl ?? null,
                    moderationStatus: data.post?.moderationStatus ?? null,
                });

                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (error) {
                setSubmitResult({
                    success: false,
                    message:
                        error instanceof Error
                            ? error.message
                            : 'Gagal mengirim. Periksa koneksi internet Anda.',
                });
            } finally {
                setIsSubmitting(false);
            }
        },
        [formData, isStep1Valid, isStep2Valid],
    );

    return (
        <>
            <Head title="Tulis Ceritamu">
                <meta
                    name="description"
                    content={`Halaman alumni ${school.name} untuk mengirim cerita, pengalaman kampus, dan perjalanan karier.`}
                />
                <meta
                    property="og:title"
                    content={`Tulis Ceritamu | ${school.name}`}
                />
                <meta
                    property="og:description"
                    content="Bagikan cerita alumni dengan format yang singkat, jelas, dan mudah dibaca."
                />
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=plus-jakarta-sans:400,500,600,700,800|space-grotesk:500,700"
                    rel="stylesheet"
                />
            </Head>

            <div className="space-y-8 pb-20 md:space-y-10">
                <motion.section
                    ref={heroRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative right-1/2 left-1/2 -mt-8 -mr-[50vw] -ml-[50vw] h-[72vh] w-screen overflow-hidden bg-slate-950 md:-mt-10 lg:h-[78dvh]"
                >
                    <motion.div
                        className="absolute inset-0 z-0"
                        style={{ y: heroY }}
                    >
                        <div className="absolute inset-0">
                            <img
                                src="/images/alumni/hero.png"
                                alt="Cerita alumni SMAN 1 Tenjo"
                                className="h-full w-full object-cover object-center opacity-35 mix-blend-luminosity"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/55 to-transparent" />
                        </div>
                        <div className="absolute top-1/4 -left-20 size-[24rem] rounded-full bg-violet-500/12 blur-[120px]" />
                        <div className="absolute right-0 bottom-1/4 size-[28rem] rounded-full bg-emerald-500/10 blur-[130px]" />
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
                    </motion.div>

                    <motion.div
                        className="absolute inset-0 z-10 flex flex-col justify-center px-6 md:px-12 xl:px-24"
                        style={{ opacity: heroOpacity }}
                    >
                        <div className="mx-auto flex w-full max-w-7xl pt-20">
                            <div className="max-w-4xl">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.92 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.45, delay: 0.2 }}
                                    className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2 backdrop-blur-md"
                                >
                                    <PenLine className="size-4 text-violet-300" />
                                    <span className="text-[0.68rem] font-bold tracking-[0.25em] text-violet-200 uppercase">
                                        Cerita Alumni
                                    </span>
                                </motion.div>

                                <motion.h1
                                    initial={{ opacity: 0, y: 28 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    className="max-w-4xl font-heading text-5xl leading-[1.05] text-white md:text-7xl lg:text-[5.5rem]"
                                >
                                    Tulis Cerita{' '}
                                    <span className="bg-gradient-to-r from-violet-300 to-emerald-300 bg-clip-text text-transparent">
                                        Alumni.
                                    </span>
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 28 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg lg:text-xl"
                                >
                                    Bagikan pengalamanmu dengan singkat, jelas,
                                    dan sesuai untuk forum alumni sekolah.
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, y: 28 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.5 }}
                                    className="mt-8"
                                >
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="rounded-full border-white/15 bg-white/10 px-6 text-white hover:bg-white/15"
                                    >
                                        <Link href={alumni()}>
                                            <ArrowLeft className="mr-2 size-4" />
                                            Kembali ke Forum Alumni
                                        </Link>
                                    </Button>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </motion.section>

                {submitResult && (
                    <motion.section
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            'rounded-[2rem] border p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]',
                            submitResult.success
                                ? 'border-emerald-200 bg-emerald-50/90'
                                : 'border-rose-200 bg-rose-50/90',
                        )}
                    >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-start gap-4">
                                <div
                                    className={cn(
                                        'flex size-11 items-center justify-center rounded-2xl text-white',
                                        submitResult.success
                                            ? 'bg-emerald-600'
                                            : 'bg-rose-600',
                                    )}
                                >
                                    {submitResult.success ? (
                                        <Check className="size-5" />
                                    ) : (
                                        <X className="size-5" />
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <p
                                        className={cn(
                                            'text-sm font-bold tracking-[0.18em] uppercase',
                                            submitResult.success
                                                ? 'text-emerald-700'
                                                : 'text-rose-700',
                                        )}
                                    >
                                        {submitResult.success
                                            ? 'Cerita Terkirim'
                                            : 'Perlu Diperbaiki'}
                                    </p>
                                    <p
                                        className={cn(
                                            'max-w-3xl text-sm leading-7 md:text-base',
                                            submitResult.success
                                                ? 'text-emerald-950'
                                                : 'text-rose-950',
                                        )}
                                    >
                                        {submitResult.message}
                                    </p>
                                </div>
                            </div>

                            {submitResult.success && (
                                <div className="flex flex-wrap gap-3">
                                    {submitResult.detailUrl && (
                                        <Button
                                            asChild
                                            className="rounded-full bg-emerald-700 px-6 text-white hover:bg-emerald-600"
                                        >
                                            <Link href={submitResult.detailUrl}>
                                                Lihat Cerita
                                            </Link>
                                        </Button>
                                    )}
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="rounded-full border-emerald-200 bg-white px-6 text-emerald-900 hover:bg-emerald-100"
                                    >
                                        <Link href={alumni()}>
                                            Kembali ke Forum
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </motion.section>
                )}

                <section className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_390px]">
                    <div className="space-y-6">
                        <BorderGlow
                            borderRadius={34}
                            colors={['#8B5CF6', '#10B981', '#F59E0B']}
                            className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-[0_32px_90px_-48px_rgba(15,23,42,0.32)] backdrop-blur-xl"
                        >
                            <div className="border-b border-slate-100 px-6 py-6 md:px-8">
                                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                                    <div className="space-y-2">
                                        <p className="text-[0.72rem] font-bold tracking-[0.2em] text-slate-400 uppercase">
                                            Penyusun Cerita
                                        </p>
                                        <h2 className="font-heading text-2xl text-slate-950 md:text-3xl">
                                            Tulis cerita dalam 2 langkah.
                                        </h2>
                                        <p className="max-w-2xl text-sm leading-7 text-slate-500 md:text-base">
                                            Langkah pertama mengunci konteks
                                            penulis, lalu langkah kedua menyusun
                                            isi dan pesan utama.
                                        </p>
                                    </div>

                                    <div className="w-full max-w-xs space-y-2">
                                        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                                            <span>Progress konten</span>
                                            <span>{completionScore}%</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-slate-100">
                                            <div
                                                className="h-2 rounded-full bg-linear-to-r from-violet-500 via-emerald-500 to-amber-500 transition-all duration-500"
                                                style={{
                                                    width: `${completionScore}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                    {[
                                        {
                                            step: 1,
                                            title: 'Profil & Jejak',
                                            description:
                                                'Nama, angkatan, kategori, profesi, institusi, dan lokasi.',
                                        },
                                        {
                                            step: 2,
                                            title: 'Narasi & Publikasi',
                                            description:
                                                'Judul, isi cerita, pratinjau akhir, lalu kirim ke forum.',
                                        },
                                    ].map((item) => (
                                        <button
                                            key={item.step}
                                            type="button"
                                            onClick={() =>
                                                setFormStep(item.step as 1 | 2)
                                            }
                                            className={cn(
                                                'rounded-[1.5rem] border px-4 py-4 text-left transition',
                                                formStep === item.step
                                                    ? 'border-slate-900 bg-slate-900 text-white shadow-[0_18px_55px_-34px_rgba(15,23,42,0.9)]'
                                                    : 'border-slate-200 bg-slate-50/80 text-slate-700 hover:border-slate-300 hover:bg-white',
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={cn(
                                                        'flex size-9 items-center justify-center rounded-full text-sm font-bold',
                                                        formStep === item.step
                                                            ? 'bg-white/15 text-white'
                                                            : 'bg-white text-slate-900',
                                                    )}
                                                >
                                                    {item.step}
                                                </div>
                                                <div>
                                                    <div className="font-semibold">
                                                        {item.title}
                                                    </div>
                                                    <p
                                                        className={cn(
                                                            'mt-1 text-sm leading-6',
                                                            formStep ===
                                                                item.step
                                                                ? 'text-slate-300'
                                                                : 'text-slate-500',
                                                        )}
                                                    >
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="px-6 py-6 md:px-8 md:py-8"
                            >
                                <input
                                    type="text"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    value=""
                                    onChange={() => undefined}
                                    className="hidden"
                                    name="website"
                                />

                                <AnimatePresence mode="wait">
                                    {formStep === 1 ? (
                                        <motion.div
                                            key="profile-step"
                                            initial={{ opacity: 0, y: 14 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-8"
                                        >
                                            <div className="space-y-3">
                                                <p className="text-[0.72rem] font-bold tracking-[0.2em] text-violet-500 uppercase">
                                                    Langkah 1
                                                </p>
                                                <h3 className="font-heading text-2xl text-slate-950">
                                                    Kenalkan dirimu dan konteks
                                                    perjalananmu.
                                                </h3>
                                                <p className="max-w-3xl text-sm leading-7 text-slate-500 md:text-base">
                                                    Bagian ini membantu pembaca
                                                    memahami dari angkatan mana
                                                    kamu berasal, sedang berada
                                                    di fase apa, dan dari kota
                                                    mana pengalaman itu ditulis.
                                                </p>
                                            </div>

                                            <div className="grid gap-5 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-slate-800">
                                                        Nama Lengkap *
                                                    </label>
                                                    <div className="relative">
                                                        <User className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />
                                                        <input
                                                            type="text"
                                                            required
                                                            value={
                                                                formData.author_name
                                                            }
                                                            onChange={(event) =>
                                                                updateField(
                                                                    'author_name',
                                                                    event.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="Nama lengkapmu"
                                                            className="w-full rounded-[1.35rem] border border-slate-200 bg-slate-50/70 py-3.5 pr-4 pl-11 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100 focus:outline-none"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-slate-800">
                                                        Tahun Lulus *
                                                    </label>
                                                    <div className="relative">
                                                        <GraduationCap className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />
                                                        <input
                                                            type="number"
                                                            required
                                                            value={
                                                                formData.graduation_year
                                                            }
                                                            onChange={(event) =>
                                                                updateField(
                                                                    'graduation_year',
                                                                    event.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="2020"
                                                            min="1990"
                                                            max={
                                                                new Date().getFullYear() +
                                                                1
                                                            }
                                                            className="w-full rounded-[1.35rem] border border-slate-200 bg-slate-50/70 py-3.5 pr-4 pl-11 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100 focus:outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between gap-3">
                                                    <label className="text-sm font-semibold text-slate-800">
                                                        Fokus Cerita
                                                    </label>
                                                    <span className="text-xs font-semibold text-slate-400">
                                                        Pilih kategori cerita
                                                    </span>
                                                </div>
                                                <div className="grid gap-3 md:grid-cols-2">
                                                    {categoryCards.map(
                                                        (category) => {
                                                            const CategoryIcon =
                                                                category.icon;
                                                            const active =
                                                                formData.category ===
                                                                category.value;

                                                            return (
                                                                <button
                                                                    key={
                                                                        category.value
                                                                    }
                                                                    type="button"
                                                                    onClick={() =>
                                                                        updateField(
                                                                            'category',
                                                                            category.value,
                                                                        )
                                                                    }
                                                                    className={cn(
                                                                        'rounded-[1.45rem] border p-4 text-left transition',
                                                                        active
                                                                            ? category.accent
                                                                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50',
                                                                    )}
                                                                >
                                                                    <div className="flex items-start gap-3">
                                                                        <div
                                                                            className={cn(
                                                                                'flex size-11 items-center justify-center rounded-2xl',
                                                                                active
                                                                                    ? 'bg-white/80'
                                                                                    : 'bg-slate-100',
                                                                            )}
                                                                        >
                                                                            <CategoryIcon className="size-5" />
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <div className="font-semibold">
                                                                                {
                                                                                    category.label
                                                                                }
                                                                            </div>
                                                                            <p className="text-sm leading-6 opacity-80">
                                                                                {
                                                                                    category.description
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </button>
                                                            );
                                                        },
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid gap-5 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-slate-800">
                                                        Pekerjaan / Profesi
                                                    </label>
                                                    <div className="relative">
                                                        <Briefcase className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />
                                                        <input
                                                            type="text"
                                                            value={
                                                                formData.occupation_title
                                                            }
                                                            onChange={(event) =>
                                                                updateField(
                                                                    'occupation_title',
                                                                    event.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="Software Engineer"
                                                            className="w-full rounded-[1.35rem] border border-slate-200 bg-slate-50/70 py-3.5 pr-4 pl-11 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100 focus:outline-none"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-slate-800">
                                                        Institusi / Perusahaan
                                                    </label>
                                                    <div className="relative">
                                                        <Building2 className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />
                                                        <input
                                                            type="text"
                                                            value={
                                                                formData.institution_name
                                                            }
                                                            onChange={(event) =>
                                                                updateField(
                                                                    'institution_name',
                                                                    event.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="Universitas atau perusahaan"
                                                            className="w-full rounded-[1.35rem] border border-slate-200 bg-slate-50/70 py-3.5 pr-4 pl-11 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100 focus:outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <AlumniLocationPicker
                                                city={formData.city}
                                                province={formData.province}
                                                latitude={formData.latitude}
                                                longitude={formData.longitude}
                                                query={formData.location_query}
                                                loading={isLocationLoading}
                                                locating={
                                                    isUsingCurrentLocation
                                                }
                                                results={locationResults}
                                                schoolPosition={[
                                                    school.location.latitude,
                                                    school.location.longitude,
                                                ]}
                                                onCityChange={(value) =>
                                                    updateField('city', value)
                                                }
                                                onProvinceChange={(value) =>
                                                    updateField(
                                                        'province',
                                                        value,
                                                    )
                                                }
                                                onQueryChange={(value) =>
                                                    updateField(
                                                        'location_query',
                                                        value,
                                                    )
                                                }
                                                onCoordinateChange={
                                                    applyCoordinateSelection
                                                }
                                                onCoordinateCommit={
                                                    handleCoordinateCommit
                                                }
                                                onPickResult={
                                                    applyLocationCandidate
                                                }
                                                onUseCurrentLocation={
                                                    handleUseCurrentLocation
                                                }
                                            />

                                            <div className="grid gap-5 md:grid-cols-[1.05fr_0.95fr]">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-slate-800">
                                                        Email
                                                    </label>
                                                    <div className="relative">
                                                        <Mail className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />
                                                        <input
                                                            type="email"
                                                            value={
                                                                formData.contact_email
                                                            }
                                                            onChange={(event) =>
                                                                updateField(
                                                                    'contact_email',
                                                                    event.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="email@contoh.com"
                                                            className="w-full rounded-[1.35rem] border border-slate-200 bg-slate-50/70 py-3.5 pr-4 pl-11 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100 focus:outline-none"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="rounded-[1.6rem] border border-slate-200 bg-slate-50/80 p-4">
                                                    <p className="text-sm font-semibold text-slate-900">
                                                        Lencana Publik
                                                    </p>
                                                    <div className="mt-3 space-y-3">
                                                        <label className="flex gap-3 rounded-[1.15rem] border border-white bg-white/90 px-4 py-3 text-sm text-slate-600">
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    formData.is_open_to_mentor
                                                                }
                                                                onChange={(
                                                                    event,
                                                                ) =>
                                                                    updateField(
                                                                        'is_open_to_mentor',
                                                                        event
                                                                            .target
                                                                            .checked,
                                                                    )
                                                                }
                                                                className="mt-1 size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                                            />
                                                            <span>
                                                                <span className="block font-semibold text-slate-900">
                                                                    Open to
                                                                    Mentor
                                                                </span>
                                                                <span className="block text-xs leading-5 text-slate-500">
                                                                    Tunjukkan
                                                                    kalau kamu
                                                                    terbuka
                                                                    berbagi
                                                                    insight ke
                                                                    adik kelas.
                                                                </span>
                                                            </span>
                                                        </label>

                                                        <label className="flex gap-3 rounded-[1.15rem] border border-white bg-white/90 px-4 py-3 text-sm text-slate-600">
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    formData.has_hiring_info
                                                                }
                                                                onChange={(
                                                                    event,
                                                                ) =>
                                                                    updateField(
                                                                        'has_hiring_info',
                                                                        event
                                                                            .target
                                                                            .checked,
                                                                    )
                                                                }
                                                                className="mt-1 size-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                                                            />
                                                            <span>
                                                                <span className="block font-semibold text-slate-900">
                                                                    Hiring /
                                                                    Opportunity
                                                                </span>
                                                                <span className="block text-xs leading-5 text-slate-500">
                                                                    Aktifkan
                                                                    kalau isi
                                                                    cerita juga
                                                                    memuat
                                                                    peluang
                                                                    magang,
                                                                    kerja, atau
                                                                    kolaborasi.
                                                                </span>
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                                                <p className="text-sm leading-7 text-slate-500">
                                                    Tips: semakin jelas konteks
                                                    profesi, kota, atau kampus,
                                                    semakin mudah pembaca merasa
                                                    dekat dengan ceritamu.
                                                </p>
                                                <Button
                                                    type="button"
                                                    disabled={!isStep1Valid}
                                                    onClick={() =>
                                                        setFormStep(2)
                                                    }
                                                    className="rounded-full bg-slate-950 px-7 text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                    Lanjut ke Narasi
                                                </Button>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="story-step"
                                            initial={{ opacity: 0, y: 14 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-8"
                                        >
                                            <div className="space-y-3">
                                                <p className="text-[0.72rem] font-bold tracking-[0.2em] text-emerald-500 uppercase">
                                                    Langkah 2
                                                </p>
                                                <h3 className="font-heading text-2xl text-slate-950">
                                                    Susun cerita dengan satu
                                                    sudut pandang yang jelas.
                                                </h3>
                                                <p className="max-w-3xl text-sm leading-7 text-slate-500 md:text-base">
                                                    Tulis dengan bahasa yang
                                                    natural, spesifik, dan punya
                                                    satu benang merah: apa yang
                                                    ingin kamu bagikan kepada
                                                    adik kelas setelah membaca
                                                    kisahmu?
                                                </p>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between gap-3">
                                                    <label className="text-sm font-semibold text-slate-800">
                                                        Draft Cepat
                                                    </label>
                                                    <span className="text-xs font-semibold text-slate-400">
                                                        Klik salah satu untuk
                                                        memulai draft
                                                    </span>
                                                </div>
                                                <div className="grid gap-3 lg:grid-cols-3">
                                                    {storyBlueprints.map(
                                                        (blueprint) => {
                                                            const blueprintMeta =
                                                                categoryCards.find(
                                                                    (item) =>
                                                                        item.value ===
                                                                        blueprint.category,
                                                                ) ??
                                                                categoryCards[0];

                                                            return (
                                                                <button
                                                                    key={
                                                                        blueprint.title
                                                                    }
                                                                    type="button"
                                                                    onClick={() =>
                                                                        applyBlueprint(
                                                                            blueprint,
                                                                        )
                                                                    }
                                                                    className="rounded-[1.45rem] border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_20px_45px_-36px_rgba(15,23,42,0.65)]"
                                                                >
                                                                    <span
                                                                        className={cn(
                                                                            'inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.68rem] font-bold tracking-[0.18em] uppercase',
                                                                            blueprintMeta.accent,
                                                                        )}
                                                                    >
                                                                        <blueprintMeta.icon className="size-3.5" />
                                                                        {
                                                                            blueprintMeta.shortLabel
                                                                        }
                                                                    </span>
                                                                    <div className="mt-3 font-semibold text-slate-900">
                                                                        {
                                                                            blueprint.title
                                                                        }
                                                                    </div>
                                                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                                                        {
                                                                            blueprint.description
                                                                        }
                                                                    </p>
                                                                </button>
                                                            );
                                                        },
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-800">
                                                    Judul Cerita *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.title}
                                                    onChange={(event) =>
                                                        updateField(
                                                            'title',
                                                            event.target.value,
                                                        )
                                                    }
                                                    placeholder="Contoh: Hal yang paling mengubah saya setelah lulus dari SMAN 1 Tenjo"
                                                    className="w-full rounded-[1.35rem] border border-slate-200 bg-slate-50/70 px-5 py-3.5 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100 focus:outline-none"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between gap-3">
                                                    <label className="text-sm font-semibold text-slate-800">
                                                        Isi Cerita *
                                                    </label>
                                                    <span
                                                        className={cn(
                                                            'text-xs font-semibold',
                                                            formData.body.trim()
                                                                .length >= 48
                                                                ? 'text-emerald-600'
                                                                : 'text-slate-400',
                                                        )}
                                                    >
                                                        {formData.body.length}
                                                        /5000 karakter
                                                    </span>
                                                </div>
                                                <textarea
                                                    required
                                                    rows={12}
                                                    maxLength={5000}
                                                    value={formData.body}
                                                    onChange={(event) =>
                                                        updateField(
                                                            'body',
                                                            event.target.value,
                                                        )
                                                    }
                                                    placeholder="Mulai dari satu kejadian, lalu ceritakan konteks, tantangan, keputusan, dan pelajaran yang kamu bawa."
                                                    className="w-full resize-none rounded-[1.6rem] border border-slate-200 bg-slate-50/70 px-5 py-4 text-sm leading-8 text-slate-900 transition placeholder:text-slate-400 focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100 focus:outline-none"
                                                />
                                            </div>

                                            <div className="rounded-[1.6rem] border border-emerald-100 bg-emerald-50/80 p-5">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                                                        <Lightbulb className="size-4" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="font-semibold text-emerald-950">
                                                            Struktur cerita yang
                                                            disarankan
                                                        </div>
                                                        <p className="text-sm leading-7 text-emerald-900/85">
                                                            Mulai dari situasi
                                                            awal, masuk ke
                                                            tantangan utama,
                                                            jelaskan keputusan
                                                            atau aksi yang kamu
                                                            ambil, lalu tutup
                                                            dengan pelajaran
                                                            paling relevan untuk
                                                            pembaca.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() =>
                                                        setFormStep(1)
                                                    }
                                                    className="rounded-full border-slate-200 bg-white px-7 hover:bg-slate-50"
                                                >
                                                    Kembali ke Profil
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    disabled={
                                                        isSubmitting ||
                                                        !isStep2Valid
                                                    }
                                                    className="rounded-full bg-emerald-700 px-7 text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                    <Send className="mr-2 size-4" />
                                                    {isSubmitting
                                                        ? 'Mengirim Cerita...'
                                                        : 'Kirim ke Forum Alumni'}
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </form>
                        </BorderGlow>
                    </div>

                    <div className="space-y-6 xl:sticky xl:top-28 xl:self-start">
                        <BorderGlow
                            borderRadius={32}
                            colors={['#0F766E', '#8B5CF6', '#F59E0B']}
                            className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-[0_30px_90px_-54px_rgba(15,23,42,0.42)] backdrop-blur-xl"
                        >
                            <div className="border-b border-slate-100 px-5 py-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[0.68rem] font-bold tracking-[0.2em] text-slate-400 uppercase">
                                            Live Preview
                                        </p>
                                        <h3 className="font-heading text-xl text-slate-950">
                                            Tampilan cerita sebelum tayang
                                        </h3>
                                    </div>
                                    <div className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500">
                                        {previewReadMinutes} menit baca
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5 px-5 py-5">
                                <div className="flex items-center gap-4">
                                    <div className="flex size-13 items-center justify-center rounded-[1.25rem] bg-linear-to-br from-slate-900 via-violet-700 to-emerald-500 text-sm font-extrabold text-white shadow-lg">
                                        {getInitials(
                                            formData.author_name || 'Alumni',
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="font-semibold text-slate-900">
                                            {formData.author_name ||
                                                'Nama alumni'}
                                        </div>
                                        <div className="text-sm text-slate-500">
                                            {formData.graduation_year
                                                ? `Angkatan ${formData.graduation_year}`
                                                : 'Tambahkan tahun lulus'}
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className={cn(
                                        'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[0.68rem] font-bold tracking-[0.18em] uppercase',
                                        previewCategory.accent,
                                    )}
                                >
                                    <PreviewIcon className="size-3.5" />
                                    {previewCategory.label}
                                </div>

                                <div className="space-y-3">
                                    <h4 className="font-heading text-2xl leading-tight text-slate-950">
                                        {deferredPreviewTitle.trim() ||
                                            'Judul cerita akan muncul di sini'}
                                    </h4>
                                    <p className="text-sm leading-7 text-slate-600">
                                        {previewExcerpt}
                                        {previewBody.length > 240 ? '...' : ''}
                                    </p>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                                    <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50/80 p-4">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                                            <Compass className="size-4 text-violet-500" />
                                            Titik Jejak
                                        </div>
                                        <p className="mt-2 text-sm leading-6 text-slate-500">
                                            {[formData.city, formData.province]
                                                .filter(Boolean)
                                                .join(', ') ||
                                                'Lokasi belum ditentukan'}
                                        </p>
                                    </div>

                                    <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50/80 p-4">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                                            <Briefcase className="size-4 text-emerald-500" />
                                            Konteks
                                        </div>
                                        <p className="mt-2 text-sm leading-6 text-slate-500">
                                            {formData.occupation_title ||
                                                formData.institution_name ||
                                                'Tambahkan profesi atau institusi'}
                                        </p>
                                    </div>
                                </div>

                                {(formData.is_open_to_mentor ||
                                    formData.has_hiring_info) && (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.is_open_to_mentor && (
                                            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                                                <Star className="size-3.5" />
                                                Open to Mentor
                                            </span>
                                        )}
                                        {formData.has_hiring_info && (
                                            <span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700">
                                                <Briefcase className="size-3.5" />
                                                Hiring / Opportunity
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </BorderGlow>

                        <div className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_80px_-50px_rgba(15,23,42,0.35)] backdrop-blur-xl">
                            <p className="text-[0.68rem] font-bold tracking-[0.2em] text-slate-400 uppercase">
                                Checklist
                            </p>
                            <div className="mt-4 space-y-3">
                                {completionItems.map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex items-center gap-3 rounded-[1rem] border border-slate-100 bg-slate-50/70 px-3 py-3"
                                    >
                                        <div
                                            className={cn(
                                                'flex size-8 items-center justify-center rounded-full',
                                                item.done
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'bg-white text-slate-300',
                                            )}
                                        >
                                            <Check className="size-4" />
                                        </div>
                                        <span
                                            className={cn(
                                                'text-sm',
                                                item.done
                                                    ? 'font-semibold text-slate-900'
                                                    : 'text-slate-500',
                                            )}
                                        >
                                            {item.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={motionViewport}
                            className="rounded-[2rem] border border-slate-200 bg-linear-to-br from-white to-slate-50 p-5 shadow-[0_24px_80px_-54px_rgba(15,23,42,0.32)]"
                        >
                            <p className="text-[0.68rem] font-bold tracking-[0.2em] text-slate-400 uppercase">
                                Panduan Cepat
                            </p>
                            <div className="mt-4 space-y-4">
                                {[
                                    {
                                        icon: Lightbulb,
                                        title: 'Tulis secara spesifik',
                                        description:
                                            'Sebutkan fase, situasi, atau momen nyata agar cerita mudah dipahami.',
                                    },
                                    {
                                        icon: MapPin,
                                        title: 'Lokasi menambah konteks',
                                        description:
                                            'Kota dan provinsi membantu pembaca membayangkan konteks perjalananmu.',
                                    },
                                    {
                                        icon: Mail,
                                        title: 'Email bersifat opsional',
                                        description:
                                            'Isi bila kamu ingin lebih mudah dihubungi untuk kolaborasi atau mentoring.',
                                    },
                                ].map((tip) => {
                                    const TipIcon = tip.icon;

                                    return (
                                        <div
                                            key={tip.title}
                                            className="flex gap-3"
                                        >
                                            <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
                                                <TipIcon className="size-4" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-900">
                                                    {tip.title}
                                                </div>
                                                <p className="mt-1 text-sm leading-6 text-slate-500">
                                                    {tip.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
        </>
    );
}
