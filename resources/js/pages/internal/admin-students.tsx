import { Head } from '@inertiajs/react';
import {
    CalendarDays,
    Download,
    LayoutDashboard,
    Sparkles,
} from 'lucide-react';
import {
    AdminPanel,
    AdminSectionIntro,
    AdminWorkspaceShell,
} from '@/components/internal/admin/admin-workspace-shell';
import { formatAdminDateTime } from '@/lib/admin-format';
import { dashboard } from '@/routes';
import { admin as adminDashboard } from '@/routes/dashboard';
import { studentPortfolio, studentSchedule } from '@/routes/dashboard/admin';
import { students as exportStudents } from '@/routes/internal-api/exports';

type StudentDesk = {
    students: Array<{
        id: number;
        name: string;
        email: string | null;
        status: string | null;
        statusLabel: string;
        isVerified: boolean;
        lastSeenAt: string | null;
        portfolioCount: number;
    }>;
    portfolioLeaders: Array<{
        id: number;
        name: string;
        portfolioCount: number;
    }>;
    recentlySeenCount: number;
    verifiedCount: number;
};

type AdminStudentsProps = {
    stats: {
        studentCount: number;
    };
    studentDesk: StudentDesk;
};

export default function AdminStudents({
    stats,
    studentDesk,
}: AdminStudentsProps) {
    const numberFormatter = new Intl.NumberFormat('id-ID');

    return (
        <>
            <Head title="Akses Siswa" />

            <AdminWorkspaceShell
                current="students"
                eyebrow="Student Access"
                title="Akses siswa punya halaman monitor tersendiri."
                description="Menu ini fokus ke siapa yang aktif, siapa yang terverifikasi, dan siapa yang paling banyak mengirim karya."
                stats={[
                    {
                        label: 'Siswa',
                        value: numberFormatter.format(stats.studentCount),
                        helper: 'Total akun siswa',
                        tone: 'sky',
                    },
                    {
                        label: 'Verified',
                        value: numberFormatter.format(
                            studentDesk.verifiedCount,
                        ),
                        helper: 'Email terverifikasi',
                        tone: 'emerald',
                    },
                    {
                        label: 'Aktif 24 Jam',
                        value: numberFormatter.format(
                            studentDesk.recentlySeenCount,
                        ),
                        helper: 'Trafik terbaru',
                        tone: 'amber',
                    },
                ]}
                actions={[
                    {
                        label: 'Kembali ke Dashboard',
                        href: adminDashboard(),
                        detail: 'Balik ke ringkasan seluruh menu admin.',
                        icon: LayoutDashboard,
                        tone: 'slate',
                    },
                    {
                        label: 'Buka Jadwal Siswa',
                        href: studentSchedule(),
                        detail: 'Audit distribusi jadwal ke akun siswa.',
                        icon: CalendarDays,
                        tone: 'sky',
                    },
                    {
                        label: 'Buka Portofolio Siswa',
                        href: studentPortfolio(),
                        detail: 'Baca dampak karya dari sisi siswa.',
                        icon: Sparkles,
                        tone: 'emerald',
                    },
                ]}
            >
                <section className="grid gap-6">
                    <AdminPanel className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="text-sm font-semibold text-neutral-950 dark:text-white">
                                Export Data Siswa
                            </div>
                            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                                Unduh data siswa untuk rekap Excel dan arsip
                                akademik.
                            </p>
                        </div>
                        <a
                            href={exportStudents.url()}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-(--school-green-700) px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-(--school-green-600)"
                        >
                            <Download className="size-4" />
                            Download CSV
                        </a>
                    </AdminPanel>

                    <div className="space-y-4">
                        <AdminSectionIntro
                            eyebrow="Creator Leaders"
                            title="Top creator"
                            description="Snapshot cepat untuk melihat siswa yang paling produktif."
                        />

                        <div className="grid gap-3">
                            {studentDesk.portfolioLeaders.length === 0 ? (
                                <AdminPanel>
                                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                        Belum ada leader karya.
                                    </div>
                                </AdminPanel>
                            ) : (
                                studentDesk.portfolioLeaders.map((leader) => (
                                    <AdminPanel key={leader.id}>
                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <div className="text-sm font-semibold text-neutral-950 dark:text-white">
                                                    {leader.name}
                                                </div>
                                                <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                                    Kontribusi karya siswa
                                                </div>
                                            </div>
                                            <div className="text-2xl font-bold text-(--school-green-700) dark:text-(--school-green-300)">
                                                {numberFormatter.format(
                                                    leader.portfolioCount,
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
                            eyebrow="Student Cards"
                            title="Kartu akses siswa"
                            description="Status akun, verifikasi, dan jejak karya tampil ringkas."
                        />

                        <div className="grid gap-3">
                            {studentDesk.students.length === 0 ? (
                                <AdminPanel>
                                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                        Belum ada akun siswa.
                                    </div>
                                </AdminPanel>
                            ) : (
                                studentDesk.students.map((student) => (
                                    <AdminPanel key={student.id}>
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="text-base font-semibold text-neutral-950 dark:text-white">
                                                    {student.name}
                                                </div>
                                                <div className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                                                    {student.email ??
                                                        'Email belum tersedia'}
                                                </div>
                                            </div>
                                            <div className="rounded-full bg-neutral-100 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-600 uppercase dark:bg-neutral-800 dark:text-neutral-300">
                                                {student.statusLabel}
                                            </div>
                                        </div>

                                        <div className="mt-4 grid gap-2 sm:grid-cols-3">
                                            <div className="rounded-2xl bg-neutral-50 px-3 py-3 dark:bg-neutral-950/50">
                                                <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                                    Karya
                                                </div>
                                                <div className="mt-1 text-lg font-semibold text-neutral-950 dark:text-white">
                                                    {numberFormatter.format(
                                                        student.portfolioCount,
                                                    )}
                                                </div>
                                            </div>
                                            <div className="rounded-2xl bg-neutral-50 px-3 py-3 dark:bg-neutral-950/50">
                                                <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                                    Last Seen
                                                </div>
                                                <div className="mt-1 text-sm font-medium text-neutral-900 dark:text-white">
                                                    {formatAdminDateTime(
                                                        student.lastSeenAt,
                                                        'Belum terlihat',
                                                    )}
                                                </div>
                                            </div>
                                            <div className="rounded-2xl bg-neutral-50 px-3 py-3 dark:bg-neutral-950/50">
                                                <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                                    Verifikasi
                                                </div>
                                                <div className="mt-1 text-sm font-medium text-neutral-900 dark:text-white">
                                                    {student.isVerified
                                                        ? 'Verified'
                                                        : 'Unverified'}
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

AdminStudents.layout = {
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
            title: 'Akses Siswa',
            href: adminDashboard(),
        },
    ],
};
