import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Activity,
    ArrowUpRight,
    BarChart3,
    ChevronDown,
    ChevronRight,
    Clock3,
    MapPin,
    Mail,
    Menu,
    Phone,
    Sparkles,
    X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import FlowingMenu from '@/components/FlowingMenu';
import type { FlowingMenuItemData } from '@/components/FlowingMenu';
import { GlobalCommandPalette } from '@/components/global-command-palette';
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
    heroImage: string;
    heroImagePosition?: string;
    menuImagePositions?: string[];
    menuImageSize?: string;
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
        heroImage: '/images/sekolah/guru_mengajar.jpg',
        heroImagePosition: 'center 34%',
    },
    '/profil': {
        eyebrow: 'Profil',
        summary:
            'Identitas, sejarah, visi-misi, fasilitas, dan prestasi sekolah.',
        accentClassName:
            'bg-[linear-gradient(155deg,rgba(15,118,110,0.18),rgba(255,255,255,0.96),rgba(251,191,36,0.18))]',
        heroImage: '/images/profil/hero-banner.png',
        heroImagePosition: 'center 24%',
        menuImagePositions: [
            '12% 22%',
            '36% 26%',
            '58% 34%',
            '28% 66%',
            '78% 58%',
        ],
        menuImageSize: '185%',
    },
    '/akademik': {
        eyebrow: 'Akademik',
        summary: 'Kurikulum, pembelajaran, P5, dan data akademik utama.',
        accentClassName:
            'bg-[linear-gradient(155deg,rgba(14,165,233,0.18),rgba(255,255,255,0.96),rgba(15,118,110,0.18))]',
        heroImage: '/images/akademik/hero.png',
        heroImagePosition: 'center 30%',
        menuImagePositions: ['10% 26%', '42% 24%', '74% 46%'],
        menuImageSize: '190%',
    },
    '/kesiswaan': {
        eyebrow: 'Kesiswaan',
        summary: 'OSIS, MPK, prestasi, beasiswa, BK, dan ekstrakurikuler.',
        accentClassName:
            'bg-[linear-gradient(155deg,rgba(5,150,105,0.18),rgba(255,255,255,0.96),rgba(251,191,36,0.16))]',
        heroImage: '/images/sekolah/kegiatan_siswa.jpg',
        heroImagePosition: 'center 38%',
        menuImagePositions: [
            '10% 18%',
            '28% 24%',
            '52% 34%',
            '74% 44%',
            '44% 72%',
            '18% 62%',
        ],
        menuImageSize: '190%',
    },
    '/ppdb': {
        eyebrow: 'PPDB',
        summary: 'Informasi pendaftaran, zonasi, alur, dan akses PPDB.',
        accentClassName:
            'bg-[linear-gradient(155deg,rgba(245,158,11,0.18),rgba(255,255,255,0.96),rgba(34,197,94,0.18))]',
        heroImage: '/images/profil/hero-banner.png',
        heroImagePosition: 'center 30%',
    },
    '/media': {
        eyebrow: 'Dokumentasi',
        summary: 'Galeri foto dan video sekolah yang ringkas.',
        accentClassName:
            'bg-[linear-gradient(155deg,rgba(14,165,233,0.18),rgba(255,255,255,0.96),rgba(16,185,129,0.16))]',
        heroImage: '/images/sekolah/kegiatan_siswa.jpg',
        heroImagePosition: 'center 42%',
        menuImagePositions: ['12% 30%', '44% 24%', '70% 34%', '28% 68%'],
        menuImageSize: '185%',
    },
    '/layanan': {
        eyebrow: 'Layanan',
        summary: 'FAQ, kontak, dan layanan publik sekolah.',
        accentClassName:
            'bg-[linear-gradient(155deg,rgba(16,185,129,0.18),rgba(255,255,255,0.96),rgba(124,58,237,0.14))]',
        heroImage: '/images/sekolah/murid_belajar.jpg',
        heroImagePosition: 'center 34%',
    },
    '/dokumen': {
        eyebrow: 'Dokumen',
        summary: 'Unduhan, formulir, dan panduan resmi sekolah.',
        accentClassName:
            'bg-[linear-gradient(155deg,rgba(15,118,110,0.18),rgba(255,255,255,0.96),rgba(251,191,36,0.16))]',
        heroImage: '/images/profil/sarana.png',
        heroImagePosition: 'center 42%',
    },
    '/berita': {
        eyebrow: 'Berita',
        summary: 'Rilis, artikel, dan informasi terbaru sekolah.',
        accentClassName:
            'bg-[linear-gradient(155deg,rgba(2,132,199,0.16),rgba(255,255,255,0.96),rgba(147,197,253,0.18))]',
        heroImage: '/images/sekolah/kegiatan_siswa.jpg',
        heroImagePosition: 'center 34%',
    },
    '/organisasi': {
        eyebrow: 'Komunitas',
        summary: 'Struktur sekolah, guru, alumni, dan virtual tour.',
        accentClassName:
            'bg-[linear-gradient(155deg,rgba(124,58,237,0.16),rgba(255,255,255,0.96),rgba(15,118,110,0.16))]',
        heroImage: '/images/sekolah/guru_mengajar.jpg',
        heroImagePosition: 'center 38%',
        menuImagePositions: [
            '14% 26%',
            '34% 30%',
            '58% 28%',
            '78% 48%',
            '48% 72%',
        ],
        menuImageSize: '190%',
    },
};

const DESKTOP_DROPDOWN_WIDTH_CLASS =
    'w-[min(46rem,calc(100vw-2.5rem))] max-w-[calc(100vw-2.5rem)]';

const DEFAULT_FLOWING_MENU_POSITIONS = [
    '12% 22%',
    '34% 30%',
    '58% 26%',
    '78% 48%',
    '46% 72%',
    '18% 62%',
] as const;

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

function getMobileSubmenuId(href: string): string {
    const normalizedHref = normalizeNavigationHref(href);
    const submenuKey =
        normalizedHref
            .replace(/[^a-z0-9]+/gi, '-')
            .replace(/^-|-$/g, '')
            .toLowerCase() || 'root';

    return `mobile-submenu-${submenuKey}`;
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
            heroImage: '/images/sekolah/guru_mengajar.jpg',
            heroImagePosition: 'center 34%',
        }
    );
}

function buildDesktopFlowingMenuItems(
    currentPath: string,
    submenuItems: NonNullable<NavItem['children']>,
    presentation: NavigationPresentation,
): FlowingMenuItemData[] {
    const imagePositions =
        presentation.menuImagePositions &&
        presentation.menuImagePositions.length > 0
            ? presentation.menuImagePositions
            : [...DEFAULT_FLOWING_MENU_POSITIONS];

    return submenuItems.map((child, index) => ({
        link: child.href,
        text: child.label,
        image: presentation.heroImage,
        imagePosition: imagePositions[index % imagePositions.length],
        imageSize: presentation.menuImageSize ?? '180%',
        isActive: matchesCurrentPath(currentPath, child.href),
    }));
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    const page = usePage<{
        auth?: { user?: { name?: string } | null };
        publicRealtime?: {
            liveOnline: number;
            totalVisits: number;
            todayVisits: number;
            totalVisitors: number;
            todayVisitors: number;
            pageViews: number;
            todayPageViews: number;
            windowMinutes: number;
            lastUpdatedAt: string;
        };
        siteSettings?: SharedSiteSettings;
    }>();
    const { auth } = page.props;
    const publicRealtime = page.props.publicRealtime ?? {
        liveOnline: 0,
        totalVisits: 0,
        todayVisits: 0,
        totalVisitors: 0,
        todayVisitors: 0,
        pageViews: 0,
        todayPageViews: 0,
        windowMinutes: 5,
        lastUpdatedAt: new Date().toISOString(),
    };
    const numberFormatter = useMemo(() => new Intl.NumberFormat('id-ID'), []);
    const realtimeUpdatedAt = useMemo(
        () =>
            new Intl.DateTimeFormat('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
            }).format(new Date(publicRealtime.lastUpdatedAt)),
        [publicRealtime.lastUpdatedAt],
    );
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

    const closeMobileNavigation = useCallback(() => {
        setMobileNavOpen(false);
        setMobileExpanded(null);
        setOpenDropdown(null);
        setHoveredNav(null);
    }, [setMobileNavOpen]);

    useEffect(() => {
        const resetNavigationState = window.setTimeout(() => {
            closeMobileNavigation();
        }, 0);

        return () => {
            window.clearTimeout(resetNavigationState);
        };
    }, [closeMobileNavigation, currentPath]);

    const toggleMobileSection = useCallback((href: string) => {
        setMobileExpanded((currentExpanded) =>
            currentExpanded === href ? null : href,
        );
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
                            <GlobalCommandPalette
                                triggerLabel="Cari"
                                triggerClassName="group inline-flex items-center gap-2 rounded-full border border-white/75 bg-white/80 px-3.5 py-1.5 text-[0.72rem] font-semibold text-(--school-ink) shadow-[0_10px_26px_-18px_rgba(4,47,46,0.24)] transition-all hover:-translate-y-0.5 hover:bg-white"
                            />
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
                                const flowingMenuItems =
                                    buildDesktopFlowingMenuItems(
                                        currentPath,
                                        submenuItems,
                                        presentation,
                                    );
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
                                                                'relative min-h-[24rem] overflow-hidden px-5 py-5',
                                                                presentation.accentClassName,
                                                            )}
                                                        >
                                                            <img
                                                                src={
                                                                    presentation.heroImage
                                                                }
                                                                alt=""
                                                                aria-hidden="true"
                                                                className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-28 mix-blend-multiply"
                                                                style={{
                                                                    objectPosition:
                                                                        presentation.heroImagePosition ??
                                                                        'center',
                                                                }}
                                                            />
                                                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.75),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(15,118,110,0.14),transparent_48%)]" />
                                                            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgba(255,255,255,0.66),rgba(255,255,255,0.18),rgba(250,247,238,0.88))]" />
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
                                                            <FlowingMenu
                                                                items={
                                                                    flowingMenuItems
                                                                }
                                                                speed={13}
                                                                textColor="#315061"
                                                                bgColor="rgba(255,255,255,0.72)"
                                                                marqueeBgColor="rgba(250,247,238,0.96)"
                                                                marqueeTextColor="#12232d"
                                                                borderColor="rgba(148,163,184,0.18)"
                                                                className="min-h-[24rem] rounded-[1.55rem] border border-white/75 bg-white/82 shadow-[0_18px_42px_-30px_rgba(4,47,46,0.18)]"
                                                                onItemClick={() =>
                                                                    setOpenDropdown(
                                                                        null,
                                                                    )
                                                                }
                                                            />
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
                        className="touch-manipulation rounded-full border-white/75 bg-white/82 shadow-[0_16px_34px_-22px_rgba(4,47,46,0.24)] lg:hidden"
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
                        className="fixed inset-0 z-60 bg-[rgba(4,47,46,0.36)] backdrop-blur-md lg:hidden"
                        onClick={closeMobileNavigation}
                    >
                        <motion.div
                            initial={{ y: -24, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -24, opacity: 0 }}
                            className="mx-4 mt-4 max-h-[calc(100dvh-2rem)] touch-pan-y overflow-y-auto overscroll-contain rounded-4xl border border-white/80 bg-[rgba(250,247,238,0.97)] p-4 shadow-[0_32px_90px_-46px_rgba(4,47,46,0.65)] md:mx-8"
                            onClick={(event) => event.stopPropagation()}
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

                                    <button
                                        type="button"
                                        className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/85 text-(--school-green-700) shadow-[0_16px_34px_-24px_rgba(4,47,46,0.24)] touch-manipulation transition-colors hover:bg-white"
                                        onClick={closeMobileNavigation}
                                        aria-label="Tutup menu"
                                    >
                                        <X className="size-5" />
                                    </button>
                                </div>

                                <div className="mt-5 flex flex-wrap gap-2">
                                    <Link
                                        href="/berita"
                                        prefetch
                                        className="touch-manipulation rounded-full border border-white/80 bg-white/82 px-3.5 py-2 text-sm font-semibold text-(--school-ink)"
                                        onClick={closeMobileNavigation}
                                    >
                                        Info Terbaru
                                    </Link>
                                    <Link
                                        href={portalHref}
                                        prefetch="mount"
                                        className="touch-manipulation rounded-full border border-(--school-green-100) bg-(--school-green-50)/85 px-3.5 py-2 text-sm font-semibold text-(--school-green-700)"
                                        onClick={closeMobileNavigation}
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
                                    const submenuId =
                                        getMobileSubmenuId(item.href);
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
                                                    <div
                                                        className={cn(
                                                            'overflow-hidden rounded-[1.45rem] border transition-all',
                                                            active ||
                                                                isExpanded
                                                                ? 'border-(--school-green-200) bg-white shadow-[0_18px_34px_-24px_rgba(4,47,46,0.2)]'
                                                                : 'border-transparent bg-white/60 hover:bg-white',
                                                        )}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                toggleMobileSection(
                                                                    item.href,
                                                                )
                                                            }
                                                            className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left touch-manipulation"
                                                            aria-label={`${
                                                                isExpanded
                                                                    ? 'Tutup'
                                                                    : 'Buka'
                                                            } submenu ${item.label}`}
                                                            aria-controls={
                                                                submenuId
                                                            }
                                                            aria-expanded={
                                                                isExpanded
                                                            }
                                                        >
                                                            <div className="min-w-0 flex-1">
                                                                <div
                                                                    className={cn(
                                                                        'text-base font-semibold',
                                                                        active ||
                                                                            isExpanded
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
                                                            <span
                                                                className={cn(
                                                                    'mt-1 inline-flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors',
                                                                    active ||
                                                                        isExpanded
                                                                        ? 'border-(--school-green-100) bg-(--school-green-50) text-(--school-green-700)'
                                                                        : 'border-black/5 bg-white/82 text-(--school-muted)',
                                                                )}
                                                            >
                                                                <ChevronDown
                                                                    className={cn(
                                                                        'size-4 shrink-0 transition-transform duration-200',
                                                                        isExpanded &&
                                                                            'rotate-180',
                                                                    )}
                                                                />
                                                            </span>
                                                        </button>
                                                    </div>
                                                    <AnimatePresence>
                                                        {isExpanded && (
                                                            <motion.div
                                                                id={submenuId}
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
                                                                className="overflow-hidden border-t border-black/5 px-2 pb-2"
                                                            >
                                                                <div className="space-y-2 pt-2">
                                                                    <Link
                                                                        href={
                                                                            item.href
                                                                        }
                                                                        prefetch
                                                                        className="flex items-center justify-between rounded-[1.1rem] border border-(--school-green-100) bg-(--school-green-50)/85 px-3.5 py-3 text-sm font-semibold text-(--school-green-700) touch-manipulation transition-all hover:bg-white"
                                                                        onClick={
                                                                            closeMobileNavigation
                                                                        }
                                                                    >
                                                                        <span>
                                                                            Masuk
                                                                            ke{' '}
                                                                            {
                                                                                item.label
                                                                            }
                                                                        </span>
                                                                        <ArrowUpRight className="size-4 shrink-0" />
                                                                    </Link>
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
                                                                                        'block rounded-[1.1rem] px-3.5 py-3 text-sm touch-manipulation transition-all hover:bg-white hover:text-(--school-green-700)',
                                                                                        childActive
                                                                                            ? 'bg-(--school-green-50)/80 text-(--school-green-700)'
                                                                                            : 'text-(--school-muted)',
                                                                                    )}
                                                                                    onClick={
                                                                                        closeMobileNavigation
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
                                                        'block rounded-[1.45rem] border px-4 py-4 text-base touch-manipulation transition-all hover:bg-white',
                                                        active
                                                            ? 'border-(--school-green-200) bg-white text-(--school-green-700) shadow-[0_18px_34px_-24px_rgba(4,47,46,0.2)]'
                                                            : 'border-transparent bg-white/60 text-(--school-ink)',
                                                    )}
                                                    onClick={
                                                        closeMobileNavigation
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

                    <div className="mt-8 flex justify-center">
                        <div className="w-full max-w-5xl rounded-[1.75rem] border border-white/80 bg-white/88 p-3 shadow-[0_28px_80px_-48px_rgba(4,47,46,0.42)] ring-1 ring-slate-900/5 backdrop-blur-2xl">
                            <div className="grid gap-3 lg:grid-cols-[1.08fr_0.92fr_0.78fr]">
                                <div className="relative overflow-hidden rounded-[1.25rem] border border-emerald-100 bg-[linear-gradient(135deg,rgba(236,253,245,0.96),rgba(255,255,255,0.98))] p-4">
                                    <div className="pointer-events-none absolute -top-10 -right-8 size-28 rounded-full bg-emerald-200/45 blur-2xl" />
                                    <div className="relative flex items-start justify-between gap-4">
                                        <div>
                                            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/85 px-3 py-1 text-[0.68rem] font-black tracking-[0.16em] text-emerald-700 uppercase">
                                                <span className="relative flex size-2.5">
                                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                                                    <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
                                                </span>
                                                Realtime
                                            </div>
                                            <div className="mt-4 text-[0.7rem] font-black tracking-[0.22em] text-slate-500 uppercase">
                                                Live online
                                            </div>
                                            <div className="mt-1 flex items-end gap-2">
                                                <span className="text-4xl font-black tracking-tight text-slate-950">
                                                    {numberFormatter.format(
                                                        publicRealtime.liveOnline,
                                                    )}
                                                </span>
                                                <span className="pb-1 text-xs font-bold text-slate-500">
                                                    aktif
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/25">
                                            <Activity className="size-5" />
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-[1.25rem] border border-sky-100 bg-white p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="text-[0.7rem] font-black tracking-[0.22em] text-slate-500 uppercase">
                                                Total pengunjung
                                            </div>
                                            <div className="mt-2 flex items-center gap-2">
                                                <span className="rounded-xl bg-slate-950 px-3 py-1 font-mono text-xs font-bold tracking-[0.14em] text-white">
                                                    VISITOR
                                                </span>
                                                <span className="text-3xl font-black tracking-tight text-slate-950">
                                                    {numberFormatter.format(
                                                        publicRealtime.totalVisitors,
                                                    )}
                                                </span>
                                            </div>
                                            <div className="mt-3 text-xs font-semibold text-slate-500">
                                                Dari cookie pengunjung publik
                                                yang tercatat di server.
                                            </div>
                                        </div>
                                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-500/25">
                                            <BarChart3 className="size-5" />
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-[1.25rem] border border-amber-100 bg-[linear-gradient(135deg,#ffffff,rgba(255,251,235,0.96))] p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="text-[0.7rem] font-black tracking-[0.22em] text-slate-500 uppercase">
                                                Pengunjung hari ini
                                            </div>
                                            <div className="mt-1 text-3xl font-black tracking-tight text-slate-950">
                                                {numberFormatter.format(
                                                    publicRealtime.todayVisitors,
                                                )}
                                            </div>
                                            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/85 px-3 py-1 text-[0.68rem] font-bold text-slate-500">
                                                <Clock3 className="size-3.5 text-amber-500" />
                                                Update {realtimeUpdatedAt} •{' '}
                                                {publicRealtime.windowMinutes}{' '}
                                                menit
                                            </div>
                                        </div>
                                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/25">
                                            <Sparkles className="size-5" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
