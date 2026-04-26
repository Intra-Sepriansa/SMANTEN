import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Compass,
    RadioTower,
    Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { BorderGlow } from '@/components/public/border-glow';
import { SectionHeading } from '@/components/public/section-heading';
import { Button } from '@/components/ui/button';
import { kesiswaan } from '@/routes';
import type { SchoolProfilePayload } from '@/types';

export type StudentAffairsFocusStat = {
    label: string;
    value: string;
    helper: string;
    icon: LucideIcon;
};

export type StudentAffairsFocusStep = {
    label: string;
    title: string;
    description: string;
    icon: LucideIcon;
};

export type StudentAffairsFocusPanel = {
    title: string;
    description: string;
    metric: string;
    value: string;
    icon: LucideIcon;
};

export type StudentAffairsFocusConfig = {
    title: string;
    shortTitle: string;
    eyebrow: string;
    headTitle: string;
    metaDescription: string;
    heroImage: string;
    heroImageAlt: string;
    accent: string;
    accentSoft: string;
    accentDark: string;
    intro: string;
    promise: string;
    stats: StudentAffairsFocusStat[];
    steps: StudentAffairsFocusStep[];
    panels: StudentAffairsFocusPanel[];
    serviceSignals: string[];
    finalTitle: string;
    finalDescription: string;
};

type StudentAffairsFocusPageProps = {
    school: SchoolProfilePayload;
    focus: StudentAffairsFocusConfig;
};

export function StudentAffairsFocusPage({
    school,
    focus,
}: StudentAffairsFocusPageProps) {
    const [activeStepIndex, setActiveStepIndex] = useState(0);
    const [activePanelIndex, setActivePanelIndex] = useState(0);

    const activeStep = focus.steps[activeStepIndex] ?? focus.steps[0];
    const activePanel = focus.panels[activePanelIndex] ?? focus.panels[0];
    const progressPercent = useMemo(
        () =>
            focus.steps.length > 0
                ? ((activeStepIndex + 1) / focus.steps.length) * 100
                : 0,
        [activeStepIndex, focus.steps.length],
    );

    if (!activeStep || !activePanel) {
        return null;
    }

    const ActiveStepIcon = activeStep.icon;
    const ActivePanelIcon = activePanel.icon;

    return (
        <>
            <Head title={focus.headTitle}>
                <meta name="description" content={focus.metaDescription} />
            </Head>

            <div className="space-y-10 pb-16 lg:space-y-14">
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.75 }}
                    className="relative right-1/2 left-1/2 -mt-8 -mr-[50vw] -ml-[50vw] min-h-[78vh] w-screen overflow-hidden bg-slate-950 md:-mt-10"
                >
                    <div className="absolute inset-0">
                        <img
                            src={focus.heroImage}
                            alt={focus.heroImageAlt}
                            className="h-full w-full object-cover opacity-32 mix-blend-luminosity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/82 to-slate-950/20" />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/52 to-transparent" />
                    </div>

                    <motion.div
                        aria-hidden="true"
                        animate={{
                            x: ['-18%', '18%', '-18%'],
                            opacity: [0.18, 0.36, 0.18],
                        }}
                        transition={{
                            duration: 16,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        className="absolute top-24 right-0 left-0 h-32 skew-y-[-8deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)] blur-2xl"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:48px_48px] opacity-25" />

                    <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-end px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
                        <div className="max-w-5xl">
                            <motion.div
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.15 }}
                                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2 text-[0.68rem] font-bold tracking-[0.24em] text-white/82 uppercase backdrop-blur"
                            >
                                <RadioTower
                                    className="size-4"
                                    style={{ color: focus.accent }}
                                />
                                {focus.eyebrow}
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.24 }}
                                className="mt-5 max-w-5xl font-heading text-5xl leading-[1.02] text-white md:text-7xl lg:text-[5.6rem]"
                            >
                                {focus.title}
                            </motion.h1>

                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.34 }}
                                className="mt-6 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4"
                            >
                                {focus.stats.map((stat) => {
                                    const StatIcon = stat.icon;

                                    return (
                                        <div
                                            key={stat.label}
                                            title={stat.helper}
                                            className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur"
                                        >
                                            <div className="flex items-center gap-2 text-[0.62rem] font-bold tracking-[0.18em] text-white/58 uppercase">
                                                <StatIcon className="size-3.5" />
                                                {stat.label}
                                            </div>
                                            <div className="mt-2 font-heading text-xl text-white">
                                                {stat.value}
                                            </div>
                                        </div>
                                    );
                                })}
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.44 }}
                                className="mt-8 flex flex-wrap gap-3"
                            >
                                <Button
                                    asChild
                                    className="rounded-full px-6 text-white shadow-xl"
                                    style={{
                                        backgroundColor: focus.accentDark,
                                    }}
                                >
                                    <a href="#ruang-kerja">
                                        Buka Ruang Kerja
                                        <ArrowRight className="ml-2 size-4" />
                                    </a>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="rounded-full border-white/20 bg-white/8 px-6 text-white hover:bg-white/14"
                                >
                                    <Link href={kesiswaan()} prefetch>
                                        <ArrowLeft className="mr-2 size-4" />
                                        Kembali ke Kesiswaan
                                    </Link>
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </motion.section>

                <section
                    id="ruang-kerja"
                    className="mx-auto max-w-7xl scroll-mt-28 space-y-8 px-4 sm:px-6"
                >
                    <SectionHeading
                        eyebrow={focus.shortTitle}
                        title="Pilih alur kerja."
                        description="Ringkas, interaktif, dan hanya untuk fungsi menu ini."
                    />

                    <div className="grid gap-6 xl:grid-cols-[0.84fr_1.16fr]">
                        <BorderGlow
                            borderRadius={36}
                            colors={[focus.accent, '#0EA5E9', '#F59E0B']}
                            className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-[0_32px_90px_-54px_rgba(15,118,110,0.38)] backdrop-blur-xl"
                        >
                            <div className="space-y-5 p-5 md:p-6">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <div className="text-[0.64rem] font-bold tracking-[0.22em] text-[var(--school-muted)] uppercase">
                                            Fokus Tunggal
                                        </div>
                                        <h2 className="mt-2 font-heading text-2xl text-[var(--school-ink)]">
                                            {focus.finalTitle}
                                        </h2>
                                    </div>
                                    <div
                                        className="flex size-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg"
                                        style={{
                                            background: `linear-gradient(135deg, ${focus.accent}, ${focus.accentDark})`,
                                        }}
                                    >
                                        <Sparkles className="size-5" />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    {focus.steps.map((step, index) => {
                                        const StepIcon = step.icon;
                                        const isActive =
                                            activeStepIndex === index;

                                        return (
                                            <button
                                                key={step.label}
                                                type="button"
                                                aria-pressed={isActive}
                                                onClick={() =>
                                                    setActiveStepIndex(index)
                                                }
                                                className="group grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border px-4 py-3 text-left transition hover:-translate-y-0.5"
                                                style={{
                                                    borderColor: isActive
                                                        ? focus.accent
                                                        : 'rgba(226,232,240,0.9)',
                                                    backgroundColor: isActive
                                                        ? focus.accentSoft
                                                        : 'rgba(248,250,252,0.84)',
                                                }}
                                            >
                                                <div
                                                    className="flex size-10 items-center justify-center rounded-xl text-white"
                                                    style={{
                                                        backgroundColor:
                                                            focus.accent,
                                                    }}
                                                >
                                                    <StepIcon className="size-4" />
                                                </div>
                                                <div>
                                                    <div className="text-[0.6rem] font-bold tracking-[0.18em] text-[var(--school-muted)] uppercase">
                                                        {step.label}
                                                    </div>
                                                    <div className="font-semibold text-[var(--school-ink)]">
                                                        {step.title}
                                                    </div>
                                                </div>
                                                <ArrowRight
                                                    className="size-4 transition group-hover:translate-x-1"
                                                    style={{
                                                        color: focus.accent,
                                                    }}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </BorderGlow>

                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35 }}
                            className="overflow-hidden rounded-[2rem] border border-white/70 bg-slate-950 p-5 text-white shadow-[0_32px_90px_-56px_rgba(15,23,42,0.7)] md:p-7"
                        >
                            <div className="flex items-start justify-between gap-5">
                                <div
                                    className="flex size-16 items-center justify-center rounded-3xl text-white shadow-xl"
                                    style={{
                                        background: `linear-gradient(135deg, ${focus.accent}, ${focus.accentDark})`,
                                    }}
                                >
                                    <ActiveStepIcon className="size-7" />
                                </div>
                                <div className="rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[0.64rem] font-bold tracking-[0.22em] text-white/70 uppercase">
                                    Tahap {activeStep.label}
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="font-heading text-4xl leading-tight md:text-5xl">
                                    {activeStep.title}
                                </h3>
                                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/68 md:text-base">
                                    {activeStep.description}
                                </p>
                            </div>

                            <div className="mt-8 h-2 overflow-hidden rounded-full bg-white/10">
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: focus.accent }}
                                    animate={{ width: `${progressPercent}%` }}
                                    transition={{
                                        duration: 0.45,
                                        ease: 'easeOut',
                                    }}
                                />
                            </div>

                            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                                <div className="text-sm font-semibold text-white/62">
                                    {activeStepIndex + 1}/{focus.steps.length}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setActiveStepIndex((current) =>
                                                Math.max(0, current - 1),
                                            )
                                        }
                                        disabled={activeStepIndex === 0}
                                        className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/14 disabled:cursor-not-allowed disabled:opacity-35"
                                    >
                                        Sebelumnya
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setActiveStepIndex((current) =>
                                                Math.min(
                                                    focus.steps.length - 1,
                                                    current + 1,
                                                ),
                                            )
                                        }
                                        disabled={
                                            activeStepIndex ===
                                            focus.steps.length - 1
                                        }
                                        className="rounded-full px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-35"
                                        style={{
                                            backgroundColor: focus.accent,
                                        }}
                                    >
                                        Berikutnya
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <section className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6">
                    <SectionHeading
                        eyebrow="Panel Fungsi"
                        title="Pilih mode kerja."
                        description="Cepat dibaca, cepat dipakai."
                    />

                    <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
                        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                            {focus.panels.map((panel, index) => {
                                const PanelIcon = panel.icon;
                                const isActive = activePanelIndex === index;

                                return (
                                    <button
                                        key={panel.title}
                                        type="button"
                                        aria-pressed={isActive}
                                        onClick={() =>
                                            setActivePanelIndex(index)
                                        }
                                        className="group rounded-[1.5rem] border p-4 text-left transition hover:-translate-y-0.5"
                                        style={{
                                            borderColor: isActive
                                                ? focus.accent
                                                : 'rgba(226,232,240,0.9)',
                                            backgroundColor: isActive
                                                ? focus.accentSoft
                                                : 'rgba(255,255,255,0.86)',
                                        }}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <PanelIcon
                                                className="size-5"
                                                style={{ color: focus.accent }}
                                            />
                                            <span className="text-[0.6rem] font-bold tracking-[0.18em] text-[var(--school-muted)] uppercase">
                                                {panel.metric}
                                            </span>
                                        </div>
                                        <div className="mt-4 font-heading text-2xl text-[var(--school-ink)]">
                                            {panel.value}
                                        </div>
                                        <div className="mt-1 text-sm font-semibold text-[var(--school-ink)]">
                                            {panel.title}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <BorderGlow
                            borderRadius={34}
                            colors={[focus.accent, '#0EA5E9', '#FFFFFF']}
                            className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_28px_80px_-54px_rgba(15,118,110,0.3)] backdrop-blur-xl md:p-8"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-5">
                                <div>
                                    <div className="text-[0.68rem] font-bold tracking-[0.22em] text-[var(--school-muted)] uppercase">
                                        {activePanel.metric}
                                    </div>
                                    <h3 className="mt-2 font-heading text-4xl text-[var(--school-ink)] md:text-5xl">
                                        {activePanel.title}
                                    </h3>
                                </div>
                                <div
                                    className="flex size-16 items-center justify-center rounded-3xl text-white shadow-xl"
                                    style={{
                                        background: `linear-gradient(135deg, ${focus.accent}, ${focus.accentDark})`,
                                    }}
                                >
                                    <ActivePanelIcon className="size-7" />
                                </div>
                            </div>

                            <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--school-muted)] md:text-base">
                                {activePanel.description}
                            </p>

                            <div className="mt-6 flex flex-wrap gap-2">
                                {focus.serviceSignals.map((signal) => (
                                    <span
                                        key={signal}
                                        className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold text-[var(--school-ink)]"
                                        style={{
                                            borderColor: `${focus.accent}24`,
                                            backgroundColor: `${focus.accent}10`,
                                        }}
                                    >
                                        <CheckCircle2
                                            className="size-3.5"
                                            style={{ color: focus.accent }}
                                        />
                                        {signal}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold tracking-[0.16em] text-[var(--school-muted)] uppercase">
                                tanpa mencampur menu lain
                            </div>
                        </BorderGlow>
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-slate-950 p-6 text-white shadow-[0_32px_90px_-54px_rgba(15,23,42,0.6)] sm:p-8">
                        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[0.68rem] font-bold tracking-[0.22em] text-white/72 uppercase">
                                    <Compass className="size-4" />
                                    {school.name}
                                </div>
                                <h2 className="mt-4 max-w-3xl font-heading text-3xl leading-tight md:text-4xl">
                                    {focus.shortTitle}: fokus, ringkas,
                                    operasional.
                                </h2>
                            </div>
                            <Button
                                asChild
                                className="rounded-full px-6 text-white"
                                style={{ backgroundColor: focus.accent }}
                            >
                                <Link href={kesiswaan()} prefetch>
                                    Kembali ke daftar Kesiswaan
                                    <ArrowRight className="ml-2 size-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
