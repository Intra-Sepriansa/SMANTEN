import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Activity, CheckCircle2, RadioTower } from 'lucide-react';
import { cn } from '@/lib/utils';

type AdminCommandTone =
    | 'amber'
    | 'emerald'
    | 'rose'
    | 'sky'
    | 'slate'
    | 'violet';

export type AdminCommandMetric = {
    label: string;
    value: string;
    helper: string;
    icon?: LucideIcon;
    tone?: AdminCommandTone;
};

export type AdminCommandLane = {
    label: string;
    title: string;
    description: string;
    value: string;
    icon?: LucideIcon;
    tone?: AdminCommandTone;
};

type AdminAdvancedCommandCenterProps = {
    eyebrow: string;
    title: string;
    description: string;
    metrics: AdminCommandMetric[];
    lanes: AdminCommandLane[];
    icon?: LucideIcon;
};

const toneStyles: Record<
    AdminCommandTone,
    {
        badge: string;
        icon: string;
        line: string;
        surface: string;
        text: string;
    }
> = {
    amber: {
        badge: 'border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200',
        icon: 'from-amber-300 to-orange-500 text-white',
        line: 'from-amber-400 to-orange-500',
        surface:
            'from-amber-50 to-white dark:from-amber-500/10 dark:to-neutral-950/60',
        text: 'text-amber-700 dark:text-amber-200',
    },
    emerald: {
        badge: 'border-cyan-200 bg-cyan-100 text-cyan-800 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-200',
        icon: 'from-cyan-300 to-blue-600 text-white',
        line: 'from-cyan-400 to-blue-500',
        surface:
            'from-cyan-50 to-white dark:from-cyan-500/10 dark:to-neutral-950/60',
        text: 'text-cyan-700 dark:text-cyan-200',
    },
    rose: {
        badge: 'border-rose-200 bg-rose-100 text-rose-800 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200',
        icon: 'from-rose-300 to-red-600 text-white',
        line: 'from-rose-400 to-red-500',
        surface:
            'from-rose-50 to-white dark:from-rose-500/10 dark:to-neutral-950/60',
        text: 'text-rose-700 dark:text-rose-200',
    },
    sky: {
        badge: 'border-sky-200 bg-sky-100 text-sky-800 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-200',
        icon: 'from-sky-300 to-cyan-600 text-white',
        line: 'from-sky-400 to-cyan-500',
        surface:
            'from-sky-50 to-white dark:from-sky-500/10 dark:to-neutral-950/60',
        text: 'text-sky-700 dark:text-sky-200',
    },
    slate: {
        badge: 'border-neutral-200 bg-neutral-100 text-neutral-700 dark:border-white/10 dark:bg-white/10 dark:text-neutral-200',
        icon: 'from-violet-500 via-fuchsia-500 to-neutral-950 text-white',
        line: 'from-violet-400 to-fuchsia-500',
        surface:
            'from-violet-50 to-white dark:from-violet-500/10 dark:to-neutral-950/60',
        text: 'text-neutral-700 dark:text-neutral-200',
    },
    violet: {
        badge: 'border-violet-200 bg-violet-100 text-violet-800 dark:border-violet-400/20 dark:bg-violet-400/10 dark:text-violet-200',
        icon: 'from-violet-300 to-fuchsia-600 text-white',
        line: 'from-violet-400 to-fuchsia-500',
        surface:
            'from-violet-50 to-white dark:from-violet-500/10 dark:to-neutral-950/60',
        text: 'text-violet-700 dark:text-violet-200',
    },
};

export function AdminAdvancedCommandCenter({
    eyebrow,
    title,
    description,
    metrics,
    lanes,
    icon: HeaderIcon = RadioTower,
}: AdminAdvancedCommandCenterProps) {
    const visibleMetrics = metrics.slice(0, 4);
    const visibleLanes = lanes.slice(0, 4);

    return (
        <motion.section
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-lg border border-white/70 bg-white/88 shadow-xl shadow-neutral-900/5 backdrop-blur dark:border-white/10 dark:bg-neutral-950/60 dark:shadow-black/20"
        >
            <div className="relative grid gap-6 p-5 sm:p-6 xl:grid-cols-[0.86fr_1.14fr]">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.05)_1px,transparent_1px)] bg-[size:34px_34px] dark:bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)]" />
                <div className="relative space-y-5">
                    <div className="flex items-start gap-4">
                        <motion.div
                            whileHover={{ rotate: 4, scale: 1.04 }}
                            transition={{ type: 'spring', stiffness: 280 }}
                            className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 via-fuchsia-500 to-neutral-950 text-white shadow-xl shadow-violet-500/20"
                        >
                            <HeaderIcon className="size-7" />
                        </motion.div>
                        <div className="min-w-0">
                            <div className="inline-flex rounded-lg border border-neutral-200 bg-neutral-100 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.2em] text-neutral-600 uppercase dark:border-white/10 dark:bg-white/10 dark:text-neutral-300">
                                {eyebrow}
                            </div>
                            <h2 className="mt-3 text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
                                {title}
                            </h2>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                                {description}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        {visibleMetrics.map((metric, index) => {
                            const tone = toneStyles[metric.tone ?? 'sky'];
                            const MetricIcon = metric.icon ?? Activity;

                            return (
                                <motion.div
                                    key={metric.label}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.4 }}
                                    transition={{
                                        delay: index * 0.06,
                                        duration: 0.4,
                                    }}
                                    whileHover={{ y: -3, scale: 1.01 }}
                                    className={cn(
                                        'rounded-lg border border-white/70 bg-gradient-to-br p-4 shadow-lg shadow-neutral-900/5 dark:border-white/10 dark:shadow-black/20',
                                        tone.surface,
                                    )}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="text-[0.66rem] font-semibold tracking-[0.18em] text-neutral-500 uppercase dark:text-neutral-400">
                                                {metric.label}
                                            </div>
                                            <div className="mt-2 truncate text-2xl font-extrabold text-neutral-950 dark:text-white">
                                                {metric.value}
                                            </div>
                                            <div className="mt-1 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
                                                {metric.helper}
                                            </div>
                                        </div>
                                        <div
                                            className={cn(
                                                'flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br shadow-lg',
                                                tone.icon,
                                            )}
                                        >
                                            <MetricIcon className="size-5" />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                <div className="relative rounded-lg border border-neutral-200/80 bg-neutral-950 p-4 text-white shadow-2xl shadow-neutral-950/20 dark:border-white/10">
                    <div className="absolute inset-0 rounded-lg bg-[linear-gradient(rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[size:30px_30px]" />
                    <div className="relative flex h-full flex-col gap-4">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <div className="text-[0.66rem] font-semibold tracking-[0.2em] text-neutral-400 uppercase">
                                    Operations flow
                                </div>
                                <div className="mt-1 text-lg font-semibold">
                                    Prioritas kerja lanjutan
                                </div>
                            </div>
                            <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-white/80">
                                <CheckCircle2 className="size-4 text-cyan-300" />
                                Live
                            </span>
                        </div>

                        <div className="grid flex-1 gap-3">
                            {visibleLanes.map((lane, index) => {
                                const tone = toneStyles[lane.tone ?? 'slate'];
                                const LaneIcon = lane.icon ?? Activity;

                                return (
                                    <motion.div
                                        key={lane.title}
                                        initial={{ opacity: 0, x: 18 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{
                                            once: true,
                                            amount: 0.45,
                                        }}
                                        transition={{
                                            delay: index * 0.08,
                                            duration: 0.45,
                                        }}
                                        className="group grid gap-4 rounded-lg border border-white/10 bg-white/8 p-4 backdrop-blur transition hover:bg-white/12 sm:grid-cols-[auto_1fr_auto] sm:items-center"
                                    >
                                        <div
                                            className={cn(
                                                'flex size-11 items-center justify-center rounded-lg bg-gradient-to-br shadow-lg transition group-hover:scale-105',
                                                tone.icon,
                                            )}
                                        >
                                            <LaneIcon className="size-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <div
                                                className={cn(
                                                    'inline-flex rounded-md border px-2 py-0.5 text-[0.6rem] font-semibold tracking-[0.18em] uppercase',
                                                    tone.badge,
                                                )}
                                            >
                                                {lane.label}
                                            </div>
                                            <div className="mt-2 text-sm font-bold text-white">
                                                {lane.title}
                                            </div>
                                            <p className="mt-1 text-xs leading-5 text-neutral-400">
                                                {lane.description}
                                            </p>
                                        </div>
                                        <div className="sm:w-32">
                                            <div className="text-right text-lg font-extrabold text-white">
                                                {lane.value}
                                            </div>
                                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                                                <motion.div
                                                    initial={{ width: '18%' }}
                                                    whileInView={{
                                                        width: `${Math.min(
                                                            100,
                                                            42 + index * 16,
                                                        )}%`,
                                                    }}
                                                    viewport={{ once: true }}
                                                    transition={{
                                                        delay:
                                                            0.16 + index * 0.08,
                                                        duration: 0.7,
                                                    }}
                                                    className={cn(
                                                        'h-full rounded-full bg-gradient-to-r',
                                                        tone.line,
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
