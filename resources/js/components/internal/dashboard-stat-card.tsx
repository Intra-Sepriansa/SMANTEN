import type { ReactNode } from 'react';

type DashboardStatCardProps = {
    label: string;
    value: string | number;
    icon: ReactNode;
    trend?: string;
    accentColor?: string;
};

export function DashboardStatCard({
    label,
    value,
    icon,
    trend,
    accentColor = 'var(--school-green-700)',
}: DashboardStatCardProps) {
    return (
        <div className="rounded-2xl border border-sidebar-border/50 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-sidebar-border dark:bg-neutral-900">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
                    {label}
                </span>
                <span style={{ color: accentColor }}>{icon}</span>
            </div>
            <div className="mt-3 text-3xl font-bold text-neutral-900 dark:text-white">
                {value}
            </div>
            {trend ? (
                <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                    {trend}
                </div>
            ) : null}
        </div>
    );
}
