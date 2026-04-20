import { Head, Link, router } from '@inertiajs/react';
import {
    motion,
    useScroll,
    useTransform,
    AnimatePresence,
} from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
    Award,
    BadgeCheck,
    Bookmark,
    BookOpen,
    Briefcase,
    CalendarDays,
    Check,
    ChevronDown,
    Clock,
    Globe,
    GraduationCap,
    Heart,
    Lightbulb,
    MapPin,
    MessageCircle,
    MessageSquare,
    PenLine,
    Search,
    Send,
    Share2,
    Sparkles,
    Star,
    ThumbsUp,
    TrendingUp,
    Users,
    X,
} from 'lucide-react';
import {
    useCallback,
    useDeferredValue,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import type { FormEvent } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { alumniWriteStory } from '@/actions/App/Http/Controllers/PublicSiteController';
import {
    AlumniAngkatanChart,
    CategoryPieChart,
} from '@/components/charts/school-charts';
import { AlumniLocationPicker } from '@/components/public/alumni-location-picker';
import { AnimatedCounter } from '@/components/public/animated-counter';
import { BorderGlow } from '@/components/public/border-glow';
import { Button } from '@/components/ui/button';
import {
    ensureAlumniForumVisitorToken,
    initialAlumniStoryForm,
    persistAlumniForumVisitorToken,
} from '@/lib/alumni-story-form';
import { chartColors } from '@/lib/chart-config';
import { motionViewport, staggerContainer } from '@/lib/motion';
import { store as storeAlumniForum } from '@/routes/api/public/alumni-forum';
import { store as storeAlumniForumComment } from '@/routes/api/public/alumni-forum/comments';
import { store as storeAlumniForumReaction } from '@/routes/api/public/alumni-forum/reactions';
import {
    reverse as reverseGeocode,
    search as searchGeocode,
} from '@/routes/api/public/geocode';
import type {
    AlumniSpotlight,
    ForumPost,
    GeocodeCandidate,
    SchoolProfilePayload,
} from '@/types';

/* ═══════════════════ TYPES ═══════════════════ */

type AlumniPageProps = {
    school: SchoolProfilePayload;
    alumniSpotlight: AlumniSpotlight[];
    forumPosts: ForumPost[];
};

type ForumCategory = 'semua' | 'cerita' | 'karir' | 'kampus' | 'inspirasi';

/* ═══════════════════ HELPERS ═══════════════════ */

function getInitials(name: string): string {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();
}

function timeAgo(dateStr: string | null): string {
    if (!dateStr) {
        return 'baru saja';
    }

    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);

    if (mins < 1) {
        return 'baru saja';
    }

    if (mins < 60) {
        return `${mins} menit lalu`;
    }

    const hrs = Math.floor(mins / 60);

    if (hrs < 24) {
        return `${hrs} jam lalu`;
    }

    const days = Math.floor(hrs / 24);

    if (days < 30) {
        return `${days} hari lalu`;
    }

    const months = Math.floor(days / 30);

    return `${months} bulan lalu`;
}

function formatLocationLabel(
    city: string | null,
    province: string | null,
    fallback = 'Lihat lokasi asli',
): string {
    return [city, province].filter(Boolean).join(', ') || fallback;
}

function hasGeoLocation(
    thread: ForumPost,
): thread is ForumPost & { location: { latitude: number; longitude: number } } {
    return (
        Number.isFinite(thread.location?.latitude) &&
        Number.isFinite(thread.location?.longitude)
    );
}

const avatarGradients = [
    'from-emerald-500 to-emerald-700',
    'from-sky-500 to-sky-700',
    'from-violet-500 to-violet-700',
    'from-rose-500 to-rose-700',
    'from-amber-500 to-amber-700',
    'from-indigo-500 to-indigo-700',
    'from-teal-500 to-teal-700',
    'from-fuchsia-500 to-fuchsia-700',
    'from-cyan-500 to-cyan-700',
];

const forumCategories: {
    key: ForumCategory;
    label: string;
    icon: typeof MessageSquare;
    color: string;
}[] = [
    {
        key: 'semua',
        label: 'Semua',
        icon: MessageSquare,
        color: 'text-slate-600',
    },
    {
        key: 'cerita',
        label: 'Cerita Alumni',
        icon: BookOpen,
        color: 'text-emerald-600',
    },
    {
        key: 'karir',
        label: 'Karir & Profesi',
        icon: Briefcase,
        color: 'text-sky-600',
    },
    {
        key: 'kampus',
        label: 'Jejak Kampus',
        icon: GraduationCap,
        color: 'text-violet-600',
    },
    {
        key: 'inspirasi',
        label: 'Inspirasi',
        icon: Star,
        color: 'text-amber-600',
    },
];

/* ═══════════════════ FORM INITIAL STATE ═══════════════════ */

/* ═══════════════════ COMPONENT: THREAD CARD ═══════════════════ */

function ThreadCard({
    thread,
    index,
    onReact,
    onCommentSubmit,
}: {
    thread: ForumPost;
    index: number;
    onReact: (
        thread: ForumPost,
        reactionType: 'like' | 'bookmark' | 'share' | 'report',
        reason?: string,
    ) => Promise<void>;
    onCommentSubmit: (
        thread: ForumPost,
        payload: { author_name: string; body: string },
    ) => Promise<void>;
}) {
    const [showComments, setShowComments] = useState(false);
    const [commentAuthor, setCommentAuthor] = useState('');
    const [commentBody, setCommentBody] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const catInfo =
        forumCategories.find((c) => c.key === thread.category) ??
        forumCategories[0];
    const CatIcon = catInfo.icon;
    const isReal = thread.id > 0;
    const mentorshipEnabled = thread.isOpenToMentor ?? thread.mentorshipBadge;
    const hiringEnabled = thread.hasHiringInfo ?? thread.hiringBadge;
    const locationLabel = formatLocationLabel(thread.city, thread.province);

    const glowColors =
        thread.category === 'karir'
            ? ['#0EA5E9', 'transparent', '#1D4ED8']
            : thread.category === 'cerita'
              ? ['#10B981', 'transparent', '#047857']
              : thread.category === 'kampus'
                ? ['#8B5CF6', 'transparent', '#5B21B6']
                : ['#F59E0B', 'transparent', '#B45309'];

    const comments = thread.comments ?? [];

    const handleCommentSubmit = useCallback(async () => {
        if (!isReal || !commentAuthor.trim() || !commentBody.trim()) {
            return;
        }

        setIsSubmittingComment(true);

        try {
            await onCommentSubmit(thread, {
                author_name: commentAuthor.trim(),
                body: commentBody.trim(),
            });
            setCommentBody('');
        } catch {
            // handled at page level
        } finally {
            setIsSubmittingComment(false);
        }
    }, [commentAuthor, commentBody, isReal, onCommentSubmit, thread]);

    const handleShare = useCallback(async () => {
        if (!isReal || !thread.detailUrl) {
            return;
        }

        const shareUrl = `${window.location.origin}${thread.detailUrl}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: thread.title,
                    text: thread.excerpt ?? thread.body,
                    url: shareUrl,
                });
            } catch {
                // no-op: user cancelled native share sheet
            }
        } else if (navigator.clipboard) {
            await navigator.clipboard.writeText(shareUrl);
        }

        await onReact(thread, 'share');
    }, [isReal, onReact, thread]);

    const handleReport = useCallback(async () => {
        if (!isReal) {
            return;
        }

        const reason = window.prompt('Alasan pelaporan (opsional):', '') ?? '';
        await onReact(
            thread,
            'report',
            reason.trim() === '' ? undefined : reason.trim(),
        );
    }, [isReal, onReact, thread]);

    return (
        <motion.article
            layout
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            whileHover={{ x: 4, scale: 1.01 }}
            className="group"
        >
            <BorderGlow
                borderRadius={32}
                colors={glowColors}
                className="relative overflow-hidden rounded-4xl border border-white/60 bg-white/70 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.1)] backdrop-blur-xl transition-all duration-500 hover:border-white/90 hover:bg-white hover:shadow-[0_30px_60px_-20px_rgba(15,118,110,0.15)]"
            >
                <div
                    className="pointer-events-none absolute -top-20 -left-20 size-48 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-10"
                    style={{ backgroundColor: glowColors[0] }}
                />

                <div className="relative p-7 md:p-8">
                    <div className="flex gap-4 md:gap-5">
                        <div className="shrink-0">
                            <div
                                className={`relative flex size-14 items-center justify-center rounded-2xl bg-linear-to-br ${avatarGradients[index % avatarGradients.length]} text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3`}
                            >
                                <span className="font-heading text-[1.1rem] font-bold tracking-wider">
                                    {getInitials(thread.authorName)}
                                </span>
                                {(thread.profile?.isVerified ||
                                    thread.isVerified) && (
                                    <div className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-white shadow-md">
                                        <BadgeCheck className="size-5 text-blue-500" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="min-w-0 flex-1 space-y-2.5">
                            <div className="flex flex-wrap items-center gap-2">
                                <span
                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.6rem] font-extrabold tracking-[0.15em] uppercase shadow-sm backdrop-blur-md ${thread.category === 'karir' ? 'border border-sky-200 bg-sky-50/80 text-sky-700' : thread.category === 'kampus' ? 'border border-violet-200 bg-violet-50/80 text-violet-700' : thread.category === 'cerita' ? 'border border-emerald-200 bg-emerald-50/80 text-emerald-700' : 'border border-amber-200 bg-amber-50/80 text-amber-700'}`}
                                >
                                    <CatIcon className="size-3" />{' '}
                                    {catInfo.label}
                                </span>

                                {mentorshipEnabled && (
                                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200/80 bg-linear-to-r from-amber-100 to-amber-50 px-2 py-1 text-[0.6rem] font-extrabold tracking-wider text-amber-700 uppercase shadow-sm transition-transform hover:scale-105">
                                        <Star className="size-3 fill-amber-500 text-amber-500" />{' '}
                                        Open to Mentor
                                    </span>
                                )}

                                {hiringEnabled && (
                                    <span className="inline-flex items-center gap-1 rounded-full border border-rose-200/80 bg-linear-to-r from-rose-100 to-rose-50 px-2 py-1 text-[0.6rem] font-extrabold tracking-wider text-rose-700 uppercase shadow-sm transition-transform hover:scale-105">
                                        <Briefcase className="size-3 text-rose-600" />{' '}
                                        Hiring Info
                                    </span>
                                )}

                                {thread.createdAt && (
                                    <span className="ml-auto flex items-center gap-1 text-[0.65rem] font-semibold text-slate-400">
                                        <Clock className="size-3" />
                                        {timeAgo(thread.createdAt)}
                                    </span>
                                )}
                            </div>

                            {thread.detailUrl ? (
                                <Link href={thread.detailUrl} className="block">
                                    <h3 className="font-heading text-lg leading-snug font-bold text-(--school-ink) transition-colors group-hover:text-emerald-700 md:text-xl">
                                        {thread.title}
                                    </h3>
                                </Link>
                            ) : (
                                <h3 className="font-heading text-lg leading-snug font-bold text-(--school-ink) transition-colors group-hover:text-emerald-700 md:text-xl">
                                    {thread.title}
                                </h3>
                            )}

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.8rem]">
                                {thread.profile?.url ? (
                                    <Link
                                        href={thread.profile.url}
                                        className="font-bold text-(--school-ink) drop-shadow-sm transition hover:text-emerald-700"
                                    >
                                        {thread.authorName}
                                    </Link>
                                ) : (
                                    <span className="font-bold text-(--school-ink) drop-shadow-sm">
                                        {thread.authorName}
                                    </span>
                                )}
                                <span className="flex items-center gap-1 font-semibold text-slate-500">
                                    <GraduationCap className="size-3.5 text-emerald-500" />{' '}
                                    Angkatan {thread.graduationYear}
                                </span>
                                {(thread.city ||
                                    thread.province ||
                                    thread.locationMapUrl) &&
                                    (thread.locationMapUrl ? (
                                        <a
                                            href={thread.locationMapUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-1 font-semibold text-slate-500 transition hover:text-rose-500"
                                        >
                                            <MapPin className="size-3.5 text-rose-400 transition group-hover:text-rose-500" />{' '}
                                            {locationLabel}
                                        </a>
                                    ) : (
                                        <span className="flex items-center gap-1 font-semibold text-slate-500">
                                            <MapPin className="size-3.5 text-rose-400" />{' '}
                                            {locationLabel}
                                        </span>
                                    ))}
                            </div>

                            <p className="pt-1 text-sm leading-[1.7] text-slate-600">
                                {thread.excerpt ?? thread.body}
                            </p>

                            {thread.occupationTitle && (
                                <div className="mt-2 inline-flex items-center gap-2 rounded-xl border border-slate-200/60 bg-white px-3 py-2 shadow-sm">
                                    <Briefcase className="size-4 text-emerald-600" />
                                    <span className="text-xs font-bold text-slate-700">
                                        {thread.occupationTitle}
                                    </span>
                                    {thread.institutionName && (
                                        <>
                                            <span className="text-slate-300">
                                                •
                                            </span>
                                            <span className="text-xs font-semibold text-slate-500">
                                                {thread.institutionName}
                                            </span>
                                        </>
                                    )}
                                </div>
                            )}

                            <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
                                <button
                                    type="button"
                                    disabled={!isReal}
                                    onClick={() => void onReact(thread, 'like')}
                                    className={`group/btn flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${thread.viewerState?.liked ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500 hover:bg-rose-50 hover:text-rose-600'} ${!isReal ? 'cursor-default opacity-70' : ''}`}
                                >
                                    <Heart
                                        className={`size-4 transition-transform group-hover/btn:scale-110 ${thread.viewerState?.liked ? 'fill-current' : ''}`}
                                    />
                                    {thread.likesCount} Suka
                                </button>
                                <button
                                    onClick={() =>
                                        setShowComments(!showComments)
                                    }
                                    type="button"
                                    className={`group/btn flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${showComments ? 'bg-sky-50 text-sky-600' : 'bg-slate-50 text-slate-500 hover:bg-sky-50 hover:text-sky-600'}`}
                                >
                                    <MessageCircle className="size-4 transition-transform group-hover/btn:scale-110" />
                                    {thread.commentsCount ?? comments.length}{' '}
                                    Komentar
                                </button>
                                <span className="ml-auto hidden items-center gap-1 text-xs font-semibold text-slate-400 sm:flex">
                                    <Users className="size-3.5" />
                                    {thread.viewsCount} dilihat
                                </span>
                                <div className="ml-auto flex items-center gap-1 sm:ml-0">
                                    <button
                                        type="button"
                                        disabled={!isReal}
                                        onClick={() =>
                                            void onReact(thread, 'bookmark')
                                        }
                                        className={`rounded-full p-2 transition ${thread.viewerState?.bookmarked ? 'bg-amber-50 text-amber-500' : 'text-slate-400 hover:bg-slate-100 hover:text-amber-500'} ${!isReal ? 'cursor-default opacity-70' : ''}`}
                                    >
                                        <Bookmark
                                            className={`size-4 ${thread.viewerState?.bookmarked ? 'fill-current' : ''}`}
                                        />
                                    </button>
                                    <button
                                        type="button"
                                        disabled={!isReal}
                                        onClick={() => void handleShare()}
                                        className={`rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-violet-500 ${!isReal ? 'cursor-default opacity-70' : ''}`}
                                    >
                                        <Share2 className="size-4" />
                                    </button>
                                    <button
                                        type="button"
                                        disabled={
                                            !isReal ||
                                            thread.viewerState?.reported
                                        }
                                        onClick={() => void handleReport()}
                                        className={`rounded-full p-2 transition ${thread.viewerState?.reported ? 'bg-rose-50 text-rose-600' : 'text-slate-400 hover:bg-slate-100 hover:text-rose-500'} ${!isReal ? 'cursor-default opacity-70' : ''}`}
                                    >
                                        <Award className="size-4" />
                                    </button>
                                </div>
                            </div>

                            <AnimatePresence>
                                {showComments && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-3 overflow-hidden"
                                    >
                                        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 shadow-inner">
                                            <div className="space-y-4">
                                                {comments.length > 0 ? (
                                                    comments.map((comment) => (
                                                        <div
                                                            key={comment.id}
                                                            className="flex gap-3"
                                                        >
                                                            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-500">
                                                                {getInitials(
                                                                    comment.authorName,
                                                                )}
                                                            </div>
                                                            <div className="flex-1 space-y-1">
                                                                <div className="flex items-baseline gap-2">
                                                                    <span className="text-xs font-bold text-slate-700">
                                                                        {
                                                                            comment.authorName
                                                                        }
                                                                    </span>
                                                                    <span className="text-[10px] font-semibold text-slate-400">
                                                                        {timeAgo(
                                                                            comment.createdAt,
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs leading-relaxed text-slate-600">
                                                                    {
                                                                        comment.body
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="rounded-xl border border-dashed border-slate-200 bg-white/80 px-4 py-5 text-xs text-slate-500">
                                                        Belum ada komentar. Jadi
                                                        yang pertama memulai
                                                        diskusi.
                                                    </div>
                                                )}
                                            </div>

                                            {isReal && (
                                                <div className="mt-4 grid gap-3">
                                                    <input
                                                        type="text"
                                                        value={commentAuthor}
                                                        onChange={(event) =>
                                                            setCommentAuthor(
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                        placeholder="Nama kamu"
                                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-700 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                                                    />
                                                    <div className="flex items-center gap-3">
                                                        <textarea
                                                            value={commentBody}
                                                            onChange={(event) =>
                                                                setCommentBody(
                                                                    event.target
                                                                        .value,
                                                                )
                                                            }
                                                            rows={2}
                                                            placeholder="Tulis komentar yang relevan dan sopan..."
                                                            className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-700 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                                                        />
                                                        <button
                                                            type="button"
                                                            disabled={
                                                                isSubmittingComment ||
                                                                !commentAuthor.trim() ||
                                                                !commentBody.trim()
                                                            }
                                                            onClick={() =>
                                                                void handleCommentSubmit()
                                                            }
                                                            className="rounded-full bg-emerald-500 p-3 text-white shadow-sm transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
                                                        >
                                                            <Send className="size-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </BorderGlow>
        </motion.article>
    );
}

/* ═══════════════════ COMPONENT: TRACER MAP (LEAFLET) ═══════════════════ */

function TracerRadar({ threads }: { threads: ForumPost[] }) {
    const locations = threads.filter(hasGeoLocation);

    // Default center to Indonesia: [ -0.789275, 113.921327 ]
    const defaultCenter: [number, number] = [-0.789275, 113.921327];

    const createCustomIcon = (name: string, index: number) => {
        const initials = getInitials(name);
        const gradientClass = avatarGradients[index % avatarGradients.length];

        return L.divIcon({
            className: 'custom-leaflet-marker',
            html: `
                <div class="group relative flex size-10 items-center justify-center">
                    <div class="absolute inset-0 animate-ping rounded-full bg-emerald-500 opacity-40 hover:opacity-0 transition-opacity"></div>
                    <div class="relative flex size-10 items-center justify-center rounded-xl bg-linear-to-br ${gradientClass} text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] border-2 border-white transition-transform duration-300 hover:scale-110 hover:rotate-3">
                        <span class="font-heading text-sm font-bold tracking-wider">${initials}</span>
                        <div class="absolute -bottom-1 -right-1 size-3.5 rounded-full border-2 border-white bg-emerald-500"></div>
                    </div>
                </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 20],
            popupAnchor: [0, -20],
        });
    };

    return (
        <BorderGlow
            borderRadius={32}
            colors={['#10B981', 'transparent', '#3B82F6']}
            className="group relative col-span-1 cursor-default overflow-hidden rounded-4xl border border-white/60 bg-white p-4 shadow-[0_20px_60px_-20px_rgba(15,118,110,0.2)] transition-all duration-500 md:p-6 lg:col-span-2"
        >
            <div className="pointer-events-none absolute -bottom-20 -left-20 size-64 rounded-full bg-emerald-500/10 blur-[5rem]" />

            {/* Header Radar Info */}
            <div className="relative mb-5 flex items-center justify-between px-2">
                <div>
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 shadow-sm">
                        <MapPin className="size-3.5 text-emerald-600" />
                        <span className="text-[0.6rem] font-extrabold tracking-widest text-emerald-700 uppercase">
                            Tracer Geospasial Interaktif
                        </span>
                    </div>
                    <h3 className="mt-2 font-heading text-xl font-bold text-slate-800">
                        Peta Sebaran Alumni Lintas Generasi
                    </h3>
                </div>
                <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-sm sm:flex">
                    <div className="size-2 animate-pulse rounded-full bg-emerald-500" />
                    Menangkap {locations.length} Lokasi
                </div>
            </div>

            {/* Map Container */}
            <div className="relative z-10 h-100 w-full overflow-hidden rounded-2xl border border-slate-200 shadow-inner md:h-125">
                {typeof window !== 'undefined' && (
                    <MapContainer
                        center={defaultCenter}
                        zoom={5}
                        scrollWheelZoom={false}
                        className="z-0 h-full w-full bg-slate-50"
                    >
                        {/* A very clean, advanced Voyager or CartoDB Positron theme map tile for that 'Premium minimal' look */}
                        <TileLayer
                            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        />

                        {locations.map((t, i) => (
                            <Marker
                                key={t.id}
                                position={[
                                    t.location.latitude,
                                    t.location.longitude,
                                ]}
                                icon={createCustomIcon(t.authorName, i)}
                            >
                                <Popup className="modern-popup" minWidth={220}>
                                    <div className="flex w-full flex-col gap-1 font-sans">
                                        <div className="mb-2 flex items-center gap-3 border-b border-slate-100 pb-3">
                                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-emerald-700 text-sm font-bold text-white shadow-md">
                                                {getInitials(t.authorName)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="truncate text-sm font-bold text-slate-800">
                                                    {t.authorName}
                                                </h4>
                                                <p className="mt-0.5 text-[10px] font-extrabold tracking-wider text-emerald-600 uppercase">
                                                    Alumni {t.graduationYear}
                                                </p>
                                            </div>
                                        </div>
                                        {t.occupationTitle && (
                                            <div className="mt-1 mb-1 flex items-start gap-1.5 text-xs text-slate-600">
                                                <Briefcase className="mt-px size-3.5 shrink-0 text-emerald-500" />
                                                <span className="leading-snug font-bold text-slate-700">
                                                    {t.occupationTitle} <br />{' '}
                                                    <span className="font-semibold text-slate-400">
                                                        {t.institutionName}
                                                    </span>
                                                </span>
                                            </div>
                                        )}
                                        {(t.city ||
                                            t.province ||
                                            t.locationMapUrl) &&
                                            (t.locationMapUrl ? (
                                                <a
                                                    href={t.locationMapUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="mt-1 flex items-center gap-1.5 text-xs text-slate-600 transition hover:text-emerald-600"
                                                >
                                                    <MapPin className="size-3.5 shrink-0 text-emerald-500" />
                                                    <span className="font-semibold text-slate-500 transition hover:text-emerald-600">
                                                        {formatLocationLabel(
                                                            t.city,
                                                            t.province,
                                                            'Lihat lokasi alumni',
                                                        )}
                                                    </span>
                                                </a>
                                            ) : (
                                                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
                                                    <MapPin className="size-3.5 shrink-0 text-emerald-500" />
                                                    <span className="font-semibold text-slate-500">
                                                        {formatLocationLabel(
                                                            t.city,
                                                            t.province,
                                                            'Lokasi alumni',
                                                        )}
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                )}
            </div>

            {/* Custom CSS overrides for Leaflet popup */}
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                .modern-popup .leaflet-popup-content-wrapper {
                    border-radius: 20px;
                    box-shadow: 0 10px 40px -10px rgba(0,0,0,0.15);
                    border: 1px solid rgba(226, 232, 240, 0.8);
                    padding: 0;
                    overflow: hidden;
                }
                .modern-popup .leaflet-popup-content {
                    margin: 16px;
                }
                .modern-popup .leaflet-popup-tip-container {
                    display: none;
                }
                .custom-leaflet-marker {
                    background: transparent;
                    border: none;
                }
                .leaflet-grab {
                    cursor: grab;
                }
                .leaflet-dragging .leaflet-grab{
                    cursor: grabbing;
                }
            `,
                }}
            />
        </BorderGlow>
    );
}

/* ═══════════════════ MAIN COMPONENT ═══════════════════ */

export default function AlumniPage({
    school,
    alumniSpotlight,
    forumPosts,
}: AlumniPageProps) {
    const siteOrigin =
        typeof window !== 'undefined' ? window.location.origin : '';
    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
    const ogImage = siteOrigin
        ? `${siteOrigin}/images/alumni/hero.png`
        : '/images/alumni/hero.png';
    const heroRef = useRef<HTMLDivElement>(null);
    const visitorTokenRef = useRef('');
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    const [liveForumPosts, setLiveForumPosts] = useState(forumPosts);
    const [activeCategory, setActiveCategory] =
        useState<ForumCategory>('semua');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'terbaru' | 'populer'>('terbaru');
    const [selectedYear, setSelectedYear] = useState<string>('semua');
    const [selectedCity, setSelectedCity] = useState<string>('semua');
    const [selectedInstitution, setSelectedInstitution] =
        useState<string>('semua');
    const [selectedOccupation, setSelectedOccupation] =
        useState<string>('semua');
    const [showWriteModal, setShowWriteModal] = useState(false);
    const [formData, setFormData] = useState(initialAlumniStoryForm);
    const [formStep, setFormStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<{
        success: boolean;
        message: string;
    } | null>(null);
    const [locationResults, setLocationResults] = useState<GeocodeCandidate[]>(
        [],
    );
    const [isLocationLoading, setIsLocationLoading] = useState(false);
    const [isUsingCurrentLocation, setIsUsingCurrentLocation] = useState(false);
    const deferredLocationQuery = useDeferredValue(formData.location_query);
    const suppressLocationSearchRef = useRef<string | null>(null);
    const reverseGeocodeControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        setLiveForumPosts(forumPosts);
    }, [forumPosts]);

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
                    throw new Error('Gagal mencari lokasi');
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

    // Merge spotlight alumni (as legacy posts) + real forum posts
    const allThreads = useMemo(() => {
        const spotlightThreads: ForumPost[] = alumniSpotlight.map((a) => ({
            id: a.id * -1, // negative to avoid ID collision
            slug: a.slug ?? undefined,
            detailUrl: undefined,
            authorName: a.fullName,
            graduationYear: a.graduationYear,
            category: a.occupationTitle
                ? 'karir'
                : a.institutionName
                  ? 'kampus'
                  : a.bio
                    ? 'cerita'
                    : ('inspirasi' as ForumPost['category']),
            title:
                a.occupationTitle && a.institutionName
                    ? `Perjalanan saya sebagai ${a.occupationTitle} di ${a.institutionName}`
                    : a.occupationTitle
                      ? `Bagaimana saya menjadi ${a.occupationTitle} setelah lulus`
                      : a.institutionName
                        ? `Pengalaman kuliah di ${a.institutionName}`
                        : `Cerita alumni angkatan ${a.graduationYear}`,
            excerpt:
                a.bio ??
                `Berbagi pengalaman dari alumni SMAN 1 Tenjo angkatan ${a.graduationYear}.`,
            body:
                a.bio ??
                `Berbagi pengalaman dari alumni SMAN 1 Tenjo angkatan ${a.graduationYear}.`,
            institutionName: a.institutionName,
            occupationTitle: a.occupationTitle,
            city: a.city,
            province: a.province,
            likesCount: 12 + ((a.id * 7) % 88),
            viewsCount: 50 + ((a.id * 11) % 450),
            commentsCount: 0,
            bookmarksCount: 0,
            shareCount: 0,
            isFeatured: false,
            createdAt: null,
            isVerified: a.isVerified,
            mentorshipBadge: a.mentorshipBadge,
            hiringBadge: a.hiringBadge,
            location: a.location ?? null,
            locationMapUrl: a.locationMapUrl ?? null,
            profile: {
                id: a.id,
                slug: a.slug ?? null,
                url: a.url ?? null,
                fullName: a.fullName,
                graduationYear: a.graduationYear,
                institutionName: a.institutionName,
                occupationTitle: a.occupationTitle,
                city: a.city,
                province: a.province,
                bio: a.bio,
                isVerified: a.isVerified,
                mentorshipBadge: a.mentorshipBadge,
                hiringBadge: a.hiringBadge,
                storyCount: a.storyCount,
                location: a.location ?? null,
                locationMapUrl: a.locationMapUrl ?? null,
            },
            comments: [],
            viewerState: {
                liked: false,
                bookmarked: false,
                reported: false,
                shared: false,
            },
        }));

        return [...liveForumPosts, ...spotlightThreads];
    }, [alumniSpotlight, liveForumPosts]);

    const filterOptions = useMemo(
        () => ({
            years: Array.from(
                new Set(
                    allThreads.map((thread) => String(thread.graduationYear)),
                ),
            ).sort((a, b) => Number(b) - Number(a)),
            cities: Array.from(
                new Set(
                    allThreads
                        .map((thread) => thread.city)
                        .filter(Boolean) as string[],
                ),
            ).sort(),
            institutions: Array.from(
                new Set(
                    allThreads
                        .map((thread) => thread.institutionName)
                        .filter(Boolean) as string[],
                ),
            ).sort(),
            occupations: Array.from(
                new Set(
                    allThreads
                        .map((thread) => thread.occupationTitle)
                        .filter(Boolean) as string[],
                ),
            ).sort(),
        }),
        [allThreads],
    );

    const filteredThreads = useMemo(() => {
        let result = allThreads;

        if (activeCategory !== 'semua') {
            result = result.filter(
                (thread) => thread.category === activeCategory,
            );
        }

        if (selectedYear !== 'semua') {
            result = result.filter(
                (thread) => String(thread.graduationYear) === selectedYear,
            );
        }

        if (selectedCity !== 'semua') {
            result = result.filter((thread) => thread.city === selectedCity);
        }

        if (selectedInstitution !== 'semua') {
            result = result.filter(
                (thread) => thread.institutionName === selectedInstitution,
            );
        }

        if (selectedOccupation !== 'semua') {
            result = result.filter(
                (thread) => thread.occupationTitle === selectedOccupation,
            );
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (thread) =>
                    thread.authorName.toLowerCase().includes(q) ||
                    thread.title.toLowerCase().includes(q) ||
                    thread.body.toLowerCase().includes(q) ||
                    (thread.city?.toLowerCase().includes(q) ?? false) ||
                    (thread.province?.toLowerCase().includes(q) ?? false) ||
                    (thread.institutionName?.toLowerCase().includes(q) ??
                        false) ||
                    (thread.occupationTitle?.toLowerCase().includes(q) ??
                        false),
            );
        }

        if (sortBy === 'populer') {
            return [...result].sort(
                (a, b) =>
                    b.likesCount +
                    (b.commentsCount ?? 0) +
                    (b.shareCount ?? 0) -
                    (a.likesCount +
                        (a.commentsCount ?? 0) +
                        (a.shareCount ?? 0)),
            );
        }

        return [...result].sort((a, b) => {
            const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

            if (timeA === timeB) {
                return b.graduationYear - a.graduationYear;
            }

            return timeB - timeA;
        });
    }, [
        activeCategory,
        allThreads,
        searchQuery,
        selectedCity,
        selectedInstitution,
        selectedOccupation,
        selectedYear,
        sortBy,
    ]);

    const totalLikes = allThreads.reduce((s, t) => s + t.likesCount, 0);
    const uniqueYears = new Set(allThreads.map((t) => t.graduationYear)).size;

    const featuredThread =
        filteredThreads.find((t) => t.isFeatured) ??
        (filteredThreads.length > 0
            ? filteredThreads.reduce((best, current) =>
                  current.likesCount + (current.commentsCount ?? 0) >
                  best.likesCount + (best.commentsCount ?? 0)
                      ? current
                      : best,
              )
            : null);

    // Form handlers
    const updateField = useCallback(
        (
            field: keyof typeof initialAlumniStoryForm,
            value: string | boolean,
        ) => {
            setFormData((prev) => ({ ...prev, [field]: value }));
        },
        [],
    );

    const replaceForumPost = useCallback((post: ForumPost) => {
        setLiveForumPosts((prev) => {
            const exists = prev.some((item) => item.id === post.id);
            const next = exists
                ? prev.map((item) => (item.id === post.id ? post : item))
                : [post, ...prev];

            return [...next].sort((a, b) => {
                const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

                return timeB - timeA;
            });
        });
    }, []);

    const applyLocationCandidate = useCallback(
        (candidate: GeocodeCandidate) => {
            suppressLocationSearchRef.current = candidate.displayName;
            setFormData((prev) => ({
                ...prev,
                location_query: candidate.displayName,
                city: candidate.address.city ?? prev.city,
                province: candidate.address.province ?? prev.province,
                latitude: String(candidate.latitude),
                longitude: String(candidate.longitude),
            }));
            setLocationResults([]);
        },
        [],
    );

    const applyCoordinateSelection = useCallback(
        (latitude: number | '', longitude: number | '') => {
            setFormData((prev) => ({
                ...prev,
                latitude:
                    latitude === ''
                        ? ''
                        : Number.isFinite(latitude)
                          ? latitude.toFixed(6)
                          : prev.latitude,
                longitude:
                    longitude === ''
                        ? ''
                        : Number.isFinite(longitude)
                          ? longitude.toFixed(6)
                          : prev.longitude,
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
                setFormData((prev) => ({
                    ...prev,
                    location_query: result.displayName,
                    city: result.address.city ?? prev.city,
                    province: result.address.province ?? prev.province,
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

    const handleForumReaction = useCallback(
        async (
            thread: ForumPost,
            reactionType: 'like' | 'bookmark' | 'share' | 'report',
            reason?: string,
        ) => {
            try {
                if (thread.id <= 0) {
                    return;
                }

                const response = await fetch(
                    storeAlumniForumReaction.url({ post: thread.id }),
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                            'X-Alumni-Visitor': visitorTokenRef.current,
                        },
                        body: JSON.stringify({
                            reaction_type: reactionType,
                            reason,
                        }),
                    },
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ?? 'Gagal memperbarui interaksi.',
                    );
                }

                if (data.visitorToken) {
                    visitorTokenRef.current = data.visitorToken;
                    persistAlumniForumVisitorToken(data.visitorToken);
                }

                replaceForumPost(data.post as ForumPost);
            } catch (error) {
                setSubmitResult({
                    success: false,
                    message:
                        error instanceof Error
                            ? error.message
                            : 'Interaksi forum tidak berhasil diproses.',
                });
            }
        },
        [replaceForumPost],
    );

    const handleCommentSubmit = useCallback(
        async (
            thread: ForumPost,
            payload: { author_name: string; body: string },
        ) => {
            try {
                if (thread.id <= 0) {
                    return;
                }

                const response = await fetch(
                    storeAlumniForumComment.url({ post: thread.id }),
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                            'X-Alumni-Visitor': visitorTokenRef.current,
                        },
                        body: JSON.stringify(payload),
                    },
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message ?? 'Gagal mengirim komentar.');
                }

                if (data.visitorToken) {
                    visitorTokenRef.current = data.visitorToken;
                    persistAlumniForumVisitorToken(data.visitorToken);
                }

                replaceForumPost(data.post as ForumPost);
            } catch (error) {
                setSubmitResult({
                    success: false,
                    message:
                        error instanceof Error
                            ? error.message
                            : 'Komentar tidak berhasil dikirim.',
                });

                throw error;
            }
        },
        [replaceForumPost],
    );

    const handleSubmit = useCallback(
        async (e: FormEvent) => {
            e.preventDefault();
            setIsSubmitting(true);
            setSubmitResult(null);

            try {
                const res = await fetch(storeAlumniForum.url(), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-Alumni-Visitor': visitorTokenRef.current,
                    },
                    body: JSON.stringify({
                        ...formData,
                        graduation_year: parseInt(formData.graduation_year, 10),
                        latitude: formData.latitude
                            ? Number(formData.latitude)
                            : null,
                        longitude: formData.longitude
                            ? Number(formData.longitude)
                            : null,
                    }),
                });

                const data = await res.json();

                if (res.ok) {
                    if (data.visitorToken) {
                        visitorTokenRef.current = data.visitorToken;
                        persistAlumniForumVisitorToken(data.visitorToken);
                    }

                    setSubmitResult({ success: true, message: data.message });

                    if (
                        (data.post as ForumPost).moderationStatus === 'approved'
                    ) {
                        replaceForumPost(data.post as ForumPost);
                    }

                    setLocationResults([]);
                    setFormData(initialAlumniStoryForm);
                    setFormStep(1);

                    setTimeout(() => {
                        setShowWriteModal(false);
                        setSubmitResult(null);
                        router.reload({
                            only: ['forumPosts', 'alumniSpotlight'],
                        });
                    }, 1500);
                } else {
                    const errors = data.errors
                        ? Object.values(data.errors).flat().join(' ')
                        : (data.message ?? 'Terjadi kesalahan.');
                    setSubmitResult({
                        success: false,
                        message: errors as string,
                    });
                }
            } catch {
                setSubmitResult({
                    success: false,
                    message: 'Gagal mengirim. Periksa koneksi internet Anda.',
                });
            } finally {
                setIsSubmitting(false);
            }
        },
        [formData, replaceForumPost],
    );

    const isStep1Valid =
        formData.author_name && formData.graduation_year && formData.category;
    const isStep2Valid = formData.title && formData.body;

    return (
        <>
            <Head title="Forum Alumni">
                <meta
                    name="description"
                    content={`Forum Alumni ${school.name} — ruang cerita, diskusi, dan koneksi para lulusan.`}
                />
                {pageUrl && <link rel="canonical" href={pageUrl} />}
                <meta
                    property="og:title"
                    content={`Forum Alumni ${school.name}`}
                />
                <meta
                    property="og:description"
                    content={`Forum Alumni ${school.name} — ruang cerita, diskusi, dan koneksi para lulusan.`}
                />
                {pageUrl && <meta property="og:url" content={pageUrl} />}
                <meta property="og:type" content="website" />
                <meta property="og:image" content={ogImage} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content={`Forum Alumni ${school.name}`}
                />
                <meta
                    name="twitter:description"
                    content={`Forum Alumni ${school.name} — ruang cerita, diskusi, dan koneksi para lulusan.`}
                />
                <meta name="twitter:image" content={ogImage} />
            </Head>

            <div className="space-y-10 pb-16 lg:space-y-12">
                {/* ═══════════════════ HERO ═══════════════════ */}
                <motion.section
                    ref={heroRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative right-1/2 left-1/2 -mt-8 -mr-[50vw] -ml-[50vw] h-[75vh] w-screen overflow-hidden bg-slate-900 md:-mt-10 lg:h-[80dvh]"
                >
                    <motion.div
                        className="absolute inset-0 z-0"
                        style={{ y: heroY }}
                    >
                        <div className="absolute inset-0">
                            <img
                                src="/images/sekolah/murid_belajar.jpg"
                                alt="Alumni SMAN 1 Tenjo"
                                className="h-full w-full object-cover object-center opacity-25 mix-blend-luminosity"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/70 to-transparent" />
                            <div className="absolute inset-0 bg-linear-to-r from-slate-900/80 via-slate-900/50 to-transparent" />
                        </div>
                        <div className="absolute top-1/4 -left-20 size-125 rounded-full bg-violet-500/12 blur-[140px]" />
                        <div className="absolute top-1/3 right-0 size-100 rounded-full bg-amber-500/10 blur-[120px]" />
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04] mix-blend-overlay" />
                    </motion.div>

                    <motion.div
                        className="relative z-10 flex h-full items-end pb-20 lg:pb-28"
                        style={{ opacity: heroOpacity }}
                    >
                        <div className="mx-auto w-full max-w-7xl px-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="mb-6 flex flex-wrap items-center gap-3"
                            >
                                <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 backdrop-blur-md">
                                    <MessageSquare className="size-4 text-violet-400" />
                                    <span className="text-[0.65rem] font-bold tracking-[0.2em] text-violet-300 uppercase">
                                        Forum Alumni
                                    </span>
                                </div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 backdrop-blur-md">
                                    <Users className="size-4 text-amber-400" />
                                    <span className="text-[0.65rem] font-bold tracking-[0.2em] text-amber-300 uppercase">
                                        {allThreads.length} Cerita
                                    </span>
                                </div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 backdrop-blur-md">
                                    <TrendingUp className="size-4 text-emerald-400" />
                                    <span className="text-[0.65rem] font-bold tracking-[0.2em] text-emerald-300 uppercase">
                                        {uniqueYears} Angkatan
                                    </span>
                                </div>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="max-w-4xl font-heading text-4xl leading-tight text-white md:text-5xl lg:text-6xl"
                            >
                                Forum{' '}
                                <span className="bg-linear-to-r from-violet-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
                                    Alumni.
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300"
                            >
                                Ruang berbagi cerita, pengalaman karir, dan
                                inspirasi dari para lulusan {school.name}.
                            </motion.p>

                            {/* Hero CTA */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="mt-8 flex flex-wrap gap-3"
                            >
                                <Button
                                    asChild
                                    className="rounded-full bg-violet-600 px-8 py-6 text-base font-semibold text-white shadow-xl transition-all hover:scale-105 hover:bg-violet-500"
                                >
                                    <Link href={alumniWriteStory()}>
                                        <PenLine className="mr-2 size-5" />{' '}
                                        Tulis Ceritamu
                                    </Link>
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.section>

                {/* ═══════════════════ STATS BAR ═══════════════════ */}
                <div className="relative z-20 mx-auto -mt-6 max-w-7xl px-4 sm:px-6 lg:-mt-8">
                    <div className="grid gap-5 md:grid-cols-4">
                        {[
                            {
                                icon: Users,
                                label: 'Total Cerita',
                                value: allThreads.length,
                                color: '#8B5CF6',
                                highlight:
                                    'bg-violet-500/10 text-violet-600 border-violet-200 group-hover:bg-violet-100 group-hover:border-violet-300',
                            },
                            {
                                icon: MessageCircle,
                                label: 'Forum Posts',
                                value: liveForumPosts.length,
                                color: '#0EA5E9',
                                highlight:
                                    'bg-sky-500/10 text-sky-600 border-sky-200 group-hover:bg-sky-100 group-hover:border-sky-300',
                            },
                            {
                                icon: Heart,
                                label: 'Total Apresiasi',
                                value: totalLikes,
                                color: '#F43F5E',
                                highlight:
                                    'bg-rose-500/10 text-rose-600 border-rose-200 group-hover:bg-rose-100 group-hover:border-rose-300',
                            },
                            {
                                icon: GraduationCap,
                                label: 'Angkatan',
                                value: uniqueYears,
                                color: '#F59E0B',
                                highlight:
                                    'bg-amber-500/10 text-amber-600 border-amber-200 group-hover:bg-amber-100 group-hover:border-amber-300',
                            },
                        ].map((stat, i) => {
                            const Icon = stat.icon;

                            return (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: 0.5 + i * 0.1,
                                        duration: 0.6,
                                        ease: 'easeOut',
                                    }}
                                    className="group h-full"
                                >
                                    <BorderGlow
                                        borderRadius={24}
                                        colors={[stat.color, 'transparent']}
                                        className="relative h-full overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.1)] backdrop-blur-xl transition-all duration-300 hover:border-white/90 hover:bg-white hover:shadow-[0_30px_60px_-24px_rgba(0,0,0,0.15)]"
                                    >
                                        <div
                                            className={`absolute -top-6 -right-6 size-32 rounded-full opacity-0 blur-3xl transition duration-700 group-hover:opacity-60 ${stat.highlight.split(' ')[0]}`}
                                        />
                                        <div className="relative flex items-center justify-between">
                                            <div className="text-[0.65rem] font-bold tracking-[0.25em] text-(--school-muted) uppercase transition-colors group-hover:text-(--school-ink)">
                                                {stat.label}
                                            </div>
                                            <div
                                                className={`rounded-full border p-2.5 transition-colors ${stat.highlight}`}
                                            >
                                                <Icon className="size-5" />
                                            </div>
                                        </div>
                                        <div className="relative mt-5 text-4xl font-extrabold tracking-tight text-(--school-ink) lg:text-5xl">
                                            <AnimatedCounter
                                                value={stat.value}
                                                delay={0.6 + i * 0.1}
                                            />
                                        </div>
                                    </BorderGlow>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* ═══════════════════ ANALYTICS CHARTS ═══════════════════ */}
                {allThreads.length > 0 && (
                    <div className="mx-auto max-w-7xl px-4 sm:px-6">
                        <div className="grid gap-5 lg:grid-cols-2">
                            <AlumniAngkatanChart
                                data={Object.entries(
                                    filteredThreads.reduce<
                                        Record<number, number>
                                    >((acc, t) => {
                                        acc[t.graduationYear] =
                                            (acc[t.graduationYear] ?? 0) + 1;

                                        return acc;
                                    }, {}),
                                )
                                    .map(([year, count]) => ({
                                        year: Number(year),
                                        count,
                                    }))
                                    .sort((a, b) => a.year - b.year)}
                            />
                            <CategoryPieChart
                                data={[
                                    {
                                        name: 'Cerita',
                                        value: filteredThreads.filter(
                                            (t) => t.category === 'cerita',
                                        ).length,
                                        color: chartColors.palette[5],
                                    },
                                    {
                                        name: 'Karir',
                                        value: filteredThreads.filter(
                                            (t) => t.category === 'karir',
                                        ).length,
                                        color: chartColors.palette[2],
                                    },
                                    {
                                        name: 'Kampus',
                                        value: filteredThreads.filter(
                                            (t) => t.category === 'kampus',
                                        ).length,
                                        color: chartColors.palette[1],
                                    },
                                    {
                                        name: 'Inspirasi',
                                        value: filteredThreads.filter(
                                            (t) => t.category === 'inspirasi',
                                        ).length,
                                        color: chartColors.palette[3],
                                    },
                                ]}
                            />
                            <TracerRadar threads={filteredThreads} />
                        </div>
                    </div>
                )}

                {/* ═══════════════════ FEATURED STORY ═══════════════════ */}
                {featuredThread && (
                    <div className="mx-auto max-w-7xl px-4 sm:px-6">
                        <BorderGlow
                            borderRadius={32}
                            colors={['#8B5CF6', '#EC4899', '#F59E0B']}
                            className="rounded-4xl border border-white/80 bg-white/90 p-6 shadow-[0_32px_90px_-50px_rgba(15,118,110,0.3)] backdrop-blur-xl md:p-8"
                        >
                            <div className="mb-6 flex items-center gap-2">
                                <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[0.6rem] font-bold tracking-[0.2em] text-amber-700 uppercase">
                                    <Sparkles className="size-3" /> Cerita
                                    Pilihan
                                </div>
                                <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-[0.6rem] font-bold tracking-[0.2em] text-rose-600 uppercase">
                                    <ThumbsUp className="size-3" />{' '}
                                    {featuredThread.likesCount} Apresiasi
                                </div>
                            </div>
                            <div className="grid gap-8 lg:grid-cols-[auto_1fr]">
                                <div
                                    className={`flex size-20 items-center justify-center rounded-3xl bg-linear-to-br ${avatarGradients[Math.abs(featuredThread.id) % avatarGradients.length]} text-white shadow-2xl`}
                                >
                                    <span className="font-heading text-2xl font-bold">
                                        {getInitials(featuredThread.authorName)}
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    {featuredThread.detailUrl ? (
                                        <Link href={featuredThread.detailUrl}>
                                            <h2 className="font-heading text-2xl leading-tight text-(--school-ink) transition hover:text-emerald-700 md:text-3xl">
                                                {featuredThread.title}
                                            </h2>
                                        </Link>
                                    ) : (
                                        <h2 className="font-heading text-2xl leading-tight text-(--school-ink) md:text-3xl">
                                            {featuredThread.title}
                                        </h2>
                                    )}
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                                        {featuredThread.profile?.url ? (
                                            <Link
                                                href={
                                                    featuredThread.profile.url
                                                }
                                                className="font-semibold text-(--school-ink) transition hover:text-emerald-700"
                                            >
                                                {featuredThread.authorName}
                                            </Link>
                                        ) : (
                                            <span className="font-semibold text-(--school-ink)">
                                                {featuredThread.authorName}
                                            </span>
                                        )}
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <GraduationCap className="size-3.5" />{' '}
                                            Angkatan{' '}
                                            {featuredThread.graduationYear}
                                        </span>
                                        {featuredThread.createdAt && (
                                            <>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="size-3.5" />{' '}
                                                    {timeAgo(
                                                        featuredThread.createdAt,
                                                    )}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    <p className="line-clamp-4 max-w-3xl text-base leading-8 text-(--school-muted)">
                                        {featuredThread.body}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-3 pt-2">
                                        <span className="flex items-center gap-1.5 rounded-full border border-rose-100 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600">
                                            <Heart className="size-4" />{' '}
                                            {featuredThread.likesCount}
                                        </span>
                                        <span className="flex items-center gap-1.5 rounded-full border border-slate-100 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-500">
                                            <Users className="size-4" />{' '}
                                            {featuredThread.viewsCount} dilihat
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </BorderGlow>
                    </div>
                )}

                {/* ═══════════════════ FORUM CONTROLS ═══════════════════ */}
                <div className="mx-auto max-w-7xl space-y-4 px-4 sm:px-6">
                    {/* Search + Sort + Write CTA */}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-4 md:flex-row">
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Cari alumni, kampus, profesi, kota, atau cerita..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full rounded-2xl border border-white/70 bg-white/80 py-3.5 pr-5 pl-11 text-sm text-(--school-ink) shadow-sm backdrop-blur-xl transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-2 focus:ring-violet-100 focus:outline-none"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setSortBy('terbaru')}
                                    className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition ${sortBy === 'terbaru' ? 'bg-(--school-ink) text-white shadow-lg' : 'border border-white/70 bg-white/80 text-slate-500 hover:bg-white'}`}
                                >
                                    <CalendarDays className="size-4" /> Terbaru
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSortBy('populer')}
                                    className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition ${sortBy === 'populer' ? 'bg-(--school-ink) text-white shadow-lg' : 'border border-white/70 bg-white/80 text-slate-500 hover:bg-white'}`}
                                >
                                    <TrendingUp className="size-4" /> Populer
                                </button>
                                <Link
                                    href={alumniWriteStory()}
                                    className="flex items-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-violet-500"
                                >
                                    <PenLine className="size-4" /> Tulis
                                </Link>
                            </div>
                        </div>

                        <div className="grid gap-3 rounded-4xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur-xl lg:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
                            <select
                                value={selectedYear}
                                onChange={(event) =>
                                    setSelectedYear(event.target.value)
                                }
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 focus:border-violet-300 focus:ring-2 focus:ring-violet-100 focus:outline-none"
                            >
                                <option value="semua">Semua Angkatan</option>
                                {filterOptions.years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={selectedCity}
                                onChange={(event) =>
                                    setSelectedCity(event.target.value)
                                }
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 focus:border-violet-300 focus:ring-2 focus:ring-violet-100 focus:outline-none"
                            >
                                <option value="semua">Semua Kota</option>
                                {filterOptions.cities.map((city) => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={selectedInstitution}
                                onChange={(event) =>
                                    setSelectedInstitution(event.target.value)
                                }
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 focus:border-violet-300 focus:ring-2 focus:ring-violet-100 focus:outline-none"
                            >
                                <option value="semua">
                                    Semua Kampus/Instansi
                                </option>
                                {filterOptions.institutions.map(
                                    (institution) => (
                                        <option
                                            key={institution}
                                            value={institution}
                                        >
                                            {institution}
                                        </option>
                                    ),
                                )}
                            </select>
                            <select
                                value={selectedOccupation}
                                onChange={(event) =>
                                    setSelectedOccupation(event.target.value)
                                }
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 focus:border-violet-300 focus:ring-2 focus:ring-violet-100 focus:outline-none"
                            >
                                <option value="semua">Semua Profesi</option>
                                {filterOptions.occupations.map((occupation) => (
                                    <option key={occupation} value={occupation}>
                                        {occupation}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedYear('semua');
                                    setSelectedCity('semua');
                                    setSelectedInstitution('semua');
                                    setSelectedOccupation('semua');
                                    setSearchQuery('');
                                    setActiveCategory('semua');
                                }}
                                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100"
                            >
                                Reset Filter
                            </button>
                        </div>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-2">
                        {forumCategories.map((cat) => {
                            const Icon = cat.icon;
                            const isActive = activeCategory === cat.key;
                            const count =
                                cat.key === 'semua'
                                    ? allThreads.length
                                    : allThreads.filter(
                                          (t) => t.category === cat.key,
                                      ).length;

                            return (
                                <button
                                    key={cat.key}
                                    type="button"
                                    onClick={() => setActiveCategory(cat.key)}
                                    className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${isActive ? 'scale-105 bg-(--school-ink) text-white shadow-lg' : 'border border-white/70 bg-white/80 text-slate-500 hover:bg-white hover:shadow-md'}`}
                                >
                                    <Icon
                                        className={`size-4 ${isActive ? 'text-white' : cat.color}`}
                                    />
                                    {cat.label}
                                    <span
                                        className={`ml-1 rounded-full px-2 py-0.5 text-[0.6rem] font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}
                                    >
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ═══════════════════ THREAD LIST ═══════════════════ */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    {filteredThreads.length > 0 ? (
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="show"
                            viewport={motionViewport}
                            className="space-y-4"
                        >
                            <AnimatePresence initial={false}>
                                {filteredThreads.map((thread, i) => (
                                    <ThreadCard
                                        key={thread.id}
                                        thread={thread}
                                        index={i}
                                        onReact={handleForumReaction}
                                        onCommentSubmit={handleCommentSubmit}
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <div className="rounded-4xl border border-dashed border-slate-200 bg-white/70 p-12 text-center">
                            <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
                                <Search className="size-7" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-500">
                                {searchQuery
                                    ? 'Tidak Ditemukan'
                                    : 'Forum Belum Aktif'}
                            </h3>
                            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-(--school-muted)">
                                {searchQuery
                                    ? `Tidak ada cerita yang cocok dengan "${searchQuery}".`
                                    : 'Jadilah yang pertama! Klik "Tulis Ceritamu" untuk memulai.'}
                            </p>
                            {!searchQuery && (
                                <Button
                                    asChild
                                    className="mt-6 rounded-full bg-violet-600 px-8 py-6 text-base font-semibold text-white shadow-lg hover:bg-violet-500"
                                >
                                    <Link href={alumniWriteStory()}>
                                        <PenLine className="mr-2 size-5" />{' '}
                                        Tulis Cerita Pertamamu
                                    </Link>
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {/* ═══════════════════ CTA SECTION ═══════════════════ */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={motionViewport}
                        className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-br from-slate-900 via-violet-950 to-slate-900 p-8 md:p-10"
                    >
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04] mix-blend-overlay" />
                        <div className="absolute top-1/4 -left-20 size-100 rounded-full bg-violet-500/15 blur-[120px]" />
                        <div className="absolute right-0 bottom-0 size-75 rounded-full bg-amber-500/10 blur-[100px]" />
                        <div className="relative z-10 grid items-center gap-8 lg:grid-cols-2">
                            <div className="space-y-5">
                                <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 backdrop-blur-md">
                                    <Send className="size-4 text-violet-400" />
                                    <span className="text-[0.65rem] font-bold tracking-[0.2em] text-violet-300 uppercase">
                                        Bagikan Ceritamu
                                    </span>
                                </div>
                                <h2 className="font-heading text-3xl leading-tight text-white md:text-4xl">
                                    Punya cerita menarik{' '}
                                    <span className="bg-linear-to-r from-violet-400 to-amber-400 bg-clip-text text-transparent">
                                        setelah lulus?
                                    </span>
                                </h2>
                                <p className="max-w-xl text-lg leading-relaxed text-slate-300">
                                    Kami menyediakan ruang bagi seluruh alumni
                                    untuk berbagi pengalaman, perjalanan karir,
                                    dan pesan motivasi.
                                </p>
                                <Button
                                    asChild
                                    className="rounded-full bg-violet-600 px-8 py-6 text-base font-semibold text-white shadow-xl transition-all hover:scale-105 hover:bg-violet-500"
                                >
                                    <Link href={alumniWriteStory()}>
                                        <MessageSquare className="mr-2 size-5" />{' '}
                                        Tulis Ceritamu
                                    </Link>
                                </Button>
                            </div>
                            <div className="hidden grid-cols-2 gap-4 lg:grid">
                                {[
                                    {
                                        icon: GraduationCap,
                                        title: 'Cerita Kampus',
                                        desc: 'Ceritakan pengalamanmu di perguruan tinggi',
                                        gradient:
                                            'from-violet-500 to-violet-700',
                                    },
                                    {
                                        icon: Briefcase,
                                        title: 'Jalur Karir',
                                        desc: 'Bagikan tips dan perjalanan profesional',
                                        gradient: 'from-sky-500 to-sky-700',
                                    },
                                    {
                                        icon: Globe,
                                        title: 'Pengalaman Global',
                                        desc: 'Kisah alumni di luar negeri',
                                        gradient:
                                            'from-emerald-500 to-emerald-700',
                                    },
                                    {
                                        icon: Lightbulb,
                                        title: 'Tips & Motivasi',
                                        desc: 'Pesan untuk adik-adik kelas',
                                        gradient: 'from-amber-500 to-amber-700',
                                    },
                                ].map((item) => {
                                    const ItemIcon = item.icon;

                                    return (
                                        <motion.div
                                            key={item.title}
                                            whileHover={{ y: -3, scale: 1.02 }}
                                            className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition"
                                        >
                                            <div
                                                className={`mb-3 flex size-10 items-center justify-center rounded-xl bg-linear-to-br ${item.gradient} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
                                            >
                                                <ItemIcon className="size-4" />
                                            </div>
                                            <div className="text-sm font-semibold text-white">
                                                {item.title}
                                            </div>
                                            <div className="mt-1 text-xs text-slate-400">
                                                {item.desc}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ═══════════════════ WRITE STORY MODAL ═══════════════════ */}
            <AnimatePresence>
                {showWriteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[120] overflow-y-auto bg-black/45 px-3 py-6 backdrop-blur-sm sm:px-4 sm:py-8"
                        onClick={() => {
                            if (!isSubmitting) {
                                setShowWriteModal(false);
                                setSubmitResult(null);
                                setFormStep(1);
                            }
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{
                                type: 'spring',
                                stiffness: 400,
                                damping: 30,
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative mx-auto w-full max-w-3xl rounded-[2rem] border border-white/80 bg-white p-0 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.3)] sm:rounded-[2.5rem]"
                        >
                            {/* Modal Header */}
                            <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-[2rem] border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur-xl sm:rounded-t-[2.5rem] sm:px-8 sm:py-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-violet-700 text-white shadow-md">
                                        <PenLine className="size-4" />
                                    </div>
                                    <div>
                                        <h2 className="font-heading text-xl font-semibold text-(--school-ink)">
                                            Tulis Ceritamu
                                        </h2>
                                        <p className="text-xs text-slate-400">
                                            Langkah {formStep} dari 2
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowWriteModal(false);
                                        setSubmitResult(null);
                                        setFormStep(1);
                                    }}
                                    className="flex size-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition hover:bg-slate-100"
                                >
                                    <X className="size-5" />
                                </button>
                            </div>

                            {/* Step Indicator */}
                            <div className="px-5 pt-6 sm:px-8">
                                <div className="flex gap-2">
                                    <div
                                        className={`h-1.5 flex-1 rounded-full transition-colors ${formStep >= 1 ? 'bg-violet-500' : 'bg-slate-100'}`}
                                    />
                                    <div
                                        className={`h-1.5 flex-1 rounded-full transition-colors ${formStep >= 2 ? 'bg-violet-500' : 'bg-slate-100'}`}
                                    />
                                </div>
                            </div>

                            {/* Success / Error Message  */}
                            {submitResult && (
                                <div
                                    className={`mx-5 mt-6 rounded-2xl border p-5 sm:mx-8 ${submitResult.success ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={`flex size-8 items-center justify-center rounded-xl ${submitResult.success ? 'bg-emerald-500' : 'bg-rose-500'} text-white`}
                                        >
                                            {submitResult.success ? (
                                                <Check className="size-4" />
                                            ) : (
                                                <X className="size-4" />
                                            )}
                                        </div>
                                        <p
                                            className={`text-sm leading-relaxed font-medium ${submitResult.success ? 'text-emerald-800' : 'text-rose-800'}`}
                                        >
                                            {submitResult.message}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <form
                                onSubmit={handleSubmit}
                                className="px-5 pb-6 sm:px-8 sm:pb-8"
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
                                    {formStep === 1 && (
                                        <motion.div
                                            key="step1"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-5 pt-6"
                                        >
                                            <h3 className="text-sm font-bold tracking-[0.2em] text-slate-400 uppercase">
                                                Identitas Kamu
                                            </h3>

                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-(--school-ink)">
                                                    Nama Lengkap *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.author_name}
                                                    onChange={(e) =>
                                                        updateField(
                                                            'author_name',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Nama lengkapmu"
                                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-3.5 text-sm text-(--school-ink) transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-2 focus:ring-violet-100 focus:outline-none"
                                                />
                                            </div>

                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-(--school-ink)">
                                                        Tahun Lulus *
                                                    </label>
                                                    <input
                                                        type="number"
                                                        required
                                                        value={
                                                            formData.graduation_year
                                                        }
                                                        onChange={(e) =>
                                                            updateField(
                                                                'graduation_year',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="2020"
                                                        min="1990"
                                                        max={
                                                            new Date().getFullYear() +
                                                            1
                                                        }
                                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-3.5 text-sm text-(--school-ink) transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-2 focus:ring-violet-100 focus:outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-(--school-ink)">
                                                        Kategori *
                                                    </label>
                                                    <select
                                                        value={
                                                            formData.category
                                                        }
                                                        onChange={(e) =>
                                                            updateField(
                                                                'category',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-3.5 text-sm text-(--school-ink) transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100 focus:outline-none"
                                                    >
                                                        <option value="cerita">
                                                            Cerita Alumni
                                                        </option>
                                                        <option value="karir">
                                                            Karir & Profesi
                                                        </option>
                                                        <option value="kampus">
                                                            Jejak Kampus
                                                        </option>
                                                        <option value="inspirasi">
                                                            Inspirasi
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-(--school-ink)">
                                                        Pekerjaan / Profesi
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            formData.occupation_title
                                                        }
                                                        onChange={(e) =>
                                                            updateField(
                                                                'occupation_title',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Software Engineer"
                                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-3.5 text-sm text-(--school-ink) transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-2 focus:ring-violet-100 focus:outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-(--school-ink)">
                                                        Institusi / Perusahaan
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            formData.institution_name
                                                        }
                                                        onChange={(e) =>
                                                            updateField(
                                                                'institution_name',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Universitas atau perusahaan"
                                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-3.5 text-sm text-(--school-ink) transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-2 focus:ring-violet-100 focus:outline-none"
                                                    />
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

                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-(--school-ink)">
                                                        Email
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={
                                                            formData.contact_email
                                                        }
                                                        onChange={(e) =>
                                                            updateField(
                                                                'contact_email',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="email@contoh.com"
                                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-3.5 text-sm text-(--school-ink) transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-2 focus:ring-violet-100 focus:outline-none"
                                                    />
                                                </div>
                                                <div className="rounded-[1.8rem] border border-slate-200 bg-slate-50/70 p-5">
                                                    <div className="text-sm font-semibold text-(--school-ink)">
                                                        Lencana Publik
                                                    </div>
                                                    <div className="mt-3 space-y-3">
                                                        <label className="flex items-start gap-3 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-slate-600">
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    formData.is_open_to_mentor
                                                                }
                                                                onChange={(e) =>
                                                                    updateField(
                                                                        'is_open_to_mentor',
                                                                        e.target
                                                                            .checked,
                                                                    )
                                                                }
                                                                className="mt-1 size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                                            />
                                                            <span>
                                                                <span className="block font-semibold text-(--school-ink)">
                                                                    Open to
                                                                    Mentor
                                                                </span>
                                                                <span className="block text-xs leading-5 text-slate-500">
                                                                    Tandai jika
                                                                    kamu terbuka
                                                                    membantu
                                                                    adik kelas
                                                                    lewat
                                                                    insight atau
                                                                    sesi tanya
                                                                    jawab.
                                                                </span>
                                                            </span>
                                                        </label>
                                                        <label className="flex items-start gap-3 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-slate-600">
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    formData.has_hiring_info
                                                                }
                                                                onChange={(e) =>
                                                                    updateField(
                                                                        'has_hiring_info',
                                                                        e.target
                                                                            .checked,
                                                                    )
                                                                }
                                                                className="mt-1 size-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                                                            />
                                                            <span>
                                                                <span className="block font-semibold text-(--school-ink)">
                                                                    Hiring /
                                                                    Opportunity
                                                                </span>
                                                                <span className="block text-xs leading-5 text-slate-500">
                                                                    Aktifkan
                                                                    jika cerita
                                                                    ini memuat
                                                                    info
                                                                    lowongan,
                                                                    magang, atau
                                                                    peluang
                                                                    kolaborasi.
                                                                </span>
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-end pt-4">
                                                <Button
                                                    type="button"
                                                    onClick={() =>
                                                        setFormStep(2)
                                                    }
                                                    disabled={!isStep1Valid}
                                                    className="rounded-full bg-violet-600 px-8 py-5 text-sm font-semibold text-white shadow-lg hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                    Lanjut ke Cerita{' '}
                                                    <ChevronDown className="ml-2 size-4 -rotate-90" />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {formStep === 2 && (
                                        <motion.div
                                            key="step2"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="space-y-5 pt-6"
                                        >
                                            <h3 className="text-sm font-bold tracking-[0.2em] text-slate-400 uppercase">
                                                Cerita Kamu
                                            </h3>

                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-(--school-ink)">
                                                    Judul Cerita *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.title}
                                                    onChange={(e) =>
                                                        updateField(
                                                            'title',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Contoh: Perjalanan saya menjadi dokter setelah lulus"
                                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-3.5 text-sm text-(--school-ink) transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-2 focus:ring-violet-100 focus:outline-none"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-(--school-ink)">
                                                    Isi Cerita *{' '}
                                                    <span className="font-normal text-slate-400">
                                                        ({formData.body.length}
                                                        /5000)
                                                    </span>
                                                </label>
                                                <textarea
                                                    required
                                                    value={formData.body}
                                                    onChange={(e) =>
                                                        updateField(
                                                            'body',
                                                            e.target.value,
                                                        )
                                                    }
                                                    rows={8}
                                                    maxLength={5000}
                                                    placeholder="Ceritakan pengalamanmu setelah lulus dari SMAN 1 Tenjo. Apa yang kamu pelajari? Bagaimana perjalananmu? Apa pesan untuk adik-adik kelas?"
                                                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-sm leading-7 text-(--school-ink) transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-2 focus:ring-violet-100 focus:outline-none"
                                                />
                                            </div>

                                            <div className="flex items-center justify-between pt-4">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setFormStep(1)
                                                    }
                                                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-50"
                                                >
                                                    <ChevronDown className="size-4 rotate-90" />{' '}
                                                    Kembali
                                                </button>
                                                <Button
                                                    type="submit"
                                                    disabled={
                                                        !isStep2Valid ||
                                                        isSubmitting
                                                    }
                                                    className="rounded-full bg-violet-600 px-8 py-5 text-sm font-semibold text-white shadow-lg hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <span className="mr-2 inline-block size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />{' '}
                                                            Mengirim...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Send className="mr-2 size-4" />{' '}
                                                            Kirim Cerita
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
