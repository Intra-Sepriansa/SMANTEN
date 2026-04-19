import { Head } from '@inertiajs/react';
import { GraduationCap, LayoutDashboard, Users } from 'lucide-react';
import {
    AdminPanel,
    AdminSectionIntro,
    AdminWorkspaceShell,
} from '@/components/internal/admin/admin-workspace-shell';
import { formatAdminDate } from '@/lib/admin-format';
import { organization as publicOrganization } from '@/routes';
import { dashboard } from '@/routes';
import { admin as adminDashboard } from '@/routes/dashboard';
import { teachers } from '@/routes/dashboard/admin';

type OrganizationDesk = {
    activeUnitCount: number;
    positionCount: number;
    uniquePositionCount: number;
    recentAssignments: Array<{
        id: number;
        person: string;
        unit: string | null;
        scope: string;
        position: string | null;
        status: string | null;
        statusLabel: string;
        isCurrent: boolean;
        startsAt: string | null;
        endsAt: string | null;
    }>;
    scopeMix: Array<{
        label: string;
        count: number;
    }>;
};

type AdminOrganizationProps = {
    stats: {
        activeOrganizationCount: number;
        currentOrganizationCount: number;
    };
    organizationDesk: OrganizationDesk;
};

export default function AdminOrganization({
    stats,
    organizationDesk,
}: AdminOrganizationProps) {
    const numberFormatter = new Intl.NumberFormat('id-ID');

    return (
        <>
            <Head title="Struktur Organisasi" />

            <AdminWorkspaceShell
                current="organization"
                eyebrow="Organization Desk"
                title="Struktur organisasi punya halaman kerjanya sendiri."
                description="Admin bisa membaca struktur aktif, posisi current, dan pergeseran assignment tanpa membuka dashboard panjang."
                stats={[
                    {
                        label: 'Assignment Aktif',
                        value: numberFormatter.format(
                            stats.activeOrganizationCount,
                        ),
                        helper: 'Sedang berjalan',
                        tone: 'sky',
                    },
                    {
                        label: 'Current',
                        value: numberFormatter.format(
                            stats.currentOrganizationCount,
                        ),
                        helper: 'Pemegang posisi saat ini',
                        tone: 'emerald',
                    },
                    {
                        label: 'Unit Aktif',
                        value: numberFormatter.format(
                            organizationDesk.activeUnitCount,
                        ),
                        helper: 'Area organisasi hidup',
                        tone: 'amber',
                    },
                ]}
                actions={[
                    {
                        label: 'Kembali ke Dashboard',
                        href: adminDashboard(),
                        detail: 'Balik ke ringkasan lintas menu admin.',
                        icon: LayoutDashboard,
                        tone: 'slate',
                    },
                    {
                        label: 'Buka Monitor Guru',
                        href: teachers(),
                        detail: 'Cocokkan struktur dengan ritme peran guru.',
                        icon: GraduationCap,
                        tone: 'sky',
                    },
                    {
                        label: 'Lihat Halaman Publik',
                        href: publicOrganization(),
                        detail: 'Audit tampilan organisasi dari sisi website.',
                        icon: Users,
                        tone: 'emerald',
                    },
                ]}
            >
                <section className="grid gap-6">
                    <div className="space-y-4">
                        <AdminSectionIntro
                            eyebrow="Structure Mix"
                            title="Sebaran struktur"
                            description="Baca tingkat penyebaran unit aktif dan posisi kunci."
                        />

                        <div className="grid gap-3">
                            {organizationDesk.scopeMix.map((scope) => (
                                <AdminPanel key={scope.label}>
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <div className="text-sm font-semibold text-neutral-950 dark:text-white">
                                                {scope.label}
                                            </div>
                                            <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                                Unit aktif pada scope ini
                                            </div>
                                        </div>
                                        <div className="text-2xl font-bold text-(--school-green-700) dark:text-(--school-green-300)">
                                            {numberFormatter.format(scope.count)}
                                        </div>
                                    </div>
                                </AdminPanel>
                            ))}

                            <AdminPanel className="border-dashed">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-2xl bg-neutral-50 px-3 py-3 dark:bg-neutral-950/50">
                                        <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                            Total Posisi
                                        </div>
                                        <div className="mt-1 text-2xl font-bold text-neutral-950 dark:text-white">
                                            {numberFormatter.format(
                                                organizationDesk.positionCount,
                                            )}
                                        </div>
                                    </div>
                                    <div className="rounded-2xl bg-neutral-50 px-3 py-3 dark:bg-neutral-950/50">
                                        <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                            Posisi Unik
                                        </div>
                                        <div className="mt-1 text-2xl font-bold text-neutral-950 dark:text-white">
                                            {numberFormatter.format(
                                                organizationDesk.uniquePositionCount,
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </AdminPanel>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <AdminSectionIntro
                            eyebrow="Recent Assignments"
                            title="Pergerakan terbaru"
                            description="Lihat siapa, di posisi mana, dan apakah statusnya sudah current."
                        />

                        <div className="grid gap-3">
                            {organizationDesk.recentAssignments.length === 0 ? (
                                <AdminPanel>
                                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                        Belum ada assignment organisasi.
                                    </div>
                                </AdminPanel>
                            ) : (
                                organizationDesk.recentAssignments.map(
                                    (assignment) => (
                                        <AdminPanel key={assignment.id}>
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="space-y-1">
                                                    <div className="text-base font-semibold text-neutral-950 dark:text-white">
                                                        {assignment.person}
                                                    </div>
                                                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                                        {assignment.position ??
                                                            'Tanpa posisi'}{' '}
                                                        •{' '}
                                                        {assignment.unit ??
                                                            'Tanpa unit'}
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-600 uppercase dark:bg-neutral-800 dark:text-neutral-300">
                                                        {assignment.scope}
                                                    </span>
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-[0.68rem] font-semibold tracking-[0.16em] uppercase ${assignment.isCurrent ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200'}`}
                                                    >
                                                        {assignment.isCurrent
                                                            ? 'Current'
                                                            : assignment.statusLabel}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-4 grid gap-2 sm:grid-cols-2">
                                                <div className="rounded-2xl bg-neutral-50 px-3 py-3 dark:bg-neutral-950/50">
                                                    <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                                        Mulai
                                                    </div>
                                                    <div className="mt-1 text-sm font-medium text-neutral-900 dark:text-white">
                                                        {formatAdminDate(
                                                            assignment.startsAt,
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="rounded-2xl bg-neutral-50 px-3 py-3 dark:bg-neutral-950/50">
                                                    <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                                        Selesai
                                                    </div>
                                                    <div className="mt-1 text-sm font-medium text-neutral-900 dark:text-white">
                                                        {formatAdminDate(
                                                            assignment.endsAt,
                                                            'Masih aktif',
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </AdminPanel>
                                    ),
                                )
                            )}
                        </div>
                    </div>
                </section>
            </AdminWorkspaceShell>
        </>
    );
}

AdminOrganization.layout = {
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
            title: 'Organisasi',
            href: adminDashboard(),
        },
    ],
};
