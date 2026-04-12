import { Link } from '@inertiajs/react';
import {
    BookOpen,
    CalendarDays,
    ClipboardList,
    Compass,
    FileText,
    GraduationCap,
    LayoutGrid,
    Settings,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/dashboard/admin',
        icon: LayoutGrid,
    },
    {
        title: 'PPDB',
        href: '/ppdb',
        icon: ClipboardList,
    },
    {
        title: 'Organisasi',
        href: '/organisasi',
        icon: Users,
    },
    {
        title: 'Artikel & Berita',
        href: '/berita',
        icon: FileText,
    },
    {
        title: 'Karya Portfolio',
        href: '/karya',
        icon: Compass,
    },
];

const akademikNavItems: NavItem[] = [
    {
        title: 'Guru Dashboard',
        href: '/dashboard/guru',
        icon: GraduationCap,
    },
    {
        title: 'Jadwal',
        href: '/akademik',
        icon: CalendarDays,
    },
    {
        title: 'Portfolio Review',
        href: '/karya',
        icon: Compass,
    },
];

const siswaNavItems: NavItem[] = [
    {
        title: 'Siswa Dashboard',
        href: '/dashboard/siswa',
        icon: LayoutGrid,
    },
    {
        title: 'Jadwal Belajar',
        href: '/akademik',
        icon: CalendarDays,
    },
    {
        title: 'Karya Saya',
        href: '/karya',
        icon: Compass,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Website Publik',
        href: '/',
        icon: BookOpen,
    },
    {
        title: 'Pengaturan',
        href: '/settings',
        icon: Settings,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                <NavMain items={adminNavItems} label="Kelola Sekolah" />
                <NavMain items={akademikNavItems} label="Akademik" />
                <NavMain items={siswaNavItems} label="Siswa" />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
