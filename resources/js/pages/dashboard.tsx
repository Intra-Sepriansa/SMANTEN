import { Head, Link } from '@inertiajs/react';
import {
    GraduationCap,
    LayoutGrid,
    ShieldCheck,
    Users,
} from 'lucide-react';
import { dashboard } from '@/routes';

type DashboardUser = {
    name: string;
    email: string;
    roles?: string[];
};

export default function Dashboard() {
    const roleLinks = [
        {
            label: 'Admin Dashboard',
            href: '/dashboard/admin',
            icon: ShieldCheck,
            description: 'Kelola PPDB, artikel, organisasi, dan data sekolah.',
            roles: ['super_admin', 'operator_sekolah'],
        },
        {
            label: 'Guru Dashboard',
            href: '/dashboard/guru',
            icon: GraduationCap,
            description: 'Jadwal mengajar, review portfolio, dan moderasi karya.',
            roles: ['guru'],
        },
        {
            label: 'Siswa Dashboard',
            href: '/dashboard/siswa',
            icon: Users,
            description: 'Jadwal belajar, portfolio karya, dan pengumuman.',
            roles: ['siswa', 'jurnalis_siswa'],
        },
        {
            label: 'Wali Murid Dashboard',
            href: '/dashboard/wali',
            icon: Users,
            description: 'Pantau perkembangan anak dan pengumuman sekolah.',
            roles: ['wali_murid'],
        },
    ];

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
                        Portal Internal SMAN 1 Tenjo
                    </h1>
                    <p className="mt-1 text-sm text-neutral-500">
                        Pilih dashboard sesuai peran Anda untuk mulai mengelola.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {roleLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="group rounded-2xl border border-neutral-200 bg-white p-6 transition hover:border-teal-200 hover:shadow-lg dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-teal-800"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 transition group-hover:bg-teal-100 dark:bg-teal-900/30 dark:text-teal-400">
                                    <link.icon className="size-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                                        {link.label}
                                    </h2>
                                    <p className="text-sm text-neutral-500">
                                        {link.description}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-1.5">
                                {link.roles.map((role) => (
                                    <span
                                        key={role}
                                        className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[0.68rem] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                                    >
                                        {role}
                                    </span>
                                ))}
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/50 p-6 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900/50">
                    Dashboard ini akan otomatis mengarahkan ke halaman yang sesuai
                    berdasarkan role saat fitur auto-redirect diaktifkan di Fase 5.
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
