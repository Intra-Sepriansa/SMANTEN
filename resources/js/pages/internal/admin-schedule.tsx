import { Head } from '@inertiajs/react';
import { GraduationCap, LayoutDashboard, Users } from 'lucide-react';
import {
    AdminPanel,
    AdminSectionIntro,
    AdminWorkspaceShell,
} from '@/components/internal/admin/admin-workspace-shell';
import { formatAdminDate, formatAdminDateTime } from '@/lib/admin-format';
import { dashboard } from '@/routes';
import { admin as adminDashboard } from '@/routes/dashboard';
import { studentSchedule, teachers } from '@/routes/dashboard/admin';

type ScheduleDesk = {
    versions: Array<{
        id: number;
        name: string;
        term: string | null;
        status: string | null;
        statusLabel: string;
        entriesCount: number;
        effectiveFrom: string | null;
        effectiveUntil: string | null;
        publishedAt: string | null;
        publishedBy: string | null;
    }>;
    rooms: Array<{
        id: number;
        code: string | null;
        name: string;
        roomType: string;
        capacity: number | null;
        isSchedulable: boolean;
        supportsMovingClass: boolean;
        isActive: boolean;
    }>;
    recentEntries: Array<{
        id: number;
        teachingGroup: string | null;
        period: string | null;
        dayLabel: string;
        room: string | null;
        subject: string | null;
        teacher: string | null;
        status: string | null;
        statusLabel: string;
    }>;
};

type AdminScheduleProps = {
    stats: {
        publishedTimetableCount: number;
        draftTimetableCount: number;
        roomCount: number;
    };
    scheduleDesk: ScheduleDesk;
};

export default function AdminSchedule({
    stats,
    scheduleDesk,
}: AdminScheduleProps) {
    const numberFormatter = new Intl.NumberFormat('id-ID');

    return (
        <>
            <Head title="Jadwal & Ruang" />

            <AdminWorkspaceShell
                current="schedule"
                eyebrow="Schedule Desk"
                title="Jadwal dan ruang dipisah menjadi meja kontrol tersendiri."
                description="Versi, publish, ruang aktif, dan distribusi entry sekarang tampil sebagai alur kerja yang lebih cepat dibaca."
                stats={[
                    {
                        label: 'Published',
                        value: numberFormatter.format(
                            stats.publishedTimetableCount,
                        ),
                        helper: 'Versi tayang',
                        tone: 'emerald',
                    },
                    {
                        label: 'Draft',
                        value: numberFormatter.format(
                            stats.draftTimetableCount,
                        ),
                        helper: 'Masih perlu dituntaskan',
                        tone: 'amber',
                    },
                    {
                        label: 'Ruang Aktif',
                        value: numberFormatter.format(stats.roomCount),
                        helper: 'Siap dijadwalkan',
                        tone: 'sky',
                    },
                ]}
                actions={[
                    {
                        label: 'Kembali ke Dashboard',
                        href: adminDashboard(),
                        detail: 'Balik ke ringkasan semua menu admin.',
                        icon: LayoutDashboard,
                        tone: 'slate',
                    },
                    {
                        label: 'Buka Monitor Guru',
                        href: teachers(),
                        detail: 'Lihat dampak jadwal ke akun guru.',
                        icon: GraduationCap,
                        tone: 'sky',
                    },
                    {
                        label: 'Buka Jadwal Siswa',
                        href: studentSchedule(),
                        detail: 'Audit distribusi jadwal dari sisi siswa.',
                        icon: Users,
                        tone: 'emerald',
                    },
                ]}
            >
                <section className="space-y-4">
                    <AdminSectionIntro
                        eyebrow="Version Board"
                        title="Versi jadwal"
                        description="Lihat versi yang aktif, draft, dan volume entry pada tiap versi."
                    />

                    <div className="grid gap-4">
                        {scheduleDesk.versions.length === 0 ? (
                            <AdminPanel>
                                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                    Belum ada versi jadwal.
                                </div>
                            </AdminPanel>
                        ) : (
                            scheduleDesk.versions.map((version) => (
                                <AdminPanel key={version.id}>
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="text-base font-semibold text-neutral-950 dark:text-white">
                                                {version.name}
                                            </div>
                                            <div className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                                                {version.term ?? 'Tanpa term'}
                                            </div>
                                        </div>
                                        <div className="rounded-full bg-neutral-100 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-600 uppercase dark:bg-neutral-800 dark:text-neutral-300">
                                            {version.statusLabel}
                                        </div>
                                    </div>

                                    <div className="mt-4 grid gap-2 sm:grid-cols-3">
                                        <div className="rounded-2xl bg-neutral-50 px-3 py-3 dark:bg-neutral-950/50">
                                            <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                                Entries
                                            </div>
                                            <div className="mt-1 text-lg font-semibold text-neutral-950 dark:text-white">
                                                {numberFormatter.format(
                                                    version.entriesCount,
                                                )}
                                            </div>
                                        </div>
                                        <div className="rounded-2xl bg-neutral-50 px-3 py-3 dark:bg-neutral-950/50">
                                            <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                                Mulai
                                            </div>
                                            <div className="mt-1 text-sm font-medium text-neutral-900 dark:text-white">
                                                {formatAdminDate(
                                                    version.effectiveFrom,
                                                )}
                                            </div>
                                        </div>
                                        <div className="rounded-2xl bg-neutral-50 px-3 py-3 dark:bg-neutral-950/50">
                                            <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                                Publish
                                            </div>
                                            <div className="mt-1 text-sm font-medium text-neutral-900 dark:text-white">
                                                {formatAdminDateTime(
                                                    version.publishedAt,
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {version.publishedBy ? (
                                        <div className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
                                            Dipublish oleh {version.publishedBy}
                                        </div>
                                    ) : null}
                                </AdminPanel>
                            ))
                        )}
                    </div>
                </section>

                <section className="grid gap-6">
                    <div className="space-y-4">
                        <AdminSectionIntro
                            eyebrow="Active Rooms"
                            title="Ruang"
                            description="Cek kapasitas, status aktif, dan kesiapan moving class."
                        />

                        <div className="grid gap-3">
                            {scheduleDesk.rooms.map((room) => (
                                <AdminPanel key={room.id}>
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="text-sm font-semibold text-neutral-950 dark:text-white">
                                                {room.code ?? 'Tanpa kode'} •{' '}
                                                {room.name}
                                            </div>
                                            <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                                {room.roomType}
                                            </div>
                                        </div>
                                        <span
                                            className={`rounded-full px-3 py-1 text-[0.68rem] font-semibold tracking-[0.16em] uppercase ${room.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}
                                        >
                                            {room.isActive ? 'Active' : 'Off'}
                                        </span>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2 text-[0.68rem] font-semibold tracking-[0.16em] uppercase text-neutral-500 dark:text-neutral-400">
                                        <span className="rounded-full bg-neutral-100 px-3 py-1 dark:bg-neutral-800">
                                            Cap {room.capacity ?? '-'}
                                        </span>
                                        <span className="rounded-full bg-neutral-100 px-3 py-1 dark:bg-neutral-800">
                                            {room.isSchedulable
                                                ? 'Schedulable'
                                                : 'Manual'}
                                        </span>
                                        <span className="rounded-full bg-neutral-100 px-3 py-1 dark:bg-neutral-800">
                                            {room.supportsMovingClass
                                                ? 'Moving Class'
                                                : 'Static'}
                                        </span>
                                    </div>
                                </AdminPanel>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <AdminSectionIntro
                            eyebrow="Recent Entries"
                            title="Entry terbaru"
                            description="Ini cukup untuk membaca distribusi jadwal tanpa membuka tabel panjang."
                        />

                        <div className="grid gap-3">
                            {scheduleDesk.recentEntries.length === 0 ? (
                                <AdminPanel>
                                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                        Belum ada entry jadwal.
                                    </div>
                                </AdminPanel>
                            ) : (
                                scheduleDesk.recentEntries.map((entry) => (
                                    <AdminPanel key={entry.id}>
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="text-sm font-semibold text-neutral-950 dark:text-white">
                                                    {entry.subject ??
                                                        'Tanpa mapel'}{' '}
                                                    •{' '}
                                                    {entry.teachingGroup ??
                                                        'Tanpa kelas'}
                                                </div>
                                                <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                                    {entry.dayLabel} •{' '}
                                                    {entry.period ??
                                                        'Tanpa periode'}
                                                </div>
                                            </div>
                                            <div className="rounded-full bg-neutral-100 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-600 uppercase dark:bg-neutral-800 dark:text-neutral-300">
                                                {entry.statusLabel}
                                            </div>
                                        </div>

                                        <div className="mt-4 grid gap-2 sm:grid-cols-2">
                                            <div className="rounded-2xl bg-neutral-50 px-3 py-3 dark:bg-neutral-950/50">
                                                <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                                    Guru
                                                </div>
                                                <div className="mt-1 text-sm font-medium text-neutral-900 dark:text-white">
                                                    {entry.teacher ??
                                                        'Belum ada'}
                                                </div>
                                            </div>
                                            <div className="rounded-2xl bg-neutral-50 px-3 py-3 dark:bg-neutral-950/50">
                                                <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                                    Ruang
                                                </div>
                                                <div className="mt-1 text-sm font-medium text-neutral-900 dark:text-white">
                                                    {entry.room ?? 'Belum ada'}
                                                </div>
                                            </div>
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

AdminSchedule.layout = {
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
            title: 'Jadwal',
            href: adminDashboard(),
        },
    ],
};
