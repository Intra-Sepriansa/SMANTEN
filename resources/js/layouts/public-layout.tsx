import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ChevronDown,
    ChevronRight,
    Menu,
    X,
    MapPin,
    Mail,
    Phone,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Meteors } from '@/components/public/meteors';
import { SchoolMark } from '@/components/public/school-mark';
import { SocialLinks } from '@/components/public/social-links';
import { Button } from '@/components/ui/button';
import { publicNavigation } from '@/lib/public-content';
import type { NavItem } from '@/lib/public-content';
import { cn } from '@/lib/utils';
import { useSiteUiStore } from '@/stores/site-ui-store';

type PublicLayoutProps = {
    children: ReactNode;
};

function normalizeNavigationPath(href: string): string {
    const [path] = href.split('#');

    return path || '/';
}

function matchesCurrentPath(currentPath: string, href: string): boolean {
    const normalizedPath = normalizeNavigationPath(href);

    if (normalizedPath === '/') {
        return currentPath === '/';
    }

    return (
        currentPath === normalizedPath ||
        currentPath.startsWith(`${normalizedPath}/`)
    );
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    const page = usePage<{ auth?: { user?: { name?: string } | null } }>();
    const { auth } = page.props;
    const mobileNavOpen = useSiteUiStore((state) => state.mobileNavOpen);
    const setMobileNavOpen = useSiteUiStore((state) => state.setMobileNavOpen);
    const currentPath = page.url.split('?')[0] || '/';

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

    const handleNavEnter = useCallback((item: NavItem) => {
        if (dropdownTimeoutRef.current) {
            clearTimeout(dropdownTimeoutRef.current);
        }

        setHoveredNav(item.href);

        if (item.children) {
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

    return (
        <div className="min-h-screen bg-[var(--page-bg)] text-[var(--school-ink)]">
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(15,118,110,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.11),transparent_28%)]" />
            <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(90deg,rgba(15,118,110,0.05)_1px,transparent_1px),linear-gradient(rgba(15,118,110,0.05)_1px,transparent_1px)] bg-[size:84px_84px] opacity-50" />
            <Meteors number={40} />

            <a
                href="#main-content"
                className="absolute top-4 left-1/2 z-[100] -translate-x-1/2 -translate-y-24 rounded-full bg-[var(--school-green-700)] px-6 py-2.5 text-sm font-semibold text-white shadow-xl transition focus:-translate-y-0 focus:ring-4 focus:ring-[var(--school-green-200)] focus:outline-none"
            >
                Lompat ke konten utama
            </a>

            {/* ═══════════ HEADER / NAVBAR ═══════════ */}
            <header
                className={cn(
                    'sticky top-0 z-50 border-b bg-[rgba(250,247,238,0.85)] backdrop-blur-xl transition-all duration-500',
                    scrolled
                        ? 'border-white/40 shadow-[0_8px_30px_-12px_rgba(4,47,46,0.18)]'
                        : 'border-white/60 shadow-none',
                )}
            >
                <div className="mx-auto flex max-w-[84rem] items-center justify-between gap-6 px-5 py-3 md:px-8 md:py-4">
                    <Link
                        href="/"
                        className="min-w-0 transition-transform duration-300 hover:scale-[1.02]"
                    >
                        <SchoolMark compact={currentPath !== '/'} />
                    </Link>

                    {/* ─── Desktop Nav ─── */}
                    <nav
                        className="hidden items-center gap-0.5 lg:flex"
                        onMouseLeave={handleNavLeave}
                    >
                        {publicNavigation.map((item) => {
                            const active =
                                matchesCurrentPath(currentPath, item.href) ||
                                item.children?.some((child) =>
                                    matchesCurrentPath(currentPath, child.href),
                                ) === true;
                            const isHovered = hoveredNav === item.href;
                            const hasChildren = !!item.children;
                            const isOpen = openDropdown === item.href;

                            return (
                                <div key={item.href} className="relative">
                                    <Link
                                        href={item.href}
                                        onMouseEnter={() =>
                                            handleNavEnter(item)
                                        }
                                        className={cn(
                                            'relative flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200',
                                            active || isHovered
                                                ? 'text-[var(--school-green-700)]'
                                                : 'text-[var(--school-muted)] hover:text-[var(--school-ink)]',
                                        )}
                                    >
                                        {isHovered && (
                                            <motion.div
                                                layoutId="nav-hover-pill"
                                                className="absolute inset-0 rounded-full bg-white/80 shadow-sm"
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
                                                className="absolute inset-0 rounded-full bg-white shadow-[0_8px_30px_-12px_rgba(15,118,110,0.5)]"
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 400,
                                                    damping: 30,
                                                }}
                                            />
                                        )}
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

                                    {/* Dropdown */}
                                    <AnimatePresence>
                                        {hasChildren && isOpen && (
                                            <motion.div
                                                initial={{
                                                    opacity: 0,
                                                    y: 8,
                                                    scale: 0.97,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                    scale: 1,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    y: 8,
                                                    scale: 0.97,
                                                }}
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 500,
                                                    damping: 35,
                                                }}
                                                onMouseEnter={
                                                    handleDropdownEnter
                                                }
                                                onMouseLeave={
                                                    handleDropdownLeave
                                                }
                                                className="absolute top-full left-0 z-50 mt-2 w-72 origin-top-left overflow-hidden rounded-2xl border border-white/70 bg-[rgba(250,247,238,0.97)] shadow-[0_24px_60px_-24px_rgba(4,47,46,0.25)] backdrop-blur-xl"
                                            >
                                                <div className="p-2">
                                                    {item.children!.map(
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
                                                                    className={cn(
                                                                        'group flex flex-col rounded-xl px-4 py-3 transition-colors hover:bg-white',
                                                                        childActive &&
                                                                            'bg-white',
                                                                    )}
                                                                    onClick={() =>
                                                                        setOpenDropdown(
                                                                            null,
                                                                        )
                                                                    }
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <span
                                                                            className={cn(
                                                                                'text-sm font-semibold transition-colors group-hover:text-[var(--school-green-700)]',
                                                                                childActive
                                                                                    ? 'text-[var(--school-green-700)]'
                                                                                    : 'text-[var(--school-ink)]',
                                                                            )}
                                                                        >
                                                                            {
                                                                                child.label
                                                                            }
                                                                        </span>
                                                                        <ChevronRight
                                                                            className={cn(
                                                                                'size-3.5 transition-all group-hover:translate-x-0.5 group-hover:text-[var(--school-green-700)] group-hover:opacity-100',
                                                                                childActive
                                                                                    ? 'text-[var(--school-green-700)] opacity-100'
                                                                                    : 'text-[var(--school-muted)] opacity-0',
                                                                            )}
                                                                        />
                                                                    </div>
                                                                    {child.description && (
                                                                        <span className="mt-0.5 text-[0.72rem] leading-relaxed text-[var(--school-muted)]">
                                                                            {
                                                                                child.description
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </Link>
                                                            );
                                                        },
                                                    )}
                                                </div>
                                                {/* Footer link */}
                                                <div className="border-t border-black/[0.04] bg-white/50 px-4 py-3">
                                                    <Link
                                                        href={item.href}
                                                        className="flex items-center gap-1.5 text-xs font-bold text-[var(--school-green-700)] transition-colors hover:text-[var(--school-green-600)]"
                                                        onClick={() =>
                                                            setOpenDropdown(
                                                                null,
                                                            )
                                                        }
                                                    >
                                                        Lihat semua {item.label}
                                                        <ChevronRight className="size-3" />
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </nav>

                    <div className="hidden items-center gap-3 lg:flex">
                        <Button
                            asChild
                            variant="outline"
                            className="group rounded-full border-[var(--school-green-200)] bg-white/70 px-5 transition-all hover:bg-white hover:shadow-[0_4px_20px_-8px_rgba(15,118,110,0.3)]"
                        >
                            <Link href={auth?.user ? '/dashboard' : '/login'}>
                                {auth?.user ? 'Dashboard' : 'Masuk Portal'}
                            </Link>
                        </Button>
                        <Button
                            asChild
                            className="group rounded-full bg-[var(--school-green-700)] px-6 text-white shadow-[0_4px_20px_-8px_rgba(15,118,110,0.6)] transition-all hover:scale-105 hover:bg-[var(--school-green-600)]"
                        >
                            <Link href="/ppdb">Cek Zona PPDB</Link>
                        </Button>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-full border-white/70 bg-white/80 lg:hidden"
                        onClick={() => setMobileNavOpen(!mobileNavOpen)}
                    >
                        {mobileNavOpen ? (
                            <X className="size-4" />
                        ) : (
                            <Menu className="size-4" />
                        )}
                    </Button>
                </div>
            </header>

            {/* ═══════════ MOBILE NAV ═══════════ */}
            <AnimatePresence>
                {mobileNavOpen ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-[rgba(4,47,46,0.32)] backdrop-blur-sm lg:hidden"
                    >
                        <motion.div
                            initial={{ y: -24, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -24, opacity: 0 }}
                            className="mx-4 mt-24 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-[2rem] border border-white/80 bg-[rgba(250,247,238,0.96)] p-6 shadow-[0_32px_90px_-46px_rgba(4,47,46,0.65)]"
                        >
                            <div className="space-y-1">
                                {publicNavigation.map((item) => {
                                    const hasChildren = !!item.children;
                                    const active =
                                        matchesCurrentPath(
                                            currentPath,
                                            item.href,
                                        ) ||
                                        item.children?.some((child) =>
                                            matchesCurrentPath(
                                                currentPath,
                                                child.href,
                                            ),
                                        ) === true;
                                    const isExpanded =
                                        mobileExpanded === item.href;

                                    return (
                                        <div key={item.href}>
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
                                                            'flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-base font-medium transition-colors hover:bg-white',
                                                            active
                                                                ? 'bg-white text-[var(--school-green-700)]'
                                                                : 'text-[var(--school-ink)]',
                                                        )}
                                                    >
                                                        <span>
                                                            {item.label}
                                                        </span>
                                                        <ChevronDown
                                                            className={cn(
                                                                'size-4 transition-transform duration-200',
                                                                active
                                                                    ? 'text-[var(--school-green-700)]'
                                                                    : 'text-[var(--school-muted)]',
                                                                isExpanded &&
                                                                    'rotate-180',
                                                            )}
                                                        />
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
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="ml-4 space-y-0.5 border-l-2 border-[var(--school-green-200)] pb-2 pl-4">
                                                                    {item.children!.map(
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
                                                                                    className={cn(
                                                                                        'block rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-white hover:text-[var(--school-green-700)]',
                                                                                        childActive
                                                                                            ? 'bg-white text-[var(--school-green-700)]'
                                                                                            : 'text-[var(--school-muted)]',
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
                                                                                                ? 'text-[var(--school-green-700)]'
                                                                                                : 'text-[var(--school-ink)]',
                                                                                        )}
                                                                                    >
                                                                                        {
                                                                                            child.label
                                                                                        }
                                                                                    </div>
                                                                                    {child.description && (
                                                                                        <div className="mt-0.5 text-xs text-[var(--school-muted)]">
                                                                                            {
                                                                                                child.description
                                                                                            }
                                                                                        </div>
                                                                                    )}
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
                                                    className={cn(
                                                        'block rounded-2xl px-4 py-3 text-base font-medium hover:bg-white',
                                                        active
                                                            ? 'bg-white text-[var(--school-green-700)]'
                                                            : 'text-[var(--school-ink)]',
                                                    )}
                                                    onClick={() =>
                                                        setMobileNavOpen(false)
                                                    }
                                                >
                                                    {item.label}
                                                </Link>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-6 grid gap-3">
                                <Button
                                    asChild
                                    variant="outline"
                                    className="rounded-full border-[var(--school-green-200)] bg-white"
                                >
                                    <Link
                                        href={
                                            auth?.user ? '/dashboard' : '/login'
                                        }
                                    >
                                        {auth?.user
                                            ? 'Dashboard'
                                            : 'Masuk Portal'}
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    className="rounded-full bg-[var(--school-green-700)] text-white hover:bg-[var(--school-green-600)]"
                                >
                                    <Link href="/ppdb">Cek Zona PPDB</Link>
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                ) : null}
            </AnimatePresence>

            <main
                id="main-content"
                className="relative z-10 mx-auto max-w-[84rem] px-5 py-8 md:px-8 md:py-10"
            >
                {children}
            </main>

            {/* ═══════════ FOOTER ═══════════ */}
            <footer className="relative z-10 overflow-hidden border-t border-white/30 bg-white/60 backdrop-blur-3xl">
                <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[var(--school-green-50)]/50 via-white/10 to-transparent" />

                <div className="relative z-10 mx-auto max-w-[84rem] px-6 pt-16 pb-8 md:px-8">
                    <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr] lg:gap-8">
                        <div className="space-y-6">
                            <SchoolMark />
                            <p className="max-w-sm text-sm leading-relaxed font-medium text-slate-500">
                                Portal layanan informasi dan manajemen sekolah
                                terpadu SMAN 1 Tenjo, dirancang secara mutakhir
                                untuk mendukung operasional internal dan
                                transparansi publik secara digital.
                            </p>
                            <div className="pt-2">
                                <SocialLinks />
                            </div>
                        </div>

                        <div>
                            <h3 className="mb-6 text-xs font-bold tracking-[0.25em] text-[var(--school-green-700)] uppercase">
                                Navigasi
                            </h3>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-1 md:gap-y-4">
                                {publicNavigation.map((item) => (
                                    <div
                                        key={item.href}
                                        className="group flex items-center"
                                    >
                                        <ChevronRight className="mr-2 size-3 text-[var(--school-green-500)] opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                                        <Link
                                            href={item.href}
                                            className="text-sm font-semibold text-slate-600 transition-colors group-hover:text-[var(--school-green-700)]"
                                        >
                                            {item.label}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="mb-6 text-xs font-bold tracking-[0.25em] text-[var(--school-green-700)] uppercase">
                                Kontak Informasi
                            </h3>
                            <div className="space-y-4 text-sm font-medium text-slate-500">
                                <div className="flex items-start gap-3">
                                    <MapPin className="mt-0.5 size-4 shrink-0 text-amber-500" />
                                    <p className="leading-relaxed">
                                        JL. Raya Tenjo - Parung Panjang KM. 03,
                                        <br />
                                        Babakan, Tenjo, Kab. Bogor 16340
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="size-4 shrink-0 text-sky-500" />
                                    <p>smantenjo@yahoo.com</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="size-4 shrink-0 text-[var(--school-green-600)]" />
                                    <p>021-5976-1066</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Copyright Section */}
                    <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-200/60 pt-8 sm:flex-row">
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
