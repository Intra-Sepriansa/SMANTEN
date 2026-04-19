import { Head } from '@inertiajs/react';
import { CalendarDays, LayoutDashboard, Users } from 'lucide-react';
import {
    AdminPanel,
    AdminSectionIntro,
    AdminWorkspaceShell,
} from '@/components/internal/admin/admin-workspace-shell';
import { formatAdminDate, formatAdminDateTime } from '@/lib/admin-format';
import { dashboard } from '@/routes';
import { admin as adminDashboard } from '@/routes/dashboard';
import { schedule, students } from '@/routes/dashboard/admin';

type StudentDesk = {
    recentlySeenCount: number;
    verifiedCount: number;
};

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

type AdminStudentScheduleProps = {
    stats: {
        studentCount: number;
        publishedTimetableCount: number;
        draftTimetableCount: number;
    };
    studentDesk: StudentDesk;
    scheduleDesk: ScheduleDesk;
};

export default function AdminStudentSchedule({
    stats,
    studentDesk,
    scheduleDesk,
}: AdminStudentScheduleProps) {
    const numberFormatter = new Intl.NumberFormat('id-ID');

    return (
        <>
            <Head title="Jadwal Siswa" />

            <AdminWorkspaceShell
                current="student-schedule"
                eyebrow="Student Schedule"
                title="Jadwal siswa dipisah agar dampaknya lebih mudah dibaca."
                description="Halaman ini menghubungkan publish jadwal dengan kesiapan akses siswa, jadi admin bisa melihat distribusi dari sisi penerima."
                stats={[
                    {
                        label: 'Siswa',
                        value: numberFormatter.format(stats.studentCount),
                        helper: 'Akun sasaran',
                        tone: 'sky',
                    },
                    {
                        label: 'Jadwal Live',
                        value: numberFormatter.format(
                            stats.publishedTimetableCount,
                        ),
                        helper: 'Versi siap dibaca',
                        tone: 'emerald',
                    },
                    {
                        label: 'Draft',
                        value: numberFormatter.format(
                            stats.draftTimetableCount,
                        ),
                        helper: 'Masih belum publish',
                        tone: 'amber',
                    },
                ]}
                actions={[
                    {
                        label: 'Kembali ke Dashboard',
                        href: adminDashboard(),
                        detail: 'Balik ke ringkasan semua menu.',
                        icon: LayoutDashboard,
                        tone: 'slate',
                    },
                    {
                        label: 'Buka Jadwal Utama',
                        href: schedule(),
                        detail: 'Lihat versi dan ruang dari sisi operasional.',
                        icon: CalendarDays,
                        tone: 'sky',
                    },
                    {
                        label: 'Buka Akses Siswa',
                        href: students(),
                        detail: 'Bandingkan distribusi jadwal dengan trafik siswa.',
                        icon: Users,
                        tone: 'emerald',
                    },
                ]}
            >
                <section className="grid gap-6">
                    <div className="space-y-4">
                        <AdminSectionIntro
                            eyebrow="Readiness"
                            title="Kesiapan akses siswa"
                            description="Dua angka ini cukup untuk membaca apakah jadwal live benar-benar bisa diterima oleh siswa."
                        />

                        <div className="grid gap-3">
                            <AdminPanel>
                                <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                    Verified
                                </div>
                                <div className="mt-2 text-3xl font-bold text-neutral-950 dark:text-white">
                                    {numberFormatter.format(
                                        studentDesk.verifiedCount,
                                    )}
                                </div>
                            </AdminPanel>
                            <AdminPanel>
                                <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                    Aktif 24 Jam
                                </div>
                                <div className="mt-2 text-3xl font-bold text-neutral-950 dark:text-white">
                                    {numberFormatter.format(
                                        studentDesk.recentlySeenCount,
                                    )}
                                </div>
                            </AdminPanel>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <AdminSectionIntro
                            eyebrow="Published Versions"
                            title="Versi yang dibaca siswa"
                            description="Pantau versi yang sudah live beserta rentang efektifnya."
                        />

                        <div className="grid gap-3">
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
                                                    {version.term ??
                                                        'Tanpa term'}
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
                                    </AdminPanel>
                                ))
                            )}
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <AdminSectionIntro
                        eyebrow="Distribution Snapshot"
                        title="Entry yang terakhir tersusun"
                        description="Gunakan daftar ini untuk melihat apa yang paling baru didorong ke permukaan jadwal siswa."
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
                                                {entry.teacher ?? 'Belum ada'}
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
                </section>
            </AdminWorkspaceShell>
        </>
    );
}

AdminStudentSchedule.layout = {
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
            title: 'Jadwal Siswa',
            href: adminDashboard(),
        },
    ],
};
