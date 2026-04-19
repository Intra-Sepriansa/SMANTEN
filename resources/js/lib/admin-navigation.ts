import type { InertiaLinkProps } from '@inertiajs/react';
import {
    BookOpen,
    CalendarDays,
    ClipboardList,
    Compass,
    FileText,
    GraduationCap,
    LayoutDashboard,
    Sparkles,
    Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { admin as adminDashboard } from '@/routes/dashboard';
import {
    articles,
    organization,
    portfolio,
    ppdb,
    schedule,
    studentPortfolio,
    studentSchedule,
    students,
    teachers,
    website,
} from '@/routes/dashboard/admin';
import type { NavItem } from '@/types';

export type AdminWorkspaceKey =
    | 'dashboard'
    | 'ppdb'
    | 'organization'
    | 'articles'
    | 'portfolio'
    | 'teachers'
    | 'schedule'
    | 'students'
    | 'student-schedule'
    | 'student-portfolio'
    | 'website';

export type AdminWorkspaceNavItem = NavItem & {
    key: AdminWorkspaceKey;
    blurb: string;
    group: 'Kelola Sekolah' | 'Akademik' | 'Siswa';
    icon: LucideIcon;
};

export type AdminWorkspaceNavGroup = {
    label: AdminWorkspaceNavItem['group'];
    items: AdminWorkspaceNavItem[];
};

const adminWorkspaceItems: AdminWorkspaceNavItem[] = [
    {
        key: 'dashboard',
        title: 'Dashboard Admin',
        href: adminDashboard(),
        icon: LayoutDashboard,
        description: 'Ringkas, monitor, prioritas',
        badge: 'Dash',
        blurb: 'Snapshot lintas menu admin.',
        group: 'Kelola Sekolah',
    },
    {
        key: 'ppdb',
        title: 'PPDB',
        href: ppdb(),
        icon: ClipboardList,
        description: 'Seleksi, berkas, hasil',
        badge: 'Desk',
        blurb: 'Verifikasi dan hasil PPDB.',
        group: 'Kelola Sekolah',
    },
    {
        key: 'organization',
        title: 'Organisasi',
        href: organization(),
        icon: Users,
        description: 'Struktur, posisi, current',
        badge: 'Gov',
        blurb: 'Struktur dan assignment aktif.',
        group: 'Kelola Sekolah',
    },
    {
        key: 'articles',
        title: 'Artikel',
        href: articles(),
        icon: FileText,
        description: 'Draft, review, publish',
        badge: 'Edit',
        blurb: 'Ritme editorial sekolah.',
        group: 'Kelola Sekolah',
    },
    {
        key: 'website',
        title: 'Website',
        href: website(),
        icon: BookOpen,
        description: 'Hero, menu, CTA',
        badge: 'CMS',
        blurb: 'Permukaan publik sekolah.',
        group: 'Kelola Sekolah',
    },
    {
        key: 'portfolio',
        title: 'Karya',
        href: portfolio(),
        icon: Compass,
        description: 'Submission, approve, live',
        badge: 'Curate',
        blurb: 'Kurasi karya yang siap tayang.',
        group: 'Akademik',
    },
    {
        key: 'teachers',
        title: 'Guru',
        href: teachers(),
        icon: GraduationCap,
        description: 'Akses, aktivitas, peran',
        badge: 'Teach',
        blurb: 'Pantau ritme guru di sistem.',
        group: 'Akademik',
    },
    {
        key: 'schedule',
        title: 'Jadwal',
        href: schedule(),
        icon: CalendarDays,
        description: 'Versi, ruang, publish',
        badge: 'Plan',
        blurb: 'Kontrol jadwal dan ruang aktif.',
        group: 'Akademik',
    },
    {
        key: 'students',
        title: 'Akses Siswa',
        href: students(),
        icon: Users,
        description: 'Akun, verifikasi, trafik',
        badge: 'User',
        blurb: 'Pantau akses siswa aktif.',
        group: 'Siswa',
    },
    {
        key: 'student-schedule',
        title: 'Jadwal Siswa',
        href: studentSchedule(),
        icon: CalendarDays,
        description: 'Distribusi jadwal siswa',
        badge: 'Sync',
        blurb: 'Apa yang diterima siswa dari jadwal.',
        group: 'Siswa',
    },
    {
        key: 'student-portfolio',
        title: 'Portofolio Siswa',
        href: studentPortfolio(),
        icon: Sparkles,
        description: 'Top creator, karya masuk',
        badge: 'Show',
        blurb: 'Dampak karya dari sisi siswa.',
        group: 'Siswa',
    },
];

export const adminWorkspaceGroups: AdminWorkspaceNavGroup[] = [
    {
        label: 'Kelola Sekolah',
        items: adminWorkspaceItems.filter(
            (item) => item.group === 'Kelola Sekolah',
        ),
    },
    {
        label: 'Akademik',
        items: adminWorkspaceItems.filter((item) => item.group === 'Akademik'),
    },
    {
        label: 'Siswa',
        items: adminWorkspaceItems.filter((item) => item.group === 'Siswa'),
    },
];

export const flatAdminWorkspaceItems = adminWorkspaceGroups.flatMap(
    (group) => group.items,
);

export function getAdminWorkspaceItem(
    key: AdminWorkspaceKey,
): AdminWorkspaceNavItem {
    return (
        flatAdminWorkspaceItems.find((item) => item.key === key) ??
        flatAdminWorkspaceItems[0]
    );
}

export function getAdminSidebarGroups(): Array<{
    label: string;
    items: NavItem[];
}> {
    return adminWorkspaceGroups.map((group) => ({
        label: group.label,
        items: group.items,
    }));
}

export type AdminWorkspaceHref = NonNullable<InertiaLinkProps['href']>;
