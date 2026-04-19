import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowUpRight,
    ChevronDown,
    ChevronRight,
    Clock3,
    GraduationCap,
    MapPin,
    Mail,
    Menu,
    Phone,
    Sparkles,
    X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Meteors } from '@/components/public/meteors';
import { SchoolMark } from '@/components/public/school-mark';
import { SocialLinks } from '@/components/public/social-links';
import { Button } from '@/components/ui/button';
import type { NavItem } from '@/lib/public-content';
import { buildPublicNavigation } from '@/lib/public-portal-settings';
import { cn } from '@/lib/utils';
import { useSiteUiStore } from '@/stores/site-ui-store';
import type { SharedSiteSettings } from '@/types';

type PublicLayoutProps = {
    children: ReactNode;
};

type NavigationPresentation = {
    eyebrow: string;
    summary: string;
    accentClassName: string;
};

const schoolContact = {
    email: 'smantenjo@yahoo.com',
    phone: '021-5976-1066',
    phoneHref: 'tel:02159761066',
    location: 'Babakan, Tenjo - Kabupaten Bogor',
    address:
        'JL. Raya Tenjo - Parung Panjang KM. 03, Babakan, Tenjo, Kab. Bogor 16340',
    serviceHours: 'Senin - Jumat, 07.00 - 15.30 WIB',
} as const;

const navigationPresentations: Record<string, NavigationPresentation> = {
    '/': {
        eyebrow: 'Utama',
        summary:
            'Ringkasan identitas, program, berita, dan akses utama sekolah.',
        accentClassName:
            'bg-[linear-gradient(155deg,rgba(15,118,110,0.18),rgba(255,255,255,0.96),rgba(56,189,248,0.18))]',
    },
    '/profil': {
        eyebrow: 'Profil',
        summary:
            'Identitas, sejarah, visi-misi, fasilitas, dan prestasi sekolah.',
        accentClassName:
            'bg-[linear-gradient(155deg,rgba(15,118,110,0.18),rgba(255,255,255,0.96),rgba(251,191,36,0.18))]',
    },
    '/akademik': {
        eyebrow: 'Akademik',
        summary: 'Kurikulum, pembelajaran, P5, dan data akademik utama.',
        accentClassName:
            'bg-[linear-gradient(155deg,rgba(14,165,233,0.18),rgba(255,255,255,0.96),rgba(15,118,110,0.18))]',
    },
    '/kesiswaan': {
        eyebrow: 'Kesiswaan',
        summary: 'OSIS, MPK, prestasi, beasiswa, BK, dan ekstrakurikuler.',
        accentClassName:
            'bg-[linear-gradient(155deg,rgba(5,150,105,0.18),rgba(255,255,255,0.96),rgba(251,191,36,0.16))]',
    },
    '/ppdb': {
        eyebrow: 'PPDB',
        summary: 'Informasi pendaftaran, zonasi, alur, dan akses PPDB.',
        accentClassName:
            'bg-[linear-gradient(155deg,rgba(245,158,11,0.18),rgba(255,255,255,0.96),rgba(34,197,94,0.18))]',
    },
    '/media': {
        eyebrow: 'Dokumentasi',
        summary: 'Galeri foto dan video sekolah yang ringkas.',
        accentClassName:
            'bg-[linear-gradient(155deg,rgba(14,165,233,0.18),rgba(255,255,255,0.96),rgba(16,185,129,0.16))]',
    },
    '/layanan': {
        eyebrow: 'Layanan',
        summary: 'FAQ, kontak, dan layanan publik sekolah.',
        accentClassName:
            'bg-[linear-gradient(155deg,rgba(16,185,129,0.18),rgba(255,255,255,0.96),rgba(124,58,237,0.14))]',
    },
    '/dokumen': {
        eyebrow: 'Dokumen',
        summary: 'Unduhan, formulir, dan panduan resmi sekolah.',
        accentClassName:
            'bg-[linear-gradient(155deg,rgba(15,118,110,0.18),rgba(255,255,255,0.96),rgba(251,191,36,0.16))]',
    },
    '/berita': {
        eyebrow: 'Berita',
        summary: 'Rilis, artikel, dan informasi terbaru sekolah.',
        accentClassName:
            'bg-[linear-gradient(155deg,rgba(2,132,199,0.16),rgba(255,255,255,0.96),rgba(147,197,253,0.18))]',
    },
    '/organisasi': {
        eyebrow: 'Komunitas',
        summary: 'Struktur sekolah, guru, alumni, dan virtual tour.',
        accentClassName:
            'bg-[linear-gradient(155deg,rgba(124,58,237,0.16),rgba(255,255,255,0.96),rgba(15,118,110,0.16))]',
    },
};

const DESKTOP_DROPDOWN_WIDTH_CLASS =
    'w-[min(46rem,calc(100vw-2.5rem))] max-w-[calc(100vw-2.5rem)]';

function normalizeNavigationHref(href: string): string {
    const [hrefWithoutQuery] = href.split('?');

    return hrefWithoutQuery || '/';
}

function normalizeNavigationPath(href: string): string {
    const [path] = href.split('#');

    return path || '/';
}

function matchesCurrentPath(currentPath: string, href: string): boolean {
    const normalizedHref = normalizeNavigationHref(href);
    const normalizedPath = normalizeNavigationPath(normalizedHref);
    const currentPathname = normalizeNavigationPath(currentPath);

    if (normalizedHref.includes('#')) {
        return currentPath === normalizedHref;
    }

    if (normalizedPath === '/') {
        return currentPathname === '/';
    }

    return (
        currentPathname === normalizedPath ||
        currentPathname.startsWith(`${normalizedPath}/`)
    );
}

function isNavigationItemActive(currentPath: string, item: NavItem): boolean {
    return (
        matchesCurrentPath(currentPath, item.href) ||
        item.children?.some((child) =>
            matchesCurrentPath(currentPath, child.href),
        ) === true
    );
}

function getNavigationSubmenuItems(
    item: NavItem,
): NonNullable<NavItem['children']> {
    const parentHref = normalizeNavigationHref(item.href);
    const seenHrefs = new Set<string>();

    return (
        item.children?.filter((child) => {
            const childHref = normalizeNavigationHref(child.href);
            const isDuplicateParentEntry =
                childHref === parentHref && child.label === item.label;

            if (isDuplicateParentEntry || seenHrefs.has(childHref)) {
                return false;
            }

            seenHrefs.add(childHref);

            return true;
        }) ?? []
    );
}

function getDesktopDropdownPosition(index: number, totalItems: number): string {
    if (index === 0) {
        return 'left-0 translate-x-0';
    }

    if (index >= totalItems - 2) {
        return 'right-2 left-auto translate-x-0';
    }

    return 'left-1/2 -translate-x-1/2';
}

function getCurrentNavigationLocation(pageUrl: string): string {
    if (typeof window !== 'undefined') {
        return `${window.location.pathname}${window.location.hash}`;
    }

    return normalizeNavigationHref(pageUrl);
}

function hasNavigationSubmenu(item: NavItem): boolean {
    return getNavigationSubmenuItems(item).length > 0;
}

function getNavigationPresentation(item: NavItem): NavigationPresentation {
    return (
        navigationPresentations[item.href] ?? {
            eyebrow: 'Navigasi',
            summary: `Akses ringkas menuju halaman ${item.label.toLowerCase()}.`,
            accentClassName:
                'bg-[linear-gradient(155deg,rgba(15,118,110,0.16),rgba(255,255,255,0.96),rgba(56,189,248,0.14))]',
        }
    );
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    const page = usePage<{
        auth?: { user?: { name?: string } | null };
        siteSettings?: SharedSiteSettings;
    }>();
    const { auth } = page.props;
    const mobileNavOpen = useSiteUiStore((state) => state.mobileNavOpen);
    const setMobileNavOpen = useSiteUiStore((state) => state.setMobileNavOpen);
    const currentPath = getCurrentNavigationLocation(page.url);
    const navigationItems = useMemo(
        () => buildPublicNavigation(page.props.siteSettings?.publicPortal),
        [page.props.siteSettings?.publicPortal],
    );
    const footerQuickLinks = useMemo(
        () =>
            navigationItems.map((item) => ({
                href: item.href,
                label: item.label,
            })),
        [navigationItems],
    );

    const [hoveredNav, setHoveredNav] = useState<string | null>(null);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );

    // Scroll detection for header shadow
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 16);
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (typeof document === 'undefined') {
            return;
        }

        document.body.style.overflow = mobileNavOpen ? 'hidden' : '';

        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileNavOpen]);

    useEffect(() => {
        return () => {
            if (dropdownTimeoutRef.current) {
                clearTimeout(dropdownTimeoutRef.current);
            }
        };
    }, []);

    const handleNavEnter = useCallback((item: NavItem) => {
        if (dropdownTimeoutRef.current) {
            clearTimeout(dropdownTimeoutRef.current);
        }

        setHoveredNav(item.href);

        if (hasNavigationSubmenu(item)) {
            setOpenDropdown(item.href);
        }
    }, []);

    const handleNavLeave = useCallback(() => {
        dropdownTimeoutRef.current = setTimeout(() => {
            setOpenDropdown(null);
            setHoveredNav(null);
        }, 150);
    }, []);

    const handleDropdownEnter = useCallback(() => {
        if (dropdownTimeoutRef.current) {
            clearTimeout(dropdownTimeoutRef.current);
        }
    }, []);

    const handleDropdownLeave = useCallback(() => {
        dropdownTimeoutRef.current = setTimeout(() => {
            setOpenDropdown(null);
            setHoveredNav(null);
        }, 150);
    }, []);

    const portalHref = auth?.user ? '/dashboard' : '/login';
    const portalLabel = auth?.user ? 'Dashboard' : 'Masuk Portal';
    const footerServiceLinks = [
        {
            href: portalHref,
            label: portalLabel,
            description: auth?.user
                ? 'Akses dashboard internal sekolah.'
                : 'Akses layanan internal sekolah.',
        },
        {
            href: '/berita',
            label: 'Info Terbaru',
            description: 'Berita dan pengumuman sekolah.',
        },
        {
            href: '/layanan#faq-layanan',
            label: 'FAQ Layanan',
            description: 'Jawaban untuk pertanyaan umum.',
        },
    ];

    return (
        <div className="public-typography min-h-screen bg-(--page-bg) text-(--school-ink)">
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(15,118,110,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.11),transparent_28%)]" />
            <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(90deg,rgba(15,118,110,0.05)_1px,transparent_1px),linear-gradient(rgba(15,118,110,0.05)_1px,transparent_1px)] bg-size-[84px_84px] opacity-50" />
            <Meteors number={40} />

            <a
                href="#main-content"
                className="absolute top-4 left-1/2 z-100 -translate-x-1/2 -translate-y-24 rounded-full bg-(--school-green-700) px-6 py-2.5 text-sm font-semibold text-white shadow-xl transition focus:translate-y-0 focus:ring-4 focus:ring-(--school-green-200) focus:outline-none"
            >
                Lompat ke konten utama
            </a>

            {/* ═══════════ HEADER / NAVBAR ═══════════ */}
            <motion.header
                initial={{ opacity: 0, y: -18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className={cn(
                    'sticky top-0 z-50 border-b bg-[rgba(250,247,238,0.78)] backdrop-blur-2xl transition-all duration-500',
                    scrolled
                        ? 'border-white/40 shadow-[0_18px_40px_-24px_rgba(4,47,46,0.22)]'
                        : 'border-white/60 shadow-none',
                )}
            >
                <div className="overflow-hidden border-b border-white/40 bg-[linear-gradient(90deg,rgba(255,255,255,0.55),rgba(15,118,110,0.08),rgba(255,255,255,0.4))]">
                    <div className="mx-auto hidden max-w-336 items-center justify-between gap-5 px-5 py-2.5 md:px-8 lg:flex">
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/75 bg-white/80 px-3 py-1.5 text-[0.72rem] font-semibold text-(--school-ink) shadow-[0_10px_26px_-18px_rgba(4,47,46,0.24)]">
                                <Sparkles className="size-3.5 text-amber-500" />
                                Portal Sekolah
                            </div>
                            <a
                                href={schoolContact.phoneHref}
                                className="group inline-flex items-center gap-2 text-[0.72rem] font-medium text-(--school-muted) transition-colors hover:text-(--school-ink)"
                            >
                                <Phone className="size-3.5 text-(--school-green-700)" />
                                {schoolContact.phone}
                            </a>
                            <a
                                href={`mailto:${schoolContact.email}`}
                                className="group inline-flex items-center gap-2 text-[0.72rem] font-medium text-(--school-muted) transition-colors hover:text-(--school-ink)"
                            >
                                <Mail className="size-3.5 text-sky-600" />
                                {schoolContact.email}
                            </a>
                            <div className="inline-flex items-center gap-2 text-[0.72rem] font-medium text-(--school-muted)">
                                <MapPin className="size-3.5 text-amber-500" />
                                {schoolContact.location}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link
                                href="/berita"
                                prefetch
                                className="group inline-flex items-center gap-2 rounded-full border border-white/75 bg-white/80 px-3.5 py-1.5 text-[0.72rem] font-semibold text-(--school-ink) shadow-[0_10px_26px_-18px_rgba(4,47,46,0.24)] transition-all hover:-translate-y-0.5 hover:bg-white"
                            >
                                Info Terbaru
                                <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Link>
                            <Link
                                href={portalHref}
                                prefetch="mount"
                                className="inline-flex items-center gap-2 rounded-full border border-(--school-green-100) bg-(--school-green-50)/75 px-3.5 py-1.5 text-[0.72rem] font-semibold text-(--school-green-700) transition-all hover:-translate-y-0.5 hover:border-(--school-green-200) hover:bg-white"
                            >
                                {portalLabel}
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mx-auto flex max-w-336 items-center justify-between gap-4 px-5 py-3 md:px-8 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-5 lg:py-4">
                    <div className="flex min-w-0 items-center gap-4 lg:min-w-max lg:justify-start">
                        <Link
                            href="/"
                            prefetch
                            className="min-w-0 transition-transform duration-300 hover:scale-[1.02]"
                        >
                            <SchoolMark compact />
                        </Link>
                    </div>

                    <div className="hidden min-w-0 items-center justify-center lg:flex">
                        <motion.nav
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: 0.12,
                                duration: 0.35,
                                ease: 'easeOut',
                            }}
                            className="flex w-full max-w-[55rem] min-w-0 items-center justify-center gap-px rounded-full border border-white/75 bg-white/72 p-1 shadow-[0_18px_42px_-26px_rgba(4,47,46,0.28)] xl:max-w-[56rem]"
                            onMouseLeave={handleNavLeave}
                        >
                            {navigationItems.map((item, index) => {
                                const active = isNavigationItemActive(
                                    currentPath,
                                    item,
                                );
                                const submenuItems =
                                    getNavigationSubmenuItems(item);
                                const isHovered = hoveredNav === item.href;
                                const hasChildren = submenuItems.length > 0;
                                const isOpen = openDropdown === item.href;
                                const presentation =
                                    getNavigationPresentation(item);
                                const dropdownPositionClass =
                                    getDesktopDropdownPosition(
                                        index,
                                        navigationItems.length,
                                    );

                                return (
                                    <motion.div
                                        key={item.href}
                                        className="relative min-w-0"
                                        onMouseEnter={() => {
                                            if (hasChildren) {
                                                handleNavEnter(item);
                                            }
                                        }}
                                        onPointerEnter={() => {
                                            if (hasChildren) {
                                                handleNavEnter(item);
                                            }
                                        }}
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.28,
                                            ease: 'easeOut',
                                        }}
                                    >
                                        <Link
                                            href={item.href}
                                            prefetch
                                            onMouseEnter={() =>
                                                handleNavEnter(item)
                                            }
                                            onFocus={() => handleNavEnter(item)}
                                            onBlur={handleNavLeave}
                                            aria-current={
                                                active ? 'page' : undefined
                                            }
                                            aria-expanded={
                                                hasChildren ? isOpen : undefined
                                            }
                                            aria-haspopup={
                                                hasChildren ? 'menu' : undefined
                                            }
                                            className={cn(
                                                'relative flex min-w-0 items-center gap-2 rounded-full px-3 py-2.5 text-[0.9rem] font-semibold transition-[color,transform] duration-200 hover:-translate-y-0.5 xl:px-3.5',
                                                active || isHovered
                                                    ? 'text-(--school-green-700)'
                                                    : 'text-(--school-muted) hover:text-(--school-ink)',
                                            )}
                                        >
                                            {isHovered && (
                                                <motion.div
                                                    layoutId="nav-hover-pill"
                                                    className="absolute inset-0 rounded-full bg-white/88 shadow-[0_14px_28px_-18px_rgba(4,47,46,0.22)]"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{
                                                        type: 'spring',
                                                        stiffness: 400,
                                                        damping: 30,
                                                    }}
                                                />
                                            )}
                                            {active && !isHovered && (
                                                <motion.div
                                                    layoutId="nav-active-indicator"
                                                    className="absolute inset-0 rounded-full bg-white shadow-[0_18px_38px_-24px_rgba(15,118,110,0.45)]"
                                                    transition={{
                                                        type: 'spring',
                                                        stiffness: 400,
                                                        damping: 30,
                                                    }}
                                                />
                                            )}
                                            <span
                                                className={cn(
                                                    'relative z-10 h-1.5 w-1.5 rounded-full transition-colors duration-200',
                                                    active || isHovered
                                                        ? 'bg-(--school-green-600)'
                                                        : 'bg-transparent',
                                                )}
                                            />
                                            <span className="relative z-10">
                                                {item.label}
                                            </span>
                                            {hasChildren && (
                                                <ChevronDown
                                                    className={cn(
                                                        'relative z-10 size-3.5 transition-transform duration-200',
                                                        isOpen && 'rotate-180',
                                                    )}
                                                />
                                            )}
                                        </Link>

                                        {hasChildren && isOpen ? (
                                            <div
                                                className={cn(
                                                    'absolute top-full z-40 h-4',
                                                    DESKTOP_DROPDOWN_WIDTH_CLASS,
                                                    dropdownPositionClass,
                                                )}
                                                onMouseEnter={
                                                    handleDropdownEnter
                                                }
                                                onMouseLeave={
                                                    handleDropdownLeave
                                                }
                                            />
                                        ) : null}

                                        <AnimatePresence>
                                            {hasChildren && isOpen && (
                                                <motion.div
                                                    initial={{
                                                        opacity: 0,
                                                        y: 10,
                                                        scale: 0.97,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                        scale: 1,
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        y: 10,
                                                        scale: 0.97,
                                                    }}
                                                    transition={{
                                                        type: 'spring',
                                                        stiffness: 480,
                                                        damping: 34,
                                                    }}
                                                    onMouseEnter={
                                                        handleDropdownEnter
                                                    }
                                                    onMouseLeave={
                                                        handleDropdownLeave
                                                    }
                                                    className={cn(
                                                        'absolute top-full z-50 mt-4 origin-top overflow-hidden rounded-[1.9rem] border border-white/70 bg-[rgba(250,247,238,0.98)] shadow-[0_32px_90px_-32px_rgba(4,47,46,0.38)] backdrop-blur-2xl',
                                                        DESKTOP_DROPDOWN_WIDTH_CLASS,
                                                        dropdownPositionClass,
                                                    )}
                                                >
                                                    <div className="grid gap-0 md:grid-cols-[0.92fr_1fr]">
                                                        <div
                                                            className={cn(
                                                                'relative overflow-hidden px-5 py-5',
                                                                presentation.accentClassName,
                                                            )}
                                                        >
                                                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.75),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(15,118,110,0.14),transparent_48%)]" />
                                                            <div className="relative flex h-full flex-col justify-between gap-6">
                                                                <div className="space-y-4">
                                                                    <div className="inline-flex items-center gap-2 rounded-full border border-white/75 bg-white/80 px-3 py-1 text-[0.7rem] font-bold tracking-[0.24em] text-(--school-green-700) uppercase">
                                                                        <Sparkles className="size-3.5 text-amber-500" />
                                                                        {
                                                                            presentation.eyebrow
                                                                        }
                                                                    </div>

                                                                    <div>
                                                                        <h3 className="text-2xl font-semibold text-(--school-ink)">
                                                                            {
                                                                                item.label
                                                                            }
                                                                        </h3>
                                                                        <p className="mt-3 text-sm leading-7 text-slate-600">
                                                                            {
                                                                                presentation.summary
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <Link
                                                                        href={
                                                                            item.href
                                                                        }
                                                                        prefetch
                                                                        className="group inline-flex items-center gap-2 text-sm font-semibold text-(--school-green-700) transition-colors hover:text-(--school-green-600)"
                                                                        onClick={() =>
                                                                            setOpenDropdown(
                                                                                null,
                                                                            )
                                                                        }
                                                                    >
                                                                        Buka
                                                                        halaman
                                                                        <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="bg-white/72 p-3">
                                                            <div
                                                                className={cn(
                                                                    'grid gap-2',
                                                                    submenuItems.length >
                                                                        8 &&
                                                                        'xl:grid-cols-2',
                                                                )}
                                                            >
                                                                {submenuItems.map(
                                                                    (child) => {
                                                                        const childActive =
                                                                            matchesCurrentPath(
                                                                                currentPath,
                                                                                child.href,
                                                                            );

                                                                        return (
                                                                            <Link
                                                                                key={
                                                                                    child.href
                                                                                }
                                                                                href={
                                                                                    child.href
                                                                                }
                                                                                prefetch
                                                                                className={cn(
                                                                                    'group relative overflow-hidden rounded-[1.35rem] border px-4 py-4 shadow-[0_14px_34px_-24px_rgba(4,47,46,0.22)] transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_22px_44px_-28px_rgba(4,47,46,0.25)]',
                                                                                    childActive
                                                                                        ? 'border-(--school-green-200) bg-(--school-green-50)/70'
                                                                                        : 'border-white/70 bg-white/82 hover:border-(--school-green-100)',
                                                                                )}
                                                                                onClick={() =>
                                                                                    setOpenDropdown(
                                                                                        null,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <div className="flex items-start justify-between gap-4">
                                                                                    <div className="min-w-0">
                                                                                        <div className="flex items-center gap-2">
                                                                                            <span
                                                                                                className={cn(
                                                                                                    'size-2 rounded-full',
                                                                                                    childActive
                                                                                                        ? 'bg-(--school-green-600)'
                                                                                                        : 'bg-(--school-green-200)',
                                                                                                )}
                                                                                            />
                                                                                            <span
                                                                                                className={cn(
                                                                                                    'text-sm font-semibold transition-colors group-hover:text-(--school-green-700)',
                                                                                                    childActive
                                                                                                        ? 'text-(--school-green-700)'
                                                                                                        : 'text-(--school-ink)',
                                                                                                )}
                                                                                            >
                                                                                                {
                                                                                                    child.label
                                                                                                }
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>

                                                                                    <ChevronRight
                                                                                        className={cn(
                                                                                            'mt-0.5 size-4 shrink-0 transition-all group-hover:translate-x-0.5 group-hover:text-(--school-green-700)',
                                                                                            childActive
                                                                                                ? 'text-(--school-green-700) opacity-100'
                                                                                                : 'text-(--school-muted) opacity-60',
                                                                                        )}
                                                                                    />
                                                                                </div>
                                                                            </Link>
                                                                        );
                                                                    },
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </motion.nav>
                    </div>

                    <div
                        aria-hidden="true"
                        className="hidden lg:flex lg:min-w-max lg:items-center lg:justify-end"
                    >
                        <div className="pointer-events-none invisible select-none">
                            <SchoolMark compact />
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-full border-white/75 bg-white/82 shadow-[0_16px_34px_-22px_rgba(4,47,46,0.24)] lg:hidden"
                        onClick={() => setMobileNavOpen(!mobileNavOpen)}
                        aria-label={
                            mobileNavOpen ? 'Tutup navigasi' : 'Buka navigasi'
                        }
                    >
                        {mobileNavOpen ? (
                            <X className="size-4" />
                        ) : (
                            <Menu className="size-4" />
                        )}
                    </Button>
                </div>
            </motion.header>

            {/* ═══════════ MOBILE NAV ═══════════ */}
            <AnimatePresence>
                {mobileNavOpen ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-[rgba(4,47,46,0.36)] backdrop-blur-md lg:hidden"
                    >
                        <motion.div
                            initial={{ y: -24, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -24, opacity: 0 }}
                            className="mx-4 mt-20 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-[2rem] border border-white/80 bg-[rgba(250,247,238,0.97)] p-4 shadow-[0_32px_90px_-46px_rgba(4,47,46,0.65)] md:mx-8"
                        >
                            <div className="rounded-[1.7rem] border border-white/80 bg-[linear-gradient(160deg,rgba(15,118,110,0.12),rgba(255,255,255,0.88),rgba(56,189,248,0.12))] p-5 shadow-[0_18px_40px_-28px_rgba(4,47,46,0.24)]">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/82 px-3 py-1 text-[0.68rem] font-bold tracking-[0.22em] text-(--school-green-700) uppercase">
                                            <Sparkles className="size-3.5 text-amber-500" />
                                            Portal Sekolah
                                        </div>
                                        <h2 className="mt-4 text-2xl font-semibold text-(--school-ink)">
                                            Menu utama
                                        </h2>
                                        <p className="mt-2 max-w-sm text-sm leading-6 text-(--school-muted)">
                                            Pilih halaman yang ingin dibuka.
                                        </p>
                                    </div>

                                    <div className="grid size-11 place-items-center rounded-2xl bg-white/85 text-(--school-green-700) shadow-[0_16px_34px_-24px_rgba(4,47,46,0.24)]">
                                        <GraduationCap className="size-5" />
                                    </div>
                                </div>

                                <div className="mt-5 flex flex-wrap gap-2">
                                    <Link
                                        href="/berita"
                                        prefetch
                                        className="rounded-full border border-white/80 bg-white/82 px-3.5 py-2 text-sm font-semibold text-(--school-ink)"
                                        onClick={() => setMobileNavOpen(false)}
                                    >
                                        Info Terbaru
                                    </Link>
                                    <Link
                                        href={portalHref}
                                        prefetch="mount"
                                        className="rounded-full border border-(--school-green-100) bg-(--school-green-50)/85 px-3.5 py-2 text-sm font-semibold text-(--school-green-700)"
                                        onClick={() => setMobileNavOpen(false)}
                                    >
                                        {portalLabel}
                                    </Link>
                                </div>
                            </div>

                            <div className="mt-6 space-y-2">
                                {navigationItems.map((item) => {
                                    const submenuItems =
                                        getNavigationSubmenuItems(item);
                                    const hasChildren = submenuItems.length > 0;
                                    const active = isNavigationItemActive(
                                        currentPath,
                                        item,
                                    );
                                    const isExpanded =
                                        mobileExpanded === item.href;
                                    const presentation =
                                        getNavigationPresentation(item);

                                    return (
                                        <motion.div
                                            key={item.href}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.22,
                                                ease: 'easeOut',
                                            }}
                                        >
                                            {hasChildren ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setMobileExpanded(
                                                                isExpanded
                                                                    ? null
                                                                    : item.href,
                                                            )
                                                        }
                                                        className={cn(
                                                            'w-full rounded-[1.45rem] border px-4 py-4 text-left transition-all',
                                                            active
                                                                ? 'border-(--school-green-200) bg-white shadow-[0_18px_34px_-24px_rgba(4,47,46,0.2)]'
                                                                : 'border-transparent bg-white/60 hover:bg-white',
                                                        )}
                                                    >
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div>
                                                                <div
                                                                    className={cn(
                                                                        'text-base font-semibold',
                                                                        active
                                                                            ? 'text-(--school-green-700)'
                                                                            : 'text-(--school-ink)',
                                                                    )}
                                                                >
                                                                    {item.label}
                                                                </div>
                                                                <div className="mt-1 text-[0.68rem] font-bold tracking-[0.22em] text-(--school-green-700) uppercase">
                                                                    {
                                                                        presentation.eyebrow
                                                                    }
                                                                </div>
                                                            </div>
                                                            <ChevronDown
                                                                className={cn(
                                                                    'mt-1 size-4 shrink-0 transition-transform duration-200',
                                                                    active
                                                                        ? 'text-(--school-green-700)'
                                                                        : 'text-(--school-muted)',
                                                                    isExpanded &&
                                                                        'rotate-180',
                                                                )}
                                                            />
                                                        </div>
                                                    </button>
                                                    <AnimatePresence>
                                                        {isExpanded && (
                                                            <motion.div
                                                                initial={{
                                                                    height: 0,
                                                                    opacity: 0,
                                                                }}
                                                                animate={{
                                                                    height: 'auto',
                                                                    opacity: 1,
                                                                }}
                                                                exit={{
                                                                    height: 0,
                                                                    opacity: 0,
                                                                }}
                                                                transition={{
                                                                    duration: 0.2,
                                                                }}
                                                                className="overflow-hidden pt-2"
                                                            >
                                                                <div className="space-y-2 rounded-[1.4rem] border border-(--school-green-100) bg-white/80 p-2">
                                                                    {submenuItems.map(
                                                                        (
                                                                            child,
                                                                        ) => {
                                                                            const childActive =
                                                                                matchesCurrentPath(
                                                                                    currentPath,
                                                                                    child.href,
                                                                                );

                                                                            return (
                                                                                <Link
                                                                                    key={
                                                                                        child.href
                                                                                    }
                                                                                    href={
                                                                                        child.href
                                                                                    }
                                                                                    prefetch
                                                                                    className={cn(
                                                                                        'block rounded-[1.1rem] px-3.5 py-3 text-sm transition-all hover:bg-white hover:text-(--school-green-700)',
                                                                                        childActive
                                                                                            ? 'bg-(--school-green-50)/80 text-(--school-green-700)'
                                                                                            : 'text-(--school-muted)',
                                                                                    )}
                                                                                    onClick={() =>
                                                                                        setMobileNavOpen(
                                                                                            false,
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <div
                                                                                        className={cn(
                                                                                            'font-semibold',
                                                                                            childActive
                                                                                                ? 'text-(--school-green-700)'
                                                                                                : 'text-(--school-ink)',
                                                                                        )}
                                                                                    >
                                                                                        {
                                                                                            child.label
                                                                                        }
                                                                                    </div>
                                                                                </Link>
                                                                            );
                                                                        },
                                                                    )}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </>
                                            ) : (
                                                <Link
                                                    href={item.href}
                                                    prefetch
                                                    className={cn(
                                                        'block rounded-[1.45rem] border px-4 py-4 text-base transition-all hover:bg-white',
                                                        active
                                                            ? 'border-(--school-green-200) bg-white text-(--school-green-700) shadow-[0_18px_34px_-24px_rgba(4,47,46,0.2)]'
                                                            : 'border-transparent bg-white/60 text-(--school-ink)',
                                                    )}
                                                    onClick={() =>
                                                        setMobileNavOpen(false)
                                                    }
                                                >
                                                    <div className="font-semibold">
                                                        {item.label}
                                                    </div>
                                                    <div className="mt-1 text-[0.68rem] font-bold tracking-[0.22em] text-(--school-green-700) uppercase">
                                                        {presentation.eyebrow}
                                                    </div>
                                                </Link>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[1.35rem] border border-white/80 bg-white/72 px-4 py-3 text-xs font-medium text-(--school-muted)">
                                <a
                                    href={schoolContact.phoneHref}
                                    className="inline-flex items-center gap-2 transition-colors hover:text-(--school-ink)"
                                >
                                    <Phone className="size-3.5 text-(--school-green-700)" />
                                    {schoolContact.phone}
                                </a>
                                <div className="inline-flex items-center gap-2">
                                    <Clock3 className="size-3.5 text-amber-500" />
                                    {schoolContact.serviceHours}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                ) : null}
            </AnimatePresence>

            <main
                id="main-content"
                className="relative z-10 mx-auto max-w-336 px-5 py-8 md:px-8 md:py-10"
            >
                {children}
            </main>

            {/* ═══════════ FOOTER ═══════════ */}
            <footer className="relative z-10 overflow-hidden border-t border-white/30 bg-white/60 backdrop-blur-3xl">
                <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_bottom,var(--tw-gradient-stops))] from-(--school-green-50)/50 via-white/10 to-transparent" />

                <div className="relative z-10 mx-auto max-w-336 px-6 pt-14 pb-6 md:px-8">
                    <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,1fr)] xl:gap-6">
                        <div className="space-y-5">
                            <SchoolMark compact />
                            <p className="max-w-md text-sm leading-relaxed font-medium text-slate-500">
                                Gerbang informasi publik, layanan sekolah, dan
                                akses internal SMAN 1 Tenjo dalam struktur yang
                                lebih ringkas dan mudah dijelajahi.
                            </p>
                            <div className="flex flex-wrap gap-3 text-xs font-semibold text-slate-500">
                                <a
                                    href={schoolContact.phoneHref}
                                    className="inline-flex items-center gap-2 rounded-full border border-white/75 bg-white/80 px-3.5 py-2 transition-colors hover:text-(--school-green-700)"
                                >
                                    <Phone className="size-3.5 text-(--school-green-700)" />
                                    {schoolContact.phone}
                                </a>
                                <a
                                    href={`mailto:${schoolContact.email}`}
                                    className="inline-flex items-center gap-2 rounded-full border border-white/75 bg-white/80 px-3.5 py-2 transition-colors hover:text-sky-600"
                                >
                                    <Mail className="size-3.5 text-sky-500" />
                                    {schoolContact.email}
                                </a>
                            </div>
                            <div className="pt-1">
                                <SocialLinks />
                            </div>
                        </div>

                        <div>
                            <h3 className="mb-6 text-xs font-bold tracking-[0.25em] text-(--school-green-700) uppercase">
                                Jalur Cepat
                            </h3>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {footerQuickLinks.map((item) => (
                                    <Link
                                        key={`${item.href}-${item.label}`}
                                        href={item.href}
                                        prefetch
                                        className="group flex items-center justify-between rounded-[1.25rem] border border-white/80 bg-white/78 px-4 py-3 text-sm font-semibold text-slate-600 shadow-[0_16px_34px_-28px_rgba(4,47,46,0.28)] transition-all hover:-translate-y-0.5 hover:border-(--school-green-200) hover:bg-white hover:text-(--school-green-700)"
                                    >
                                        <span>{item.label}</span>
                                        <ChevronRight className="size-4 shrink-0 text-(--school-green-500) transition-transform group-hover:translate-x-0.5" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="mb-6 text-xs font-bold tracking-[0.25em] text-(--school-green-700) uppercase">
                                Kontak Resmi
                            </h3>
                            <div className="grid gap-3">
                                {footerServiceLinks.map((item) => (
                                    <Link
                                        key={`${item.href}-${item.label}`}
                                        href={item.href}
                                        prefetch
                                        className="group rounded-[1.4rem] border border-white/80 bg-white/78 p-4 shadow-[0_16px_34px_-28px_rgba(4,47,46,0.28)] transition-all hover:-translate-y-0.5 hover:border-(--school-green-200) hover:bg-white"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-semibold text-slate-700 transition-colors group-hover:text-(--school-green-700)">
                                                    {item.label}
                                                </p>
                                                <p className="mt-1 text-xs leading-relaxed font-medium text-slate-500">
                                                    {item.description}
                                                </p>
                                            </div>
                                            <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-(--school-green-500) transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            <div className="rounded-[1.6rem] border border-white/80 bg-white/78 p-5 shadow-[0_16px_34px_-28px_rgba(4,47,46,0.28)]">
                                <div className="space-y-4 text-sm font-medium text-slate-500">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="mt-0.5 size-4 shrink-0 text-amber-500" />
                                        <p className="leading-relaxed">
                                            {schoolContact.address}
                                        </p>
                                    </div>
                                    <a
                                        href={`mailto:${schoolContact.email}`}
                                        className="flex items-center gap-3 transition-colors hover:text-sky-600"
                                    >
                                        <Mail className="size-4 shrink-0 text-sky-500" />
                                        <span>{schoolContact.email}</span>
                                    </a>
                                    <a
                                        href={schoolContact.phoneHref}
                                        className="flex items-center gap-3 transition-colors hover:text-(--school-green-700)"
                                    >
                                        <Phone className="size-4 shrink-0 text-(--school-green-600)" />
                                        <span>{schoolContact.phone}</span>
                                    </a>
                                    <div className="flex items-center gap-3">
                                        <Clock3 className="size-4 shrink-0 text-amber-500" />
                                        <p>{schoolContact.serviceHours}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Copyright Section */}
                    <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200/60 pt-6 sm:flex-row">
                        <p className="text-xs font-medium text-slate-500 md:text-sm">
                            &copy; Hak Cipta SMAN 1 Tenjo Bogor 2026.
                        </p>
                        <p className="text-center text-[11px] font-semibold text-slate-400 mix-blend-multiply sm:text-right md:text-xs">
                            Dibuat oleh{' '}
                            <span className="font-bold text-slate-700">
                                Intra Sepriansa
                            </span>
                            .
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
