import { Head } from '@inertiajs/react';
import {
    CheckCircle2,
    ClipboardList,
    Download,
    FileSearch,
    LayoutDashboard,
    ShieldCheck,
    Sparkles,
} from 'lucide-react';
import { AdminAdvancedCommandCenter } from '@/components/internal/admin/admin-advanced-command-center';
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
    const documentRiskCount = ppdbDesk.applications.filter(
        (application) => application.documentsSummary.rejected > 0,
    ).length;
    const readyDecisionCount = ppdbDesk.applications.filter(
        (application) =>
            application.status === 'verified' ||
            application.status === 'eligible',
    ).length;
    const trackCount = new Set(
        ppdbDesk.applications
            .map((application) => application.trackType)
            .filter(Boolean),
    ).size;

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
                    <AdminAdvancedCommandCenter
                        eyebrow="Selection command"
                        title="PPDB dipantau sebagai pipeline verifikasi."
                        description="Status pendaftar, risiko berkas, jalur masuk, dan kesiapan keputusan ditampilkan sebagai ringkasan operasional sebelum admin masuk ke daftar detail."
                        icon={ClipboardList}
                        metrics={[
                            {
                                label: 'Pendaftar',
                                value: numberFormatter.format(
                                    ppdbDesk.applications.length,
                                ),
                                helper: 'Total data dalam meja PPDB.',
                                icon: ClipboardList,
                                tone: 'sky',
                            },
                            {
                                label: 'Siap Putuskan',
                                value: numberFormatter.format(
                                    readyDecisionCount,
                                ),
                                helper: 'Status verified atau eligible.',
                                icon: CheckCircle2,
                                tone: 'emerald',
                            },
                            {
                                label: 'Risiko Berkas',
                                value: numberFormatter.format(
                                    documentRiskCount,
                                ),
                                helper: 'Ada dokumen yang ditolak.',
                                icon: FileSearch,
                                tone: 'rose',
                            },
                            {
                                label: 'Jalur Aktif',
                                value: numberFormatter.format(trackCount),
                                helper: 'Variasi jalur pada data masuk.',
                                icon: ShieldCheck,
                                tone: 'amber',
                            },
                        ]}
                        lanes={[
                            {
                                label: 'Intake',
                                title: 'Data pendaftaran baru masuk',
                                description:
                                    'Nama, jalur, kontak, sekolah asal, dan alamat siap dicari dari panel filter.',
                                value: numberFormatter.format(
                                    stats.ppdbSubmittedCount,
                                ),
                                icon: ClipboardList,
                                tone: 'sky',
                            },
                            {
                                label: 'Review',
                                title: 'Berkas dan status perlu dicek',
                                description:
                                    'Antrian under review dan dokumen bermasalah menjadi prioritas panitia.',
                                value: numberFormatter.format(
                                    stats.ppdbUnderReviewCount,
                                ),
                                icon: FileSearch,
                                tone: 'amber',
                            },
                            {
                                label: 'Decision',
                                title: 'Calon siswa siap diputuskan',
                                description:
                                    'Status verified atau eligible bisa langsung diarahkan ke evaluasi hasil.',
                                value: numberFormatter.format(
                                    readyDecisionCount,
                                ),
                                icon: CheckCircle2,
                                tone: 'emerald',
                            },
                            {
                                label: 'Result',
                                title: 'Hasil penerimaan terpantau',
                                description:
                                    'Jumlah diterima tetap terlihat berdampingan dengan pipeline pendaftar.',
                                value: numberFormatter.format(
                                    stats.ppdbAcceptedCount,
                                ),
                                icon: ShieldCheck,
                                tone: 'violet',
                            },
                        ]}
                    />

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
