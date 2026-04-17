import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Bookmark,
    Briefcase,
    Clock,
    GraduationCap,
    MapPin,
    MessageCircle,
    Share2,
    UserRound,
} from 'lucide-react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { BorderGlow } from '@/components/public/border-glow';
import type { ForumPost, SchoolProfilePayload } from '@/types';

type AlumniStoryPageProps = {
    school: SchoolProfilePayload;
    post: ForumPost;
    relatedPosts: ForumPost[];
};

function timeAgo(dateStr: string | null): string {
    if (!dateStr) {
        return 'baru saja';
    }

    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);

    if (hours < 1) {
        return 'baru saja';
    }

    if (hours < 24) {
        return `${hours} jam lalu`;
    }

    return `${Math.floor(hours / 24)} hari lalu`;
}

function formatLocationLabel(
    city: string | null,
    province: string | null,
    fallback = 'Lihat lokasi asli',
): string {
    return [city, province].filter(Boolean).join(', ') || fallback;
}

export default function AlumniStoryPage({
    school,
    post,
    relatedPosts,
}: AlumniStoryPageProps) {
    const siteOrigin =
        typeof window !== 'undefined' ? window.location.origin : '';
    const shareUrl = post.detailUrl ? `${siteOrigin}${post.detailUrl}` : '';
    const ogImage = siteOrigin
        ? `${siteOrigin}/images/alumni/hero.png`
        : '/images/alumni/hero.png';
    const locationLabel = formatLocationLabel(post.city, post.province);

    return (
        <>
            <Head title={`${post.title} | Alumni ${school.name}`}>
                <meta
                    name="description"
                    content={post.excerpt ?? post.body.slice(0, 160)}
                />
                {shareUrl && <link rel="canonical" href={shareUrl} />}
                <meta property="og:title" content={post.title} />
                <meta
                    property="og:description"
                    content={post.excerpt ?? post.body.slice(0, 160)}
                />
                {shareUrl && <meta property="og:url" content={shareUrl} />}
                <meta property="og:type" content="article" />
                <meta property="og:image" content={ogImage} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={post.title} />
                <meta
                    name="twitter:description"
                    content={post.excerpt ?? post.body.slice(0, 160)}
                />
                <meta name="twitter:image" content={ogImage} />
            </Head>

            <div className="space-y-10 pb-20">
                <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 px-6 py-14 text-white shadow-[0_40px_120px_-50px_rgba(15,23,42,0.6)] md:px-10 lg:px-14">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.18),transparent_35%)]" />
                    <div className="relative z-10 max-w-4xl space-y-6">
                        <div className="flex flex-wrap items-center gap-3 text-xs font-bold tracking-[0.22em] text-white/70 uppercase">
                            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">
                                Cerita Alumni
                            </span>
                            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">
                                {post.category}
                            </span>
                        </div>
                        <h1 className="font-heading text-3xl leading-tight md:text-5xl">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
                            {post.profile?.url ? (
                                <Link
                                    href={post.profile.url}
                                    className="font-semibold text-white transition hover:text-emerald-300"
                                >
                                    {post.authorName}
                                </Link>
                            ) : (
                                <span className="font-semibold text-white">
                                    {post.authorName}
                                </span>
                            )}
                            <span className="flex items-center gap-1">
                                <GraduationCap className="size-4" /> Angkatan{' '}
                                {post.graduationYear}
                            </span>
                            {post.createdAt && (
                                <span className="flex items-center gap-1">
                                    <Clock className="size-4" />{' '}
                                    {timeAgo(post.createdAt)}
                                </span>
                            )}
                            {(post.city ||
                                post.province ||
                                post.locationMapUrl) &&
                                (post.locationMapUrl ? (
                                    <a
                                        href={post.locationMapUrl}
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
                        </div>
                    </div>
                </section>

                <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
                    <BorderGlow
                        borderRadius={32}
                        colors={['#10B981', '#0EA5E9', 'transparent']}
                        className="rounded-4xl border border-white/80 bg-white/90 p-8 shadow-[0_30px_80px_-40px_rgba(15,118,110,0.25)] backdrop-blur-xl"
                    >
                        <div className="prose prose-p:text-(--school-muted) prose-p:leading-8 prose-headings:font-heading prose-headings:text-(--school-ink) max-w-none">
                            {post.body
                                .split('\n')
                                .filter(Boolean)
                                .map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                        </div>

                        {post.comments && post.comments.length > 0 && (
                            <div className="mt-10 border-t border-slate-100 pt-8">
                                <h2 className="font-heading text-xl text-(--school-ink)">
                                    Komentar Terbaru
                                </h2>
                                <div className="mt-5 space-y-4">
                                    {post.comments.map((comment) => (
                                        <div
                                            key={comment.id}
                                            className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="font-semibold text-(--school-ink)">
                                                    {comment.authorName}
                                                </div>
                                                <div className="text-xs text-slate-400">
                                                    {timeAgo(comment.createdAt)}
                                                </div>
                                            </div>
                                            <p className="mt-2 text-sm leading-7 text-(--school-muted)">
                                                {comment.body}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </BorderGlow>

                    <div className="space-y-6">
                        <div className="rounded-4xl border border-white/80 bg-white/90 p-6 shadow-[0_24px_70px_-40px_rgba(15,118,110,0.2)] backdrop-blur-xl">
                            <h2 className="font-heading text-lg text-(--school-ink)">
                                Ringkasan Cerita
                            </h2>
                            <div className="mt-5 space-y-3 text-sm text-slate-600">
                                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                                    <UserRound className="size-4 text-emerald-600" />{' '}
                                    {post.authorName}
                                </div>
                                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                                    <Briefcase className="size-4 text-sky-600" />{' '}
                                    {post.occupationTitle ??
                                        'Perjalanan alumni'}
                                </div>
                                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                                    <MessageCircle className="size-4 text-violet-600" />{' '}
                                    {post.commentsCount ?? 0} komentar
                                </div>
                                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                                    <Bookmark className="size-4 text-amber-600" />{' '}
                                    {post.bookmarksCount ?? 0} bookmark
                                </div>
                                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                                    <Share2 className="size-4 text-rose-600" />{' '}
                                    {post.shareCount ?? 0} share
                                </div>
                            </div>
                        </div>

                        {post.location && (
                            <div className="overflow-hidden rounded-4xl border border-white/80 bg-white/90 shadow-[0_24px_70px_-40px_rgba(15,118,110,0.2)] backdrop-blur-xl">
                                <div className="border-b border-slate-100 px-6 py-5">
                                    <h2 className="font-heading text-lg text-(--school-ink)">
                                        Lokasi Alumni
                                    </h2>
                                    {post.locationMapUrl && (
                                        <a
                                            href={post.locationMapUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
                                        >
                                            <MapPin className="size-4" />
                                            Buka lokasi asli pembuat cerita
                                        </a>
                                    )}
                                </div>
                                <div className="h-72">
                                    <MapContainer
                                        center={[
                                            post.location.latitude,
                                            post.location.longitude,
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
                                                post.location.latitude,
                                                post.location.longitude,
                                            ]}
                                        />
                                    </MapContainer>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {relatedPosts.length > 0 && (
                    <section className="space-y-4">
                        <h2 className="font-heading text-2xl text-(--school-ink)">
                            Cerita Terkait
                        </h2>
                        <div className="grid gap-4 lg:grid-cols-2">
                            {relatedPosts.map((relatedPost) => (
                                <motion.div
                                    key={relatedPost.id}
                                    whileHover={{ y: -4 }}
                                    className="rounded-4xl border border-white/80 bg-white/90 p-6 shadow-[0_24px_70px_-40px_rgba(15,118,110,0.18)] backdrop-blur-xl"
                                >
                                    <div className="text-xs font-bold tracking-[0.18em] text-emerald-600 uppercase">
                                        {relatedPost.category}
                                    </div>
                                    <Link
                                        href={relatedPost.detailUrl ?? '#'}
                                        className="mt-3 block font-heading text-xl text-(--school-ink) transition hover:text-emerald-700"
                                    >
                                        {relatedPost.title}
                                    </Link>
                                    <p className="mt-3 text-sm leading-7 text-(--school-muted)">
                                        {relatedPost.excerpt ??
                                            relatedPost.body}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </>
    );
}
