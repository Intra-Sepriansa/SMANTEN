import { AppContent } from '@/components/app-content';
import { PageTransition } from '@/components/page-transition';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <PageTransition>
                    <AppSidebarHeader breadcrumbs={breadcrumbs} />
                    {children}
                </PageTransition>
            </AppContent>
        </AppShell>
    );
}
