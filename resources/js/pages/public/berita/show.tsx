import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, CalendarDays, Clock, FileText, Share2, Tag, User } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { BorderGlow } from '@/components/public/border-glow';
import { fadeUp, motionViewport, staggerContainer } from '@/lib/motion';

type ArticleDetail = {
    id: number;
    title: string;
    slug: string;
    body: string | null;
    excerpt: string | null;
    category: string | null;
    authorName: string | null;
    publishedAt: string | null;
    source?: string | null;
    imageUrl?: string | null;
};

type BeritaShowProps = {
    article: ArticleDetail;
    relatedArticles: { id: number; title: string; slug: string; category: string | null }[];
};

const dateFormatter = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' });

// Simple reading time estimator (approx 200 words per minute)
function estimateReadingTime(text: string): number {
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / 200);
}

export default function BeritaShowPage({ article, relatedArticles }: BeritaShowProps) {
    const readingTime = article.body ? estimateReadingTime(article.body) : 1;
    
    const bannerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: bannerRef, offset: ['start start', 'end start'] });
    const bannerY = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const bannerOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);

    return (
        <>
            <Head title={article.title}>
                <meta name="description" content={article.excerpt ?? `Baca artikel: ${article.title}`} />
                <meta property="og:title" content={article.title} />
                <meta property="og:description" content={article.excerpt ?? article.title} />
                <meta property="og:type" content="article" />
            </Head>

            <div className="relative min-h-screen bg-slate-50/50 pb-24">
                
                {/* ═══════════ ARTICLE HERO BANNER ═══════════ */}
                <motion.div 
                    ref={bannerRef}
                    className="relative w-[100vw] h-[60vh] lg:h-[70vh] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-8 md:-mt-10 overflow-hidden bg-slate-900 flex items-center justify-center"
                >
                    <motion.div className="absolute inset-0 z-0" style={{ y: bannerY, opacity: bannerOpacity }}>
                        {article.imageUrl ? (
                            <img src={article.imageUrl} alt={article.title} className="absolute inset-0 h-full w-full object-cover mix-blend-luminosity opacity-40" />
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900" />
                        )}
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04] mix-blend-overlay" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                        
                        {/* Dramatic glow for the title center */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-emerald-500/15 blur-[120px]" />
                    </motion.div>

                    <div className="relative z-10 w-full max-w-5xl px-6 pt-24 text-center">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="flex flex-wrap items-center justify-center gap-3 mb-8"
                        >
                            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 backdrop-blur-md">
                                <Tag className="size-3.5 text-emerald-400" />
                                <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-emerald-300">
                                    {article.category ?? 'Berita Sekolah'}
                                </span>
                            </div>
                            
                            {article.publishedAt && (
                                <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 backdrop-blur-md text-[0.65rem] font-bold uppercase tracking-[0.2em] text-sky-300">
                                    <CalendarDays className="size-3.5 text-sky-400" />
                                    {dateFormatter.format(new Date(article.publishedAt))}
                                </div>
                            )}
                            
                            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 backdrop-blur-md text-[0.65rem] font-bold uppercase tracking-[0.2em] text-amber-300">
                                <Clock className="size-3.5 text-amber-400" />
                                {readingTime} Menit Baca
                            </div>
                        </motion.div>

                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mx-auto max-w-4xl font-heading text-4xl leading-tight text-white md:text-5xl lg:text-6xl"
                        >
                            {article.title}
                        </motion.h1>

                        {article.excerpt && (
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-300"
                            >
                                {article.excerpt}
                            </motion.p>
                        )}
                    </div>
                    
                    {/* Back button pinned to top left of hero */}
                    <div className="absolute top-12 left-6 md:top-16 md:left-12 z-20">
                        <Button
                            asChild
                            variant="outline"
                            className="rounded-full border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:text-white transition-all shadow-lg"
                        >
                            <Link href="/berita">
                                <ArrowLeft className="mr-2 size-4" /> Kembali
                            </Link>
                        </Button>
                    </div>
                </motion.div>

                {/* ═══════════ MAIN CONTENT BODY ═══════════ */}
                <div className="mx-auto max-w-4xl px-4 sm:px-6 relative z-20 -mt-20 lg:-mt-32">
                    <BorderGlow
                        borderRadius={32}
                        colors={['#0EA5E9', '#10B981', '#A855F7']}
                        className="rounded-[2.5rem] border border-white/80 bg-white/95 p-8 shadow-[0_32px_90px_-50px_rgba(15,118,110,0.35)] md:p-12 lg:p-16 backdrop-blur-xl"
                    >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-8 mb-10">
                            <div className="flex items-center gap-4">
                                <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                                    <User className="size-6" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-[var(--school-ink)]">Jurnalis / Redaktur</span>
                                    <span className="text-base font-bold text-slate-500">{article.authorName ?? 'Tim Redaksi'}</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                {article.source && (
                                    <div className="hidden sm:flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-1.5 border border-slate-100">
                                        <span className="text-xs font-semibold text-slate-400">SUMBER:</span>
                                        <span className="text-sm font-bold text-slate-700">{article.source}</span>
                                    </div>
                                )}
                                <Button variant="outline" size="icon" className="rounded-full border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-sky-600 shadow-sm">
                                    <Share2 className="size-4" />
                                </Button>
                            </div>
                        </div>
                        
                        <div
                            className="prose prose-lg max-w-none text-slate-600 prose-headings:font-heading prose-headings:text-[var(--school-ink)] prose-h2:text-3xl prose-h3:text-2xl prose-a:font-semibold prose-a:text-emerald-600 hover:prose-a:text-emerald-700 prose-strong:text-slate-800 prose-img:rounded-2xl prose-img:shadow-lg prose-blockquote:border-l-emerald-500 prose-blockquote:bg-emerald-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:text-slate-700 prose-blockquote:not-italic"
                            dangerouslySetInnerHTML={{
                                __html: article.body ?? '<div class="text-center py-10 text-slate-400">Konten artikel belum tersedia.</div>',
                            }}
                        />
                    </BorderGlow>
                </div>

                {/* ═══════════ RELATED ARTICLES ═══════════ */}
                {relatedArticles.length > 0 && (
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-24">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="font-heading text-3xl font-semibold text-[var(--school-ink)]">
                                Lanjutkan Membaca
                            </h2>
                            <Button asChild variant="link" className="text-slate-500 hover:text-emerald-600">
                                <Link href="/berita">Semua Berita <ArrowRight className="ml-2 size-4" /></Link>
                            </Button>
                        </div>
                        
                        <motion.div 
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="show"
                            viewport={motionViewport}
                            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                        >
                            {relatedArticles.map((related) => (
                                <motion.div key={related.id} variants={fadeUp} whileHover={{ y: -5 }}>
                                    <Link
                                        href={`/berita/${related.slug}`}
                                        className="group block h-full rounded-[2rem] border border-white/80 bg-white/70 p-6 shadow-sm transition-all hover:bg-white hover:shadow-[0_24px_50px_-20px_rgba(15,118,110,0.15)]"
                                    >
                                        <div className="mb-4 flex items-center gap-2">
                                            <div className="flex size-8 items-center justify-center rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-100">
                                                <FileText className="size-3.5" />
                                            </div>
                                            <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-slate-400 group-hover:text-emerald-600 transition-colors">
                                                {related.category ?? 'Berita'}
                                            </div>
                                        </div>
                                        
                                        <h3 className="text-xl font-heading font-semibold leading-snug text-[var(--school-ink)] group-hover:text-emerald-700 transition-colors">
                                            {related.title}
                                        </h3>
                                        
                                        <div className="mt-6 flex items-center text-sm font-semibold text-sky-600 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                                            Baca selengkapnya <ArrowRight className="ml-1 size-4" />
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                )}
            </div>
        </>
    );
}
