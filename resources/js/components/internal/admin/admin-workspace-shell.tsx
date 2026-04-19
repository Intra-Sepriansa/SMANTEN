import { Link } from '@inertiajs/react';
import type { InertiaLinkProps } from '@inertiajs/react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { getAdminWorkspaceItem } from '@/lib/admin-navigation';
import type { AdminWorkspaceKey } from '@/lib/admin-navigation';
import { cn } from '@/lib/utils';

type AdminTone = 'amber' | 'emerald' | 'rose' | 'sky' | 'slate';

type AdminWorkspaceStat = {
    label: string;
    value: ReactNode;
    helper?: string;
    tone?: AdminTone;
    icon?: LucideIcon;
};

type AdminWorkspaceAction = {
    label: string;
    href: NonNullable<InertiaLinkProps['href']>;
    detail?: string;
    icon?: LucideIcon;
    tone?: AdminTone;
};

type AdminWorkspaceShellProps = {
    current: AdminWorkspaceKey;
    eyebrow: string;
    title: string;
    description?: string;
    stats?: AdminWorkspaceStat[];
    actions?: AdminWorkspaceAction[];
    children: ReactNode;
};

const pageVariants: Variants = {
    hidden: { opacity: 0, y: 14, scale: 0.99 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            delayChildren: 0.08,
            staggerChildren: 0.06,
            type: 'spring',
            stiffness: 160,
            damping: 24,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 260, damping: 24 },
    },
};

const toneStyles: Record<
    AdminTone,
    {
        badge: string;
        border: string;
        icon: string;
        surface: string;
        text: string;
    }
> = {
    amber: {
        badge: 'border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200',
        border: 'border-amber-200/70 dark:border-amber-400/20',
        icon: 'bg-gradient-to-br from-amber-300 to-orange-500 text-white shadow-amber-500/25',
        surface:
            'bg-gradient-to-br from-amber-50 to-white dark:from-amber-500/10 dark:to-neutral-950/60',
        text: 'text-amber-700 dark:text-amber-200',
    },
    emerald: {
        badge: 'border-cyan-200 bg-cyan-100 text-cyan-800 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-200',
        border: 'border-cyan-200/70 dark:border-cyan-400/20',
        icon: 'bg-gradient-to-br from-cyan-300 to-blue-600 text-white shadow-cyan-500/25',
        surface:
            'bg-gradient-to-br from-cyan-50 to-white dark:from-cyan-500/10 dark:to-neutral-950/60',
        text: 'text-cyan-700 dark:text-cyan-200',
    },
    rose: {
        badge: 'border-rose-200 bg-rose-100 text-rose-800 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200',
        border: 'border-rose-200/70 dark:border-rose-400/20',
        icon: 'bg-gradient-to-br from-rose-300 to-red-600 text-white shadow-rose-500/25',
        surface:
            'bg-gradient-to-br from-rose-50 to-white dark:from-rose-500/10 dark:to-neutral-950/60',
        text: 'text-rose-700 dark:text-rose-200',
    },
    sky: {
        badge: 'border-sky-200 bg-sky-100 text-sky-800 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-200',
        border: 'border-sky-200/70 dark:border-sky-400/20',
        icon: 'bg-gradient-to-br from-sky-300 to-cyan-600 text-white shadow-sky-500/25',
        surface:
            'bg-gradient-to-br from-sky-50 to-white dark:from-sky-500/10 dark:to-neutral-950/60',
        text: 'text-sky-700 dark:text-sky-200',
    },
    slate: {
        badge: 'border-neutral-200 bg-neutral-100 text-neutral-700 dark:border-white/10 dark:bg-white/10 dark:text-neutral-200',
        border: 'border-neutral-200/80 dark:border-white/10',
        icon: 'bg-gradient-to-br from-violet-500 via-fuchsia-500 to-neutral-950 text-white shadow-violet-500/25',
        surface:
            'bg-gradient-to-br from-violet-50 to-white dark:from-violet-500/10 dark:to-neutral-950/60',
        text: 'text-neutral-700 dark:text-neutral-200',
    },
};

export function AdminWorkspaceShell({
    current,
    eyebrow,
    title,
    description,
    stats = [],
    actions = [],
    children,
}: AdminWorkspaceShellProps) {
    const currentWorkspace = getAdminWorkspaceItem(current);

    return (
        <motion.div
            className="admin-workspace-page space-y-6 p-4 sm:p-6 lg:p-8"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.section
                variants={itemVariants}
                className="admin-command-surface overflow-hidden rounded-lg border border-white/20 bg-[linear-gradient(135deg,#4f46e5_0%,#9333ea_48%,#ec4899_100%)] p-5 text-white shadow-[0_24px_70px_-42px_rgba(147,51,234,0.78)] sm:p-7"
            >
                <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                    <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
                        <motion.div
                            className="admin-command-icon flex size-16 shrink-0 items-center justify-center rounded-lg border border-white/25 bg-white/15 text-white shadow-2xl shadow-black/20 backdrop-blur sm:size-20"
                            whileHover={{ rotate: 4, scale: 1.04 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <currentWorkspace.icon className="size-8 sm:size-10" />
                        </motion.div>

                        <div className="min-w-0">
                            <motion.div
                                variants={itemVariants}
                                className="inline-flex rounded-lg border border-white/15 bg-black/15 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.22em] text-white/85 uppercase backdrop-blur"
                            >
                                {eyebrow}
                            </motion.div>
                            <motion.h1
                                variants={itemVariants}
                                className="mt-3 max-w-4xl text-2xl font-bold tracking-tight text-white sm:text-3xl"
                            >
                                {title}
                            </motion.h1>
                            {description && (
                                <motion.p
                                    variants={itemVariants}
                                    className="mt-3 max-w-3xl text-sm leading-6 text-white/78"
                                >
                                    {description}
                                </motion.p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 lg:justify-end">
                        <span className="rounded-lg border border-white/15 bg-white/15 px-3 py-2 text-xs font-semibold text-white/85 backdrop-blur">
                            {currentWorkspace.blurb}
                        </span>
                        <span className="rounded-lg border border-white/15 bg-black/15 px-3 py-2 text-xs font-semibold text-white/85 backdrop-blur">
                            {currentWorkspace.group}
                        </span>
                    </div>
                </div>
            </motion.section>

            {stats.length > 0 && (
                <motion.section
                    variants={itemVariants}
                    className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
                >
                    {stats.map((stat) => {
                        const tone = toneStyles[stat.tone ?? 'sky'];
                        const StatIcon = stat.icon ?? currentWorkspace.icon;

                        return (
                            <motion.div
                                key={stat.label}
                                className={cn(
                                    'admin-metric-card group relative overflow-hidden rounded-lg border p-4 shadow-xl shadow-neutral-900/5 backdrop-blur dark:shadow-black/20',
                                    tone.border,
                                    tone.surface,
                                )}
                                variants={itemVariants}
                                whileHover={{ y: -4, scale: 1.01 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 360,
                                    damping: 24,
                                }}
                            >
                                <div className="relative z-10 flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <div className="text-[0.68rem] font-semibold tracking-[0.18em] text-neutral-500 uppercase dark:text-neutral-400">
                                            {stat.label}
                                        </div>
                                        <div className="mt-2 text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
                                            {stat.value}
                                        </div>
                                        {stat.helper && (
                                            <div className="mt-1 text-sm leading-5 text-neutral-500 dark:text-neutral-400">
                                                {stat.helper}
                                            </div>
                                        )}
                                    </div>

                                    <div
                                        className={cn(
                                            'admin-card-icon flex size-11 shrink-0 items-center justify-center rounded-lg shadow-lg',
                                            tone.icon,
                                        )}
                                    >
                                        <StatIcon className="size-5" />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.section>
            )}

            {actions.length > 0 && (
                <motion.section
                    variants={itemVariants}
                    className="grid gap-3 lg:grid-cols-3"
                >
                    {actions.map((action) => {
                        const tone = toneStyles[action.tone ?? 'slate'];
                        const ActionIcon = action.icon ?? currentWorkspace.icon;

                        return (
                            <motion.div
                                key={action.label}
                                variants={itemVariants}
                                whileHover={{ y: -4, scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 360,
                                    damping: 24,
                                }}
                            >
                                <Link
                                    href={action.href}
                                    prefetch
                                    className={cn(
                                        'admin-action-card group flex h-full items-start gap-4 overflow-hidden rounded-lg border bg-white/80 p-4 shadow-xl shadow-neutral-900/5 backdrop-blur transition dark:bg-neutral-950/55 dark:shadow-black/20',
                                        tone.border,
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'admin-card-icon flex size-11 shrink-0 items-center justify-center rounded-lg shadow-lg',
                                            tone.icon,
                                        )}
                                    >
                                        <ActionIcon className="size-5" />
                                    </span>

                                    <span className="min-w-0 flex-1">
                                        <span
                                            className={cn(
                                                'inline-flex rounded-lg border px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.16em] uppercase',
                                                tone.badge,
                                            )}
                                        >
                                            Shortcut
                                        </span>
                                        <span className="mt-3 flex items-center justify-between gap-3 text-sm font-bold text-neutral-950 dark:text-white">
                                            {action.label}
                                            <ArrowUpRight
                                                className={cn(
                                                    'size-4 shrink-0 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
                                                    tone.text,
                                                )}
                                            />
                                        </span>
                                        {action.detail && (
                                            <span className="mt-1 block text-sm leading-5 text-neutral-500 dark:text-neutral-400">
                                                {action.detail}
                                            </span>
                                        )}
                                    </span>
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.section>
            )}

            <motion.div variants={itemVariants} className="space-y-6">
                {children}
            </motion.div>
        </motion.div>
    );
}

export function AdminSectionIntro({
    eyebrow,
    title,
    description,
}: {
    eyebrow: string;
    title: string;
    description?: string;
}) {
    return (
        <div className="admin-section-intro space-y-2">
            <div className="text-[0.68rem] font-semibold tracking-[0.2em] text-neutral-500 uppercase dark:text-neutral-400">
                {eyebrow}
            </div>
            <h2 className="text-xl font-semibold text-neutral-950 dark:text-white">
                {title}
            </h2>
            {description && (
                <p className="max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                    {description}
                </p>
            )}
        </div>
    );
}

export function AdminPanel({
    className,
    children,
}: {
    className?: string;
    children: ReactNode;
}) {
    return (
        <div
            className={cn(
                'admin-dock-panel rounded-lg border border-white/70 bg-white/85 p-5 shadow-xl shadow-neutral-900/5 backdrop-blur dark:border-white/10 dark:bg-neutral-950/55 dark:shadow-black/20',
                className,
            )}
        >
            {children}
        </div>
    );
}
