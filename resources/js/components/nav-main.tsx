import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import type { NavItem } from '@/types';

export function NavMain({
    items = [],
    label = 'Platform',
}: {
    items: NavItem[];
    label?: string;
}) {
    const { isCurrentOrParentUrl, isCurrentUrl } = useCurrentUrl();

    const shouldUseParentMatch = (href: NavItem['href']): boolean => {
        const url = toUrl(href);

        return url.includes('/dashboard/admin');
    };

    return (
        <SidebarGroup className="px-2 py-1">
            <SidebarGroupLabel className="px-3 text-[0.64rem] font-bold tracking-[0.18em] text-sidebar-foreground/55 uppercase">
                {label}
            </SidebarGroupLabel>
            <SidebarMenu className="gap-1.5">
                {items.map((item) => {
                    const isActive =
                        item.isActive ??
                        (shouldUseParentMatch(item.href)
                            ? isCurrentOrParentUrl(item.href)
                            : isCurrentUrl(item.href));

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                tooltip={{ children: item.title }}
                                className={cn(
                                    'h-auto rounded-lg border border-transparent px-2 py-2 transition-all duration-300 group-data-[collapsible=icon]/sidebar-wrapper:justify-center',
                                    'hover:border-violet-200/70 hover:bg-white/75 hover:text-sidebar-accent-foreground hover:shadow-lg hover:shadow-violet-950/5 dark:hover:border-white/10 dark:hover:bg-white/8',
                                    isActive &&
                                        'border-violet-200/80 bg-white/85 text-sidebar-accent-foreground shadow-lg shadow-violet-950/5 dark:border-white/10 dark:bg-white/10',
                                )}
                            >
                                <Link
                                    href={item.href}
                                    prefetch
                                    className="group/nav flex min-w-0 items-center gap-2.5 overflow-hidden"
                                >
                                    {item.icon && (
                                        <span
                                            className={cn(
                                                'admin-sidebar-icon flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-md transition-all duration-300 group-data-[collapsible=icon]/sidebar-wrapper:size-4 group-data-[collapsible=icon]/sidebar-wrapper:border-0 group-data-[collapsible=icon]/sidebar-wrapper:bg-transparent group-data-[collapsible=icon]/sidebar-wrapper:shadow-none',
                                                isActive
                                                    ? 'border-violet-200 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-blue-500 text-white shadow-violet-500/20'
                                                    : 'border-neutral-200 bg-white text-violet-700 group-hover/nav:border-violet-200 group-hover/nav:text-fuchsia-700 dark:border-white/10 dark:bg-white/10 dark:text-violet-200',
                                            )}
                                        >
                                            <item.icon className="size-4" />
                                        </span>
                                    )}
                                    <div className="min-w-0 flex-1 text-left group-data-[collapsible=icon]/sidebar-wrapper:hidden">
                                        <span className="truncate text-sm font-semibold">
                                            {item.title}
                                        </span>
                                    </div>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
