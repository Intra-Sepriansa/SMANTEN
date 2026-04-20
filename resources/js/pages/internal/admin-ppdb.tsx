import { Head } from '@inertiajs/react';
import { Download, LayoutDashboard, Sparkles } from 'lucide-react';
import {
    AdminPanel,
    AdminWorkspaceShell,
} from '@/components/internal/admin/admin-workspace-shell';
import { PpdbOperationsPanel } from '@/components/internal/admin/ppdb-operations-panel';
import type { PpdbDesk } from '@/components/internal/admin/ppdb-operations-panel';
import { dashboard } from '@/routes';
import { admin as adminDashboard } from '@/routes/dashboard';
import { ppdb as adminPpdb, website } from '@/routes/dashboard/admin';
import { ppdbApplications } from '@/routes/internal-api/exports';

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
                <section className="space-y-4">
                    <AdminPanel className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="text-sm font-semibold text-neutral-950 dark:text-white">
                                Export PPDB
                            </div>
                            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                                Unduh data pendaftar untuk rekap Excel dan arsip
                                panitia.
                            </p>
                        </div>
                        <a
                            href={ppdbApplications.url()}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-(--school-green-700) px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-(--school-green-600)"
                        >
                            <Download className="size-4" />
                            Download Excel CSV
                        </a>
                    </AdminPanel>
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
