import { Link } from '@inertiajs/react';
import {
    ArrowUpRight,
    BriefcaseBusiness,
    Command,
    FileText,
    GraduationCap,
    LayoutDashboard,
    Loader2,
    Newspaper,
    Search,
    Sparkles,
    Users,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { search as globalSearch } from '@/routes/api/public';

type SearchResult = {
    title: string;
    description: string;
    href: string;
    group: string;
    badge: string;
};

type SearchResponse = {
    data: SearchResult[];
};

type GlobalCommandPaletteProps = {
    triggerClassName?: string;
    triggerLabel?: string;
    compact?: boolean;
};

const groupIcons: Record<string, typeof Search> = {
    Alumni: GraduationCap,
    Berita: Newspaper,
    Dashboard: LayoutDashboard,
    Dokumen: FileText,
    Ekstrakurikuler: Sparkles,
    Guru: Users,
    Layanan: BriefcaseBusiness,
    Navigasi: Search,
};

export function GlobalCommandPalette({
    triggerClassName,
    triggerLabel = 'Cari',
    compact = false,
}: GlobalCommandPaletteProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const groupedResults = useMemo(() => {
        return results.reduce<Record<string, SearchResult[]>>(
            (groups, item) => {
                groups[item.group] = [...(groups[item.group] ?? []), item];

                return groups;
            },
            {},
        );
    }, [results]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                (event.metaKey || event.ctrlKey) &&
                event.key.toLowerCase() === 'k'
            ) {
                event.preventDefault();
                setOpen(true);
            }

            if (event.key === 'Escape') {
                setOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (!open) {
            return;
        }

        const frame = window.requestAnimationFrame(() =>
            inputRef.current?.focus(),
        );

        return () => window.cancelAnimationFrame(frame);
    }, [open]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const abortController = new AbortController();
        const timeout = window.setTimeout(
            async () => {
                setLoading(true);

                try {
                    const response = await fetch(
                        globalSearch.url({
                            query: {
                                query,
                                limit: 18,
                            },
                        }),
                        {
                            headers: {
                                Accept: 'application/json',
                            },
                            signal: abortController.signal,
                        },
                    );

                    if (!response.ok) {
                        setResults([]);

                        return;
                    }

                    const payload = (await response.json()) as SearchResponse;
                    setResults(payload.data);
                } catch {
                    if (!abortController.signal.aborted) {
                        setResults([]);
                    }
                } finally {
                    if (!abortController.signal.aborted) {
                        setLoading(false);
                    }
                }
            },
            query.trim() === '' ? 0 : 180,
        );

        return () => {
            abortController.abort();
            window.clearTimeout(timeout);
        };
    }, [open, query]);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className={
                    triggerClassName ??
                    'inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-teal-200 hover:text-teal-700'
                }
            >
                <Search className="size-4" />
                {!compact && <span>{triggerLabel}</span>}
                <span className="hidden rounded-md border border-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-400 lg:inline-flex">
                    Ctrl K
                </span>
            </button>

            {open && (
                <div
                    className="fixed inset-0 z-100 flex items-start justify-center bg-slate-950/50 px-4 pt-[12vh] backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Pencarian global"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setOpen(false);
                        }
                    }}
                >
                    <div className="w-full max-w-2xl overflow-hidden rounded-lg border border-white/12 bg-slate-950 text-white shadow-2xl">
                        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
                            <Search className="size-5 text-teal-300" />
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={(event) =>
                                    setQuery(event.target.value)
                                }
                                placeholder="Cari berita, dokumen, guru, alumni, layanan..."
                                className="min-w-0 flex-1 bg-transparent text-base font-semibold text-white outline-none placeholder:text-slate-500"
                            />
                            {loading ? (
                                <Loader2 className="size-4 animate-spin text-teal-300" />
                            ) : (
                                <Command className="size-4 text-slate-500" />
                            )}
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                                aria-label="Tutup pencarian"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto p-3">
                            {results.length === 0 && !loading ? (
                                <div className="rounded-lg border border-dashed border-white/15 px-4 py-8 text-center">
                                    <p className="text-sm font-semibold text-white">
                                        Tidak ada hasil yang cocok.
                                    </p>
                                    <p className="mt-1 text-xs font-medium text-slate-400">
                                        Coba kata kunci berita, alumni, dokumen,
                                        guru, PPDB, atau dashboard.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {Object.entries(groupedResults).map(
                                        ([group, items]) => {
                                            const Icon =
                                                groupIcons[group] ?? Search;

                                            return (
                                                <section
                                                    key={group}
                                                    className="space-y-2"
                                                >
                                                    <div className="flex items-center gap-2 px-2 text-[11px] font-bold tracking-[0.18em] text-slate-500 uppercase">
                                                        <Icon className="size-3.5 text-teal-300" />
                                                        {group}
                                                    </div>
                                                    <div className="space-y-1">
                                                        {items.map((item) => (
                                                            <Link
                                                                key={`${item.group}-${item.href}-${item.title}`}
                                                                href={item.href}
                                                                onClick={() =>
                                                                    setOpen(
                                                                        false,
                                                                    )
                                                                }
                                                                className="group flex items-center justify-between gap-4 rounded-lg px-3 py-3 transition hover:bg-white/10"
                                                            >
                                                                <span className="min-w-0">
                                                                    <span className="block truncate text-sm font-bold text-white">
                                                                        {
                                                                            item.title
                                                                        }
                                                                    </span>
                                                                    <span className="mt-0.5 block truncate text-xs font-medium text-slate-400">
                                                                        {
                                                                            item.description
                                                                        }
                                                                    </span>
                                                                </span>
                                                                <span className="flex shrink-0 items-center gap-2">
                                                                    <span className="rounded-md border border-teal-300/25 bg-teal-300/10 px-2 py-1 text-[10px] font-bold text-teal-100">
                                                                        {
                                                                            item.badge
                                                                        }
                                                                    </span>
                                                                    <ArrowUpRight className="size-4 text-slate-500 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                                                                </span>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </section>
                                            );
                                        },
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
