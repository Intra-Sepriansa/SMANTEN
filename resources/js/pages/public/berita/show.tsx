import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CalendarDays, Tag, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ArticleDetail = {
    id: number;
    title: string;
    slug: string;
    body: string | null;
    excerpt: string | null;
    category: string | null;
    authorName: string | null;
    publishedAt: string | null;
};

type BeritaShowProps = {
    article: ArticleDetail;
    relatedArticles: { id: number; title: string; slug: string; category: string | null }[];
};

const dateFormatter = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' });

export default function BeritaShowPage({ article, relatedArticles }: BeritaShowProps) {
    return (
        <>
            <Head title={article.title}>
                <meta
                    name="description"
                    content={article.excerpt ?? `Baca artikel: ${article.title}`}
                />
                <meta property="og:title" content={article.title} />
                <meta property="og:description" content={article.excerpt ?? article.title} />
                <meta property="og:type" content="article" />
            </Head>

            <div className="space-y-8">
                <div>
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="rounded-full border-[var(--school-green-200)] bg-white/80"
                    >
                        <Link href="/berita">
                            <ArrowLeft className="size-3.5" /> Kembali ke Berita
                        </Link>
                    </Button>
                </div>

                <article className="rounded-[2.2rem] border border-white/70 bg-white/88 p-8 shadow-[0_32px_90px_-50px_rgba(15,118,110,0.45)] md:p-12">
                    <div className="mx-auto max-w-3xl space-y-8">
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-1.5 rounded-full border border-[var(--school-green-100)] bg-[rgba(248,252,251,0.85)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[var(--school-green-700)]">
                                    <Tag className="size-3.5" />
                                    {article.category ?? 'Berita Sekolah'}
                                </div>
                                {article.publishedAt ? (
                                    <div className="flex items-center gap-1.5 text-sm text-[var(--school-muted)]">
                                        <CalendarDays className="size-4" />
                                        {dateFormatter.format(new Date(article.publishedAt))}
                                    </div>
                                ) : null}
                                {article.authorName ? (
                                    <div className="flex items-center gap-1.5 text-sm text-[var(--school-muted)]">
                                        <User className="size-4" />
                                        {article.authorName}
                                    </div>
                                ) : null}
                            </div>

                            <h1 className="font-heading text-4xl leading-tight text-[var(--school-ink)] md:text-5xl">
                                {article.title}
                            </h1>

                            {article.excerpt ? (
                                <p className="text-lg leading-8 text-[var(--school-muted)]">
                                    {article.excerpt}
                                </p>
                            ) : null}
                        </div>

                        <div className="h-px bg-[var(--school-green-100)]" />

                        <div
                            className="prose prose-lg max-w-none text-[var(--school-ink)] prose-headings:text-[var(--school-ink)] prose-a:text-[var(--school-green-700)] prose-strong:text-[var(--school-ink)]"
                            dangerouslySetInnerHTML={{
                                __html: article.body ?? '<p>Konten artikel belum tersedia.</p>',
                            }}
                        />
                    </div>
                </article>

                {relatedArticles.length > 0 ? (
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-[var(--school-ink)]">
                            Artikel Terkait
                        </h2>
                        <div className="grid gap-4 md:grid-cols-3">
                            {relatedArticles.map((related) => (
                                <Link
                                    key={related.id}
                                    href={`/berita/${related.slug}`}
                                    className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 transition hover:shadow-[0_16px_44px_-24px_rgba(15,118,110,0.4)]"
                                >
                                    <div className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[var(--school-green-700)]">
                                        {related.category ?? 'Berita'}
                                    </div>
                                    <div className="mt-2 text-base font-semibold text-[var(--school-ink)]">
                                        {related.title}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                ) : null}
            </div>
        </>
    );
}
