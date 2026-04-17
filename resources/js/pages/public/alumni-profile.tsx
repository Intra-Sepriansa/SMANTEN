import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Briefcase,
    GraduationCap,
    MapPin,
    Sparkles,
    Target,
    TrendingUp,
} from 'lucide-react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { BorderGlow } from '@/components/public/border-glow';
import type {
    AlumniProfileSummary,
    ForumPost,
    SchoolProfilePayload,
} from '@/types';

type AlumniProfileDetail = AlumniProfileSummary & {
    careerCluster: string | null;
    contactEmail: string | null;
    stories: ForumPost[];
    latestTracer: {
        status: string | null;
        currentActivity: string | null;
        institutionName: string | null;
        major: string | null;
        occupationTitle: string | null;
        industry: string | null;
        locationCity: string | null;
        locationProvince: string | null;
        startedAt: string | null;
        monthlyIncomeRange: string | null;
        reflections: string | null;
        submittedAt: string | null;
    } | null;
};

type AlumniProfilePageProps = {
    school: SchoolProfilePayload;
    profile: AlumniProfileDetail;
};

function formatLocationLabel(
    city: string | null,
    province: string | null,
    fallback = 'Lihat lokasi asli',
): string {
    return [city, province].filter(Boolean).join(', ') || fallback;
}

export default function AlumniProfilePage({
    school,
    profile,
}: AlumniProfilePageProps) {
    const siteOrigin =
        typeof window !== 'undefined' ? window.location.origin : '';
    const shareUrl = profile.url ? `${siteOrigin}${profile.url}` : '';
    const ogImage = siteOrigin
        ? `${siteOrigin}/images/alumni/hero.png`
        : '/images/alumni/hero.png';
    const locationLabel = formatLocationLabel(profile.city, profile.province);

    return (
        <>
            <Head title={`${profile.fullName} | Alumni ${school.name}`}>
                <meta
                    name="description"
                    content={
                        profile.bio ??
                        `Profil alumni ${profile.fullName} dari ${school.name}.`
                    }
                />
                {shareUrl && <link rel="canonical" href={shareUrl} />}
                <meta
                    property="og:title"
                    content={`${profile.fullName} | Alumni ${school.name}`}
                />
                <meta
                    property="og:description"
                    content={
                        profile.bio ??
                        `Profil alumni ${profile.fullName} dari ${school.name}.`
                    }
                />
                {shareUrl && <meta property="og:url" content={shareUrl} />}
                <meta property="og:type" content="profile" />
                <meta property="og:image" content={ogImage} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content={`${profile.fullName} | Alumni ${school.name}`}
                />
                <meta
                    name="twitter:description"
                    content={
                        profile.bio ??
                        `Profil alumni ${profile.fullName} dari ${school.name}.`
                    }
                />
                <meta name="twitter:image" content={ogImage} />
            </Head>

            <div className="space-y-10 pb-20">
                <section className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-br from-emerald-900 via-slate-900 to-sky-950 px-6 py-14 text-white shadow-[0_40px_120px_-50px_rgba(15,23,42,0.6)] md:px-10 lg:px-14">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.25),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.18),transparent_35%)]" />
                    <div className="relative z-10 grid gap-8 lg:grid-cols-[auto_1fr]">
                        <div className="flex size-24 items-center justify-center rounded-4xl bg-white/10 text-3xl font-bold shadow-2xl">
                            {profile.fullName
                                .split(' ')
                                .filter(Boolean)
                                .slice(0, 2)
                                .map((part) => part[0])
                                .join('')
                                .toUpperCase()}
                        </div>
                        <div className="space-y-5">
                            <div className="flex flex-wrap items-center gap-3 text-xs font-bold tracking-[0.22em] text-white/70 uppercase">
                                <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">
                                    Profil Alumni
                                </span>
                                {profile.mentorshipBadge && (
                                    <span className="rounded-full border border-amber-300/20 bg-amber-400/15 px-4 py-2 text-amber-200">
                                        Mentor
                                    </span>
                                )}
                                {profile.hiringBadge && (
                                    <span className="rounded-full border border-rose-300/20 bg-rose-400/15 px-4 py-2 text-rose-200">
                                        Hiring
                                    </span>
                                )}
                            </div>
                            <h1 className="font-heading text-3xl leading-tight md:text-5xl">
                                {profile.fullName}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
                                {profile.graduationYear && (
                                    <span className="flex items-center gap-1">
                                        <GraduationCap className="size-4" />{' '}
                                        Angkatan {profile.graduationYear}
                                    </span>
                                )}
                                {(profile.city ||
                                    profile.province ||
                                    profile.locationMapUrl) &&
                                    (profile.locationMapUrl ? (
                                        <a
                                            href={profile.locationMapUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 transition hover:border-emerald-300/30 hover:bg-white/10 hover:text-emerald-200"
                                        >
                                            <MapPin className="size-4" />{' '}
                                            {locationLabel}
                                        </a>
                                    ) : (
                                        <span className="flex items-center gap-1">
                                            <MapPin className="size-4" />{' '}
                                            {locationLabel}
                                        </span>
                                    ))}
                                {profile.occupationTitle && (
                                    <span className="flex items-center gap-1">
                                        <Briefcase className="size-4" />{' '}
                                        {profile.occupationTitle}
                                    </span>
                                )}
                            </div>
                            {profile.bio && (
                                <p className="max-w-3xl text-base leading-8 text-slate-200">
                                    {profile.bio}
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="space-y-8">
                        {profile.latestTracer && (
                            <BorderGlow
                                borderRadius={32}
                                colors={['#10B981', '#0EA5E9', 'transparent']}
                                className="rounded-4xl border border-white/80 bg-white/90 p-8 shadow-[0_30px_80px_-40px_rgba(15,118,110,0.25)] backdrop-blur-xl"
                            >
                                <div className="flex items-center gap-3 text-sm font-semibold text-emerald-700">
                                    <Target className="size-4" />
                                    Snapshot Tracer Study
                                </div>
                                <div className="mt-6 grid gap-4 md:grid-cols-2">
                                    <div className="rounded-2xl bg-slate-50 px-5 py-4">
                                        <div className="text-xs tracking-[0.18em] text-slate-400 uppercase">
                                            Aktivitas
                                        </div>
                                        <div className="mt-2 text-lg font-semibold text-(--school-ink)">
                                            {profile.latestTracer
                                                .currentActivity ??
                                                'Tidak dipublikasikan'}
                                        </div>
                                    </div>
                                    <div className="rounded-2xl bg-slate-50 px-5 py-4">
                                        <div className="text-xs tracking-[0.18em] text-slate-400 uppercase">
                                            Institusi / Industri
                                        </div>
                                        <div className="mt-2 text-lg font-semibold text-(--school-ink)">
                                            {profile.latestTracer
                                                .institutionName ??
                                                profile.latestTracer.industry ??
                                                'Tidak dipublikasikan'}
                                        </div>
                                    </div>
                                    <div className="rounded-2xl bg-slate-50 px-5 py-4">
                                        <div className="text-xs tracking-[0.18em] text-slate-400 uppercase">
                                            Program / Posisi
                                        </div>
                                        <div className="mt-2 text-lg font-semibold text-(--school-ink)">
                                            {profile.latestTracer.major ??
                                                profile.latestTracer
                                                    .occupationTitle ??
                                                'Tidak dipublikasikan'}
                                        </div>
                                    </div>
                                    <div className="rounded-2xl bg-slate-50 px-5 py-4">
                                        <div className="text-xs tracking-[0.18em] text-slate-400 uppercase">
                                            Domisili
                                        </div>
                                        <div className="mt-2 text-lg font-semibold text-(--school-ink)">
                                            {profile.latestTracer
                                                .locationCity ??
                                                profile.city ??
                                                'Tidak dipublikasikan'}
                                        </div>
                                    </div>
                                </div>
                                {profile.latestTracer.reflections && (
                                    <div className="mt-6 rounded-[1.6rem] border border-slate-100 bg-slate-50/80 p-5">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                            <Sparkles className="size-4 text-amber-500" />
                                            Refleksi
                                        </div>
                                        <p className="mt-3 text-sm leading-7 text-(--school-muted)">
                                            {profile.latestTracer.reflections}
                                        </p>
                                    </div>
                                )}
                            </BorderGlow>
                        )}

                        <section className="space-y-4">
                            <h2 className="font-heading text-2xl text-(--school-ink)">
                                Cerita & Kontribusi
                            </h2>
                            <div className="grid gap-4">
                                {profile.stories.map((story) => (
                                    <motion.div
                                        key={story.id}
                                        whileHover={{ y: -4 }}
                                        className="rounded-4xl border border-white/80 bg-white/90 p-6 shadow-[0_24px_70px_-40px_rgba(15,118,110,0.18)] backdrop-blur-xl"
                                    >
                                        <div className="text-xs font-bold tracking-[0.18em] text-emerald-600 uppercase">
                                            {story.category}
                                        </div>
                                        <Link
                                            href={story.detailUrl ?? '#'}
                                            className="mt-3 block font-heading text-xl text-(--school-ink) transition hover:text-emerald-700"
                                        >
                                            {story.title}
                                        </Link>
                                        <p className="mt-3 text-sm leading-7 text-(--school-muted)">
                                            {story.excerpt ?? story.body}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-4xl border border-white/80 bg-white/90 p-6 shadow-[0_24px_70px_-40px_rgba(15,118,110,0.18)] backdrop-blur-xl">
                            <h2 className="font-heading text-lg text-(--school-ink)">
                                Profil Singkat
                            </h2>
                            <div className="mt-5 space-y-3 text-sm text-slate-600">
                                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                                    <GraduationCap className="size-4 text-emerald-600" />{' '}
                                    Angkatan {profile.graduationYear ?? '—'}
                                </div>
                                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                                    <Briefcase className="size-4 text-sky-600" />{' '}
                                    {profile.occupationTitle ?? 'Alumni publik'}
                                </div>
                                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                                    <TrendingUp className="size-4 text-violet-600" />{' '}
                                    {profile.storyCount ?? 0} cerita
                                    dipublikasikan
                                </div>
                                {profile.locationMapUrl ? (
                                    <a
                                        href={profile.locationMapUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700"
                                    >
                                        <MapPin className="size-4 text-rose-600" />{' '}
                                        {locationLabel}
                                    </a>
                                ) : (
                                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                                        <MapPin className="size-4 text-rose-600" />{' '}
                                        {profile.city ?? 'Tidak dipublikasikan'}
                                    </div>
                                )}
                            </div>
                        </div>

                        {profile.location && (
                            <div className="overflow-hidden rounded-4xl border border-white/80 bg-white/90 shadow-[0_24px_70px_-40px_rgba(15,118,110,0.18)] backdrop-blur-xl">
                                <div className="border-b border-slate-100 px-6 py-5">
                                    <h2 className="font-heading text-lg text-(--school-ink)">
                                        Sebaran Alumni
                                    </h2>
                                    {profile.locationMapUrl && (
                                        <a
                                            href={profile.locationMapUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
                                        >
                                            <MapPin className="size-4" />
                                            Buka lokasi asli alumni
                                        </a>
                                    )}
                                </div>
                                <div className="h-72">
                                    <MapContainer
                                        center={[
                                            profile.location.latitude,
                                            profile.location.longitude,
                                        ]}
                                        zoom={9}
                                        scrollWheelZoom={false}
                                        className="h-full w-full"
                                    >
                                        <TileLayer
                                            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                                        />
                                        <Marker
                                            position={[
                                                profile.location.latitude,
                                                profile.location.longitude,
                                            ]}
                                        />
                                    </MapContainer>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
