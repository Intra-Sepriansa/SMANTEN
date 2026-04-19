import { AnimatePresence, motion } from 'framer-motion';
import { Award, Cpu, Leaf, ShieldCheck, Trophy } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Pillar {
    id: string;
    label: string;
    icon: LucideIcon;
    accent: string;
    image: string;
    headline: string;
    metric: string;
    metricLabel: string;
    description: string;
    points: string[];
}

const pillars: Pillar[] = [
    {
        id: 'prestasi',
        label: 'Prestasi',
        icon: Trophy,
        accent: '#D97706',
        image: '/images/values/pillar-prestasi.png',
        headline: 'Unggul dalam Prestasi',
        metric: '50+',
        metricLabel: 'Penghargaan',
        description:
            'Mendorong pencapaian akademik dan non-akademik di tingkat kabupaten, provinsi, hingga nasional.',
        points: [
            'Lomba akademik tingkat provinsi & nasional',
            'Olimpiade sains dan matematika',
            'Kompetisi seni, olahraga, dan debat',
        ],
    },
    {
        id: 'karakter',
        label: 'Karakter',
        icon: ShieldCheck,
        accent: '#0F766E',
        image: '/images/values/pillar-karakter.png',
        headline: 'Berkarakter Kuat',
        metric: '100%',
        metricLabel: 'Integrasi Nilai',
        description:
            'Pembentukan karakter melekat di setiap budaya sekolah — dari tata tertib hingga interaksi harian.',
        points: [
            'Penguatan nilai BATARA KRESNA',
            'Program pembinaan sikap & kedisiplinan',
            'Keteladanan guru sebagai role model',
        ],
    },
    {
        id: 'lingkungan',
        label: 'Lingkungan',
        icon: Leaf,
        accent: '#15803D',
        image: '/images/values/pillar-lingkungan.png',
        headline: 'Berbudaya Lingkungan',
        metric: '11.396',
        metricLabel: 'm² Lahan Hijau',
        description:
            'Sekolah Adiwiyata yang mengintegrasikan kepedulian lingkungan ke dalam kurikulum dan kebiasaan harian.',
        points: [
            'Program Adiwiyata & bank sampah sekolah',
            'Penghijauan dan taman edukasi',
            'Kantin sehat dan bebas plastik',
        ],
    },
    {
        id: 'iptek',
        label: 'IPTEK',
        icon: Cpu,
        accent: '#0369A1',
        image: '/images/values/pillar-iptek.png',
        headline: 'Menguasai IPTEK',
        metric: '3',
        metricLabel: 'Laboratorium',
        description:
            'Penguasaan IPTEK dibangun lewat laboratorium, literasi digital, dan integrasi teknologi pembelajaran.',
        points: [
            'Lab IPA, Komputer, dan Multimedia',
            'Pemanfaatan e-learning & platform digital',
            'Proyek berbasis teknologi dalam P5',
        ],
    },
    {
        id: 'daya-saing',
        label: 'Daya Saing',
        icon: Award,
        accent: '#7C3AED',
        image: '/images/values/pillar-daya-saing.png',
        headline: 'Berdaya Saing Tinggi',
        metric: '85%',
        metricLabel: 'Alumni Melanjutkan',
        description:
            'Mempersiapkan lulusan untuk melanjutkan pendidikan dan memasuki dunia kerja.',
        points: [
            'Bimbingan masuk PTN dan karier',
            'Pengembangan public speaking & leadership',
            'Portofolio karya sebagai bekal daya saing',
        ],
    },
];

export function VisiPillarShowcase() {
    const [activeId, setActiveId] = useState('prestasi');
    const active = pillars.find((p) => p.id === activeId) ?? pillars[0];

    return (
        <div className="space-y-4">
            {/* ─── Tab Row ─── */}
            <div className="flex flex-wrap gap-2">
                {pillars.map((pillar) => {
                    const isActive = pillar.id === activeId;
                    const PillarIcon = pillar.icon;

                    return (
                        <button
                            key={pillar.id}
                            onClick={() => setActiveId(pillar.id)}
                            className={cn(
                                'relative flex items-center gap-2 rounded-full px-4 py-2 text-[0.72rem] font-semibold transition-all duration-300',
                                isActive
                                    ? 'text-white'
                                    : 'border border-white/10 text-white/50 hover:border-white/20 hover:text-white/70',
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="visi-pill-bg"
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                        backgroundColor: `${pillar.accent}CC`,
                                    }}
                                    transition={{
                                        type: 'spring',
                                        bounce: 0.15,
                                        duration: 0.5,
                                    }}
                                />
                            )}
                            <PillarIcon className="relative z-10 size-3.5" />
                            <span className="relative z-10">
                                {pillar.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* ─── Content Card ─── */}
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.1] bg-white/[0.03]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={active.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="relative"
                    >
                        {/* Ambient glow */}
                        <div
                            className="pointer-events-none absolute -top-20 -right-20 size-56 rounded-full opacity-15 blur-[80px]"
                            style={{ backgroundColor: active.accent }}
                        />
                        <div
                            className="pointer-events-none absolute -bottom-16 -left-16 size-40 rounded-full opacity-10 blur-[60px]"
                            style={{ backgroundColor: active.accent }}
                        />

                        <div className="relative z-10 flex flex-col md:flex-row">
                            {/* ─── Image Side ─── */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                    delay: 0.1,
                                    duration: 0.45,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="relative flex shrink-0 items-center justify-center p-6 md:w-52 md:p-8"
                            >
                                {/* Glow ring behind image */}
                                <div
                                    className="absolute inset-0 m-auto size-36 rounded-full opacity-20 blur-[40px]"
                                    style={{ backgroundColor: active.accent }}
                                />
                                <img
                                    src={active.image}
                                    alt={active.headline}
                                    className="relative z-10 size-32 object-contain drop-shadow-[0_8px_32px_rgba(0,0,0,0.3)] md:size-36"
                                />
                            </motion.div>

                            {/* ─── Text Side ─── */}
                            <motion.div
                                initial={{ opacity: 0, x: 16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                    delay: 0.15,
                                    duration: 0.4,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="flex flex-1 flex-col justify-center gap-4 border-t border-white/[0.06] p-6 md:border-t-0 md:border-l md:py-7 md:pr-8 md:pl-7"
                            >
                                {/* Headline + Metric badge */}
                                <div className="flex flex-wrap items-center gap-3">
                                    <h4 className="text-lg font-bold text-white md:text-xl">
                                        {active.headline}
                                    </h4>
                                    <div
                                        className="inline-flex items-baseline gap-1 rounded-lg px-2.5 py-1"
                                        style={{
                                            backgroundColor: `${active.accent}20`,
                                        }}
                                    >
                                        <span
                                            className="text-base font-extrabold"
                                            style={{ color: active.accent }}
                                        >
                                            {active.metric}
                                        </span>
                                        <span className="text-[0.6rem] font-medium tracking-wider text-white/45 uppercase">
                                            {active.metricLabel}
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-sm leading-relaxed text-white/60">
                                    {active.description}
                                </p>

                                {/* Points */}
                                <div className="flex flex-col gap-2">
                                    {active.points.map((point, i) => (
                                        <motion.div
                                            key={point}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                delay: 0.25 + i * 0.08,
                                                duration: 0.3,
                                            }}
                                            className="flex items-center gap-2.5"
                                        >
                                            <span
                                                className="flex size-5 shrink-0 items-center justify-center rounded-md text-[0.55rem] font-bold text-white"
                                                style={{
                                                    backgroundColor: `${active.accent}90`,
                                                }}
                                            >
                                                {i + 1}
                                            </span>
                                            <span className="text-[0.8rem] leading-snug text-white/55">
                                                {point}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
