import { Head } from '@inertiajs/react';
import { Globe, LayoutDashboard, Sparkles } from 'lucide-react';
import { ActivityFeed } from '@/components/internal/activity-feed';
import {
    AdminPanel,
    AdminSectionIntro,
    AdminWorkspaceShell,
} from '@/components/internal/admin/admin-workspace-shell';
import { PublicPortalCmsPanel } from '@/components/internal/admin/public-portal-cms-panel';
import {
    CmsRevisionHistoryPanel,
    MediaManagerPanel,
} from '@/components/internal/admin/website-advanced-panels';
import { dashboard, home } from '@/routes';
import { admin as adminDashboard } from '@/routes/dashboard';

type ActivityItem = {
    id: number;
    title: string;
    description: string;
    time: string;
};

type AdminWebsiteProps = {
    stats: {
        liveContentCount: number;
        publishedArticleCount: number;
        portfolioPublishedCount: number;
    };
    activityFeed: ActivityItem[];
};

export default function AdminWebsite({
    stats,
    activityFeed,
}: AdminWebsiteProps) {
    const numberFormatter = new Intl.NumberFormat('id-ID');

    return (
        <>
            <Head title="Website Admin" />

            <AdminWorkspaceShell
                current="website"
                eyebrow="Website Desk"
                title="Website admin sekarang berdiri sebagai workspace sendiri."
                description="Hero, CTA, dan menu publik dipisah dari dashboard utama supaya perubahan permukaan website lebih terkontrol."
                stats={[
                    {
                        label: 'Live Surface',
                        value: numberFormatter.format(stats.liveContentCount),
                        helper: 'Elemen publik aktif',
                        tone: 'sky',
                    },
                    {
                        label: 'Artikel Live',
                        value: numberFormatter.format(
                            stats.publishedArticleCount,
                        ),
                        helper: 'Konten editorial tayang',
                        tone: 'emerald',
                    },
                    {
                        label: 'Karya Live',
                        value: numberFormatter.format(
                            stats.portfolioPublishedCount,
                        ),
                        helper: 'Portofolio tampil publik',
                        tone: 'amber',
                    },
                ]}
                actions={[
                    {
                        label: 'Kembali ke Dashboard',
                        href: adminDashboard(),
                        detail: 'Balik ke ringkasan lintas menu.',
                        icon: LayoutDashboard,
                        tone: 'slate',
                    },
                    {
                        label: 'Lihat Website Publik',
                        href: home(),
                        detail: 'Audit hasil perubahan dari sisi pengunjung.',
                        icon: Globe,
                        tone: 'sky',
                    },
                    {
                        label: 'Buka Snapshot Admin',
                        href: adminDashboard(),
                        detail: 'Kembali ke ringkasan lintas menu sesudah edit.',
                        icon: Sparkles,
                        tone: 'emerald',
                    },
                ]}
            >
                <section className="grid gap-6">
                    <div className="space-y-4">
                        <AdminSectionIntro
                            eyebrow="CMS"
                            title="Panel pengaturan website"
                            description="Edit hero, CTA, dan menu publik dari halaman khusus tanpa bercampur dengan menu operasional lain."
                        />

                        <PublicPortalCmsPanel />
                    </div>

                    <CmsRevisionHistoryPanel />

                    <MediaManagerPanel />

                    <div className="space-y-4">
                        <AdminSectionIntro
                            eyebrow="Recent Activity"
                            title="Jejak perubahan"
                            description="Cek apakah perubahan publik terakhir benar-benar tercatat."
                        />

                        <AdminPanel>
                            <ActivityFeed
                                items={activityFeed.map((item) => ({
                                    id: item.id,
                                    icon: <Sparkles className="size-4" />,
                                    title: item.title,
                                    description: item.description,
                                    time: item.time,
                                }))}
                                emptyMessage="Belum ada aktivitas website terbaru."
                            />
                        </AdminPanel>
                    </div>
                </section>
            </AdminWorkspaceShell>
        </>
    );
}

AdminWebsite.layout = {
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
            title: 'Website',
            href: adminDashboard(),
        },
    ],
};
