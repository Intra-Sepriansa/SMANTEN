import { motion } from 'framer-motion';
import { fadeUp, motionViewport, softScale, staggerContainer } from '@/lib/motion';

type PageIntroProps = {
    eyebrow: string;
    title: string;
    description: string;
    stats?: Array<{
        label: string;
        value: string;
    }>;
};

export function PageIntro({
    eyebrow,
    title,
    description,
    stats = [],
}: PageIntroProps) {
    return (
        <motion.section
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(237,247,245,0.86))] p-8 shadow-[0_36px_100px_-48px_rgba(15,118,110,0.5)] md:p-12"
        >
            <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.18),transparent_58%)]" />
            <motion.div variants={fadeUp} viewport={motionViewport} className="relative max-w-3xl space-y-5">
                <div className="inline-flex rounded-full border border-[var(--school-green-200)] bg-white/80 px-4 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--school-green-700)]">
                    {eyebrow}
                </div>
                <h1 className="font-heading text-4xl leading-tight text-[var(--school-ink)] md:text-6xl">
                    {title}
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-[var(--school-muted)]">
                    {description}
                </p>
            </motion.div>
            {stats.length > 0 ? (
                <motion.div
                    variants={softScale}
                    viewport={motionViewport}
                    className="relative mt-10 grid gap-4 md:grid-cols-3"
                >
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-[1.6rem] border border-[var(--school-green-100)] bg-white/80 p-5 backdrop-blur"
                        >
                            <div className="text-sm uppercase tracking-[0.2em] text-[var(--school-muted)]">
                                {stat.label}
                            </div>
                            <div className="mt-2 text-2xl font-semibold text-[var(--school-ink)]">
                                {stat.value}
                            </div>
                        </div>
                    ))}
                </motion.div>
            ) : null}
        </motion.section>
    );
}
