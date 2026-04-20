import { Head, Link } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    ArrowLeft,
    ArrowRight,
    BadgeCheck,
    CalendarDays,
    CheckCircle2,
    Sparkles,
} from 'lucide-react';
import { useMemo, useRef } from 'react';
import {
    extracurricular,
    extracurricularShow,
} from '@/actions/App/Http/Controllers/PublicSiteController';
import { BorderGlow } from '@/components/public/border-glow';
import { SectionHeading } from '@/components/public/section-heading';
import { Button } from '@/components/ui/button';
import {
    getExtracurricularProgramBySlug,
    getRelatedExtracurricularPrograms,
} from '@/lib/extracurricular-content';
import { fadeUp, motionViewport, staggerContainer } from '@/lib/motion';
import type { SchoolProfilePayload } from '@/types';

type ExtracurricularShowPageProps = {
    school: SchoolProfilePayload;
    slug: string;
};

export default function ExtracurricularShowPage({
    school,
    slug,
}: ExtracurricularShowPageProps) {
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.78], [1, 0]);

    const program = getExtracurricularProgramBySlug(slug);
    const relatedPrograms = useMemo(
        () => getRelatedExtracurricularPrograms(slug, 3),
        [slug],
    );

    if (!program) {
        return null;
    }

    const ProgramIcon = program.icon;

    return (
        <>
            <Head title={`${program.name} | Ekstrakurikuler`}>
                <meta
                    name="description"
                    content={`${program.name} di ${school.name}: ${program.headline}`}
                />
            </Head>

            <div className="space-y-10 pb-16 lg:space-y-14">
                <motion.section
                    ref={heroRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative right-1/2 left-1/2 -mt-8 -mr-[50vw] -ml-[50vw] h-[78vh] w-screen overflow-hidden bg-slate-950 md:-mt-10 lg:h-[86dvh]"
                >
                    <motion.div
                        className="absolute inset-0 z-0"
                        style={{ y: heroY }}
                    >
                        <img
                            src={program.image}
                            alt={program.name}
                            className="h-full w-full object-cover opacity-42 mix-blend-luminosity"
                            style={{
                                objectPosition:
                                    program.objectPosition ?? 'center',
                            }}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/72 to-transparent" />
                        <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/55 to-transparent" />
                        <div
                            className="absolute inset-0 opacity-28 mix-blend-screen"
                            style={{
                                background: `radial-gradient(circle at 20% 20%, ${program.accent}, transparent 32%)`,
                            }}
                        />
                    </motion.div>

                    <motion.div
                        className="absolute inset-0 z-10 flex flex-col justify-end px-6 pb-14 md:px-12 lg:pb-20 xl:px-24"
                        style={{ opacity: heroOpacity }}
                    >
                        <div className="mx-auto w-full max-w-7xl">
                            <Link
                                href={extracurricular()}
                                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/88 backdrop-blur transition hover:bg-white/14"
                            >
                                <ArrowLeft className="size-4" />
                                Kembali ke katalog
                            </Link>

                            <div className="mt-6 flex flex-wrap items-center gap-3">
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-1.5 text-[0.68rem] font-bold tracking-[0.24em] text-white/90 uppercase backdrop-blur">
                                    <Sparkles className="size-4" />
                                    {program.category}
                                </div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-1.5 text-[0.68rem] font-bold tracking-[0.24em] text-white/90 uppercase backdrop-blur">
                                    <BadgeCheck className="size-4" />
                                    {program.metric} {program.metricSub}
                                </div>
                            </div>

                            <div className="mt-7 grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem]">
                                <div className="max-w-4xl">
                                    <div className="inline-flex size-14 items-center justify-center rounded-[1.3rem] border border-white/18 bg-white/10 text-white shadow-[0_20px_45px_-26px_rgba(255,255,255,0.45)] backdrop-blur">
                                        <ProgramIcon className="size-6" />
                                    </div>
                                    <h1 className="mt-6 font-heading text-5xl leading-[1.03] text-white md:text-6xl lg:text-[5.2rem]">
                                        {program.name}
                                    </h1>
                                    <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">
                                        {program.headline}
                                    </p>
                                    <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
                                        {program.summary}
                                    </p>
                                </div>

                                <div className="rounded-4xl border border-white/14 bg-white/10 p-5 shadow-[0_30px_90px_-42px_rgba(15,118,110,0.55)] backdrop-blur-xl">
                                    <div className="text-[0.68rem] font-bold tracking-[0.24em] text-white/70 uppercase">
                                        Snapshot Unit
                                    </div>
                                    <div className="mt-4 space-y-3">
                                        {program.stats.map((item) => (
                                            <div
                                                key={item.label}
                                                className="rounded-[1.2rem] border border-white/12 bg-white/8 px-4 py-3"
                                            >
                                                <div className="text-[0.66rem] font-bold tracking-[0.22em] text-white/60 uppercase">
                                                    {item.label}
                                                </div>
                                                <div className="mt-2 text-base font-semibold text-white">
                                                    {item.value}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.section>

                <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={motionViewport}
                        className="grid gap-5 lg:grid-cols-3"
                    >
                        {program.stats.map((item) => (
                            <motion.div
                                key={item.label}
                                variants={fadeUp}
                                className="rounded-[1.8rem] border border-white/70 bg-white/88 p-5 shadow-[0_24px_70px_-44px_rgba(15,118,110,0.22)] backdrop-blur-xl"
                            >
                                <div className="text-[0.68rem] font-bold tracking-[0.22em] text-(--school-green-700) uppercase">
                                    {item.label}
                                </div>
                                <div className="mt-3 text-2xl font-extrabold tracking-tight text-(--school-ink)">
                                    {item.value}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
                        <BorderGlow
                            borderRadius={34}
                            colors={[program.accent, '#0E9EE4', '#10B981']}
                            className="overflow-hidden rounded-4xl border border-white/70 bg-white/88 shadow-[0_28px_75px_-50px_rgba(15,118,110,0.28)]"
                        >
                            <div className="space-y-6 p-6 md:p-7">
                                <div>
                                    <div className="text-[0.68rem] font-bold tracking-[0.22em] text-(--school-green-700) uppercase">
                                        Fokus Utama
                                    </div>
                                    <h2 className="mt-3 font-heading text-3xl text-(--school-ink)">
                                        Hal yang paling kuat dari {program.name}
                                        .
                                    </h2>
                                    <p className="mt-3 max-w-2xl text-sm leading-7 text-(--school-muted)">
                                        Fokus latihan dan karakter yang paling
                                        sering muncul di ritme unit ini.
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2.5">
                                    {program.focus.map((item) => (
                                        <span
                                            key={item}
                                            className="rounded-full border px-3.5 py-1.5 text-sm font-semibold"
                                            style={{
                                                borderColor: `${program.accent}30`,
                                                backgroundColor: `${program.accent}10`,
                                                color: program.accent,
                                            }}
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="rounded-3xl border border-slate-200 bg-slate-50/85 p-4">
                                        <div className="text-[0.68rem] font-bold tracking-[0.22em] text-slate-400 uppercase">
                                            Bentuk Tampil
                                        </div>
                                        <div className="mt-4 space-y-3">
                                            {program.highlights.map((item) => (
                                                <div
                                                    key={item}
                                                    className="flex items-center gap-3 text-sm text-(--school-ink)"
                                                >
                                                    <div
                                                        className="size-2.5 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                program.accent,
                                                        }}
                                                    />
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="rounded-3xl border border-slate-200 bg-slate-50/85 p-4">
                                        <div className="text-[0.68rem] font-bold tracking-[0.22em] text-slate-400 uppercase">
                                            Cocok Untuk
                                        </div>
                                        <div className="mt-4 space-y-3">
                                            {program.fit.map((item) => (
                                                <div
                                                    key={item}
                                                    className="flex items-start gap-3 text-sm leading-6 text-(--school-ink)"
                                                >
                                                    <CheckCircle2
                                                        className="mt-0.5 size-4 shrink-0"
                                                        style={{
                                                            color: program.accent,
                                                        }}
                                                    />
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </BorderGlow>

                        <div className="space-y-5">
                            <div className="rounded-4xl border border-white/70 bg-white/88 p-6 shadow-[0_24px_70px_-44px_rgba(15,118,110,0.22)] backdrop-blur-xl">
                                <div className="flex items-center gap-2 text-[0.68rem] font-bold tracking-[0.22em] text-(--school-green-700) uppercase">
                                    <CalendarDays className="size-4" />
                                    Ritme Pembinaan
                                </div>
                                <div className="mt-3 text-lg font-semibold text-(--school-ink)">
                                    {program.cadence}
                                </div>
                                <p className="mt-2 text-sm leading-7 text-(--school-muted)">
                                    Ritme ini menjaga latihan tetap konsisten
                                    tanpa membuat alurnya terasa berat.
                                </p>
                            </div>

                            <div className="rounded-4xl border border-white/70 bg-white/88 p-6 shadow-[0_24px_70px_-44px_rgba(15,118,110,0.22)] backdrop-blur-xl">
                                <div className="text-[0.68rem] font-bold tracking-[0.22em] text-(--school-green-700) uppercase">
                                    Jalur Gerak
                                </div>
                                <div className="mt-4 space-y-4">
                                    {program.routine.map((item) => (
                                        <div
                                            key={item.label}
                                            className="rounded-[1.35rem] border border-slate-200 bg-slate-50/80 p-4"
                                        >
                                            <div className="text-sm font-semibold text-(--school-ink)">
                                                {item.label}
                                            </div>
                                            <p className="mt-1.5 text-sm leading-6 text-(--school-muted)">
                                                {item.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <SectionHeading
                            eyebrow="Alur Unit"
                            title={`Cara ${program.name} berjalan.`}
                            description="Ringkasan progres yang biasa dilalui siswa saat masuk dan berkembang di unit ini."
                        />

                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="show"
                            viewport={motionViewport}
                            className="grid gap-5 lg:grid-cols-3"
                        >
                            {program.experience.map((item, index) => (
                                <motion.div
                                    key={item.title}
                                    variants={fadeUp}
                                    className="rounded-[1.9rem] border border-white/70 bg-white/88 p-6 shadow-[0_24px_70px_-44px_rgba(15,118,110,0.2)] backdrop-blur-xl"
                                >
                                    <div className="flex size-11 items-center justify-center rounded-2xl bg-(--school-green-700) text-sm font-extrabold text-white">
                                        {index + 1}
                                    </div>
                                    <h3 className="mt-4 font-heading text-2xl text-(--school-ink)">
                                        {item.title}
                                    </h3>
                                    <p className="mt-3 text-sm leading-7 text-(--school-muted)">
                                        {item.description}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    <div className="space-y-8">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                            <SectionHeading
                                eyebrow="Unit Terkait"
                                title="Jalur lain yang masih nyambung."
                                description="Bisa dibuka kalau ingin membandingkan ritme, fokus, dan suasana unit lain."
                            />

                            <Button
                                asChild
                                className="rounded-full bg-(--school-green-700) px-6 text-white hover:bg-(--school-green-600)"
                            >
                                <Link href={extracurricular()}>
                                    Kembali ke semua unit
                                    <ArrowRight className="ml-2 size-4" />
                                </Link>
                            </Button>
                        </div>

                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="show"
                            viewport={motionViewport}
                            className="grid gap-5 lg:grid-cols-3"
                        >
                            {relatedPrograms.map((item) => {
                                const RelatedIcon = item.icon;

                                return (
                                    <motion.article
                                        key={item.slug}
                                        variants={fadeUp}
                                        whileHover={{ y: -6 }}
                                        className="group"
                                    >
                                        <Link
                                            href={extracurricularShow({
                                                slug: item.slug,
                                            })}
                                            className="block h-full overflow-hidden rounded-4xl border border-white/70 bg-white/88 shadow-[0_24px_70px_-44px_rgba(15,118,110,0.22)] backdrop-blur-xl"
                                        >
                                            <div className="relative h-60 overflow-hidden">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                                    style={{
                                                        objectPosition:
                                                            item.objectPosition ??
                                                            'center',
                                                    }}
                                                />
                                                <div
                                                    className="absolute inset-0 opacity-52 mix-blend-multiply"
                                                    style={{
                                                        backgroundColor:
                                                            item.accent,
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/25 to-transparent" />
                                                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                                                    <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[0.65rem] font-bold tracking-[0.18em] uppercase backdrop-blur">
                                                        {item.category}
                                                    </div>
                                                    <div className="mt-4 flex items-center gap-3">
                                                        <div className="flex size-11 items-center justify-center rounded-2xl bg-white/12 backdrop-blur">
                                                            <RelatedIcon className="size-5" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-heading text-2xl leading-tight">
                                                                {item.name}
                                                            </h3>
                                                            <p className="mt-1 text-sm text-white/75">
                                                                {item.metric} •{' '}
                                                                {item.metricSub}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-4 p-5">
                                                <p className="text-sm leading-7 text-(--school-muted)">
                                                    {item.headline}
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {item.focus
                                                        .slice(0, 2)
                                                        .map((focus) => (
                                                            <span
                                                                key={focus}
                                                                className="rounded-full border px-3 py-1 text-xs font-semibold"
                                                                style={{
                                                                    borderColor: `${item.accent}24`,
                                                                    backgroundColor: `${item.accent}10`,
                                                                    color: item.accent,
                                                                }}
                                                            >
                                                                {focus}
                                                            </span>
                                                        ))}
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.article>
                                );
                            })}
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}
