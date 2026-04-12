import { Head } from '@inertiajs/react';
import { PageIntro } from '@/components/public/page-intro';
import { VideoGrid } from '@/components/public/video-grid';
import type { FeaturedArticle, SchoolProfilePayload } from '@/types';

type ExtracurricularPageProps = {
    school: SchoolProfilePayload;
    featuredArticles: FeaturedArticle[];
};

export default function ExtracurricularPage({
    school,
    featuredArticles,
}: ExtracurricularPageProps) {
    return (
        <>
            <Head title="Ekstrakurikuler" />

            <div className="space-y-8">
                <PageIntro
                    eyebrow="Ekstrakurikuler"
                    title="Aktivitas sekolah dirancang tampil sebagai panggung reputasi, bukan daftar statis."
                    description={`${school.name} menyiapkan Tari Tradisional, Paskibra, Jurnalistik, dan program lain agar bisa terhubung ke feed video, artikel, dan dokumentasi kegiatan.`}
                />

                <VideoGrid />

                <div className="grid gap-5 lg:grid-cols-3">
                    {featuredArticles.map((article) => (
                        <article
                            key={article.id}
                            className="rounded-[1.8rem] border border-white/70 bg-white/88 p-6 shadow-[0_24px_70px_-44px_rgba(15,118,110,0.42)]"
                        >
                            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--school-green-700)]">
                                {article.category ?? 'Kegiatan Sekolah'}
                            </div>
                            <h2 className="mt-3 text-2xl font-semibold text-[var(--school-ink)]">
                                {article.title}
                            </h2>
                            <p className="mt-3 text-sm leading-7 text-[var(--school-muted)]">
                                {article.excerpt}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </>
    );
}
