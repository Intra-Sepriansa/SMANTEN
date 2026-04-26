import { Head } from '@inertiajs/react';
import {
    Award,
    CheckCircle2,
    Compass,
    LayoutDashboard,
    Sparkles,
    Users,
} from 'lucide-react';
import { AdminAdvancedCommandCenter } from '@/components/internal/admin/admin-advanced-command-center';
import {
    AdminPanel,
    AdminSectionIntro,
    AdminWorkspaceShell,
} from '@/components/internal/admin/admin-workspace-shell';
import { formatAdminDateTime } from '@/lib/admin-format';
import { dashboard } from '@/routes';
import { admin as adminDashboard } from '@/routes/dashboard';
import { studentPortfolio, students } from '@/routes/dashboard/admin';

type PortfolioDesk = {
    recentItems: Array<{
        id: number;
        title: string;
        slug: string | null;
        status: string | null;
        statusLabel: string;
        itemType: string;
        isFeatured: boolean;
        project: string | null;
        creator: string | null;
        approver: string | null;
        publishedAt: string | null;
        updatedAt: string | null;
    }>;
    featuredCount: number;
    topCreators: Array<{
        creator: string;
        count: number;
    }>;
};

type AdminPortfolioProps = {
    stats: {
        portfolioSubmittedCount: number;
        portfolioPublishedCount: number;
    };
    portfolioDesk: PortfolioDesk;
};

function portfolioStatusTone(status: string | null): string {
    return (
        {
            published:
                'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200',
            approved:
                'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200',
            submitted:
                'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200',
            draft: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
        }[status ?? 'draft'] ??
        'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
    );
}

export default function AdminPortfolio({
    stats,
    portfolioDesk,
}: AdminPortfolioProps) {
    const numberFormatter = new Intl.NumberFormat('id-ID');
    const recentSubmittedCount = portfolioDesk.recentItems.filter(
        (item) => item.status === 'submitted',
    ).length;
    const recentPublishedCount = portfolioDesk.recentItems.filter(
        (item) => item.status === 'published',
    ).length;
    const creatorCount = portfolioDesk.topCreators.length;

    return (
        <>
            <Head title="Portofolio Karya" />

            <AdminWorkspaceShell
                current="portfolio"
                eyebrow="Portfolio Desk"
                title="Moderasi karya dipindah ke halaman fokus."
                description="Submission, approval, dan karya yang sudah live sekarang dibaca dari satu ruang kerja yang lebih jelas."
                stats={[
                    {
                        label: 'Submitted',
                        value: numberFormatter.format(
                            stats.portfolioSubmittedCount,
                        ),
                        helper: 'Butuh review',
                        tone: 'amber',
                    },
                    {
                        label: 'Live',
                        value: numberFormatter.format(
                            stats.portfolioPublishedCount,
                        ),
                        helper: 'Sudah tayang',
                        tone: 'emerald',
                    },
                    {
                        label: 'Featured',
                        value: numberFormatter.format(
                            portfolioDesk.featuredCount,
                        ),
                        helper: 'Karya unggulan',
                        tone: 'sky',
                    },
                ]}
                actions={[
                    {
                        label: 'Kembali ke Dashboard',
                        href: adminDashboard(),
                        detail: 'Kembali ke ringkasan seluruh menu.',
                        icon: LayoutDashboard,
                        tone: 'slate',
                    },
                    {
                        label: 'Buka Akses Siswa',
                        href: students(),
                        detail: 'Baca dampak karya dari sisi akun siswa.',
                        icon: Users,
                        tone: 'sky',
                    },
                    {
                        label: 'Buka Portofolio Siswa',
                        href: studentPortfolio(),
                        detail: 'Lihat top creator dan ritme karya siswa.',
                        icon: Sparkles,
                        tone: 'emerald',
                    },
                ]}
            >
                <section className="grid gap-6">
                    <AdminAdvancedCommandCenter
                        eyebrow="Portfolio command"
                        title="Karya siswa dipantau sebagai pipeline kurasi."
                        description="Submission, approval, featured, dan kreator aktif dirangkum supaya admin bisa memilih karya yang layak tayang dengan lebih cepat."
                        icon={Compass}
                        metrics={[
                            {
                                label: 'Submitted',
                                value: numberFormatter.format(
                                    stats.portfolioSubmittedCount,
                                ),
                                helper: 'Karya menunggu review.',
                                icon: Compass,
                                tone: 'amber',
                            },
                            {
                                label: 'Live',
                                value: numberFormatter.format(
                                    stats.portfolioPublishedCount,
                                ),
                                helper: 'Karya sudah tampil.',
                                icon: CheckCircle2,
                                tone: 'emerald',
                            },
                            {
                                label: 'Featured',
                                value: numberFormatter.format(
                                    portfolioDesk.featuredCount,
                                ),
                                helper: 'Karya unggulan.',
                                icon: Sparkles,
                                tone: 'sky',
                            },
                            {
                                label: 'Kreator',
                                value: numberFormatter.format(creatorCount),
                                helper: 'Top creator tercatat.',
                                icon: Users,
                                tone: 'violet',
                            },
                        ]}
                        lanes={[
                            {
                                label: 'Submit',
                                title: 'Karya masuk dari siswa',
                                description:
                                    'Submission terbaru dibaca bersama kreator, proyek, dan tipe karya.',
                                value: numberFormatter.format(
                                    recentSubmittedCount ||
                                        stats.portfolioSubmittedCount,
                                ),
                                icon: Compass,
                                tone: 'amber',
                            },
                            {
                                label: 'Curate',
                                title: 'Admin menilai kualitas karya',
                                description:
                                    'Approver, status, dan update terakhir membantu proses moderasi.',
                                value: numberFormatter.format(
                                    portfolioDesk.recentItems.length,
                                ),
                                icon: Award,
                                tone: 'violet',
                            },
                            {
                                label: 'Feature',
                                title: 'Karya unggulan disiapkan',
                                description:
                                    'Karya featured bisa dinaikkan sebagai representasi prestasi sekolah.',
                                value: numberFormatter.format(
                                    portfolioDesk.featuredCount,
                                ),
                                icon: Sparkles,
                                tone: 'sky',
                            },
                            {
                                label: 'Publish',
                                title: 'Karya siap tayang publik',
                                description:
                                    'Item published recent menjadi sinyal keluaran kurasi.',
                                value: numberFormatter.format(
                                    recentPublishedCount,
                                ),
                                icon: CheckCircle2,
                                tone: 'emerald',
                            },
                        ]}
                    />

                    <div className="space-y-4">
                        <AdminSectionIntro
                            eyebrow="Creator Pulse"
                            title="Kreator paling aktif"
                            description="Cukup lihat volume karya untuk membaca siapa yang paling produktif."
                        />

                        <div className="grid gap-3">
                            {portfolioDesk.topCreators.length === 0 ? (
                                <AdminPanel>
                                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                        Belum ada data kreator.
                                    </div>
                                </AdminPanel>
                            ) : (
                                portfolioDesk.topCreators.map((creator) => (
                                    <AdminPanel key={creator.creator}>
                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <div className="text-sm font-semibold text-neutral-950 dark:text-white">
                                                    {creator.creator}
                                                </div>
                                                <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                                    Kontributor karya
                                                </div>
                                            </div>
                                            <div className="text-2xl font-bold text-(--school-green-700) dark:text-(--school-green-300)">
                                                {numberFormatter.format(
                                                    creator.count,
                                                )}
                                            </div>
                                        </div>
                                    </AdminPanel>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <AdminSectionIntro
                            eyebrow="Recent Submissions"
                            title="Karya terbaru"
                            description="Status, proyek, dan approver tampil ringkas supaya keputusan moderasi lebih cepat."
                        />

                        <div className="grid gap-3">
                            {portfolioDesk.recentItems.length === 0 ? (
                                <AdminPanel>
                                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                        Belum ada karya.
                                    </div>
                                </AdminPanel>
                            ) : (
                                portfolioDesk.recentItems.map((item) => (
                                    <AdminPanel key={item.id}>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="text-base font-semibold text-neutral-950 dark:text-white">
                                                    {item.title}
                                                </div>
                                                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                                    {item.project ??
                                                        'Tanpa proyek'}{' '}
                                                    •{' '}
                                                    {item.creator ??
                                                        'Belum ada kreator'}
                                                </div>
                                            </div>
                                            <div
                                                className={`rounded-full px-3 py-1 text-[0.68rem] font-semibold tracking-[0.16em] uppercase ${portfolioStatusTone(item.status)}`}
                                            >
                                                {item.statusLabel}
                                            </div>
                                        </div>

                                        <div className="mt-4 grid gap-2 sm:grid-cols-3">
                                            <div className="rounded-2xl bg-neutral-50 px-3 py-3 dark:bg-neutral-950/50">
                                                <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                                    Tipe
                                                </div>
                                                <div className="mt-1 text-sm font-medium text-neutral-900 dark:text-white">
                                                    {item.itemType}
                                                </div>
                                            </div>
                                            <div className="rounded-2xl bg-neutral-50 px-3 py-3 dark:bg-neutral-950/50">
                                                <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                                    Update
                                                </div>
                                                <div className="mt-1 text-sm font-medium text-neutral-900 dark:text-white">
                                                    {formatAdminDateTime(
                                                        item.updatedAt,
                                                    )}
                                                </div>
                                            </div>
                                            <div className="rounded-2xl bg-neutral-50 px-3 py-3 dark:bg-neutral-950/50">
                                                <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                                    Approver
                                                </div>
                                                <div className="mt-1 text-sm font-medium text-neutral-900 dark:text-white">
                                                    {item.approver ??
                                                        'Belum ada'}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {item.publishedAt ? (
                                                <span className="rounded-full bg-neutral-100 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-600 uppercase dark:bg-neutral-800 dark:text-neutral-300">
                                                    Publish{' '}
                                                    {formatAdminDateTime(
                                                        item.publishedAt,
                                                    )}
                                                </span>
                                            ) : null}
                                            {item.isFeatured ? (
                                                <span className="rounded-full bg-(--school-green-50) px-3 py-1 text-[0.68rem] font-semibold tracking-[0.16em] text-(--school-green-700) uppercase dark:bg-(--school-green-950)/40 dark:text-(--school-green-300)">
                                                    Featured
                                                </span>
                                            ) : null}
                                        </div>
                                    </AdminPanel>
                                ))
                            )}
                        </div>
                    </div>
                </section>
            </AdminWorkspaceShell>
        </>
    );
}

AdminPortfolio.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Dashboard Admin',
            href: adminDashboard(),
        },
        {
            title: 'Karya',
            href: adminDashboard(),
        },
    ],
};
