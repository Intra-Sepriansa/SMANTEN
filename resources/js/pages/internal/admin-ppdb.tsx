import { Head } from '@inertiajs/react';
import { LayoutDashboard, Sparkles } from 'lucide-react';
import { AdminWorkspaceShell } from '@/components/internal/admin/admin-workspace-shell';
import { PpdbOperationsPanel } from '@/components/internal/admin/ppdb-operations-panel';
import type { PpdbDesk } from '@/components/internal/admin/ppdb-operations-panel';
import { dashboard } from '@/routes';
import { admin as adminDashboard } from '@/routes/dashboard';
import { ppdb as adminPpdb, website } from '@/routes/dashboard/admin';

type AdminPpdbProps = {
    stats: {
        ppdbSubmittedCount: number;
        ppdbUnderReviewCount: number;
        ppdbAcceptedCount: number;
    };
    ppdbDesk: PpdbDesk;
};

export default function AdminPpdb({ stats, ppdbDesk }: AdminPpdbProps) {
    const numberFormatter = new Intl.NumberFormat('id-ID');

    return (
        <>
            <Head title="Dashboard PPDB" />

            <AdminWorkspaceShell
                current="ppdb"
                eyebrow="PPDB"
                title="Dashboard PPDB"
                description="Menu untuk cek pendaftar, verifikasi berkas, dan tetapkan hasil seleksi."
                stats={[
                    {
                        label: 'Masuk',
                        value: numberFormatter.format(stats.ppdbSubmittedCount),
                        tone: 'sky',
                    },
                    {
                        label: 'Review',
                        value: numberFormatter.format(
                            stats.ppdbUnderReviewCount,
                        ),
                        tone: 'amber',
                    },
                    {
                        label: 'Diterima',
                        value: numberFormatter.format(stats.ppdbAcceptedCount),
                        tone: 'emerald',
                    },
                ]}
                actions={[
                    {
                        label: 'Dashboard Admin',
                        href: adminDashboard(),
                        icon: LayoutDashboard,
                        tone: 'slate',
                    },
                    {
                        label: 'Web Publik',
                        href: website(),
                        icon: Sparkles,
                        tone: 'emerald',
                    },
                ]}
            >
                <section>
                    <PpdbOperationsPanel desk={ppdbDesk} />
                </section>
            </AdminWorkspaceShell>
        </>
    );
}

AdminPpdb.layout = {
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
            title: 'PPDB',
            href: adminPpdb(),
        },
    ],
};
