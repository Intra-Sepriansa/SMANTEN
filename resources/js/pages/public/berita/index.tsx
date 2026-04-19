import { Head, Link } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, CalendarDays, Megaphone, Tag, User } from 'lucide-react';
import { useRef } from 'react';
import { BorderGlow } from '@/components/public/border-glow';
import { SectionHeading } from '@/components/public/section-heading';
import { Button } from '@/components/ui/button';
import { fadeUp, motionViewport, staggerContainer } from '@/lib/motion';
import type { FeaturedArticle, SchoolProfilePayload } from '@/types';

type BeritaIndexProps = {
    school: SchoolProfilePayload;
    articles: FeaturedArticle[];
};

const dateFormatter = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' });

export default function BeritaIndexPage({
    school,
    articles,
}: BeritaIndexProps) {
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    const featuredArticle = articles.length > 0 ? articles[0] : null;
    const remainingArticles = articles.length > 1 ? articles.slice(1) : [];

    return (
        <>
            <Head title="Berita & Artikel">
                <meta
                    name="description"
                    content={`Berita, artikel, dan publikasi resmi ${school.name}.`}
                />
            </Head>

            <div className="space-y-16 pb-20 lg:space-y-24">
                {/* ═══════════ HERO SECTION ═══════════ */}
                <motion.section
                    ref={heroRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative right-1/2 left-1/2 -mt-8 -mr-[50vw] -ml-[50vw] h-[75vh] w-[100vw] overflow-hidden bg-slate-900 md:-mt-10 lg:h-[80dvh]"
                >
                    <motion.div
                        className="absolute inset-0 z-0"
                        style={{ y: heroY }}
                    >
                        <div className="absolute inset-0">
                            <img
                                src="/images/sekolah/kegiatan_siswa.jpg"
                                alt="Kegiatan Siswa SMAN 1 Tenjo"
                                className="h-full w-full object-cover object-center opacity-40 mix-blend-luminosity"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/50 to-transparent" />
                        </div>

                        {/* Ambient glow */}
                        <div className="absolute top-1/4 -left-20 size-[400px] rounded-full bg-emerald-500/10 blur-[120px]" />
                        <div className="absolute -right-32 bottom-1/4 size-[500px] rounded-full bg-sky-500/10 blur-[130px]" />

                        {/* Noise overlay */}
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
                    </motion.div>

                    <motion.div
                        className="absolute inset-0 z-10 flex flex-col justify-center px-6 md:px-12 xl:px-24"
                        style={{ opacity: heroOpacity }}
                    >
                        <div className="mx-auto w-full max-w-7xl pt-20">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-5 py-2 backdrop-blur-md"
                            >
                                <Megaphone className="size-4 text-sky-400" />
                                <span className="text-[0.68rem] font-bold tracking-[0.25em] text-sky-300 uppercase">
                                    Redaksi {school.name}
                                </span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="max-w-4xl font-heading text-5xl leading-[1.1] text-white md:text-7xl lg:text-[5.5rem]"
                            >
                                Informasi dan Liputan{' '}
                                <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
                                    Terkini.
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg lg:text-xl"
                            >
                                Berita, artikel, dan publikasi resmi sekolah
                                dalam satu halaman.
                            </motion.p>
                        </div>
                    </motion.div>
                </motion.section>

                {/* ═══════════ MAIN CONTENT GRID ═══════════ */}
                <div className="mx-auto max-w-7xl space-y-16 px-4 sm:px-6 lg:px-8">
                    {/* Featured Article (Top Story) */}
                    {featuredArticle && (
                        <motion.section
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.5 }}
                        >
                            <SectionHeading
                                eyebrow="Sorotan Utama"
                                title="Headline Hari Ini."
                                description="Berita utama yang baru dipublikasikan oleh sekolah."
                            />

                            <BorderGlow
                                borderRadius={32}
                                colors={['#0EA5E9', '#10B981', '#A855F7']}
                                className="group mt-10 overflow-hidden rounded-[2rem] border border-white/70 bg-white/88 p-2 shadow-[0_24px_50px_-20px_rgba(15,118,110,0.15)] transition-all hover:shadow-[0_32px_70px_-20px_rgba(15,118,110,0.3)] md:p-3"
                            >
                                <div className="grid items-center gap-4 lg:grid-cols-2 lg:gap-8">
                                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-slate-100 lg:aspect-auto lg:h-[400px]">
                                        {featuredArticle.imageUrl ? (
                                            <img
                                                src={featuredArticle.imageUrl}
                                                alt={featuredArticle.title}
                                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-emerald-950 transition-transform duration-700 group-hover:scale-105" />
                                        )}
                                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />

                                        {!featuredArticle.imageUrl && (
                                            <div className="absolute inset-0 flex items-center justify-center p-8 text-center font-heading text-2xl text-white/40 opacity-50 lg:text-3xl">
                                                {featuredArticle.title}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-6 p-6 md:p-8 lg:pr-12">
                                        <div className="flex flex-wrap items-center gap-4">
                                            <div className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1">
                                                <Tag className="size-3.5 text-emerald-600" />
                                                <span className="text-[0.65rem] font-bold tracking-[0.2em] text-emerald-700 uppercase">
                                                    {featuredArticle.category ??
                                                        'Headline'}
                                                </span>
                                            </div>
                                            {featuredArticle.source && (
                                                <div className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800 px-3 py-1">
                                                    <span className="text-[0.65rem] font-bold tracking-[0.2em] text-amber-400 uppercase">
                                                        Sumber:{' '}
                                                        {featuredArticle.source}
                                                    </span>
                                                </div>
                                            )}
                                            {featuredArticle.publishedAt && (
                                                <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--school-muted)]">
                                                    <CalendarDays className="size-3.5" />
                                                    {dateFormatter.format(
                                                        new Date(
                                                            featuredArticle.publishedAt,
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <h2 className="font-heading text-3xl leading-[1.2] text-[var(--school-ink)] lg:text-4xl">
                                                {featuredArticle.title}
                                            </h2>
                                            <p className="mt-4 line-clamp-3 text-base leading-relaxed text-[var(--school-muted)]">
                                                {featuredArticle.excerpt}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                                                    <User className="size-4" />
                                                </div>
                                                <div className="text-sm font-semibold text-[var(--school-ink)]">
                                                    {featuredArticle.authorName ??
                                                        'Tim Redaksi'}
                                                </div>
                                            </div>
                                            <Button
                                                asChild
                                                className="rounded-full bg-[var(--school-green-700)] px-6 text-white shadow-md hover:bg-[var(--school-green-800)]"
                                            >
                                                <Link
                                                    href={`/berita/${featuredArticle.slug}`}
                                                >
                                                    Baca Artikel{' '}
                                                    <ArrowRight className="ml-2 size-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </BorderGlow>
                        </motion.section>
                    )}

                    {/* Standard Articles Grid */}
                    {remainingArticles.length > 0 && (
                        <motion.section
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="show"
                            viewport={motionViewport}
                        >
                            <SectionHeading
                                eyebrow="Arsip Berita"
                                title="Liputan & Kegiatan."
                                description="Kumpulan berita, artikel, dan liputan kegiatan sekolah."
                            />

                            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {remainingArticles.map((article) => (
                                    <motion.article
                                        key={article.id}
                                        variants={fadeUp}
                                        whileHover={{ y: -6 }}
                                        className="group flex flex-col overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-[0_16px_40px_-20px_rgba(15,118,110,0.1)] transition-shadow hover:shadow-[0_24px_50px_-20px_rgba(15,118,110,0.2)]"
                                    >
                                        <div className="relative h-48 overflow-hidden bg-slate-100">
                                            {article.imageUrl ? (
                                                <img
                                                    src={article.imageUrl}
                                                    alt={article.title}
                                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-100 to-sky-50 transition-transform duration-500 group-hover:scale-105" />
                                            )}
                                            {/* Minimalist Pattern Cover */}
                                            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05] mix-blend-multiply" />
                                            {!article.imageUrl && (
                                                <div className="absolute inset-0 flex items-center justify-center p-6 text-center font-heading text-xl text-slate-800/20 opacity-60">
                                                    {school.name}
                                                </div>
                                            )}
                                            {article.source && (
                                                <div className="absolute top-3 right-3 z-10 rounded-lg bg-slate-900/80 px-2 py-1 text-[0.6rem] font-semibold tracking-wider text-amber-400 backdrop-blur-sm">
                                                    {article.source}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-1 flex-col p-6 lg:p-8">
                                            <div className="space-x-auto mb-4 flex items-center gap-3">
                                                <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-100 bg-sky-50 px-2.5 py-0.5">
                                                    <Tag className="size-3 text-sky-600" />
                                                    <span className="text-[0.6rem] font-bold tracking-[0.2em] text-sky-700 uppercase">
                                                        {article.category ??
                                                            'Berita'}
                                                    </span>
                                                </div>
                                                {article.publishedAt && (
                                                    <div className="flex items-center gap-1 text-[0.65rem] font-medium text-slate-400">
                                                        <CalendarDays className="size-3" />
                                                        {dateFormatter.format(
                                                            new Date(
                                                                article.publishedAt,
                                                            ),
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <h3 className="line-clamp-3 font-heading text-xl leading-snug text-[var(--school-ink)] transition-colors group-hover:text-[var(--school-green-700)]">
                                                <Link
                                                    href={`/berita/${article.slug}`}
                                                >
                                                    {article.title}
                                                </Link>
                                            </h3>

                                            <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-[var(--school-muted)]">
                                                {article.excerpt}
                                            </p>

                                            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                                                <div className="flex flex-col text-[0.7rem]">
                                                    <span className="font-medium text-slate-400">
                                                        Jurnalis
                                                    </span>
                                                    <span className="font-bold text-[var(--school-ink)]">
                                                        {article.authorName ??
                                                            'Admin'}
                                                    </span>
                                                </div>
                                                <Link
                                                    href={`/berita/${article.slug}`}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition-colors group-hover:border-[var(--school-green-200)] group-hover:bg-[var(--school-green-50)] group-hover:text-[var(--school-green-700)]"
                                                >
                                                    <ArrowRight className="size-3.5" />
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.article>
                                ))}
                            </div>
                        </motion.section>
                    )}

                    {!featuredArticle && remainingArticles.length === 0 && (
                        <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-200 bg-white/50 px-6 py-20 text-center">
                            <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-white text-slate-300 shadow-sm">
                                <Megaphone className="size-8" />
                            </div>
                            <h3 className="text-lg font-semibold text-[var(--school-ink)]">
                                Belum Ada Publikasi
                            </h3>
                            <p className="mt-2 max-w-sm text-sm text-[var(--school-muted)]">
                                Artikel akan tampil setelah redaksi sekolah
                                mempublikasikan informasi terbaru.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
