import { AnimatePresence, motion } from 'framer-motion';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { SchoolMark } from '@/components/public/school-mark';
import { SocialLinks } from '@/components/public/social-links';
import { Button } from '@/components/ui/button';
import { Meteors } from '@/components/public/meteors';
import { publicNavigation, type NavItem } from '@/lib/public-content';
import { cn } from '@/lib/utils';
import { useSiteUiStore } from '@/stores/site-ui-store';

type PublicLayoutProps = {
    children: ReactNode;
};

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
    const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Scroll detection for header shadow
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 16);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (typeof document === 'undefined') return;
        document.body.style.overflow = mobileNavOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileNavOpen]);

    const handleNavEnter = useCallback((item: NavItem) => {
        if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
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
        if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
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
                className="absolute left-1/2 top-4 -translate-x-1/2 -translate-y-24 rounded-full bg-[var(--school-green-700)] px-6 py-2.5 text-sm font-semibold text-white shadow-xl transition focus:-translate-y-0 focus:outline-none focus:ring-4 focus:ring-[var(--school-green-200)] z-[100]"
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
                    <Link href="/" className="min-w-0 transition-transform duration-300 hover:scale-[1.02]">
                        <SchoolMark compact={currentPath !== '/'} />
                    </Link>

                    {/* ─── Desktop Nav ─── */}
                    <nav
                        className="hidden items-center gap-0.5 lg:flex"
                        onMouseLeave={handleNavLeave}
                    >
                        {publicNavigation.map((item) => {
                            const active = currentPath === item.href || currentPath.startsWith(item.href + '/') || currentPath.startsWith(item.href + '#');
                            const isHovered = hoveredNav === item.href;
                            const hasChildren = !!item.children;
                            const isOpen = openDropdown === item.href;

                            return (
                                <div key={item.href} className="relative">
                                    <Link
                                        href={item.href}
                                        onMouseEnter={() => handleNavEnter(item)}
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
                                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                            />
                                        )}
                                        {active && !isHovered && (
                                            <motion.div
                                                layoutId="nav-active-indicator"
                                                className="absolute inset-0 rounded-full bg-white shadow-[0_8px_30px_-12px_rgba(15,118,110,0.5)]"
                                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                            />
                                        )}
                                        <span className="relative z-10">{item.label}</span>
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
                                                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                                                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                                onMouseEnter={handleDropdownEnter}
                                                onMouseLeave={handleDropdownLeave}
                                                className="absolute left-0 top-full z-50 mt-2 w-72 origin-top-left overflow-hidden rounded-2xl border border-white/70 bg-[rgba(250,247,238,0.97)] shadow-[0_24px_60px_-24px_rgba(4,47,46,0.25)] backdrop-blur-xl"
                                            >
                                                <div className="p-2">
                                                    {item.children!.map((child) => (
                                                        <Link
                                                            key={child.href}
                                                            href={child.href}
                                                            className="group flex flex-col rounded-xl px-4 py-3 transition-colors hover:bg-white"
                                                            onClick={() => setOpenDropdown(null)}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-semibold text-[var(--school-ink)] transition-colors group-hover:text-[var(--school-green-700)]">
                                                                    {child.label}
                                                                </span>
                                                                <ChevronRight className="size-3.5 text-[var(--school-muted)] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-[var(--school-green-700)] group-hover:opacity-100" />
                                                            </div>
                                                            {child.description && (
                                                                <span className="mt-0.5 text-[0.72rem] leading-relaxed text-[var(--school-muted)]">
                                                                    {child.description}
                                                                </span>
                                                            )}
                                                        </Link>
                                                    ))}
                                                </div>
                                                {/* Footer link */}
                                                <div className="border-t border-black/[0.04] bg-white/50 px-4 py-3">
                                                    <Link
                                                        href={item.href}
                                                        className="flex items-center gap-1.5 text-xs font-bold text-[var(--school-green-700)] transition-colors hover:text-[var(--school-green-600)]"
                                                        onClick={() => setOpenDropdown(null)}
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
                        {mobileNavOpen ? <X className="size-4" /> : <Menu className="size-4" />}
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
                                    const isExpanded = mobileExpanded === item.href;

                                    return (
                                        <div key={item.href}>
                                            {hasChildren ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => setMobileExpanded(isExpanded ? null : item.href)}
                                                        className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-base font-medium text-[var(--school-ink)] transition-colors hover:bg-white"
                                                    >
                                                        <span>{item.label}</span>
                                                        <ChevronDown
                                                            className={cn(
                                                                'size-4 text-[var(--school-muted)] transition-transform duration-200',
                                                                isExpanded && 'rotate-180',
                                                            )}
                                                        />
                                                    </button>
                                                    <AnimatePresence>
                                                        {isExpanded && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.2 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="ml-4 space-y-0.5 border-l-2 border-[var(--school-green-200)] pl-4 pb-2">
                                                                    {item.children!.map((child) => (
                                                                        <Link
                                                                            key={child.href}
                                                                            href={child.href}
                                                                            className="block rounded-xl px-3 py-2.5 text-sm text-[var(--school-muted)] transition-colors hover:bg-white hover:text-[var(--school-green-700)]"
                                                                            onClick={() => setMobileNavOpen(false)}
                                                                        >
                                                                            <div className="font-semibold text-[var(--school-ink)]">{child.label}</div>
                                                                            {child.description && (
                                                                                <div className="mt-0.5 text-xs text-[var(--school-muted)]">{child.description}</div>
                                                                            )}
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </>
                                            ) : (
                                                <Link
                                                    href={item.href}
                                                    className="block rounded-2xl px-4 py-3 text-base font-medium text-[var(--school-ink)] hover:bg-white"
                                                    onClick={() => setMobileNavOpen(false)}
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
                                    <Link href={auth?.user ? '/dashboard' : '/login'}>
                                        {auth?.user ? 'Dashboard' : 'Masuk Portal'}
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

            <main id="main-content" className="relative z-10 mx-auto max-w-[84rem] px-5 py-8 md:px-8 md:py-10">
                {children}
            </main>

            {/* ═══════════ FOOTER ═══════════ */}
            <footer className="relative z-10 border-t border-white/70 bg-[rgba(255,255,255,0.7)]">
                <div className="mx-auto grid max-w-[84rem] gap-8 px-5 py-10 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
                    <div className="space-y-4">
                        <SchoolMark />
                        <p className="max-w-xl text-sm leading-7 text-[var(--school-muted)]">
                            Portal publik dan internal yang dirancang untuk menampilkan wajah SMAN 1 Tenjo secara hidup, terukur, dan siap tumbuh ke pengalaman 3D, GIS, dan SSR penuh.
                        </p>
                        <SocialLinks />
                    </div>
                    <div>
                        <div className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--school-green-700)]">
                            Navigasi
                        </div>
                        <div className="mt-4 space-y-3 text-sm text-[var(--school-muted)]">
                            {publicNavigation.map((item) => (
                                <div key={item.href}>
                                    <Link href={item.href} className="font-semibold hover:text-[var(--school-green-700)]">
                                        {item.label}
                                    </Link>
                                    {item.children && (
                                        <div className="mt-1.5 ml-3 space-y-1.5 border-l border-[var(--school-green-100)] pl-3">
                                            {item.children.map((child) => (
                                                <div key={child.href}>
                                                    <Link href={child.href} className="text-xs hover:text-[var(--school-green-700)]">
                                                        {child.label}
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--school-green-700)]">
                            Kontak Publik
                        </div>
                        <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--school-muted)]">
                            <p>JL. Raya Tenjo - Parung Panjang KM. 03, Babakan, Tenjo, Kabupaten Bogor.</p>
                            <p>smantenjo@yahoo.com</p>
                            <p>02159761066</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
