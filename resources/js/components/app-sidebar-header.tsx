import { Breadcrumbs } from '@/components/breadcrumbs';
import { GlobalCommandPalette } from '@/components/global-command-palette';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-white/70 bg-background/78 px-4 shadow-sm shadow-violet-950/5 backdrop-blur-xl transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-5 dark:border-white/10 dark:bg-background/70 dark:shadow-black/20">
            <div className="flex min-w-0 items-center gap-3">
                <SidebarTrigger className="-ml-1 rounded-lg border border-violet-200/70 bg-white/80 shadow-sm hover:bg-white dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="ml-auto">
                <GlobalCommandPalette
                    compact
                    triggerClassName="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-teal-200 hover:text-teal-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
                />
            </div>
        </header>
    );
}
