import { Head } from '@inertiajs/react';
import {
    BookOpen,
    FileText,
    LayoutDashboard,
    PenLine,
    ShieldCheck,
    Sparkles,
} from 'lucide-react';
import { AdminAdvancedCommandCenter } from '@/components/internal/admin/admin-advanced-command-center';
import {
    AdminPanel,
    AdminSectionIntro,
    AdminWorkspaceShell,
} from '@/components/internal/admin/admin-workspace-shell';
import { formatAdminDateTime } from '@/lib/admin-format';
import { dashboard } from '@/routes';
import { index as beritaIndex } from '@/routes/berita';
import { admin as adminDashboard } from '@/routes/dashboard';
import { website } from '@/routes/dashboard/admin';

type ArticleDesk = {
    recentArticles: Array<{
        id: number;
        title: string;
        slug: string | null;
        status: string | null;
        statusLabel: string;
        isFeatured: boolean;
        category: string | null;
        author: string | null;
        reviewer: string | null;
        publishedAt: string | null;
        updatedAt: string | null;
    }>;
    featuredCount: number;
    topAuthors: Array<{
        author: string;
        count: number;
    }>;
};

type AdminArticlesProps = {
    stats: {
        publishedArticleCount: number;
        articleInReviewCount: number;
        draftArticleCount: number;
    };
    articleDesk: ArticleDesk;
};

function articleStatusTone(status: string | null): string {
    return (
        {
            published:
                'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200',
            in_review:
                'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200',
            draft: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
        }[status ?? 'draft'] ??
        'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
    );
}

export default function AdminArticles({
    stats,
    articleDesk,
}: AdminArticlesProps) {
    const numberFormatter = new Intl.NumberFormat('id-ID');
    const reviewQueueCount = articleDesk.recentArticles.filter(
        (article) => article.status === 'in_review',
    ).length;
    const publishedRecentCount = articleDesk.recentArticles.filter(
        (article) => article.status === 'published',
    ).length;

    return (
        <>
            <Head title="Artikel" />

            <AdminWorkspaceShell
                current="articles"
                eyebrow="Editorial Desk"
                title="Publikasi artikel dipisah dari menu admin lain."
                description="Area ini dipakai untuk membaca antrian editorial, penulis paling aktif, dan artikel yang butuh keputusan."
                stats={[
                    {
                        label: 'Artikel Live',
                        value: numberFormatter.format(
                            stats.publishedArticleCount,
                        ),
                        helper: 'Sudah tayang',
                        tone: 'emerald',
                    },
                    {
                        label: 'In Review',
                        value: numberFormatter.format(
                            stats.articleInReviewCount,
                        ),
                        helper: 'Butuh approval',
                        tone: 'amber',
                    },
                    {
                        label: 'Featured',
                        value: numberFormatter.format(
                            articleDesk.featuredCount,
                        ),
                        helper: 'Konten unggulan',
                        tone: 'sky',
                    },
                ]}
                actions={[
                    {
                        label: 'Kembali ke Dashboard',
                        href: adminDashboard(),
                        detail: 'Kembali ke ringkasan lintas menu admin.',
                        icon: LayoutDashboard,
                        tone: 'slate',
                    },
                    {
                        label: 'Buka Website Admin',
                        href: website(),
                        detail: 'Sinkronkan konten editorial dengan permukaan publik.',
                        icon: Sparkles,
                        tone: 'emerald',
                    },
                    {
                        label: 'Lihat Halaman Berita',
                        href: beritaIndex(),
                        detail: 'Audit hasil terbit dari sisi pengunjung.',
                        icon: BookOpen,
                        tone: 'sky',
                    },
                ]}
            >
                <section className="grid gap-6">
                    <AdminAdvancedCommandCenter
                        eyebrow="Editorial command"
                        title="Artikel dipantau sebagai workflow redaksi."
                        description="Draft, review, featured, dan publikasi terbaru dibaca sebagai pipeline keputusan agar admin cepat tahu konten mana yang perlu disentuh."
                        icon={FileText}
                        metrics={[
                            {
                                label: 'Live',
                                value: numberFormatter.format(
                                    stats.publishedArticleCount,
                                ),
                                helper: 'Artikel sudah tayang.',
                                icon: BookOpen,
                                tone: 'emerald',
                            },
                            {
                                label: 'Review',
                                value: numberFormatter.format(
                                    stats.articleInReviewCount,
                                ),
                                helper: 'Menunggu approval redaksi.',
                                icon: ShieldCheck,
                                tone: 'amber',
                            },
                            {
                                label: 'Draft',
                                value: numberFormatter.format(
                                    stats.draftArticleCount,
                                ),
                                helper: 'Masih bisa dilengkapi.',
                                icon: PenLine,
                                tone: 'slate',
                            },
                            {
                                label: 'Featured',
                                value: numberFormatter.format(
                                    articleDesk.featuredCount,
                                ),
                                helper: 'Siap jadi konten unggulan.',
                                icon: Sparkles,
                                tone: 'sky',
                            },
                        ]}
                        lanes={[
                            {
                                label: 'Draft',
                                title: 'Ide masuk dan naskah disiapkan',
                                description:
                                    'Admin bisa melihat stok draft sebelum konten masuk review.',
                                value: numberFormatter.format(
                                    stats.draftArticleCount,
                                ),
                                icon: PenLine,
                                tone: 'slate',
                            },
                            {
                                label: 'Review',
                                title: 'Antrian approval redaksi',
                                description:
                                    'Artikel in review menjadi prioritas agar publikasi tidak tertahan.',
                                value: numberFormatter.format(
                                    reviewQueueCount ||
                                        stats.articleInReviewCount,
                                ),
                                icon: ShieldCheck,
                                tone: 'amber',
                            },
                            {
                                label: 'Publish',
                                title: 'Artikel terbaru yang sudah live',
                                description:
                                    'Publikasi recent bisa diaudit sebelum ditampilkan lebih luas.',
                                value: numberFormatter.format(
                                    publishedRecentCount,
                                ),
                                icon: BookOpen,
                                tone: 'emerald',
                            },
                            {
                                label: 'Promote',
                                title: 'Konten featured untuk permukaan publik',
                                description:
                                    'Artikel unggulan disiapkan untuk mengisi sorotan website.',
                                value: numberFormatter.format(
                                    articleDesk.featuredCount,
                                ),
                                icon: Sparkles,
                                tone: 'sky',
                            },
                        ]}
                    />

                    <div className="space-y-4">
                        <AdminSectionIntro
                            eyebrow="Author Pulse"
                            title="Penulis paling aktif"
                            description="Cukup lihat volume kontribusi untuk membaca ritme editorial minggu ini."
                        />

                        <div className="grid gap-3">
                            {articleDesk.topAuthors.length === 0 ? (
                                <AdminPanel>
                                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                        Belum ada aktivitas penulis.
                                    </div>
                                </AdminPanel>
                            ) : (
                                articleDesk.topAuthors.map((author) => (
                                    <AdminPanel key={author.author}>
                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <div className="text-sm font-semibold text-neutral-950 dark:text-white">
                                                    {author.author}
                                                </div>
                                                <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                                    Kontributor editorial
                                                </div>
                                            </div>
                                            <div className="text-2xl font-bold text-(--school-green-700) dark:text-(--school-green-300)">
                                                {numberFormatter.format(
                                                    author.count,
                                                )}
                                            </div>
                                        </div>
                                    </AdminPanel>
                                ))
                            )}

                            <AdminPanel className="border-dashed">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-2xl bg-neutral-50 px-3 py-3 dark:bg-neutral-950/50">
                                        <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                            Draft
                                        </div>
                                        <div className="mt-1 text-2xl font-bold text-neutral-950 dark:text-white">
                                            {numberFormatter.format(
                                                stats.draftArticleCount,
                                            )}
                                        </div>
                                    </div>
                                    <div className="rounded-2xl bg-neutral-50 px-3 py-3 dark:bg-neutral-950/50">
                                        <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                            Review
                                        </div>
                                        <div className="mt-1 text-2xl font-bold text-neutral-950 dark:text-white">
                                            {numberFormatter.format(
                                                stats.articleInReviewCount,
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </AdminPanel>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <AdminSectionIntro
                            eyebrow="Recent Articles"
                            title="Artikel terbaru"
                            description="Baca status, penulis, dan sentuhan akhir setiap artikel dari satu tempat."
                        />

                        <div className="grid gap-3">
                            {articleDesk.recentArticles.length === 0 ? (
                                <AdminPanel>
                                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                        Belum ada artikel.
                                    </div>
                                </AdminPanel>
                            ) : (
                                articleDesk.recentArticles.map((article) => (
                                    <AdminPanel key={article.id}>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="text-base font-semibold text-neutral-950 dark:text-white">
                                                    {article.title}
                                                </div>
                                                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                                    {article.category ??
                                                        'Tanpa kategori'}{' '}
                                                    •{' '}
                                                    {article.author ??
                                                        'Tanpa penulis'}
                                                </div>
                                            </div>
                                            <div
                                                className={`rounded-full px-3 py-1 text-[0.68rem] font-semibold tracking-[0.16em] uppercase ${articleStatusTone(article.status)}`}
                                            >
                                                {article.statusLabel}
                                            </div>
                                        </div>

                                        <div className="mt-4 grid gap-2 sm:grid-cols-3">
                                            <div className="rounded-2xl bg-neutral-50 px-3 py-3 dark:bg-neutral-950/50">
                                                <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                                    Update
                                                </div>
                                                <div className="mt-1 text-sm font-medium text-neutral-900 dark:text-white">
                                                    {formatAdminDateTime(
                                                        article.updatedAt,
                                                    )}
                                                </div>
                                            </div>
                                            <div className="rounded-2xl bg-neutral-50 px-3 py-3 dark:bg-neutral-950/50">
                                                <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                                    Publish
                                                </div>
                                                <div className="mt-1 text-sm font-medium text-neutral-900 dark:text-white">
                                                    {formatAdminDateTime(
                                                        article.publishedAt,
                                                    )}
                                                </div>
                                            </div>
                                            <div className="rounded-2xl bg-neutral-50 px-3 py-3 dark:bg-neutral-950/50">
                                                <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                                    Reviewer
                                                </div>
                                                <div className="mt-1 text-sm font-medium text-neutral-900 dark:text-white">
                                                    {article.reviewer ??
                                                        'Belum ada'}
                                                </div>
                                            </div>
                                        </div>

                                        {article.isFeatured ? (
                                            <div className="mt-3 inline-flex rounded-full bg-(--school-green-50) px-3 py-1 text-[0.68rem] font-semibold tracking-[0.16em] text-(--school-green-700) uppercase dark:bg-(--school-green-950)/40 dark:text-(--school-green-300)">
                                                Featured
                                            </div>
                                        ) : null}
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

AdminArticles.layout = {
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
            title: 'Artikel',
            href: adminDashboard(),
        },
    ],
};
