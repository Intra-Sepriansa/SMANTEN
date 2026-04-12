import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Compass, Package2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

type WorkDetail = {
    id: number;
    title: string;
    slug: string;
    itemType: string;
    summary: string | null;
    body: string | null;
    priceEstimate: string | number | null;
    publishedAt: string | null;
    projectTitle: string | null;
    themeName: string | null;
    creatorName: string | null;
    imageUrl: string | null;
    gallery: { url: string; alt: string }[];
};

type KaryaShowProps = {
    work: WorkDetail;
    relatedWorks: { id: number; title: string; slug: string; itemType: string; imageUrl: string | null }[];
};

const dateFormatter = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' });

export default function KaryaShowPage({ work, relatedWorks }: KaryaShowProps) {
    return (
        <>
            <Head title={work.title}>
                <meta
                    name="description"
                    content={work.summary ?? `Karya siswa: ${work.title}`}
                />
                <meta property="og:title" content={`${work.title} — Karya SMAN 1 Tenjo`} />
                <meta property="og:description" content={work.summary ?? work.title} />
                {work.imageUrl ? <meta property="og:image" content={work.imageUrl} /> : null}
            </Head>

            <div className="space-y-8">
                <div>
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="rounded-full border-[var(--school-green-200)] bg-white/80"
                    >
                        <Link href="/karya">
                            <ArrowLeft className="size-3.5" /> Kembali ke Galeri Karya
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
                    <article className="overflow-hidden rounded-[2.2rem] border border-white/70 bg-white/88 shadow-[0_32px_90px_-50px_rgba(15,118,110,0.45)]">
                        <div
                            className="h-72 bg-cover bg-center md:h-96"
                            style={{
                                backgroundImage: work.imageUrl
                                    ? `linear-gradient(180deg, rgba(4,47,46,0.08), rgba(4,47,46,0.22)), url(${work.imageUrl})`
                                    : 'linear-gradient(135deg, rgba(4,47,46,0.95), rgba(15,118,110,0.86) 58%, rgba(245,158,11,0.82))',
                            }}
                        />
                        <div className="space-y-6 p-8 md:p-10">
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-1.5 rounded-full border border-[var(--school-green-100)] bg-[rgba(248,252,251,0.85)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[var(--school-green-700)]">
                                    <Compass className="size-3.5" />
                                    {work.itemType}
                                </div>
                                {work.publishedAt ? (
                                    <div className="text-sm text-[var(--school-muted)]">
                                        {dateFormatter.format(new Date(work.publishedAt))}
                                    </div>
                                ) : null}
                            </div>

                            <h1 className="font-heading text-4xl leading-tight text-[var(--school-ink)]">
                                {work.title}
                            </h1>

                            {work.summary ? (
                                <p className="text-lg leading-8 text-[var(--school-muted)]">
                                    {work.summary}
                                </p>
                            ) : null}

                            {work.body ? (
                                <div
                                    className="prose prose-lg max-w-none text-[var(--school-ink)]"
                                    dangerouslySetInnerHTML={{ __html: work.body }}
                                />
                            ) : null}
                        </div>
                    </article>

                    <div className="space-y-6">
                        <div className="rounded-[1.8rem] border border-white/70 bg-white/88 p-6 shadow-[0_22px_70px_-44px_rgba(15,118,110,0.42)]">
                            <h2 className="text-lg font-semibold text-[var(--school-ink)]">Detail Karya</h2>
                            <div className="mt-4 space-y-4 text-sm text-[var(--school-muted)]">
                                <div className="flex items-center gap-2">
                                    <Package2 className="size-4 text-[var(--school-green-700)]" />
                                    <span>Proyek: {work.projectTitle ?? 'Showcase karya siswa'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Compass className="size-4 text-[var(--school-green-700)]" />
                                    <span>Tema: {work.themeName ?? 'Eksplorasi siswa'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User className="size-4 text-[var(--school-green-700)]" />
                                    <span>Pembuat: {work.creatorName ?? 'Tim siswa'}</span>
                                </div>
                                {work.priceEstimate ? (
                                    <div className="rounded-[1.2rem] border border-[var(--school-gold-200)] bg-[rgba(255,251,235,0.92)] p-4 text-base font-semibold text-[var(--school-gold-700)]">
                                        Estimasi: Rp {Number(work.priceEstimate).toLocaleString('id-ID')}
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        {work.gallery.length > 0 ? (
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--school-green-700)]">
                                    Galeri Media
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {work.gallery.map((media, index) => (
                                        <div
                                            key={index}
                                            className="aspect-square overflow-hidden rounded-2xl border border-white/70 bg-cover bg-center"
                                            style={{ backgroundImage: `url(${media.url})` }}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        {relatedWorks.length > 0 ? (
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--school-green-700)]">
                                    Karya Lainnya
                                </h3>
                                <div className="space-y-3">
                                    {relatedWorks.map((related) => (
                                        <Link
                                            key={related.id}
                                            href={`/karya/${related.slug}`}
                                            className="block rounded-[1.4rem] border border-white/70 bg-white/85 p-4 transition hover:shadow-[0_12px_32px_-18px_rgba(15,118,110,0.4)]"
                                        >
                                            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[var(--school-green-700)]">
                                                {related.itemType}
                                            </div>
                                            <div className="mt-1 text-base font-semibold text-[var(--school-ink)]">
                                                {related.title}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </>
    );
}
