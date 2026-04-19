import { Link } from '@inertiajs/react';
import { Settings } from 'lucide-react';
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
import { getAdminSidebarGroups } from '@/lib/admin-navigation';
import { dashboard } from '@/routes';
import { edit as editProfile } from '@/routes/profile';
import type { NavItem } from '@/types';

const footerNavItems: NavItem[] = [
    {
        title: 'Pengaturan Akun',
        href: editProfile(),
        icon: Settings,
    },
];

export function AppSidebar() {
    const adminSidebarGroups = getAdminSidebarGroups();

    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            className="admin-sidebar-shell"
        >
            <SidebarHeader className="p-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="h-14 rounded-lg border border-violet-200/70 bg-white/80 shadow-lg shadow-violet-950/5 transition hover:bg-white dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15"
                        >
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {adminSidebarGroups.map((group) => (
                    <NavMain
                        key={group.label}
                        items={group.items}
                        label={group.label}
                    />
                ))}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
