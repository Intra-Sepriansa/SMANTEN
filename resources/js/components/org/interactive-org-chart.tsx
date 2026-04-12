import { motion } from 'framer-motion';
import { Building2, Sparkles, Users } from 'lucide-react';
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

const tierGridClasses: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4',
};

function getScopeVisual(scope: OrganizationScope) {
    return scope === 'school_management'
        ? {
              icon: Building2,
              accent: 'var(--school-green-700)',
              accentSurface: 'rgba(220,252,231,0.46)',
              accentBorder: 'var(--school-green-200)',
          }
        : {
              icon: Users,
              accent: 'var(--school-gold-700)',
              accentSurface: 'rgba(255,251,235,0.9)',
              accentBorder: 'rgba(245,158,11,0.28)',
          };
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
    const filledCount = slots.filter((slot) => slot.actualNode).length;
    const visual = getScopeVisual(scope);
    const ScopeIcon = visual.icon;

    return (
        <div className="space-y-8">
            <div className="grid gap-4 lg:grid-cols-[0.64fr_0.36fr]">
                <div className="rounded-[1.8rem] border border-white/70 bg-white/88 p-6 shadow-[0_24px_70px_-44px_rgba(15,118,110,0.42)]">
                    <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.28em]" style={{ borderColor: visual.accentBorder, color: visual.accent }}>
                        <ScopeIcon className="size-4" />
                        {scope === 'school_management'
                            ? 'Manajemen Sekolah'
                            : 'Organisasi Siswa'}
                    </div>
                    <h2 className="mt-4 font-heading text-3xl leading-tight text-[var(--school-ink)]">
                        Struktur dibaca sebagai sistem posisi, bukan daftar nama lepas.
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--school-muted)]">
                        Node yang belum terisi tetap ditampilkan sebagai slot adaptif.
                        Dengan begitu, bagan tetap menjaga bentuk organisasi sambil
                        memberi ruang untuk pembaruan data tanpa membongkar tampilan.
                    </p>
                </div>
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
                    <div className="rounded-[1.7rem] border border-white/70 bg-white/88 p-5 shadow-[0_22px_60px_-46px_rgba(15,118,110,0.4)]">
                        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--school-muted)]">
                            Slot Aktif
                        </div>
                        <div className="mt-3 text-3xl font-semibold text-[var(--school-ink)]">
                            {filledCount}
                        </div>
                    </div>
                    <div className="rounded-[1.7rem] border border-white/70 bg-white/88 p-5 shadow-[0_22px_60px_-46px_rgba(15,118,110,0.4)]">
                        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--school-muted)]">
                            Slot Adaptif
                        </div>
                        <div className="mt-3 text-3xl font-semibold text-[var(--school-ink)]">
                            {slots.length - filledCount}
                        </div>
                    </div>
                    <div className="rounded-[1.7rem] border border-white/70 bg-white/88 p-5 shadow-[0_22px_60px_-46px_rgba(15,118,110,0.4)]">
                        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--school-muted)]">
                            Tier
                        </div>
                        <div className="mt-3 text-3xl font-semibold text-[var(--school-ink)]">
                            {tiers.length}
                        </div>
                    </div>
                </div>
            </div>

            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={motionViewport}
                className="space-y-8"
            >
                {tiers.map((tier, index) => {
                    const tierSlots = slots.filter((slot) => slot.tier === tier);
                    const previousTier = tiers[index - 1];

                    return (
                        <motion.section
                            key={tier}
                            variants={fadeUp}
                            className="relative"
                        >
                            {previousTier ? (
                                <>
                                    <div className="absolute left-1/2 top-0 hidden h-10 w-px -translate-x-1/2 bg-[linear-gradient(180deg,rgba(15,118,110,0.2),rgba(15,118,110,0.55))] md:block" />
                                    <div className="absolute left-[12%] right-[12%] top-10 hidden h-px bg-[linear-gradient(90deg,rgba(15,118,110,0),rgba(15,118,110,0.46),rgba(15,118,110,0))] md:block" />
                                </>
                            ) : null}

                            <div className={cn('grid gap-5 pt-0 md:pt-10', tierGridClasses[Math.min(4, tierSlots.length)] ?? 'grid-cols-1')}>
                                {tierSlots.map((slot) => (
                                    <Dialog key={slot.id}>
                                        <DialogTrigger asChild>
                                            <button
                                                type="button"
                                                className={cn(
                                                    'group relative rounded-[1.9rem] border p-6 text-left shadow-[0_26px_70px_-46px_rgba(15,118,110,0.42)] transition hover:-translate-y-1',
                                                    slot.actualNode
                                                        ? 'border-white/70 bg-white/92'
                                                        : 'border-dashed border-[var(--school-green-200)] bg-[rgba(248,252,251,0.72)]',
                                                )}
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div
                                                        className="rounded-full border p-3"
                                                        style={{
                                                            borderColor: visual.accentBorder,
                                                            backgroundColor: visual.accentSurface,
                                                            color: visual.accent,
                                                        }}
                                                    >
                                                        <ScopeIcon className="size-5" />
                                                    </div>
                                                    {slot.actualNode ? (
                                                        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--school-green-100)] bg-[rgba(220,252,231,0.4)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--school-green-700)]">
                                                            <Sparkles className="size-3.5" />
                                                            Terisi
                                                        </div>
                                                    ) : (
                                                        <div className="inline-flex rounded-full border border-[rgba(245,158,11,0.22)] bg-[rgba(255,251,235,0.92)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--school-gold-700)]">
                                                            Slot Adaptif
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-5 space-y-3">
                                                    <div className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--school-muted)]">
                                                        Tier {slot.tier}
                                                    </div>
                                                    <h3 className="text-2xl font-semibold text-[var(--school-ink)]">
                                                        {slot.title}
                                                    </h3>
                                                    <div className="text-base text-[var(--school-muted)]">
                                                        {slot.actualNode?.name ??
                                                            'Belum ada penanggung jawab aktif yang dipublikasikan.'}
                                                    </div>
                                                    <p className="text-sm leading-7 text-[var(--school-muted)]">
                                                        {slot.actualNode?.biography ??
                                                            slot.description}
                                                    </p>
                                                </div>
                                            </button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl rounded-[2rem] border-white/80 bg-[rgba(250,247,238,0.98)]">
                                            <DialogHeader>
                                                <DialogTitle className="font-heading text-3xl text-[var(--school-ink)]">
                                                    {slot.title}
                                                </DialogTitle>
                                                <DialogDescription className="text-base leading-8 text-[var(--school-muted)]">
                                                    {slot.actualNode?.unit ??
                                                        (scope === 'school_management'
                                                            ? 'Manajemen Sekolah'
                                                            : 'OSIS')}{' '}
                                                    •{' '}
                                                    {slot.actualNode?.name ??
                                                        'Slot adaptif belum diisi'}
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                                <div className="rounded-[1.6rem] border border-[var(--school-green-100)] bg-white/84 p-6 text-sm leading-8 text-[var(--school-muted)]">
                                                    {slot.actualNode?.biography ??
                                                        slot.description}
                                                </div>
                                                <div className="grid gap-4 md:grid-cols-3">
                                                    <div className="rounded-[1.35rem] border border-white/70 bg-white/84 p-4">
                                                        <div className="text-[0.68rem] uppercase tracking-[0.24em] text-[var(--school-muted)]">
                                                            Tier
                                                        </div>
                                                        <div className="mt-2 text-xl font-semibold text-[var(--school-ink)]">
                                                            {slot.tier}
                                                        </div>
                                                    </div>
                                                    <div className="rounded-[1.35rem] border border-white/70 bg-white/84 p-4">
                                                        <div className="text-[0.68rem] uppercase tracking-[0.24em] text-[var(--school-muted)]">
                                                            Status
                                                        </div>
                                                        <div className="mt-2 text-xl font-semibold text-[var(--school-ink)]">
                                                            {slot.actualNode ? 'Aktif' : 'Adaptif'}
                                                        </div>
                                                    </div>
                                                    <div className="rounded-[1.35rem] border border-white/70 bg-white/84 p-4">
                                                        <div className="text-[0.68rem] uppercase tracking-[0.24em] text-[var(--school-muted)]">
                                                            Scope
                                                        </div>
                                                        <div className="mt-2 text-xl font-semibold text-[var(--school-ink)]">
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
