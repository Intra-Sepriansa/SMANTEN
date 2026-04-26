import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Activity, ArrowUpRight, RadioTower, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type StageTone = 'amber' | 'emerald' | 'rose' | 'sky' | 'violet';

export type AdvancedMenuMetric = {
    label: string;
    value: string;
    helper: string;
    icon?: LucideIcon;
};

export type AdvancedMenuStep = {
    label: string;
    title: string;
    description: string;
    icon?: LucideIcon;
};

export type AdvancedMenuSignal = {
    label: string;
    value: string;
};

type AdvancedMenuStageProps = {
    eyebrow: string;
    title: string;
    description: string;
    metrics: AdvancedMenuMetric[];
    steps: AdvancedMenuStep[];
    signals: AdvancedMenuSignal[];
    tone?: StageTone;
    className?: string;
};

const toneStyles: Record<
    StageTone,
    {
        border: string;
        glow: string;
        icon: string;
        line: string;
        text: string;
    }
> = {
    amber: {
        border: 'border-amber-400/30',
        glow: 'shadow-amber-500/20',
        icon: 'from-amber-300 to-orange-500',
        line: 'from-amber-300 via-orange-400 to-emerald-300',
        text: 'text-amber-200',
    },
    emerald: {
        border: 'border-emerald-400/30',
        glow: 'shadow-emerald-500/20',
        icon: 'from-emerald-300 to-teal-500',
        line: 'from-emerald-300 via-teal-300 to-sky-300',
        text: 'text-emerald-200',
    },
    rose: {
        border: 'border-rose-400/30',
        glow: 'shadow-rose-500/20',
        icon: 'from-rose-300 to-pink-500',
        line: 'from-rose-300 via-pink-400 to-amber-300',
        text: 'text-rose-200',
    },
    sky: {
        border: 'border-sky-400/30',
        glow: 'shadow-sky-500/20',
        icon: 'from-sky-300 to-cyan-500',
        line: 'from-sky-300 via-cyan-300 to-emerald-300',
        text: 'text-sky-200',
    },
    violet: {
        border: 'border-violet-400/30',
        glow: 'shadow-violet-500/20',
        icon: 'from-violet-300 to-fuchsia-500',
        line: 'from-violet-300 via-fuchsia-400 to-amber-300',
        text: 'text-violet-200',
    },
};

export function AdvancedMenuStage({
    eyebrow,
    title,
    description,
    metrics,
    steps,
    signals,
    tone = 'emerald',
    className,
}: AdvancedMenuStageProps) {
    const styles = toneStyles[tone];
    const visibleMetrics = metrics.slice(0, 4);
    const visibleSteps = steps.slice(0, 4);
    const visibleSignals = signals.slice(0, 5);

    return (
        <motion.section
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
                'relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] w-screen overflow-hidden bg-slate-950 py-16 text-white sm:py-20',
                className,
            )}
        >
            <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:42px_42px]" />
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(15,23,42,0.95),rgba(15,23,42,0.7),rgba(2,6,23,0.98))]" />
            <motion.div
                aria-hidden="true"
                animate={{ backgroundPosition: ['0% 50%', '100% 50%'] }}
                transition={{
                    duration: 16,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'linear',
                }}
                className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/60 to-transparent bg-[length:200%_100%]"
            />

            <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
                <div className="space-y-8">
                    <div>
                        <div
                            className={cn(
                                'inline-flex items-center gap-2 rounded-full border bg-white/7 px-4 py-2 text-[0.66rem] font-bold tracking-[0.24em] uppercase backdrop-blur',
                                styles.border,
                                styles.text,
                            )}
                        >
                            <RadioTower className="size-4" />
                            {eyebrow}
                        </div>
                        <h2 className="mt-6 max-w-3xl font-heading text-3xl leading-tight md:text-4xl lg:text-5xl">
                            {title}
                        </h2>
                        <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                            {description}
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        {visibleMetrics.map((metric, index) => {
                            const MetricIcon = metric.icon ?? Activity;

                            return (
                                <motion.div
                                    key={metric.label}
                                    initial={{ opacity: 0, y: 18 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.4 }}
                                    transition={{
                                        delay: index * 0.08,
                                        duration: 0.48,
                                    }}
                                    whileHover={{ y: -4, scale: 1.01 }}
                                    className={cn(
                                        'group rounded-2xl border border-white/10 bg-white/7 p-5 shadow-2xl backdrop-blur-xl transition hover:bg-white/10',
                                        styles.glow,
                                    )}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <div className="text-[0.66rem] font-bold tracking-[0.2em] text-slate-400 uppercase">
                                                {metric.label}
                                            </div>
                                            <div className="mt-2 truncate font-heading text-2xl text-white">
                                                {metric.value}
                                            </div>
                                            <p className="mt-2 text-xs leading-5 text-slate-400">
                                                {metric.helper}
                                            </p>
                                        </div>
                                        <div
                                            className={cn(
                                                'flex size-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br text-white shadow-lg transition group-hover:scale-110',
                                                styles.icon,
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

                <div className="relative min-h-[35rem] overflow-hidden rounded-[2rem] border border-white/10 bg-white/7 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6">
                    <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.12),transparent_38%,rgba(255,255,255,0.06))]" />
                    <div className="relative flex h-full flex-col gap-6">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <div className="text-[0.66rem] font-bold tracking-[0.22em] text-slate-400 uppercase">
                                    Live command map
                                </div>
                                <div className="mt-1 font-heading text-2xl text-white">
                                    Advanced workflow
                                </div>
                            </div>
                            <div
                                className={cn(
                                    'flex size-12 items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-xl',
                                    styles.icon,
                                )}
                            >
                                <Sparkles className="size-5" />
                            </div>
                        </div>

                        <div className="relative flex-1 rounded-[1.5rem] border border-white/10 bg-slate-950/45 p-4">
                            <div
                                className={cn(
                                    'absolute top-1/2 right-6 left-6 h-0.5 -translate-y-1/2 bg-linear-to-r opacity-70',
                                    styles.line,
                                )}
                            />
                            <div className="relative grid h-full gap-4 sm:grid-cols-2">
                                {visibleSteps.map((step, index) => {
                                    const StepIcon =
                                        step.icon ??
                                        visibleMetrics[0]?.icon ??
                                        Activity;

                                    return (
                                        <motion.div
                                            key={step.label}
                                            initial={{
                                                opacity: 0,
                                                scale: 0.94,
                                                y: 18,
                                            }}
                                            whileInView={{
                                                opacity: 1,
                                                scale: 1,
                                                y: 0,
                                            }}
                                            viewport={{
                                                once: true,
                                                amount: 0.35,
                                            }}
                                            transition={{
                                                delay: index * 0.1,
                                                type: 'spring',
                                                stiffness: 220,
                                                damping: 22,
                                            }}
                                            className="relative flex min-h-40 flex-col justify-between rounded-2xl border border-white/10 bg-white/8 p-5 shadow-xl shadow-black/10 backdrop-blur"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div
                                                    className={cn(
                                                        'flex size-10 items-center justify-center rounded-xl bg-linear-to-br text-white',
                                                        styles.icon,
                                                    )}
                                                >
                                                    <StepIcon className="size-4" />
                                                </div>
                                                <span className="rounded-full border border-white/10 bg-white/8 px-2.5 py-1 text-[0.6rem] font-bold tracking-[0.18em] text-slate-300 uppercase">
                                                    {step.label}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="font-heading text-lg leading-tight text-white">
                                                    {step.title}
                                                </h3>
                                                <p className="mt-2 text-xs leading-5 text-slate-400">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-5">
                            {visibleSignals.map((signal, index) => (
                                <motion.div
                                    key={signal.label}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.5 }}
                                    transition={{
                                        delay: 0.22 + index * 0.05,
                                        duration: 0.36,
                                    }}
                                    className="rounded-2xl border border-white/10 bg-white/8 px-3 py-3"
                                >
                                    <div className="truncate text-[0.58rem] font-bold tracking-[0.18em] text-slate-500 uppercase">
                                        {signal.label}
                                    </div>
                                    <div className="mt-1 truncate text-sm font-bold text-white">
                                        {signal.value}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="flex items-center justify-end">
                            <div
                                className={cn(
                                    'inline-flex items-center gap-2 rounded-full border bg-white/7 px-4 py-2 text-xs font-bold backdrop-blur',
                                    styles.border,
                                    styles.text,
                                )}
                            >
                                Siap untuk operasional lanjut
                                <ArrowUpRight className="size-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
