import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays, Tag } from 'lucide-react';
import { PageIntro } from '@/components/public/page-intro';
import { Button } from '@/components/ui/button';
import { fadeUp, motionViewport, staggerContainer } from '@/lib/motion';
import type { FeaturedArticle, SchoolProfilePayload } from '@/types';

type BeritaIndexProps = {
    school: SchoolProfilePayload;
    articles: FeaturedArticle[];
};

const dateFormatter = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' });

export default function BeritaIndexPage({ school, articles }: BeritaIndexProps) {
    return (
        <>
            <Head title="Berita & Artikel">
                <meta
                    name="description"
                    content={`Berita dan artikel terbaru dari ${school.name}. Informasi kegiatan sekolah, liputan jurnalistik siswa, dan publikasi resmi.`}
                />
                <meta property="og:title" content={`Berita — ${school.name}`} />
                <meta property="og:description" content="Informasi kegiatan, liputan jurnalistik siswa, dan publikasi resmi SMAN 1 Tenjo." />
            </Head>

            <div className="space-y-8">
                <PageIntro
                    eyebrow="Berita & Artikel"
                    title="Informasi, kegiatan, dan liputan langsung dari redaksi sekolah."
                    description={`${school.name} menyalurkan aktivitas redaksi melalui jurnalistik siswa, dokumentasi guru, dan publikasi resmi sekolah.`}
                    stats={[
                        { label: 'Total Artikel', value: String(articles.length) },
                    ]}
                />

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={motionViewport}
                    className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
                >
                    {articles.length > 0 ? (
                        articles.map((article) => (
                            <motion.article
                                key={article.id}
                                variants={fadeUp}
                                whileHover={{ y: -6 }}
                                className="group overflow-hidden rounded-[2rem] border border-white/70 bg-white/88 shadow-[0_28px_80px_-50px_rgba(15,118,110,0.45)]"
                            >
                                <div className="h-44 bg-[linear-gradient(135deg,rgba(4,47,46,0.95),rgba(15,118,110,0.86)_58%,rgba(245,158,11,0.82))]" />
                                <div className="space-y-4 p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[var(--school-green-700)]">
                                            <Tag className="size-3.5" />
                                            {article.category ?? 'Berita Sekolah'}
                                        </div>
                                        {article.publishedAt ? (
                                            <div className="flex items-center gap-1.5 text-xs text-[var(--school-muted)]">
                                                <CalendarDays className="size-3.5" />
                                                {dateFormatter.format(new Date(article.publishedAt))}
                                            </div>
                                        ) : null}
                                    </div>
                                    <h2 className="text-xl font-semibold leading-tight text-[var(--school-ink)]">
                                        {article.title}
                                    </h2>
                                    <p className="text-sm leading-7 text-[var(--school-muted)]">
                                        {article.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="text-xs text-[var(--school-muted)]">
                                            {article.authorName ?? 'Redaksi'}
                                        </div>
                                        {article.slug ? (
                                            <Button
                                                asChild
                                                size="sm"
                                                variant="outline"
                                                className="rounded-full border-[var(--school-green-200)] bg-white/80"
                                            >
                                                <Link href={`/berita/${article.slug}`}>
                                                    Baca <ArrowRight className="size-3.5" />
                                                </Link>
                                            </Button>
                                        ) : null}
                                    </div>
                                </div>
                            </motion.article>
                        ))
                    ) : (
                        <div className="rounded-[1.8rem] border border-dashed border-[var(--school-green-200)] bg-white/72 p-8 text-sm leading-7 text-[var(--school-muted)] md:col-span-2 xl:col-span-3">
                            Belum ada artikel publik yang dipublikasikan. Halaman ini akan
                            otomatis terisi saat redaksi atau guru mempublikasikan artikel.
                        </div>
                    )}
                </motion.div>
            </div>
        </>
    );
}
