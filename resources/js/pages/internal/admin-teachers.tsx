import { Head } from '@inertiajs/react';
import { CalendarDays, FileText, LayoutDashboard } from 'lucide-react';
import {
    AdminPanel,
    AdminSectionIntro,
    AdminWorkspaceShell,
} from '@/components/internal/admin/admin-workspace-shell';
import { formatAdminDateTime } from '@/lib/admin-format';
import { dashboard } from '@/routes';
import { admin as adminDashboard } from '@/routes/dashboard';
import { articles, schedule } from '@/routes/dashboard/admin';

type TeacherDesk = {
    teachers: Array<{
        id: number;
        name: string;
        email: string | null;
        status: string | null;
        statusLabel: string;
        isVerified: boolean;
        hasTwoFactor: boolean;
        lastSeenAt: string | null;
        articleCount: number;
        portfolioCount: number;
    }>;
    verifiedCount: number;
    twoFactorCount: number;
    recentlySeenCount: number;
};

type AdminTeachersProps = {
    stats: {
        teacherCount: number;
    };
    teacherDesk: TeacherDesk;
};

export default function AdminTeachers({
    stats,
    teacherDesk,
}: AdminTeachersProps) {
    const numberFormatter = new Intl.NumberFormat('id-ID');

    return (
        <>
            <Head title="Monitor Guru" />

            <AdminWorkspaceShell
                current="teachers"
                eyebrow="Teacher Monitor"
                title="Menu guru sekarang punya konteks operasional sendiri."
                description="Pantau status akun, verifikasi, 2FA, dan jejak kontribusi guru tanpa tenggelam di halaman admin lain."
                stats={[
                    {
                        label: 'Guru',
                        value: numberFormatter.format(stats.teacherCount),
                        helper: 'Total akun guru',
                        tone: 'sky',
                    },
                    {
                        label: 'Verified',
                        value: numberFormatter.format(
                            teacherDesk.verifiedCount,
                        ),
                        helper: 'Email terverifikasi',
                        tone: 'emerald',
                    },
                    {
                        label: 'Aktif 24 Jam',
                        value: numberFormatter.format(
                            teacherDesk.recentlySeenCount,
                        ),
                        helper: 'Trafik terbaru',
                        tone: 'amber',
                    },
                ]}
                actions={[
                    {
                        label: 'Kembali ke Dashboard',
                        href: adminDashboard(),
                        detail: 'Balik ke snapshot lintas menu admin.',
                        icon: LayoutDashboard,
                        tone: 'slate',
                    },
                    {
                        label: 'Buka Jadwal',
                        href: schedule(),
                        detail: 'Cocokkan guru dengan distribusi jadwal aktif.',
                        icon: CalendarDays,
                        tone: 'sky',
                    },
                    {
                        label: 'Buka Artikel',
                        href: articles(),
                        detail: 'Baca ritme kontribusi editorial guru.',
                        icon: FileText,
                        tone: 'emerald',
                    },
                ]}
            >
                <section className="space-y-4">
                    <AdminSectionIntro
                        eyebrow="Security Snapshot"
                        title="Kesehatan akses guru"
                        description="Cek layer keamanan dan keterlibatan guru dalam satu baris pandang."
                    />

                    <div className="grid gap-4">
                        <AdminPanel>
                            <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                2FA Aktif
                            </div>
                            <div className="mt-2 text-3xl font-bold text-neutral-950 dark:text-white">
                                {numberFormatter.format(
                                    teacherDesk.twoFactorCount,
                                )}
                            </div>
                        </AdminPanel>
                        <AdminPanel>
                            <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                Verified
                            </div>
                            <div className="mt-2 text-3xl font-bold text-neutral-950 dark:text-white">
                                {numberFormatter.format(
                                    teacherDesk.verifiedCount,
                                )}
                            </div>
                        </AdminPanel>
                        <AdminPanel>
                            <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                Aktif 24 Jam
                            </div>
                            <div className="mt-2 text-3xl font-bold text-neutral-950 dark:text-white">
                                {numberFormatter.format(
                                    teacherDesk.recentlySeenCount,
                                )}
                            </div>
                        </AdminPanel>
                    </div>
                </section>

                <section className="space-y-4">
                    <AdminSectionIntro
                        eyebrow="Teacher Cards"
                        title="Kartu guru"
                        description="Gunakan kartu ini untuk membaca status akun dan kontribusi tanpa banyak teks."
                    />

                    <div className="grid gap-4">
                        {teacherDesk.teachers.length === 0 ? (
                            <AdminPanel>
                                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                    Belum ada akun guru.
                                </div>
                            </AdminPanel>
                        ) : (
                            teacherDesk.teachers.map((teacher) => (
                                <AdminPanel key={teacher.id}>
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="text-base font-semibold text-neutral-950 dark:text-white">
                                                {teacher.name}
                                            </div>
                                            <div className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                                                {teacher.email ??
                                                    'Email belum tersedia'}
                                            </div>
                                        </div>
                                        <div className="rounded-full bg-neutral-100 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-600 uppercase dark:bg-neutral-800 dark:text-neutral-300">
                                            {teacher.statusLabel}
                                        </div>
                                    </div>

                                    <div className="mt-4 grid gap-2 sm:grid-cols-3">
                                        <div className="rounded-2xl bg-neutral-50 px-3 py-3 dark:bg-neutral-950/50">
                                            <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                                Artikel
                                            </div>
                                            <div className="mt-1 text-lg font-semibold text-neutral-950 dark:text-white">
                                                {numberFormatter.format(
                                                    teacher.articleCount,
                                                )}
                                            </div>
                                        </div>
                                        <div className="rounded-2xl bg-neutral-50 px-3 py-3 dark:bg-neutral-950/50">
                                            <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                                Karya
                                            </div>
                                            <div className="mt-1 text-lg font-semibold text-neutral-950 dark:text-white">
                                                {numberFormatter.format(
                                                    teacher.portfolioCount,
                                                )}
                                            </div>
                                        </div>
                                        <div className="rounded-2xl bg-neutral-50 px-3 py-3 dark:bg-neutral-950/50">
                                            <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                                Last Seen
                                            </div>
                                            <div className="mt-1 text-sm font-medium text-neutral-900 dark:text-white">
                                                {formatAdminDateTime(
                                                    teacher.lastSeenAt,
                                                    'Belum terlihat',
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <span
                                            className={`rounded-full px-3 py-1 text-[0.68rem] font-semibold tracking-[0.16em] uppercase ${teacher.isVerified ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200'}`}
                                        >
                                            {teacher.isVerified
                                                ? 'Verified'
                                                : 'Unverified'}
                                        </span>
                                        <span
                                            className={`rounded-full px-3 py-1 text-[0.68rem] font-semibold tracking-[0.16em] uppercase ${teacher.hasTwoFactor ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}
                                        >
                                            {teacher.hasTwoFactor
                                                ? '2FA On'
                                                : '2FA Off'}
                                        </span>
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

AdminTeachers.layout = {
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
            title: 'Guru',
            href: adminDashboard(),
        },
    ],
};
