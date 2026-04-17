import { motion, AnimatePresence } from 'framer-motion';
import {
    Award,
    BadgeCheck,
    Building2,
    ChevronRight,
    Layers,
    Sparkles,
    User,
    Users,
    Zap,
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { organizationBlueprint } from '@/lib/public-content';
import { fadeUp, motionViewport, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/utils';
import type { OrganizationNode } from '@/types';

type OrganizationScope = 'school_management' | 'student_organization';

type InteractiveOrgChartProps = {
    nodes: OrganizationNode[];
    scope: OrganizationScope;
};

type BlueprintNode = (typeof organizationBlueprint)[OrganizationScope][number];

type ChartSlot = BlueprintNode & {
    actualNode: OrganizationNode | null;
};

const tierLabels: Record<number, string> = {
    1: 'Pimpinan Tertinggi',
    2: 'Wakil & Koordinator',
    3: 'Pelaksana & Fungsional',
};

const tierColors: Record<number, { gradient: string; border: string; iconBg: string; iconColor: string; connector: string }> = {
    1: {
        gradient: 'from-emerald-500/5 via-transparent to-sky-500/5',
        border: 'border-emerald-200/60',
        iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-700',
        iconColor: 'text-white',
        connector: 'from-emerald-500 to-sky-500',
    },
    2: {
        gradient: 'from-sky-500/5 via-transparent to-violet-500/5',
        border: 'border-sky-200/60',
        iconBg: 'bg-gradient-to-br from-sky-500 to-sky-700',
        iconColor: 'text-white',
        connector: 'from-sky-400 to-violet-400',
    },
    3: {
        gradient: 'from-violet-500/5 via-transparent to-amber-500/5',
        border: 'border-slate-200/60',
        iconBg: 'bg-gradient-to-br from-slate-500 to-slate-700',
        iconColor: 'text-white',
        connector: 'from-violet-400 to-amber-400',
    },
};

const tierGridClasses: Record<number, string> = {
    1: 'grid-cols-1 max-w-xl mx-auto',
    2: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4',
    3: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4',
    4: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4',
};

function getInitials(name: string | null | undefined): string {
    if (!name) return '??';
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();
}

function resolveSlots(
    nodes: OrganizationNode[],
    scope: OrganizationScope,
): ChartSlot[] {
    return organizationBlueprint[scope].map((slot) => {
        const actualNode =
            nodes.find((node) => node.positionSlug === slot.id) ??
            nodes.find(
                (node) =>
                    node.position?.toLowerCase().replaceAll(' ', '-') === slot.id,
            ) ??
            null;

        return {
            ...slot,
            actualNode,
        };
    });
}

export function InteractiveOrgChart({
    nodes,
    scope,
}: InteractiveOrgChartProps) {
    const slots = resolveSlots(nodes, scope);
    const tiers = Array.from(new Set(slots.map((slot) => slot.tier))).sort(
        (left, right) => left - right,
    );

    return (
        <div className="space-y-4">
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={motionViewport}
                className="space-y-0"
            >
                {tiers.map((tier, tierIndex) => {
                    const tierSlots = slots.filter((slot) => slot.tier === tier);
                    const tc = tierColors[tier] ?? tierColors[3];
                    const isTopTier = tier === 1;
                    const gridClass = tierGridClasses[Math.min(4, tierSlots.length)] ?? 'grid-cols-1';

                    return (
                        <motion.section
                            key={tier}
                            variants={fadeUp}
                            className="relative"
                        >
                            {/* ──── CONNECTOR LINES ──── */}
                            {tierIndex > 0 && (
                                <div className="relative h-16 md:h-20 flex items-center justify-center">
                                    {/* Center vertical line */}
                                    <div className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b ${tc.connector} opacity-30`} />
                                    {/* Animated pulse dot in the center */}
                                    <motion.div
                                        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className={`relative z-10 size-3 rounded-full bg-gradient-to-br ${tc.connector} shadow-lg`}
                                    />
                                    {/* Horizontal branch line for multi-node tiers */}
                                    {tierSlots.length > 1 && (
                                        <div className={`absolute left-[8%] right-[8%] top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-slate-300/50 to-transparent md:block`} />
                                    )}
                                </div>
                            )}

                            {/* ──── TIER LABEL ──── */}
                            <div className="mb-6 flex items-center gap-3">
                                <div className={`flex size-8 items-center justify-center rounded-lg ${tc.iconBg} ${tc.iconColor} shadow-md`}>
                                    <Layers className="size-4" />
                                </div>
                                <div>
                                    <span className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-slate-400">
                                        Tier {tier}
                                    </span>
                                    <h3 className="text-sm font-semibold text-[var(--school-ink)]">
                                        {tierLabels[tier] ?? `Tier ${tier}`}
                                    </h3>
                                </div>
                            </div>

                            {/* ──── CARD GRID ──── */}
                            <div className={cn('grid gap-5', isTopTier ? gridClass : (tierGridClasses[Math.min(4, tierSlots.length)] ?? 'grid-cols-1'))}>
                                {tierSlots.map((slot, slotIndex) => (
                                    <Dialog key={slot.id}>
                                        <DialogTrigger asChild>
                                            <motion.button
                                                type="button"
                                                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                                                className={cn(
                                                    'group relative text-left overflow-hidden transition-shadow duration-300',
                                                    isTopTier
                                                        ? 'rounded-[2.5rem] p-8 md:p-10'
                                                        : 'rounded-[2rem] p-6',
                                                    slot.actualNode
                                                        ? `border bg-white/92 shadow-[0_20px_60px_-30px_rgba(15,118,110,0.25)] hover:shadow-[0_30px_80px_-30px_rgba(15,118,110,0.4)] ${tc.border}`
                                                        : 'border border-dashed border-slate-200 bg-slate-50/60 hover:shadow-lg',
                                                )}
                                            >
                                                {/* Ambient gradient overlay */}
                                                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tc.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                                                
                                                {/* Glow ring effect on hover for top tier */}
                                                {isTopTier && slot.actualNode && (
                                                    <div className="pointer-events-none absolute -inset-px rounded-[2.5rem] bg-gradient-to-br from-emerald-400/20 via-transparent to-sky-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                )}

                                                <div className="relative z-10">
                                                    {/* Header Row */}
                                                    <div className="flex items-start gap-4">
                                                        {/* Avatar / Icon */}
                                                        <div className={cn(
                                                            'relative flex-shrink-0 flex items-center justify-center rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105',
                                                            isTopTier ? 'size-16' : 'size-12',
                                                            slot.actualNode
                                                                ? tc.iconBg
                                                                : 'bg-slate-200',
                                                        )}>
                                                            {slot.actualNode ? (
                                                                <span className={cn('font-heading font-bold text-white', isTopTier ? 'text-xl' : 'text-base')}>
                                                                    {getInitials(slot.actualNode.name)}
                                                                </span>
                                                            ) : (
                                                                <User className={cn('text-slate-400', isTopTier ? 'size-7' : 'size-5')} />
                                                            )}
                                                            {/* Status indicator dot */}
                                                            {slot.actualNode && (
                                                                <div className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full border-2 border-white bg-emerald-500">
                                                                    <motion.div
                                                                        animate={{ scale: [0.8, 1.2, 0.8] }}
                                                                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                                                                        className="size-full rounded-full bg-emerald-400/40"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Info */}
                                                        <div className="flex-1 min-w-0 space-y-1">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                {slot.actualNode ? (
                                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-emerald-700">
                                                                        <BadgeCheck className="size-3" />
                                                                        Aktif
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-100 px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-amber-700">
                                                                        <Zap className="size-3" />
                                                                        Adaptif
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <h3 className={cn(
                                                                'font-heading font-semibold text-[var(--school-ink)] leading-tight',
                                                                isTopTier ? 'text-2xl md:text-3xl' : 'text-lg',
                                                            )}>
                                                                {slot.title}
                                                            </h3>
                                                        </div>
                                                    </div>

                                                    {/* Body */}
                                                    <div className={cn('mt-4 space-y-3', isTopTier ? 'pl-20' : 'pl-16')}>
                                                        <div className={cn(
                                                            'font-medium',
                                                            isTopTier ? 'text-base' : 'text-sm',
                                                            slot.actualNode ? 'text-slate-700' : 'text-slate-400',
                                                        )}>
                                                            {slot.actualNode?.name ??
                                                                'Belum ada penanggung jawab aktif.'}
                                                        </div>
                                                        <p className="text-sm leading-relaxed text-[var(--school-muted)] line-clamp-2">
                                                            {slot.actualNode?.biography ??
                                                                slot.description}
                                                        </p>
                                                        {/* CTA */}
                                                        <div className="flex items-center gap-1 text-xs font-semibold text-sky-600 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                                                            Lihat Detail <ChevronRight className="size-3.5" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.button>
                                        </DialogTrigger>

                                        {/* ──── DETAIL DIALOG ──── */}
                                        <DialogContent className="max-w-2xl rounded-[2.5rem] border-white/80 bg-gradient-to-b from-white to-slate-50/95 p-0 overflow-hidden">
                                            {/* Dialog Header Banner */}
                                            <div className={`relative h-32 bg-gradient-to-r ${tc.connector} overflow-hidden`}>
                                                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                                {/* Avatar in dialog */}
                                                <div className="absolute -bottom-8 left-8">
                                                    <div className={cn(
                                                        'flex size-20 items-center justify-center rounded-3xl shadow-2xl border-4 border-white',
                                                        slot.actualNode ? tc.iconBg : 'bg-slate-300',
                                                    )}>
                                                        {slot.actualNode ? (
                                                            <span className="font-heading text-2xl font-bold text-white">
                                                                {getInitials(slot.actualNode.name)}
                                                            </span>
                                                        ) : (
                                                            <User className="size-8 text-slate-500" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="px-8 pt-12 pb-8 space-y-6">
                                                <DialogHeader className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        {slot.actualNode ? (
                                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-emerald-700">
                                                                <BadgeCheck className="size-3.5" />
                                                                Posisi Aktif
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-100 px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-amber-700">
                                                                <Zap className="size-3.5" />
                                                                Slot Adaptif
                                                            </span>
                                                        )}
                                                    </div>
                                                    <DialogTitle className="font-heading text-3xl text-[var(--school-ink)]">
                                                        {slot.title}
                                                    </DialogTitle>
                                                    <DialogDescription className="text-base leading-relaxed text-[var(--school-muted)]">
                                                        {slot.actualNode?.unit ??
                                                            (scope === 'school_management'
                                                                ? 'Manajemen Sekolah'
                                                                : 'OSIS')}{' '}
                                                        •{' '}
                                                        {slot.actualNode?.name ??
                                                            'Slot adaptif belum diisi'}
                                                    </DialogDescription>
                                                </DialogHeader>

                                                {/* Biografi */}
                                                <div className="rounded-2xl border border-slate-100 bg-white p-6">
                                                    <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                                                        <Award className="size-4" />
                                                        Deskripsi & Tanggung Jawab
                                                    </div>
                                                    <p className="text-sm leading-8 text-[var(--school-muted)]">
                                                        {slot.actualNode?.biography ??
                                                            slot.description}
                                                    </p>
                                                </div>

                                                {/* Stats */}
                                                <div className="grid gap-3 grid-cols-3">
                                                    <div className="rounded-2xl border border-slate-100 bg-white p-4 text-center">
                                                        <div className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-slate-400">
                                                            Tier
                                                        </div>
                                                        <div className="mt-2 text-2xl font-bold text-[var(--school-ink)]">
                                                            {slot.tier}
                                                        </div>
                                                    </div>
                                                    <div className="rounded-2xl border border-slate-100 bg-white p-4 text-center">
                                                        <div className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-slate-400">
                                                            Status
                                                        </div>
                                                        <div className={cn(
                                                            'mt-2 text-2xl font-bold',
                                                            slot.actualNode ? 'text-emerald-600' : 'text-amber-500',
                                                        )}>
                                                            {slot.actualNode ? 'Aktif' : 'Adaptif'}
                                                        </div>
                                                    </div>
                                                    <div className="rounded-2xl border border-slate-100 bg-white p-4 text-center">
                                                        <div className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-slate-400">
                                                            Scope
                                                        </div>
                                                        <div className="mt-2 text-2xl font-bold text-[var(--school-ink)]">
                                                            {scope === 'school_management'
                                                                ? 'Sekolah'
                                                                : 'OSIS'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                ))}
                            </div>
                        </motion.section>
                    );
                })}
            </motion.div>
        </div>
    );
}
